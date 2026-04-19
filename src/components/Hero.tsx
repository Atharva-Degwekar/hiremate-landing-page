import { Mic, Sparkles, BarChart3, Map, ArrowRight } from "lucide-react";

const highlights = [
  { icon: Sparkles, title: "AI Mock Interviews", desc: "Role-specific questions" },
  { icon: BarChart3, title: "Benchmark Scoring", desc: "See where you rank" },
  { icon: Map, title: "Growth Roadmap", desc: "Personalized improvement" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Mic size={14} className="text-primary" />
          AI-Powered Mock Interviews
        </div>

        <h1 className="mt-8 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
          Know exactly where<br />
          you stand before<br />
          your next interview
        </h1>

        <p className="mt-8 mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Practice with AI that gives you real, role-specific feedback — so you walk in confident, not guessing.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#waitlist"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-0.5"
          >
            Join the Waitlist
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center rounded-full border border-foreground/20 bg-transparent px-7 py-3.5 text-sm font-semibold text-foreground hover:border-foreground hover:bg-foreground/5 transition-all"
          >
            See How It Works
          </a>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="flex items-center gap-3 rounded-xl border border-border bg-white px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft">
                <h.icon size={18} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{h.title}</div>
                <div className="text-xs text-muted-foreground">{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
