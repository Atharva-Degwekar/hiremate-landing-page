import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LiveCounter() {
  const [count, setCount] = useState(247);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1800);
    const id = setInterval(() => {
      setCount((c) => Math.max(180, Math.min(420, c + (Math.floor(Math.random() * 7) - 3))));
    }, 2400);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hidden lg:flex fixed bottom-6 left-6 z-40 items-center gap-3 rounded-full border border-border bg-white/90 backdrop-blur px-4 py-2.5 shadow-elegant"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
      </span>
      <div className="text-xs">
        <span className="font-bold text-foreground tabular-nums">{count}</span>
        <span className="text-muted-foreground"> people practicing right now</span>
      </div>
    </motion.div>
  );
}
