"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CELL = 100;
const TRAIL = 5;

type Props = { imageUrls: string[] };

export function LoginRainEffect({ imageUrls }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"show" | "fade" | "done">("show");

  // Only render on client to avoid hydration mismatches
  useEffect(() => {
    // Skip if already shown this session
    if (sessionStorage.getItem("humor_rain_done")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("humor_rain_done", "1");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (phase !== "fade") return;
    const t = setTimeout(() => setPhase("done"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const loaded: HTMLImageElement[] = [];
    let animId: number;
    let started = false;

    const rand = () => loaded[Math.floor(Math.random() * loaded.length)];

    const startAnim = () => {
      if (started || loaded.length === 0) return;
      started = true;

      const cols = Math.ceil(canvas.width / CELL);

      type Drop = { y: number; speed: number; imgs: HTMLImageElement[] };

      const drops: Drop[] = Array.from({ length: cols }, () => ({
        y: -(Math.random() * 14),
        speed: 0.05 + Math.random() * 0.09,
        imgs: Array.from({ length: TRAIL }, rand),
      }));

      const draw = () => {
        ctx.fillStyle = "rgba(5, 11, 18, 0.22)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < cols; i++) {
          const d = drops[i];
          d.y += d.speed;
          const headRow = Math.floor(d.y);

          for (let t = 0; t < TRAIL; t++) {
            const py = (headRow - t) * CELL;
            if (py + CELL < 0 || py > canvas.height) continue;

            const px = i * CELL;
            const img = d.imgs[t];
            if (!img) continue;

            ctx.globalAlpha = t === 0 ? 0.95 : (1 - t / TRAIL) * 0.6;
            ctx.drawImage(img, px, py, CELL, CELL);

            // Cyan tint overlay
            ctx.globalAlpha = t === 0 ? 0.2 : (1 - t / TRAIL) * 0.12;
            ctx.fillStyle = "#00d4ff";
            ctx.fillRect(px, py, CELL, CELL);

            // Glowing border on head tile
            if (t === 0) {
              ctx.globalAlpha = 1;
              ctx.shadowBlur = 22;
              ctx.shadowColor = "#00d4ff";
              ctx.strokeStyle = "rgba(0, 212, 255, 0.85)";
              ctx.lineWidth = 2;
              ctx.strokeRect(px + 1, py + 1, CELL - 2, CELL - 2);
              ctx.shadowBlur = 0;
            }
          }

          ctx.globalAlpha = 1;

          if (headRow * CELL > canvas.height + TRAIL * CELL) {
            d.y = -(Math.random() * 10 + 2);
            d.speed = 0.05 + Math.random() * 0.09;
            d.imgs = Array.from({ length: TRAIL }, rand);
          }
        }

        animId = requestAnimationFrame(draw);
      };

      animId = requestAnimationFrame(draw);
    };

    // Load images — NO crossOrigin so they aren't CORS-blocked
    // (canvas gets tainted but we only draw, never read pixels)
    let pending = imageUrls.length;

    if (pending === 0) {
      // Nothing to show — skip the effect entirely
      setPhase("done");
      return;
    }

    imageUrls.forEach((url) => {
      const img = new Image();
      img.onload = () => {
        loaded.push(img);
        pending--;
        if (loaded.length >= Math.min(4, imageUrls.length)) startAnim();
      };
      img.onerror = () => {
        pending--;
        if (pending === 0) {
          if (loaded.length > 0) startAnim();
          else setPhase("done"); // all failed — skip
        }
      };
      img.src = url;
    });

    // Start with whatever loaded after 1.5 s (handles slow connections)
    const safetyTimer = setTimeout(() => {
      if (!started) {
        if (loaded.length > 0) startAnim();
        else setPhase("done");
      }
    }, 1500);

    // Auto-dismiss at 7 s
    const autoFade = setTimeout(
      () => setPhase((p) => (p === "show" ? "fade" : p)),
      7000
    );

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(safetyTimer);
      clearTimeout(autoFade);
    };
  }, [mounted, imageUrls]);

  if (phase === "done") return null;

  // Before client mount: render a plain black cover (SSR + hydration gap)
  // This blocks the dashboard from showing while we wait for the canvas to init
  if (!mounted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "rgb(5, 11, 18)",
        }}
      />
    );
  }

  return createPortal(
    <div
      onClick={() => setPhase((p) => (p === "show" ? "fade" : p))}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        cursor: "pointer",
        userSelect: "none",
        background: "rgb(5, 11, 18)",
        opacity: phase === "fade" ? 0 : 1,
        transition: phase === "fade" ? "opacity 800ms ease-out" : "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      <p
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.35em",
          color: "rgba(0, 212, 255, 0.4)",
          textShadow: "0 0 8px rgba(0,212,255,0.4)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        CLICK ANYWHERE TO SKIP
      </p>
    </div>,
    document.body
  );
}
