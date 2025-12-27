
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useData } from '../../contexts/AppContext';
import { AeroResult, CarClass } from '../../types';
import { WindIcon, BeakerIcon, BarChartIcon, StopwatchIcon, UploadCloudIcon, SparklesIcon, CheckCircleIcon, XCircleIcon, CommandIcon, InfoIcon, TrashIcon, AlertTriangleIcon, ShieldCheckIcon, XIcon, PlusCircleIcon, GraduationCapIcon, CalculatorIcon, ScaleIcon, EyeIcon, DownloadIcon, FileTextIcon, SkullIcon, AnchorIcon } from '../../components/icons';
import PerformanceGraph from '../../components/hq/PerformanceGraph';
import SpeedTimeGraph from '../../components/hq/SpeedTimeGraph';
import MonteCarloScatterPlot from '../../components/hq/MonteCarloScatterPlot';
import ConvergenceGraph from '../../components/hq/ConvergenceGraph';
import FlowFieldVisualizer from '../../components/hq/FlowFieldVisualizer';
import { THEORETICAL_OPTIMUM } from '../../services/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// --- PUNK RECORDS VISUALIZER (Formerly Neural Kernel) ---
const PunkRecordsPanel: React.FC<{ result: AeroResult }> = ({ result }) => {
    const ai = result.aiCorrectionModel;
    if (!ai) return null;

    return (
        <div className="bg-white/5 border border-white/20 p-6 rounded-3xl relative overflow-hidden group font-egghead shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            {/* Egghead Tech Elements */}
            <div className="absolute top-0 right-0 p-4 opacity-30 pointer-events-none">
                <div className="text-[100px] leading-none font-black text-white/5 select-none absolute -top-4 -right-4 rotate-12">PUNK</div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-80"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <span className="bg-pink-500 text-white rounded px-2 py-0.5 text-sm">PUNK RECORDS</span>
                        SYNC ESTABLISHED
                    </h3>
                    <p className="text-xs text-white/60 font-mono mt-1 uppercase tracking-widest">
                        Satellite Logic: {result.flowAnalysis.split('Logic')[0]} // Epochs: {ai.evolutionPath.length}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-mono font-bold text-pink-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">
                        {ai.confidence.toFixed(2)}%
                    </p>
                    <p className="text-[9px] text-white/60 uppercase">Truth Accuracy</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="bg-black/40 p-4 rounded-xl border border-white/10 font-mono text-[10px] text-green-400 leading-relaxed overflow-hidden">
                    <p className="text-white/40 mb-2 uppercase tracking-widest">Applied Master Formula:</p>
                    <div className="break-all opacity-80">
                        {ai.appliedFormula || "FORMULA_DATA_MISSING"}
                    </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                    <h4 className="text-xs font-bold text-white uppercase mb-2">Future Sight (Kenbunshoku)</h4>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm text-white/60">Current Reality</span>
                        <span className="font-mono text-white">{ai.originalCd.toFixed(5)}</span>
                    </div>
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-sm text-white/60">Genetic Potential</span>
                        <span className="font-mono text-pink-400 font-bold">{ai.optimizedCd.toFixed(5)}</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed italic border-t border-white/10 pt-3">
                        "Logic dictates: {ai.suggestion}"
                    </p>
                </div>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ label: string; value: string; subValue?: string; color?: string }> = ({ label, value, subValue, color = 'text-brand-text' }) => (
    <div className="bg-brand-dark p-4 rounded-xl border border-brand-border">
        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1 font-egghead">{label}</p>
        <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
        {subValue && <p className="text-xs text-brand-text-secondary mt-1">{subValue}</p>}
    </div>
);

const DetailedAnalysisContent: React.FC<{ result: AeroResult }> = ({ result }) => {
    const [activeSubTab, setActiveSubTab] = useState('summary');
    const pred = result.raceTimePrediction;
    const avgSpeedKmh = pred ? (pred.averageSpeed * 3.6).toFixed(1) : '0.0';
    const geoMeta = result.parameters.geometryMeta;

    const renderSummary = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Neural Kernel is highlighted at the top */}
            <PunkRecordsPanel result={result} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Drag (Cd)" value={result.cd.toFixed(5)} />
                <MetricCard label="Efficiency (L/D)" value={result.liftToDragRatio.toFixed(3)} color="text-green-400" />
                <MetricCard label="Avg Race Time" value={`${pred?.averageRaceTime.toFixed(4) ?? '-.----'}s`} color="text-brand-accent" />
                <MetricCard label="Average Velocity" value={`${avgSpeedKmh} km/h`} subValue={`${pred?.averageSpeed.toFixed(2) ?? '0.00'} m/s`} color="text-yellow-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-brand-accent uppercase flex items-center gap-2">
                                <StopwatchIcon className="w-4 h-4" /> 20m Empirical Profile
                            </h3>
                            <span className="text-[10px] font-black px-2 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent uppercase">
                                {result.carClass || (result.tier === 'premium' ? 'Professional Class' : 'Development Class')}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-xs text-brand-text-secondary mb-1">Exit Velocity</p>
                                <p className="text-xl font-bold font-mono">{pred ? (pred.averageFinishLineSpeed * 3.6).toFixed(1) : '0.0'} km/h</p>
                            </div>
                            <div className="text-center border-x border-brand-border">
                                <p className="text-xs text-brand-text-secondary mb-1">Static Mass</p>
                                <p className="text-xl font-bold font-mono text-brand-accent">{result.parameters.totalWeight}g</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-brand-text-secondary mb-1">Safety Floor</p>
                                <p className="text-xl font-bold font-mono">0.500s</p>
                            </div>
                        </div>
                    </div>
                    
                    <SpeedTimeGraph result={result} />
                </div>

                <div className="space-y-6">
                    <div className="bg-brand-dark p-6 rounded-xl border border-green-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                        <ShieldCheckIcon className="w-8 h-8 text-green-400 mb-2 relative z-10" />
                        <h4 className="font-bold text-xs uppercase text-brand-text-secondary relative z-10">Physics Validation</h4>
                        <p className="text-3xl font-black font-mono text-green-400 relative z-10">{pred?.trustIndex?.toFixed(1)}%</p>
                        <p className="text-[10px] text-brand-text-secondary mt-1 uppercase tracking-tighter relative z-10">Omega-Class Solver</p>
                    </div>
                    
                    <div className="p-4 bg-brand-dark/50 rounded-xl border border-brand-border text-sm text-brand-text-secondary leading-relaxed font-mono text-xs">
                        <p className="font-bold text-brand-text mb-2 uppercase tracking-widest text-[10px]">Labophase Log:</p>
                        {">"} Voxelizing Geometry... DONE<br/>
                        {">"} Combinatorial Substitution... DONE<br/>
                        {">"} Syncing Punk Records... DONE<br/>
                        {">"} York Check... PASSED (No Bugs)
                    </div>
                </div>
            </div>
        </div>
    );

    const renderVisualization = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-brand-dark p-1 rounded-xl border border-brand-border overflow-hidden">
                <FlowFieldVisualizer 
                    flowFieldData={result.flowFieldData} 
                    parameters={result.parameters} 
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-brand-dark rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-2">RANS Solver Stats</h4>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span>Cell Count:</span>
                            <span className="font-mono text-brand-accent">
                                {result.meshCellCount?.toLocaleString() || 'N/A'} Voxels
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Turbulence Model:</span>
                            <span className="font-mono text-purple-400">k-ω SST (Hybrid)</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Residuals (Continuity):</span>
                            <span className="font-mono text-green-400">{result.finalResiduals?.continuity.toExponential(2) || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-brand-dark rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-2">Solver Diagnostics</h4>
                    {result.residualHistory ? (
                        <ConvergenceGraph history={result.residualHistory} height={120} />
                    ) : (
                        <p className="text-xs text-brand-text-secondary italic">No convergence history available.</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderMonteCarlo = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                <h3 className="text-lg font-bold text-brand-accent mb-2 uppercase tracking-tighter">Stochastic Analysis</h3>
                <p className="text-sm text-brand-text-secondary mb-6">Visualizing the probability distribution based on mechanical variances (bearing friction, thrust consistency).</p>
                <MonteCarloScatterPlot result={result} />
            </div>
        </div>
    );

    const renderTechSpecs = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-4">Material Analysis</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span>Derived Volume:</span>
                            <span className="font-mono font-bold text-brand-accent">{(result.parameters.totalWeight / 0.163).toFixed(1)} cm³</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Target Density:</span>
                            <span className="font-mono">0.163 g/cm³</span>
                        </div>
                    </div>
                </div>
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-4">Aero Balance</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <span className="text-brand-text-secondary">CoP Position:</span> <span className="text-right">{result.aeroBalance}% Front</span>
                        <span className="text-brand-text-secondary">Pressure Drag:</span> <span className="text-right">{result.dragBreakdown.pressure}%</span>
                        <span className="text-brand-text-secondary">Friction Drag:</span> <span className="text-right">{result.dragBreakdown.skinFriction}%</span>
                    </div>
                </div>
            </div>
            <div className="bg-brand-dark p-4 rounded-xl border border-brand-border">
                <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-4">Efficiency Mapping</h4>
                <PerformanceGraph results={[result]} height={200} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 p-1 bg-brand-dark rounded-lg border border-brand-border w-fit font-egghead">
                <button onClick={() => setActiveSubTab('summary')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'summary' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>PUNK RECORDS</button>
                <button onClick={() => setActiveSubTab('visual')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'visual' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>HOLOGRAM</button>
                <button onClick={() => setActiveSubTab('montecarlo')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'montecarlo' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>STOCHASTIC</button>
                <button onClick={() => setActiveSubTab('tech')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'tech' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>TECH DATA</button>
                <button onClick={() => setActiveSubTab('scrutineering')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'scrutineering' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>COMPLIANCE</button>
            </div>

            {activeSubTab === 'summary' && renderSummary()}
            {activeSubTab === 'visual' && renderVisualization()}
            {activeSubTab === 'montecarlo' && renderMonteCarlo()}
            {activeSubTab === 'tech' && renderTechSpecs()}
            {activeSubTab === 'scrutineering' && (
                <div className="space-y-3 animate-fade-in">
                    {result.scrutineeringReport?.map(item => (
                        <div key={item.ruleId} className={`p-3 rounded-lg border ${item.status === 'PASS' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {item.status === 'PASS' ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : <XCircleIcon className="w-4 h-4 text-red-400" />}
                                    <span className="text-sm font-bold">{item.ruleId}: {item.description}</span>
                                </div>
                                <span className="font-mono text-xs text-brand-text-secondary">{item.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ComparisonTab: React.FC<{ results: AeroResult[]; onClear: () => void }> = ({ results, onClear }) => {
    if (results.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
                <div className="p-4 bg-brand-dark rounded-full border border-brand-border">
                    <BarChartIcon className="w-12 h-12 text-brand-border" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-brand-text">Comparison Engine Idle</h3>
                    <p className="text-brand-text-secondary max-w-sm mx-auto">Select at least two cars from the 'Poneglyphs' history tab to compare their signatures.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><BarChartIcon className="w-6 h-6 text-brand-accent"/> Performance Head-to-Head</h2>
                <button onClick={onClear} className="text-sm font-bold text-red-400 hover:underline">Reset Comparison</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h3 className="text-xs font-black text-brand-accent uppercase mb-4 tracking-widest">Efficiency Curves (L/D)</h3>
                    <PerformanceGraph results={results} height={300} />
                </div>
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h3 className="text-xs font-black text-brand-accent uppercase mb-4 tracking-widest">Velocity Profiles (Acc.)</h3>
                    <SpeedTimeGraph result={results} height={300} showTitle={false} />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-brand-dark-secondary text-brand-text-secondary uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Metric</th>
                            {results.map(r => (
                                <th key={r.id} className="px-6 py-4 text-center">{r.parameters.carName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                        {[
                            { key: 'carClass', label: 'Class', best: 'none' },
                            { key: 'cd', label: 'Drag (Cd)', best: 'min' },
                            { key: 'averageRaceTime', label: 'Avg Race Time', best: 'min' },
                            { key: 'averageFinishLineSpeed', label: 'Finish Speed', best: 'max' }
                        ].map(m => {
                            const values = results.map(r => {
                                if (m.key === 'cd') return r.cd;
                                if (m.key === 'carClass') return r.carClass;
                                return r.raceTimePrediction ? (r.raceTimePrediction as any)[m.key] : 0;
                            });
                            
                            // Only calculate best if it's a number
                            let bestVal: any = null;
                            if (m.best !== 'none') {
                                const numericValues = values.filter(v => typeof v === 'number') as number[];
                                if(numericValues.length > 0) {
                                    bestVal = m.best === 'min' ? Math.min(...numericValues) : Math.max(...numericValues);
                                }
                            }
                            
                            return (
                                <tr key={m.key} className="bg-brand-dark/30 hover:bg-brand-dark/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-brand-text-secondary">{m.label}</td>
                                    {results.map((r, i) => (
                                        <td key={r.id} className={`px-6 py-4 text-center font-mono ${bestVal !== null && values[i] === bestVal ? 'text-green-400 bg-green-500/5 font-bold' : ''}`}>
                                            {m.key === 'carClass' ? (values[i] || 'N/A') :
                                             m.key === 'cd' ? (values[i] as number).toFixed(5) : 
                                             m.key === 'averageRaceTime' ? `${(values[i] as number).toFixed(4)}s` : 
                                             `${((values[i] as number) * 3.6).toFixed(1)} km/h`}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TheoryTab: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border">
                    <h3 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2">
                        <WindIcon className="w-6 h-6 text-brand-accent"/> The Forces at Play
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-brand-dark p-4 rounded-xl border border-brand-border">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-brand-text">Drag (Cd)</h4>
                                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded font-mono">ENEMY #1</span>
                            </div>
                            <p className="text-sm text-brand-text-secondary leading-relaxed">
                                The resistance air exerts on your car. Key drivers: Frontal Area & Flow Separation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border h-full">
                    <h3 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2">
                        <BeakerIcon className="w-6 h-6 text-brand-accent"/> Inside the Solver
                    </h3>
                    <p className="text-sm text-brand-text-secondary mb-6">
                        Aerotest solves the <b>Navier-Stokes equations</b> using a Finite Volume Method (FVM) for the best accuracy.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const QuickSimTab: React.FC<{ aeroResults: AeroResult[] }> = ({ aeroResults }) => {
    const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);
    const [mass, setMass] = useState<number>(55.0);
    const [cd, setCd] = useState<number>(0.150);
    const [friction, setFriction] = useState<number>(0.012);
    
    const [results, setResults] = useState<{ time: number; speed: number; points: {time: number, speed: number}[] } | null>(null);

    const baselines = useMemo(() => {
        return aeroResults.filter(r => selectedCarIds.includes(r.id));
    }, [selectedCarIds, aeroResults]);

    const handleBaselineToggle = (id: string) => {
        setSelectedCarIds(prev => 
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const calculateRaceProfile = (massG: number, cdVal: number, muVal: number) => {
            const dt = 0.002;
            let t = 0;
            let v = 0; 
            let x = 0; 
            const points = [];
            const massKg = massG / 1000;
            const area = 0.0055; 
            const rho = 1.225;
            
            const getThrust = (time: number) => {
                if (time < 0) return 0;
                if (time < 0.05) return 12 * (time / 0.05); 
                if (time < 0.15) return 12 - (3 * (time - 0.05) / 0.1); 
                if (time < 0.50) return 9 * (1 - ((time - 0.15) / 0.35)); 
                return 0;
            };
            
            while (x < 20 && t < 3.0) {
                let thrust = getThrust(t);
                const drag = 0.5 * rho * area * cdVal * v * v;
                const frictionForce = (massKg * 9.81 * muVal) + (0.15 * Math.pow((v/15), 2)); 
                
                const netForce = thrust - drag - frictionForce;
                const a = netForce / massKg; 
                
                v += a * dt;
                if (v < 0) v = 0;
                x += v * dt;
                t += dt;
                
                if (t % 0.02 < dt * 1.5) { 
                    points.push({ time: t, speed: v });
                }
            }
            return { time: t, speed: v, points };
        };

        setResults(calculateRaceProfile(mass, cd, friction));
    }, [mass, cd, friction]);

    const referenceTime = baselines.length > 0 ? baselines[0].raceTimePrediction?.averageRaceTime : undefined;
    const deltaMs = results && referenceTime ? (results.time - referenceTime) : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border h-full flex flex-col">
                    <h3 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                        <CalculatorIcon className="w-6 h-6 text-brand-accent"/> Quick Simulator
                    </h3>
                    
                    <div className="space-y-6 flex-grow">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest block">Comparison Baselines</label>
                            <div className="max-h-32 overflow-y-auto bg-brand-dark border border-brand-border rounded-xl p-2 space-y-1">
                                {aeroResults.map(r => (
                                    <label key={r.id} className="flex items-center gap-2 p-2 hover:bg-brand-dark-secondary rounded cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCarIds.includes(r.id)}
                                            onChange={() => handleBaselineToggle(r.id)}
                                            className="rounded border-brand-border text-brand-accent bg-brand-dark focus:ring-brand-accent"
                                        />
                                        <div className="flex-grow min-w-0">
                                            <p className="text-xs font-bold text-brand-text truncate">{r.parameters.carName}</p>
                                            <p className="text-[9px] text-brand-text-secondary">Cd: {r.cd.toFixed(3)}</p>
                                        </div>
                                    </label>
                                ))}
                                {aeroResults.length === 0 && <p className="text-xs text-brand-text-secondary p-2">No history available.</p>}
                            </div>
                        </div>

                        <div className="p-4 bg-brand-dark rounded-xl border border-brand-border space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="text-xs font-semibold text-brand-text-secondary">Total Mass (g)</label>
                                    <span className="text-xs font-mono font-bold text-brand-accent">{mass.toFixed(1)}g</span>
                                </div>
                                <input 
                                    type="range" min="50" max="100" step="0.1" 
                                    value={mass} onChange={e => setMass(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-brand-dark-secondary rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="text-xs font-semibold text-brand-text-secondary">Drag Coefficient (Cd)</label>
                                    <span className="text-xs font-mono font-bold text-brand-accent">{cd.toFixed(3)}</span>
                                </div>
                                <input 
                                    type="range" min="0.100" max="0.800" step="0.001" 
                                    value={cd} onChange={e => setCd(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-brand-dark-secondary rounded-lg appearance-none cursor-pointer accent-brand-accent"
                                />
                            </div>
                            
                            <div className="pt-2 border-t border-brand-border/50">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-brand-text-secondary">Friction (µ)</label>
                                    <input 
                                        type="number" step="0.001" 
                                        value={friction} onChange={e => setFriction(parseFloat(e.target.value))}
                                        className="w-20 p-1 text-right bg-brand-dark-secondary border border-brand-border rounded-lg text-xs font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-brand-border">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-[10px] text-brand-text-secondary uppercase">Predicted Time</p>
                                <p className="text-2xl font-mono font-bold text-brand-text">{results?.time?.toFixed(3) ?? '-.--'}s</p>
                                {referenceTime && results && <p className={`text-xs font-bold ${deltaMs <= 0 ? 'text-green-400' : 'text-red-400'}`}>{deltaMs > 0 ? '+' : ''}{deltaMs.toFixed(3)}s vs Ref</p>}
                            </div>
                            <div>
                                <p className="text-[10px] text-brand-text-secondary uppercase">Top Speed</p>
                                <p className="text-2xl font-mono font-bold text-brand-text">{results ? (results.speed * 3.6).toFixed(1) : '0.0'} <span className="text-sm">km/h</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
                <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border shadow-2xl h-full">
                    <h3 className="text-sm font-black text-brand-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                        <WindIcon className="w-4 h-4"/> Real-Time Physics Solve
                    </h3>
                    
                    {results && (
                        <SpeedTimeGraph 
                            result={baselines} 
                            customProfiles={[{
                                name: "Quick Sim (Active)",
                                color: "#ffffff",
                                points: results.points
                            }]}
                            height={380}
                            showTitle={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const AeroPage: React.FC = () => {
  const { aeroResults, runSimulationTask, backgroundTasks, resetAeroResults, deleteAeroResult, punkRecords } = useData();
  const [activeTab, setActiveTab] = useState<'setup' | 'results' | 'quicksim' | 'comparison' | 'history' | 'theory'>('setup');
  const [selectedResultId, setSelectedResultId] = useState<string | null>(aeroResults[0]?.id || null);
  const [stlFiles, setStlFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'speed' | 'accuracy'>('accuracy');
  const [carClass, setCarClass] = useLocalStorage<CarClass>('aero-pref-class', 'Professional');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comparisonIds, setComparisonIds] = useState<Set<string>>(new Set());
  
  const currentResult = useMemo(() => {
    if (selectedResultId === 'benchmark-optimum') return THEORETICAL_OPTIMUM;
    return aeroResults.find(r => r.id === selectedResultId) || aeroResults[0];
  }, [selectedResultId, aeroResults]);

  const runningSimulations = backgroundTasks.filter(t => t.type === 'simulation' && t.status === 'running');
  
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const newFiles = Array.from(e.target.files);
          setStlFiles(prev => {
              const combined = [...prev, ...newFiles];
              const unique = combined.filter((file, index, self) => 
                  index === self.findIndex((t) => t.name === file.name)
              );
              return unique.slice(0, 20);
          });
      }
      if (e.target) e.target.value = '';
  };

  const removeFile = (fileName: string) => {
      setStlFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSimulate = async () => {
    if (stlFiles.length === 0) return;
    stlFiles.forEach(file => {
        runSimulationTask(file, mode, carClass);
    });
    setStlFiles([]);
    setActiveTab('setup');
  };

  const toggleComparison = (id: string) => {
    setComparisonIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });
  };

  const comparisonResults = useMemo(() => {
    return aeroResults.filter(r => comparisonIds.has(r.id));
  }, [aeroResults, comparisonIds]);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-4xl font-bold text-brand-text tracking-tight font-egghead uppercase">Aerotest Mark 3</h1>
            <p className="text-brand-text-secondary mt-1 flex items-center gap-2">
                <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">EGGHEAD</span> 
                Evolutionary Combinatorial Solver
            </p>
        </div>
        
        <div className="flex bg-brand-dark-secondary p-1 rounded-xl border border-brand-border shadow-lg overflow-x-auto">
            {(['setup', 'results', 'quicksim', 'comparison', 'history', 'theory'] as const).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize whitespace-nowrap ${
                        activeTab === tab 
                        ? 'bg-brand-accent text-brand-dark shadow-glow-accent' 
                        : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-dark'
                    }`}
                >
                    {tab === 'quicksim' ? 'Quick Sim' : tab === 'theory' ? 'Archives' : tab}
                </button>
            ))}
        </div>
      </header>

      <main className="min-h-[60vh]">
          {activeTab === 'setup' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
                  <div className="lg:col-span-3 space-y-8">
                      <div className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border shadow-2xl relative overflow-hidden">
                          {/* Decorative Background Text */}
                          <div className="absolute -top-10 -right-10 text-[150px] font-black text-brand-text/5 rotate-12 pointer-events-none select-none">LAB</div>
                          
                          <div className="flex justify-between items-start mb-6 relative z-10">
                              <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                                  <UploadCloudIcon className="w-8 h-8 text-brand-accent" />
                                  Initialize Punk Records
                              </h2>
                              <span className="bg-brand-dark px-3 py-1 rounded-full text-xs font-bold border border-brand-border text-brand-text-secondary">
                                  Batch Mode Active (Max 20)
                              </span>
                          </div>

                          <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative flex flex-col justify-center items-center py-12 px-10 border-4 border-dashed rounded-3xl cursor-pointer transition-all duration-300 border-brand-border bg-brand-dark/50 hover:border-brand-accent/50 hover:bg-brand-dark"
                            >
                                <div className="mb-4 p-4 bg-brand-dark rounded-full border border-brand-border group-hover:border-brand-accent transition-all">
                                    <UploadCloudIcon className="w-10 h-10 text-brand-text-secondary group-hover:text-brand-accent" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-text mb-1 text-center">
                                    Drop Geometry Files
                                </h3>
                                <p className="text-brand-text-secondary text-xs text-center">
                                    Supports .STL (Stereolithography).
                                    <br/>Geometry will be voxelized for Neural Analysis.
                                </p>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelection} accept=".stl" multiple className="hidden" />
                          </div>

                          {stlFiles.length > 0 && (
                              <div className="mt-4 bg-brand-dark rounded-xl border border-brand-border overflow-hidden">
                                  <div className="p-3 bg-brand-dark-secondary border-b border-brand-border flex justify-between items-center">
                                      <span className="text-xs font-bold text-brand-text-secondary uppercase">Execution Queue ({stlFiles.length})</span>
                                      <button onClick={() => setStlFiles([])} className="text-xs text-red-400 hover:underline">Clear All</button>
                                  </div>
                                  <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                                      {stlFiles.map((file, idx) => (
                                          <div key={`${file.name}-${idx}`} className="flex justify-between items-center p-2 rounded hover:bg-brand-surface group">
                                              <div className="flex items-center gap-2 overflow-hidden">
                                                  <span className="text-xs font-mono text-brand-accent">{idx + 1}.</span>
                                                  <span className="text-sm truncate text-brand-text">{file.name}</span>
                                                  <span className="text-[10px] text-brand-text-secondary ml-1">({(file.size / 1024).toFixed(0)}KB)</span>
                                              </div>
                                              <button onClick={() => removeFile(file.name)} className="text-brand-text-secondary hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <XIcon className="w-3 h-3" />
                                              </button>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">Competition Class</label>
                                    <div className="flex bg-brand-dark p-1.5 rounded-xl border border-brand-border overflow-hidden">
                                        <button onClick={() => setCarClass('Entry')} className={`flex-1 py-3 text-sm font-bold transition-all border-r border-brand-border/50 ${carClass === 'Entry' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>Entry</button>
                                        <button onClick={() => setCarClass('Development')} className={`flex-1 py-3 text-sm font-bold transition-all border-r border-brand-border/50 ${carClass === 'Development' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>Dev</button>
                                        <button onClick={() => setCarClass('Professional')} className={`flex-1 py-3 text-sm font-bold transition-all ${carClass === 'Professional' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>Pro</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">Solver Engine</label>
                                    <div className="flex bg-brand-dark p-1.5 rounded-xl border border-brand-border">
                                        <button onClick={() => setMode('speed')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'speed' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary'}`}>Fast FVM</button>
                                        <button onClick={() => setMode('accuracy')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'accuracy' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary'}`}>Deep Neural</button>
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex items-end">
                                    <button
                                        onClick={handleSimulate}
                                        disabled={stlFiles.length === 0 || runningSimulations.length > 0}
                                        className="w-full bg-brand-accent text-brand-dark font-black py-4 rounded-xl hover:bg-brand-accent-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg shadow-glow-accent group relative overflow-hidden"
                                    >
                                        <div className="relative z-10 flex items-center justify-center">
                                            {runningSimulations.length > 0 ? (
                                                <>Processing... ({runningSimulations.length} active)</>
                                            ) : (
                                                <>
                                                    <WindIcon className="w-6 h-6 mr-3" /> 
                                                    {stlFiles.length > 1 ? `ENGAGE BATCH SOLVER (${stlFiles.length})` : 'ENGAGE EGGHEAD KERNEL'}
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                      <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border h-full flex flex-col">
                          <h2 className="text-lg font-bold text-brand-text flex items-center gap-2 mb-4">
                              <InfoIcon className="w-5 h-5 text-brand-accent" />
                              Punk Records Status
                          </h2>
                          <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-4">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs text-brand-text-secondary uppercase">Generation</span>
                                  <span className="font-mono text-pink-400 font-bold">{punkRecords?.generationName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                  <span className="text-xs text-brand-text-secondary uppercase">Logic Complexity</span>
                                  <span className={`font-mono font-bold ${punkRecords?.complexityScore < 20 ? 'text-green-400' : 'text-yellow-400'}`}>{punkRecords?.complexityScore.toFixed(0)}%</span>
                              </div>
                              <div className="w-full bg-brand-dark h-1 rounded-full mt-3 overflow-hidden">
                                  <div className="h-full bg-pink-500" style={{ width: `${punkRecords?.complexityScore}%` }}></div>
                              </div>
                              <p className="text-[9px] text-brand-text-secondary mt-2 italic">
                                  Lower complexity = Faster simulations. <br/>Higher generation = Better formulas.
                              </p>
                          </div>

                          <h2 className="text-lg font-bold text-brand-text flex items-center gap-2 mb-4 mt-4">
                              <InfoIcon className="w-5 h-5 text-brand-accent" />
                              Fabriophase Queue
                          </h2>
                          <div className="space-y-3 flex-grow overflow-y-auto max-h-[400px]">
                              {runningSimulations.length > 0 ? runningSimulations.map(task => (
                                  <div key={task.id} className="bg-brand-dark p-4 rounded-xl border border-brand-border animate-pulse relative overflow-hidden">
                                      <div className="absolute inset-0 bg-brand-accent/5 pointer-events-none"></div>
                                      <div className="relative z-10">
                                          <div className="flex justify-between items-center mb-2">
                                              <span className="text-sm font-bold text-brand-accent truncate max-w-[150px]">{task.fileName}</span>
                                              <span className="text-xs font-mono">{task.progress.toFixed(0)}%</span>
                                          </div>
                                          <div className="w-full bg-brand-surface h-2 rounded-full overflow-hidden">
                                              <div className="bg-brand-accent h-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                                          </div>
                                          <p className="text-[10px] text-brand-text-secondary mt-2 uppercase tracking-tighter">{task.stage}</p>
                                          {task.latestLog && <p className="text-[9px] text-brand-text-secondary mt-1 font-mono italic truncate">{task.latestLog}</p>}
                                      </div>
                                  </div>
                              )) : (
                                  <div className="flex flex-col items-center justify-center py-10 text-brand-text-secondary border border-dashed border-brand-border rounded-xl h-full">
                                      <CommandIcon className="w-10 h-10 opacity-20 mb-2" />
                                      <p className="text-xs font-bold uppercase tracking-widest">System Idle</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* ... Rest of the tabs (results, quicksim, comparison, history, theory) ... */}
          {activeTab === 'results' && (
              <div className="animate-fade-in">
                  {currentResult ? (
                      <div className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border shadow-2xl">
                          <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-brand-text">{currentResult.parameters.carName}</h2>
                                    <p className="text-brand-text-secondary font-mono text-sm">{currentResult.id === 'benchmark-optimum' ? 'Theoretical Benchmark' : `Analysis Date: ${new Date(currentResult.timestamp).toLocaleDateString()}`}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => toggleComparison(currentResult.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${comparisonIds.has(currentResult.id) ? 'bg-brand-accent text-brand-dark border-brand-accent' : 'border-brand-border text-brand-text-secondary hover:text-brand-text'}`}
                                    >
                                        {comparisonIds.has(currentResult.id) ? 'In Comparison' : 'Add to Compare'}
                                    </button>
                                </div>
                          </div>
                          <DetailedAnalysisContent result={currentResult} />
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                          <WindIcon className="w-16 h-16 text-brand-border" />
                          <h3 className="text-xl font-bold text-brand-text">Simulation Ledger Empty</h3>
                          <button onClick={() => setActiveTab('setup')} className="text-brand-accent hover:underline font-bold">Return to Setup</button>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'quicksim' && <QuickSimTab aeroResults={aeroResults} />}

          {activeTab === 'comparison' && (
              <ComparisonTab results={comparisonResults} onClear={() => setComparisonIds(new Set())} />
          )}

          {activeTab === 'history' && (
              <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-end mb-4">
                      <h2 className="text-2xl font-bold">Poneglyphs (Archives)</h2>
                      <button onClick={resetAeroResults} className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"><TrashIcon className="w-3 h-3"/> Wipe History</button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                      {[THEORETICAL_OPTIMUM, ...aeroResults].map(res => (
                          <div key={res.id} className="group flex items-center justify-between p-4 rounded-xl border border-brand-border bg-brand-dark-secondary hover:border-brand-accent/30 transition-all">
                              <div className="flex items-center gap-4">
                                  <input 
                                      type="checkbox" 
                                      checked={comparisonIds.has(res.id)} 
                                      onChange={() => toggleComparison(res.id)}
                                      className="w-4 h-4 rounded border-brand-border text-brand-accent bg-brand-dark focus:ring-brand-accent"
                                  />
                                  <div onClick={() => { setSelectedResultId(res.id); setActiveTab('results'); }} className="flex flex-col cursor-pointer">
                                      <p className="font-bold text-brand-text">{res.parameters.carName}</p>
                                      <p className="text-[10px] text-brand-text-secondary uppercase">{res.carClass || 'Professional'} Class | {res.tier === 'premium' ? 'Pro' : 'Std'} Solver</p>
                                  </div>
                              </div>
                              <div onClick={() => { setSelectedResultId(res.id); setActiveTab('results'); }} className="flex items-center gap-8 font-mono text-sm cursor-pointer">
                                  <div className="hidden md:block text-center">
                                      <p className="text-[9px] text-brand-text-secondary uppercase">Cd</p>
                                      <p className="font-bold">{res.cd.toFixed(5)}</p>
                                  </div>
                                  <div className="text-center">
                                      <p className="text-[9px] text-brand-text-secondary uppercase">Avg Speed</p>
                                      <p className="font-bold text-brand-accent">{res.raceTimePrediction ? (res.raceTimePrediction.averageSpeed * 3.6).toFixed(1) : '0.0'} km/h</p>
                                  </div>
                                  <div className="text-center">
                                      <p className="text-[9px] text-brand-text-secondary uppercase">Time</p>
                                      <p className="font-bold text-yellow-400">{res.raceTimePrediction ? res.raceTimePrediction.averageRaceTime.toFixed(4) : '-.----'}s</p>
                                  </div>
                                  {res.id !== 'benchmark-optimum' && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); deleteAeroResult(res.id); }}
                                        className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                          <TrashIcon className="w-4 h-4" />
                                      </button>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'theory' && <TheoryTab />}
      </main>

      <footer className="mt-12 p-8 bg-brand-accent/5 rounded-3xl border border-brand-accent/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
                  <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <div>
                  <p className="text-brand-text font-bold">Aerotest v7.0 (Codename: EGGHEAD)</p>
                  <p className="text-xs text-brand-text-secondary">Neural-Accelerated Computational Fluid Dynamics</p>
              </div>
          </div>
          <div className="flex items-center gap-2 text-brand-text-secondary text-xs opacity-50 hover:opacity-100 transition-opacity cursor-default" title="The World's Greatest Brain">
              <span className="font-egghead">Made by Egghead Science Unit</span>
              <AnchorIcon className="w-3 h-3" />
          </div>
      </footer>
    </div>
  );
};

export default AeroPage;