import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/AppContext';
import { runUniversalSimulation } from '../../services/simulationService';
import { UploadCloudIcon, WindIcon, BeakerIcon, TrashIcon, HistoryIcon, BotIcon, SparklesIcon, BrainCircuitIcon, LayersIcon, EyeIcon, CommandIcon, CheckCircleIcon, AlertTriangleIcon } from '../../components/icons';
import PerformanceGraph from '../../components/hq/PerformanceGraph';
import SpeedTimeGraph from '../../components/hq/SpeedTimeGraph';
import FlowFieldVisualizer from '../../components/hq/FlowFieldVisualizer';
import { PhysicsDomain, EnvironmentPreset } from '../../types';

// Vegapunk Mode Selectors
const DOMAINS: { id: PhysicsDomain; label: string; color: string; icon: any }[] = [
    { id: 'FLUID_DYNAMICS', label: 'FLUID', color: 'border-blue-500 text-blue-400', icon: WindIcon },
    { id: 'SOLID_MECHANICS', label: 'SOLID', color: 'border-orange-500 text-orange-400', icon: LayersIcon },
    { id: 'THERMODYNAMICS', label: 'THERMAL', color: 'border-red-500 text-red-400', icon: SparklesIcon },
    { id: 'ELECTROMAGNETICS', label: 'E-MAG', color: 'border-purple-500 text-purple-400', icon: BrainCircuitIcon },
    { id: 'QUANTUM_FLOW', label: 'QUANTUM', color: 'border-pink-500 text-pink-400', icon: BotIcon },
];

const ENVIRONMENTS: { id: EnvironmentPreset; label: string; code: string }[] = [
    { id: 'EARTH_STD', label: 'Earth', code: 'SOL-3' },
    { id: 'SKYPIEA_HIGH', label: 'Skypiea', code: 'WHT-SEA' },
    { id: 'FISHMAN_DEEP', label: 'Fishman Is.', code: 'DP-OCN' },
    { id: 'PUNK_HAZARD_HOT', label: 'Punk Haz (Hot)', code: 'MAG-01' },
    { id: 'PUNK_HAZARD_COLD', label: 'Punk Haz (Cold)', code: 'ICE-01' },
    { id: 'SPACE_VACUUM', label: 'Vacuum', code: 'VOID' },
];

const AeroPage: React.FC = () => {
    const { aeroResults, addAeroResult, backgroundTasks, updateTask, runSimulationTask, deleteAeroResult } = useData();
    const [dragActive, setDragActive] = useState(false);
    const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
    const [selectedDomain, setSelectedDomain] = useState<PhysicsDomain>('FLUID_DYNAMICS');
    const [selectedEnv, setSelectedEnv] = useState<EnvironmentPreset>('EARTH_STD');
    const [sysTick, setSysTick] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeTasks = backgroundTasks.filter(t => t.status === 'running');
    const displayResult = selectedResultId ? aeroResults.find(r => r.id === selectedResultId) : aeroResults[0];

    // System Ticker Effect
    useEffect(() => {
        const interval = setInterval(() => setSysTick(t => (t + 1) % 100), 500);
        return () => clearInterval(interval);
    }, []);

    // File Handling
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
    };

    const handleFile = async (file: File) => {
        // Run simulation with "Professional" visual mode implied
        runSimulationTask(file, 'accuracy', 'Professional');
    };

    const handleSelectResult = (id: string) => {
        setSelectedResultId(id);
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto font-sans pb-24 relative">
            
            {/* Background Decor - Punk Records Data Stream */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-5">
                <div className="absolute top-0 left-[10%] w-[1px] h-full bg-brand-accent"></div>
                <div className="absolute top-0 right-[10%] w-[1px] h-full bg-brand-accent"></div>
                <div className="absolute top-[20%] left-0 w-full h-[1px] bg-brand-accent"></div>
                <div className="absolute bottom-[20%] left-0 w-full h-[1px] bg-brand-accent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-brand-accent rounded-full animate-[spin_60s_linear_infinite]"></div>
            </div>

            {/* --- VEGAPUNK HOLOGRAPHIC HEADER --- */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0F172A]/90 border-2 border-brand-accent p-8 shadow-[0_0_80px_rgba(14,165,233,0.15)] backdrop-blur-xl group">
                
                {/* Header Scanline */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent animate-[scanline_3s_linear_infinite] opacity-50"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 rounded-sm bg-brand-accent text-[#020617] font-egghead font-bold text-xs tracking-widest animate-pulse">
                                EGGHEAD OS V.01
                            </span>
                            <span className="text-brand-accent/70 font-egghead text-xs tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                PUNK RECORDS // LINK ESTABLISHED
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-2 font-display tracking-tighter drop-shadow-[0_0_15px_rgba(14,165,233,0.5)] italic">
                            OMEGA<span className="text-brand-accent">FLOW</span>
                        </h1>
                        <p className="text-brand-text-secondary font-mono text-xs max-w-xl uppercase tracking-wider border-l-2 border-brand-accent pl-3">
                            Labophase Multiphysics Solver. <span className="text-brand-accent">Dr. Vegapunk Authorization Required.</span>
                        </p>
                    </div>

                    {/* Futuristic Mode Selectors */}
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <div className="flex justify-between md:justify-end text-[10px] font-egghead text-brand-text-secondary uppercase mb-1">
                            <span>Target Physics Domain</span>
                            <span>{sysTick < 50 ? '_SELECT' : 'READY_'}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap md:flex-nowrap justify-end">
                            {DOMAINS.map(dom => {
                                const Icon = dom.icon;
                                const isSelected = selectedDomain === dom.id;
                                return (
                                    <button 
                                        key={dom.id}
                                        onClick={() => setSelectedDomain(dom.id)}
                                        className={`relative px-4 py-2 rounded-lg border flex items-center gap-2 transition-all duration-300 group/btn overflow-hidden ${isSelected ? `${dom.color} bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)] border-current` : 'border-brand-border text-brand-text-secondary hover:border-brand-text-secondary bg-black/40'}`}
                                    >
                                        <Icon className={`w-4 h-4 ${isSelected ? 'animate-spin' : ''}`} />
                                        <span className="text-[10px] font-bold font-egghead tracking-widest">{dom.label}</span>
                                        {isSelected && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-current animate-pulse"></div>}
                                    </button>
                                )
                            })}
                        </div>
                        <div className="flex gap-2 flex-wrap md:flex-nowrap justify-end mt-2">
                             {ENVIRONMENTS.map(env => (
                                <button 
                                    key={env.id}
                                    onClick={() => setSelectedEnv(env.id)}
                                    className={`px-3 py-1 rounded-sm text-[9px] font-bold font-egghead uppercase transition-all border ${selectedEnv === env.id ? 'bg-brand-text text-brand-dark border-brand-text shadow-lg' : 'bg-black/20 text-brand-text-secondary border-brand-border/50 hover:border-brand-text/50'}`}
                                >
                                    {env.code}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- INPUT TERMINAL --- */}
            <div 
                className={`relative group rounded-2xl p-12 text-center transition-all duration-500 overflow-hidden ${dragActive ? 'bg-brand-accent/5' : 'bg-black/40'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Tech Border SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="16" fill="none" stroke={dragActive ? '#0EA5E9' : '#1E293B'} strokeWidth="2" strokeDasharray="10 5" className={dragActive ? "animate-[dash_1s_linear_infinite]" : ""} />
                    {/* Corners */}
                    <path d="M 2 40 L 2 16 Q 2 2 16 2 L 40 2" stroke="#0EA5E9" strokeWidth="4" fill="none" />
                    <path d="M calc(100% - 40px) 2 L calc(100% - 16px) 2 Q calc(100% - 2px) 2 calc(100% - 2px) 16 L calc(100% - 2px) 40" stroke="#0EA5E9" strokeWidth="4" fill="none" />
                    <path d="M calc(100% - 2px) calc(100% - 40px) L calc(100% - 2px) calc(100% - 16px) Q calc(100% - 2px) calc(100% - 2px) calc(100% - 16px) calc(100% - 2px) L calc(100% - 40px) calc(100% - 2px)" stroke="#0EA5E9" strokeWidth="4" fill="none" />
                    <path d="M 40 calc(100% - 2px) L 16 calc(100% - 2px) Q 2 calc(100% - 2px) 2 calc(100% - 16px) L 2 calc(100% - 40px)" stroke="#0EA5E9" strokeWidth="4" fill="none" />
                </svg>

                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="relative mb-8 group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full animate-pulse"></div>
                        <div className="relative p-6 bg-[#020617] rounded-full border-2 border-brand-accent shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                            <UploadCloudIcon className="w-12 h-12 text-brand-accent animate-[pulse_3s_ease-in-out_infinite]" />
                        </div>
                        {/* Spinning rings */}
                        <div className="absolute inset-[-10px] border border-brand-accent/30 rounded-full border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                        <div className="absolute inset-[-20px] border border-brand-accent/10 rounded-full border-b-transparent animate-[spin_5s_linear_infinite_reverse]"></div>
                    </div>
                    
                    <h3 className="text-3xl font-black text-brand-text font-display mb-2 tracking-tight uppercase italic">
                        Initialize Matter Digitizer
                    </h3>
                    <p className="text-sm text-brand-text-secondary font-egghead tracking-widest mb-8 uppercase">
                        Drag & Drop .STL / .FBX Geometry
                    </p>
                    
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleChange} accept=".stl,.fbx" />
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="bg-brand-accent text-[#020617] font-black font-egghead tracking-[0.2em] py-4 px-12 clip-path-polygon hover:bg-white transition-all shadow-[0_0_30px_rgba(14,165,233,0.5)] hover:shadow-[0_0_50px_rgba(255,255,255,0.8)] uppercase relative overflow-hidden group-hover:translate-y-[-2px] active:translate-y-[2px]"
                        style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                    >
                        Select Artifact
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                    </button>
                </div>
            </div>

            {/* --- RESULTS HOLOGRAPH --- */}
            {displayResult ? (
                <div className="space-y-6 animate-slide-in-up">
                    
                    {/* Status Bar */}
                    <div className="flex items-center justify-between bg-[#0F172A]/80 backdrop-blur border-y border-brand-accent/30 py-3 px-6 sticky top-16 z-20 shadow-xl">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-brand-text font-display uppercase tracking-wider">{displayResult.parameters.carName}</span>
                            <span className="text-[10px] font-egghead text-brand-accent border border-brand-accent px-2 py-0.5 rounded-full bg-brand-accent/10">
                                DOMAIN: {displayResult.domain}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 font-egghead text-xs">
                            <div className="flex items-center gap-2 text-brand-text-secondary">
                                <span>ENV: {displayResult.environment}</span>
                                <span className="text-brand-accent">|</span>
                                <span>DATE: {new Date(displayResult.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 pl-4 border-l border-brand-border">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="font-bold text-green-400 tracking-widest">REALITY CONVERGED</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI Vega-Chips */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Primary Scalar (Cd)', value: displayResult.cd.toFixed(4), color: 'text-brand-accent', border: 'border-brand-accent' },
                            { label: 'Secondary Scalar (Cl)', value: displayResult.cl.toFixed(4), color: 'text-green-400', border: 'border-green-500' },
                            { label: 'Efficiency Index', value: displayResult.liftToDragRatio.toFixed(2), color: 'text-purple-400', border: 'border-purple-500' },
                            { label: 'Chaos Entropy', value: ((displayResult.eggheadMetrics?.entropyGenerationRate ?? 0) as number).toFixed(2), color: 'text-red-400', border: 'border-red-500' }
                        ].map((stat, i) => (
                            <div key={i} className={`bg-[#020617] relative p-6 rounded-xl border-l-4 ${stat.border} shadow-lg overflow-hidden group hover:bg-[#0F172A] transition-colors`}>
                                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <BrainCircuitIcon className="w-12 h-12" />
                                </div>
                                <p className="text-[9px] font-egghead text-brand-text-secondary uppercase tracking-[0.2em] mb-1">
                                    {stat.label}
                                </p>
                                <p className={`text-4xl font-black font-egghead tracking-tighter ${stat.color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                                    {stat.value}
                                </p>
                                {/* Decorative corner */}
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/10"></div>
                            </div>
                        ))}
                    </div>

                    {/* Main Visualizer Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* 3D Hologram */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-black rounded-xl border border-brand-accent/30 p-1 shadow-[0_0_50px_rgba(14,165,233,0.1)] relative group">
                                {/* Tech overlay corners */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-accent z-20"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-accent z-20"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-accent z-20"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-accent z-20"></div>
                                
                                <FlowFieldVisualizer parameters={displayResult.parameters} flowFieldData={displayResult.flowFieldData} />
                            </div>

                            {/* Multiverse Convergence Graph */}
                            <div className="bg-[#0F172A]/80 backdrop-blur-md border border-brand-border p-6 rounded-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 text-[100px] text-white/5 font-black leading-none pointer-events-none select-none -translate-y-8 translate-x-8">
                                    timeline
                                </div>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h3 className="font-bold text-brand-text font-egghead uppercase tracking-widest flex items-center gap-2">
                                        <LayersIcon className="w-4 h-4 text-purple-400" />
                                        Cross-Reality Verification
                                    </h3>
                                    <span className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 font-egghead tracking-widest animate-pulse">
                                        3 BRANCHES ACTIVE
                                    </span>
                                </div>
                                
                                {/* Simulated Convergence Graph */}
                                <div className="h-64 w-full relative overflow-hidden bg-black/20 rounded-lg border border-white/5">
                                    <div className="absolute inset-0 flex items-end">
                                        {/* Background Grid */}
                                        <div className="w-full h-full border-l border-b border-brand-text-secondary/20" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                                        
                                        {/* Timelines (SVG) */}
                                        <svg className="absolute inset-0 h-full w-full overflow-visible">
                                            {/* Chaos Timeline */}
                                            <path d="M0,250 C100,200 300,240 800,50" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
                                            {/* Optimistic Timeline */}
                                            <path d="M0,250 C200,100 400,80 800,20" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
                                            {/* Reality Prime */}
                                            <path d="M0,250 C150,150 500,100 800,40" fill="none" stroke="#0EA5E9" strokeWidth="4" className="drop-shadow-[0_0_10px_#0EA5E9]" />
                                        </svg>
                                    </div>
                                    {/* Labels */}
                                    <div className="absolute top-4 right-4 text-right space-y-1 font-egghead">
                                        <div className="text-[10px] text-brand-text-secondary flex items-center justify-end gap-2">
                                            <span className="opacity-70">REALITY PRIME (99.9%)</span> <span className="inline-block w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></span>
                                        </div>
                                        <div className="text-[10px] text-brand-text-secondary flex items-center justify-end gap-2">
                                            <span className="opacity-70">GOLDEN FUTURE</span> <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
                                        </div>
                                        <div className="text-[10px] text-brand-text-secondary flex items-center justify-end gap-2">
                                            <span className="opacity-70">VOID CENTURY CHAOS</span> <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel: Atlas Force Breakdown */}
                        <div className="space-y-6">
                            <div className="bg-[#0F172A]/80 backdrop-blur border border-brand-border p-6 rounded-xl h-full flex flex-col">
                                <h3 className="font-bold text-brand-text font-egghead uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                    <BotIcon className="w-4 h-4 text-brand-accent"/> Atlas Force Breakdown
                                </h3>
                                <div className="space-y-6 flex-grow">
                                    {Object.entries(displayResult.dragBreakdown || {}).map(([key, value]) => (
                                        <div key={key} className="relative group">
                                            <div className="flex justify-between text-[10px] uppercase font-bold text-brand-text-secondary mb-1 group-hover:text-brand-text transition-colors">
                                                <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                                                <span className="font-mono text-brand-accent">{value.toFixed(1)}%</span>
                                            </div>
                                            <div className="h-1.5 bg-black rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-gradient-to-r from-brand-accent to-purple-500 shadow-[0_0_10px_currentColor] relative" style={{ width: `${value}%` }}>
                                                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white opacity-50"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-brand-border">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-[9px] font-bold text-brand-text-secondary uppercase tracking-widest">Governing Equation</h4>
                                        <CommandIcon className="w-3 h-3 text-brand-text-secondary" />
                                    </div>
                                    <div className="p-3 bg-black/40 rounded border border-brand-border/50 font-mono text-[10px] text-brand-accent break-all">
                                        {displayResult.eggheadMetrics?.generatedGoverningEquation || "Calculating..."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Empty State / Initial Load
                <div className="flex flex-col items-center justify-center h-64 opacity-50 border-2 border-dashed border-brand-border rounded-2xl">
                    <WindIcon className="w-12 h-12 mb-2 text-brand-text-secondary" />
                    <p className="font-egghead text-xs tracking-widest text-brand-text-secondary uppercase">
                        AWAITING SIMULATION DATA
                    </p>
                </div>
            )}

            {/* Performance Graphs Row */}
            {displayResult && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-up [animation-delay:0.2s]">
                    <PerformanceGraph results={[displayResult]} />
                    <SpeedTimeGraph result={displayResult} />
                </div>
            )}
        </div>
    );
};

export default AeroPage;