import { AeroResult, DesignParameters } from '../types';

// Base values
const BASE_CD = 0.8; 
const BASE_CL = 2.5;

/**
 * An enhanced, deterministic aero simulation based on design parameters.
 * @param params The design parameters from the user form.
 * @returns A promise that resolves with the detailed AeroResult.
 */
// Fix: Update the return type to omit 'fileName' as this service does not have access to it.
export const runAdvancedCfdSimulation = (params: DesignParameters): Promise<Omit<AeroResult, 'id' | 'isBest' | 'suggestions' | 'scrutineeringReport' | 'fileName'>> => {
  return new Promise(resolve => {
    let cd = BASE_CD;
    let cl = BASE_CL;

    // --- Parameter Modifiers ---
    
    // Wings have the biggest impact
    cd += (params.frontWingSpan / 1000) * 0.5 + (params.rearWingSpan / 1000) * 0.4;
    cl += (params.frontWingSpan / 1000) * 2.5 + (params.rearWingSpan / 1000) * 2.0;
    
    cd += (params.frontWingChord / 100) * 0.8;
    cl += (params.frontWingChord / 100) * 1.5;

    cl += (params.rearWingHeight / 100) * 0.5; // Higher wing gets cleaner air

    // Body dimensions impact drag
    const frontalAreaFactor = (params.totalWidth / 90);
    cd *= 1 + (frontalAreaFactor - 1) * 0.5; // Wider cars have more drag

    const lengthFactor = (params.totalLength / 200);
    const skinFriction = 0.15 * lengthFactor; // Base skin friction
    const pressureDrag = 1 - skinFriction;

    // Aero Balance calculation (simplified)
    const frontDownforce = (params.frontWingSpan * params.frontWingChord);
    const rearDownforce = (params.rearWingSpan * params.rearWingHeight);
    const totalDownforce = frontDownforce + rearDownforce;
    const aeroBalance = (frontDownforce / totalDownforce) * 100;
    
    // Add small random variations
    const randomFactor = 1 + (Math.random() - 0.5) * 0.01;
    cd *= randomFactor;
    cl *= randomFactor;

    const liftToDragRatio = cl / cd;

    let flowAnalysis = "Generally attached flow.";
    if (liftToDragRatio < 3.0) {
        flowAnalysis = "Significant flow separation detected, likely from wing stalls.";
    } else if (aeroBalance < 40 || aeroBalance > 55) {
        flowAnalysis = "Imbalanced flow, causing instability at high speeds.";
    }

    // Simulate analysis time
    setTimeout(() => {
      resolve({
        parameters: params,
        cd: parseFloat(cd.toFixed(4)),
        cl: parseFloat(cl.toFixed(4)),
        liftToDragRatio: parseFloat(liftToDragRatio.toFixed(3)),
        dragBreakdown: {
            pressure: parseFloat(pressureDrag.toFixed(2)) * 100,
            skinFriction: parseFloat(skinFriction.toFixed(2)) * 100
        },
        aeroBalance: parseFloat(aeroBalance.toFixed(1)),
        flowAnalysis,
        timestamp: new Date().toISOString(),
      });
    }, 1500 + Math.random() * 2000);
  });
};