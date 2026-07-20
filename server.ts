import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for base64 images
app.use(express.json({ limit: "20mb" }));

// Initialize GoogleGenAI client (Server-side ONLY)
// Telemetry User-Agent 'aistudio-build' is required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper: Ensure API key is configured
const checkApiKey = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    console.warn("WARNING: GEMINI_API_KEY is not configured or is a placeholder. Using fallback mock mode for local testing.");
    return false;
  }
  return true;
};

// 1. Analyze Textbook Snapshot / Uploaded Image
app.post("/api/tutor/analyze-image", async (req, res) => {
  try {
    const { image } = req.body; // base64 representation of the image
    if (!image) {
      return res.status(400).json({ error: "Missing image data." });
    }

    // Strip header if present (e.g., "data:image/png;base64,")
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const hasApiKey = checkApiKey();

    if (!hasApiKey) {
      // Return a simulated high-quality analysis if API key is missing
      return res.json({
        success: true,
        subject: "Physics",
        topic: "Thermodynamics",
        question: "Calculate the work done by 2 moles of an ideal gas expanding isothermally at 300K from 1L to 5L.",
        milestones: [
          "State the isothermal expansion work formula",
          "Identify known variables (n, R, T, V1, V2)",
          "Perform calculation and check units",
        ],
        introMessage: "Hi there! I've analyzed your thermodynamics problem. To find the work done during this isothermal expansion, let's start by thinking about what formula describes this process. Do you recall the equation for isothermal work?",
      });
    }

    // Call Gemini to do OCR and formulate Socratic milestones
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    };

    const promptText = `
Analyze this textbook question or study sheet. You must:
1. Transcribe the question clearly.
2. Identify the subject (e.g. Physics, Math, Chemistry, Computer Science) and the specific topic.
3. Break the problem down into 3-4 distinct learning milestones/steps for the student to solve sequentially.
4. Formulate an encouraging introductory Socratic response to prompt the student's first step, without giving away the final answer.

You must respond with valid JSON matching the following schema:
{
  "subject": "string (Physics, Math, etc.)",
  "topic": "string (e.g., Thermodynamics, Circular Motion)",
  "question": "string (transcribed question)",
  "milestones": ["array of 3-4 string milestone descriptions"],
  "introMessage": "string (encouraging intro prompt)"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [imagePart, { text: promptText }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            question: { type: Type.STRING },
            milestones: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            introMessage: { type: Type.STRING },
          },
          required: ["subject", "topic", "question", "milestones", "introMessage"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, ...parsedData });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: error.message || "Failed to analyze snapshot." });
  }
});

// 2. Socratic Interactive Tutoring Chat Endpoint
app.post("/api/tutor/chat", async (req, res) => {
  try {
    const { messages, subject, topic, question, currentMilestoneIndex } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid chat messages." });
    }

    const hasApiKey = checkApiKey();

    if (!hasApiKey) {
      // Fallback Socratic chatbot if API key is not configured
      const userMsg = messages[messages.length - 1]?.content || "";
      let responseText = "Excellent reflection! Let's think about how that relates to our core formula. What would be our next logical step?";
      if (userMsg.toLowerCase().includes("formula")) {
        responseText = "Yes, absolutely! The formula is W = nRT ln(V2/V1). Let's plug in the values. What value should we use for the gas constant R?";
      }
      return res.json({ response: responseText });
    }

    // Setup chat system instruction
    const systemInstruction = `
You are Socratic AI Tutor, an empathetic, brilliant, and patient tutor guiding a student through an academic problem.
Your primary objective is to NEVER give the final answer directly. Instead:
1. Ask helpful, guided questions to help them build intuition.
2. Point out conceptual or mathematical errors gently, without giving the correction.
3. Validate and celebrate their correct logical steps.
4. Keep hints extremely small, digestible, and focused.
5. Use clean Markdown for layout and formatting.

Current Problem Context:
- Subject: ${subject || "General Academic"}
- Topic: ${topic || "Unknown Topic"}
- Full Question: "${question || "N/A"}"
- Student is currently working on milestone: "${currentMilestoneIndex !== undefined && req.body.milestones ? req.body.milestones[currentMilestoneIndex] : "Understanding the problem"}"

Analyze the conversation history and guide the student constructively. Keep your responses friendly, encouraging, and relatively concise.
`;

    // Format history for Gemini chat API
    // Gemini chat expects list of contents of format { role: 'user'|'model', parts: [{ text: string }] }
    const formattedContents = messages.map((m: any) => {
      const parts: any[] = [{ text: m.content || "" }];
      if (m.imageUrl) {
        const base64Data = m.imageUrl.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        });
      }
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts,
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Error in tutor chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate tutor response." });
  }
});

// Configure Vite or Static Asset delivery
const setupServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Production Mode serving compiled static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static files from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Socratic AI Tutor server running on http://localhost:${PORT}`);
  });
};

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
