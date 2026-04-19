import { useState, type FormEvent } from "react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section id="waitlist" className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          Be first to transform how you prepare
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Join 2,000+ candidates already on the waitlist. Early access opens soon.
        </p>

        {submitted ? (
          <div className="mt-10 inline-flex items-center rounded-full border border-primary/30 bg-primary-soft px-6 py-3 text-sm font-medium text-primary">
            ✓ You're on the list. We'll be in touch soon.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 mx-auto flex flex-col sm:flex-row gap-3 max-w-lg"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-0.5"
            >
              Join Waitlist
            </button>
          </form>
        )}

        <p className="mt-5 text-xs text-muted-foreground">
          No spam. No credit card. Just better interviews.
        </p>
      </div>
    </section>
  );
}
