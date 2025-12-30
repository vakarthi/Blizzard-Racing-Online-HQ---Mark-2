
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/AppContext';
import { UploadCloudIcon, WindIcon, AlertTriangleIcon, CheckCircleIcon, PlusCircleIcon, BeakerIcon, TrashIcon, HistoryIcon, BotIcon, SparklesIcon, BrainCircuitIcon, LayersIcon, EyeIcon } from '../../components/icons';
import PerformanceGraph from '../../components/hq/PerformanceGraph';
import SpeedTimeGraph from '../../components/hq/SpeedTimeGraph';
import ConvergenceGraph from '../../components/hq/ConvergenceGraph';
import FlowFieldVisualizer from '../../components/hq/FlowFieldVisualizer';
import DashboardWidget from '../../components/hq/DashboardWidget';
import { AeroResult, CarClass } from '../../types';

const AeroPage: React.FC = () => {
    const { aeroResults, runSimulationTask, backgroundTasks, deleteAeroResult } = useData();
    const [dragActive, setDragActive] = useState(false);
    const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
    const [realityMode, setRealityMode] = useState<'actual' | 'perfect' | 'chaos'>('actual');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeTasks = backgroundTasks.filter(t => t.status === 'running');
    
    const displayResult = selectedResultId 
        ? aeroResults.find(r => r.id === selectedResultId) 
        : aeroResults[0];

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        runSimulationTask(file, 'accuracy', 'Professional');
    };

    const handleSelectResult = (id: string) => {
        setSelectedResultId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto font-sans">
            {/* Egghead Header - Future Island Style */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-dark-secondary to-[#0F172A] border border-brand-accent/30 p-8 shadow-[0_0_40px_rgba(14,165,233,0.1)]">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <BrainCircuitIcon className="w-64 h-64 text-brand-accent transform rotate-12" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded bg-brand-accent text-brand-dark font-egghead font-bold text-xs tracking-widest">EGGHEAD ISLAND</span>
                            <span className="text-brand-accent/50 font-mono text-xs">LABOPHASE // SECTOR A</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-text mb-2 font-display tracking-tight">
                            PUNK RECORDS <span className="text-brand-accent">AERO-LAYER</span>
                        </h1>
                        <p className="text-brand-text-secondary font-mono text-sm max-w-xl">
                            Synchronizing with Satellite York for computational fluid dynamics. Upload geometry to the Frontier Dome for processing.
                        </p>
                    </div>
                    
                    {/* Active Task Hologram */}
                    {activeTasks.length > 0 && (
                        <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-brand-accent/50 shadow-[0_0_15px_rgba(14,165,233,0.3)] flex items-center gap-4 animate-pulse">
                            <div className="relative">
                                <BeakerIcon className="w-8 h-8 text-brand-accent spin-slow" />
                                <div className="absolute inset-0 bg-brand-accent blur-xl opacity-40 animate-pulse"></div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-brand-accent font-egghead tracking-wider mb-1">SIMULATION SEQUENCE ACTIVE</p>
                                <p className="text-[10px] text-white font-mono">{activeTasks[0].stage}</p>
                                <div className="w-32 bg-brand-dark/50 h-1 mt-2 rounded-full overflow-hidden">
                                    <div className="bg-brand-accent h-full transition-all duration-300" style={{ width: `${activeTasks[0].progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Terminal */}
            <div 
                className={`relative group border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-500 overflow-hidden ${dragActive ? 'border-brand-accent bg-brand-accent/5 scale-[1.01]' : 'border-brand-border bg-brand-dark/30 hover:border-brand-accent/50'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Sci-Fi Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, var(--color-accent-default) 25%, var(--color-accent-default) 26%, transparent 27%, transparent 74%, var(--color-accent-default) 75%, var(--color-accent-default) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, var(--color-accent-default) 25%, var(--color-accent-default) 26%, transparent 27%, transparent 74%, var(--color-accent-default) 75%, var(--color-accent-default) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="p-5 bg-brand-dark/80 rounded-full border border-brand-accent/20 mb-6 shadow-[0_0_30px_rgba(14,165,233,0.15)] group-hover:scale-110 transition-transform duration-500">
                        <UploadCloudIcon className="w-10 h-10 text-brand-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-text font-display mb-2">Initialize Data Transfer</h3>
                    <p className="text-sm text-brand-text-secondary font-mono mb-6">Drop .STL or .FBX geometry to begin Voxelization</p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleChange} accept=".stl,.fbx" />
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="bg-brand-accent text-brand-dark font-black font-egghead tracking-widest py-3 px-8 rounded-lg hover:bg-brand-accent-hover transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] uppercase"
                    >
                        Select Source File
                    </button>
                </div>
            </div>

            {/* Main Result Interface */}
            {displayResult ? (
                <div className="space-y-6 animate-slide-in-up">
                    {/* Header Bar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-brand-border/50 pb-4 gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-brand-text font-display flex items-center gap-3 uppercase">
                                <span className="w-2 h-8 bg-brand-accent rounded-sm"></span>
                                {displayResult.parameters.carName}
                            </h2>
                            <p className="text-[10px] font-mono text-brand-text-secondary uppercase mt-1 pl-5">
                                GENERATION: {displayResult.eggheadMetrics?.futurePredictionDate || 'CURRENT'}
                            </p>
                        </div>
                        
                        {/* Multi-Reality Selector */}
                        <div className="flex items-center gap-2 p-1 bg-brand-dark rounded-lg border border-brand-border">
                            <button onClick={() => setRealityMode('actual')} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${realityMode === 'actual' ? 'bg-brand-accent text-brand-dark shadow-glow-accent' : 'text-brand-text-secondary hover:text-brand-text'}`}>
                                Reality: Actual
                            </button>
                            <button onClick={() => setRealityMode('perfect')} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${realityMode === 'perfect' ? 'bg-green-500 text-brand-dark shadow-glow-accent' : 'text-brand-text-secondary hover:text-brand-text'}`}>
                                Reality: Ideal
                            </button>
                            <button onClick={() => setRealityMode('chaos')} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${realityMode === 'chaos' ? 'bg-red-500 text-brand-dark shadow-glow-accent' : 'text-brand-text-secondary hover:text-brand-text'}`}>
                                Reality: Chaos
                            </button>
                        </div>
                    </div>

                    {/* EGGHEAD OMEGA EQUATION DISPLAY */}
                    {displayResult.eggheadMetrics && (
                        <div className="relative p-6 rounded-xl bg-black border border-brand-accent/40 shadow-[0_0_30px_rgba(14,165,233,0.1)] overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 text-[10px] font-egghead text-brand-accent/50 tracking-widest uppercase flex items-center gap-2">
                                <BrainCircuitIcon className="w-3 h-3" />
                                SYNTHESIZED GOVERNING EQUATION
                            </div>
                            <div className="font-serif italic text-xl md:text-2xl text-center text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                $${displayResult.eggheadMetrics.generatedGoverningEquation}$$
                            </div>
                            {/* Decorative Equation Glitch */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-scanline pointer-events-none"></div>
                        </div>
                    )}

                    {/* KPI Holograms */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-brand-dark-secondary/60 backdrop-blur-sm border border-brand-border p-5 rounded-xl relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-20"><WindIcon className="w-12 h-12 text-brand-text"/></div>
                            <p className="text-[10px] font-mono text-brand-text-secondary uppercase mb-1">Aerodynamic Resistance ($C_d$)</p>
                            <p className="text-4xl font-black text-brand-text font-egghead tracking-tight group-hover:text-brand-accent transition-colors">
                                {(displayResult.cd * (realityMode === 'chaos' ? 1.2 : realityMode === 'perfect' ? 0.9 : 1)).toFixed(4)}
                            </p>
                            <div className="w-full bg-brand-dark h-1 mt-3 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${Math.min(100, (displayResult.cd / 0.3) * 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-brand-dark-secondary/60 backdrop-blur-sm border border-brand-border p-5 rounded-xl relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-20"><LayersIcon className="w-12 h-12 text-brand-text"/></div>
                            <p className="text-[10px] font-mono text-brand-text-secondary uppercase mb-1">Entropy Generation (EGU)</p>
                            <p className="text-4xl font-black text-brand-text font-egghead tracking-tight group-hover:text-brand-accent transition-colors">
                                {displayResult.eggheadMetrics ? (displayResult.eggheadMetrics.entropyGenerationRate * (realityMode === 'chaos' ? 1.5 : 1)).toFixed(2) : "N/A"}
                            </p>
                            <div className="w-full bg-brand-dark h-1 mt-3 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500" style={{ width: `${Math.min(100, ((displayResult.eggheadMetrics?.entropyGenerationRate || 0) / 5) * 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-brand-dark-secondary/60 backdrop-blur-sm border border-brand-border p-5 rounded-xl relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-20"><SparklesIcon className="w-12 h-12 text-brand-text"/></div>
                            <p className="text-[10px] font-mono text-brand-text-secondary uppercase mb-1">Vortex Strength ($\Gamma$)</p>
                            <p className="text-4xl font-black text-brand-text font-egghead tracking-tight group-hover:text-brand-accent transition-colors">
                                {displayResult.eggheadMetrics ? displayResult.eggheadMetrics.vortexLatticeStrength.toFixed(3) : "N/A"}
                            </p>
                            <div className="w-full bg-brand-dark h-1 mt-3 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, ((displayResult.eggheadMetrics?.vortexLatticeStrength || 0) / 0.1) * 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-brand-dark-secondary/60 backdrop-blur-sm border border-brand-border p-5 rounded-xl relative overflow-hidden group hover:border-brand-accent/50 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-20"><HistoryIcon className="w-12 h-12 text-brand-text"/></div>
                            <p className="text-[10px] font-mono text-brand-text-secondary uppercase mb-1">Predicted Event Time (RK4)</p>
                            <p className="text-4xl font-black text-brand-accent font-egghead tracking-tight">
                                {displayResult.raceTimePrediction ? (displayResult.raceTimePrediction.averageRaceTime * (realityMode === 'chaos' ? 1.05 : realityMode === 'perfect' ? 0.98 : 1)).toFixed(3) : "0.000"}s
                            </p>
                            <p className="text-[9px] font-mono text-brand-text-secondary mt-1">CONFIDENCE: {displayResult.raceTimePrediction?.trustIndex || 0}%</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Graphs Column - "Visual Cortex" */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* ATLAS FORCE BREAKDOWN */}
                            <div className="bg-brand-dark-secondary/40 rounded-xl border border-brand-border p-1 backdrop-blur-sm">
                                <div className="bg-brand-dark/50 rounded-lg p-3 border-b border-brand-border/50 mb-1 flex items-center justify-between">
                                    <h3 className="font-bold text-brand-text font-egghead uppercase tracking-widest flex items-center gap-2">
                                        <LayersIcon className="w-4 h-4 text-brand-accent" />
                                        Atlas Force Breakdown
                                    </h3>
                                    <span className="text-[9px] bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded border border-brand-accent/20">COMPONENT ANALYSIS</span>
                                </div>
                                <div className="p-6 space-y-4">
                                    {Object.entries(displayResult.dragBreakdown || {}).map(([key, value]) => {
                                        let color = 'bg-brand-accent';
                                        if (key === 'pressure') color = 'bg-red-500';
                                        if (key === 'skinFriction') color = 'bg-blue-500';
                                        if (key === 'induced') color = 'bg-purple-500';
                                        if (key === 'tetherWake') color = 'bg-orange-500';
                                        
                                        const displayValue = (value as number) * (realityMode === 'chaos' ? 1.2 : 1);

                                        return (
                                            <div key={key} className="relative">
                                                <div className="flex justify-between items-end mb-1 text-xs uppercase font-bold text-brand-text-secondary">
                                                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                                                    <span>{displayValue.toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-brand-dark h-3 rounded-full overflow-hidden border border-white/5 relative">
                                                    {/* Glowing Bar */}
                                                    <div 
                                                        className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-700 ease-out`} 
                                                        style={{ width: `${Math.min(100, displayValue)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {(!displayResult.dragBreakdown || Object.keys(displayResult.dragBreakdown).length === 0) && (
                                        <p className="text-center text-xs text-brand-text-secondary italic py-4">Force component analysis unavailable for this model.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-brand-dark-secondary/40 rounded-xl border border-brand-border p-1 backdrop-blur-sm">
                                <div className="bg-brand-dark/50 rounded-lg p-3 border-b border-brand-border/50 mb-1 flex items-center justify-between">
                                    <h3 className="font-bold text-brand-text font-egghead uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
                                        Visual Cortex // Performance
                                    </h3>
                                </div>
                                <div className="p-4 space-y-8">
                                    <PerformanceGraph results={[displayResult]} height={250} />
                                    <SpeedTimeGraph result={displayResult} height={200} showTitle={true} />
                                </div>
                            </div>
                            
                            {/* Convergence (Technical) */}
                            {displayResult.residualHistory && (
                                <div className="bg-brand-dark-secondary/40 rounded-xl border border-brand-border p-1 backdrop-blur-sm">
                                    <div className="bg-brand-dark/50 rounded-lg p-3 border-b border-brand-border/50 mb-1">
                                        <h3 className="font-bold text-brand-text font-egghead uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Solver Convergence
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        <ConvergenceGraph history={displayResult.residualHistory} height={200} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Visuals & Insights Column - "Logic Lobe" */}
                        <div className="space-y-6">
                            {displayResult.parameters.rawModelData && (
                                <div className="bg-brand-dark-secondary/40 rounded-xl border border-brand-border p-1 backdrop-blur-sm shadow-lg">
                                    <div className="bg-brand-dark/50 rounded-lg p-3 border-b border-brand-border/50 mb-1">
                                        <h3 className="font-bold text-brand-text font-egghead uppercase tracking-widest flex items-center gap-2">
                                            <EyeIcon className="w-4 h-4 text-brand-accent" />
                                            Holo-Projection
                                        </h3>
                                    </div>
                                    <FlowFieldVisualizer parameters={displayResult.parameters} flowFieldData={displayResult.flowFieldData} />
                                </div>
                            )}

                            {displayResult.suggestions && (
                                <div className="bg-gradient-to-br from-brand-dark-secondary to-[#1e1b4b] rounded-xl border border-brand-accent/20 p-1 shadow-[0_0_20px_rgba(76,29,149,0.1)]">
                                    <div className="bg-brand-dark/50 rounded-lg p-3 border-b border-brand-accent/10 mb-1 flex items-center justify-between">
                                        <h3 className="font-bold text-brand-text font-egghead uppercase tracking-widest flex items-center gap-2">
                                            <BotIcon className="w-4 h-4 text-brand-accent" />
                                            Satellite Analysis (Shaka)
                                        </h3>
                                        <span className="text-[10px] bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded border border-brand-accent/20">LOGIC</span>
                                    </div>
                                    <div className="p-5">
                                        <div className="prose prose-invert text-sm max-w-none">
                                            <div className="whitespace-pre-wrap font-sans text-brand-text-secondary leading-relaxed">
                                                {displayResult.suggestions}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-24 bg-brand-dark-secondary/30 rounded-3xl border border-brand-border border-dashed backdrop-blur-sm">
                    <div className="w-20 h-20 bg-brand-dark rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-border shadow-inner">
                        <WindIcon className="w-10 h-10 text-brand-text-secondary/50" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-text font-display">Awaiting Input</h3>
                    <p className="text-brand-text-secondary mt-2 font-mono text-sm">Upload geometry to initialize the Frontier Dome physics engine.</p>
                </div>
            )}

            {/* History Section (Bottom) - "Poneglyph Archive" */}
            {aeroResults.length > 1 && (
                <div className="pt-12 border-t border-brand-border/50">
                    <h3 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-3 font-display">
                        <HistoryIcon className="w-5 h-5 text-brand-accent" /> 
                        PONEGLYPH ARCHIVE
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {aeroResults.map(result => (
                            <div 
                                key={result.id}
                                onClick={() => handleSelectResult(result.id)}
                                className={`group relative p-5 rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden ${displayResult?.id === result.id ? 'bg-brand-accent/10 border-brand-accent ring-1 ring-brand-accent' : 'bg-brand-dark-secondary/50 border-brand-border hover:border-brand-accent/50'}`}
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <p className="font-bold text-brand-text truncate pr-2 font-display">{result.parameters.carName}</p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteAeroResult(result.id); }} 
                                        className="text-brand-text-secondary hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs relative z-10">
                                    <div className="bg-brand-dark p-2 rounded border border-brand-border/50">
                                        <span className="text-[9px] text-brand-text-secondary block mb-1 uppercase font-bold">Res. (Cd)</span>
                                        <span className="font-bold font-egghead text-brand-text">{result.cd.toFixed(3)}</span>
                                    </div>
                                    <div className="bg-brand-dark p-2 rounded border border-brand-border/50">
                                        <span className="text-[9px] text-brand-text-secondary block mb-1 uppercase font-bold">Chaos (EGU)</span>
                                        <span className="font-bold font-egghead text-brand-text">{result.eggheadMetrics?.entropyGenerationRate.toFixed(1) || '-'}</span>
                                    </div>
                                    <div className="bg-brand-dark p-2 rounded border border-brand-border/50">
                                        <span className="text-[9px] text-brand-text-secondary block mb-1 uppercase font-bold">Time</span>
                                        <span className="font-bold font-egghead text-brand-accent">{result.raceTimePrediction ? result.raceTimePrediction.averageRaceTime.toFixed(3) : "-"}s</span>
                                    </div>
                                </div>
                                <p className="text-[9px] text-brand-text-secondary mt-3 text-right font-mono opacity-60">
                                    LOG: {new Date(result.timestamp).toLocaleDateString()} // ID: {result.id.slice(-4)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AeroPage;
