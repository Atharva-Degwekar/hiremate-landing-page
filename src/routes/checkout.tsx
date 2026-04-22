import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowLeft, Lock, CreditCard, Shield, Check, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";

type Search = { plan: "pro" | "premium"; cycle: "monthly" | "yearly" };

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    plan: (s.plan === "premium" ? "premium" : "pro"),
    cycle: (s.cycle === "yearly" ? "yearly" : "monthly"),
  }),
  head: () => ({
    meta: [
      { title: "Checkout — HireMate" },
      { name: "description", content: "Start your 7-day free trial. No charge today." },
    ],
  }),
});

const PRICES = {
  pro: { monthly: 499, yearly: 4990 },
  premium: { monthly: 699, yearly: 6990 },
};

function CheckoutPage() {
  const { plan, cycle } = useSearch({ from: "/checkout" }) as Search;
  const { user, loading, refreshSubscription } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const price = PRICES[plan][cycle];

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length < 3) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (card.replace(/\s/g, "").length < 13) {
      toast.error("Please enter a valid card number");
      return;
    }
    setSubmitting(true);

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1400));

    const trialEnd = new Date(Date.now() + 7 * 86400000).toISOString();
    const periodEnd = new Date(Date.now() + (cycle === "yearly" ? 372 : 37) * 86400000).toISOString();
    const last4 = card.replace(/\s/g, "").slice(-4);

    const { error } = await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan,
          status: "trialing",
          trial_ends_at: trialEnd,
          current_period_end: periodEnd,
          card_last4: last4,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      toast.error("Couldn't activate subscription");
      setSubmitting(false);
      return;
    }

    await refreshSubscription();
    setDone(true);
    setSubmitting(false);
    toast.success("Trial started! 7 days free.");
    setTimeout(() => navigate({ to: "/dashboard" }), 1800);
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center rounded-3xl border border-border bg-white p-10 shadow-elegant"
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-success/15 flex items-center justify-center">
            <Check className="text-success" size={32} />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold">Trial activated 🎉</h1>
          <p className="mt-2 text-muted-foreground">7 days free, then ₹{price.toLocaleString("en-IN")}/{cycle === "monthly" ? "mo" : "yr"}.</p>
          <p className="mt-1 text-xs text-muted-foreground">Card ending •••• {card.replace(/\s/g, "").slice(-4)}</p>
          <Loader2 className="animate-spin mx-auto mt-6 text-primary" size={20} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-white">
        <nav className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand text-white">
              <Sparkles size={16} />
            </span>
            <span><span className="text-foreground">Hire</span><span className="text-gradient-brand">Mate</span></span>
          </Link>
          <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Back to pricing
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={submit} className="lg:col-span-3 rounded-3xl border border-border bg-white p-8 shadow-card">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-success/10 text-success px-3 py-1 text-xs font-bold">
            <Lock size={11} /> Secure checkout (simulated)
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Start your 7-day free trial</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No charge today. We'll email you 2 days before your trial ends.
          </p>

          <div className="mt-7 space-y-4">
            <Field label="Cardholder name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As written on card"
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </Field>
            <Field label="Card number">
              <div className="relative">
                <input
                  required
                  inputMode="numeric"
                  value={card}
                  onChange={(e) => setCard(formatCard(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry (MM/YY)">
                <input
                  required
                  inputMode="numeric"
                  value={exp}
                  onChange={(e) => setExp(formatExp(e.target.value))}
                  placeholder="08/27"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </Field>
              <Field label="CVC">
                <input
                  required
                  inputMode="numeric"
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
                  placeholder="123"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </Field>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : <>Start 7-day free trial</>}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <Shield size={11} /> This is a demo checkout. No real payment is charged.
          </div>
        </form>

        {/* Summary */}
        <aside className="lg:col-span-2">
          <div className="rounded-3xl border border-border bg-white p-7 shadow-card sticky top-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft text-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <Crown size={11} /> {plan}
            </div>
            <div className="mt-3 text-sm text-muted-foreground">7-day free trial</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tabular-nums text-foreground">₹0</span>
              <span className="text-sm text-muted-foreground">today</span>
            </div>

            <div className="mt-5 space-y-2.5 text-sm">
              <Row label="Trial period" value="7 days" />
              <Row label={`After trial (${cycle})`} value={`₹${price.toLocaleString("en-IN")}`} />
              <Row label="Billed today" value="₹0.00" highlight />
            </div>

            <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
              {[
                "Unlimited mock interviews",
                "Detailed AI feedback on every answer",
                "Per-question transcript & annotations",
                "Downloadable PDF reports",
                plan === "premium" ? "Company-specific prep & roadmap" : "Benchmark scoring",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check size={14} className="mt-0.5 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[11px] text-muted-foreground leading-relaxed">
              Cancel any time before {new Date(Date.now() + 7 * 86400000).toLocaleDateString()} and you won't be charged.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums font-bold ${highlight ? "text-success" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
