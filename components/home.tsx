"use client";

import { useRef, useLayoutEffect } from "react";
import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { PixelCanvas } from "@/components/pixel-canvas";

const works: { slug: string; unitImage: string; alt: string }[] = [
  { slug: "roman-mosaic", unitImage: "/assets/roman_mosaic_unit.png", alt: "Roman mosaic unit" },
  { slug: "evening-honfleur", unitImage: "/assets/evening_honfleur_unit.png", alt: "\"Evening, Honfleur\" unit" },
  { slug: "marta-fingerprint", unitImage: "/assets/marta_fingerprint_unit.png", alt: "\"Marta/Fingerprint\" unit" },
  { slug: "the-computer-place", unitImage: "/assets/the_computer_place_unit.png", alt: "\"The computer place\" unit" },
  { slug: "still-after-cindy-sherman", unitImage: "/assets/still_after_cindy_sherman_unit.png", alt: "\"Still, after Cindy Sherman\" unit" },
];

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

  useLayoutEffect(() => {
    const saved = sessionStorage.getItem("homeScrollY");
    if (saved) {
      sessionStorage.removeItem("homeScrollY");
      const targetY = parseFloat(saved);
      window.scrollTo({ top: targetY, behavior: "instant" });
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const p = targetY / totalScrollable;
        scrollYProgress.set(p);
        smoothScrollYProgress.set(p);
      }
    }
  }, [scrollYProgress, smoothScrollYProgress]);

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
          className="flex flex-col items-center justify-center"
        >
          <p className="text-xs text-center text-muted font-mono font-medium uppercase tracking-[0.3em]">
            {"Select one"}
          </p>

          <div className="flex items-center gap-16 mt-10">
            {works.map(({ slug, unitImage, alt }) => (
              <Link key={slug} href={`/${slug}`} onClick={() => sessionStorage.setItem("homeScrollY", String(window.scrollY))}>
                <ViewTransition name={`unit-${slug}`} share="unit-morph">
                  <div className="relative size-32">
                    <Image
                      src={unitImage}
                      alt={alt}
                      fill
                      sizes="128px"
                      className="object-contain"
                    />
                  </div>
                </ViewTransition>
              </Link>
            ))}
          </div>
        </ScrollSection>
      </div>
    </main>
  );
}

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