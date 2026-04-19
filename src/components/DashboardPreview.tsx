import { motion } from "framer-motion";
import { TrendingUp, Target, AlertTriangle, Award } from "lucide-react";

const weakAreas = [
  { label: "System design depth", value: 58 },
  { label: "Quantifying impact", value: 64 },
  { label: "STAR structure", value: 72 },
];

const sessions = [
  { d: "Mon", v: 52 },
  { d: "Tue", v: 58 },
  { d: "Wed", v: 61 },
  { d: "Thu", v: 70 },
  { d: "Fri", v: 74 },
  { d: "Sat", v: 81 },
  { d: "Sun", v: 87 },
];

export function DashboardPreview() {
  const max = Math.max(...sessions.map((s) => s.v));

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Your dashboard
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              See your growth, <span className="text-gradient-brand">session by session</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              A live dashboard tracks every score, surfaces weak areas, and shows what to drill next — so progress is never a vibe, it's a number.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                { i: TrendingUp, t: "Track score progression across sessions" },
                { i: Target, t: "See weak areas ranked by impact on hire-rate" },
                { i: Award, t: "Hit milestones that match real interview readiness" },
              ].map((x) => (
                <li key={x.t} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <x.i size={15} />
                  </span>
                  {x.t}
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard mock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-brand opacity-10 blur-2xl rounded-3xl" />
            <div className="relative rounded-3xl border border-border bg-white p-6 shadow-elegant space-y-5">
              {/* header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Overall readiness</div>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-foreground">87</span>
                    <span className="mb-1 flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">
                      <TrendingUp size={11} /> +35 this week
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-muted-foreground">Top</div>
                  <div className="text-lg font-extrabold text-gradient-brand">8%</div>
                </div>
              </div>

              {/* chart */}
              <div className="rounded-2xl bg-surface p-4">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Last 7 sessions</span>
                  <span>Score</span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-2 h-32">
                  {sessions.map((s, i) => (
                    <div key={s.d} className="flex flex-1 flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${(s.v / max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                        className={`w-full rounded-md ${
                          i === sessions.length - 1
                            ? "bg-gradient-brand"
                            : "bg-foreground/15"
                        }`}
                      />
                      <span className="text-[10px] font-medium text-muted-foreground">{s.d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* weak areas */}
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  <AlertTriangle size={12} className="text-accent-orange" />
                  Focus next
                </div>
                <div className="mt-3 space-y-3">
                  {weakAreas.map((w, i) => (
                    <div key={w.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{w.label}</span>
                        <span className="font-bold text-foreground tabular-nums">{w.value}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${w.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                          className="h-full rounded-full bg-gradient-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
