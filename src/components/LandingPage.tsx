import React, { useState } from "react";
import { motion } from "motion/react";
import { ViewType } from "../types";
// @ts-ignore
import socraticLearning3DImg from "../assets/images/socratic_learning_3d_1784569093913.jpg";

interface LandingPageProps {
  onGetStarted: (email: string, name?: string) => void;
  onViewChange: (view: ViewType) => void;
  onOpenSupport?: (tab: "help" | "contact") => void;
  showToast?: (message: string, type?: "success" | "info" | "error") => void;
}

export default function LandingPage({ onGetStarted, onViewChange, onOpenSupport, showToast }: LandingPageProps) {
  const [email, setEmail] = useState("");

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Interactive Synapse States to keep user highly engaged and retained
  const [socraticQuotient, setSocraticQuotient] = useState(135);
  const [activeNodeId, setActiveNodeId] = useState<string | null>("math");
  const [activatedNodes, setActivatedNodes] = useState<string[]>(["math"]);
  const [gaugePulse, setGaugePulse] = useState(false);

  const synapseNodes = [
    { id: "math", label: "Calculus III", icon: "functions", color: "from-[#006875] to-[#00daf3]", desc: "Explore limits, derivatives, and multi-variable integration.", challenge: "What happens to the rate of change when the gradient vector is perpendicular to the tangent?" },
    { id: "biology", label: "Biology Lab", icon: "science", color: "from-emerald-500 to-teal-400", desc: "Examine mitochondrial matrix ATP synthesis cycles.", challenge: "How does the hydrogen ion concentration gradient drive the ATP synthase rotor?" },
    { id: "chemistry", label: "Chemistry", icon: "polymer", color: "from-purple-500 to-pink-500", desc: "Discover molecular bonds and orbital geometry.", challenge: "Why does water have a bent shape despite having four electron domains?" },
    { id: "physics", label: "Physics", icon: "blur_on", color: "from-amber-500 to-orange-500", desc: "Investigate gravity, kinetics, and quantum systems.", challenge: "How does conservation of angular momentum affect a collapsing star's spin rate?" },
    { id: "tech", label: "AI & CS", icon: "memory", color: "from-blue-600 to-indigo-500", desc: "Trace logic gates and modern transformer attention heads.", challenge: "How does scalar dot-product attention calculate relevance scores between query and key tokens?" }
  ];

  const handleNodeClick = (nodeId: string) => {
    const node = synapseNodes.find(n => n.id === nodeId);
    if (!node) return;
    setActiveNodeId(nodeId);
    if (!activatedNodes.includes(nodeId)) {
      setActivatedNodes(prev => [...prev, nodeId]);
      setSocraticQuotient(prev => prev + 15);
      showToast?.(`Synapse activated! Added +15 Socratic Quotient.`, "success");
    }
    setGaugePulse(true);
    setTimeout(() => setGaugePulse(false), 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setAuthEmail(email);
      setAuthTab("signup");
      setAuthName("");
      setAuthPassword("");
      setIsAuthModalOpen(true);
    } else {
      setAuthEmail("");
      setAuthTab("signup");
      setAuthName("");
      setAuthPassword("");
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      showToast?.("Please fill out all required fields.", "error");
      return;
    }
    if (authTab === "signup" && !authName.trim()) {
      showToast?.("Please enter your name.", "error");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthModalOpen(false);
      onGetStarted(authEmail, authTab === "signup" ? authName : undefined);
    }, 1200); // Simulated authentication transition
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased selection:bg-[#00e5ff] selection:text-[#131b2e]">
      {/* Top Navbar */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <nav className="flex justify-between items-center px-6 md:px-16 w-full max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange("landing")}>
            <span className="material-symbols-outlined text-[#006875] text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              psychology
            </span>
            <span className="font-display text-xl font-extrabold text-[#006875] tracking-tight">Socratic AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => onViewChange("landing")} className="font-medium text-[#006875] border-b-2 border-[#006875] pb-1 cursor-pointer">
              Home
            </button>
            <button onClick={() => onViewChange("dashboard")} className="font-medium text-gray-500 hover:text-[#006875] transition-colors cursor-pointer">
              Explore
            </button>
            <button onClick={() => onViewChange("progress")} className="font-medium text-gray-500 hover:text-[#006875] transition-colors cursor-pointer">
              Resources
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setAuthTab("login");
                setAuthEmail("");
                setAuthPassword("");
                setIsAuthModalOpen(true);
              }} 
              className="font-semibold text-sm px-4 py-2 rounded-lg text-[#006875] hover:bg-[#00e5ff]/10 active:scale-95 transition-all cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={() => {
                setAuthTab("signup");
                setAuthEmail("");
                setAuthPassword("");
                setAuthName("");
                setIsAuthModalOpen(true);
              }} 
              className="font-semibold text-sm px-4 py-2 rounded-lg bg-[#006875] text-white shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="relative overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#00e5ff] opacity-10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-12 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[80vh]">
          {/* Left Text Column */}
          <div className="md:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-full">
              <span className="material-symbols-outlined text-[#006875] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="text-xs text-[#006875] font-extrabold tracking-wider">NEW VERSION 2.0 RELEASED</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#131b2e] tracking-tight leading-none">
              Master any subject with a <span className="text-[#006875] bg-gradient-to-r from-[#006875] to-[#00daf3] bg-clip-text text-transparent italic font-serif pr-2">personal tutor</span> that guides you.
            </h1>

            <p className="text-gray-500 text-lg max-w-lg leading-relaxed">
              Instead of just giving you the answer, Socratic AI uses guided inquiry to help you build intuition and long-term knowledge retention.
            </p>

            {/* Start Your Journey Form Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:border-[#00e5ff]/50 transition-all max-w-md">
              <h3 className="text-lg font-bold text-[#131b2e] mb-1">Start your journey</h3>
              <p className="text-gray-400 text-sm mb-4">Join thousands of students using AI to learn deeper.</p>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your academic email"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00e5ff] focus:border-[#006875] outline-none transition-all"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#131b2e] text-[#00e5ff] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#0d1321] active:scale-95 transition-all cursor-pointer"
                >
                  Next
                </button>
              </form>
            </div>
          </div>

          {/* Right Image/Graphic Column with 3D Hologram, Rotating Accents, and Auto-cycling Socratic dialogue preview */}
          <div className="md:col-span-6 relative flex justify-center items-center py-12 md:py-0">
            {/* Spinning decorative background ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[440px] h-[440px] border-2 border-dashed border-gray-200/60 dark:border-slate-800 rounded-full pointer-events-none hidden sm:block"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[320px] h-[320px] border border-dashed border-[#00e5ff]/20 rounded-full pointer-events-none hidden sm:block"
            />

            {/* Glowing background blob */}
            <div className="absolute w-72 h-72 bg-[#00e5ff]/15 dark:bg-[#00e5ff]/5 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              {/* Beautiful 3D character illustration floating */}
              <motion.img
                src="https://lh3.googleusercontent.com/aida/AP1WRLvJ6uaperWacOBpBbLVri8usP9lb6tneBsR675zv1UeQZeh-B8HL_-MnSPY6VC5VRta2GE76HN9un-okBf3gvMp_4bsmkPuKh2M6EYSsfg3autEeBSM7PJGxo_tPV8AdS15B_yqpvhUT1EvDKqy9m3vRWdQi0VCVvdnPpeQg6GXZEI51xB_x6gUF4evrGL5hpxtt2FFdqec9e0tPr9NGY73-YdfSe8LlumqNesD6L071K2zicGFGYZUlw"
                alt="AI Tutor Student Hologram interaction"
                referrerPolicy="no-referrer"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="object-contain w-full h-full max-h-[460px] relative z-10"
              />

              {/* Beautiful interactive floating Calculus, Biology, and Chemistry badges that are fully clickable */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => handleNodeClick("math")}
                className="absolute top-6 right-6 z-20 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <div className={`bg-white dark:bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl border transition-all ${
                  activeNodeId === "math" ? "border-[#00e5ff] ring-2 ring-[#00e5ff]/20" : "border-gray-100 dark:border-slate-700/50"
                }`}>
                  <span className="material-symbols-outlined text-[#006875] dark:text-[#00e5ff] text-base font-bold">functions</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Calculus III</span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => handleNodeClick("biology")}
                className="absolute bottom-12 left-2 z-20 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <div className={`bg-white dark:bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl border transition-all ${
                  activeNodeId === "biology" ? "border-emerald-400 ring-2 ring-emerald-400/20" : "border-gray-100 dark:border-slate-700/50"
                }`}>
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-base font-bold">science</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Biology Lab</span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                onClick={() => handleNodeClick("chemistry")}
                className="absolute top-28 left-6 z-20 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <div className={`bg-white dark:bg-slate-800/90 backdrop-blur-md px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-xl border transition-all ${
                  activeNodeId === "chemistry" ? "border-purple-400 ring-2 ring-purple-400/20" : "border-gray-100 dark:border-slate-700/50"
                }`}>
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm font-bold">polymer</span>
                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">Chemistry</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3D Active Learning Spotlight Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white dark:from-slate-900/40 dark:to-slate-950/40 py-16 md:py-24 border-t border-gray-100 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text / Action Column */}
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00e5ff]/10 text-[#006875] dark:text-[#00e5ff] rounded-full text-xs font-black uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">school</span>
                  The Socratic Study Method
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
                  A Brand New <br />
                  <span className="text-[#006875] dark:text-[#00daf3] underline decoration-wavy decoration-[#00daf3]">Dimension</span> of Learning
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed font-medium">
                  Watch complex academic disciplines transform into delightful 3D cognitive milestones. Socratic AI engages you in active guided dialogue, helping you decipher complicated calculus, biology matrices, or organic chemistry structures with playful ease.
                </p>
                
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setAuthTab("signup");
                      setAuthEmail("");
                      setAuthPassword("");
                      setAuthName("");
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-3 bg-[#131b2e] hover:bg-slate-800 dark:bg-[#00e5ff] dark:hover:bg-[#00daf3] text-white dark:text-[#131b2e] font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Start Studying Free
                  </button>
                  <button
                    onClick={() => onViewChange("chat")}
                    className="px-6 py-3 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-extrabold text-sm rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Explore AI Demo
                  </button>
                </div>
              </div>

              {/* 3D Image Column */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-950/5 dark:border-white/5 p-2 bg-white dark:bg-slate-900 group"
                >
                  <div className="absolute inset-0 rounded-[24px] border border-[#006875]/10 pointer-events-none group-hover:border-[#00e5ff]/40 transition-colors duration-300" />
                  <img
                    src={socraticLearning3DImg}
                    alt="Socratic interactive 3D learning characters studying together"
                    className="w-full h-auto rounded-[24px] object-cover hover:scale-[1.01] transition-transform duration-500 shadow-sm"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>


        {/* Academic Proof Banner */}
        <section className="bg-white py-10 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6 md:px-16 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Empowering Students Across Leading School Networks</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              {/* Lahore Grammar School (LGS) */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 hover:border-[#00e5ff]/30 px-5 py-3 rounded-2xl transition-all shadow-xs group">
                <div className="w-8 h-8 rounded-xl bg-[#0f2c59]/10 flex items-center justify-center text-[#0f2c59]">
                  <span className="material-symbols-outlined text-lg font-bold">workspace_premium</span>
                </div>
                <div className="text-left">
                  <span className="font-display font-extrabold text-[#131b2e] text-xs block tracking-tight">LGS</span>
                  <span className="text-[10px] text-gray-400 font-medium block leading-none">Lahore Grammar School</span>
                </div>
              </div>

              {/* Beaconhouse School System */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 hover:border-[#00e5ff]/30 px-5 py-3 rounded-2xl transition-all shadow-xs group">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <span className="material-symbols-outlined text-lg font-bold">wb_incandescent</span>
                </div>
                <div className="text-left">
                  <span className="font-display font-extrabold text-[#131b2e] text-xs block tracking-tight">Beaconhouse</span>
                  <span className="text-[10px] text-gray-400 font-medium block leading-none">School System</span>
                </div>
              </div>

              {/* The City School */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 hover:border-[#00e5ff]/30 px-5 py-3 rounded-2xl transition-all shadow-xs group">
                <div className="w-8 h-8 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600">
                  <span className="material-symbols-outlined text-lg font-bold">account_balance</span>
                </div>
                <div className="text-left">
                  <span className="font-display font-extrabold text-[#131b2e] text-xs block tracking-tight">The City School</span>
                  <span className="text-[10px] text-gray-400 font-medium block leading-none">Globally Aligned</span>
                </div>
              </div>

              {/* Roots International Schools & Colleges */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 hover:border-[#00e5ff]/30 px-5 py-3 rounded-2xl transition-all shadow-xs group">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined text-lg font-bold">park</span>
                </div>
                <div className="text-left">
                  <span className="font-display font-extrabold text-[#131b2e] text-xs block tracking-tight">Roots International</span>
                  <span className="text-[10px] text-gray-400 font-medium block leading-none">Schools & Colleges</span>
                </div>
              </div>

              {/* Froebel's International School */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 hover:border-[#00e5ff]/30 px-5 py-3 rounded-2xl transition-all shadow-xs group">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
                  <span className="material-symbols-outlined text-lg font-bold">auto_stories</span>
                </div>
                <div className="text-left">
                  <span className="font-display font-extrabold text-[#131b2e] text-xs block tracking-tight">Froebel's</span>
                  <span className="text-[10px] text-gray-400 font-medium block leading-none">International School</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Schools (Bento Layout) */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#131b2e] tracking-tight">Trusted by Schools Globally</h2>
            <div className="w-16 h-1 bg-[#006875] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bento Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 border-l-4 border-l-[#006875] hover:shadow-md hover:border-[#00e5ff]/40 transition-all group">
              <div className="w-10 h-10 bg-[#00e5ff]/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00e5ff]/35 transition-colors">
                <span className="material-symbols-outlined text-[#006875]">verified</span>
              </div>
              <h4 className="text-lg font-bold text-[#131b2e] mb-2">Accredited Content</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Curriculum-aligned materials designed by academic experts across STEM and Humanities.</p>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 border-l-4 border-l-[#006875] hover:shadow-md hover:border-[#00e5ff]/40 transition-all group">
              <div className="w-10 h-10 bg-[#00e5ff]/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00e5ff]/35 transition-colors">
                <span className="material-symbols-outlined text-[#006875]">security</span>
              </div>
              <h4 className="text-lg font-bold text-[#131b2e] mb-2">Privacy First</h4>
              <p className="text-gray-500 text-sm leading-relaxed">FERPA and GDPR compliant data structures ensuring student identity remains protected.</p>
            </div>

            {/* Bento Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 border-l-4 border-l-[#006875] hover:shadow-md hover:border-[#00e5ff]/40 transition-all group">
              <div className="w-10 h-10 bg-[#00e5ff]/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00e5ff]/35 transition-colors">
                <span className="material-symbols-outlined text-[#006875]">monitoring</span>
              </div>
              <h4 className="text-lg font-bold text-[#131b2e] mb-2">Insight Analytics</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Advanced tracking for educators to identify learning gaps in real-time within classrooms.</p>
            </div>

            {/* Bento Card 4 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 border-l-4 border-l-[#006875] hover:shadow-md hover:border-[#00e5ff]/40 transition-all group">
              <div className="w-10 h-10 bg-[#00e5ff]/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#00e5ff]/35 transition-colors">
                <span className="material-symbols-outlined text-[#006875]">language</span>
              </div>
              <h4 className="text-lg font-bold text-[#131b2e] mb-2">Multilingual Support</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Supporting over 40 languages to make high-quality tutoring accessible for every student.</p>
            </div>
          </div>
        </section>

        {/* Call to Action CTA */}
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-12 mb-16">
          <div className="relative bg-[#131b2e] rounded-3xl p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to revolutionize your learning?</h2>
              <p className="text-[#00e5ff] text-base">Get unlimited access to the Socratic AI Tutor for $0 today.</p>
            </div>
            <div className="relative z-10">
              <button
                onClick={() => {
                  setAuthTab("signup");
                  setAuthEmail("");
                  setAuthPassword("");
                  setAuthName("");
                  setIsAuthModalOpen(true);
                }}
                className="bg-[#00e5ff] text-[#131b2e] px-8 py-4 rounded-full font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006875] text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                psychology
              </span>
              <span className="font-display font-extrabold text-[#006875]">Socratic AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering the next generation of learners through artificial intelligence and Socratic pedagogy.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">Product</h5>
            <ul className="space-y-1 text-sm text-gray-500">
              <li><button onClick={() => onViewChange("dashboard")} className="hover:text-[#006875] cursor-pointer">Dashboard</button></li>
              <li><button onClick={() => onViewChange("chat")} className="hover:text-[#006875] cursor-pointer">AI Tutor Chat</button></li>
              <li><button onClick={() => onViewChange("progress")} className="hover:text-[#006875] cursor-pointer">Mastery Analytics</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">Company</h5>
            <ul className="space-y-1 text-sm text-gray-500">
              <li><button onClick={() => onViewChange("landing")} className="hover:text-[#006875] cursor-pointer">About Us</button></li>
              <li><a href="#" className="hover:text-[#006875]">Careers</a></li>
              <li><a href="#" className="hover:text-[#006875]">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">Support</h5>
            <ul className="space-y-1 text-sm text-gray-500">
              <li><button onClick={() => onOpenSupport ? onOpenSupport("help") : onViewChange("settings")} className="hover:text-[#006875] cursor-pointer">Help Center</button></li>
              <li><button onClick={() => onOpenSupport ? onOpenSupport("contact") : onViewChange("settings")} className="hover:text-[#006875] cursor-pointer">Contact Us</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-16 border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 Socratic AI Tutor. All rights reserved.</p>
          
          {/* Social Media Branding Icons */}
          <div className="flex gap-4 items-center">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#00e5ff]/20 text-gray-500 hover:text-[#006875] flex items-center justify-center transition-all shadow-sm" title="Follow us on X/Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#00e5ff]/20 text-gray-500 hover:text-[#006875] flex items-center justify-center transition-all shadow-sm" title="Join our Facebook community">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#00e5ff]/20 text-gray-500 hover:text-[#006875] flex items-center justify-center transition-all shadow-sm" title="Follow us on LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#00e5ff]/20 text-gray-500 hover:text-[#006875] flex items-center justify-center transition-all shadow-sm" title="Subscribe to our YouTube Channel">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          <div className="flex gap-4 text-xs text-gray-400">
            <span>English (US)</span>
            <span>Cookie Preferences</span>
          </div>
        </div>
      </footer>

      {/* Elegant Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute inset-0 bg-[#131b2e]/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-100 overflow-hidden z-10"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Header / Brand */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-[#00e5ff]/10 rounded-2xl flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[#006875] text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#131b2e]">Socratic AI Academy</h3>
              <p className="text-gray-400 text-xs mt-1">Unlock critical intuition & deep knowledge retention</p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 mb-6 relative">
              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all relative z-10 cursor-pointer ${
                  authTab === "login" ? "text-[#006875]" : "text-gray-400"
                }`}
              >
                Log In
                {authTab === "login" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 z-[-1]"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("signup")}
                className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all relative z-10 cursor-pointer ${
                  authTab === "signup" ? "text-[#006875]" : "text-gray-400"
                }`}
              >
                Sign Up
                {authTab === "signup" && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50 z-[-1]"
                  />
                )}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === "signup" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      person
                    </span>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#00e5ff] focus:border-[#006875] outline-none transition-all text-gray-700"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Academic Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    mail
                  </span>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="student@academy.edu"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#00e5ff] focus:border-[#006875] outline-none transition-all text-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    lock
                  </span>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#00e5ff] focus:border-[#006875] outline-none transition-all text-gray-700"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#131b2e] text-[#00e5ff] hover:bg-[#0d1321] active:scale-[0.98] py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#00e5ff]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      {authTab === "login" ? "login" : "person_add"}
                    </span>
                    <span>{authTab === "login" ? "Sign In & Explore" : "Create Account"}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-gray-400 border-t border-gray-50 pt-4 flex flex-col gap-1.5">
              <p>🔒 Demo Access: Any email and password will work</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
