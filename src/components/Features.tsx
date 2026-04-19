import { Brain, Target, BarChart3, TrendingUp, Building2, Zap } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Driven Feedback", desc: "Get detailed, actionable feedback aligned with real hiring standards — not generic tips." },
  { icon: Target, title: "Role-Specific Practice", desc: "Questions tailored for PM, SWE, Data Science, and more. Practice what actually matters." },
  { icon: BarChart3, title: "Benchmark Scoring", desc: "See how you compare against peers with percentile scores after every session." },
  { icon: TrendingUp, title: "Growth Roadmap", desc: "A personalized improvement plan that evolves with you, session after session." },
  { icon: Building2, title: "Company-Specific Prep", desc: "Prepare for interviews at specific companies with curated question banks." },
  { icon: Zap, title: "Instant Sessions", desc: "No scheduling hassle. Start a mock interview anytime, anywhere — in under 30 seconds." },
];

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Everything you need to interview with confidence
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            From practice to performance — HireMate bridges the gap between "I practiced" and "I'm ready."
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.1)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft">
                <f.icon size={20} className="text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
