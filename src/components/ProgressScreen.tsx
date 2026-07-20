import React, { useState } from "react";
import { ViewType, StudentProfile } from "../types";

interface ProgressScreenProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onViewChange: (view: ViewType) => void;
  showToast?: (message: string, type?: "success" | "info" | "error") => void;
}

export default function ProgressScreen({ profile, onUpdateProfile, onViewChange, showToast }: ProgressScreenProps) {
  const [newGoalText, setNewGoalText] = useState("");

  const toggleGoal = (id: string) => {
    const updatedGoals = profile.goals.map((g) =>
      g.id === id ? { ...g, done: !g.done } : g
    );
    
    // Calculate new XP for completing a goal (+50 XP) or unchecking (-50 XP)
    const targetGoal = profile.goals.find(g => g.id === id);
    const xpChange = targetGoal ? (targetGoal.done ? -50 : 50) : 0;

    onUpdateProfile({
      ...profile,
      goals: updatedGoals,
      xp: Math.max(0, profile.xp + xpChange),
    });

    if (targetGoal) {
      showToast?.(
        !targetGoal.done ? "Goal completed! +50 XP awarded." : "Goal unchecked.",
        "success"
      );
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    const newGoal = { id: Date.now().toString(), text: newGoalText.trim(), done: false };
    onUpdateProfile({
      ...profile,
      goals: [...profile.goals, newGoal],
    });

    setNewGoalText("");
    showToast?.("Added new learning goal!", "success");
  };

  const weeklyTotal = profile.studyData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);

  return (
    <div className="flex-1 min-h-screen bg-[#f7f9fb] p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Row */}
        <div className="pb-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#131b2e]">Mastery & Progress</h1>
          <p className="text-sm text-gray-500">Track your deep learning journey, streaks, and subject achievements.</p>
        </div>

        {/* Top Insights & Achievements */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Socratic learning insight summary */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center gap-3 text-[#006875]">
              <span className="material-symbols-outlined font-bold">lightbulb</span>
              <h3 className="text-lg font-bold text-gray-800">Learning Insights</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your active participation in the Socratic process shows rapid analytical acceleration. You're consistently identifying starting variables yourself (84% accuracy) and successfully formulating Newton's laws.
            </p>
            <div className="p-4 bg-[#00e5ff]/5 border border-[#00e5ff]/20 rounded-2xl flex items-center gap-4">
              <span className="material-symbols-outlined text-[#006875] text-2xl">trending_up</span>
              <div>
                <p className="text-xs text-gray-400">Core Improvement Indicator</p>
                <p className="text-sm font-bold text-gray-700">
                  {profile.level} core analytical performance has improved by 18% over the past 10 days.
                </p>
              </div>
            </div>
          </div>

          {/* Achievements / Trophy progress circle */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4 transition-colors">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Next Achievement</h4>
            <div className="relative w-28 h-28">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-gray-100" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="8"></circle>
                <circle 
                  className="text-amber-500" 
                  cx="56" 
                  cy="56" 
                  fill="transparent" 
                  r="48" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="301.6" 
                  strokeDashoffset={301.6 - (301.6 * profile.nextAchievement.percent) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-amber-500 text-3xl font-bold">{profile.nextAchievement.icon}</span>
                <span className="text-[10px] font-bold text-gray-700 mt-1 max-w-[80px] truncate">{profile.nextAchievement.title}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">{profile.nextAchievement.percent}% toward this milestone</p>
          </div>
        </section>

        {/* Study Dynamics bar chart & Problem Solved list */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Daily Study hours bar chart */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-6 transition-colors">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#131b2e]">Study Dynamics (Daily Hours)</h3>
                <span className="text-xs font-bold text-gray-400">Weekly Total: {weeklyTotal} Hrs</span>
              </div>

              {/* Custom Responsive CSS Bar chart */}
              <div className="h-48 flex items-end justify-between px-2 pt-4 border-b border-gray-50 pb-2">
                {profile.studyData.map((data, idx) => {
                  // Height percentage calculation based on max 5 hours
                  const barHeight = Math.min((data.hours / 5) * 100, 100);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group w-[10%] relative">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 bg-[#131b2e] text-[#00e5ff] text-[10px] font-bold px-1.5 py-1 rounded absolute -top-8 left-1/2 -translate-x-1/2 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow">
                        {data.hours}h
                      </div>
                      {/* Bar */}
                      <div 
                        className="w-full bg-[#dae2fd] group-hover:bg-[#00e5ff] rounded-t-lg transition-all duration-500 shadow-sm cursor-pointer"
                        style={{ height: `${barHeight}%`, minHeight: "8px" }}
                      ></div>
                      {/* Day label */}
                      <span className="text-xs font-medium text-gray-400">{data.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Study Logger */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Log homework study today:</span>
              <div className="flex gap-2">
                {[0.5, 1.0, 2.0].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
                      const targetIdx = todayIndex === 0 ? 6 : todayIndex - 1; // map Sun to last element
                      const updatedStudy = [...profile.studyData];
                      updatedStudy[targetIdx].hours = parseFloat((updatedStudy[targetIdx].hours + val).toFixed(1));
                      
                      // Also update profile minutes!
                      onUpdateProfile({
                        ...profile,
                        studyData: updatedStudy,
                        timeTodayMinutes: profile.timeTodayMinutes + val * 60,
                        xp: profile.xp + Math.floor(val * 100),
                      });
                      showToast?.(`Logged +${val} study hours! +${Math.floor(val * 100)} XP!`, "success");
                    }}
                    className="px-3 py-1.5 bg-[#dae2fd] text-[#006875] hover:bg-[#00e5ff]/20 hover:text-[#006875] text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
                  >
                    +{val}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Socratic Problems Solved Subject breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 transition-colors">
            <h3 className="text-base font-bold text-[#131b2e]">Problems Solved By Subject</h3>
            <div className="space-y-4">
              {profile.problemSolved.map((prob, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${prob.color}`}></div>
                    <span className="text-sm font-semibold text-gray-600">{prob.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#131b2e]">{prob.count}</span>
                    <span className="text-xs text-gray-400">solved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals & Mastery Trends */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active study goals checklist */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 transition-colors">
            <div className="space-y-4 w-full">
              <h3 className="text-base font-bold text-[#131b2e]">Learning Goals</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {profile.goals.map((g) => (
                  <div 
                    key={g.id}
                    onClick={() => toggleGoal(g.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      g.done 
                        ? "bg-gray-50 border-gray-100 text-gray-400 line-through"
                        : "bg-white border-gray-200 text-gray-700 font-medium"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-lg ${g.done ? "text-[#006875]" : "text-gray-300"}`}>
                      {g.done ? "check_box" : "check_box_outline_blank"}
                    </span>
                    <p className="text-sm leading-snug">{g.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom goal adder form */}
            <form onSubmit={handleAddGoal} className="pt-4 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Write a custom study milestone..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#00e5ff] outline-none transition-all"
                required
              />
              <button
                type="submit"
                className="bg-[#006875] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                Add Goal
              </button>
            </form>
          </div>

          {/* Mastery trends progress gauges */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 transition-colors">
            <h3 className="text-base font-bold text-[#131b2e]">Mastery Trends</h3>
            <div className="space-y-4">
              {profile.masteryTrends.map((trend, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>{trend.subject} ({trend.topic})</span>
                    <span className="text-[#006875]">{trend.mastery}% Mastered</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#006875] rounded-full transition-all duration-500" 
                      style={{ width: `${trend.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Analytics metric cards */}
        <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 transition-colors">
          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase">Streak Days</p>
            <p className="text-2xl font-extrabold text-[#131b2e]">{profile.streakDays} Days</p>
          </div>
          <div className="text-center space-y-1 border-l border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Time Today</p>
            <p className="text-2xl font-extrabold text-[#131b2e]">{profile.timeTodayMinutes} Mins</p>
          </div>
          <div className="text-center space-y-1 border-l border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Acquired XP</p>
            <p className="text-2xl font-extrabold text-[#131b2e]">{profile.xp.toLocaleString()} XP</p>
          </div>
          <div className="text-center space-y-1 border-l border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase">Global Rank</p>
            <p className="text-2xl font-extrabold text-[#131b2e]">#342</p>
          </div>
        </section>
      </div>
    </div>
  );
}
