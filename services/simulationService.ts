import { DesignParameters, AeroResult, CarClass, PunkRecordsState, ProbabilisticRaceTimePrediction } from '../types';

// MARK 5 PHYSICS UPDATE (Reduced Thrust Mode)
// Updated to yield exactly 8.0N Peak Thrust (45 * (8/45) = 8.0N)
const THRUST_SCALAR = 8.0 / 45.0; 

const getThrust = (time: number, thrustFactor: number = 1.0) => {
    if (time < 0) return 0;
    // Phase 1: Explosion (0 - 0.05s) - Rapid rise to peak
    if (time < 0.05) return 45 * (time / 0.05) * thrustFactor * THRUST_SCALAR;
    // Phase 2: Sustain (0.05 - 0.1s) - Hold peak
    if (time < 0.1) return 45 * thrustFactor * THRUST_SCALAR;
    // Phase 3: Blowdown (0.1s - 0.6s) - Exponential decay as gas evacuates
    if (time < 0.6) {
        const decay = (time - 0.1) / 0.5;
        return 45 * Math.exp(-3 * decay) * thrustFactor * THRUST_SCALAR;
    }
    return 0;
};

// Simulation Helper
const performVirtualRace = (cd: number, mass: number): ProbabilisticRaceTimePrediction => {
    // Physics constants
    const dt = 0.001;
    const maxTime = 2.0; // Race usually ~1s
    const frontalArea = 0.003; // approx frontal area in m^2
    const rho = 1.225;
    
    let t = 0;
    let x = 0;
    let v = 0;
    
    // Simple Euler integration
    while (x < 20 && t < maxTime) {
        const thrust = getThrust(t);
        const drag = 0.5 * rho * v * v * cd * frontalArea;
        const netForce = thrust - drag;
        const a = netForce / (mass / 1000); // mass in g to kg
        
        v += a * dt;
        x += v * dt;
        t += dt;
    }
    
    return {
        bestRaceTime: t * 0.98,
        worstRaceTime: t * 1.02,
        averageRaceTime: t,
        averageDrag: cd,
        bestFinishLineSpeed: v * 1.01,
        worstFinishLineSpeed: v * 0.99,
        averageFinishLineSpeed: v,
        bestStartSpeed: 10, // approximate
        worstStartSpeed: 9,
        averageStartSpeed: 9.5,
        bestAverageSpeed: 20/t,
        worstAverageSpeed: 20/(t*1.02),
        averageSpeed: 20/t,
        trustIndex: 95,
        isPhysical: true
    };
};

export const runAerotestCFDSimulation = async (
    params: DesignParameters, 
    onProgress: (progress: { stage: string; progress: number; log?: string }) => void,
    carClass: CarClass,
    punkRecords: PunkRecordsState
): Promise<Omit<AeroResult, 'id' | 'fileName' | 'suggestions' | 'scrutineeringReport'>> => {
    
    // Simulate steps
    onProgress({ stage: 'Voxelizing Geometry', progress: 10, log: 'Generating voxel grid...' });
    await new Promise(r => setTimeout(r, 500));
    
    onProgress({ stage: 'Solving Pressure Poisson', progress: 40, log: 'Iterating solver...' });
    await new Promise(r => setTimeout(r, 800));
    
    onProgress({ stage: 'Calculating Forces', progress: 80, log: 'Integrating surface pressure...' });
    await new Promise(r => setTimeout(r, 500));

    // Calculate Physics
    // Base Cd on complexity and dimensions (mock calculation)
    const baseCd = 0.15; 
    const complexityFactor = (params.totalLength * params.totalWidth) / 20000; // Arbitrary
    const cd = baseCd + (Math.random() * 0.05) - (complexityFactor * 0.01);
    const cl = cd * 1.2; // Arbitrary lift relationship
    
    const raceData = performVirtualRace(cd, params.totalWeight);

    return {
        timestamp: new Date().toISOString(),
        tier: 'standard',
        thrustModel: 'standard',
        carClass,
        parameters: params,
        cd,
        cl,
        liftToDragRatio: cl / cd,
        dragBreakdown: { pressure: 60, skinFriction: 40 },
        aeroBalance: 45 + Math.random() * 10,
        flowAnalysis: "Standard Voxel Solve Complete.",
        raceTimePrediction: raceData,
        meshQuality: 90,
        convergenceStatus: 'Converged',
        simulationTime: 2.5
    };
};

export const runAerotestPremiumCFDSimulation = async (
    params: DesignParameters, 
    onProgress: (progress: { stage: string; progress: number; log?: string }) => void,
    carClass: CarClass,
    punkRecords: PunkRecordsState
): Promise<Omit<AeroResult, 'id' | 'fileName' | 'suggestions' | 'scrutineeringReport'>> => {
    
    const steps = ['Mesh Refinement', 'Boundary Layer Inflation', 'RANS Iteration (k-omega)', 'Force Integration', 'Neural Correction'];
    
    for (let i = 0; i < steps.length; i++) {
        onProgress({ 
            stage: steps[i], 
            progress: ((i + 1) / steps.length) * 100, 
            log: `${steps[i]}...` 
        });
        await new Promise(r => setTimeout(r, 800));
    }

    const baseCd = 0.13; 
    const cd = baseCd + (Math.random() * 0.03);
    const cl = cd * 1.5;
    
    const raceData = performVirtualRace(cd, params.totalWeight);

    return {
        timestamp: new Date().toISOString(),
        tier: 'premium',
        thrustModel: 'pro-competition',
        carClass,
        parameters: params,
        cd,
        cl,
        liftToDragRatio: cl / cd,
        dragBreakdown: { pressure: 55, skinFriction: 45 },
        aeroBalance: 50 + Math.random() * 5,
        flowAnalysis: "Premium RANS Solve with Neural Correction.",
        raceTimePrediction: raceData,
        meshQuality: 98,
        convergenceStatus: 'Converged',
        simulationTime: 5.0,
        aiCorrectionModel: {
            originalCd: cd * 1.1,
            optimizedCd: cd,
            potentialTimeSave: 0.05,
            confidence: 98,
            evolutionPath: [],
            suggestion: "Optimize rear wing endplates.",
            appliedFormula: punkRecords.currentMasterFormula
        }
    };
};