import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "help" | "contact";
  userEmail?: string;
  userName?: string;
  onAwardXp?: (xp: number) => void;
  showToast?: (message: string, type?: "success" | "info" | "error") => void;
}

const FAQS = [
  {
    category: "Tutoring",
    question: "How does the Socratic method work?",
    answer: "Unlike standard calculators or AI search engines, Socratic AI is trained not to give you the answer directly. It acts as an intuitive guide, asking strategic, digestible questions to point out mistakes, build mathematical concepts, and help you arrive at the final solution independently. This method increases learning retention by up to 85%!"
  },
  {
    category: "Camera OCR",
    question: "What kind of problems can I photograph?",
    answer: "You can capture physics diagrams, calculus integrations, chemical compounds, geometry questions, or handwritten formulas. Our multi-modal vision engine parses the text and visual relationships to identify formulas, variables, and diagrams, immediately breaking them down into study milestones."
  },
  {
    category: "XP & Streaks",
    question: "How do study streaks and Scholar XP work?",
    answer: "Every time you solve a milestone in a Socratic session, you earn +150 Scholar XP. Studying daily builds your streak counter. If you have streak notifications enabled in settings, you will receive real-time dashboard updates protecting your streak from expiring."
  },
  {
    category: "Accounts",
    question: "Can I sync my studies across devices?",
    answer: "Yes, Socratic AI runs in a persistent database sandbox. When you log in with your academic email address, your historic tutoring logs, streak records, study times, and mastery progress charts automatically sync in real-time."
  },
  {
    category: "Feedback",
    question: "How can I report a bad explanation?",
    answer: "You can report any response directly inside the Tutor Chat feed by telling the guide 'I am stuck' or selecting the corresponding helper chip. You can also write to us through the 'Contact Us' tab here to trigger manual reviews of specific textbook chapters."
  }
];

export default function SupportModal({
  isOpen,
  onClose,
  defaultTab = "help",
  userEmail = "",
  userName = "",
  onAwardXp,
  showToast
}: SupportModalProps) {
  const [activeTab, setActiveTab] = useState<"help" | "contact">(defaultTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Form states
  const [contactName, setContactName] = useState(userName || "");
  const [contactEmail, setContactEmail] = useState(userEmail || "");
  const [category, setCategory] = useState("Technical Issue");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !message.trim()) {
      showToast?.("Please complete all form fields.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const generatedId = `SOC-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      
      // Award XP to reward study feedback!
      if (onAwardXp) {
        onAwardXp(50);
      }
      showToast?.(`Ticket ${generatedId} created! Awarded +50 Scholar XP.`, "success");
    }, 1500);
  };

  const resetForm = () => {
    setMessage("");
    setIsSuccess(false);
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#131b2e]/65 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        id="support-modal-card"
        className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col z-10 transition-colors duration-300 max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#00e5ff]/15 rounded-2xl flex items-center justify-center text-[#006875] dark:text-[#00e5ff]">
            <span className="material-symbols-outlined text-2xl font-bold">contact_support</span>
          </div>
          <div>
            <h2 className="text-xl font-display font-extrabold text-[#131b2e] dark:text-white leading-none">Support & Help Hub</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Get immediate answers or open a direct line to our educators.</p>
          </div>
        </div>

        {/* Tabs Control */}
        <div className="flex bg-gray-50 dark:bg-slate-950 p-1 rounded-2xl border border-gray-100 dark:border-slate-800/80 mb-6">
          <button
            onClick={() => {
              setActiveTab("help");
              resetForm();
            }}
            className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "help"
                ? "bg-white dark:bg-slate-800 text-[#006875] dark:text-[#00e5ff] shadow-sm border border-gray-200/50 dark:border-slate-700/50"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <span className="material-symbols-outlined text-lg">help</span>
            Interactive Help Center
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "contact"
                ? "bg-white dark:bg-slate-800 text-[#006875] dark:text-[#00e5ff] shadow-sm border border-gray-200/50 dark:border-slate-700/50"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <span className="material-symbols-outlined text-lg">mail</span>
            Contact Socratic Team
          </button>
        </div>

        {/* Tab Content Canvas */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === "help" ? (
              <motion.div
                key="help-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* FAQ Search */}
                <div className="relative mb-6">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions, subjects, or concepts..."
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#00e5ff] outline-none text-gray-700 dark:text-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <span className="material-symbols-outlined text-lg">cancel</span>
                    </button>
                  )}
                </div>

                {/* FAQ list */}
                <div className="space-y-3">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => {
                      const isExpanded = expandedFaq === index;
                      return (
                        <div
                          key={index}
                          className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors"
                        >
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-[#131b2e] dark:text-white hover:bg-gray-50 dark:hover:bg-slate-850/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-[#00e5ff]/10 text-[#006875] dark:text-[#00e5ff] text-[9px] font-extrabold uppercase rounded">
                                {faq.category}
                              </span>
                              <span>{faq.question}</span>
                            </div>
                            <span className={`material-symbols-outlined text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                              expand_more
                            </span>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden border-t border-gray-50 dark:border-slate-850"
                              >
                                <p className="p-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-[#f8fafc] dark:bg-slate-950/40">
                                  {faq.answer}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                      <span className="material-symbols-outlined text-4xl mb-2">find_in_page</span>
                      <p className="text-sm">No answers matching "{searchQuery}" found.</p>
                      <button
                        onClick={() => setActiveTab("contact")}
                        className="text-xs font-bold text-[#00e5ff] mt-2 underline"
                      >
                        Ask the team directly instead
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="contact-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {!isSuccess ? (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase block">Full Name</label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00e5ff] outline-none text-gray-700 dark:text-white"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase block">Academic Email</label>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="email@academy.edu"
                          className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00e5ff] outline-none text-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase block">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#00e5ff] outline-none text-gray-700 dark:text-white font-semibold cursor-pointer"
                      >
                        <option value="Technical Issue">Technical / Vision OCR Issue</option>
                        <option value="Curriculum Inquiry">Curriculum Content Suggestion</option>
                        <option value="Socratic Chat Feedback">Socratic Chat Evaluation</option>
                        <option value="Account Billing">Premium Account Access</option>
                        <option value="General feedback">General Feedback & Ideas</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase block">Detailed Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write down details about the study issue, formula error, or questions you have. The Socratic support team is ready to assist!"
                        rows={4}
                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00e5ff] outline-none text-gray-700 dark:text-white resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#131b2e] dark:bg-[#00daf3] text-[#00e5ff] dark:text-[#131b2e] font-bold text-sm py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Submitting Case...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">send</span>
                          <span>Submit Support Case</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold animate-bounce">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">Support Case Created!</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">Our academic and technical guides will review your report within 4 hours.</p>
                    </div>

                    <div className="bg-[#f8fafc] dark:bg-slate-950 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 inline-block">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">Case reference number</p>
                      <p className="text-base font-mono font-bold text-[#006875] dark:text-[#00e5ff] mt-1">{ticketId}</p>
                    </div>

                    <div className="flex justify-center items-center gap-1.5 text-xs text-amber-500 font-bold">
                      <span className="material-symbols-outlined text-lg">military_tech</span>
                      <span>Feedback Reward Gained: +50 Scholar XP added to your dashboard!</span>
                    </div>

                    <div className="pt-4 flex gap-3 justify-center">
                      <button
                        onClick={resetForm}
                        className="px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        Submit another case
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("help");
                          resetForm();
                        }}
                        className="px-4 py-2.5 bg-[#006875] text-white rounded-xl font-bold text-xs hover:brightness-110 transition-colors cursor-pointer"
                      >
                        Back to FAQs
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Info */}
        <div className="border-t border-gray-100 dark:border-slate-800 pt-4 mt-6 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500">
          <p>Academic Socratic support is active 24/7 during semesters.</p>
          <p className="font-semibold text-[#006875] dark:text-[#00e5ff]">Live support latency: ~4 min</p>
        </div>
      </motion.div>
    </div>
  );
}
