export type ViewType = "landing" | "dashboard" | "chat" | "progress" | "settings" | "camera";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface ActiveSession {
  subject: string;
  topic: string;
  question: string;
  imageUrl?: string;
  milestones: string[];
  currentMilestoneIndex: number;
  messages: Message[];
}

export interface StudyDay {
  day: string;
  hours: number;
}

export interface ProblemSolvedSubject {
  subject: string;
  count: number;
  color: string;
}

export interface LearningGoal {
  id: string;
  text: string;
  done: boolean;
}

export interface MasteryTrend {
  subject: string;
  topic: string;
  mastery: number;
  trend: string;
  color: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  level: "A-Level" | "O-Level" | "Local Board" | "Regional Curriculum";
  streakDays: number;
  xp: number;
  timeTodayMinutes: number;
  avatarUrl: string;
  isDarkMode: boolean;
  emailNotifications: boolean;
  streakAlerts: boolean;
  studyData: StudyDay[];
  problemSolved: ProblemSolvedSubject[];
  goals: LearningGoal[];
  masteryTrends: MasteryTrend[];
  nextAchievement: {
    title: string;
    percent: number;
    description: string;
    icon: string;
  };
}
