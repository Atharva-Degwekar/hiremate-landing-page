import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Sparkles, Loader2, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { QUESTIONS, Role } from "@/lib/interview-questions";
import { toast } from "sonner";

export const Route = createFileRoute("/interview/$sessionId")({
  component: InterviewRoom,
  head: () => ({
    meta: [
      { title: "Mock Interview — HireMate" },
      { name: "description", content: "Live AI-powered mock interview with real-time feedback." },
    ],
  }),
});

function InterviewRoom() {
  const { sessionId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("PM");
  const [questions, setQuestions] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [turns, setTurns] = useState<{ q: string; a: string; score?: number; feedback?: string }[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  // Load session
  useEffect(() => {
    if (!user) return;
    supabase
      .from("interview_sessions")
      .select("role")
      .eq("id", sessionId)
      .single()
      .then(({ data }) => {
        if (data?.role) {
          const r = data.role as Role;
          setRole(r);
          setQuestions(QUESTIONS[r] ?? QUESTIONS.PM);
        }
      });
  }, [user, sessionId]);

  // Webcam
  useEffect(() => {
    const start = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        // user denied — keep avatar only
      }
    };
    start();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Toggle video track
  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = videoOn));
  }, [videoOn]);
  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !muted));
  }, [muted]);

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  // AI "speaks" the question for 3.5s
  useEffect(() => {
    setIsSpeaking(true);
    const t = setTimeout(() => setIsSpeaking(false), 3500);
    return () => clearTimeout(t);
  }, [qIndex]);

  const submitAnswer = async () => {
    if (!user || !answer.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("score-answer", {
        body: {
          question: questions[qIndex],
          answer,
          role,
          mode: "single",
        },
      });
      if (error) {
        if ((error as any).context?.status === 429) toast.error("AI rate limited. Please wait a moment.");
        else if ((error as any).context?.status === 402) toast.error("AI credits exhausted. Add credits to continue.");
        else toast.error("Couldn't score answer");
        setSubmitting(false);
        return;
      }

      await supabase.from("interview_turns").insert({
        session_id: sessionId,
        user_id: user.id,
        question_index: qIndex,
        question: questions[qIndex],
        answer,
        score: data?.score ?? null,
        feedback: data?.feedback ?? null,
        highlights: data?.highlights ?? null,
      });

      const newTurn = { q: questions[qIndex], a: answer, score: data?.score, feedback: data?.feedback };
      setTurns((t) => [...t, newTurn]);
      setAnswer("");

      if (qIndex + 1 < questions.length) {
        setQIndex(qIndex + 1);
      } else {
        await finishInterview([...turns, newTurn]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const finishInterview = async (allTurns: typeof turns) => {
    setFinishing(true);
    try {
      const { data, error } = await supabase.functions.invoke("score-answer", {
        body: {
          mode: "final",
          role,
          answer: allTurns.map((t) => ({ q: t.q, a: t.a, score: t.score })),
        },
      });
      if (error) {
        toast.error("Couldn't generate final report");
        setFinishing(false);
        return;
      }

      await supabase
        .from("interview_sessions")
        .update({
          status: "completed",
          overall_score: data?.overall_score ?? null,
          category_scores: data?.category_scores ?? null,
          strengths: data?.strengths ?? null,
          weaknesses: data?.weaknesses ?? null,
          next_steps: data?.next_steps ?? null,
          benchmark_percentile: data?.benchmark_percentile ?? null,
          filler_count: data?.filler_count ?? null,
          pace_wpm: data?.pace_wpm ?? null,
          duration_seconds: elapsed,
          completed_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      streamRef.current?.getTracks().forEach((t) => t.stop());
      navigate({ to: "/analysis/$sessionId", params: { sessionId } });
    } finally {
      setFinishing(false);
    }
  };

  const endCall = async () => {
    if (turns.length === 0) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      navigate({ to: "/dashboard" });
      return;
    }
    await finishInterview(turns);
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-extrabold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
            <Sparkles size={14} />
          </span>
          HireMate
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-3 py-1 font-semibold text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /> REC
          </span>
          <span className="font-mono tabular-nums text-white/70">{mm}:{ss}</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold text-white/80">
            {role} • Q{qIndex + 1}/{questions.length}
          </span>
        </div>
      </header>

      {/* Stage */}
      <main className="flex-1 grid lg:grid-cols-3 gap-4 p-4">
        {/* AI tile */}
        <div className="lg:col-span-2 relative rounded-2xl bg-gradient-to-br from-[#1b2231] to-[#0d1117] overflow-hidden flex items-center justify-center min-h-[340px]">
          <div className="absolute top-3 left-3 text-xs font-bold tracking-wider text-white/60">AI INTERVIEWER</div>

          <div className="relative">
            <motion.div
              animate={isSpeaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 1.5, repeat: isSpeaking ? Infinity : 0 }}
              className="h-40 w-40 rounded-full bg-gradient-brand flex items-center justify-center shadow-2xl"
            >
              <Sparkles size={56} className="text-white" />
            </motion.div>
            {isSpeaking && (
              <div className="mt-6 flex items-end justify-center gap-1 h-10">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ scaleY: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 }}
                    className="w-1.5 h-8 bg-white/70 rounded-full origin-bottom"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Question caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-6 left-6 right-6 rounded-xl bg-black/50 backdrop-blur p-4 border border-white/10"
            >
              <div className="text-[10px] font-bold tracking-widest text-white/50">QUESTION {qIndex + 1}</div>
              <div className="mt-1 text-base sm:text-lg font-semibold leading-snug">{questions[qIndex]}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right column: webcam + answer */}
        <div className="flex flex-col gap-4">
          <div className="relative rounded-2xl bg-black overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${videoOn ? "" : "hidden"}`}
            />
            {!videoOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1b2231]">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl">
                  {user?.email?.[0]?.toUpperCase() ?? "U"}
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-[10px] rounded bg-black/60 px-2 py-0.5">You</div>
          </div>

          <div className="flex-1 rounded-2xl bg-[#1b2231] p-4 flex flex-col">
            <div className="text-[10px] font-bold tracking-widest text-white/50">YOUR ANSWER</div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or speak your answer here…"
              disabled={submitting || finishing}
              className="mt-2 flex-1 min-h-[120px] resize-none rounded-xl bg-black/30 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={submitAnswer}
              disabled={!answer.trim() || submitting || finishing}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-bold disabled:opacity-50"
            >
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Scoring…</> : <>Submit & next <ChevronRight size={14} /></>}
            </button>
          </div>
        </div>
      </main>

      {/* Call controls */}
      <footer className="flex items-center justify-center gap-3 py-5 border-t border-white/10">
        <button
          onClick={() => setMuted((m) => !m)}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${muted ? "bg-red-500" : "bg-white/10 hover:bg-white/15"}`}
          aria-label="Toggle mic"
        >
          {muted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button
          onClick={() => setVideoOn((v) => !v)}
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${!videoOn ? "bg-red-500" : "bg-white/10 hover:bg-white/15"}`}
          aria-label="Toggle camera"
        >
          {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>
        <button
          onClick={endCall}
          disabled={finishing}
          className="h-12 px-6 rounded-full bg-red-600 hover:bg-red-700 flex items-center gap-2 font-semibold text-sm transition-colors disabled:opacity-60"
        >
          {finishing ? <Loader2 size={16} className="animate-spin" /> : <PhoneOff size={16} />}
          {finishing ? "Generating report…" : "End interview"}
        </button>
      </footer>
    </div>
  );
}
