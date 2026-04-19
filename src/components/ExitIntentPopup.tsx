import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onLeave = (e: MouseEvent) => {
      if (shown) return;
      if (e.clientY < 8) {
        setOpen(true);
        setShown(true);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [shown]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setTimeout(() => setOpen(false), 1600);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-elegant"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface transition-colors"
            >
              <X size={16} />
            </button>

            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles size={11} /> Wait — one thing
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-foreground leading-tight">
              Take one free interview before you go.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              See your real score in under 5 minutes. No card. No spam.
            </p>

            {done ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-semibold text-success">
                <CheckCircle2 size={15} /> Sent! Check your inbox.
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full border border-border bg-white px-5 py-3 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-5 py-3 text-sm font-bold text-white shadow-elegant transition-transform hover:-translate-y-0.5"
                >
                  Send my free interview
                  <ArrowRight size={15} />
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
