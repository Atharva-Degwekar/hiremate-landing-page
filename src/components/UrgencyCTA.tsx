import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

function nextSundayMidnight() {
  const d = new Date();
  const day = d.getDay();
  const daysUntil = (7 - day) % 7 || 7;
  const target = new Date(d);
  target.setDate(d.getDate() + daysUntil);
  target.setHours(0, 0, 0, 0);
  return target.getTime();
}

export function UrgencyCTA() {
  const [target] = useState(() => nextSundayMidnight());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const cells = [
    { l: "Days", v: days },
    { l: "Hours", v: hours },
    { l: "Mins", v: mins },
    { l: "Secs", v: secs },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 lg:p-16 text-center shadow-elegant">
          {/* decorative */}
          <div className="absolute inset-0 opacity-20" aria-hidden>
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-foreground blur-3xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <Clock size={12} /> Early access closing
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
            >
              Interviews are coming. Are you ready?
            </motion.h2>
            <p className="mt-4 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
              Lock in early access pricing before this week's cohort closes.
            </p>

            <div className="mt-8 flex justify-center gap-3 sm:gap-4">
              {cells.map((c) => (
                <div key={c.l} className="rounded-2xl bg-white/15 backdrop-blur border border-white/20 px-4 py-3 min-w-[68px] sm:min-w-[88px]">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                    {String(c.v).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/80">{c.l}</div>
                </div>
              ))}
            </div>

            <a
              href="#waitlist"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-soft transition-all hover:-translate-y-0.5"
            >
              Claim Your Spot
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
