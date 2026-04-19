import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Play, Star, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const questions = [
  "Tell me about a time you led a product launch under tight constraints.",
  "How would you prioritize features for a new payments app in India?",
  "Walk me through how you'd debug a sudden 30% drop in DAU.",
];

export function Hero() {
  const [running, setRunning] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(62);
  const [thinking, setThinking] = useState(false);

  const start = () => {
    setRunning(true);
    setThinking(false);
    setQIndex(0);
    setScore(62);
  };

  useEffect(() => {
    if (!running) return;
    let mounted = true;
    const tick = async () => {
      for (let i = 0; i < questions.length; i++) {
        if (!mounted) return;
        setQIndex(i);
        await new Promise((r) => setTimeout(r, 2800));
        if (!mounted) return;
        setThinking(true);
        await new Promise((r) => setTimeout(r, 900));
        if (!mounted) return;
        setThinking(false);
        setScore((s) => Math.min(96, s + 8 + Math.floor(Math.random() * 5)));
        await new Promise((r) => setTimeout(r, 700));
      }
      if (mounted) setRunning(false);
    };
    tick();
    return () => {
      mounted = false;
    };
  }, [running]);

  return (
    <section className="relative overflow-hidden">
      {/* gradient blobs */}
      <div aria-hidden className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-brand opacity-[0.10] blur-3xl" />
      <div aria-hidden className="absolute top-40 -left-32 h-[360px] w-[360px] rounded-full bg-accent-orange opacity-[0.08] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-medium text-foreground shadow-soft"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-brand text-white">
                <Sparkles size={11} />
              </span>
              AI Interview Coach for Real Jobs
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-[64px] font-extrabold tracking-tight text-foreground leading-[1.05]"
            >
              Stop guessing.<br />
              Start <span className="text-gradient-brand">cracking</span><br />
              interviews.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
            >
              Practice real interview questions, get AI feedback, and know exactly where you stand — before it matters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <a
                href="#waitlist"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-elegant transition-all hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-20px_rgba(231,76,60,0.6)]"
              >
                Start Free Practice
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <button
                onClick={start}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-sm font-semibold text-foreground hover:border-foreground/40 hover:-translate-y-0.5 transition-all shadow-soft"
              >
                <Play size={14} className="fill-foreground text-foreground" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent-orange"
                      style={{ filter: `hue-rotate(${i * 30}deg)` }}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-accent-orange text-accent-orange" />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">Used by 10,000+ candidates</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground/70 tracking-wide">
                <span>GOOGLE</span>
                <span>•</span>
                <span>FLIPKART</span>
                <span>•</span>
                <span>RAZORPAY</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">SWIGGY</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — interactive mock UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-brand opacity-20 blur-2xl rounded-3xl" aria-hidden />
            <div className="relative rounded-3xl border border-border bg-white shadow-elegant overflow-hidden">
              {/* window chrome */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3 bg-surface/60">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-success animate-pulse" : "bg-muted-foreground/40"}`} />
                  {running ? "Live mock interview" : "Ready to start"}
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Question bubble */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-soft">
                    <Sparkles size={15} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">AI Interviewer</div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={qIndex + (running ? "r" : "i")}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="mt-1.5 rounded-2xl rounded-tl-sm bg-surface px-4 py-3 text-sm text-foreground"
                      >
                        {running
                          ? questions[qIndex]
                          : "Click 'Watch Demo' to see HireMate run a live PM interview."}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* User speaking */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 max-w-[78%]">
                    <div className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">You</div>
                    <div className="mt-1.5 ml-auto rounded-2xl rounded-tr-sm bg-foreground px-4 py-3 flex items-center gap-2.5">
                      <Mic size={14} className="text-white shrink-0" />
                      <div className="flex items-end gap-[3px] h-5 flex-1">
                        {[...Array(22)].map((_, i) => (
                          <span
                            key={i}
                            className={`w-[3px] rounded-full bg-white/80 ${running ? "animate-wave" : ""}`}
                            style={{
                              height: `${30 + ((i * 13) % 70)}%`,
                              animationDelay: `${i * 60}ms`,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-medium text-white/80 tabular-nums">0:24</span>
                    </div>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface border border-border text-xs font-bold text-foreground">
                    A
                  </div>
                </div>

                {/* Score panel */}
                <div className="rounded-2xl border border-border bg-gradient-to-br from-surface to-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Live Score
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-success">
                      <CheckCircle2 size={12} />
                      {thinking ? "Analyzing…" : "Improving"}
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <motion.div
                      key={score}
                      initial={{ scale: 0.9, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-extrabold text-foreground tabular-nums"
                    >
                      {score}
                      <span className="text-base font-semibold text-muted-foreground">/100</span>
                    </motion.div>
                    <div className="text-right text-[11px] text-muted-foreground">
                      Top <span className="font-semibold text-foreground">{Math.max(4, 100 - score)}%</span> of candidates
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/60">
                    <motion.div
                      className="h-full rounded-full bg-gradient-brand"
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                    {[
                      { l: "Clarity", v: 88 },
                      { l: "Structure", v: 74 },
                      { l: "Depth", v: 81 },
                    ].map((m) => (
                      <div key={m.l} className="rounded-lg border border-border bg-white px-2 py-1.5">
                        <div className="font-semibold text-foreground tabular-nums">{m.v}</div>
                        <div className="text-muted-foreground">{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating chip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden sm:flex absolute -right-4 top-24 items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2 shadow-elegant animate-float"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 text-success">
                <CheckCircle2 size={14} />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">+18 pts</div>
                <div className="text-muted-foreground">vs last attempt</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
