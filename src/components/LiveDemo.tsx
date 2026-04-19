import { motion } from "framer-motion";
import { Sparkles, ArrowRight, X, Check } from "lucide-react";

export function LiveDemo() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles size={12} className="text-primary" /> Live experience
          </div>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            See how your interview <span className="text-gradient-brand">improves instantly</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            One question. Two answers. The same candidate — after a single coaching session.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-2 gap-6 items-stretch">
          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-white p-7 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Before</div>
              <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                Score 54
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-surface p-4 text-sm text-muted-foreground italic leading-relaxed">
              "Umm, so basically I worked on this app and we wanted to make it better, so we added some features and users liked it, I think it was a good launch overall…"
            </div>
            <ul className="mt-5 space-y-2.5">
              {[
                "Vague — no metrics or scope",
                "Filler words ('umm', 'basically')",
                "No structure (situation → impact)",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <X size={11} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-white to-primary-soft p-7 shadow-elegant"
          >
            <div className="absolute -top-3 right-7 rounded-full bg-gradient-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-soft">
              After 1 session
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-widest text-primary">After</div>
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.6 }}
                className="flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success"
              >
                Score 87 <span className="text-[10px]">↑ +33</span>
              </motion.div>
            </div>
            <div className="mt-4 rounded-xl bg-white p-4 text-sm text-foreground leading-relaxed">
              "I led a checkout redesign affecting 2M MAUs. Cart-drop was 38%; we hypothesized friction in address entry, ran 3 A/B tests over 6 weeks, and shipped the winner — drop fell to 24%, adding ₹1.4Cr in monthly GMV."
            </div>
            <ul className="mt-5 space-y-2.5">
              {[
                "Quantified impact and scope",
                "Clear STAR structure",
                "Confident, on-pace delivery",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                    <Check size={11} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-elegant transition-all hover:-translate-y-0.5"
          >
            Try a live session free
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
