
import { User, UserRole, Task, TaskStatus, FinancialRecord, Sponsor, SponsorTier, NewsPost, TeamMember, CarHighlight, DiscussionThread, CompetitionProgressItem, Protocol, DesignParameters, PublicPortalContent, AeroResult } from '../types';
import { generateAvatar } from '../utils/avatar';

export const MOCK_USERS_DATA = [
  { 
    id: 'user-1', 
    name: 'Shrivatsa', 
    email: 'shrivatsakarth.kart@saintolaves.net', 
    role: UserRole.ProjectManager,
    description: 'Directs the Blizzard Racing project lifecycle using Agile methodologies. Shrivatsa manages the critical path, Gantt visualizations, and cross-departmental synchronization to ensure we meet every engineering milestone for the National Finals.'
  },
  { 
    id: 'user-6', 
    name: 'Pranav', 
    email: 'PranavRam.Alluri@saintolaves.net', 
    role: UserRole.ResourcesManager,
    description: 'Architect of team sustainability and logistics. Pranav controls our partnership ecosystem, financial tracking, and asset procurement. He ensures the team remains high-resource and operationally efficient through strategic budget management.'
  },
  { 
    id: 'user-2', 
    name: 'Anish', 
    email: 'anish.ghosh@saintolaves.net', 
    role: UserRole.DesignEngineer,
    description: 'Lead architect of the Blizzard Challenger CAD assembly. Anish specializes in advanced surfacing and aerodynamic optimization. He leverages iterative design cycles and virtual wind tunnel testing to extract maximum performance from every geometric curve.'
  },
  { 
    id: 'user-4', 
    name: 'Raiyan', 
    email: 'Raiyan.Haider@saintolaves.net', 
    role: UserRole.ManufacturingEngineer,
    description: 'Expert in subtractive and additive manufacturing pipelines. Raiyan translates complex CAD data into physical components, optimizing CNC toolpaths and 3D printing parameters to achieve the optimal strength-to-weight ratio required for 20g launches.'
  },
  { 
    id: 'user-3', 
    name: 'Hadi', 
    email: 'hadinabeel.siddiqui@saintolaves.net', 
    role: UserRole.GraphicDesigner,
    description: 'Visual identity and branding director. Hadi defines the Blizzard aesthetic, from high-impact car liveries to digital UI/UX. He ensures our technical innovations are presented with world-class professional design across all portfolio submissions.'
  },
  { 
    id: 'user-5', 
    name: 'Aarav', 
    email: 'Aarav.Gupta-Cure@saintolaves.net', 
    role: UserRole.MarketingManager,
    description: 'Strategist for outreach and public engagement. Aarav manages sponsor acquisition and team communications. He crafts the narrative of our engineering journey, maximizing team impact through social media campaigns and professional networking.'
  },
];

export const MOCK_USERS: User[] = MOCK_USERS_DATA.map(user => ({
    ...user,
    avatarUrl: generateAvatar(user.name),
}));

export const MOCK_TASKS: Task[] = [
  { id: 'task-1', title: 'Validate v3.2 Front Wing', description: 'Run secondary check on the new GNN-calibrated front wing assembly.', status: TaskStatus.Done, assigneeId: 'user-2', dueDate: '2024-08-10' },
  { id: 'task-2', title: 'Sponsor Deck Polish', description: 'Update the platinum tier proposal with the latest race simulation data.', status: TaskStatus.InProgress, assigneeId: 'user-5', dueDate: '2024-08-15' },
  { id: 'task-3', title: 'CNC Main Chassis Run', description: 'Execute the optimized toolpath for the SLS nylon core.', status: TaskStatus.InReview, assigneeId: 'user-4', dueDate: '2024-08-20' },
];

export const MOCK_FINANCES: FinancialRecord[] = [
    {id: 'fin-1', type: 'income', description: 'Sponsor Installment: Apex', amount: 50000, date: '2024-07-01'},
    {id: 'fin-2', type: 'expense', description: 'Sintered Nylon (SLS) Stock', amount: 15000, date: '2024-07-05'},
];

export const MOCK_SPONSORS: Sponsor[] = [
    {id: 'spon-1', name: 'Apex Industries', logoUrl: 'https://picsum.photos/seed/apex/200/100', tier: SponsorTier.Gold, status: 'secured'},
    {id: 'spon-2', name: 'Quantum Dynamics', logoUrl: 'https://picsum.photos/seed/quantum/200/100', tier: SponsorTier.Platinum, status: 'secured'},
];

export const MOCK_NEWS: NewsPost[] = [
    {id: 'news-1', title: 'The Blizzard Engineering Shift', content: 'We have officially realigned our internal structure to maximize output for the upcoming National Finals...', authorId: 'user-1', createdAt: '2024-07-15T10:00:00Z', isPublic: true},
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = MOCK_USERS.map(({ id, name, role, avatarUrl }) => ({ id, name, role, avatarUrl }));

export const MOCK_CAR_HIGHLIGHTS: CarHighlight[] = [
  {id: 'car-1', title: 'High-Alpha Wings', description: 'Optimized using k-ω SST turbulence modeling for maximum stability.', imageUrl: 'https://picsum.photos/seed/car1/800/600', isPublic: true},
];

export const MOCK_THREADS: DiscussionThread[] = [
     {
        id: 'thread-4',
        title: 'Manufacturing Tolerances for Axles',
        createdBy: 'user-4',
        createdAt: '2024-08-03T11:00:00Z',
        posts: [
            { id: 'post-4-1', authorId: 'user-4', content: 'Testing a +0.05mm fit for the ceramic bearings. Feedback?', createdAt: '2024-08-03T11:00:00Z' },
        ]
    }
];

export const MOCK_COMPETITION_PROGRESS: CompetitionProgressItem[] = [
    { category: 'Design & Engineering', progress: 85 },
    { category: 'Manufacturing', progress: 60 },
    { category: 'Scrutineering Compliance', progress: 95 },
    { category: 'Portfolio & Pit Display', progress: 40 },
    { category: 'Sponsorship & Marketing', progress: 75 },
];

export const MOCK_PROTOCOLS: Protocol[] = [
    {
        id: 'proto-1',
        title: 'High-Fidelity Aero Audit',
        description: 'Verification steps before a final design freeze.',
        steps: [
            'Load CAD into Aerotest Premium.',
            'Verify Y+ boundary layer targets are < 1.5.',
            'Check residuals convergence below 1e-5.',
            'Execute 100k Monte Carlo race simulation.',
        ]
    }
];

export const INITIAL_PUBLIC_PORTAL_CONTENT: PublicPortalContent = {
  home: {
    heroTitle: "BLIZZARD RACING",
    heroSubtitle: "Engineering the Future of High-Speed STEM",
    heroCtaText: "Join Our Journey",
    heroBackgroundImage: "https://picsum.photos/seed/racecar/1600/900",
  },
  about: {
    title: "About Blizzard Racing",
    subtitle: "A multi-disciplinary engineering project based at St. Olave's Grammar School.",
    mission: "To define the new standard in F1 in Schools performance through data-driven design and elite manufacturing synchronization.",
    history: "Founded in 2022, Blizzard Racing has evolved from a grassroots design team into a data-centric engineering operation. With our BR-02 and current BR-03 challengers, we are pushing the mathematical limits of the competition.",
    stats: [
        { id: 1, label: "Years Active", value: "3" },
        { id: 2, label: "Team Members", value: "6" },
        { id: 3, label: "Innovations", value: "8+" },
        { id: 4, label: "Podiums", value: "2" },
    ]
  },
  team: {
      title: "Team Structure",
      subtitle: "The 6 pillars of Blizzard Racing. Specialized expertise driving collective excellence."
  },
  car: {
      title: "The BR-03 Challenger",
      subtitle: "Iterative design meets physical reality. Explore our latest aerodynamic evolution.",
      carModelFbx: null,
      isCarModelBlurred: true,
  },
  competition: {
      title: "National Finals Roadmap",
      subtitle: "Our journey toward STEM excellence. Tracking our performance against elite standards."
  },
  sponsors: {
      title: "Strategic Partners",
      subtitle: "Supported by industry leaders who share our passion for technical innovation."
  },
  news: {
      title: "Operations Feed",
      subtitle: "Internal and public updates from the Blizzard factory floor."
  },
  contact: {
      title: "Contact Operations",
      subtitle: "For technical inquiries or partnership opportunities, contact our Resources team."
  },
  aerotest: {
      title: "Aerotest: CFD Engine",
      subtitle: "Professional-grade simulation suite for high-alpha racing analysis.",
      description: `Aerotest implements a first-principles physics solver using the Finite Volume Method (FVM).
- **Solver Accuracy:** 2nd-order spatial discretization with double-precision RANS resolution.
- **Turbulence:** Integrated k-ω SST (Shear Stress Transport) model for superior boundary layer precision.
- **AI-Validation:** Graph Neural Network calibration layer for real-world track correlation.`
  }
};


export const F1_IN_SCHOOLS_RULES: readonly {
    id: string;
    description: string;
    min?: number;
    max?: number;
    unit: string;
    key: keyof Omit<DesignParameters, 'carName'>;
}[] = [
    { id: 'T3.4', description: 'Total Length', min: 170, max: 210, unit: 'mm', key: 'totalLength' },
    { id: 'T3.5', description: 'Total Width (at axles)', max: 85, unit: 'mm', key: 'totalWidth' },
    { id: 'T3.6', description: 'Total Weight (Min)', min: 50.0, unit: 'g', key: 'totalWeight' },
    { id: 'T7.6.1', description: 'Front Wing Span', min: 75, unit: 'mm', key: 'frontWingSpan' },
    { id: 'T7.6.2', description: 'Front Wing Chord', min: 15, max: 25, unit: 'mm', key: 'frontWingChord' },
    { id: 'T8.5', description: 'Rear Wing Height (Max)', max: 65, unit: 'mm', key: 'rearWingHeight' },
    { id: 'T8.6.1', description: 'Rear Wing Span', min: 65, unit: 'mm', key: 'rearWingSpan' },
];

export const THEORETICAL_OPTIMUM: AeroResult = {
    id: 'benchmark-optimum',
    timestamp: new Date().toISOString(),
    fileName: 'Ω-OPTIMUM (Physical Limit)',
    tier: 'premium',
    parameters: {
        carName: 'The Isentropic Limit',
        totalLength: 210,
        totalWidth: 65,
        totalWeight: 50.0,
        frontWingSpan: 75,
        frontWingChord: 15,
        rearWingSpan: 65,
        rearWingHeight: 35
    },
    solverSettings: {
        solver: 'Coupled Implicit',
        precision: 'Double',
        spatialDiscretization: {
            gradient: 'Least Squares Cell-Based',
            momentum: 'Third Order MUSCL',
            turbulence: 'Second Order Upwind'
        },
        turbulenceModel: 'Detached Eddy Simulation (DES)'
    },
    cd: 0.1020, 
    cl: 0.0120, 
    liftToDragRatio: 0.118, 
    dragBreakdown: { pressure: 40, skinFriction: 60 },
    aeroBalance: 50.0, 
    flowAnalysis: "Validated against Regulation-Max V2.5. Zero-slip boundaries and perfectly smooth surface profile assumed.",
    meshQuality: 100, 
    finalResiduals: {
        continuity: 1.0e-7, 
        xVelocity: 1.0e-7,
        yVelocity: 1.0e-7,
        zVelocity: 1.0e-7
    },
    convergenceStatus: 'Converged',
    simulationTime: 0,
    raceTimePrediction: {
        bestRaceTime: 1.155,
        worstRaceTime: 1.155,
        averageRaceTime: 1.155,
        averageDrag: 0.1020,
        bestFinishLineSpeed: 21.15,
        worstFinishLineSpeed: 21.15,
        averageFinishLineSpeed: 21.15,
        bestAverageSpeed: 17.31,
        worstAverageSpeed: 17.31,
        averageSpeed: 17.31,
        launchVariance: 0.0,
        trackConditionSensitivity: 0.1,
        canisterPerformanceDelta: 0.1
    }
};
