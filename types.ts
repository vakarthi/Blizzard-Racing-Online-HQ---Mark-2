
export enum UserRole {
  Manager = 'Manager',
  DesignEngineer = 'Design Engineer',
  ManufacturingEngineer = 'Manufacturing Engineer',
  GraphicDesigner = 'Graphic Designer',
  SocialsDesigner = 'Socials & Design',
  Marketing = 'Marketing',
  Resource = 'Resource',
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
  frontWingThickness: number; // NEW: D7.6.3
  rearWingSpan: number;
  rearWingHeight: number;
  haloVisibilityScore: number; // NEW: D4.3.2
  noGoZoneClearance: number;  // NEW: D4.2
  visibilityScore: number;     // NEW: D6.2
  geometryMeta?: {
      originalOrientation: string;
      correctionApplied: boolean;
      featureIdentification: string;
      rotationLog?: string;
  };
}

export interface ScrutineeringItem {
  ruleId: string;
  description: string;
  status: 'PASS' | 'FAIL';
  notes: string;
  value: string;
}

export interface PerformancePoint {
  speed: number; // m/s
  ldRatio: number;
  dragForce: number; // Newtons
  liftForce: number; // Newtons
}

export interface MonteCarloPoint {
    time: number;
    startSpeed: number; // Changed from finishSpeed to startSpeed
}

export interface ProbabilisticRaceTimePrediction {
    bestRaceTime: number; // seconds
    worstRaceTime: number; // seconds
    averageRaceTime: number; // seconds
    averageDrag: number; // Cd
    
    // Finish Line Speeds (Instantaneous at 20m)
    bestFinishLineSpeed: number; // m/s
    worstFinishLineSpeed: number; // m/s
    averageFinishLineSpeed: number; // m/s

    // Start Speeds (Sampled at track entry, approx 5m)
    bestStartSpeed: number;
    worstStartSpeed: number;
    averageStartSpeed: number;

    // Average Track Speeds (Distance / Time)
    bestAverageSpeed: number; // m/s
    worstAverageSpeed: number; // m/s
    averageSpeed: number; // m/s
    
    // Distribution Data
    sampledPoints?: MonteCarloPoint[];
    stdDevTime?: number;
    
    // Reality check fields
    trustIndex?: number; // 0-100%
    isPhysical?: boolean;
    launchVariance?: number; // ms
    trackConditionSensitivity?: number; // ms
    canisterPerformanceDelta?: number; // ms
}

export type FlowFieldPoint = [number, number, number, number, number]; // [x, y, z, pressure, velocity]

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

export type CarClass = 'Entry' | 'Development' | 'Professional';

export interface AeroResult {
  id: string;
  timestamp: string;
  fileName: string;
  tier?: 'standard' | 'premium';
  thrustModel?: 'standard' | 'competition' | 'pro-competition';
  carClass?: CarClass;
  
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
  convergenceStatus?: 'Converged' | 'Diverged' | 'Converged (Relaxed)';
  simulationTime?: number; // seconds
  meshCellCount?: number;
  solverSettings?: SolverSettings;
  finalResiduals?: {
    continuity: number;
    xVelocity: number;
    yVelocity: number;
    zVelocity: number;
    k?: number; // for k-omega
    omega?: number; // for k-omega
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
  
  // 3D Visualization Data
  flowFieldData?: FlowFieldPoint[];
  
  // Curve Data
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
  authorName?: string; // Optional for display convenience if needed
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
  // additional metadata like ip or device could go here
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