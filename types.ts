

export enum UserRole {
  Manager = 'Manager',
  Engineer = 'Engineer',
  Designer = 'Designer',
  Member = 'Member',
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

export interface ProbabilisticRaceTimePrediction {
    bestRaceTime: number; // seconds
    worstRaceTime: number; // seconds
    averageRaceTime: number; // seconds
    averageDrag: number; // Cd
    bestFinishLineSpeed: number; // m/s
    worstFinishLineSpeed: number; // m/s
    averageFinishLineSpeed: number; // m/s
    
    // NEW for Premium simulation
    launchVariance?: number; // ms, standard deviation of launch reaction time
    trackConditionSensitivity?: number; // ms, time difference between optimal and suboptimal track
    canisterPerformanceDelta?: number; // ms, time difference between best and worst canister performance
}

export interface AeroResult {
  id: string;
  timestamp: string;
  fileName: string;
  tier?: 'standard' | 'premium';
  thrustModel?: 'standard' | 'competition' | 'pro-competition';
  
  // Input parameters
  parameters: DesignParameters;

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
  raceTimePrediction?: ProbabilisticRaceTimePrediction;
  
  // Professional Simulation Data
  meshQuality?: number; // %
  convergenceStatus?: 'Converged' | 'Diverged';
  simulationTime?: number; // seconds
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

export interface StatItem {
  id: number;
  label: string;
  value: string;
}

export interface PublicPortalContent {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroCtaText: string;
    heroBackgroundImage: string;
  };
  about: {
    title: string;
    subtitle: string;
    mission: string;
    history: string;
    stats: StatItem[];
  };
  team: {
    title: string;
    subtitle: string;
  };
  car: {
    title: string;
    subtitle: string;
    carModelFbx: string | null;
    isCarModelBlurred: boolean;
  };
  competition: {
    title: string;
    subtitle: string;
  };
  sponsors: {
    title: string;
    subtitle: string;
  };
  news: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
  };
  aerotest: {
    title: string;
    subtitle: string;
  };
}

export interface ContentVersion {
  content: PublicPortalContent;
  timestamp: string;
  editorId: string;
}

export interface LoginRecord {
  userId: string;
  timestamp: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}