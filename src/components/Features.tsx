import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Mic2, BarChart3, AlertCircle, Building2, Waves, Plus } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Feedback Engine",
    desc: "Detailed, role-aligned feedback — not generic 'be more confident' tips.",
    detail: "We score clarity, structure, depth, and impact on every answer using a rubric tuned to Indian hiring standards.",
  },
  {
    icon: Mic2,
    title: "Real Interview Simulation",
    desc: "Pressure-free practice that feels exactly like the real loop.",
    detail: "Voice-driven, adaptive question flow that follows up on your weak spots — just like a real interviewer would.",
  },
  {
    icon: BarChart3,
    title: "Benchmark Score",
    desc: "See how you stack up against thousands of candidates.",
    detail: "Percentile rank against peers targeting the same role and seniority. Know your gap, not just your number.",
  },
  {
    icon: AlertCircle,
    title: "Weakness Detection",
    desc: "We pinpoint exactly what's holding you back.",
    detail: "Pattern recognition across sessions surfaces recurring gaps — vague metrics, missing tradeoffs, weak STAR.",
  },
  {
    icon: Building2,
    title: "Company Prep Mode",
    desc: "Curated question banks for FAANG, top startups, and PSUs.",
    detail: "Real questions from Google, Razorpay, Flipkart, Swiggy and more — refreshed by candidates every week.",
  },
  {
    icon: Waves,
    title: "Voice Analysis",
    desc: "Pace, filler words, confidence — measured and coached.",
    detail: "Hear yourself the way an interviewer hears you. Reduce 'umms', tighten pace, and project conviction.",
    badge: "NEW",
  },
];

export function Features() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 lg:py-32 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Built for outcomes
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Everything you need to <span className="text-gradient-brand">interview with confidence</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            From practice to performance — HireMate bridges the gap between "I practiced" and "I'm ready."
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.button
                key={f.title}
                onClick={() => setOpen(isOpen ? null : i)}
                onMouseEnter={() => setOpen(i)}
                onMouseLeave={() => setOpen(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
                className="group text-left relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="flex items-start justify-between">
                  <motion.div
                    animate={isOpen ? { rotate: -8, scale: 1.05 } : { rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-soft"
                  >
                    <f.icon size={20} />
                  </motion.div>
                  {f.badge && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-success">
                      {f.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>

                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 border-t border-border pt-3 text-sm text-foreground/80 leading-relaxed">
                    {f.detail}
                  </p>
                </motion.div>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                  <Plus size={12} className={`transition-transform ${isOpen ? "rotate-45" : ""}`} />
                  {isOpen ? "Less" : "More"}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
