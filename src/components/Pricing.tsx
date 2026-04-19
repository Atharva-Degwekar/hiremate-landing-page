import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "₹0",
    period: "/forever",
    desc: "Get started and see the difference.",
    features: ["5 mock interviews per month", "Basic AI feedback", "Limited role selection"],
    cta: "Start Free",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    desc: "For serious job seekers who want an edge.",
    features: ["Unlimited mock interviews", "Role-specific practice", "Detailed AI feedback", "Benchmark scoring"],
    cta: "Get Pro",
    variant: "featured" as const,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "₹699",
    period: "/month",
    desc: "Full support for career switchers and ambitious candidates.",
    features: ["Everything in Pro", "Personalized improvement plan", "Growth roadmap & tracking", "Company-specific prep", "Priority support"],
    cta: "Go Premium",
    variant: "filled" as const,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Start free, upgrade when you're ready. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((t) => {
            const featured = t.variant === "featured";
            return (
              <div
                key={t.name}
                className={`relative rounded-2xl border p-8 transition-all hover:-translate-y-1 ${
                  featured
                    ? "bg-primary border-primary text-primary-foreground shadow-[0_20px_40px_-20px_rgba(192,57,43,0.5)]"
                    : "bg-white border-border hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.1)]"
                }`}
              >
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-background">
                    {t.badge}
                  </div>
                )}
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {t.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{t.price}</span>
                  <span className={`text-sm ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.period}</span>
                </div>
                <p className={`mt-3 text-sm ${featured ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                  {t.desc}
                </p>

                <ul className="mt-7 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={16} className={`mt-0.5 shrink-0 ${featured ? "text-primary-foreground" : "text-primary"}`} />
                      <span className={featured ? "text-primary-foreground/95" : "text-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#waitlist"
                  className={`mt-8 block w-full text-center rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                    t.variant === "outline"
                      ? "border border-foreground/20 text-foreground hover:bg-foreground/5"
                      : t.variant === "featured"
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {t.cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
