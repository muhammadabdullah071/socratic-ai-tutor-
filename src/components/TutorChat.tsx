import React, { useState, useRef, useEffect } from "react";
import { Message, ActiveSession } from "../types";

interface TutorChatProps {
  session: ActiveSession;
  onBackToDashboard: () => void;
  onUpdateSession: (updated: ActiveSession) => void;
  showToast?: (message: string, type?: "success" | "info" | "error") => void;
}

export default function TutorChat({ session, onBackToDashboard, onUpdateSession, showToast }: TutorChatProps) {
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Custom Diagram / Image attachment states
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isThinking]);

  // Handle Socratic message post to server API
  const handleSendMessage = async (text: string) => {
    if (!text.trim() && !attachedImage) return;
    if (isThinking) return;

    // Create immediate user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
      imageUrl: attachedImage || undefined,
    };

    const updatedMessages = [...session.messages, userMessage];
    
    // Update frontend state immediately
    onUpdateSession({
      ...session,
      messages: updatedMessages,
    });
    
    setInputText("");
    setAttachedImage(null);
    setAttachedFileName(null);
    setIsThinking(true);

    try {
      const response = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          subject: session.subject,
          topic: session.topic,
          question: session.question,
          milestones: session.milestones,
          currentMilestoneIndex: session.currentMilestoneIndex,
        }),
      });

      if (!response.ok) {
        throw new Error("Tutor failed to respond.");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      onUpdateSession({
        ...session,
        messages: [...updatedMessages, assistantMessage],
      });
    } catch (error) {
      console.error("Error communicating with AI Tutor:", error);
      
      // Fallback message if server or network has an issue
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Oops! I encountered an issue thinking about that. Let's try to state your response again or check our calculations.",
        timestamp: new Date(),
      };
      onUpdateSession({
        ...session,
        messages: [...updatedMessages, errorMessage],
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  // Toggle milestone completion to track learning goals
  const toggleMilestone = (index: number) => {
    onUpdateSession({
      ...session,
      currentMilestoneIndex: index,
    });
  };

  // Trigger Socratic suggestion prompts
  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Web Speech API / Simulated voice recognition
  const triggerVoiceInput = () => {
    if (isListening) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setInputText("Listening to your voice...");
          showToast?.("Socratic voice detection active. Speak now!", "info");
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event);
          // If permission is blocked (common in iframes), run our premium simulation
          runSpeechSimulation();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setInputText(resultText);
          showToast?.("Voice transcription completed successfully!", "success");
        };

        recognition.start();
      } catch (err) {
        console.error("Speech recognition failed to start", err);
        runSpeechSimulation();
      }
    } else {
      runSpeechSimulation();
    }
  };

  const runSpeechSimulation = () => {
    setIsListening(true);
    setInputText("Recording... (Speak your answer)");
    showToast?.("Simulating voice input capture...", "info");
    
    // Staggered typing simulation representing the transcribed speech
    const simulatedPhrases = [
      "Let's look at the vertical tension forces acting on it.",
      "I believe we need to divide the final heat transfer by the number of moles.",
      "Could we simplify this by substituting the friction coefficient in?",
      "The net vertical force should equal mass times gravity, right?"
    ];
    
    const chosenPhrase = simulatedPhrases[Math.floor(Math.random() * simulatedPhrases.length)];
    
    setTimeout(() => {
      let currentWordIndex = 0;
      const words = chosenPhrase.split(" ");
      setInputText("");
      
      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          setInputText(prev => (prev && prev !== "Recording... (Speak your answer)" ? prev + " " : "") + words[currentWordIndex]);
          currentWordIndex++;
        } else {
          clearInterval(interval);
          setIsListening(false);
          showToast?.("Voice captured: '" + chosenPhrase + "'", "success");
        }
      }, 180);
    }, 1500);
  };

  // Local File Upload Reader supporting paste / file dialog selections
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast?.("Only diagram or formula images are supported for Socratic OCR.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAttachedImage(reader.result);
        setAttachedFileName(file.name);
        showToast?.(`Diagram "${file.name}" attached successfully!`, "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Calculate current completion percentage
  const totalMilestones = session.milestones.length || 1;
  const progressPercent = Math.round(((session.currentMilestoneIndex + 1) / totalMilestones) * 100);

  // Dynamically configure helper chips depending on current subject
  const suggestionChips = [
    "I'm stuck. Give me an easier hint",
    "Check my current formula",
    "Why is net force not zero?",
    "Explain this conceptually",
  ];

  return (
    <div className="flex-1 h-screen flex flex-col md:flex-row bg-[#f7f9fb] overflow-hidden">
      
      {/* LEFT PANEL: Problem Statement, Image snapshot, and Milestones */}
      <aside className="w-full md:w-1/2 lg:w-5/12 h-1/2 md:h-full bg-white border-r border-gray-200 p-6 flex flex-col overflow-y-auto custom-scrollbar">
        {/* Navigation / Metadata bar */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBackToDashboard}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#006875]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#dae2fd] text-[#006875] text-[10px] font-extrabold uppercase rounded-full">
                {session.subject}
              </span>
              <span className="text-xs text-gray-400 font-medium">Topic Session</span>
            </div>
            <h2 className="text-base font-bold text-gray-700 mt-0.5">{session.topic}</h2>
          </div>
        </div>

        {/* Current Problem Image Snapshot if provided */}
        {session.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 max-h-48 flex justify-center bg-gray-50 shadow-sm relative group">
            <img 
              src={session.imageUrl} 
              alt="Textbook snapshot question details" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
            />
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-[#00e5ff]">photo_camera</span>
              Captured View
            </div>
          </div>
        )}

        {/* Question details transcribed */}
        <div className="mb-6 bg-[#f8fafc] border border-gray-100 rounded-2xl p-5">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Transcribed Question</h4>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {session.question}
          </p>
        </div>

        {/* Learning milestones progressive checklist */}
        <div className="mb-6 space-y-4 flex-1">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Milestones & Milestones</h4>
            <span className="text-xs font-extrabold text-[#006875] bg-[#00e5ff]/10 px-2 py-0.5 rounded-full">
              {progressPercent}% Done
            </span>
          </div>

          {/* Progress Bar indicator */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#006875] to-[#00daf3] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="space-y-3 mt-4">
            {session.milestones.map((milestone, idx) => {
              const isChecked = idx <= session.currentMilestoneIndex;
              return (
                <div 
                  key={idx}
                  onClick={() => toggleMilestone(idx)}
                  className={`flex items-start gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked 
                      ? "bg-[#00e5ff]/5 border-[#00e5ff]/30 text-gray-700 font-semibold"
                      : "bg-transparent border-gray-100 text-gray-400"
                  }`}
                >
                  <button className="flex-shrink-0 mt-0.5">
                    <span className={`material-symbols-outlined text-xl ${isChecked ? "text-[#006875]" : "text-gray-300"}`}>
                      {isChecked ? "check_circle" : "radio_button_unchecked"}
                    </span>
                  </button>
                  <p className="text-sm leading-snug">{milestone}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Resources */}
        <div className="mt-auto border-t border-gray-100 pt-5">
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Study Resources</h5>
          <div className="space-y-2">
            <button 
              onClick={() => showToast?.("Opening Socratic Academy Textbook (Chapter 4: Oscillations & Pendulums)...", "info")}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-[#00e5ff]/10 rounded-xl transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006875]">menu_book</span>
                <span className="text-xs font-bold text-gray-700">Academy Reference Textbook</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform text-lg">open_in_new</span>
            </button>
            <button 
              onClick={() => showToast?.("Streaming walk-through explanation video on Pendulum Free Body Diagrams...", "info")}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-[#00e5ff]/10 rounded-xl transition-all group text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006875]">smart_display</span>
                <span className="text-xs font-bold text-gray-700">Socratic Video walkthrough</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform text-lg">open_in_new</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: Socratic Chat Workarea */}
      <section className="flex-1 h-1/2 md:h-full flex flex-col justify-between bg-[#f8fafc]">
        {/* Chat Header Status */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00e5ff]/15 rounded-full flex items-center justify-center text-[#006875]">
              <span className="material-symbols-outlined font-bold text-xl">psychology</span>
            </div>
            <div>
              <h3 className="font-bold text-[#131b2e] text-sm">Socratic Guide</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse"></span>
                <p className="text-[10px] text-[#006875] font-extrabold tracking-wider uppercase">Active Listening</p>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-400">Step {session.currentMilestoneIndex + 1} of {session.milestones.length}</span>
        </header>

        {/* Message Feed Canvas */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          {session.messages.map((message) => {
            const isAI = message.role === "assistant";
            return (
              <div 
                key={message.id} 
                className={`flex items-start gap-3 max-w-[85%] ${isAI ? "" : "ml-auto flex-row-reverse"}`}
              >
                {/* Avatar Icon */}
                {isAI ? (
                  <div className="w-8 h-8 rounded-full bg-[#006875] text-[#00e5ff] flex-shrink-0 flex items-center justify-center text-xs font-bold">
                    S
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                    Me
                  </div>
                )}

                {/* Message Content Bubble */}
                <div className={`relative p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  isAI 
                    ? "bg-white text-gray-700 chat-bubble-ai border border-gray-100" 
                    : "bg-[#006875] text-white rounded-tr-none"
                }`}>
                  {isAI && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#006875] uppercase tracking-widest mb-1">
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                      Socratic Tutor
                    </div>
                  )}
                  {message.imageUrl && (
                    <div className="mb-2 max-w-xs rounded-xl overflow-hidden border border-black/10">
                      <img src={message.imageUrl} alt="Attached formula diagram" className="w-full object-cover max-h-48" />
                    </div>
                  )}
                  {message.content}
                </div>
              </div>
            );
          })}

          {/* Thinking status loader */}
          {isThinking && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-[#006875] text-[#00e5ff] flex-shrink-0 flex items-center justify-center text-xs font-bold">
                S
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                <span className="text-xs font-semibold text-[#006875] uppercase tracking-wider animate-pulse">
                  Thinking with you...
                </span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Suggestion Prompt Chips Carousel */}
        <div className="px-6 py-2 bg-gradient-to-t from-gray-50 to-transparent flex-shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar whitespace-nowrap">
            {suggestionChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(chip)}
                className="bg-white hover:bg-[#00e5ff]/10 hover:border-[#00e5ff] border border-gray-200 text-xs text-gray-600 hover:text-[#006875] font-semibold px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Chat input form container with interactive thumbnail pasting and attachment handlers */}
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          {/* File input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            accept="image/*"
            className="hidden"
          />

          {/* Attached Image Preview */}
          {attachedImage && (
            <div className="flex items-center gap-3 p-2.5 bg-gray-50 border border-gray-100 rounded-2xl mb-3 relative max-w-sm">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-black/5">
                <img src={attachedImage} alt="Attachment thumbnail" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 truncate">{attachedFileName || "attached_diagram.png"}</p>
                <p className="text-[10px] text-gray-400">Ready to send with next reply</p>
              </div>
              <button 
                onClick={() => {
                  setAttachedImage(null);
                  setAttachedFileName(null);
                }}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                title="Remove diagram"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-1.5 focus-within:ring-2 focus-within:ring-[#00e5ff]/50 focus-within:border-[#006875] transition-all">
            {/* Attachment paperclip */}
            <button 
              onClick={triggerFileSelect}
              className={`p-2 active:scale-95 cursor-pointer transition-colors ${
                attachedImage ? "text-[#00e5ff]" : "text-gray-400 hover:text-[#006875]"
              }`}
              title="Attach diagram"
            >
              <span className="material-symbols-outlined text-xl">attach_file</span>
            </button>

            {/* Input field */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Socratic Tutor a guiding question or solve the next step..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none py-2 text-sm text-gray-700 max-h-24 custom-scrollbar"
            />

            {/* Micro speech-to-text */}
            <button 
              onClick={triggerVoiceInput}
              className={`p-2 rounded-full transition-colors active:scale-95 cursor-pointer ${
                isListening ? "bg-red-100 text-red-500" : "text-gray-400 hover:text-[#006875]"
              }`}
              title="Simulate speech input"
            >
              <span className={`material-symbols-outlined text-xl ${isListening ? "animate-pulse" : ""}`}>
                {isListening ? "mic" : "mic_none"}
              </span>
            </button>

            {/* Send button */}
            <button
              onClick={() => handleSendMessage(inputText)}
              className="bg-[#006875] hover:brightness-110 text-white rounded-xl p-2.5 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined font-bold text-sm">send</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            The Socratic Tutor asks questions to build learning retention. It will not solve the homework for you directly.
          </p>
        </div>
      </section>
    </div>
  );
}
