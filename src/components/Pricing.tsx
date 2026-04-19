import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

type Cycle = "monthly" | "yearly";

const tiers = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    desc: "Get started and see the difference.",
    features: ["5 mock interviews per month", "Basic AI feedback", "Limited role selection"],
    cta: "Start Free",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: { monthly: 499, yearly: 4990 },
    desc: "For serious job seekers who want an edge.",
    features: ["Unlimited mock interviews", "Role-specific practice", "Detailed AI feedback", "Benchmark scoring"],
    cta: "Get Pro",
    variant: "featured" as const,
    badge: "Recommended",
  },
  {
    name: "Premium",
    price: { monthly: 699, yearly: 6990 },
    desc: "For career switchers and ambitious candidates.",
    features: ["Everything in Pro", "Personalized improvement plan", "Growth roadmap & tracking", "Company-specific prep", "Priority support"],
    cta: "Go Premium",
    variant: "filled" as const,
  },
];

const compareRows = [
  { f: "Mock interviews / month", v: ["5", "Unlimited", "Unlimited"] },
  { f: "AI feedback depth", v: ["Basic", "Detailed", "Detailed + coach notes"] },
  { f: "Benchmark scoring", v: ["—", "✓", "✓"] },
  { f: "Personalized roadmap", v: ["—", "—", "✓"] },
  { f: "Company-specific prep", v: ["—", "—", "✓"] },
  { f: "Priority support", v: ["—", "—", "✓"] },
];

export function Pricing() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles size={12} className="text-primary" /> Pricing
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Simple, transparent <span className="text-gradient-brand">pricing</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Start free, upgrade when you're ready. No hidden fees.
          </p>

          {/* toggle */}
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
                    layoutId="cycle-pill"
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
                key={t.name}
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
                <p className={`mt-3 text-sm ${featured ? "text-white/90" : "text-muted-foreground"}`}>
                  {t.desc}
                </p>

                <ul className="mt-7 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className={`mt-0.5 shrink-0 ${featured ? "text-white" : "text-primary"}`} />
                      <span className={featured ? "text-white/95" : "text-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#waitlist"
                  className={`mt-8 block w-full text-center rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${
                    t.variant === "outline"
                      ? "border border-foreground/20 text-foreground hover:bg-foreground hover:text-background"
                      : t.variant === "featured"
                      ? "bg-white text-primary hover:bg-white/95 shadow-soft"
                      : "bg-gradient-brand text-white shadow-soft"
                  }`}
                >
                  {t.cta}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* comparison */}
        <div className="mt-16 max-w-5xl mx-auto rounded-3xl border border-border bg-white shadow-card overflow-hidden">
          <div className="grid grid-cols-4 px-6 py-4 border-b border-border bg-surface/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <div>Compare plans</div>
            <div className="text-center">Free</div>
            <div className="text-center text-primary">Pro</div>
            <div className="text-center">Premium</div>
          </div>
          {compareRows.map((r, i) => (
            <div key={r.f} className={`grid grid-cols-4 px-6 py-3.5 text-sm ${i % 2 ? "bg-surface/30" : ""}`}>
              <div className="text-foreground font-medium">{r.f}</div>
              {r.v.map((cell, j) => (
                <div key={j} className={`text-center ${j === 1 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
