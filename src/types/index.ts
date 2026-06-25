export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  createdAt: string;
  streak: number;
  goal: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  progress: number;
  milestones: Milestone[];
  createdAt: string;
  status: 'active' | 'completed' | 'paused';
}

export interface Milestone {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  note: string;
  tags: string[];
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  favicon: string;
  createdAt: string;
}

export interface ReadingBook {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: 'to-read' | 'reading' | 'completed';
  rating?: number;
  notes: string;
  startDate?: string;
  completedDate?: string;
  cover?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  unit: 'reps' | 'duration';
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  duration: number;
  notes: string;
  completed: boolean;
}

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  date: string;
  duration: number;
  notes: string;
  rating: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
}

export interface VisionBoardItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export interface WaterEntry {
  date: string;
  amount: number;
  goal: number;
  entries: { time: string; amount: number }[];
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  sessionsBeforeLong: number;
}

export interface PomodoroSession {
  id: string;
  date: string;
  duration: number;
  type: 'work' | 'break';
  task?: string;
}

export type Theme = 'dark' | 'light';

export interface AppSettings {
  theme: Theme;
  accentColor: string;
  sidebarCollapsed: boolean;
  waterGoal: number;
  pomodoroSettings: PomodoroSettings;
  userName: string;
}
