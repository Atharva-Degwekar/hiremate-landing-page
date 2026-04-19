import { motion } from "framer-motion";
import { Quote, TrendingUp } from "lucide-react";

const stories = [
  {
    name: "Ananya R.",
    role: "Got PM role at a Series B startup",
    quote: "I went from rambling answers to crisp frameworks in 3 weeks. The AI feedback is brutal in the best way.",
    before: 54,
    after: 89,
    color: "from-primary to-accent-orange",
  },
  {
    name: "Rohan M.",
    role: "SDE-2 offer, Bengaluru",
    quote: "Finally understood my weak areas — system design depth and STAR structure. Cracked the loop on the second try.",
    before: 61,
    after: 92,
    color: "from-accent-orange to-primary",
  },
  {
    name: "Priya S.",
    role: "Data Analyst, Tier-3 → Mumbai",
    quote: "I had zero confidence before HireMate. Two weeks in, I was looking forward to interviews.",
    before: 48,
    after: 84,
    color: "from-primary to-success",
  },
];

export function SocialProof() {
  return (
    <section id="reviews" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Real results
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            People are already improving with HireMate
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Confidence, clarity, and offer letters — measured in weeks, not months.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-border bg-white p-6 shadow-card transition-shadow hover:shadow-elegant"
            >
              <Quote size={22} className="text-primary/30" />
              <p className="mt-3 text-sm leading-relaxed text-foreground">"{s.quote}"</p>

              {/* before / after */}
              <div className="mt-5 rounded-xl bg-surface p-3">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Score progression</span>
                  <span className="flex items-center gap-1 text-success">
                    <TrendingUp size={11} /> +{s.after - s.before}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="text-xs font-bold text-muted-foreground tabular-nums w-7">{s.before}</div>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                    <motion.div
                      initial={{ width: `${s.before}%` }}
                      whileInView={{ width: `${s.after}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${s.color}`}
                    />
                  </div>
                  <div className="text-xs font-bold text-foreground tabular-nums w-7">{s.after}</div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${s.color} text-white text-sm font-bold`}>
                  {s.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
