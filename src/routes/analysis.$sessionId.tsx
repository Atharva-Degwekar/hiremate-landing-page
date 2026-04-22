import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles, Crown, Download, Lock, ArrowLeft, TrendingUp, Award, AlertTriangle,
  Target, Clock, Zap, Loader2, Check, X
} from "lucide-react";
import { generatePdfReport } from "@/lib/pdf-report";
import { toast } from "sonner";

export const Route = createFileRoute("/analysis/$sessionId")({
  component: AnalysisPage,
  head: () => ({
    meta: [
      { title: "Interview Analysis — HireMate" },
      { name: "description", content: "Detailed AI scoring, strengths, weaknesses, and a personalized improvement plan from your mock interview." },
    ],
  }),
});

type SessionFull = {
  id: string;
  role: string;
  difficulty: string;
  status: string;
  overall_score: number | null;
  category_scores: Record<string, number> | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  next_steps: string[] | null;
  benchmark_percentile: number | null;
  filler_count: number | null;
  pace_wpm: number | null;
  duration_seconds: number | null;
  created_at: string;
};

type Turn = {
  question_index: number;
  question: string;
  answer: string | null;
  score: number | null;
  feedback: string | null;
  highlights: { kind: "good" | "improve"; text: string }[] | null;
};

function AnalysisPage() {
  const { sessionId } = Route.useParams();
  const { user, loading, isPremium } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionFull | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [s, t] = await Promise.all([
        supabase.from("interview_sessions").select("*").eq("id", sessionId).single(),
        supabase.from("interview_turns").select("*").eq("session_id", sessionId).order("question_index"),
      ]);
      setSession((s.data as SessionFull) ?? null);
      setTurns(((t.data as Turn[]) ?? []));
      setBusy(false);
    })();
  }, [user, sessionId]);

  const onDownload = () => {
    if (!session) return;
    if (!isPremium) {
      toast.error("PDF export is a premium feature");
      navigate({ to: "/pricing" });
      return;
    }
    generatePdfReport(session, turns, user?.user_metadata?.full_name ?? user?.email ?? "Candidate");
  };

  if (loading || busy || !session) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (session.status !== "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-extrabold">Interview not yet completed</h1>
          <Link to="/dashboard" className="mt-4 inline-flex items-center gap-1.5 text-primary font-semibold">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const score = session.overall_score ?? 0;
  const cats = session.category_scores ?? {};

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90 transition-opacity"
            >
              {isPremium ? <Download size={12} /> : <Lock size={12} />} Download PDF
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-white p-8 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">{session.role}</span>
                <span className="text-xs text-muted-foreground">{new Date(session.created_at).toLocaleString()}</span>
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Your interview analysis</h1>
              <p className="mt-1 text-muted-foreground">AI-graded feedback across {turns.length} questions.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overall</div>
                <div className="mt-1 text-5xl font-extrabold text-gradient-brand tabular-nums">{score}</div>
                <div className="text-xs text-muted-foreground">out of 100</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Benchmark</div>
                <div className="mt-1 text-5xl font-extrabold text-foreground tabular-nums">
                  {session.benchmark_percentile ?? "—"}<span className="text-2xl text-muted-foreground">%</span>
                </div>
                <div className="text-xs text-muted-foreground">percentile</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat icon={Clock} label="Duration" value={`${Math.round((session.duration_seconds ?? 0) / 60)} min`} />
            <Stat icon={Zap} label="Pace" value={`${session.pace_wpm ?? 0} wpm`} />
            <Stat icon={AlertTriangle} label="Filler words" value={`${session.filler_count ?? 0}`} />
            <Stat icon={Award} label="Questions" value={`${turns.length}`} />
          </div>
        </motion.div>

        {/* Category scores */}
        {Object.keys(cats).length > 0 && (
          <div className="rounded-3xl border border-border bg-white p-8 shadow-card">
            <h2 className="text-lg font-extrabold tracking-tight">Category breakdown</h2>
            <div className="mt-5 space-y-4">
              {Object.entries(cats).map(([k, v]) => (
                <div key={k}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold capitalize text-foreground">{k}</span>
                    <span className="font-bold tabular-nums text-foreground">{v}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${v}%` }}
                      transition={{ duration: 0.9 }}
                      className="h-full rounded-full bg-gradient-brand"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths / Weaknesses / Next steps */}
        <div className="grid lg:grid-cols-3 gap-6">
          <ListCard title="Strengths" items={session.strengths ?? []} icon={TrendingUp} color="text-success" bg="bg-success/10" />
          <ListCard title="Weak areas" items={session.weaknesses ?? []} icon={Target} color="text-primary" bg="bg-primary-soft" />
          <ListCard title="Next steps" items={session.next_steps ?? []} icon={Award} color="text-accent-orange" bg="bg-accent-orange/10" />
        </div>

        {/* Premium gate for transcript */}
        <div className="relative rounded-3xl border border-border bg-white shadow-card overflow-hidden">
          <div className="px-8 pt-8 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Per-question transcript & annotations</h2>
              <p className="text-sm text-muted-foreground mt-1">Question-by-question breakdown with AI annotations.</p>
            </div>
            {!isPremium && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-orange/10 px-3 py-1 text-xs font-bold text-accent-orange">
                <Crown size={12} /> Premium
              </span>
            )}
          </div>

          <div className={`px-8 pb-8 space-y-5 relative ${!isPremium ? "max-h-[420px] overflow-hidden" : ""}`}>
            {turns.map((t) => (
              <div key={t.question_index} className="rounded-2xl border border-border bg-surface/40 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold tracking-wider text-muted-foreground">Q{t.question_index + 1}</div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-foreground border border-border">
                    Score {t.score ?? "—"}
                  </span>
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">{t.question}</div>
                {t.answer && <div className="mt-3 text-sm text-muted-foreground italic leading-relaxed">"{t.answer}"</div>}
                {t.feedback && (
                  <div className="mt-3 rounded-xl bg-white border border-border p-3 text-sm text-foreground">
                    <span className="font-bold text-primary">Coach: </span>{t.feedback}
                  </div>
                )}
                {t.highlights && t.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {t.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${h.kind === "good" ? "bg-success/15 text-success" : "bg-primary/10 text-primary"}`}>
                          {h.kind === "good" ? <Check size={10} /> : <X size={10} />}
                        </span>
                        <span className="text-foreground/80">{h.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {!isPremium && (
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/95 to-transparent flex items-end justify-center pb-8">
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-bold text-white shadow-elegant hover:-translate-y-0.5 transition-transform"
                >
                  <Crown size={14} /> Unlock with Premium — 7-day free trial
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <Icon size={11} /> {label}
      </div>
      <div className="mt-1 text-xl font-extrabold text-foreground tabular-nums">{value}</div>
    </div>
  );
}

function ListCard({ title, items, icon: Icon, color, bg }: { title: string; items: string[]; icon: any; color: string; bg: string }) {
  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
      <div className={`inline-flex items-center gap-1.5 rounded-full ${bg} ${color} px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest`}>
        <Icon size={11} /> {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.length === 0 && <li className="text-sm text-muted-foreground">—</li>}
        {items.map((it, i) => (
          <li key={i} className="text-sm text-foreground leading-relaxed">• {it}</li>
        ))}
      </ul>
    </div>
  );
}
