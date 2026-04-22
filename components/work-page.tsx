"use client";

import { useState, useRef, useLayoutEffect } from "react";
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
  // Position of the unit center on the work image, as 0–1 fractions of the
  // work's displayed width/height (0.5 = center). Intrinsic to the artwork,
  // independent of viewport size.
  unitCx: number;
  unitCy: number;
  // Size of the unit region as a fraction (0–1) of the work's displayed width.
  // Intrinsic to the artwork.
  unitFraction: number;
}

interface WorkPageProps {
  slug: string;
  details?: ReactNode;
  image: WorkImageConfig;
}

// Size (in px) at which the unit thumbnail is rendered. Must stay in sync with
// the `size-32` used on the home page so the View Transition morph is seamless.
const UNIT_PX = 128;
const FINAL_SCALE = 1.4;

export function WorkPage({ slug, details, image }: WorkPageProps) {
  const { unitSrc, unitAlt, workSrc, workAlt, workAspect, unitCx, unitCy, unitFraction } = image;
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const [workSize, setWorkSize] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    damping: 10,
  });
  const progress = useSpring(smoothScrollYProgress, { mass: 0.1, damping: 10 });

  // Measure the work container's actual rendered pixel size so transforms can
  // be computed in the same coordinate system as the fixed-size unit image.
  useLayoutEffect(() => {
    const el = workRef.current;
    if (!el) return;
    const update = () => setWorkSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Derived from measurements: scale the work so a `unitFraction`-sized region
  // of it renders at exactly UNIT_PX on screen — matching the unit thumbnail.
  const safeWidth = workSize.width || 1;
  const safeHeight = workSize.height || 1;
  const unitScale = UNIT_PX / (unitFraction * safeWidth);
  // Pixel translation that brings the unit spot to the viewport center when the
  // work is zoomed by `unitScale` (with default center transform-origin).
  const unitX = -unitScale * (unitCx - 0.5) * safeWidth;
  const unitY = -unitScale * (unitCy - 0.5) * safeHeight;

  const scale = useTransform(progress, [0, 1], [unitScale, FINAL_SCALE]);
  const x = useTransform(progress, [0, 1], [unitX, 0]);
  const y = useTransform(progress, [0, 1], [unitY, 0]);
  const unitOpacity = useTransform(progress, [0, 0.25, 0.5], [1, 1, 0]);
  const workOpacity = useTransform(progress, [0, 0.25], [0.1, 1]);
  // Unit image transforms: keep it glued to the unit region of the work across
  // the entire scroll. At p=1 the work has scale FINAL_SCALE and no offset, so
  // the unit region sits at -unitX * (FINAL_SCALE / unitScale) from center.
  const ratio = FINAL_SCALE / unitScale;
  const unitImageScale = useTransform(progress, [0, 1], [1, ratio]);
  const unitImageX = useTransform(progress, [0, 1], [0, -unitX * ratio]);
  const unitImageY = useTransform(progress, [0, 1], [0, -unitY * ratio]);

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
          ref={workRef}
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
