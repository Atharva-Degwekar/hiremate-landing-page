import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <section id="waitlist" className="py-24 lg:py-32 bg-surface/40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles size={12} className="text-primary" /> Get instant access
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          Get your first AI interview <span className="text-gradient-brand">instantly</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Join 2,000+ candidates already practicing. Early access opens this week.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-6 py-3 text-sm font-semibold text-success"
          >
            <CheckCircle2 size={16} /> You're in! We'll send your interview link shortly.
          </motion.div>
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
              className="flex-1 rounded-full border border-border bg-white px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all shadow-soft"
            />
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  Start Practicing
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
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
