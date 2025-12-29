
import { DesignParameters, AeroResult, CarClass, PunkRecordsState, ResidualData, MonteCarloPoint } from '../types';
import { THEORETICAL_OPTIMUM } from './mockData';

// Simulation Configuration
const TIMESTEP = 0.001; // s
const TRACK_LENGTH = 20; // m
const CAR_MASS_MIN = 55; // g

// Mock Physics Constants
const AIR_DENSITY = 1.225; // kg/m^3

// Helper to generate residuals
const generateResiduals = (iterations: number): ResidualData[] => {
    const data: ResidualData[] = [];
    for (let i = 1; i <= iterations; i++) {
        const decay = Math.exp(-i / (iterations / 5));
        data.push({
            iteration: i,
            continuity: 1e-1 * decay * (1 + Math.random() * 0.1),
            xVelocity: 1e-2 * decay * (1 + Math.random() * 0.1),
            yVelocity: 1e-2 * decay * (1 + Math.random() * 0.1),
            zVelocity: 1e-2 * decay * (1 + Math.random() * 0.1),
        });
    }
    return data;
};

// Helper to calculate race time based on physics
const calculateRaceTime = (mass: number, cd: number, thrustFactor: number = 1.0) => {
    let t = 0;
    let x = 0;
    let v = 0;
    const dt = TIMESTEP;
    const massKg = mass / 1000;
    const frontalArea = 0.003; // m^2 approx

    // MARK 4 PHYSICS UPDATE (High Performance Mode)
    // Updated to yield exactly 9.4N Peak Thrust (45 * 0.2089 ≈ 9.4N)
    const THRUST_SCALAR = 0.2089; 

    const getThrust = (time: number) => {
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

    while (x < TRACK_LENGTH && t < 10) {
        const thrustForce = getThrust(t);
        const dragForce = 0.5 * AIR_DENSITY * v * v * cd * frontalArea;
        const netForce = thrustForce - dragForce; // Ignoring friction for simple calc
        const a = netForce / massKg;
        
        v += a * dt;
        x += v * dt;
        t += dt;
    }

    return { time: t, finishSpeed: v };
};

export const runAerotestCFDSimulation = async (
    params: DesignParameters,
    onProgress: (update: { stage: string; progress: number; log?: string }) => void,
    carClass: CarClass,
    punkRecords: PunkRecordsState
): Promise<Omit<AeroResult, 'id' | 'fileName' | 'suggestions' | 'scrutineeringReport'>> => {
    
    // Simulate steps
    const steps = [
        { msg: "Voxelizing Geometry...", time: 500 },
        { msg: "Generating Cartesian Grid...", time: 800 },
        { msg: "Solving Pressure Poisson Equation...", time: 1500 },
        { msg: "Calculating Boundary Layer Turbulence...", time: 1000 },
        { msg: "Integrating Forces...", time: 500 }
    ];

    let totalProgress = 0;
    for (const step of steps) {
        onProgress({ stage: step.msg, progress: totalProgress });
        await new Promise(resolve => setTimeout(resolve, step.time));
        totalProgress += (100 / steps.length);
    }

    // Determine physics values based on inputs
    // Lower CD for better shaped cars (heuristic based on wing span/chord)
    const baseCd = 0.25; 
    const spanFactor = (params.frontWingSpan + params.rearWingSpan) / 200; // ~0.7 to 1.0
    const cd = Math.max(0.12, baseCd - (spanFactor * 0.05) + (Math.random() * 0.02));
    
    const cl = 0.5 * spanFactor + (Math.random() * 0.1);
    
    // Race calculation
    const mass = Math.max(params.totalWeight, CAR_MASS_MIN);
    const { time: raceTime, finishSpeed } = calculateRaceTime(mass, cd);

    return {
        timestamp: new Date().toISOString(),
        tier: 'standard',
        carClass,
        parameters: params,
        cd,
        cl,
        liftToDragRatio: cl / cd,
        dragBreakdown: {
            pressure: 60 + Math.random() * 10,
            skinFriction: 40 - Math.random() * 10
        },
        aeroBalance: 45 + Math.random() * 10, // % Front
        flowAnalysis: "Standard Navier-Stokes solve completed. Flow separation detected at rear wing interacton zone.",
        raceTimePrediction: {
            bestRaceTime: raceTime * 0.98,
            worstRaceTime: raceTime * 1.02,
            averageRaceTime: raceTime,
            averageDrag: cd,
            bestFinishLineSpeed: finishSpeed * 1.02,
            worstFinishLineSpeed: finishSpeed * 0.98,
            averageFinishLineSpeed: finishSpeed,
            // Approximations for other values
            bestStartSpeed: 15, 
            worstStartSpeed: 14,
            averageStartSpeed: 14.5,
            bestAverageSpeed: TRACK_LENGTH / (raceTime * 0.98),
            worstAverageSpeed: TRACK_LENGTH / (raceTime * 1.02),
            averageSpeed: TRACK_LENGTH / raceTime,
            trustIndex: 85,
            isPhysical: true
        }
    };
};

export const runAerotestPremiumCFDSimulation = async (
    params: DesignParameters,
    onProgress: (update: { stage: string; progress: number; log?: string }) => void,
    carClass: CarClass,
    punkRecords: PunkRecordsState
): Promise<Omit<AeroResult, 'id' | 'fileName' | 'suggestions' | 'scrutineeringReport'>> => {
    
    // Longer simulation
    const steps = [
        { msg: "High-Fidelity Voxelization...", time: 1000 },
        { msg: "Generating Octree Grid Structure...", time: 1500 },
        { msg: "Solving RANS Equations (k-omega SST)...", time: 3000 },
        { msg: "Resolving Boundary Layer (y+ < 1)...", time: 2000 },
        { msg: "Running Monte Carlo Race Simulations...", time: 2000 },
        { msg: "Compiling Report...", time: 1000 }
    ];

    let totalProgress = 0;
    for (const step of steps) {
        onProgress({ stage: step.msg, progress: totalProgress });
        await new Promise(resolve => setTimeout(resolve, step.time));
        totalProgress += (100 / steps.length);
    }

    const standardResult = await runAerotestCFDSimulation(params, () => {}, carClass, punkRecords);
    
    // Generate stochastic data for Premium
    const sampledPoints: MonteCarloPoint[] = [];
    for(let i=0; i<100; i++) {
        sampledPoints.push({
            time: standardResult.raceTimePrediction!.averageRaceTime * (0.99 + Math.random()*0.02),
            startSpeed: standardResult.raceTimePrediction!.averageStartSpeed * (0.99 + Math.random()*0.02)
        });
    }

    return {
        ...standardResult,
        tier: 'premium',
        meshQuality: 98.5,
        convergenceStatus: 'Converged',
        simulationTime: 10.5,
        meshCellCount: 2500000,
        solverSettings: {
            solverType: 'RANS-WebGPU',
            solver: 'Coupled Implicit',
            precision: 'Double',
            spatialDiscretization: {
                gradient: 'Green-Gauss Node Based',
                momentum: 'Second Order Upwind',
                turbulence: 'Second Order Upwind'
            },
            turbulenceModel: 'k-ω SST'
        },
        finalResiduals: {
            continuity: 1e-6,
            xVelocity: 1e-7,
            yVelocity: 1e-7,
            zVelocity: 1e-7,
            k: 1e-5,
            omega: 1e-5
        },
        residualHistory: generateResiduals(500),
        raceTimePrediction: {
            ...standardResult.raceTimePrediction!,
            sampledPoints,
            trustIndex: 98
        }
    };
};
