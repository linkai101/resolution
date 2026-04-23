"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { ChevronDown } from "lucide-react";

export function ScrollHint({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none z-10"
      style={{ opacity }}
    >
      <span className="text-xs font-mono font-medium uppercase tracking-[0.3em] text-muted">scroll</span>
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={14} strokeWidth={1.5} className="text-muted" />
      </motion.div>
    </motion.div>
  );
}
