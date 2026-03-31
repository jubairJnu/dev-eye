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


import { sendNotification, isPermissionGranted, requestPermission } from "@tauri-apps/api/notification";
import { appWindow } from "@tauri-apps/api/window";

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
      setTimeLeft(TWENTY_MIN);
      handleBreak();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  // ▶ Start
  const handleStart = () => {
    setIsRunning(true);
  };

  // ⏸ Stop
  const handleStop = () => {
    setIsRunning(false);
  };

  // 🔔 Break handler — fires when 20-min timer hits 0
  const handleBreak = async () => {
    setShowBreak(true);
    setIsRunning(false);

    // 1️⃣ Bring app window above all other apps
    await appWindow.setAlwaysOnTop(true);
    await appWindow.show();
    await appWindow.setFocus();

    // 2️⃣ Send system notification
    try {
      let granted = await isPermissionGranted();
      if (!granted) {
        const permission = await requestPermission();
        granted = permission === "granted";
      }
      if (granted) {
        sendNotification({ title: "👁️ Time for a Break!", body: "20 minutes done — rest your eyes for 20 seconds." });
      }
    } catch (e) {
      console.warn("Notification error:", e);
    }
  };

  // 🔁 Close break modal + reset alwaysOnTop
  const handleBreakClose = async () => {
    setShowBreak(false);
    await appWindow.setAlwaysOnTop(false);
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
            {showBreak ? (
              <BreakModal onClose={handleBreakClose} />
            ) : (
              <TimerCard
                timeLeft={timeLeft}
                isRunning={isRunning}
                onStart={handleStart}
                onStop={handleStop}
              />
            )}

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
