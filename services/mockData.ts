
import { User, UserRole, Task, TaskStatus, FinancialRecord, Sponsor, SponsorTier, NewsPost, TeamMember, CarHighlight, DiscussionThread, CompetitionProgressItem, Protocol, DesignParameters, PublicPortalContent, AeroResult } from '../types';
import { generateAvatar } from '../utils/avatar';

// Enhanced Mock Data with Custom Avatar support
export const MOCK_USERS_DATA = [
  { 
      id: 'user-1', 
      name: 'Shrivatsa Karthi', 
      email: 'shrivatsakarth.kart@saintolaves.net', 
      role: UserRole.Manager, 
      bounty: 1200,
      customAvatar: '/shrivatsa.jpg' // Explicit filename
  },
  { 
      id: 'user-2', 
      name: 'Anish G', 
      email: 'anish.ghosh@saintolaves.net', 
      role: UserRole.ManufacturingEngineer, 
      bounty: 950,
      customAvatar: '/anish.png' // Explicit filename
  },
  { 
      id: 'user-3', 
      name: 'Hadi S', 
      email: 'hadinabeel.siddiqui@saintolaves.net', 
      role: UserRole.Marketing, 
      bounty: 800,
      customAvatar: '/hadi.jpg' // Explicit filename
  },
  { 
      id: 'user-4', 
      name: 'Raiyan H', 
      email: 'Raiyan.Haider@saintolaves.net', 
      role: UserRole.Resource, 
      bounty: 750,
      customAvatar: '/raiyan.jpg' // Explicit filename
  },
  { 
      id: 'user-5', 
      name: 'Aarav G', 
      email: 'Aarav.Gupta-Cure@saintolaves.net', 
      role: UserRole.DesignEngineer, 
      bounty: 850,
      // High contrast placeholder
      customAvatar: 'https://placehold.co/600x800/000000/FFFFFF/png?text=Consent+Not+Given&font=roboto'
  },
];

export const MOCK_USERS: User[] = MOCK_USERS_DATA.map(user => ({
    ...user,
    avatarUrl: user.customAvatar || generateAvatar(user.name),
}));

export const MOCK_TASKS: Task[] = [
  { id: 'task-1', title: 'Finalize chassis design', description: 'Complete high-fidelity CAD models for v3.0.', status: TaskStatus.Done, assigneeId: 'user-5', dueDate: '2024-08-10' }, // Reassigned to Aarav
  { id: 'task-2', title: 'Run new front wing simulation', description: 'Test v3.2 of the front wing with "high_downforce" configuration.', status: TaskStatus.InProgress, assigneeId: 'user-1', dueDate: '2024-08-15' },
  { id: 'task-3', title: 'Prepare sponsorship pitch deck', description: 'Create a new deck for potential platinum sponsors.', status: TaskStatus.InReview, assigneeId: 'user-3', dueDate: '2024-08-20' },
  { id: 'task-4', title: 'Manufacturing Run v1', description: 'Begin CNC milling for the first chassis prototype.', status: TaskStatus.ToDo, assigneeId: 'user-2', dueDate: '2024-08-25' },
];

export const MOCK_FINANCES: FinancialRecord[] = [
    {id: 'fin-1', type: 'income', description: 'Sponsor: Ansys Grant', amount: 15000, date: '2024-07-01'},
    {id: 'fin-2', type: 'expense', description: 'Carbon Fiber Raw Materials', amount: 5000, date: '2024-07-05'},
    {id: 'fin-3', type: 'expense', description: 'Wind Tunnel Rental (4 hours)', amount: 2000, date: '2024-07-12'},
    {id: 'fin-4', type: 'income', description: 'Sponsor: Cyber Sky Solutions', amount: 5000, date: '2024-07-20'},
    {id: 'fin-5', type: 'income', description: 'Sponsor: Artistry Italian Fashion', amount: 2500, date: '2024-08-01'},
];

export const MOCK_SPONSORS: Sponsor[] = [
    {
        id: 'spon-1', 
        name: 'Ansys', 
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Ansys_Logo.png', 
        tier: SponsorTier.Platinum, 
        status: 'secured'
    },
    {
        id: 'spon-2', 
        name: 'Cyber Sky Solutions', 
        logoUrl: 'https://placehold.co/400x200/ffffff/000000?text=Cyber+Sky', // Placeholder - User should upload real logo
        tier: SponsorTier.Gold, 
        status: 'secured'
    },
    {
        id: 'spon-3', 
        name: 'Artistry Italian Fashion', 
        logoUrl: 'https://placehold.co/400x200/ffffff/000000?text=Artistry+Italian', // Placeholder
        tier: SponsorTier.Silver, 
        status: 'secured'
    },
    {
        id: 'spon-4', 
        name: 'AH Smile', 
        logoUrl: 'https://placehold.co/400x200/ffffff/000000?text=AH+Smile', // Placeholder
        tier: SponsorTier.Bronze, 
        status: 'secured'
    },
];

export const MOCK_NEWS: NewsPost[] = [
    {id: 'news-1', title: 'Regional Finals Result: 2nd Place!', content: 'Blizzard Racing is proud to announce a 2nd place finish at the Southeast Regional Finals! While we faced some technical challenges in scrutineering, our race pace was unmatched.', authorId: 'user-1', createdAt: '2024-07-15T10:00:00Z', isPublic: true},
    {id: 'news-2', title: 'Breakthrough in Aero Dynamics Achieved', content: 'Our engineering team has made a significant leap forward in aerodynamic efficiency with the new "Vortex" sidepod design. Internal tests show a 5% reduction in drag while maintaining downforce...', authorId: 'user-5', createdAt: '2024-07-20T14:30:00Z', isPublic: false}, // Reassigned to Aarav
    {id: 'news-3', title: 'Ansys Partners with Blizzard Racing', content: 'We are thrilled to announce Ansys as our official simulation partner. Their industry-leading software will power our CFD analysis.', authorId: 'user-1', createdAt: '2024-07-22T09:00:00Z', isPublic: true},
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = MOCK_USERS.map(({ id, name, role, avatarUrl }) => ({ id, name, role, avatarUrl }));

export const MOCK_CAR_HIGHLIGHTS: CarHighlight[] = [
  {id: 'car-1', title: 'Vortex Sidepods', description: 'A revolutionary sidepod design that significantly reduces drag by managing airflow along the car\'s body.', imageUrl: 'https://picsum.photos/seed/car1/800/600', isPublic: true},
  {id: 'car-2', title: 'Flex-Wing Assembly', description: 'The rear wing features a state-of-the-art flexible mainplane, optimizing downforce in corners and reducing drag on straights.', imageUrl: 'https://picsum.photos/seed/car2/800/600', isPublic: true},
  {id: 'car-3', title: 'Hybrid Power Unit', description: 'Our custom-built HPU combines a lightweight internal combustion engine with a powerful electric motor for instant torque and incredible efficiency.', imageUrl: 'https://picsum.photos/seed/car3/800/600', isPublic: false},
];

export const MOCK_THREADS: DiscussionThread[] = [
     {
        id: 'thread-4',
        title: 'Refining Scrutineering Protocol',
        createdBy: 'user-1',
        createdAt: '2024-08-03T11:00:00Z',
        posts: [
            { id: 'post-4-1', authorId: 'user-1', content: 'The Regional report showed we lost 65 points in scrutineering. Specifically D4.3.2 (Halo) and D7.6.3 (Front Wing). We need Aerotest to catch these BEFORE we build.', createdAt: '2024-08-03T11:00:00Z' },
            { id: 'post-4-2', authorId: 'user-5', content: 'Agreed. I am updating the internal checklist now. Anish, can you ensure the CNC milling toolpath accounts for these clearances?', createdAt: '2024-08-03T12:30:00Z' }, // Reassigned to Aarav
        ]
    },
    {
        id: 'thread-3',
        title: 'Meeting spot',
        createdBy: 'user-1',
        createdAt: '2024-08-02T12:00:00Z',
        posts: [
            { id: 'post-3-1', authorId: 'user-1', content: 'Meeting in the workshop tomorrow at lunch to discuss manufacturing tolerances.', createdAt: '2024-08-02T12:00:00Z' },
        ]
    }
];

export const MOCK_COMPETITION_PROGRESS: CompetitionProgressItem[] = [
    { category: 'Design & Engineering', progress: 49 },
    { category: 'Manufacturing', progress: 35 },
    { category: 'Scrutineering Compliance', progress: 40 },
    { category: 'Portfolio & Pit Display', progress: 41 },
    { category: 'Sponsorship & Marketing', progress: 72 },
];

export const MOCK_PROTOCOLS: Protocol[] = [
    {
        id: 'proto-1',
        title: 'Halo Visibility Scan (D4.3.2)',
        description: 'Procedure to ensure the Halo does not obstruct the plan-view visibility requirements.',
        steps: [
            'Load top-down (Plan) view in CAD.',
            'Project 15mm clearance rays from the cockpit center.',
            'Ensure Halo structure does not intersect rays within the -5pt threshold.',
            'Cross-check with technical regulation D4.3.2 for front and side clearances.',
        ]
    }
];

export const INITIAL_PUBLIC_PORTAL_CONTENT: PublicPortalContent = {
  home: {
    heroTitle: "BLIZZARD RACING",
    heroSubtitle: "Taking over the world by storm.",
    heroCtaText: "Partner With Us",
    heroBackgroundImage: "https://images.unsplash.com/photo-1532906619279-a784c0c4124e?q=80&w=2070&auto=format&fit=crop",
  },
  about: {
    title: "Our Mission",
    subtitle: "Driving Innovation at St. Olave's Grammar School",
    mission: "We are driven to inspire the younger generation. This inspiration can stem from their pursuit of dreams and aspirations or by paying attention to the subjects and experiences that truly captivate their curiosity, motivating them to seek knowledge and understanding in their chosen fields.",
    history: "Our journey commenced in the summer of 2023, set against the distinguished backdrop of Saint Olave's Grammar School. What started as an idea on the inaugural day of Year 8 has evolved into a dedicated team seamlessly merging engineering expertise with exceptional communication skills.",
    stats: [
        { id: 1, label: "Regional Rank", value: "2nd" },
        { id: 2, label: "Founded", value: "2023" },
        { id: 3, label: "Team Members", value: "5" },
        { id: 4, label: "Iterations", value: "5+" },
    ]
  },
  team: {
      title: "The Team",
      subtitle: "The dedicated individuals driving Blizzard Racing forward."
  },
  car: {
      title: "The Storm Challenger",
      subtitle: "A culmination of cutting-edge technology and relentless innovation.",
      carModelFbx: null,
      isCarModelBlurred: true,
  },
  competition: {
      title: "Competition Readiness",
      subtitle: "Follow our progress as we prepare for the next big event."
  },
  sponsors: {
      title: "Our Partners",
      subtitle: "We are proud to be supported by industry leaders who share our vision."
  },
  news: {
      title: "News Feed",
      subtitle: "The latest updates from inside Blizzard Racing."
  },
  contact: {
      title: "Contact Us",
      subtitle: "Have a question or a partnership inquiry? We'd love to hear from you."
  },
  aerotest: {
      title: "Aerotest Simulation",
      subtitle: "Next-generation Computational Fluid Dynamics.",
      description: `Aerotest is a first-principles physics solver built on a foundation of numerical excellence.`
  }
};


export const F1_IN_SCHOOLS_RULES: readonly {
    id: string;
    description: string;
    min?: number;
    max?: number;
    unit: string;
    key: keyof Omit<DesignParameters, 'carName' | 'hasVirtualCargo'>;
}[] = [
    { id: 'T3.4', description: 'Total Length', min: 170, max: 210, unit: 'mm', key: 'totalLength' },
    { id: 'T3.5', description: 'Total Width (at axles)', max: 85, unit: 'mm', key: 'totalWidth' },
    { id: 'T3.6', description: 'Total Weight (Min)', min: 55.0, unit: 'g', key: 'totalWeight' },
    { id: 'T7.6.1', description: 'Front Wing Span', min: 75, unit: 'mm', key: 'frontWingSpan' },
    { id: 'T7.6.2', description: 'Front Wing Chord', min: 15, max: 25, unit: 'mm', key: 'frontWingChord' },
    { id: 'D7.6.3', description: 'Front Wing Thickness', min: 3.5, max: 12.0, unit: 'mm', key: 'frontWingThickness' },
    { id: 'T8.5', description: 'Rear Wing Height (Max)', max: 65, unit: 'mm', key: 'rearWingHeight' },
    { id: 'T8.6.1', description: 'Rear Wing Span', min: 65, unit: 'mm', key: 'rearWingSpan' },
    { id: 'D4.3.2', description: 'Halo Plan Visibility', min: 80, unit: '%', key: 'haloVisibilityScore' },
    { id: 'D4.2', description: 'No-Go-Zone Clearance', min: 1.0, unit: 'mm', key: 'noGoZoneClearance' },
    { id: 'D6.2', description: 'Side/Plan Visibility', min: 90, unit: '%', key: 'visibilityScore' },
];

export const THEORETICAL_OPTIMUM: AeroResult = {
    id: 'benchmark-optimum',
    timestamp: new Date().toISOString(),
    fileName: 'OPTIMUM (Limit)',
    tier: 'premium',
    parameters: {
        carName: 'The Perfect Challenger',
        totalLength: 210,
        totalWidth: 65,
        totalWeight: 55.0,
        frontWingSpan: 75,
        frontWingChord: 15,
        frontWingThickness: 6.5,
        rearWingSpan: 65,
        rearWingHeight: 35,
        haloVisibilityScore: 100,
        noGoZoneClearance: 10.0,
        visibilityScore: 100,
        hasVirtualCargo: true
    },
    // Standard Defaults
    domain: 'FLUID_DYNAMICS',
    environment: 'EARTH_STD',
    solverSettings: {
        solverType: 'RANS-WebGPU',
        solver: 'Coupled Implicit',
        precision: 'Double',
        spatialDiscretization: {
            gradient: 'Least Squares Cell-Based',
            momentum: 'Third Order MUSCL',
            turbulence: 'Second Order Upwind'
        },
        turbulenceModel: 'Detached Eddy Simulation (DES)'
    },
    cd: 0.0001, // Near zero drag
    cl: 5.0, 
    liftToDragRatio: 5000, 
    dragBreakdown: { 
        pressure: 0, 
        skinFriction: 0, 
        induced: 0, 
        interference: 0, 
        tetherWake: 0, 
        microVibration: 0 
    },
    eggheadMetrics: {
        generatedGoverningEquation: 'F_{opt} = \\oint_{\\Omega} (\\nabla \\cdot \\mathbf{u}) dV = 0',
        entropyGenerationRate: 0.00,
        vortexLatticeStrength: 0.00,
        boundaryLayerTripPoint: 100.0,
        shockwaveIntensity: 0.0,
        futurePredictionDate: "2124-01-01"
    },
    aeroBalance: 50.0, 
    flowAnalysis: "Regulation-Max V2.8.3 (Isentropic Limit).",
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
        // God Mode Physics
        bestRaceTime: 0.001,
        worstRaceTime: 0.002,
        averageRaceTime: 0.0015, 
        averageDrag: 0.0001,
        
        bestFinishLineSpeed: 999, 
        worstFinishLineSpeed: 998,
        averageFinishLineSpeed: 998.5,
        
        bestStartSpeed: 500,
        worstStartSpeed: 499,
        averageStartSpeed: 499.5,
        
        bestAverageSpeed: 800,
        worstAverageSpeed: 790,
        averageSpeed: 795,
        
        trustIndex: 100,
        isPhysical: true
    }
};
