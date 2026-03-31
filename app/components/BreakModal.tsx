"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import bgImage from "@/app/assest/bgImage.png";

const BREAK_SECONDS = 20;

const BreakModal = ({ onClose }: { onClose: () => void }) => {
  const [seconds, setSeconds] = useState<number>(BREAK_SECONDS);
  const [done, setDone] = useState<boolean>(false);

  const tickBufRef = useRef<AudioBuffer | null>(null);
  const doneBufRef = useRef<AudioBuffer | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioReadyRef = useRef<boolean>(false);

  // 🔊 Play helpers
  const playBuffer = (buf: AudioBuffer | null) => {
    const ctx = audioCtxRef.current;
    if (!buf || !ctx) return;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    source.connect(ctx.destination);
    source.start(0);
  };

  // 🚀 Initialise AudioContext + load buffers immediately on mount (Tauri = no autoplay block)
  useEffect(() => {
    let ctx: AudioContext;

    const init = async () => {
      ctx = new AudioContext();
      // Resume immediately — works in Tauri desktop WebView
      await ctx.resume();
      audioCtxRef.current = ctx;

      const loadBuffer = async (url: string): Promise<AudioBuffer> => {
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        return ctx.decodeAudioData(arrayBuf);
      };

      const [tickBuf, doneBuf] = await Promise.all([
        loadBuffer("/click.mp3"),
        loadBuffer("/done.mp3"),
      ]);

      tickBufRef.current = tickBuf;
      doneBufRef.current = doneBuf;
      audioReadyRef.current = true;
    };

    init().catch(console.error);

    return () => {
      ctx?.close();
    };
  }, []);

  // ⏳ Countdown — plays tick each second, done sound at 0
  useEffect(() => {
    if (done) return;

    if (seconds <= 0) {
      setDone(true);
      playBuffer(doneBufRef.current);
      return;
    }

    playBuffer(tickBufRef.current);

    const timer = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, done]);

  // SVG ring math
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const progress = done ? 1 : (BREAK_SECONDS - seconds) / BREAK_SECONDS;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-[340px] rounded-[2rem] overflow-hidden shadow-2xl"
        style={{ background: "var(--surface-container)" }}
      >
        {/* ── Hero header with bg image ── */}
        <div className="relative h-52 flex flex-col items-center justify-end pb-6">
          <Image
            src={bgImage}
            alt="break background"
            fill
            className="object-cover opacity-45 z-0 "
            priority
          />
          {/* dark gradient overlay */}
          <div className="absolute inset-0  z-[1] bg-gradient-to-b from-black/30 via-black/60 to-[#171f33]" />

          {/* Eye icon */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "var(--surface-container)",
                boxShadow: "0 0 0 3px var(--secondary)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  stroke="var(--secondary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="var(--secondary)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h1
              className="text-[22px] font-extrabold tracking-tight"
              style={{ color: "var(--on-surface)" }}
            >
              Time for a Break!
            </h1>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pt-5 pb-7 flex flex-col items-center gap-5">
          {/* Subtitle */}
          <p className="text-sm" style={{ color: "var(--on-surface-variant)" }}>
            Your eyes deserve a break 👁️
          </p>

          {/* Instruction cards */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Card 1 */}
            <div
              className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
              style={{ background: "var(--surface-container-high)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="10"
                  r="4"
                  stroke="var(--primary)"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  stroke="var(--primary)"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="text-xs font-medium leading-tight"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Look 20 ft away 👀
              </span>
            </div>

            {/* Card 2 */}
            <div
              className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
              style={{ background: "var(--surface-container-high)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M1 4.5V3a2 2 0 0 1 2-2h1.5"
                  stroke="var(--primary)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M22.5 4.5V3a2 2 0 0 0-2-2H19"
                  stroke="var(--primary)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M1 19.5V21a2 2 0 0 0 2 2h1.5"
                  stroke="var(--primary)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M22.5 19.5V21a2 2 0 0 1-2 2H19"
                  stroke="var(--primary)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M4 12s3.5-5 8-5 8 5 8 5-3.5 5-8 5-8-5-8-5z"
                  stroke="var(--primary)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2"
                  stroke="var(--primary)"
                  strokeWidth="1.8"
                />
              </svg>
              <span
                className="text-xs font-medium leading-tight"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Blink slowly 10 times
              </span>
            </div>
          </div>

          {/* Countdown ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg
                className="absolute w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Track */}
                <circle
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  strokeWidth="5"
                  stroke="var(--surface-container-highest)"
                />
                {/* Progress arc */}
                <circle
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  strokeWidth="5"
                  stroke="var(--secondary)"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>

              {/* Center text */}
              <div className="flex flex-col items-center leading-none z-10">
                <span
                  className="text-4xl font-black tabular-nums"
                  style={{ color: "var(--on-surface)" }}
                >
                  {done ? "✓" : seconds}
                </span>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest mt-1"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {done ? "Done!" : "Seconds"}
                </span>
              </div>
            </div>
          </div>

          {/* Done button */}
          <button
            disabled={!done}
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300"
            style={{
              background: done
                ? "var(--secondary)"
                : "var(--surface-container-high)",
              color: done ? "var(--surface)" : "var(--on-surface-variant)",
              cursor: done ? "pointer" : "not-allowed",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Done
          </button>

          {/* Skip */}
          <button
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Skip this break
          </button>

          {/* Footer tagline */}
          <p
            className="text-[9px] font-bold uppercase tracking-[0.18em] text-center mt-1"
            style={{ color: "var(--on-surface-variant)", opacity: 0.5 }}
          >
            Resting prevents digital eye strain
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreakModal;
