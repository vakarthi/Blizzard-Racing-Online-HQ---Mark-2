
import { User, UserRole, Task, TaskStatus, FinancialRecord, Sponsor, SponsorTier, NewsPost, TeamMember, CarHighlight, DiscussionThread, CompetitionProgressItem, Protocol, DesignParameters, PublicPortalContent, AeroResult } from '../types';
import { generateAvatar } from '../utils/avatar';

export const MOCK_USERS_DATA = [
  { id: 'user-1', name: 'Shrivatsa', email: 'shrivatsakarth.kart@saintolaves.net', role: UserRole.Manager },
  { id: 'user-2', name: 'Anish', email: 'anish.ghosh@saintolaves.net', role: UserRole.Engineer },
  { id: 'user-3', name: 'Hadi', email: 'hadinabeel.siddiqui@saintolaves.net', role: UserRole.Designer },
  { id: 'user-4', name: 'Raiyan', email: 'Raiyan.Haider@saintolaves.net', role: UserRole.Member },
  { id: 'user-5', name: 'Aarav', email: 'Aarav.Gupta-Cure@saintolaves.net', role: UserRole.Member },
  { id: 'user-6', name: 'Pranav', email: 'PranavRam.Alluri@saintolaves.net', role: UserRole.Engineer },
];

export const MOCK_USERS: User[] = MOCK_USERS_DATA.map(user => ({
    ...user,
    avatarUrl: generateAvatar(user.name),
}));

export const MOCK_TASKS: Task[] = [
  { id: 'task-1', title: 'Finalize chassis design', description: 'Incorporate feedback from aero team and complete CAD models.', status: TaskStatus.Done, assigneeId: 'user-3', dueDate: '2024-08-10' },
  { id: 'task-2', title: 'Run new front wing simulation', description: 'Test v3.2 of the front wing with "high_downforce" configuration.', status: TaskStatus.InProgress, assigneeId: 'user-2', dueDate: '2024-08-15' },
  { id: 'task-3', title: 'Prepare sponsorship pitch deck', description: 'Create a new deck for potential platinum sponsors.', status: TaskStatus.InReview, assigneeId: 'user-5', dueDate: '2024-08-20' },
  { id: 'task-4', title: 'Machine new suspension uprights', description: 'CNC machine the latest uprights from the design team.', status: TaskStatus.ToDo, assigneeId: 'user-4', dueDate: '2024-08-25' },
];

export const MOCK_FINANCES: FinancialRecord[] = [
    {id: 'fin-1', type: 'income', description: 'Sponsor: Apex Industries', amount: 50000, date: '2024-07-01'},
    {id: 'fin-2', type: 'expense', description: 'Carbon Fiber Raw Materials', amount: 15000, date: '2024-07-05'},
    {id: 'fin-3', type: 'expense', description: 'Wind Tunnel Rental (4 hours)', amount: 8000, date: '2024-07-12'},
    {id: 'fin-4', type: 'income', description: 'Sponsor: Quantum Dynamics', amount: 75000, date: '2024-07-20'},
];

export const MOCK_SPONSORS: Sponsor[] = [
    {id: 'spon-1', name: 'Apex Industries', logoUrl: 'https://picsum.photos/seed/apex/200/100', tier: SponsorTier.Gold, status: 'secured'},
    {id: 'spon-2', name: 'Quantum Dynamics', logoUrl: 'https://picsum.photos/seed/quantum/200/100', tier: SponsorTier.Platinum, status: 'secured'},
    {id: 'spon-3', name: 'Momentum Lubricants', logoUrl: 'https://picsum.photos/seed/momentum/200/100', tier: SponsorTier.Silver, status: 'secured'},
    {id: 'spon-4', name: 'Velocity Parts', logoUrl: 'https://picsum.photos/seed/velocity/200/100', tier: SponsorTier.Gold, status: 'pending'},
];

export const MOCK_NEWS: NewsPost[] = [
    {id: 'news-1', title: 'Unveiling the BR-02: A New Era of Speed', content: 'We are thrilled to pull the covers off our latest challenger, the Blizzard Racing BR-02. This car represents thousands of hours of design, simulation, and manufacturing...', authorId: 'user-1', createdAt: '2024-07-15T10:00:00Z', isPublic: true},
    {id: 'news-2', title: 'Breakthrough in Aero Dynamics Achieved', content: 'Our engineering team has made a significant leap forward in aerodynamic efficiency with the new "Vortex" sidepod design. Internal tests show a 5% reduction in drag while maintaining downforce...', authorId: 'user-2', createdAt: '2024-07-20T14:30:00Z', isPublic: false},
    {id: 'news-3', title: 'Quantum Dynamics Joins as Platinum Partner', content: 'A huge welcome to Quantum Dynamics, who join us as a platinum partner for the upcoming season. Their expertise in materials science will be invaluable.', authorId: 'user-1', createdAt: '2024-07-22T09:00:00Z', isPublic: true},
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
        title: 'CFD Analysis of BR-03 Sidepods',
        createdBy: 'user-2',
        createdAt: '2024-08-03T11:00:00Z',
        posts: [
            { id: 'post-4-1', authorId: 'user-2', content: 'Initial results from the new sidepod simulation are looking very promising. Drag is down 3% with a slight increase in downforce. I\'ve attached the report.', createdAt: '2024-08-03T11:00:00Z' },
            { id: 'post-4-2', authorId: 'user-1', content: 'Great work Anish, this is a fantastic result. Let\'s get this fast-tracked for manufacturing.', createdAt: '2024-08-03T12:30:00Z' },
        ]
    },
    {
        id: 'thread-3',
        title: 'where',
        createdBy: 'user-1',
        createdAt: '2024-08-02T12:00:00Z',
        posts: [
            { id: 'post-3-1', authorId: 'user-1', content: 'is the meeting spot for tomorrow?', createdAt: '2024-08-02T12:00:00Z' },
        ]
    },
    {
        id: 'thread-1',
        title: 'Rear Wing Strategy for Nationals',
        createdBy: 'user-2',
        createdAt: '2024-08-01T10:00:00Z',
        posts: [
            { id: 'post-1-1', authorId: 'user-2', content: 'We need to decide on our primary rear wing configuration. Should we prioritize low drag for the straights or max downforce for the corners?', createdAt: '2024-08-01T10:00:00Z' },
            { id: 'post-1-2', authorId: 'user-3', content: 'I think a balanced approach is best. The latest simulation (BR-03-Gamma) shows a good compromise. We can have a higher downforce setup in reserve.', createdAt: '2024-08-01T11:30:00Z' },
            { id: 'post-1-3', authorId: 'user-1', content: 'Agreed. Let\'s go with the balanced setup as our primary. Anish, can you get the performance data for both options ready for the strategy meeting?', createdAt: '2024-08-02T09:00:00Z' },
        ]
    },
    {
        id: 'thread-2',
        title: 'Sponsorship Outreach - Q4 Targets',
        createdBy: 'user-5',
        createdAt: '2024-07-28T14:00:00Z',
        posts: [
            { id: 'post-2-1', authorId: 'user-5', content: 'Here is the list of potential local businesses to approach for Bronze/Silver tier sponsorships. Please add any contacts you have.', createdAt: '2024-07-28T14:00:00Z' },
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
        title: 'Pre-Race Scrutineering Checklist',
        description: 'Standard procedure to ensure car is compliant before every race.',
        steps: [
            'Verify total car weight (min 50g for Professional, 60g for Dev).',
            'Check overall dimensions (length, width).',
            'Inspect front and rear wing dimensions and placement.',
            'Ensure tether line is correctly installed.',
            'Confirm wheel and axle assembly is secure.',
            'Perform tether line pull test.',
        ]
    },
    {
        id: 'proto-2',
        title: 'New Member Onboarding',
        description: 'Steps to integrate a new member into the Blizzard Racing team.',
        steps: [
            'Introduce new member to all team leads.',
            'Provide access to HQ portal and communication channels.',
            'Assign a mentor from their sub-team.',
            'Review team handbook and code of conduct.',
            'Assign an initial starter task.',
        ]
    }
];

export const INITIAL_PUBLIC_PORTAL_CONTENT: PublicPortalContent = {
  home: {
    heroTitle: "BLIZZARD RACING",
    heroSubtitle: "Welcome to the Official Hub of Blizzard Racing",
    heroCtaText: "Become a Partner",
    heroBackgroundImage: "https://picsum.photos/seed/racecar/1600/900",
  },
  about: {
    title: "About Blizzard Racing",
    subtitle: "Learn about our mission, our history, and the competition that drives us to be the best.",
    mission: "To design, build, and race the fastest F1 in Schools car possible, while developing skills in engineering, marketing, and teamwork. We are committed to innovation, sportsmanship, and inspiring the next generation of STEM leaders.",
    history: "Founded in 2022, Blizzard Racing started as a small group of passionate students from St. Olave's Grammar School. In our first year, we achieved regional success, which fueled our ambition. Now in our third season, with the BR-02 and now the BR-03 challenger, we're leveraging advanced manufacturing techniques and data-driven design to compete at the national level.",
    stats: [
        { id: 1, label: "Years Competing", value: "3" },
        { id: 2, label: "Team Members", value: "6" },
        { id: 3, label: "Regional Podiums", value: "2" },
        { id: 4, label: "Innovations Developed", value: "5+" },
    ]
  },
  team: {
      title: "Meet The Team",
      subtitle: "The dedicated individuals driving Blizzard Racing forward. A blend of experience, innovation, and passion for motorsport."
  },
  car: {
      title: "The BR-02 Challenger",
      subtitle: "A culmination of cutting-edge technology and relentless innovation. Explore the key features of our latest car.",
      carModelFbx: null,
      isCarModelBlurred: true,
  },
  competition: {
      title: "Competition Readiness",
      subtitle: "Follow our progress as we prepare for the next big event. Each category represents a core part of the F1 in Schools challenge."
  },
  sponsors: {
      title: "Our Partners",
      subtitle: "We are proud to be supported by industry leaders who share our vision for excellence and innovation. Their partnership is crucial to our success."
  },
  news: {
      title: "News Feed",
      subtitle: "The latest updates, announcements, and stories from inside Blizzard Racing."
  },
  contact: {
      title: "Contact Us",
      subtitle: "Have a question or a partnership inquiry? We'd love to hear from you."
  },
  aerotest: {
      title: "Aerotest: Simulation Engine",
      subtitle: "A next-generation Computational Fluid Dynamics (CFD) solver, architected for superior accuracy and data intelligence.",
      description: `Aerotest is a first-principles physics solver built on a foundation of numerical excellence. It implements a full, double-precision Reynolds-Averaged Navier-Stokes (RANS) solver with optional Detached Eddy Simulation (DES) modes for unparalleled turbulence-resolving capability.
- **Meshing:** Automated hybrid mesher with polyhedral-hexcore cells and boundary layer inflation ensures optimal mesh quality and accuracy.
- **Solver:** A GPU-accelerated, coupled implicit solver provides robust convergence, utilizing Algebraic Multigrid (AMG) methods to accelerate solutions.
- **Physics:** Supports a modular framework for turbulence models (k-ω SST, Spalart-Allmaras), compressible and incompressible flows, and conjugate heat transfer.
- **AI-Powered Insights:** Features an integrated AI for automated flow feature detection and a Design Performance Analyzer to directly link aerodynamic results to on-track performance.`
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
    fileName: 'Ω-OPTIMUM (Limit)',
    tier: 'premium',
    parameters: {
        carName: 'The Perfect Challenger',
        totalLength: 185,
        totalWidth: 65,
        totalWeight: 50.0,
        frontWingSpan: 75,
        frontWingChord: 15,
        rearWingSpan: 65,
        rearWingHeight: 35
    },
    cd: 0.1150,
    cl: 0.0250,
    liftToDragRatio: 0.217,
    dragBreakdown: { pressure: 65, skinFriction: 35 },
    aeroBalance: 50.0,
    flowAnalysis: "Theoretical laminar-to-turbulent transition optimized for Reynolds Number ~240k. Minimal pressure drag via aggressive boattailing.",
    meshQuality: 100,
    convergenceStatus: 'Converged',
    simulationTime: 0,
    raceTimePrediction: {
        bestRaceTime: 1.175,
        worstRaceTime: 1.185,
        averageRaceTime: 1.180,
        averageDrag: 0.1150,
        bestFinishLineSpeed: 19.8,
        worstFinishLineSpeed: 19.2,
        averageFinishLineSpeed: 19.5,
        bestAverageSpeed: 17.02,
        worstAverageSpeed: 16.88,
        averageSpeed: 16.95,
        launchVariance: 0.5,
        trackConditionSensitivity: 2,
        canisterPerformanceDelta: 5
    }
};
