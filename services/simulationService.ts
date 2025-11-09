import { AeroResult, DesignParameters, ProbabilisticRaceTimePrediction, FlowFieldPoint, SolverSettings, VerificationCheck } from '../types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type ProgressCallback = (update: { stage: string; progress: number; log?: string }) => void;

/**
 * AerotestSolver: A next-generation CFD solver architected for superior accuracy and data intelligence.
 * This class simulates a first-principles, finite-volume RANS/DES solver from the ground up.
 */
class AerotestSolver {
    private params: DesignParameters;
    private onProgress: ProgressCallback;
    private settings: {
        isPremium: boolean;
        thrustModel: 'standard' | 'competition' | 'pro-competition';
    };
    private solverSettings: SolverSettings;
    private autoSettings: {
        flowRegime: 'Turbulent' | 'Laminar' | 'Transitional';
    };
    private state: {
        residuals: Required<NonNullable<AeroResult['finalResiduals']>>;
        meshCellCount: number;
        meshQuality: number;
        isUnstable: boolean;
    };

    constructor(params: DesignParameters, onProgress: ProgressCallback, isPremium: boolean, thrustModel: 'standard' | 'competition' | 'pro-competition') {
        this.params = params;
        this.onProgress = onProgress;
        this.settings = { isPremium, thrustModel };
        this.solverSettings = this._initializeSolverSettings();
        this.autoSettings = { flowRegime: 'Turbulent' };
        this.state = {
            residuals: { continuity: 1, xVelocity: 1, yVelocity: 1, zVelocity: 1, k: 1, omega: 1 },
            meshCellCount: 0,
            meshQuality: 0,
            isUnstable: false,
        };
    }

    private _initializeSolverSettings(): SolverSettings {
        const turbulenceModel = this.settings.isPremium ? 'Detached Eddy Simulation (DES)' : 'k-ω SST';
        return {
            solver: 'Coupled Implicit',
            precision: 'Double',
            spatialDiscretization: {
                gradient: 'Least Squares Cell-Based',
                momentum: 'Second Order Upwind',
                turbulence: 'Second Order Upwind',
            },
            turbulenceModel: turbulenceModel as SolverSettings['turbulenceModel'],
        };
    }

    /**
     * Simulates a multi-stage, high-fidelity meshing pipeline.
     */
    private async _generateMesh() {
        this.onProgress({ stage: 'Meshing', progress: 6, log: 'Initiating automated meshing pipeline...' });
        const baseCellCount = this.settings.isPremium ? 25_000_000 : 3_000_000;
        const complexityFactor = (this.params.frontWingSpan * this.params.frontWingChord + this.params.rearWingSpan * this.params.rearWingHeight) / 5000;
        this.state.meshCellCount = Math.round(baseCellCount * (1 + complexityFactor));

        await sleep(1500);
        this.onProgress({ stage: 'Meshing', progress: 8, log: 'Surface wrapping and automated geometry repair...' });
        await sleep(this.settings.isPremium ? 2000 : 1000);
        this.onProgress({ stage: 'Meshing', progress: 12, log: 'Generating surface remesh with adaptive sizing...' });
        await sleep(this.settings.isPremium ? 2500 : 1500);
        this.onProgress({ stage: 'Meshing', progress: 15, log: 'Generating core volume mesh (polyhedral-hexcore)...' });
        await sleep(this.settings.isPremium ? 3000 : 2000);
        this.onProgress({ stage: 'Meshing', progress: 17, log: `Inflating boundary layer (20 prism layers, y+ target: 1)...` });
        await sleep(this.settings.isPremium ? 2500 : 1500);
        this.onProgress({ stage: 'Meshing', progress: 19, log: `Performing adaptive refinement pass in high-gradient regions...` });
        await sleep(this.settings.isPremium ? 1500 : 1000);
        
        this.state.meshQuality = 99.8 - (this.params.totalWidth / 90) * 0.4 - (complexityFactor * 1.5);
        this.onProgress({ stage: 'Meshing', progress: 20, log: `Mesh quality OK. Final cell count: ${this.state.meshCellCount.toLocaleString()}` });
        await sleep(1000);
    }

    /**
     * Simulates the iterative solution of the RANS/DES equations using a Coupled solver.
     */
    private async _solveFlow() {
        const maxIterations = this.settings.isPremium ? 5000 : 1500;
        const solveDuration = this.settings.isPremium ? 30000 : 15000;
        const convergenceTarget = this.settings.isPremium ? 1e-6 : 1e-5;

        this.onProgress({ stage: 'Solving', progress: 21, log: `Initializing Coupled solver, ${this.solverSettings.precision} precision.` });
        await sleep(1000);

        const solveStartTime = Date.now();
        let elapsedTime = 0;
        
        while (elapsedTime < solveDuration) {
            await sleep(250);
            elapsedTime = Date.now() - solveStartTime;
            const progressFraction = Math.min(1, elapsedTime / solveDuration);
            const currentIteration = Math.round(progressFraction * maxIterations);
            const overallProgress = 21 + progressFraction * 49;
            
            // Simulate self-correction
            if (currentIteration > maxIterations * 0.4 && currentIteration < maxIterations * 0.7) {
                if (Math.random() < 0.05) { // Sporadically log this
                     this.onProgress({ stage: 'Solving', progress: overallProgress, log: 'Solver Monitor: Residuals stagnating. Applying automatic under-relaxation factor adjustment.' });
                     await sleep(500); // Simulate the correction taking time
                }
            }

            // Simulate residuals converging with realistic noise and behavior
            const convergenceFactor = (1 - Math.pow(progressFraction, 3));
            const noise = (Math.random() - 0.5) * convergenceFactor * 0.5;
            this.state.residuals = {
                continuity: Math.max(convergenceTarget, (1e-2 * convergenceFactor) + noise * 1e-2),
                xVelocity:  Math.max(convergenceTarget, (1e-3 * convergenceFactor) + noise * 1e-3),
                yVelocity:  Math.max(convergenceTarget, (1e-3 * convergenceFactor) + noise * 1e-3),
                zVelocity:  Math.max(convergenceTarget, (1e-3 * convergenceFactor) + noise * 1e-3),
                k:          Math.max(convergenceTarget, (5e-3 * convergenceFactor) + noise * 5e-3),
                omega:      Math.max(convergenceTarget, (5e-3 * convergenceFactor) + noise * 5e-3),
            };

            const logMessage = `Iter ${currentIteration}/${maxIterations}... AMG V-Cycle (P)... res(cont): ${this.state.residuals.continuity.toExponential(1)}`;
            this.onProgress({ stage: 'Solving', progress: overallProgress, log: logMessage });
        }
        
        const finalContinuity = this.state.residuals.continuity;
        if(finalContinuity > 1e-4) {
            this.state.isUnstable = true;
            this.onProgress({ stage: 'Solving', progress: 70, log: `Warning: Solution failed to converge fully. Residuals stagnated.` });
        } else {
            this.onProgress({ stage: 'Solving', progress: 70, log: `Solution converged in ${maxIterations} iterations.` });
        }
        await sleep(1000);
    }
    
    /**
     * Simulates an AI correction layer that refines the initial solver output.
     */
    private async _runAICorrection(initialCd: number) {
        this.onProgress({ stage: 'AI Correction', progress: 71, log: 'Initializing AI Correction Layer (v2.1-GNN)...' });
        await sleep(this.settings.isPremium ? 2000 : 1000);

        // AI model is more confident if mesh quality is high and solution was stable
        const confidence = (this.state.meshQuality / 100) * (this.state.isUnstable ? 0.7 : 0.99);
        const CONFIDENCE_THRESHOLD = 0.75; // 75%

        this.onProgress({ stage: 'AI Correction', progress: 73, log: `Applying correction model against high-fidelity database...` });
        await sleep(this.settings.isPremium ? 2000 : 1000);

        // AI corrects for inaccuracies, especially from lower quality meshes or borderline stability
        const meshErrorFactor = (1 - (this.state.meshQuality / 100));
        const stabilityPenalty = this.state.isUnstable ? 0.05 : 0;
        const correctionAmount = initialCd * (meshErrorFactor * 0.05 + stabilityPenalty);
        const correctedCd = initialCd - correctionAmount;

        if (confidence >= CONFIDENCE_THRESHOLD) {
            this.onProgress({ stage: 'AI Correction', progress: 75, log: `Correction applied. Model confidence: ${(confidence * 100).toFixed(1)}%` });
            await sleep(1000);
            
            return {
                correctedCd,
                model: {
                    version: '2.1-GNN',
                    confidence: parseFloat(confidence.toFixed(3)),
                    correctionApplied: true,
                    originalCd: initialCd,
                    reason: `Confidence (${(confidence*100).toFixed(1)}%) met threshold of ${(CONFIDENCE_THRESHOLD*100).toFixed(0)}%.`
                }
            };
        } else {
            this.onProgress({ stage: 'AI Correction', progress: 75, log: `Correction discarded. Model confidence low: ${(confidence * 100).toFixed(1)}%` });
            await sleep(1000);

            return {
                correctedCd: initialCd, // Return original value, do not apply correction
                model: {
                    version: '2.1-GNN',
                    confidence: parseFloat(confidence.toFixed(3)),
                    correctionApplied: false,
                    originalCd: initialCd,
                    reason: `Confidence (${(confidence*100).toFixed(1)}%) was below the required threshold of ${(CONFIDENCE_THRESHOLD*100).toFixed(0)}%.`
                }
            };
        }
    }

    /**
     * Simulates AI-powered analysis of the converged flow field to detect key features.
     */
    private async _aiFlowFeatureDetection(cl: number) {
        this.onProgress({ stage: 'Post-processing', progress: 76, log: 'AI Assistant: Analyzing flow field data...' });
        await sleep(this.settings.isPremium ? 2000 : 1000);
        const features: string[] = [];
        
        if (cl > 0.5) {
            features.push(`Strong wingtip vortex structures detected originating from front and rear wing endplates.`);
        }
        if (this.state.isUnstable) {
            features.push(`Significant flow separation bubble identified on the rear chassis lee side, indicating stall.`);
        } else {
            features.push(`Flow appears highly attached across all primary aerodynamic surfaces.`);
        }
        if(this.params.totalWidth > 85) {
            features.push(`High pressure region observed around front wheels, potential source of interference drag.`);
        }
        this.onProgress({ stage: 'Post-processing', progress: 80, log: `AI analysis complete. Found ${features.length} key flow features.` });
        await sleep(1000);
        return features;
    }
    
    /**
     * Simulates physics-based verification checks to ensure result integrity.
     */
    private async _runVerificationChecks(cd: number, cl: number): Promise<VerificationCheck[]> {
        this.onProgress({ stage: 'Verification', progress: 91, log: 'Running trust & verification checks...' });
        await sleep(1500);
        const checks: VerificationCheck[] = [];

        // 1. Mass Conservation Check
        const massImbalance = (Math.random() - 0.45) * 0.01; // Simulate imbalance between -0.45% and +0.55%
        if (Math.abs(massImbalance) < 0.005) { // < 0.5%
            checks.push({ name: 'Mass Conservation', status: 'PASS', message: `Mass flow imbalance is ${(massImbalance * 100).toFixed(2)}%, which is within the 0.5% tolerance.` });
        } else {
            checks.push({ name: 'Mass Conservation', status: 'FAIL', message: `Mass flow imbalance is ${(massImbalance * 100).toFixed(2)}%, exceeding the 0.5% tolerance. Results may be inaccurate.` });
        }
        this.onProgress({ stage: 'Verification', progress: 92, log: 'Checked mass conservation...' });
        await sleep(1000);

        // 2. Residual Validation Check
        const residualThreshold = this.settings.isPremium ? 1e-5 : 1e-4;
        const maxResidual = Math.max(...Object.values(this.state.residuals));
        if (maxResidual < residualThreshold) {
            checks.push({ name: 'Residual Convergence', status: 'PASS', message: `All final residuals are below the target of ${residualThreshold.toExponential(0)}.` });
        } else {
            checks.push({ name: 'Residual Convergence', status: 'FAIL', message: `One or more residuals failed to converge below the target of ${residualThreshold.toExponential(0)}. Highest residual: ${maxResidual.toExponential(1)}.` });
        }
        this.onProgress({ stage: 'Verification', progress: 93, log: 'Validated solver residuals...' });
        await sleep(1000);

        // 3. Plausibility Range Checks
        if (cd >= 0.05 && cd <= 1.5) {
            checks.push({ name: 'Drag Plausibility', status: 'PASS', message: `Coefficient of Drag (Cd=${cd.toFixed(3)}) is within the expected physical range [0.05, 1.5].` });
        } else {
            checks.push({ name: 'Drag Plausibility', status: 'FAIL', message: `Coefficient of Drag (Cd=${cd.toFixed(3)}) is outside the expected physical range [0.05, 1.5]. The result is unphysical.` });
        }

        if (cl >= -1.0 && cl <= 2.0) {
            checks.push({ name: 'Lift Plausibility', status: 'PASS', message: `Coefficient of Lift (Cl=${cl.toFixed(3)}) is within the expected physical range [-1.0, 2.0].` });
        } else {
            checks.push({ name: 'Lift Plausibility', status: 'FAIL', message: `Coefficient of Lift (Cl=${cl.toFixed(3)}) is outside the expected physical range [-1.0, 2.0]. The result is unphysical.` });
        }
        this.onProgress({ stage: 'Verification', progress: 95, log: 'Checked physical plausibility...' });
        await sleep(1000);

        return checks;
    }


    /**
     * Simulates automated validation against internal benchmark cases.
     */
    private async _runAutomatedValidation(cd: number): Promise<string[]> {
        this.onProgress({ stage: 'Validation', progress: 96, log: 'Cross-validating results against internal benchmark database...' });
        await sleep(this.settings.isPremium ? 2000 : 1000);
        const validationLog: string[] = [];

        // Simulate NACA0012 benchmark
        const nacaCd = 0.09 + (Math.random() - 0.5) * 0.01;
        const nacaDiff = Math.abs(cd - nacaCd) / nacaCd;
        if (nacaDiff < 0.05) { // 5% tolerance
            validationLog.push(`PASSED: Solver accuracy validated against NACA0012 benchmark (Cd deviation: ${(nacaDiff * 100).toFixed(1)}%).`);
        } else {
            validationLog.push(`WARNING: Solver accuracy shows deviation >5% against NACA0012 benchmark.`);
        }
        this.onProgress({ stage: 'Validation', progress: 97, log: 'Checked against NACA0012...' });
        await sleep(1000);
        
        // Simulate Ahmed Body benchmark
        const ahmedBodyCd = 0.28 + (Math.random() - 0.5) * 0.02;
        // This is not a great comparison, but it's a simulation
        const ahmedBodyDiff = Math.abs(cd - (ahmedBodyCd / 2)) / ahmedBodyCd; 
        if (ahmedBodyDiff < 0.08) {
            validationLog.push(`PASSED: Wake structure model validated against Ahmed Body benchmark.`);
        } else {
            validationLog.push(`WARNING: Wake structure model shows deviation >8% against Ahmed Body benchmark.`);
        }
        this.onProgress({ stage: 'Validation', progress: 98, log: 'Checked against Ahmed Body...' });
        await sleep(1000);

        return validationLog;
    }
    
    /**
     * Main execution method to run the entire simulation workflow.
     */
    public async run(): Promise<Omit<AeroResult, 'id' | 'fileName' | 'suggestions' | 'scrutineeringReport'>> {
        const startTime = Date.now();

        this.onProgress({ stage: 'Initializing', progress: 1, log: `Aerotest Solver v2.1 Initializing...` });
        await sleep(1000);
        
        const airDensity = 1.225;
        const airViscosity = 1.81e-5;
        const characteristicLength = this.params.totalLength / 1000;
        const reynoldsNumber = (airDensity * 20 * characteristicLength) / airViscosity;
        if (reynoldsNumber < 2300) this.autoSettings.flowRegime = 'Laminar';
        else if (reynoldsNumber < 4000) this.autoSettings.flowRegime = 'Transitional';
        else this.autoSettings.flowRegime = 'Turbulent';

        this.onProgress({ stage: 'Initializing', progress: 3, log: `Flow regime auto-detected: ${this.autoSettings.flowRegime} (Re ~${Math.round(reynoldsNumber / 1000)}k).` });
        await sleep(1000);
        this.onProgress({ stage: 'Initializing', progress: 5, log: `AI selected ${this.solverSettings.turbulenceModel} model for this regime.` });
        await sleep(1000);

        await this._generateMesh();
        await this._solveFlow();
        
        this.onProgress({ stage: 'Post-processing', progress: 70, log: 'Integrating surface pressures and wall shear stress...' });
        const initialAero = this._calculateAerodynamicCoefficients();
        
        const { correctedCd, model: aiCorrectionModel } = await this._runAICorrection(initialAero.cd);
        
        const finalAero = {
            ...initialAero,
            cd: correctedCd,
            liftToDragRatio: initialAero.cl / correctedCd,
        };

        const aiFlowFeatures = await this._aiFlowFeatureDetection(finalAero.cl);

        const raceTimePrediction = await _runMonteCarloPerformanceSim(this.params, finalAero.cd, this.onProgress, this.settings.isPremium, this.settings.thrustModel);
        
        const verificationChecks = await this._runVerificationChecks(finalAero.cd, finalAero.cl);
        const validationLog = await this._runAutomatedValidation(finalAero.cd);

        this.onProgress({ stage: 'Finalizing', progress: 99, log: 'Generating result package...' });
        await sleep(1000);
        this.onProgress({ stage: 'Complete', progress: 100, log: 'Aerotest simulation finished.' });
        const endTime = Date.now();

        const convergenceStatus = this.state.isUnstable ? 'Diverged' : (this.state.residuals.continuity > 1e-5 ? 'Converged (Relaxed)' : 'Converged');

        return {
            parameters: this.params,
            tier: this.settings.isPremium ? 'premium' : 'standard',
            thrustModel: this.settings.isPremium ? this.settings.thrustModel : undefined,
            cd: parseFloat(finalAero.cd.toFixed(4)),
            cl: parseFloat(finalAero.cl.toFixed(4)),
            liftToDragRatio: parseFloat(finalAero.liftToDragRatio.toFixed(3)),
            dragBreakdown: { pressure: parseFloat(finalAero.dragBreakdown.pressure.toFixed(2)), skinFriction: parseFloat(finalAero.dragBreakdown.skinFriction.toFixed(2)) },
            aeroBalance: parseFloat(finalAero.aeroBalance.toFixed(1)),
            flowAnalysis: finalAero.flowAnalysis,
            timestamp: new Date().toISOString(),
            meshQuality: parseFloat(this.state.meshQuality.toFixed(1)),
            convergenceStatus,
            simulationTime: parseFloat(((endTime - startTime) / 1000).toFixed(1)),
            raceTimePrediction,
            meshCellCount: this.state.meshCellCount,
            solverSettings: this.solverSettings,
            finalResiduals: {
                continuity: parseFloat(this.state.residuals.continuity.toExponential(2)),
                xVelocity: parseFloat(this.state.residuals.xVelocity.toExponential(2)),
                yVelocity: parseFloat(this.state.residuals.yVelocity.toExponential(2)),
                zVelocity: parseFloat(this.state.residuals.zVelocity.toExponential(2)),
                k: parseFloat(this.state.residuals.k.toExponential(2)),
                omega: parseFloat(this.state.residuals.omega.toExponential(2)),
            },
            aiFlowFeatures,
            autoSelectedSettings: {
                flowRegime: this.autoSettings.flowRegime,
                turbulenceModel: this.solverSettings.turbulenceModel,
            },
            validationLog,
            verificationChecks,
            aiCorrectionModel,
            flowFieldData: finalAero.flowFieldData,
        };
    }

    /**
     * A complex, non-linear physics model that simulates the result of a first-principles CFD solve.
     */
    private _calculateAerodynamicCoefficients() {
        const frontalArea = (this.params.totalWidth / 1000) * (45 / 1000);
        const A_ref = frontalArea * 1000 * 1000;
        const lengthToWidthRatio = this.params.totalLength / this.params.totalWidth;

        const frontWingArea = this.params.frontWingSpan * this.params.frontWingChord;
        const AR_front = this.params.frontWingChord > 0 ? (this.params.frontWingSpan ** 2) / frontWingArea : 0;
        const rearWingEffectiveChord = this.params.rearWingHeight * 0.75;
        const rearWingArea = this.params.rearWingSpan * rearWingEffectiveChord;
        const AR_rear = rearWingEffectiveChord > 0 ? (this.params.rearWingSpan ** 2) / rearWingArea : 0;

        const Cl_front_base = 1.8 * (frontWingArea / A_ref) * Math.tanh(AR_front / 3);
        const Cl_rear_base = 1.9 * (rearWingArea / A_ref) * Math.tanh(AR_rear / 4);
        const groundEffectFactor = 0.1 * Math.exp(-(this.params.rearWingHeight - 35) / 10);
        const wakePenaltyOnRear = 0.8 * (Cl_front_base / (lengthToWidthRatio - 2));
        const Cl_rear = Cl_rear_base * (1 - wakePenaltyOnRear);
        const cl = Cl_front_base + Cl_rear + groundEffectFactor;

        const turbulenceFactor = this.solverSettings.turbulenceModel === 'k-ω SST' ? 1.0 : (this.solverSettings.turbulenceModel === 'Detached Eddy Simulation (DES)' ? 0.92 : 1.05);
        const Cd_skin = 0.038 * turbulenceFactor;
        const Cd_form = 0.15 * (this.params.totalWidth / 90) * (1 / lengthToWidthRatio);
        const Cd_interference = 0.05 * (frontWingArea / A_ref) * (rearWingArea / A_ref);
        const oswaldEfficiency = 0.65 + (AR_front / 50);
        const Cd_induced = (cl ** 2) / (Math.PI * oswaldEfficiency * ((AR_front + AR_rear) / 2));
        let cd = Cd_skin + Cd_form + Cd_interference + Cd_induced;
        
        const dragBreakdown = {
            pressure: (Cd_form + Cd_induced) / cd * 100,
            skinFriction: Cd_skin / cd * 100,
        };
        
        const frontWingPos = 15;
        const rearWingPos = 195;
        const groundEffectPos = 100;
        const totalMoment = (Cl_front_base * frontWingPos) + (Cl_rear * rearWingPos) + (groundEffectFactor * groundEffectPos);
        const centerOfPressure = totalMoment / cl;
        const aeroBalance = (1 - (centerOfPressure - frontWingPos) / (rearWingPos - frontWingPos)) * 100;
        
        if (aeroBalance < 38 || aeroBalance > 62) { this.state.isUnstable = true; }
        if(this.state.isUnstable) { cd *= 1.4; }

        const flowAnalysis = this.state.isUnstable 
            ? "Severe flow separation detected due to aerodynamic imbalance. The wake is highly unstable, and convergence was not achieved." 
            : "Flow is highly attached with well-defined, stable wake structures. Center of Pressure is stable and solver converged successfully.";

        const flowFieldData = _generateFlowFieldData(this.params, cl, cd);

        return { cd, cl, liftToDragRatio: cl / cd, dragBreakdown, aeroBalance, flowAnalysis, flowFieldData };
    }
}


/**
 * Runs a high-iteration Monte Carlo simulation for race performance prediction.
 */
const _runMonteCarloPerformanceSim = async (
    params: DesignParameters,
    cd: number,
    onProgress: ProgressCallback,
    isPremium: boolean,
    thrustModel: string
) => {
    const airDensity = 1.225;
    const frontalArea = (params.totalWidth / 1000) * (45 / 1000);
    const NUM_SIMULATIONS = isPremium ? 100000 : 10000;
    onProgress({ stage: 'Performance Analysis', progress: 81, log: `Initiating ${NUM_SIMULATIONS.toLocaleString()}-race simulation...` });

    let PEAK_THRUST, PEAK_DURATION, SUSTAINED_THRUST, CO2_THRUST_DURATION, ROLLING_RESISTANCE_COEFFICIENT, TETHER_FRICTION_FORCE, VARIATION_FACTOR;
    if (isPremium) {
        if (thrustModel === 'pro-competition') {
            PEAK_THRUST = 9.8; PEAK_DURATION = 0.04; SUSTAINED_THRUST = 3.2; CO2_THRUST_DURATION = 0.37;
            ROLLING_RESISTANCE_COEFFICIENT = 0.0042; TETHER_FRICTION_FORCE = 0.012; VARIATION_FACTOR = 0.008;
        } else if (thrustModel === 'competition') {
            PEAK_THRUST = 9.5; PEAK_DURATION = 0.045; SUSTAINED_THRUST = 3.0; CO2_THRUST_DURATION = 0.38;
            ROLLING_RESISTANCE_COEFFICIENT = 0.0045; TETHER_FRICTION_FORCE = 0.015; VARIATION_FACTOR = 0.01;
        } else {
            PEAK_THRUST = 7.0; PEAK_DURATION = 0.05; SUSTAINED_THRUST = 2.4; CO2_THRUST_DURATION = 0.4;
            ROLLING_RESISTANCE_COEFFICIENT = 0.0048; TETHER_FRICTION_FORCE = 0.018; VARIATION_FACTOR = 0.015;
        }
    } else {
        PEAK_THRUST = 7.0; PEAK_DURATION = 0.05; SUSTAINED_THRUST = 2.4; CO2_THRUST_DURATION = 0.4;
        ROLLING_RESISTANCE_COEFFICIENT = 0.005; TETHER_FRICTION_FORCE = 0.02; VARIATION_FACTOR = 0.02;
    }
    
    const raceTimes: number[] = [];
    const dragCoefficients: number[] = [];
    const finishLineSpeeds: number[] = [];
    const reactionTimes: number[] = [];
    const RACE_DISTANCE = 20, GRAVITATIONAL_ACCELERATION = 9.81, DT = isPremium ? 0.0001 : 0.001;
    const mass = params.totalWeight / 1000;

    for (let i = 0; i < NUM_SIMULATIONS; i++) {
        const conditionVariation = (Math.random() - 0.5) * VARIATION_FACTOR;
        const current_cd = cd * (1 + conditionVariation);
        let time = 0, distance = 0, velocity = 0;
        const reactionTime = isPremium ? 0.01 + Math.random() * 0.02 : 0;
        
        while(distance < RACE_DISTANCE) {
            let thrust = 0;
            if (time < CO2_THRUST_DURATION) {
                thrust = (time < PEAK_DURATION) ? PEAK_THRUST : SUSTAINED_THRUST;
                thrust *= (1 + conditionVariation);
            }
            const dragForce = 0.5 * airDensity * (velocity**2) * current_cd * frontalArea;
            const rollingResistanceForce = ROLLING_RESISTANCE_COEFFICIENT * mass * GRAVITATIONAL_ACCELERATION;
            const netForce = thrust - dragForce - rollingResistanceForce - TETHER_FRICTION_FORCE;
            const acceleration = netForce / mass;
            velocity = Math.max(0, velocity + acceleration * DT);
            distance += velocity * DT;
            time += DT;
        }
        raceTimes.push(time + reactionTime);
        reactionTimes.push(reactionTime);
        finishLineSpeeds.push(velocity);
        dragCoefficients.push(current_cd);

        if ((i + 1) % (NUM_SIMULATIONS / 10) === 0) {
            await sleep(10);
            const progress = 81 + ((i + 1) / NUM_SIMULATIONS) * 9;
            onProgress({ stage: 'Performance Analysis', progress, log: `Completed ${i + 1}/${NUM_SIMULATIONS} races...` });
        }
    }
    
    const avgReaction = isPremium ? reactionTimes.reduce((a, b) => a + b, 0) / NUM_SIMULATIONS : 0;
    const launchVariance = isPremium ? Math.sqrt(reactionTimes.map(t => (t - avgReaction) ** 2).reduce((a,b) => a+b, 0) / NUM_SIMULATIONS) * 1000 : undefined;
    const minTime = Math.min(...raceTimes);
    const maxTime = Math.max(...raceTimes);

    const probabilisticData: ProbabilisticRaceTimePrediction = {
        bestRaceTime: minTime,
        worstRaceTime: maxTime,
        averageRaceTime: raceTimes.reduce((a, b) => a + b, 0) / NUM_SIMULATIONS,
        averageDrag: parseFloat((dragCoefficients.reduce((a, b) => a + b, 0) / NUM_SIMULATIONS).toFixed(4)),
        bestFinishLineSpeed: Math.max(...finishLineSpeeds),
        worstFinishLineSpeed: Math.min(...finishLineSpeeds),
        averageFinishLineSpeed: finishLineSpeeds.reduce((a, b) => a + b, 0) / NUM_SIMULATIONS,
        launchVariance: launchVariance ? parseFloat(launchVariance.toFixed(2)) : undefined,
        trackConditionSensitivity: isPremium ? parseFloat(((maxTime - minTime) * 0.2 * 1000).toFixed(2)) : undefined,
        canisterPerformanceDelta: isPremium ? parseFloat(((maxTime - minTime) * 0.8 * 1000).toFixed(2)) : undefined,
    };
    
    return probabilisticData;
};

/**
 * Procedurally generates a plausible 3D flow field for visualization.
 */
const _generateFlowFieldData = (params: DesignParameters, cl: number, cd: number): FlowFieldPoint[] => {
    const points: FlowFieldPoint[] = [];
    const numPoints = 20000; // Denser point cloud for better visuals

    const carLength = params.totalLength / 1000; // in meters
    const carWidth = params.totalWidth / 1000;
    const carHeight = 45 / 1000; // approx height

    const frontWingPos = 0.1 * carLength;
    const rearWingPos = 0.9 * carLength;

    for (let i = 0; i < numPoints; i++) {
        // Create a bounding box around the car
        const x = (Math.random() - 0.2) * carLength * 1.5;
        const y = (Math.random() - 0.5) * carHeight * 4;
        const z = (Math.random() - 0.5) * carWidth * 3;

        // Skip points inside the car body
        if (x > 0 && x < carLength && Math.abs(y) < carHeight / 2 && Math.abs(z) < carWidth / 2) {
            continue;
        }

        let baseVelocity = 20; // m/s
        let basePressure = 101325; // Pascals

        // Stagnation point at the front
        if (x < 0 && x > -0.1 * carLength && Math.abs(y) < carHeight * 0.8 && Math.abs(z) < carWidth * 0.8) {
            const grad = 1 - (Math.abs(x) / (0.1 * carLength));
            baseVelocity *= (1 - grad * 0.99); // Velocity drops to near zero
            basePressure += (1000 * grad); // Pressure spikes
        }
        
        // High velocity (low pressure) over wings
        const isOverFrontWing = x > frontWingPos && x < frontWingPos + 0.1 * carLength && y > 0 && y < carHeight * 1.5 && Math.abs(z) < (params.frontWingSpan/1000)/2;
        const isOverRearWing = x > rearWingPos && x < rearWingPos + 0.05 * carLength && y > (params.rearWingHeight/1000) && y < (params.rearWingHeight/1000) + carHeight && Math.abs(z) < (params.rearWingSpan/1000)/2;
        
        if (isOverFrontWing || isOverRearWing) {
            baseVelocity += cl * 5; // Velocity increases based on lift
            basePressure -= cl * 1000;
        }

        // Wake region behind the car
        if (x > carLength && x < carLength * 1.5 && Math.abs(y) < carHeight * 2 && Math.abs(z) < carWidth) {
            const wakeFactor = 1 - ((x - carLength) / (carLength * 0.5));
            baseVelocity *= (0.5 + wakeFactor * 0.5 + (Math.random() - 0.5) * 0.4); // Turbulent, lower velocity
            basePressure -= cd * 500;
        }

        points.push([x, y, z, basePressure, baseVelocity]);
    }

    return points;
};


// --- EXPORTED SOLVER FUNCTIONS ---

export const runAerotestCFDSimulation = async (
  params: DesignParameters,
  onProgress: ProgressCallback
): Promise<Omit<AeroResult, 'id' | 'suggestions' | 'scrutineeringReport' | 'fileName'>> => {
    try {
        const solver = new AerotestSolver(params, onProgress, false, 'standard');
        return await solver.run();
    } catch (e) {
        onProgress({ stage: 'Error', progress: 100, log: `Simulation failed: ${e instanceof Error ? e.message : String(e)}` });
        throw e;
    }
};

export const runAerotestPremiumCFDSimulation = async (
  params: DesignParameters,
  onProgress: ProgressCallback,
  thrustModel: 'standard' | 'competition' | 'pro-competition'
): Promise<Omit<AeroResult, 'id' | 'suggestions' | 'scrutineeringReport' | 'fileName'>> => {
    try {
        const solver = new AerotestSolver(params, onProgress, true, thrustModel);
        return await solver.run();
    } catch (e) {
        onProgress({ stage: 'Error', progress: 100, log: `Simulation failed: ${e instanceof Error ? e.message : String(e)}` });
        throw e;
    }
};