import React, { useState, useRef } from "react";
import { ViewType, ActiveSession } from "../types";

interface CameraViewfinderProps {
  onBack: () => void;
  onAnalysisSuccess: (session: ActiveSession) => void;
}

export default function CameraViewfinder({ onBack, onAnalysisSuccess }: CameraViewfinderProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [flash, setFlash] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger flash effect briefly
  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
  };

  // Convert File to base64
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      await handleOCRAnalysis(base64Data);
    };
    reader.readAsDataURL(file);
  };

  // Trigger File Picker
  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  // Handle File Input selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Handle Drag over / Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Main OCR analysis calling the Express server-side Gemini API
  const handleOCRAnalysis = async (base64Image: string) => {
    setIsScanning(true);
    setErrorMessage("");
    triggerFlash();

    try {
      const response = await fetch("/api/tutor/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please check your network connection.");
      }

      const data = await response.json();
      if (data.success) {
        // Transition straight to the Socratic Tutor chat interface
        onAnalysisSuccess({
          subject: data.subject,
          topic: data.topic,
          question: data.question,
          imageUrl: base64Image,
          milestones: data.milestones,
          currentMilestoneIndex: 0,
          messages: [
            {
              id: Date.now().toString(),
              role: "assistant",
              content: data.introMessage,
              timestamp: new Date(),
            },
          ],
        });
      } else {
        throw new Error(data.error || "Failed to parse text from image.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred while reading your question. Try uploading another textbook snapshot.");
      setIsScanning(false);
    }
  };

  // Fallback simulator click shutter
  const handleShutterClick = () => {
    // We send the default textbook image from the HTML mockups
    const fallbackImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDHB8pryuxCfq9mOwKFyxhW_UWVmSlv7J8JlmVff2fxFZbNB8TQKcQl9_TT_RD1-EI5msWlUoqRk9-u23SAL_FedDTpqtmGZs4-rX40byRgByqwqCWlH_1qEuzZpcolJZW4v-G0-xNK0JkqT5SicVxo9unpc8kMjZ2KMaTKSf9tQav093DyXdOv9CHI3rkQrUIW3UtTboB0uJYoU2l-uEjLJhbQ__0V0Lb2Ev327AQk-85BV_FptO18";
    handleOCRAnalysis(fallbackImage);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col justify-between"
    >
      {/* Flash Effect Layer */}
      {flash && <div className="absolute inset-0 bg-white z-50 transition-opacity duration-100 opacity-100"></div>}

      {/* Camera Header Bar */}
      <header className="absolute top-0 w-full z-30 backdrop-blur-md bg-black/40 flex justify-between items-center px-6 h-16 border-b border-white/5">
        <button onClick={onBack} className="text-white hover:opacity-80 transition-opacity p-2 active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <span className="font-sans text-lg font-bold tracking-tight text-white">Socratic AI Tutor</span>
        <button className="text-white hover:opacity-80 transition-opacity p-2 active:scale-95">
          <span className="material-symbols-outlined text-2xl">more_vert</span>
        </button>
      </header>

      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Center Viewfinder Scan Stage */}
      <main className="relative flex-1 w-full flex flex-col items-center justify-center">
        {/* Dynamic Textbook focus background image */}
        <div className="absolute inset-0 z-0">
          <img 
            alt="Academic textbook background" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKGhBRldweDAHQgZkmsbrGdcWgtjEaSdq2H2i-qo4GydRGP5WKNdb7W-PawQ-ChYSBeZ7D-raKNNAgX42mK70ohWaD9zIHD6iPf6DOaCpg0QmTpt-W1Io7oosY1lL7N7S-XFxs2YlwOv-g2TSeQ04C8YQXIni2_WZTn78yHzpzYRE-C1ZKX_cLWLITq0m1h0SEhnhBDRkdwW7HVSFqrAih7b6cUyjoUfZBL8MrUpHw1-juvpFvFEvr" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        {/* Framing brackets & messages */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-black/20">
          {/* Cyan Bracket Frame Box */}
          <div className="relative w-[85%] max-w-lg h-[40%] rounded-2xl border-2 border-[#00e5ff]/20 flex flex-col items-center justify-center overflow-hidden">
            {/* Real Scanning Laser line */}
            {isScanning && <div className="absolute left-0 right-0 z-20 scanning-line"></div>}

            {/* Inner shadows and design brackets */}
            <div className="absolute inset-0 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
            
            {/* Glow corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#00e5ff]"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#00e5ff]"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#00e5ff]"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#00e5ff]"></div>
          </div>

          {/* Socratic Status Messages */}
          <div className="mt-8 px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-[#00e5ff]/30 text-center max-w-[85%]">
            {isScanning ? (
              <p className="text-[#00e5ff] text-xs font-bold tracking-widest animate-pulse uppercase">
                READING YOUR QUESTION WITH AI...
              </p>
            ) : (
              <p className="text-white text-xs font-bold tracking-widest uppercase">
                CENTER YOUR QUESTION IN THE BOX or DRAG IMAGE HERE
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="mt-4 px-6 py-3 bg-red-900/80 border border-red-500 rounded-xl text-center max-w-[85%] text-sm text-red-200">
              {errorMessage}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Controls Bar */}
      <nav className="absolute bottom-0 w-full z-30 pb-12 pt-8 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-center justify-between max-w-md mx-auto px-6">
          {/* Gallery Button */}
          <button 
            onClick={handleGalleryClick}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
            title="Upload from gallery"
          >
            <span className="material-symbols-outlined text-2xl">image</span>
          </button>

          {/* Shutter Button */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 rounded-full border-2 border-[#00e5ff]/40 animate-pulse"></div>
            <button 
              onClick={handleShutterClick}
              disabled={isScanning}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer ${
                isScanning ? "bg-[#00e5ff]" : "bg-white"
              }`}
            >
              <div className="w-14 h-14 rounded-full border-2 border-[#00e5ff]/20"></div>
            </button>
          </div>

          {/* Flash Button */}
          <button 
            onClick={triggerFlash}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer"
            title="Simulate flash"
          >
            <span className="material-symbols-outlined text-2xl">flash_on</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
