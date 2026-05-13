export type CardCategory = '医' | '食' | '行' | '养';
export type CardStatus = '未处理' | 'GET' | '再看看';
export type RiskLevel = '高危' | '中等' | '安全';
export type PostType = '晒猫' | '求助' | '经验' | '好物' | '避坑';
export type RecordType = '疫苗' | '驱虫' | '行为';
export type ReminderType = '疫苗' | '驱虫' | '自定义';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface Source {
  type: string;
  title: string;
  url?: string;
}

export interface KnowledgeCard {
  id: string;
  title: string;
  summary: string;
  category: CardCategory;
  tags: string[];
  aiSummary: string;
  reasonExplanation: string;
  operationSteps: string[];
  riskLevel: RiskLevel;
  riskJudgment: string[];
  sources: Source[];
  quizQuestions: QuizQuestion[];
  status: CardStatus;
  reviewCount: number;
  createdAt: string;
}

export interface AIResponse {
  conclusion: string;
  riskLevel: RiskLevel;
  tags: string[];
  operationSteps: string[];
  sources: Source[];
  generatedCard: KnowledgeCard | null;
}

export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  author: string;
  avatar: string;
  type: PostType;
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  liked: boolean;
  favorites: number;
  favorited: boolean;
  comments: PostComment[];
  createdAt: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface CatProfile {
  id: string;
  name: string;
  breed: string;
  birthday: string;
  gender: string;
  neutered: boolean;
  weightHistory: WeightEntry[];
  photo: string;
}

export interface HealthRecord {
  id: string;
  catId: string;
  type: RecordType;
  content: string;
  tags: string[];
  date: string;
  nextReminderDate?: string;
}

export interface Reminder {
  id: string;
  catId: string;
  type: ReminderType;
  title: string;
  dueDate: string;
  enabled: boolean;
}

export interface UserKnowledgeState {
  cardId: string;
  status: CardStatus;
  reviewCount: number;
  lastReviewedAt: string;
  quizPassed: boolean;
}
