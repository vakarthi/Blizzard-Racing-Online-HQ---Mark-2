
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/AppContext';
import { UploadCloudIcon, WindIcon, AlertTriangleIcon, CheckCircleIcon, PlusCircleIcon, BeakerIcon, TrashIcon, HistoryIcon } from '../../components/icons';
import PerformanceGraph from '../../components/hq/PerformanceGraph';
import SpeedTimeGraph from '../../components/hq/SpeedTimeGraph';
import ConvergenceGraph from '../../components/hq/ConvergenceGraph';
import FlowFieldVisualizer from '../../components/hq/FlowFieldVisualizer';
import DashboardWidget from '../../components/hq/DashboardWidget';
import { AeroResult, CarClass } from '../../types';

const AeroPage: React.FC = () => {
    const { aeroResults, runSimulationTask, backgroundTasks, deleteAeroResult } = useData();
    const [dragActive, setDragActive] = useState(false);
    // Automatically select the most recent result (first in list)
    const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeTasks = backgroundTasks.filter(t => t.status === 'running');
    
    // Effectively the latest result if nothing manually selected
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
        // Default to 'speed' mode and 'Professional' class for now
        runSimulationTask(file, 'accuracy', 'Professional');
    };

    const handleSelectResult = (id: string) => {
        setSelectedResultId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-brand-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text mb-2">Aerotest Lab</h1>
                    <p className="text-brand-text-secondary">Advanced Computational Fluid Dynamics (CFD) Workbench</p>
                </div>
                {/* Active Task Indicator */}
                {activeTasks.length > 0 && (
                    <div className="bg-brand-dark-secondary px-4 py-2 rounded-lg border border-brand-accent/30 flex items-center gap-3 animate-pulse">
                        <BeakerIcon className="w-5 h-5 text-brand-accent spin-slow" />
                        <div>
                            <p className="text-xs font-bold text-brand-accent">SIMULATION IN PROGRESS</p>
                            <p className="text-[10px] text-brand-text-secondary">{activeTasks[0].stage} ({activeTasks[0].progress.toFixed(0)}%)</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Area */}
            <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive ? 'border-brand-accent bg-brand-accent/10 scale-[1.01]' : 'border-brand-border bg-brand-dark/50 hover:border-brand-accent/50'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pointer-events-none">
                    <div className="p-4 bg-brand-dark rounded-full border border-brand-border mb-4 shadow-lg">
                        <UploadCloudIcon className="w-8 h-8 text-brand-accent" />
                    </div>
                    <p className="text-lg font-bold text-brand-text">Drop CAD Geometry Here</p>
                    <p className="text-sm text-brand-text-secondary mt-1 mb-4">Accepts .STL (Binary/ASCII) and .FBX</p>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleChange} accept=".stl,.fbx" />
                <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="relative z-10 bg-brand-surface hover:bg-brand-border text-brand-text font-semibold py-2 px-6 rounded-lg transition-colors border border-brand-border shadow-sm"
                >
                    Browse Files
                </button>
            </div>

            {/* Main Result View */}
            {displayResult ? (
                <div className="space-y-6 animate-slide-in-up">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                            <span className="bg-brand-accent/20 text-brand-accent px-3 py-1 rounded text-sm font-mono border border-brand-accent/30">LATEST</span>
                            {displayResult.parameters.carName}
                        </h2>
                        <span className="text-sm text-brand-text-secondary">{new Date(displayResult.timestamp).toLocaleString()}</span>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DashboardWidget title="Drag Coeff. (Cd)" icon={<WindIcon className="w-4 h-4"/>}>
                            <p className="text-4xl font-black text-brand-text">{displayResult.cd.toFixed(4)}</p>
                            <p className="text-xs text-brand-text-secondary mt-1">Target: &lt; 0.1500</p>
                        </DashboardWidget>
                        <DashboardWidget title="Downforce (Cl)" icon={<WindIcon className="w-4 h-4"/>}>
                            <p className="text-4xl font-black text-brand-text">{displayResult.cl.toFixed(4)}</p>
                            <p className="text-xs text-brand-text-secondary mt-1">Target: &gt; 0.5000</p>
                        </DashboardWidget>
                        <DashboardWidget title="Efficiency (L/D)" icon={<WindIcon className="w-4 h-4"/>}>
                            <p className="text-4xl font-black text-brand-text">{displayResult.liftToDragRatio.toFixed(2)}</p>
                            <p className="text-xs text-brand-text-secondary mt-1">Target: &gt; 4.0</p>
                        </DashboardWidget>
                        <DashboardWidget title="Est. Race Time" icon={<WindIcon className="w-4 h-4"/>}>
                            <p className="text-4xl font-black text-brand-accent">{displayResult.raceTimePrediction?.averageRaceTime.toFixed(3)}s</p>
                            <p className="text-xs text-brand-text-secondary mt-1">@ 20 Meters</p>
                        </DashboardWidget>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Graphs Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-6 shadow-sm">
                                <h3 className="font-bold text-brand-text mb-4">Performance Curves</h3>
                                <div className="space-y-8">
                                    <PerformanceGraph results={[displayResult]} height={250} />
                                    <SpeedTimeGraph result={displayResult} height={200} />
                                </div>
                            </div>
                            
                            {/* Convergence (Technical) */}
                            {displayResult.residualHistory && (
                                <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-6 shadow-sm">
                                    <h3 className="font-bold text-brand-text mb-4">Solver Convergence</h3>
                                    <ConvergenceGraph history={displayResult.residualHistory} height={200} />
                                </div>
                            )}
                        </div>

                        {/* Visuals & Insights Column */}
                        <div className="space-y-6">
                            {displayResult.parameters.rawModelData && (
                                <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-6 shadow-sm">
                                    <h3 className="font-bold text-brand-text mb-4">Flow Visualization</h3>
                                    <FlowFieldVisualizer parameters={displayResult.parameters} flowFieldData={displayResult.flowFieldData} />
                                </div>
                            )}

                            {displayResult.suggestions && (
                                <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-6 shadow-sm">
                                    <h3 className="font-bold text-brand-text mb-4 flex items-center gap-2">
                                        <AlertTriangleIcon className="w-5 h-5 text-yellow-400" /> AI Engineer Analysis
                                    </h3>
                                    <div className="prose prose-invert text-sm max-w-none bg-brand-dark p-4 rounded-lg border border-brand-border">
                                        <div className="whitespace-pre-wrap font-sans text-brand-text-secondary">{displayResult.suggestions}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-brand-dark-secondary rounded-xl border border-brand-border border-dashed">
                    <WindIcon className="w-16 h-16 text-brand-border mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-brand-text">No Results Yet</h3>
                    <p className="text-brand-text-secondary mt-2">Upload a geometry file to start your first simulation.</p>
                </div>
            )}

            {/* History Section (Bottom) */}
            {aeroResults.length > 1 && (
                <div className="pt-12 border-t border-brand-border">
                    <h3 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
                        <HistoryIcon className="w-5 h-5 text-brand-text-secondary" /> Simulation History
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {aeroResults.map(result => (
                            <div 
                                key={result.id}
                                onClick={() => handleSelectResult(result.id)}
                                className={`group p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${displayResult?.id === result.id ? 'bg-brand-accent/5 border-brand-accent ring-1 ring-brand-accent' : 'bg-brand-dark-secondary border-brand-border hover:border-brand-text-secondary'}`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <p className="font-bold text-brand-text truncate pr-2">{result.parameters.carName}</p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteAeroResult(result.id); }} 
                                        className="text-brand-text-secondary hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="bg-brand-dark p-2 rounded">
                                        <span className="text-brand-text-secondary block mb-1">Cd</span>
                                        <span className="font-bold">{result.cd.toFixed(3)}</span>
                                    </div>
                                    <div className="bg-brand-dark p-2 rounded">
                                        <span className="text-brand-text-secondary block mb-1">L/D</span>
                                        <span className="font-bold">{result.liftToDragRatio.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-brand-dark p-2 rounded">
                                        <span className="text-brand-text-secondary block mb-1">Time</span>
                                        <span className="font-bold text-brand-accent">{result.raceTimePrediction?.averageRaceTime.toFixed(3)}s</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-brand-text-secondary mt-3 text-right">
                                    {new Date(result.timestamp).toLocaleDateString()}
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
