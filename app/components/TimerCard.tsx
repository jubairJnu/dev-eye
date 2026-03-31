"use client";

import { Eye, Play, Square } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TimerCardProps {
  timeLeft: number;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function TimerCard({
  timeLeft,
  isRunning,
  onStart,
  onStop,
}: TimerCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / 1200) * 100; // 20-min cycle

  return (
    <div className="bg-surface-high p-12 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
      {/* Ambient glow — top-right corner of card */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 blur-[90px] rounded-full pointer-events-none" />

      <p className="text-on-surface-variant text-sm font-medium tracking-widest mb-8 uppercase">
        Next Break In
      </p>

      <div className="relative flex items-center justify-center w-80 h-80">
        {/* Arc-tip reflection — sits at top-right of the ring stroke */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: "72px",
            height: "72px",
            top: "10px",
            right: "14px",
            background:
              "radial-gradient(circle, rgba(173,198,255,0.35) 0%, rgba(173,198,255,0.08) 55%, transparent 75%)",
            filter: "blur(8px)",
          }}
        />

        {/* Pure SVG ring — track + glowing progress arc */}
        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0 w-full h-full -rotate-90"
        >
          {/* Dark track */}
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-surface-highest opacity-30"
          />
          {/* Glowing progress arc */}
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="879.6"
            strokeDashoffset={879.6 - (879.6 * progress) / 100}
            className="text-primary drop-shadow-[0_0_18px_rgba(173,198,255,0.55)] transition-all duration-1000"
          />
        </svg>

        {/* Center content — toggles between Start button and live timer */}
        <div className="z-10 relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isRunning ? (
              /* ▶ Start button */
              <motion.button
                key="start"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={onStart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                className="flex flex-col items-center gap-3 group/btn"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, rgba(173,198,255,0.25), rgba(173,198,255,0.06))",
                    boxShadow:
                      "0 0 0 1.5px rgba(173,198,255,0.25), 0 0 28px rgba(173,198,255,0.18)",
                  }}
                >
                  <Play
                    size={34}
                    className="text-primary ml-1 drop-shadow-[0_0_10px_rgba(173,198,255,0.7)]"
                    fill="currentColor"
                  />
                </div>
                <span className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant">
                  Start Focus
                </span>
              </motion.button>
            ) : (
              /* ⏱ Live timer */
              <motion.div
                key="timer"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col items-center gap-2"
              >
                <span className="timer-font text-[5.5rem] font-bold tracking-tighter text-on-surface leading-none">
                  {formatTime(timeLeft)}
                </span>
                <div className="flex items-center justify-center gap-2 mt-1 text-secondary font-medium">
                  <Eye size={14} fill="currentColor" />
                  <span className="text-xs">Focusing Eyes</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-4 mt-12 w-full max-w-sm">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isRunning ? onStop : onStart}
          className={`flex-1 py-4 font-bold rounded-xl flex items-center justify-center gap-2 
    ${
      isRunning
        ? "bg-linear-to-r from-red-500 to-primary-container text-white"
        : "bg-linear-to-r from-primary to-primary-container text-on-primary-container"
    }`}
        >
          {isRunning ? (
            <>
              <Square size={15} fill="currentColor" />
              Stop
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" />
              Start Focus
            </>
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-4 bg-surface-highest text-on-surface border border-outline-variant/10 hover:bg-surface-highest/80 transition-colors rounded-xl"
        >
          Postpone 5m
        </motion.button>
      </div>
    </div>
  );
}
