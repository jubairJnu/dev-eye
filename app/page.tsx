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
import {
  sendNotification,
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/api/notification";
import { appWindow } from "@tauri-apps/api/window";

const TWENTY_MIN = 20 * 60;
const STATS_STORAGE_KEY = "deveye-stats";

type DailyStats = {
  date: string;
  breaksTaken: number;
  breaksMissed: number;
  totalScreenTime: number;
};

type StatsState = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  dailyData: DailyStats[];
};

const createDefaultStats = (): StatsState => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  dailyData: [],
});

const getTodayString = () => new Date().toISOString().split("T")[0];

const getStoredTimerState = () => {
  if (typeof window === "undefined") {
    return {
      isRunning: false,
      timeLeft: TWENTY_MIN,
    };
  }

  const saved = localStorage.getItem("deveye-state");
  if (!saved) {
    return {
      isRunning: false,
      timeLeft: TWENTY_MIN,
    };
  }

  const data = JSON.parse(saved);
  return {
    isRunning: Boolean(data.isRunning),
    timeLeft: typeof data.timeLeft === "number" ? data.timeLeft : TWENTY_MIN,
  };
};

const getStoredStats = (): StatsState => {
  if (typeof window === "undefined") {
    return createDefaultStats();
  }

  const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
  return savedStats ? JSON.parse(savedStats) : createDefaultStats();
};

const ensureTodayData = (stats: StatsState, date: string) => {
  let todayData = stats.dailyData.find((entry) => entry.date === date);

  if (!todayData) {
    todayData = {
      date,
      breaksTaken: 0,
      breaksMissed: 0,
      totalScreenTime: 0,
    };
    stats.dailyData.push(todayData);
  }

  return todayData;
};

export default function HomePage() {
  const [isRunning, setIsRunning] = useState(
    () => getStoredTimerState().isRunning,
  );
  const [timeLeft, setTimeLeft] = useState(
    () => getStoredTimerState().timeLeft,
  );
  const [showBreak, setShowBreak] = useState(false);
  const [stats, setStats] = useState<StatsState>(getStoredStats);

  // 💾 Save state
  useEffect(() => {
    localStorage.setItem(
      "deveye-state",
      JSON.stringify({ isRunning, timeLeft }),
    );
  }, [isRunning, timeLeft]);

  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // ▶ Start
  function handleStart() {
    setIsRunning(true);
  }

  // 🔔 Break handler — fires when 20-min timer hits 0
  async function handleBreak() {
    setShowBreak(true);
    setIsRunning(false);

    // 1️⃣ Bring app window above all other apps
    await appWindow.setAlwaysOnTop(true);
    await appWindow.setFullscreen(true);
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
        sendNotification({
          title: "👁️ Time for a Break!",
          body: "20 minutes done — rest your eyes for 20 seconds.",
        });
      }
    } catch (e) {
      console.warn("Notification error:", e);
    }
  }

  // 🔁 Close break modal + reset window state
  async function closeBreakModal() {
    setShowBreak(false);
    setIsRunning(true);
    await appWindow.setFullscreen(false);
    await appWindow.setAlwaysOnTop(false);
  }

  async function handleBreakComplete() {
    updateStats("taken");
    await closeBreakModal();
  }

  async function handleBreakMissed() {
    updateStats("missed");
    await closeBreakModal();
  }

  function updateStats(result: "taken" | "missed") {
    const todayStr = getTodayString();

    setStats((currentStats) => {
      const nextStats = structuredClone(currentStats);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (result === "taken") {
        if (nextStats.lastActiveDate === yesterdayStr) {
          nextStats.currentStreak += 1;
        } else if (nextStats.lastActiveDate !== todayStr) {
          nextStats.currentStreak = 1;
        }

        if (nextStats.currentStreak > nextStats.longestStreak) {
          nextStats.longestStreak = nextStats.currentStreak;
        }

        nextStats.lastActiveDate = todayStr;
      }

      const todayData = ensureTodayData(nextStats, todayStr);

      if (result === "taken") {
        todayData.breaksTaken += 1;
      } else {
        todayData.breaksMissed += 1;
      }

      return nextStats;
    });
  }

  function handleStop() {
    if (isRunning && timeLeft < TWENTY_MIN) {
      updateStats("missed");
    }
    setIsRunning(false);
  }

  // ⏱️ Main timer
  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      if (timeLeft <= 1) {
        setTimeLeft(TWENTY_MIN);
        handleBreak();
        return;
      }

      setTimeLeft((currentTime: number) => currentTime - 1);
      setStats((currentStats) => {
        const nextStats = structuredClone(currentStats);
        const todayData = ensureTodayData(nextStats, getTodayString());
        todayData.totalScreenTime += 1;
        return nextStats;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  const todayData = stats.dailyData.find(
    (entry) => entry.date === getTodayString(),
  ) || {
    breaksTaken: 0,
    breaksMissed: 0,
    totalScreenTime: 0,
  };

  return (
    <div className="min-h-screen bg-[#131b2e] flex">
      <Sidebar handleStart={handleStart} />

      <main className="ml-64 flex-1 flex flex-col">
        <TopBar />

        <div className="p-10 flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto w-full">
          {/* Left Column: Primary Focus */}
          <div className="flex-1 space-y-10">
            {showBreak ? (
              <BreakModal
                onComplete={handleBreakComplete}
                onMissed={handleBreakMissed}
              />
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
            <StreakCard
              current={stats?.currentStreak || 0}
              longest={stats?.longestStreak || 0}
            />
            <TodayStatsCard
              breaksTaken={todayData.breaksTaken || 0}
              breaksMissed={todayData.breaksMissed || 0}
              totalScreenTime={todayData.totalScreenTime || 0}
            />
            <ProTipCard />
          </div>
        </div>
      </main>
    </div>
  );
}
