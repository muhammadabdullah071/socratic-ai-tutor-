import { LearningGoal, MasteryTrend, ProblemSolvedSubject, StudyDay } from "./types";

export const LEVEL_DATASETS: Record<
  "A-Level" | "O-Level" | "Local Board" | "Regional Curriculum",
  {
    goals: LearningGoal[];
    masteryTrends: MasteryTrend[];
    problemSolved: ProblemSolvedSubject[];
    studyData: StudyDay[];
    nextAchievement: {
      title: string;
      percent: number;
      description: string;
      icon: string;
    };
  }
> = {
  "A-Level": {
    goals: [
      { id: "1", text: "Solve 5 definite integrals using Integration by Parts", done: true },
      { id: "2", text: "Complete the Simple Harmonic Motion Pendulum milestone", done: false },
      { id: "3", text: "Pass Chemistry hybridization flashcard module", done: false },
      { id: "4", text: "Maintain 12 days active Socratic streak", done: true },
    ],
    masteryTrends: [
      { subject: "Physics", topic: "Thermodynamics", mastery: 74, trend: "+12% this week", color: "text-[#00e5ff]" },
      { subject: "Mathematics", topic: "Calculus II", mastery: 92, trend: "+5% this week", color: "text-emerald-500" },
      { subject: "Chemistry", topic: "Organic Bonds", mastery: 45, trend: "Stalled", color: "text-red-500" },
    ],
    problemSolved: [
      { subject: "Mathematics", count: 43, color: "bg-[#00e5ff]" },
      { subject: "Physics", count: 31, color: "bg-[#006875]" },
      { subject: "Chemistry", count: 12, color: "bg-red-400" },
      { subject: "Computer Science", count: 8, color: "bg-amber-400" },
    ],
    studyData: [
      { day: "Mon", hours: 1.5 },
      { day: "Tue", hours: 2.2 },
      { day: "Wed", hours: 3.1 },
      { day: "Thu", hours: 0.8 },
      { day: "Fri", hours: 2.5 },
      { day: "Sat", hours: 4.2 },
      { day: "Sun", hours: 1.8 },
    ],
    nextAchievement: {
      title: "Integrals Master",
      percent: 60,
      description: "Solve 5 more complex integration problems to unlock",
      icon: "functions",
    }
  },
  "O-Level": {
    goals: [
      { id: "1", text: "Factorize 10 quadratic expressions using formula", done: true },
      { id: "2", text: "Deduce acceleration from a velocity-time graph", done: false },
      { id: "3", text: "Measure pH value of household reagents", done: false },
      { id: "4", text: "Log 3 hours of Kinematics practice questions", done: true },
    ],
    masteryTrends: [
      { subject: "Physics", topic: "Kinematics & Velocity", mastery: 60, trend: "+8% this week", color: "text-[#00e5ff]" },
      { subject: "Mathematics", topic: "Quadratic Equations", mastery: 85, trend: "+10% this week", color: "text-emerald-500" },
      { subject: "Chemistry", topic: "Acids & Bases", mastery: 50, trend: "Slowly rising", color: "text-yellow-500" },
    ],
    problemSolved: [
      { subject: "Mathematics", count: 28, color: "bg-[#00e5ff]" },
      { subject: "Physics", count: 21, color: "bg-[#006875]" },
      { subject: "Chemistry", count: 15, color: "bg-red-400" },
      { subject: "Computer Science", count: 5, color: "bg-amber-400" },
    ],
    studyData: [
      { day: "Mon", hours: 1.0 },
      { day: "Tue", hours: 1.5 },
      { day: "Wed", hours: 2.0 },
      { day: "Thu", hours: 1.2 },
      { day: "Fri", hours: 1.8 },
      { day: "Sat", hours: 3.0 },
      { day: "Sun", hours: 2.1 },
    ],
    nextAchievement: {
      title: "Kinematics Champ",
      percent: 40,
      description: "Submit 3 homework solutions to complete graph deduction",
      icon: "trending_up",
    }
  },
  "Local Board": {
    goals: [
      { id: "1", text: "Verify Ohm's Law through virtual circuit board", done: true },
      { id: "2", text: "Learn 4 standard trigonometric identity equations", done: false },
      { id: "3", text: "Balance 5 redox chemical formulas manually", done: false },
      { id: "4", text: "Draw electromagnetic induction diagrams", done: true },
    ],
    masteryTrends: [
      { subject: "Physics", topic: "Electrostatics", mastery: 68, trend: "+15% this week", color: "text-[#00e5ff]" },
      { subject: "Mathematics", topic: "Trigonometry Basics", mastery: 80, trend: "+4% this week", color: "text-emerald-500" },
      { subject: "Chemistry", topic: "Stoichiometry & Balance", mastery: 40, trend: "Stalled", color: "text-red-500" },
    ],
    problemSolved: [
      { subject: "Mathematics", count: 35, color: "bg-[#00e5ff]" },
      { subject: "Physics", count: 24, color: "bg-[#006875]" },
      { subject: "Chemistry", count: 10, color: "bg-red-400" },
      { subject: "Computer Science", count: 12, color: "bg-amber-400" },
    ],
    studyData: [
      { day: "Mon", hours: 2.0 },
      { day: "Tue", hours: 2.5 },
      { day: "Wed", hours: 1.5 },
      { day: "Thu", hours: 2.2 },
      { day: "Fri", hours: 2.0 },
      { day: "Sat", hours: 3.5 },
      { day: "Sun", hours: 1.0 },
    ],
    nextAchievement: {
      title: "Circuit Conqueror",
      percent: 75,
      description: "Answer the Socratic voltage prompt to obtain credential",
      icon: "electrical_services",
    }
  },
  "Regional Curriculum": {
    goals: [
      { id: "1", text: "Analyze diffraction patterns using double slit apparatus", done: true },
      { id: "2", text: "Find the distance between parallel intercepts", done: false },
      { id: "3", text: "Calculate Kc constant for ammonia synthesis reactions", done: false },
      { id: "4", text: "Practice 8 logical reasoning matrices", done: true },
    ],
    masteryTrends: [
      { subject: "Physics", topic: "Wave Optics", mastery: 70, trend: "+11% this week", color: "text-[#00e5ff]" },
      { subject: "Mathematics", topic: "Coordinate Geometry", mastery: 88, trend: "+6% this week", color: "text-emerald-500" },
      { subject: "Chemistry", topic: "Chemical Equilibrium", mastery: 35, trend: "Stalled", color: "text-red-500" },
    ],
    problemSolved: [
      { subject: "Mathematics", count: 50, color: "bg-[#00e5ff]" },
      { subject: "Physics", count: 38, color: "bg-[#006875]" },
      { subject: "Chemistry", count: 8, color: "bg-red-400" },
      { subject: "Computer Science", count: 10, color: "bg-amber-400" },
    ],
    studyData: [
      { day: "Mon", hours: 1.2 },
      { day: "Tue", hours: 1.8 },
      { day: "Wed", hours: 2.4 },
      { day: "Thu", hours: 1.6 },
      { day: "Fri", hours: 2.0 },
      { day: "Sat", hours: 4.0 },
      { day: "Sun", hours: 1.5 },
    ],
    nextAchievement: {
      title: "Optics Sensation",
      percent: 50,
      description: "Answer 2 wave diffraction questions to gain the badge",
      icon: "blur_on",
    }
  }
};
