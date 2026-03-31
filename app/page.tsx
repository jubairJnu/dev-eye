"use client";

import { useEffect, useState } from "react";
import BreakModal from "./components/BreakModal";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TimerCard from "./components/TimerCard";
import EyeHealthCard from "./components/EyeHealthCard";
import {
  ProTipCard,
  StreakCard,
  TodayStatsCard,
} from "./components/StatsCards";

const TWENTY_MIN = 20 * 60;

export default function HomePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TWENTY_MIN);
  const [showBreak, setShowBreak] = useState(false);

  // 🔁 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("deveye-state");
    if (saved) {
      const data = JSON.parse(saved);
      setIsRunning(data.isRunning);
      setTimeLeft(data.timeLeft);
    }
  }, []);

  // 💾 Save state
  useEffect(() => {
    localStorage.setItem(
      "deveye-state",
      JSON.stringify({ isRunning, timeLeft }),
    );
  }, [isRunning, timeLeft]);

  // ⏱️ Main timer
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setShowBreak(true);
      setTimeLeft(TWENTY_MIN);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  // ▶ Start
  const handleStart = () => {
    setIsRunning(true);
  };

  // ⏸ Stop
  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    // <div className="p-6 text-white">
    //   <h1 className="text-2xl mb-4">👁️ DevEye</h1>

    //   {!isRunning ? (
    //     <button onClick={handleStart} className="bg-blue-500 px-4 py-2 rounded">
    //       ▶ Start
    //     </button>
    //   ) : (
    //     <button
    //       onClick={handleStop}
    //       className="bg-yellow-500 px-4 py-2 rounded"
    //     >
    //       ⏸ Stop
    //     </button>
    //   )}

    //   {/* Timer */}
    //   <p className="mt-4 text-lg">
    //     ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
    //   </p>

    //   {/* Break Modal */}
    //   {showBreak && <BreakModal onClose={() => setShowBreak(false)} />}
    // </div>
    <div className="min-h-screen bg-[#131b2e] flex">
      <Sidebar handleStart={handleStart} />

      <main className="ml-64 flex-1 flex flex-col">
        <TopBar />

        <div className="p-10 flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto w-full">
          {/* Left Column: Primary Focus */}
          <div className="flex-1 space-y-10">
            <TimerCard timeLeft={timeLeft} />
            <EyeHealthCard />
          </div>

          {/* Right Column: Stats & Secondary Metrics */}
          <div className="w-full lg:w-96 space-y-6">
            <StreakCard />
            <TodayStatsCard />
            <ProTipCard />
          </div>
        </div>
      </main>
    </div>
  );
}
