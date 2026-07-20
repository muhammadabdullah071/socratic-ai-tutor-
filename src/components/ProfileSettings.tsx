import React, { useState, useEffect, useRef } from "react";
import { ViewType, StudentProfile } from "../types";

interface ProfileSettingsProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onViewChange: (view: ViewType) => void;
  showToast?: (message: string, type?: "success" | "info" | "error") => void;
}

const AVATAR_PRESETS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCK3XqbQ4ye1J0a0K-TCvNnN70pxA_FuRbhZPNP6KOdU8FsTAettbqBKhd6x95Cr22KnkuyxfYw78ksnb0NJc2DxYXIKVzyIjKgxM2FbD6AIjjERkc5O1eT5C-w255yV3xn3B03m2te7Shm-sNnUr1c3z1_mSyKByjCNKJKecwdXL6_V528zh_Hpa2Ik5-qfA7MnNu7ZgKbXaPPZ4iG4Ocz5wAXBsgIKNac1BS9Tu2AePhouDUzm7x4",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDkspgES6to8OH-P01JUQT5ouP-qrpKJfuJfYZXWIrvkstUNVwcAlbS2L1WzZ9v7hUmiP1NwWnc_J1UUqfqMkYrbuSGc6gMOJZ6iLisiUw6iFeVqnIKJSZM85qCaOGW7h9kRFGwEKapp7bEUpTSJeHlN_rMwU_fezfxes7lywTUe2lwkiUvn_h1nSuig7ZYvMWXiS5spe0tCYxIKovEaHmxQjSP8mStkqWwzjpGvDEI8fKScwvi9EzI",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256",
];

export default function ProfileSettings({ profile, onUpdateProfile, onViewChange, showToast }: ProfileSettingsProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [level, setLevel] = useState(profile.level);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  
  // Notification States
  const [emailNotif, setEmailNotif] = useState(profile.emailNotifications);
  const [streakAlerts, setStreakAlerts] = useState(profile.streakAlerts);

  // Theme Toggler
  const [isDarkMode, setIsDarkMode] = useState(profile.isDarkMode);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Keep visual settings synced with profile changes
  useEffect(() => {
    setIsDarkMode(profile.isDarkMode);
  }, [profile.isDarkMode]);

  // Live Sync Dark Mode
  const toggleTheme = (dark: boolean) => {
    setIsDarkMode(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save theme change globally immediately
    onUpdateProfile({
      ...profile,
      isDarkMode: dark,
    });
  };

  const handleSave = () => {
    onUpdateProfile({
      ...profile,
      name,
      email,
      level,
      avatarUrl,
      isDarkMode,
      emailNotifications: emailNotif,
      streakAlerts,
    });

    if (emailNotif) {
      showToast?.(`Academic digest subscription active! Weekly reports will be sent to ${email}.`, "success");
    } else {
      showToast?.("Profile saved successfully!", "success");
    }
  };

  // Local File Upload Reader (supports Drag and Drop as well as click)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processImageFile(file);
  };

  const processImageFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast?.("Please select a valid image file.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        showToast?.("Custom profile photo applied!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processImageFile(file);
  };

  const academicLevels = ["A-Level", "O-Level", "Local Board", "Regional Curriculum"] as const;

  return (
    <div className="flex-1 min-h-screen bg-[#f7f9fb] p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="pb-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#131b2e]">Student Profile & Settings</h1>
          <p className="text-sm text-gray-500">Configure your curriculum level, account settings, and visual themes.</p>
        </div>

        {/* Profile Card details */}
        <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center transition-colors">
          {/* Large Avatar container */}
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-24 h-24 rounded-full border-4 border-[#00e5ff] overflow-hidden shadow-md relative group">
              <img
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#131b2e]">{name}</h3>
              <p className="text-xs text-[#006875] font-extrabold uppercase bg-[#00e5ff]/10 px-2.5 py-1 rounded-full mt-1.5 inline-block">
                {level} Scholar
              </p>
            </div>
          </div>

          {/* Account information input */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Scholar Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00e5ff] outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00e5ff] outline-none"
                />
              </div>
            </div>

            {/* Level Selector Toggle chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase block">Curriculum / Level Selector</label>
              <div className="flex flex-wrap gap-2">
                {academicLevels.map((lvl) => {
                  const isSelected = level === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#006875] text-white shadow-sm"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Profile Image Customizer Section (Drag and Drop / presets) */}
        <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-bold text-[#131b2e]">Custom Profile Image</h3>
            <p className="text-xs text-gray-400 mt-1">Upload a photo, drag one in, or choose from ready-made academic avatar presets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Drag & Drop File upload container */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging 
                  ? "border-[#00e5ff] bg-[#00e5ff]/5" 
                  : "border-gray-200 hover:border-[#00e5ff] bg-gray-50"
              }`}
            >
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
                cloud_upload
              </span>
              <p className="text-xs font-bold text-gray-700">Drag & drop your photo here</p>
              <p className="text-[10px] text-gray-400 mt-1">or click to browse your files (PNG, JPG)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Presets and URL picker */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase block">Scholar Avatar Presets</label>
                <div className="flex items-center gap-3">
                  {AVATAR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setAvatarUrl(preset);
                        showToast?.("Scholar preset applied!", "success");
                      }}
                      className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                        avatarUrl === preset ? "border-[#00e5ff] scale-105 shadow-md" : "border-gray-200"
                      }`}
                    >
                      <img src={preset} alt={`preset ${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase block">Or Image URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={avatarUrl.startsWith("data:") ? "" : avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value || profile.avatarUrl)}
                    placeholder="https://example.com/avatar.png"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-xs focus:ring-2 focus:ring-[#00e5ff] outline-none"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    link
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Panels */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Notification toggles card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 transition-colors">
            <h3 className="text-base font-bold text-gray-800">Alert Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-700">Email updates</p>
                  <p className="text-xs text-gray-400">Receive weekly mastery and analytics reports</p>
                </div>
                <button 
                  onClick={() => {
                    const next = !emailNotif;
                    setEmailNotif(next);
                    showToast?.(next ? "Weekly reports active!" : "Weekly report emails disabled.", "info");
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer relative ${
                    emailNotif ? "bg-[#00e5ff]" : "bg-gray-200"
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    emailNotif ? "translate-x-6" : ""
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">Streak notifications</p>
                  <p className="text-xs text-gray-400">Daily reminder to maintain your study progress streak</p>
                </div>
                <button 
                  onClick={() => {
                    const next = !streakAlerts;
                    setStreakAlerts(next);
                    showToast?.(next ? "Streak interface alerts active!" : "Streak interface alerts hidden.", "info");
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer relative ${
                    streakAlerts ? "bg-[#00e5ff]" : "bg-gray-200"
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    streakAlerts ? "translate-x-6" : ""
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Visual Settings card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 transition-colors">
            <h3 className="text-base font-bold text-gray-800">Visual Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-700">Visual Theme</p>
                  <p className="text-xs text-gray-400">Optimized for clean, bright high-contrast learning</p>
                </div>
                <span className="px-4 py-2 bg-gray-100 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-700">
                  <span className="material-symbols-outlined text-base">
                    light_mode
                  </span>
                  Light Mode
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">Database Connection</p>
                  <p className="text-xs text-gray-400">Manage real-time Firestore sync and secure caches</p>
                </div>
                <span className="text-xs font-bold text-[#006875] bg-[#00e5ff]/10 px-2.5 py-1 rounded-full">
                  Fully Connected
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action buttons */}
        <div className="flex gap-4 justify-end">
          <button 
            onClick={() => onViewChange("dashboard")}
            className="px-6 py-3 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-[#006875] text-white font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
