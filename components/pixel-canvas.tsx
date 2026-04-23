import { useEffect, useRef } from "react";
import {
  type MotionValue,
} from "motion/react";

export function PixelCanvas({ text, pixelSize }: { text: string; pixelSize: MotionValue<number> }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontRefRef = useRef<HTMLHeadingElement>(null);
  const sourceRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const fontEl = fontRefRef.current;
    if (!wrapper || !canvas || !fontEl) return;

    let unsubscribePixel: (() => void) | null = null;

    const setup = (W: number, H: number) => {
      canvas.width = W;
      canvas.height = H;

      const source = document.createElement("canvas");
      source.width = W;
      source.height = H;
      sourceRef.current = source;

      const drawSource = () => {
        const { fontStyle, fontWeight, fontSize, fontFamily } = window.getComputedStyle(fontEl);
        const sc = source.getContext("2d")!;
        sc.clearRect(0, 0, W, H);
        sc.fillStyle = "#000";
        sc.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
        sc.textAlign = "center";
        sc.textBaseline = "middle";
        sc.fillText(text, W / 2, H / 2);
      };

      const applyPixelation = (ps: number) => {
        const ctx = canvas.getContext("2d")!;
        const src = sourceRef.current!;
        const blockSize = Math.max(1, Math.round(ps));
        const tinyW = Math.max(1, Math.floor(W / blockSize));
        const tinyH = Math.max(1, Math.floor(H / blockSize));
        const tiny = document.createElement("canvas");
        tiny.width = tinyW;
        tiny.height = tinyH;
        const tc = tiny.getContext("2d")!;
        tc.imageSmoothingEnabled = true;
        tc.drawImage(src, 0, 0, tinyW, tinyH);
        ctx.clearRect(0, 0, W, H);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tiny, 0, 0, W, H);
      };

      document.fonts.ready.then(() => {
        drawSource();
        applyPixelation(pixelSize.get());
      });

      unsubscribePixel?.();
      unsubscribePixel = pixelSize.on("change", applyPixelation);
    };

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setup(width, height);
    });
    ro.observe(wrapper);

    const W = wrapper.clientWidth;
    const H = wrapper.clientHeight;
    if (W > 0 && H > 0) setup(W, H);

    return () => {
      unsubscribePixel?.();
      ro.disconnect();
    };
  }, [text, pixelSize]);

  return (
    <div ref={wrapperRef} className="w-full h-full relative">
      {/* Hidden reference element — getComputedStyle reads font from actual Tailwind classes */}
      <h1
        ref={fontRefRef}
        className="sr-only text-6xl font-black italic"
        aria-hidden="true"
      >
        {text}
      </h1>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
