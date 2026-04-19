import { motion } from "framer-motion";
import { Target, Mic, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  { n: "01", icon: Target, title: "Choose Role", desc: "PM, SWE, Data, Analyst — pick your target and seniority." },
  { n: "02", icon: Mic, title: "Start Interview", desc: "AI runs a real, voice-led mock with adaptive follow-ups." },
  { n: "03", icon: Sparkles, title: "Get Feedback", desc: "Score, strengths, gaps, and benchmark — in under 30 seconds." },
  { n: "04", icon: TrendingUp, title: "Improve Fast", desc: "Personalized roadmap shows exactly what to drill next." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" />
            How it works
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            From signup to <span className="text-gradient-brand">offer-ready</span> in 4 steps
          </h2>
        </div>

        <div className="mt-16 relative">
          {/* animated connector */}
          <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-px bg-border" aria-hidden>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              style={{ transformOrigin: "left" }}
              className="h-px bg-gradient-brand"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 relative">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative group"
              >
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border shadow-card group-hover:border-primary/40 transition-colors">
                  <s.icon size={20} className="text-primary" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white shadow-soft">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
