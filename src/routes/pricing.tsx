import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowLeft, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Cycle = "monthly" | "yearly";
type PlanId = "free" | "pro" | "premium";

const tiers: {
  id: PlanId;
  name: string;
  price: { monthly: number; yearly: number };
  desc: string;
  features: string[];
  cta: string;
  variant: "outline" | "featured" | "filled";
  badge?: string;
}[] = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    desc: "Get started and see the difference.",
    features: ["5 mock interviews per month", "Basic AI feedback", "Limited role selection"],
    cta: "Current plan",
    variant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 499, yearly: 4990 },
    desc: "For serious job seekers who want an edge.",
    features: ["Unlimited mock interviews", "Role-specific practice", "Detailed AI feedback", "Benchmark scoring"],
    cta: "Start 7-day free trial",
    variant: "featured",
    badge: "Recommended",
  },
  {
    id: "premium",
    name: "Premium",
    price: { monthly: 699, yearly: 6990 },
    desc: "For career switchers and ambitious candidates.",
    features: ["Everything in Pro", "Personalized improvement plan", "Growth roadmap & tracking", "Company-specific prep", "Downloadable PDF reports", "Priority support"],
    cta: "Start 7-day free trial",
    variant: "filled",
  },
];

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — HireMate" },
      { name: "description", content: "Start free, upgrade when you're ready. 7-day free trial on all paid plans. Pro from ₹499/mo." },
      { property: "og:title", content: "Pricing — HireMate" },
      { property: "og:description", content: "Simple, transparent pricing with 7-day free trial." },
    ],
  }),
});

function PricingPage() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const navigate = useNavigate();
  const { user } = useAuth();

  const choose = (id: PlanId) => {
    if (id === "free") return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    navigate({ to: "/checkout", search: { plan: id, cycle } as any });
  };

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
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Back home
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <Crown size={12} className="text-primary" /> 7-day free trial • No credit card today
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Simple, transparent <span className="text-gradient-brand">pricing</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Start free, upgrade when you're ready. Cancel any time during your trial.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-white p-1 shadow-soft">
            {(["monthly", "yearly"] as Cycle[]).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  cycle === c ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cycle === c && (
                  <motion.span
                    layoutId="cycle-pill-page"
                    className="absolute inset-0 rounded-full bg-gradient-brand"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative capitalize">{c}</span>
                {c === "yearly" && (
                  <span className={`relative ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${cycle === c ? "bg-white/20 text-white" : "bg-success/10 text-success"}`}>
                    -17%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((t, i) => {
            const featured = t.variant === "featured";
            const price = t.price[cycle];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-3xl border p-8 transition-shadow ${
                  featured
                    ? "border-transparent bg-gradient-to-br from-primary to-accent-orange text-white shadow-elegant"
                    : "border-border bg-white shadow-card hover:shadow-elegant"
                }`}
              >
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-background shadow-soft">
                    {t.badge}
                  </div>
                )}
                <h3 className={`text-sm font-bold uppercase tracking-wider ${featured ? "text-white/85" : "text-muted-foreground"}`}>
                  {t.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tabular-nums">₹{price.toLocaleString("en-IN")}</span>
                  <span className={`text-sm ${featured ? "text-white/85" : "text-muted-foreground"}`}>
                    /{cycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                {cycle === "yearly" && price > 0 && (
                  <div className={`mt-1 text-xs ${featured ? "text-white/80" : "text-success"} font-semibold`}>
                    Save ₹{(t.price.monthly * 12 - t.price.yearly).toLocaleString("en-IN")} / year
                  </div>
                )}
                <p className={`mt-3 text-sm ${featured ? "text-white/90" : "text-muted-foreground"}`}>{t.desc}</p>

                <ul className="mt-7 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className={`mt-0.5 shrink-0 ${featured ? "text-white" : "text-primary"}`} />
                      <span className={featured ? "text-white/95" : "text-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => choose(t.id)}
                  disabled={t.id === "free"}
                  className={`mt-8 block w-full text-center rounded-full px-5 py-3 text-sm font-bold transition-all ${t.id !== "free" ? "hover:-translate-y-0.5" : "opacity-70 cursor-default"} ${
                    t.variant === "outline"
                      ? "border border-foreground/20 text-foreground"
                      : t.variant === "featured"
                      ? "bg-white text-primary hover:bg-white/95 shadow-soft"
                      : "bg-gradient-brand text-white shadow-soft"
                  }`}
                >
                  {t.cta}
                </button>
                {t.id !== "free" && (
                  <p className={`mt-3 text-center text-[11px] ${featured ? "text-white/80" : "text-muted-foreground"}`}>
                    Free for 7 days, then ₹{price.toLocaleString("en-IN")}/{cycle === "monthly" ? "mo" : "yr"}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
