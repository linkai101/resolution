"use client";

import { useRef } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

interface WorkPageProps {
  slug: string;
  unitImage: string;
  unitAlt: string;
  workImage: string;
  workAlt: string;
  // width/height ratio of the full artwork — used to size the display container
  workAspect: number;
  // how many times larger the work image starts (zoomed in on the unit)
  unitScale: number;
  // pixel offset of the work image at scroll=0, to center on the unit's location
  unitX?: number;
  unitY?: number;
}

export function WorkPage({
  slug,
  unitImage,
  unitAlt,
  workImage,
  workAlt,
  workAspect,
  unitScale,
  unitX = 0,
  unitY = 0,
}: WorkPageProps) {
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

  const displayW = workAspect >= 1 ? "60vmin" : `${(60 * workAspect).toFixed(2)}vmin`;
  const displayH = workAspect >= 1 ? `${(60 / workAspect).toFixed(2)}vmin` : "60vmin";

  return (
    <main ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <button
          onClick={() => router.push("/", { scroll: false })}
          className="absolute top-6 left-6 z-10 px-3 py-2 border text-xs font-mono font-medium uppercase tracking-[0.3em] hover:opacity-60 transition-opacity cursor-pointer"
        >
          {"← Back"}
        </button>
        <motion.div
          className="relative"
          style={{ width: displayW, height: displayH, scale, x, y, opacity: workOpacity }}
        >
          <Image src={workImage} alt={workAlt} fill sizes="60vmin" className="object-contain select-none pointer-events-none" />
        </motion.div>

        <motion.div className="absolute" style={{ opacity: unitOpacity, scale: unitImageScale, x: unitImageX, y: unitImageY }}>
          <ViewTransition name={`unit-${slug}`} share="unit-morph">
            <div className="relative size-32">
              <Image src={unitImage} alt={unitAlt} fill sizes="128px" priority className="object-contain select-none pointer-events-none" />
            </div>
          </ViewTransition>
        </motion.div>
      </div>
    </main>
  );
}
