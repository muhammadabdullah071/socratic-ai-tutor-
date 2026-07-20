import React from "react";
import { ViewType, ActiveSession, StudentProfile } from "../types";

interface DashboardProps {
  profile: StudentProfile;
  onViewChange: (view: ViewType) => void;
  onStartSession: () => void;
  onResumeSession: (session: ActiveSession) => void;
  showToast?: (message: string, type?: "success" | "info" | "error") => void;
}

export default function Dashboard({ profile, onViewChange, onStartSession, onResumeSession, showToast }: DashboardProps) {
  // Preconfigured historical sessions that the user can resume with full Socratic AI functionality!
  const recentSessions = [
    {
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
          id: "1",
          role: "assistant" as const,
          content: "Great start on the energy conservation! You've correctly identified that kinetic energy at the bottom is equal to the potential energy at the start.\n\nNow, focusing on the lowest point, what are the two main forces acting on the mass in the vertical direction?",
          timestamp: new Date(),
        },
      ],
      cardImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWbXm4vRW_MytqGxC-5-2w2C_5teQBfUxEc2iNHvfUInM-pEAR21ao5Y8dRtMLi0oNDTyl6z5M0xVzqwqpAE5UaLUKiHoWfMKh00rMkFeEjZ03GnfpadEu_dq9nZH-bqUHhlyTdAJcibvDHgYbkYv-_acojjLp7jkW_HZEjO3a1U57q-3EDcRdr--HufM96f-ff9M3IGCntT9D260fo-4ZjgjIMaox7FGMJvB-k-ITtugPalT5rGzl",
      date: "Oct 24, 2026",
    },
    {
      subject: "Math",
      topic: "Definite Integrals",
      question: "Evaluate the definite integral of x^2 * sin(x) from x=0 to x=pi/2.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEJlWY_0h9iudQe3PmUzWtCWfNd8fGqXaH3qwD5fAQlh4uLr1MxJJf01acjq1ePpmLlDipRehROUHu37akabdnIRyNkvH__U9O3cXr2rF2zSxXHbK9wgCzc0ntxebGG3Sij7Yd7OOzmCuXfhb4OZvIX3Exful7SlYCWt4YSSJvedRuEuHrn_6fbmkLzi0X7MwwmO8pxgN2XaptlDB_L69SUhM6zhNuX5CEmDde7yTjWg9u4T47E9d_",
      milestones: [
        "Identify parts for Integration by Parts (u and dv)",
        "Apply integration by parts formula twice",
        "Evaluate limits from 0 to pi/2 and simplify",
      ],
      currentMilestoneIndex: 0,
      messages: [
        {
          id: "1",
          role: "assistant" as const,
          content: "Hello! Definite integrals of products like x^2 * sin(x) can look intimidating, but Integration by Parts (IBP) is our perfect tool here.\n\nDo you remember how to choose our 'u' and 'dv' terms using the LIATE rule?",
          timestamp: new Date(),
        },
      ],
      cardImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEJlWY_0h9iudQe3PmUzWtCWfNd8fGqXaH3qwD5fAQlh4uLr1MxJJf01acjq1ePpmLlDipRehROUHu37akabdnIRyNkvH__U9O3cXr2rF2zSxXHbK9wgCzc0ntxebGG3Sij7Yd7OOzmCuXfhb4OZvIX3Exful7SlYCWt4YSSJvedRuEuHrn_6fbmkLzi0X7MwwmO8pxgN2XaptlDB_L69SUhM6zhNuX5CEmDde7yTjWg9u4T47E9d_",
      date: "Oct 22, 2026",
    },
    {
      subject: "Chemistry",
      topic: "Molecular Geometry",
      question: "Determine the molecular geometry and hybridization of the central nitrogen atoms in a caffeine molecule.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3fDJn5RZinREcqXPVqSECKu8bpXkzltu_u72aMYcrHYI_krttpVB4VaqQTGxywwWYjUSMN-lWGsWKFeZXmPuffg82lBIvAcehAKy4LzKjDAljPPXqWowvIgtyXlcIpcjwu4f5NgtbfbltDc9_ZeZYiFHdzgpnxihR0zTNJyxJ_wuKW3ivDmn72UpnxIdJ_e0zQVjP_42oU9m5bbTzihlM6_imN6NFIInoEEXEqtKFjaJHUKu9YXI_",
      milestones: [
        "Determine the valence electron shell configuration",
        "Calculate the steric number of the nitrogen atoms",
        "Assign hybridization and molecular shape VSEPR",
      ],
      currentMilestoneIndex: 0,
      messages: [
        {
          id: "1",
          role: "assistant" as const,
          content: "Let's crack the nitrogen hybridization in caffeine! To start, let's look at one of the ring nitrogen atoms. How many sigma bonds and lone pairs (steric number) does it possess?",
          timestamp: new Date(),
        },
      ],
      cardImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3fDJn5RZinREcqXPVqSECKu8bpXkzltu_u72aMYcrHYI_krttpVB4VaqQTGxywwWYjUSMN-lWGsWKFeZXmPuffg82lBIvAcehAKy4LzKjDAljPPXqWowvIgtyXlcIpcjwu4f5NgtbfbltDc9_ZeZYiFHdzgpnxihR0zTNJyxJ_wuKW3ivDmn72UpnxIdJ_e0zQVjP_42oU9m5bbTzihlM6_imN6NFIInoEEXEqtKFjaJHUKu9YXI_",
      date: "Oct 20, 2026",
    },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#f7f9fb] p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Streak Notification System Interface Alert Banner */}
        {profile.streakAlerts && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4 rounded-3xl flex items-center justify-between shadow-lg shadow-orange-500/10 animate-pulse border border-orange-400/20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined font-bold text-2xl">local_fire_department</span>
              <div>
                <span className="font-bold text-sm block">12-Day Streak Active & Protected!</span>
                <span className="text-xs opacity-90 block mt-0.5">Your daily learning reminder is active. Start a Socratic session now to extend your progress.</span>
              </div>
            </div>
            <button 
              onClick={onStartSession}
              className="bg-white text-orange-600 font-extrabold text-xs px-4 py-2 rounded-xl shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm font-bold">bolt</span>
              Practice Now
            </button>
          </div>
        )}

        {/* Top Header Row with Profile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-[#131b2e]">Welcome back, {profile.name}!</h1>
            <p className="text-sm text-gray-500">Ready to conquer your academic goals today?</p>
          </div>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewChange("settings")}>
            <div className="w-10 h-10 rounded-full border-2 border-[#00e5ff] overflow-hidden shadow-sm">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-700 leading-none">{profile.name}</p>
              <p className="text-xs text-gray-400 mt-1">{profile.level} Scholar</p>
            </div>
          </div>
        </div>

        {/* Hero Banner Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Work problem banner */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#006875] to-[#00daf3] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden text-white shadow-xl">
            <div className="z-10 space-y-3">
              <h2 className="text-3xl font-display font-extrabold tracking-tight">Stuck on a problem?</h2>
              <p className="text-base text-white/90 max-w-md">
                Scan your textbook or homework questions and get interactive, step-by-step Socratic tutoring instantly.
              </p>
            </div>
            <div className="mt-8 z-10">
              <button
                onClick={onStartSession}
                className="bg-white text-[#006875] px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                  camera
                </span>
                Scan a Question
              </button>
            </div>
            {/* Background absolute math icons decoration */}
            <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12 pointer-events-none">
              <span className="material-symbols-outlined text-[180px]">calculate</span>
            </div>
          </div>

          {/* Weekly Streak Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-4 shadow-sm transition-colors">
            <div className="w-14 h-14 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#006875]">
              <span className="material-symbols-outlined text-3xl font-bold">emoji_events</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-700">Weekly Streak</h3>
              <p className="text-3xl font-extrabold text-[#006875] mt-1">{profile.streakDays} Days</p>
              <p className="text-xs text-gray-400 mt-1">You're in the top 5% of learners this week!</p>
            </div>
          </div>
        </section>

        {/* Dynamic Achievements Banner */}
        <section className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm transition-colors">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">{profile.nextAchievement.icon}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">Active Achievement Track</span>
                <h3 className="text-base font-bold text-gray-800 mt-0.5">{profile.nextAchievement.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{profile.nextAchievement.description}</p>
              </div>
            </div>
            
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Progress Tracker</span>
                <span>{profile.nextAchievement.percent}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-700"
                  style={{ width: `${profile.nextAchievement.percent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Subject Mastery Overview Circular progress items */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#131b2e]">Subject Mastery Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.masteryTrends.map((trend, i) => {
              // Convert mastery percentage to SVG circle stroke dashoffset
              // Circumference is 2 * pi * r = 2 * 28 = 175.9
              const strokeOffset = 175.9 - (175.9 * trend.mastery) / 100;
              const isStalled = trend.trend.toLowerCase().includes("stalled");
              
              let iconName = "bolt";
              if (trend.subject.toLowerCase().includes("math")) iconName = "calculate";
              if (trend.subject.toLowerCase().includes("chem")) iconName = "science";
              
              return (
                <div 
                  key={i}
                  onClick={() => {
                    showToast?.(`Launching ${trend.subject} camera scan module...`, "success");
                    onStartSession();
                  }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#00e5ff]/50 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-[#dae2fd] rounded-lg text-[#006875] group-hover:bg-[#00e5ff]/20 transition-colors">
                      <span className="material-symbols-outlined text-xl">{iconName}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isStalled 
                        ? "text-red-500 bg-red-50" 
                        : "text-[#006875] bg-[#00e5ff]/10"
                    }`}>
                      {trend.trend}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-800 mb-3">{trend.subject}</h4>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-gray-100" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="5"></circle>
                        <circle className="text-[#006875]" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="5" strokeDasharray="175.9" strokeDashoffset={strokeOffset}></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">{trend.mastery}%</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Current Topic</p>
                      <p className="text-sm font-bold text-gray-700 group-hover:text-[#006875] transition-colors">{trend.topic}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Sessions List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#131b2e]">Recent Tutoring Sessions</h2>
            <button onClick={() => onViewChange("progress")} className="text-xs font-bold text-[#006875] hover:underline cursor-pointer">
              View History Archive
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentSessions.map((session, index) => (
              <div
                key={index}
                onClick={() => onResumeSession({
                  subject: session.subject,
                  topic: session.topic,
                  question: session.question,
                  imageUrl: session.imageUrl,
                  milestones: session.milestones,
                  currentMilestoneIndex: session.currentMilestoneIndex,
                  messages: session.messages,
                })}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-[#00e5ff]/50 group transition-all cursor-pointer"
              >
                <div className="h-32 relative bg-gray-100 overflow-hidden">
                  <img
                    src={session.cardImage}
                    alt={session.topic}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 px-2 py-1 bg-[#006875] text-white text-xs font-bold rounded">
                    {session.subject}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-[#131b2e] truncate">{session.topic}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400">{session.date}</span>
                    <span className="material-symbols-outlined text-[#006875] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Archive / Add Card */}
            <div
              onClick={onStartSession}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center hover:border-[#00e5ff] transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-gray-300 text-4xl group-hover:text-[#006875] transition-colors">
                add_circle
              </span>
              <p className="text-sm font-bold text-gray-400 mt-2 group-hover:text-[#006875] transition-colors">
                New Study Session
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
