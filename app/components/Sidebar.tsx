"use client";

import { LayoutDashboard, BarChart3, Settings, UserCircle } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import meImage from "@/app/assest/me.png";
import Link from "next/link";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
  { id: "analytics", label: "Analytics", icon: BarChart3, active: false },
  { id: "settings", label: "Settings", icon: Settings, active: false },
];

export default function Sidebar({ handleStart }: { handleStart: () => void }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40 bg-surface border-r border-outline-variant/5">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight text-on-surface font-manrope">
          DevEye
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Ambient Concierge
        </p>
      </div>

      <nav className="flex-1 mt-4">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`px-6 py-4 flex items-center gap-3 transition-colors duration-200 ${
              item.active
                ? "text-primary font-bold border-r-2 border-primary bg-surface-high/30"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-low"
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full py-4 rounded-xl font-bold text-on-primary-container bg-gradient-to-br from-primary to-primary-container shadow-lg shadow-primary/10"
        >
          Start Focus Session
        </motion.button>

        <Link
          href="https://www.linkedin.com/in/jubairabdullah/"
          target="_blank"
          className="flex items-center gap-3 mt-8 pt-6 border-t border-outline-variant/10"
        >
          <div className="w-10 h-10 rounded-full bg-surface-highest overflow-hidden">
            <Image
              src={meImage}
              alt="Jubair Abdullah"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">Jubair Abdullah</p>
            <p className="text-xs text-on-surface-variant">Developed By</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
