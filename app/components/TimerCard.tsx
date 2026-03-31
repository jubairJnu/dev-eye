"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { motion } from "motion/react";

export default function TimerCard({ timeLeft }: { timeLeft: number }) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (timeLeft / 1200) * 100; // Assuming 20 min cycle

  return (
    <div className="bg-surface-high p-12 rounded-[2rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />

      <p className="text-on-surface-variant text-sm font-medium tracking-widest mb-8 uppercase">
        Next Break In
      </p>

      <div className="relative flex items-center justify-center w-80 h-80 rounded-full border-[12px] border-surface-highest/30">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="150"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray="950"
            strokeDashoffset={950 - (950 * progress) / 100}
            className="text-primary drop-shadow-[0_0_15px_rgba(173,198,255,0.4)] transition-all duration-1000"
          />
        </svg>

        <div className="z-10">
          <span className="timer-font text-[5.5rem] font-bold tracking-tighter text-on-surface leading-none">
            {formatTime(timeLeft)}
          </span>
          <div className="flex items-center justify-center gap-2 mt-2 text-secondary font-medium">
            <Eye size={14} fill="currentColor" />
            <span className="text-xs">Focusing Eyes</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-12 w-full max-w-sm">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-bold rounded-xl"
        >
          Take Break Now
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
