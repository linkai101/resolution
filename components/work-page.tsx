"use client";

import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";
import { Info, X } from "lucide-react";

export interface WorkImageConfig {
  unitSrc: string;
  unitAlt: string;
  workSrc: string;
  workAlt: string;
  // width/height ratio of the full artwork — used to size the display container
  workAspect: number;
  // how many times larger the work image starts (zoomed in on the unit)
  unitScale: number;
  // pixel offset of the work image at scroll=0, to center on the unit's location
  unitX?: number;
  unitY?: number;
}

interface WorkPageProps {
  slug: string;
  details?: ReactNode;
  image: WorkImageConfig;
}

export function WorkPage({ slug, details, image }: WorkPageProps) {
  const { unitSrc, unitAlt, workSrc, workAlt, workAspect, unitScale, unitX = 0, unitY = 0 } = image;
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    damping: 10,
  });

  const progress = useSpring(smoothScrollYProgress, { mass: 0.1, damping: 10 });

  const finalScale = 1.4;
  const scale = useTransform(progress, [0, 1], [unitScale, finalScale]);
  const x = useTransform(progress, [0, 1], [unitX, 0]);
  const y = useTransform(progress, [0, 1], [unitY, 0]);
  const unitOpacity = useTransform(progress, [0, 0.25, 0.5], [1, 1, 0]);
  const workOpacity = useTransform(progress, [0, 0.25], [0.1, 1]);
  // Unit image transforms derived from work transform math.
  // At progress p, the unit area's viewport position is: -p * unitX/Y * finalScale / unitScale
  // and its visual size relative to the work scales by finalScale / unitScale at p=1.
  const unitImageScale = useTransform(progress, [0, 1], [1, finalScale / unitScale]);
  const unitImageX = useTransform(progress, [0, 1], [0, -unitX * finalScale / unitScale]);
  const unitImageY = useTransform(progress, [0, 1], [0, -unitY * finalScale / unitScale]);

  // Placard fades in at the end of the scroll
  const cardOpacity = useTransform(progress, [0.75, 1], [0, 1]);

  const displayW = workAspect >= 1 ? "60vmin" : `${(60 * workAspect).toFixed(2)}vmin`;
  const displayH = workAspect >= 1 ? `${(60 / workAspect).toFixed(2)}vmin` : "60vmin";

  return (
    <main ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <button
          onClick={() => router.push("/?from=works", { scroll: false })}
          className="absolute top-6 left-6 z-10 px-3 py-2 border text-xs font-mono font-medium uppercase tracking-[0.3em] hover:opacity-60 transition-opacity cursor-pointer"
        >
          {"← Back"}
        </button>

        {/* Work image + details button */}
        <motion.div
          className="relative"
          style={{ width: displayW, height: displayH, scale, x, y, opacity: workOpacity }}
        >
          <Image src={workSrc} alt={workAlt} fill sizes="60vmin" className="object-contain select-none pointer-events-none" />

          {/* Details button */}
          {details &&
            <motion.div
              className="absolute left-full bottom-0 ml-4 select-none"
              style={{ opacity: cardOpacity }}
            >
              <motion.button
                className="flex items-center justify-center border border-muted cursor-pointer"
                style={{ width: 30, height: 30 }}
                onClick={() => setModalOpen(true)}
                whileHover={{ opacity: 0.5 }}
                transition={{ opacity: { duration: 0.15 } }}
              >
                <Info size={14} strokeWidth={1.5} className="text-muted" />
              </motion.button>
            </motion.div>
          }
        </motion.div>

        <motion.div className="absolute" style={{ opacity: unitOpacity, scale: unitImageScale, x: unitImageX, y: unitImageY }}>
          <ViewTransition name={`unit-${slug}`} share="unit-morph">
            <div className="relative size-32">
              <Image src={unitSrc} alt={unitAlt} fill sizes="128px" priority className="object-contain select-none pointer-events-none" />
            </div>
          </ViewTransition>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setModalOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Panel */}
            <motion.div
              className="relative bg-background border border-foreground max-w-sm w-full mx-12"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ type: "spring", mass: 0.4, damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
            >
              {details && (
                <motion.div
                  className="px-5 py-6 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  {details}
                </motion.div>
              )}

              {/* Close button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 hover:opacity-50 transition-opacity cursor-pointer shrink-0"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
