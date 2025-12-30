import { DesignParameters, AeroResult, CarClass, PunkRecordsState, ProbabilisticRaceTimePrediction, EggheadMetrics, AtlasForceBreakdown, PhysicsDomain, EnvironmentPreset, MultiverseTimeline } from '../types';

/**
 * EGGHEAD OMEGA SOLVER (Year 2124 Edition - MARK 5 "ANCIENT KINGDOM")
 * 
 * CAPABILITY: Universal Multiphysics Engine.
 * CONSTRAINTS: NONE. (Physics limits removed per request).
 * DOMAINS: Fluid, Solid, Thermal, EM, Quantum.
 */

// --- ENVIRONMENT CONSTANTS GENERATOR ---
const getEnvironmentFactors = (env: EnvironmentPreset) => {
    switch (env) {
        case 'SKYPIEA_HIGH': return { rho: 0.7, g: 6.0, visc: 1.5e-5 };
        case 'FISHMAN_DEEP': return { rho: 1025, g: 9.81, visc: 0.001 };
        case 'PUNK_HAZARD_HOT': return { rho: 0.9, g: 9.81, visc: 2.2e-5, temp: 400 };
        case 'PUNK_HAZARD_COLD': return { rho: 1.4, g: 9.81, visc: 1.2e-5, temp: -50 };
        case 'SPACE_VACUUM': return { rho: 0.000001, g: 0, visc: 0 };
        case 'EARTH_STD': default: return { rho: 1.225, g: 9.81, visc: 1.8e-5 };
    }
};

// --- AI #1: THE EQUATION ARCHITECT ---
const synthesizeEquation = (domain: PhysicsDomain): string => {
    // Vegapunk AI #1 generates the governing law based on the domain
    if (domain === 'SOLID_MECHANICS') return `\\sigma_{ij} = C_{ijkl} \\epsilon_{kl} + \\text{Vegapunk}(t)`;
    if (domain === 'THERMODYNAMICS') return `\\frac{\\partial T}{\\partial t} = \\alpha \\nabla^2 T + \\Phi_{fusion}`;
    if (domain === 'QUANTUM_FLOW') return `i\\hbar \\frac{\\partial \\Psi}{\\partial t} = \\hat{H}\\Psi + \\mathcal{O}(\\infty)`;
    // Default Fluid (Navier-Stokes Supercharged)
    return `\\rho \\left( \\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}_{ext}`;
};

// --- MULTIVERSE GENERATOR ---
// Generates 3 timelines: Baseline, Optimistic, and Chaos for Cross-Reality Verification
const generateMultiverseData = (params: DesignParameters, factors: any, domain: PhysicsDomain): MultiverseTimeline[] => {
    const timelines: MultiverseTimeline[] = [];
    const baseValue = domain === 'FLUID_DYNAMICS' ? 20 : 100; // Base scalar for the "signal"
    
    // Create a seed based on params to make graphs deterministic
    const paramSum = params.totalLength + params.totalWidth + (params.frontWingSpan || 0);
    const seed = Math.sin(paramSum) * 1000;

    // Timeline 1: Reality Prime (Baseline)
    const points1 = [];
    for (let i = 0; i <= 20; i++) {
        points1.push({ x: i, y: baseValue * Math.log(i + 1) * factors.rho * (1 + Math.sin(i * 0.5 + seed) * 0.05) });
    }
    timelines.push({ id: 'univ-1', name: 'Universe A (Prime)', color: '#0EA5E9', convergenceScore: 99.9, dataPoints: points1 });

    // Timeline 2: Golden Future (Optimistic)
    const points2 = [];
    for (let i = 0; i <= 20; i++) {
        points2.push({ x: i, y: (baseValue * 1.2) * Math.log(i + 1) * factors.rho * (1 + Math.cos(i * 0.3 + seed) * 0.08) });
    }
    timelines.push({ id: 'univ-2', name: 'Universe B (Golden)', color: '#F59E0B', convergenceScore: 94.2, dataPoints: points2 });

    // Timeline 3: Void Century (Chaos)
    const points3 = [];
    for (let i = 0; i <= 20; i++) {
        const chaos = Math.sin(i * 2 + seed) * 15;
        points3.push({ x: i, y: (baseValue * 0.8) * Math.log(i + 1) * factors.rho + chaos });
    }
    timelines.push({ id: 'univ-3', name: 'Universe C (Chaos)', color: '#EF4444', convergenceScore: 88.5, dataPoints: points3 });

    return timelines;
};

// --- AI #2: THE SIMULATION EXECUTOR (RK4 Solver) ---
const performRK4Race = (cd: number, startMassGrams: number, metrics: EggheadMetrics, envFactors: any): ProbabilisticRaceTimePrediction => {
    let t = 0;
    let x = 0; 
    let v = 0; 
    let currentMass = startMassGrams / 1000; 
    
    // Time step: ultra fine
    const dt = 0.0001; 
    const maxTime = 10.0; 
    const frontalArea = 0.0035; 
    
    // UNLEASHED PHYSICS: Standard thrust or Vacuum Mode
    const isVacuum = envFactors.rho < 0.001;

    // Sampling for the graph
    const sampledPoints: {time: number, startSpeed: number}[] = [];
    let sampleCounter = 0;

    const acceleration = (time: number, pos: number, vel: number) => {
        // Thrust - Standard 8g CO2 curve
        let thrust = 0;
        if (time < 0.05) thrust = 60 * (time / 0.05);
        else if (time < 0.4) thrust = 60 * Math.exp(-2.5 * (time - 0.05));
        else if (time < 0.6) thrust = 10 * (1 - (time - 0.4)/0.2);
        
        // Drag
        const drag = 0.5 * envFactors.rho * (vel * vel) * cd * frontalArea;
        
        // Friction
        const normalForce = (currentMass * envFactors.g);
        const friction = isVacuum ? 0 : (normalForce * 0.015);

        // Mass Decay
        if (time < 0.6) currentMass = (startMassGrams / 1000) - (0.008 * (time/0.6));

        return (thrust - drag - friction) / currentMass;
    };

    while (x < 20.0 && t < maxTime) {
        const k1_v = acceleration(t, x, v);
        const k1_x = v;
        const k2_v = acceleration(t + 0.5 * dt, x + 0.5 * dt * k1_x, v + 0.5 * dt * k1_v);
        const k2_x = v + 0.5 * dt * k1_x;
        const k3_v = acceleration(t + 0.5 * dt, x + 0.5 * dt * k2_x, v + 0.5 * dt * k2_v);
        const k3_x = v + 0.5 * dt * k2_x;
        const k4_v = acceleration(t + dt, x + dt * k3_x, v + dt * k3_v);
        const k4_x = v + dt * k3_x;

        v += (dt / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);
        x += (dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
        t += dt;

        sampleCounter++;
        if (sampleCounter % 500 === 0) sampledPoints.push({ time: t, startSpeed: v });
    }

    const finalTime = t;
    const avgSpeed = 20.0 / finalTime;

    return {
        bestRaceTime: finalTime * 0.999,
        worstRaceTime: finalTime * 1.001,
        averageRaceTime: finalTime,
        averageDrag: cd,
        bestFinishLineSpeed: v,
        worstFinishLineSpeed: v,
        averageFinishLineSpeed: v,
        bestStartSpeed: 0,
        worstStartSpeed: 0,
        averageStartSpeed: 0,
        bestAverageSpeed: avgSpeed,
        worstAverageSpeed: avgSpeed,
        averageSpeed: avgSpeed,
        sampledPoints: sampledPoints,
        trustIndex: 100.0,
        isPhysical: true
    };
};

// Legacy support wrappers
export const runAerotestCFDSimulation = async (
    params: DesignParameters, 
    onProgress: (progress: { stage: string; progress: number; log?: string }) => void,
    carClass: CarClass,
    punkRecords: PunkRecordsState
): Promise<Omit<AeroResult, 'id' | 'fileName' | 'suggestions' | 'scrutineeringReport'>> => {
    // Default to fluid/earth for legacy calls
    return runUniversalSimulation(params, onProgress, 'FLUID_DYNAMICS', 'EARTH_STD');
};

export const runAerotestPremiumCFDSimulation = async (
    params: DesignParameters, 
    onProgress: (progress: { stage: string; progress: number; log?: string }) => void,
    carClass: CarClass,
    punkRecords: PunkRecordsState
): Promise<Omit<AeroResult, 'id' | 'fileName' | 'suggestions' | 'scrutineeringReport'>> => {
    return runUniversalSimulation(params, onProgress, 'FLUID_DYNAMICS', 'EARTH_STD');
};

// --- THE UNIVERSAL SOLVER ENTRY POINT ---
export const runUniversalSimulation = async (
    params: DesignParameters,
    onProgress: (progress: { stage: string; progress: number; log?: string }) => void,
    domain: PhysicsDomain,
    env: EnvironmentPreset
): Promise<Omit<AeroResult, 'id' | 'fileName' | 'suggestions' | 'scrutineeringReport'>> => {

    const envFactors = getEnvironmentFactors(env);

    // --- STAGE 1: GEOMETRY INGESTION (AI #2) ---
    onProgress({ stage: 'Constructing Universal Domain', progress: 5, log: `AI #2: Mapping topology to ${domain} grid...` });
    await new Promise(r => setTimeout(r, 300));

    // --- STAGE 2: PUNK RECORDS CONNECTION (AI #1) ---
    onProgress({ stage: 'Punk Records Uplink', progress: 20, log: 'AI #1: Retrieving Ancient Kingdom Archives...' });
    await new Promise(r => setTimeout(r, 400));

    // --- STAGE 3: PHYSICS SYNTHESIS (AI #1) ---
    const governingEq = synthesizeEquation(domain);
    onProgress({ stage: 'Synthesizing Laws', progress: 40, log: `AI #1: New Governing Equation Derived: ${governingEq}` });
    await new Promise(r => setTimeout(r, 600));

    // --- STAGE 4: MULTIVERSE BRANCHING (AI #2) ---
    onProgress({ stage: 'Multiverse Branching', progress: 60, log: 'AI #2: Forking simulation into 3 parallel realities...' });
    await new Promise(r => setTimeout(r, 500));

    // --- STAGE 5: SOLVING (AI #2) ---
    onProgress({ stage: 'Solving...', progress: 85, log: `AI #2: Iterating matrix with ${env} constants (g=${envFactors.g})...` });
    
    // Generate Metrics
    const entropy = Math.random() * 10;
    const eggheadMetrics: EggheadMetrics = {
        generatedGoverningEquation: governingEq,
        entropyGenerationRate: entropy,
        vortexLatticeStrength: Math.random(),
        boundaryLayerTripPoint: 50,
        shockwaveIntensity: env === 'SPACE_VACUUM' ? 0 : Math.random() * 2,
        futurePredictionDate: "2124-05-12"
    };

    // Physics Calculation - REALISTIC HEURISTIC MODEL
    // Calculate Cd based on car parameters (slenderness, wing span, weight)
    // 1. Length Factor: Ideal length around 210mm. Penalty for deviation or short cars.
    const lengthFactor = params.totalLength ? (210 - params.totalLength) * 0.001 : 0; 
    // 2. Width Factor: Wider cars have more frontal area drag
    const widthFactor = params.totalWidth ? params.totalWidth * 0.0005 : 0; 
    // 3. Weight Factor: Heavier cars often implies bulkier geometry (surface area proxy)
    const weightFactor = params.totalWeight ? (params.totalWeight - 50) * 0.0002 : 0; 
    
    // Hash based variation for uniqueness
    const nameHash = params.carName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const uniqueChaos = Math.sin(nameHash + (params.totalLength || 0)) * 0.02;

    let calculatedCd = 0.12 + lengthFactor + widthFactor + weightFactor + uniqueChaos;
    // Clamp to realistic F1S values (usually 0.15 - 0.4)
    calculatedCd = Math.max(0.12, Math.min(0.5, calculatedCd));
    
    // Calculate Cl (Lift/Downforce)
    // Front wing span increases downforce (negative lift)
    const wingFactor = (params.frontWingSpan || 0) * 0.002 + (params.rearWingSpan || 0) * 0.003;
    let calculatedCl = 0.05 + wingFactor + (uniqueChaos * 0.5);

    // Apply Environment Scaling
    const cd = (domain === 'FLUID_DYNAMICS') ? calculatedCd * envFactors.rho : 0.05;
    const cl = (domain === 'FLUID_DYNAMICS') ? calculatedCl * envFactors.rho : 0.01;
    
    // Run Physics Engine (RK4)
    const raceData = performRK4Race(cd, params.totalWeight, eggheadMetrics, envFactors);
    const multiverseData = generateMultiverseData(params, envFactors, domain);

    // Atlas Force Breakdown (Dynamic based on domain)
    const breakdown: AtlasForceBreakdown = {
        pressure: domain === 'SOLID_MECHANICS' ? 80 : 40,
        skinFriction: domain === 'FLUID_DYNAMICS' ? 30 : 5,
        induced: 10,
        interference: 10,
        tetherWake: 5,
        microVibration: 5
    };

    await new Promise(r => setTimeout(r, 300));

    return {
        timestamp: new Date().toISOString(),
        tier: 'premium',
        thrustModel: 'pro-competition',
        carClass: 'Professional',
        parameters: params,
        domain,
        environment: env,
        multiverseData,
        cd,
        cl,
        liftToDragRatio: cd > 0 ? cl / cd : 0,
        dragBreakdown: breakdown,
        aeroBalance: 50,
        flowAnalysis: `Egghead Engine V-01: ${domain} Analysis Complete in ${env} Environment.`,
        raceTimePrediction: raceData,
        meshQuality: 100,
        convergenceStatus: 'Converged',
        simulationTime: raceData.averageRaceTime,
        eggheadMetrics: eggheadMetrics,
        aiCorrectionModel: {
            originalCd: cd * 1.15,
            optimizedCd: cd,
            potentialTimeSave: 0.05,
            confidence: 100,
            evolutionPath: [],
            suggestion: "Optimize entropy generation.",
            appliedFormula: governingEq
        }
    };
};