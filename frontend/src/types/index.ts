export interface User {
  id: number;
  email: string;
  username: string;
  createdAt?: string;
  currentStreak?: number;
  longestStreak?: number;
  lastLessonDate?: string;
}

export interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface CreatePostData {
  title: string;
  content?: string;
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

// Finance Learning App Types
export interface LessonPath {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  order: number;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string; // JSON string
  type: 'standard' | 'quiz' | 'activity';
  order: number;
  pathId: number;
  path?: LessonPath;
  userProgress?: UserProgress[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonContent {
  sections: LessonSection[];
  quiz?: QuizQuestion[];
}

export interface LessonSection {
  type: 'intro' | 'interactive' | 'explanation';
  title: string;
  content?: string;
  activity?: string;
  instructions?: string;
  pairs?: MatchingPair[];
  categories?: DragDropCategory[];
  items?: DragDropItem[];
  scenario?: BudgetScenario;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface DragDropCategory {
  name: string;
  items: string[];
}

export interface DragDropItem {
  text: string;
  category: string;
}

export interface BudgetScenario {
  monthlyIncome: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface UserProgress {
  id: number;
  userId: number;
  lessonId: number;
  completed: boolean;
  score?: number;
  attempts: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface UserBadge {
  id: number;
  userId: number;
  badgeId: number;
  badge: Badge;
  earnedAt: string;
}

export interface ProgressSummary {
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  badges: Badge[];
  pathProgress: PathProgress[];
}

export interface PathProgress {
  path: LessonPath;
  completed: number;
  total: number;
}