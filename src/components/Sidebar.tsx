import React from "react";
import { ViewType } from "../types";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onStartSession: () => void;
  onOpenSupport?: (tab: "help" | "contact") => void;
  showToast?: (message: string, type?: "success" | "info" | "error") => void;
}

export default function Sidebar({ currentView, onViewChange, onStartSession, onOpenSupport, showToast }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "chat", label: "Tutor Chat", icon: "forum" },
    { id: "progress", label: "Progress", icon: "analytics" },
    { id: "settings", label: "Settings", icon: "settings" },
  ] as const;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col py-6 z-50 transition-colors duration-300">
      {/* Brand Header */}
      <div className="px-6 mb-8 cursor-pointer" onClick={() => onViewChange("landing")}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00e5ff]/20 rounded-lg flex items-center justify-center text-[#006875] dark:text-[#00e5ff]">
            <span className="material-symbols-outlined font-bold text-2xl">school</span>
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold text-[#006875] dark:text-[#00e5ff] leading-none">Socratic AI</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Deep Learning Tutor</p>
          </div>
        </div>
      </div>

      {/* Main Navigation links */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-3 text-left font-medium transition-all duration-300 ${
                isActive
                  ? "text-[#006875] dark:text-[#00e5ff] border-l-4 border-[#006875] dark:border-[#00e5ff] bg-[#00e5ff]/10 font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-[#006875] dark:hover:text-[#00e5ff]"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "fill-icon font-bold" : ""}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom CTA & Options */}
      <div className="px-4 mt-auto space-y-6">
        <button
          onClick={onStartSession}
          className="w-full py-3 bg-[#00e5ff] text-[#131b2e] font-bold rounded-xl shadow-lg shadow-[#00e5ff]/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined font-bold text-lg">add_circle</span>
          Start Session
        </button>

        <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-1">
          <button
            onClick={() => onViewChange("settings")}
            className="w-full flex items-center gap-4 px-4 py-2 text-left text-sm text-gray-500 dark:text-gray-400 hover:text--[#006875] dark:hover:text-[#00e5ff] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
            Settings
          </button>
          <button
            onClick={() => onOpenSupport ? onOpenSupport("help") : showToast?.("Connecting you to a Socratic Support specialist...", "info")}
            className="w-full flex items-center gap-4 px-4 py-2 text-left text-sm text-gray-500 dark:text-gray-400 hover:text--[#006875] dark:hover:text-[#00e5ff] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">help</span>
            Support
          </button>
        </div>
      </div>
    </aside>
  );
}
