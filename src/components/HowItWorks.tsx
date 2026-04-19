const steps = [
  { n: "01", title: "Pick Your Role", desc: "Choose from PM, SWE, Data Science, and more — we tailor everything to your target." },
  { n: "02", title: "Take a Mock Interview", desc: "AI asks real interview questions and listens to your answers in a natural, pressure-free environment." },
  { n: "03", title: "Get Instant Feedback", desc: "Receive detailed scoring, strengths, weaknesses, and a benchmark against other candidates." },
  { n: "04", title: "Follow Your Growth Plan", desc: "A personalized roadmap shows exactly what to work on next so every session moves you forward." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            How HireMate works
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            From signup to offer-ready in four simple steps.
          </p>
        </div>

        <div className="mt-20 relative">
          {/* connector line */}
          <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-border" aria-hidden />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-primary">
                  {s.n}
                </div>
                <h3 className="mt-6 text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
