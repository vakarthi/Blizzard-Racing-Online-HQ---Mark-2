export enum UserRole {
  Manager = 'Manager',
  Engineer = 'Engineer',
  Designer = 'Designer',
  Mechanic = 'Mechanic',
  SocialMedia = 'Social Media',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  InReview = 'In Review',
  Done = 'Done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
  dueDate: string;
}

export interface DesignParameters {
  carName: string;
  totalLength: number;
  totalWidth: number;
  totalWeight: number;
  frontWingSpan: number;
  frontWingChord: number;
  rearWingSpan: number;
  rearWingHeight: number;
}

export interface ScrutineeringItem {
  ruleId: string;
  description: string;
  status: 'PASS' | 'FAIL';
  notes: string;
  value: string;
}

export interface AeroResult {
  id: string;
  timestamp: string;
  isBest: boolean;
  
  // Input parameters
  parameters: DesignParameters;
  fileName: string;

  // Simulation Outputs
  cd: number; // Coefficient of Drag
  cl: number; // Coefficient of Lift
  liftToDragRatio: number;
  dragBreakdown: {
    pressure: number;
    skinFriction: number;
  };
  aeroBalance: number; // % front
  flowAnalysis: string;
  
  // AI Generated Content
  suggestions?: string;
  scrutineeringReport?: ScrutineeringItem[];
}


export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
}

export enum SponsorTier {
    Platinum = 'Platinum',
    Gold = 'Gold',
    Silver = 'Silver',
    Bronze = 'Bronze'
}

export interface Sponsor {
    id: string;
    name: string;
    logoUrl: string;
    tier: SponsorTier;
    status: 'pending' | 'secured';
}

export interface NewsPost {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    isPublic: boolean;
}

export interface TeamMember {
    id: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
}

export interface CarHighlight {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    isPublic: boolean;
}

export interface DiscussionPost {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  title: string;
  posts: DiscussionPost[];
  createdBy: string;
  createdAt: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

export interface CompetitionProgressItem {
    category: string;
    progress: number;
}

export interface Protocol {
    id: string;
    title: string;
    description: string;
    steps: string[];
}