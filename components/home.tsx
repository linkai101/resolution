"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { PixelCanvas } from "@/components/pixel-canvas";

function ScrollSection({
  scrollYProgress,
  inputRange,
  opacity,
  scale,
  y,
  className,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  inputRange: number[];
  opacity?: number[];
  scale?: number[];
  y?: number[];
  className: string;
  children?: React.ReactNode;
}) {
  const len = inputRange.length;
  const opacityValue = useTransform(scrollYProgress, inputRange, opacity ?? Array(len).fill(1));
  const scaleValue = useTransform(scrollYProgress, inputRange, scale ?? Array(len).fill(1));
  const yValue = useTransform(scrollYProgress, inputRange, y ?? Array(len).fill(0));
  const pointerEvents = useTransform(opacityValue, v => v > 0.05 ? "auto" : "none");

  return (
    <motion.div
      className={`absolute inset-0 h-screen ${className}`}
      style={{ opacity: opacityValue, scale: scaleValue, y: yValue, pointerEvents }}
    >
      {children}
    </motion.div>
  );
}

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    damping: 10,
  });

  const rawPixel = useTransform(smoothScrollYProgress, [0, 0.75], [0, 1]);
  const pixelSize = useTransform(rawPixel, v => 1 + Math.pow(Math.min(v, 1), 1.5) * 16);

  return (
    <main ref={containerRef} className="relative h-[600vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <ScrollSection
          scrollYProgress={smoothScrollYProgress}
          inputRange={[0, 0.65, 0.75]}
          opacity={[1, 1, 0]}
          scale={[1, 8, 8]}
          y={[0, -100, -100]}
          className="relative"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+40px)] p-4 border">
            <div className="w-2xl aspect-3/2 border">
              <h1 className="sr-only">{"resolutions"}</h1>
              <PixelCanvas text="resolutions" pixelSize={pixelSize} />
            </div>
          </div>

          <hr className="absolute bottom-20 inset-x-0 border-muted"/>
        </ScrollSection>

        <ScrollSection
          scrollYProgress={smoothScrollYProgress}
          inputRange={[0.15, 0.25, 0.65, 0.75]}
          opacity={[0, 1, 1, 0]}
          className="flex flex-col items-center justify-center"
        >
          <p className="text-2xl text-center">
            {"Sometimes, when you stand too close, the image disappears."}
          </p>
          <p className="text-2xl text-center mt-4 invisible">
            {"What remains is texture, repetition, and "}
            <span className="font-bold italic">{"the unit."}</span>
          </p>
        </ScrollSection>

        <ScrollSection
          scrollYProgress={smoothScrollYProgress}
          inputRange={[0.35, 0.45, 0.65, 0.75]}
          opacity={[0, 1, 1, 0]}
          className="flex flex-col items-center justify-center"
        >
          <p className="text-2xl text-center">
            {"Sometimes, when you stand too close, the image disappears."}
          </p>
          <p className="text-2xl text-center mt-4">
            {"What remains is texture, repetition, and "}
            <span className="font-bold italic">{"the unit."}</span>
          </p>
        </ScrollSection>

        <ScrollSection
          scrollYProgress={smoothScrollYProgress}
          inputRange={[0.85, 0.95]}
          opacity={[0, 1]}
          className="flex items-center justify-center"
        >
          <p className="text-2xl text-center">{"(chapter selection)"}</p>
        </ScrollSection>
      </div>
    </main>
  );
}