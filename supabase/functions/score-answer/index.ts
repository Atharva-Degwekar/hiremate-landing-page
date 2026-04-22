// Edge function: scores an interview answer using Lovable AI Gateway
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, answer, role, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

    const isFinal = mode === "final";

    const systemPrompt = isFinal
      ? `You are a senior interview coach for ${role} roles in India. You will analyze the full interview transcript and produce structured feedback with strict scoring (0-100).`
      : `You are a senior interview coach for ${role} roles. Score this single answer 0-100 with concise feedback.`;

    const userPrompt = isFinal
      ? `Full interview Q&A JSON:\n${JSON.stringify(answer)}\n\nReturn structured analysis.`
      : `Question: ${question}\n\nCandidate answer: ${answer}\n\nScore 0-100 and give 1-2 sentence feedback plus 2 highlights (good or improvement).`;

    const tools = isFinal
      ? [{
          type: "function",
          function: {
            name: "final_report",
            description: "Final interview analysis",
            parameters: {
              type: "object",
              properties: {
                overall_score: { type: "number" },
                category_scores: {
                  type: "object",
                  properties: {
                    clarity: { type: "number" },
                    structure: { type: "number" },
                    impact: { type: "number" },
                    confidence: { type: "number" },
                    technical: { type: "number" },
                  },
                  required: ["clarity", "structure", "impact", "confidence", "technical"],
                },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                next_steps: { type: "array", items: { type: "string" } },
                benchmark_percentile: { type: "number" },
                filler_count: { type: "number" },
                pace_wpm: { type: "number" },
              },
              required: ["overall_score", "category_scores", "strengths", "weaknesses", "next_steps", "benchmark_percentile", "filler_count", "pace_wpm"],
            },
          },
        }]
      : [{
          type: "function",
          function: {
            name: "score_answer",
            description: "Score a single answer",
            parameters: {
              type: "object",
              properties: {
                score: { type: "number" },
                feedback: { type: "string" },
                highlights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      kind: { type: "string", enum: ["good", "improve"] },
                      text: { type: "string" },
                    },
                    required: ["kind", "text"],
                  },
                },
              },
              required: ["score", "feedback", "highlights"],
            },
          },
        }];

    const toolName = isFinal ? "final_report" : "score_answer";

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: toolName } },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = args ? JSON.parse(args) : {};

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("score-answer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
