import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ROLES, Role } from "@/lib/interview-questions";
import { Sparkles, Play, Crown, ArrowRight, LogOut, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — HireMate" },
      { name: "description", content: "Your interview prep dashboard. Start a new mock interview, review past sessions, and track progress." },
    ],
  }),
});

type SessionRow = {
  id: string;
  role: string;
  overall_score: number | null;
  status: string;
  created_at: string;
};

function Dashboard() {
  const { user, loading, isPremium, subscription, signOut } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [starting, setStarting] = useState<Role | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("interview_sessions")
      .select("id,role,overall_score,status,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setSessions((data ?? []) as SessionRow[]));
  }, [user]);

  const startInterview = async (role: Role) => {
    if (!user) return;
    setStarting(role);
    const { data, error } = await supabase
      .from("interview_sessions")
      .insert({ user_id: user.id, role, status: "in_progress" })
      .select("id")
      .single();
    setStarting(null);
    if (error || !data) {
      toast.error("Couldn't start interview");
      return;
    }
    navigate({ to: "/interview/$sessionId", params: { sessionId: data.id } });
  };

  const trialDaysLeft =
    subscription?.status === "trialing" && subscription.trial_ends_at
      ? Math.max(0, Math.ceil((new Date(subscription.trial_ends_at).getTime() - Date.now()) / 86400000))
      : null;

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand text-white">
              <Sparkles size={16} />
            </span>
            <span><span className="text-foreground">Hire</span><span className="text-gradient-brand">Mate</span></span>
          </Link>
          <div className="flex items-center gap-3">
            {trialDaysLeft !== null && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-accent-orange/10 px-3 py-1 text-xs font-bold text-accent-orange">
                <Crown size={12} /> Trial: {trialDaysLeft}d left
              </span>
            )}
            {!isPremium && (
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-xs font-bold text-white shadow-soft"
              >
                <Crown size={12} /> Upgrade
              </Link>
            )}
            <button
              onClick={signOut}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Welcome back, {user.user_metadata?.full_name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="mt-2 text-muted-foreground">Pick a role to start a fresh mock interview.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {ROLES.map((r, i) => (
            <motion.button
              key={r.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => startInterview(r.value)}
              disabled={starting !== null}
              className="text-left rounded-3xl border border-border bg-white p-6 shadow-card hover:shadow-elegant transition-all disabled:opacity-60"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{r.value}</span>
                {starting === r.value ? <Loader2 size={16} className="animate-spin text-primary" /> : <Play size={16} className="text-primary" />}
              </div>
              <div className="mt-3 text-lg font-extrabold text-foreground">{r.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            </motion.button>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">Recent sessions</h2>
          <div className="mt-4 rounded-3xl border border-border bg-white shadow-card overflow-hidden">
            {sessions.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No sessions yet. Start your first mock above ↑
              </div>
            ) : (
              sessions.map((s, i) => (
                <Link
                  key={s.id}
                  to="/analysis/$sessionId"
                  params={{ sessionId: s.id }}
                  className={`flex items-center justify-between px-6 py-4 hover:bg-surface/60 transition-colors ${i ? "border-t border-border" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-bold text-primary">{s.role}</span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {s.status === "completed" ? `Score ${s.overall_score ?? "—"}` : "In progress"}
                      </div>
                      <div className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <FileText size={12} /> View analysis <ArrowRight size={12} />
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
