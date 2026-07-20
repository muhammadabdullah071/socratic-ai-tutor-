import React, { useState, useEffect } from "react";
import { ViewType, ActiveSession, StudentProfile } from "./types";
import { LEVEL_DATASETS } from "./data";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CameraViewfinder from "./components/CameraViewfinder";
import TutorChat from "./components/TutorChat";
import ProgressScreen from "./components/ProgressScreen";
import ProfileSettings from "./components/ProfileSettings";
import SupportModal from "./components/SupportModal";

export default function App() {
  // 1. App Navigation Route States
  const [currentView, setCurrentView] = useState<ViewType>("landing");

  // 2. Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Support Modal States
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportDefaultTab, setSupportDefaultTab] = useState<"help" | "contact">("help");

  const handleOpenSupport = (tab: "help" | "contact" = "help") => {
    setSupportDefaultTab(tab);
    setIsSupportOpen(true);
  };

  const handleAwardXp = (amount: number) => {
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  // 3. Student Profile States (Initialized with A-Level defaults)
  const [profile, setProfile] = useState<StudentProfile>({
    name: "Ahmad Sulaiman",
    email: "ahmad.sulaiman@academy.edu",
    level: "A-Level",
    streakDays: 12,
    xp: 1200,
    timeTodayMinutes: 45,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCK3XqbQ4ye1J0a0K-TCvNnN70pxA_FuRbhZPNP6KOdU8FsTAettbqBKhd6x95Cr22KnkuyxfYw78ksnb0NJc2DxYXIKVzyIjKgxM2FbD6AIjjERkc5O1eT5C-w255yV3xn3B03m2te7Shm-sNnUr1c3z1_mSyKByjCNKJKecwdXL6_V528zh_Hpa2Ik5-qfA7MnNu7ZgKbXaPPZ4iG4Ocz5wAXBsgIKNac1BS9Tu2AePhouDUzm7x4",
    isDarkMode: false,
    emailNotifications: true,
    streakAlerts: true,
    goals: LEVEL_DATASETS["A-Level"].goals,
    masteryTrends: LEVEL_DATASETS["A-Level"].masteryTrends,
    problemSolved: LEVEL_DATASETS["A-Level"].problemSolved,
    studyData: LEVEL_DATASETS["A-Level"].studyData,
    nextAchievement: LEVEL_DATASETS["A-Level"].nextAchievement,
  });

  // 4. Current active Socratic session details
  const [activeSession, setActiveSession] = useState<ActiveSession>({
    subject: "Physics",
    topic: "Simple Harmonic Motion",
    question: "Determine the tension in the string of the simple pendulum at the lowest point of the swing if the mass is 2kg and the length of the string is 1.5m.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHB8pryuxCfq9mOwKFyxhW_UWVmSlv7J8JlmVff2fxFZbNB8TQKcQl9_TT_RD1-EI5msWlUoqRk9-u23SAL_FedDTpqtmGZs4-rX40byRgByqwqCWlH_1qEuzZpcolJZW4v-G0-xNK0JkqT5SicVxo9unpc8kMjZ2KMaTKSf9tQav093DyXdOv9CHI3rkQrUIW3UtTboB0uJYoU2l-uEjLJhbQ__0V0Lb2Ev327AQk-85BV_FptO18",
    milestones: [
      "Identify Forces acting at the lowest point",
      "Apply Conservation of Energy to find velocity",
      "Calculate Centripetal Acceleration and Tension",
    ],
    currentMilestoneIndex: 0,
    messages: [
      {
        id: "intro-1",
        role: "assistant",
        content: "Hi Ahmad! I've analyzed your pendulum problem. At the lowest point of the swing, the kinetic energy is maximized and we have multiple forces balancing gravity.\n\nTo start, what forces do you think are acting on the pendulum bob in the vertical direction?",
        timestamp: new Date(),
      },
    ],
  });

  // React to visual theme choices on document load & state changes
  useEffect(() => {
    if (profile.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [profile.isDarkMode]);

  // Dynamic Profile Updaters - Automatically updates topics/goals when switching level Selector
  const handleUpdateProfile = (updated: StudentProfile) => {
    if (updated.level !== profile.level) {
      const dataset = LEVEL_DATASETS[updated.level];
      setProfile({
        ...updated,
        goals: dataset.goals,
        masteryTrends: dataset.masteryTrends,
        problemSolved: dataset.problemSolved,
        studyData: dataset.studyData,
        nextAchievement: dataset.nextAchievement,
      });
      showToast(`Switched level to ${updated.level}! Goals & trends updated.`, "info");
    } else {
      setProfile(updated);
    }
  };

  // Handlers for authentication
  const handleOnboardingStart = (email: string, name?: string) => {
    const selectedName = name && name.trim() ? name.trim() : "Ahmad Sulaiman";
    const initialLevel = "A-Level";
    const dataset = LEVEL_DATASETS[initialLevel];

    setProfile(prev => ({ 
      ...prev, 
      email,
      name: selectedName,
      level: initialLevel,
      goals: dataset.goals,
      masteryTrends: dataset.masteryTrends,
      problemSolved: dataset.problemSolved,
      studyData: dataset.studyData,
      nextAchievement: dataset.nextAchievement,
    }));

    setCurrentView("dashboard");
    showToast(`Welcome back, ${selectedName}! Signed in successfully.`, "success");
  };

  const handleStartSessionTrigger = () => {
    setCurrentView("camera");
  };

  const handleAnalysisSuccess = (session: ActiveSession) => {
    setActiveSession(session);
    setCurrentView("chat");
    showToast("Concept analyzed successfully! Let's start learning.", "success");
  };

  const handleResumeSession = (session: ActiveSession) => {
    setActiveSession(session);
    setCurrentView("chat");
    showToast(`Resumed ${session.subject} - ${session.topic}`, "info");
  };

  // Connect Socratic active milestones solved directly to dashboard/progress statistics
  const handleUpdateSession = (updatedSession: ActiveSession) => {
    const prevIndex = activeSession.currentMilestoneIndex;
    const newIndex = updatedSession.currentMilestoneIndex;
    
    setActiveSession(updatedSession);

    if (newIndex > prevIndex) {
      const milestonesSolved = newIndex - prevIndex;
      const gainedXp = milestonesSolved * 150;
      
      // Increment solved count for physics subject in profile and increase mastery
      setProfile(prev => {
        const nextXp = prev.xp + gainedXp;
        const nextTime = prev.timeTodayMinutes + 12;
        
        const updatedProblems = prev.problemSolved.map(p => {
          if (p.subject.toLowerCase() === "physics" || p.subject.toLowerCase() === "science") {
            return { ...p, count: p.count + milestonesSolved };
          }
          return p;
        });

        const updatedTrends = prev.masteryTrends.map(m => {
          if (m.subject.toLowerCase() === "physics") {
            const nextVal = Math.min(100, m.mastery + 6 * milestonesSolved);
            return { ...m, mastery: nextVal, trend: `+${nextVal - m.mastery}% increase!` };
          }
          return m;
        });

        const nextPercent = Math.min(100, prev.nextAchievement.percent + 15 * milestonesSolved);

        return {
          ...prev,
          xp: nextXp,
          timeTodayMinutes: nextTime,
          problemSolved: updatedProblems,
          masteryTrends: updatedTrends,
          nextAchievement: {
            ...prev.nextAchievement,
            percent: nextPercent,
            description: nextPercent >= 100 ? "Achievement fully unlocked!" : prev.nextAchievement.description,
          }
        };
      });

      showToast(`Milestone completed! +${gainedXp} Scholar XP!`, "success");
    }
  };

  // Render Core layout
  if (currentView === "landing") {
    return (
      <LandingPage 
        onGetStarted={handleOnboardingStart} 
        onViewChange={setCurrentView} 
        onOpenSupport={handleOpenSupport}
        showToast={showToast}
      />
    );
  }

  if (currentView === "camera") {
    return (
      <CameraViewfinder 
        onBack={() => setCurrentView("dashboard")} 
        onAnalysisSuccess={handleAnalysisSuccess} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans flex flex-col transition-colors duration-300">
      
      {/* 1. Desktop & Mobile Persistent Top Header (For Explore, Resources, Chat, Settings) */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm w-full">
        <nav className="flex justify-between items-center px-4 md:px-16 w-full max-w-7xl mx-auto h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("landing")}>
            <span className="material-symbols-outlined text-[#006875] text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
            <span className="font-display text-xl font-extrabold text-[#006875] tracking-tight">Socratic AI</span>
          </div>

          {/* Navigation Links - Fully integrated to make them like the landing page */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setCurrentView("landing")} 
              className="font-medium text-gray-500 hover:text-[#006875] transition-colors cursor-pointer text-sm"
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView("dashboard")} 
              className={`font-medium text-sm transition-colors cursor-pointer py-1 ${
                currentView === "dashboard" ? "text-[#006875] border-b-2 border-[#006875] font-bold" : "text-gray-500 hover:text-[#006875]"
              }`}
            >
              Explore
            </button>
            <button 
              onClick={() => setCurrentView("progress")} 
              className={`font-medium text-sm transition-colors cursor-pointer py-1 ${
                currentView === "progress" ? "text-[#006875] border-b-2 border-[#006875] font-bold" : "text-gray-500 hover:text-[#006875]"
              }`}
            >
              Resources
            </button>
            <button 
              onClick={() => setCurrentView("chat")} 
              className={`font-medium text-sm transition-colors cursor-pointer py-1 ${
                currentView === "chat" ? "text-[#006875] border-b-2 border-[#006875] font-bold" : "text-gray-500 hover:text-[#006875]"
              }`}
            >
              Tutor Chat
            </button>
            <button 
              onClick={() => setCurrentView("settings")} 
              className={`font-medium text-sm transition-colors cursor-pointer py-1 ${
                currentView === "settings" ? "text-[#006875] border-b-2 border-[#006875] font-bold" : "text-gray-500 hover:text-[#006875]"
              }`}
            >
              Settings
            </button>
          </div>

          {/* Action Button & User Profile Badge */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={handleStartSessionTrigger}
              className="px-3 md:px-4 py-2 bg-[#006875] hover:bg-slate-800 text-white font-extrabold text-[10px] md:text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer items-center gap-1.5 flex uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-xs md:text-sm font-bold">bolt</span>
              <span>Start Studying</span>
            </button>
            
            <div className="flex items-center gap-2 md:gap-3 border-l border-gray-100 pl-3">
              <div 
                className="w-9 h-9 rounded-full border-2 border-[#00e5ff] overflow-hidden shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all" 
                onClick={() => setCurrentView("settings")}
                title="View Profile Settings"
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation sub-bar for easier mobile access */}
        <div className="md:hidden flex justify-around border-t border-gray-100 py-2.5 bg-gray-50 px-2">
          <button 
            onClick={() => setCurrentView("landing")}
            className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-gray-400 hover:text-[#006875]"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>Home</span>
          </button>
          <button 
            onClick={() => setCurrentView("dashboard")}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentView === "dashboard" ? "text-[#006875]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            <span>Explore</span>
          </button>
          <button 
            onClick={() => setCurrentView("progress")}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentView === "progress" ? "text-[#006875]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="material-symbols-outlined text-base">analytics</span>
            <span>Resources</span>
          </button>
          <button 
            onClick={() => setCurrentView("chat")}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentView === "chat" ? "text-[#006875]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="material-symbols-outlined text-base">forum</span>
            <span>Tutor Chat</span>
          </button>
          <button 
            onClick={() => setCurrentView("settings")}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
              currentView === "settings" ? "text-[#006875]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="material-symbols-outlined text-base">settings</span>
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content viewport container */}
      <div className="flex-1 overflow-y-auto">
        <main className="w-full">
          {currentView === "dashboard" && (
            <Dashboard 
              profile={profile}
              onViewChange={setCurrentView}
              onStartSession={handleStartSessionTrigger}
              onResumeSession={handleResumeSession}
              showToast={showToast}
            />
          )}

          {currentView === "chat" && (
            <TutorChat 
              session={activeSession}
              onBackToDashboard={() => setCurrentView("dashboard")}
              onUpdateSession={handleUpdateSession}
              showToast={showToast}
            />
          )}

          {currentView === "progress" && (
            <ProgressScreen 
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onViewChange={setCurrentView}
              showToast={showToast}
            />
          )}

          {currentView === "settings" && (
            <ProfileSettings 
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onViewChange={setCurrentView}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* 3. In-App Elegant Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-semibold transition-all ${
            toast.type === "success" 
              ? "bg-[#131b2e] text-[#00e5ff] border-[#00e5ff]/30" 
              : toast.type === "error" 
              ? "bg-red-900 text-red-100 border-red-500/30" 
              : "bg-gray-800 text-white border-gray-700"
          }`}>
            <span className="material-symbols-outlined text-lg">
              {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 4. Support Hub Help / Contact Overlay Drawer */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        defaultTab={supportDefaultTab}
        userEmail={profile.email}
        userName={profile.name}
        onAwardXp={handleAwardXp}
        showToast={showToast}
      />
    </div>
  );
}
