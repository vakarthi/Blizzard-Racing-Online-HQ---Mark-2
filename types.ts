
export enum UserRole {
  ProjectManager = 'Project Manager',
  ResourcesManager = 'Resources Manager',
  ManufacturingEngineer = 'Manufacturing Engineer',
  DesignEngineer = 'Design Engineer',
  GraphicDesigner = 'Graphic Designer',
  MarketingManager = 'Marketing Manager',
  // Added Member role to support components using it as a base restriction role
  Member = 'Member',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  description?: string;
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

export interface PerformancePoint {
  speed: number;
  ldRatio: number;
  dragForce: number;
  liftForce: number;
}

export interface ProbabilisticRaceTimePrediction {
    bestRaceTime: number;
    worstRaceTime: number;
    averageRaceTime: number;
    averageDrag: number;
    bestFinishLineSpeed: number;
    worstFinishLineSpeed: number;
    averageFinishLineSpeed: number;
    bestAverageSpeed: number;
    worstAverageSpeed: number;
    averageSpeed: number;
    launchVariance?: number;
    trackConditionSensitivity?: number;
    canisterPerformanceDelta?: number;
}

export type FlowFieldPoint = [number, number, number, number, number];

export interface SolverSettings {
    solver: 'Coupled Implicit';
    precision: 'Double';
    spatialDiscretization: {
        gradient: 'Least Squares Cell-Based';
        momentum: 'Second Order Upwind' | 'Third Order MUSCL';
        turbulence: 'Second Order Upwind';
    };
    turbulenceModel: 'k-ω SST' | 'Spalart-Allmaras' | 'Detached Eddy Simulation (DES)';
}

export interface VerificationCheck {
    name: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
    message: string;
}

export interface AeroResult {
  id: string;
  timestamp: string;
  fileName: string;
  tier?: 'standard' | 'premium';
  thrustModel?: 'standard' | 'competition' | 'pro-competition';
  parameters: DesignParameters;
  cd: number;
  cl: number;
  liftToDragRatio: number;
  dragBreakdown: {
    pressure: number;
    skinFriction: number;
  };
  aeroBalance: number;
  flowAnalysis: string;
  suggestions?: string;
  scrutineeringReport?: ScrutineeringItem[];
  raceTimePrediction?: ProbabilisticRaceTimePrediction;
  meshQuality?: number;
  convergenceStatus?: 'Converged' | 'Diverged' | 'Converged (Relaxed)';
  simulationTime?: number;
  meshCellCount?: number;
  solverSettings?: SolverSettings;
  finalResiduals?: {
    continuity: number;
    xVelocity: number;
    yVelocity: number;
    zVelocity: number;
    k?: number; 
    omega?: number; 
  };
  aiFlowFeatures?: string[];
  autoSelectedSettings?: {
      flowRegime: string;
      turbulenceModel: string;
  };
  validationLog?: string[];
  verificationChecks?: VerificationCheck[];
  aiCorrectionModel?: {
    version: string;
    confidence: number;
    correctionApplied: boolean;
    originalCd?: number;
    reason?: string;
  };
  auditLog?: string;
  flowFieldData?: FlowFieldPoint[];
  performanceCurve?: PerformancePoint[];
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
    description: string;
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

export interface BackgroundTask {
  id: string;
  type: 'simulation';
  status: 'running' | 'completed' | 'error';
  progress: number;
  stage: string;
  latestLog?: string;
  startTime: string;
  endTime?: string;
  resultId?: string;
  fileName: string;
  error?: string;
}

// Portfolio Auditor Types
export interface AuditCategory {
  score: number;
  title: string;
  feedback: string;
  missingEvidence: string[];
  strengths: string[];
}

export interface PortfolioAuditReport {
  timestamp: string;
  overallReadiness: number;
  categories: AuditCategory[];
  criticalRisks: string[];
  suggestedActions: string[];
}
