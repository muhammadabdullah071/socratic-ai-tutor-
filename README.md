<div align="center">
  <img width="1200" height="475" alt="Socratic AI Tutor Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

<h1 align="center">🧠 Socratic AI Tutor</h1>

<p align="center">
  <strong>An interactive, AI-powered Socratic tutor that guides students step-by-step through O/A-Level and Local Board problems using the Gemini API.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-ES2022-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express" alt="Express 4" />
  <img src="https://img.shields.io/badge/Gemini-2.0_Flash-8E75B2?logo=googlegemini" alt="Gemini 2.0 Flash" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

---

## 📋 Overview

**Socratic AI Tutor** is a full-stack web application that reimagines tutoring through the **Socratic method** — instead of giving direct answers, it asks guiding questions, breaks problems into manageable milestones, and helps students build intuition and long-term retention.

Built with **React 19**, **Tailwind CSS 4**, and **Google's Gemini 2.0 Flash** API, it features a gamified learning experience with XP rewards, streak tracking, mastery analytics, and curriculum-level customization.

---

## ✨ Features

### 🎓 Socratic Tutoring
- **Milestone-Based Learning** — Complex problems are broken into small, achievable milestones
- **Guided Questions** — The AI never gives direct answers; it guides students to discover solutions themselves
- **Real-Time Chat** — Interactive chat-based tutoring with conversation history

### 📸 Image Scanning
- **Camera Capture** — Scan textbook problems using your device camera
- **Image Upload** — Upload screenshots or photos of questions
- **AI Analysis** — Gemini analyzes the image and extracts the subject, topic, question, and learning milestones

### 🎮 Gamification
- **XP Points** — Earn +150 XP per milestone solved
- **Streak Tracking** — Maintain daily streaks for consistent learning
- **Achievements** — Track progress toward next achievement milestones
- **Level System** — Four curriculum levels: A-Level, O-Level, Local Board, Regional Curriculum

### 📊 Progress Analytics
- **Mastery Trends** — Track mastery across subjects and topics
- **Study Dynamics** — Weekly study hour breakdowns
- **Learning Goals** — Set and track personal learning goals
- **Problems Solved** — Analytics by subject with visual charts

### 🎨 User Experience
- **Dark/Light Mode** — Toggle between themes
- **Voice Input** — Speech-to-text for hands-free interaction
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Support Hub** — FAQ search and contact form with XP rewards

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (React SPA)           │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Landing  │ │Dashboard │ │ Tutor Chat     │  │
│  │  Page    │ │  View    │ │    View        │  │
│  ├──────────┤ ├──────────┤ ├────────────────┤  │
│  │ Camera   │ │Progress  │ │  Profile       │  │
│  │ Viewfinder│ │ Screen   │ │  Settings      │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
│                    │ HTTP                        │
└────────────────────┼────────────────────────────┘
                     │
┌────────────────────┼────────────────────────────┐
│            Express.js Server (Node)              │
│  ┌──────────────────────────────────────────┐   │
│  │  POST /api/tutor/analyze-image           │   │
│  │  POST /api/tutor/chat                    │   │
│  └──────────────────────────────────────────┘   │
│                    │ Gemini API                  │
└────────────────────┼────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │  Google Gemini 2.0  │
          │    Flash (AI)       │
          └─────────────────────┘
```

### 📁 Project Structure

```
socratic-ai-tutor/
├── .env.example               # Environment variables template
├── index.html                 # HTML entry point
├── package.json               # Dependencies & scripts
├── server.ts                  # Express server with Gemini API
├── vite.config.ts             # Vite bundler configuration
├── tsconfig.json              # TypeScript configuration
├── metadata.json              # AI Studio deployment metadata
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Root component with state management
│   ├── index.css              # Tailwind imports & custom styles
│   ├── types.ts               # TypeScript interfaces & types
│   ├── data.ts                # Mock data for all curriculum levels
│   ├── assets/images/         # Static images
│   └── components/
│       ├── LandingPage.tsx     # Marketing & onboarding
│       ├── Dashboard.tsx       # Student dashboard
│       ├── Sidebar.tsx         # Navigation sidebar
│       ├── CameraViewfinder.tsx # Camera/upload for OCR
│       ├── TutorChat.tsx       # Socratic chat interface
│       ├── ProgressScreen.tsx  # Analytics & mastery tracking
│       ├── ProfileSettings.tsx # User settings & preferences
│       └── SupportModal.tsx    # FAQ & contact form
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Google Gemini API Key** — Get one from [Google AI Studio](https://aistudio.google.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/muhammadabdullah071/socratic-ai-tutor-.git
cd socratic-ai-tutor

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm start
```

---

## 🔧 API Endpoints

### `POST /api/tutor/analyze-image`
Analyzes a textbook problem image and returns structured learning milestones.

**Request:**
```json
{
  "image": "base64_encoded_image_string"
}
```

**Response:**
```json
{
  "subject": "Mathematics",
  "topic": "Quadratic Equations",
  "question": "Solve x² + 5x + 6 = 0",
  "milestones": [
    "Identify coefficients a, b, c",
    "Calculate the discriminant",
    "Apply the quadratic formula",
    "Verify your solutions"
  ],
  "introMessage": "Let's solve this step by step!"
}
```

### `POST /api/tutor/chat`
Sends a chat message and gets a Socratic-style response.

**Request:**
```json
{
  "message": "I think the first step is to find the roots",
  "subject": "Mathematics",
  "topic": "Quadratic Equations",
  "question": "Solve x² + 5x + 6 = 0",
  "milestones": ["Identify coefficients", "Calculate discriminant", "Apply formula", "Verify"],
  "currentMilestoneIndex": 0,
  "history": [
    { "role": "assistant", "content": "Let's start! What are the coefficients?" },
    { "role": "user", "content": "a=1, b=5, c=6" }
  ]
}
```

Both endpoints **work without an API key** in fallback/mock mode for development.

---

## 🛠 Tech Stack

| Category        | Technology                                      |
|-----------------|-------------------------------------------------|
| **Frontend**    | React 19, TypeScript, Vite 6, Tailwind CSS 4    |
| **Backend**     | Node.js, Express 4                               |
| **AI**          | Google Gemini 2.0 Flash (`@google/genai` SDK)    |
| **Animations**  | Motion (Framer Motion)                           |
| **Icons**       | Lucide React, Material Symbols                   |
| **Build Tools** | esbuild, Vite                                    |
| **Linting**     | TypeScript (tsc --noEmit)                        |

---

## 📜 Available Scripts

| Script          | Command                          | Description                        |
|-----------------|----------------------------------|------------------------------------|
| `npm run dev`   | `tsx server.ts`                  | Start development server with HMR  |
| `npm run build` | `vite build && esbuild server.ts` | Build frontend + bundle server     |
| `npm start`     | `node dist/server.cjs`           | Run production server              |
| `npm run clean` | Removes `dist/` and `server.js`  | Clean build artifacts              |
| `npm run lint`  | `tsc --noEmit`                   | TypeScript type checking           |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for the powerful AI models
- [Google AI Studio](https://aistudio.google.com/) for the deployment platform
- All the students and educators who inspire Socratic learning

---

<div align="center">
  <p>Made with ❤️ for better learning</p>
  <p>
    <a href="https://ai.studio/apps/fa3f1968-8e90-4df1-af98-a0083fdbf2dc">View in AI Studio</a>
  </p>
</div>
