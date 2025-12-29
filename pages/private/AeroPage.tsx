
import React, { useState, useRef } from 'react';
import { useData } from '../../contexts/AppContext';
import { UploadCloudIcon, WindIcon, AlertTriangleIcon, CheckCircleIcon, PlusCircleIcon, BeakerIcon } from '../../components/icons';
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeTasks = backgroundTasks.filter(t => t.status === 'running');
    const selectedResult = aeroResults.find(r => r.id === selectedResultId) || aeroResults[0];

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
        // Default to 'speed' mode and 'Professional' class for now, could add UI for this
        runSimulationTask(file, 'accuracy', 'Professional');
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header / Upload Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-grow">
                    <h1 className="text-3xl font-bold text-brand-text mb-2">Aerotest Lab</h1>
                    <p className="text-brand-text-secondary mb-6">Upload CAD geometry (.stl/.fbx) to run virtual wind tunnel simulations.</p>
                    
                    <div 
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border bg-brand-dark hover:border-brand-accent/50'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <UploadCloudIcon className="w-12 h-12 text-brand-text-secondary mx-auto mb-4" />
                        <p className="text-brand-text font-bold text-lg mb-1">Drag & Drop Geometry</p>
                        <p className="text-brand-text-secondary text-sm mb-4">Supports STL and FBX files</p>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleChange} accept=".stl,.fbx" />
                        <button onClick={() => fileInputRef.current?.click()} className="bg-brand-surface hover:bg-brand-border text-brand-text font-semibold py-2 px-6 rounded-lg transition-colors">
                            Browse Files
                        </button>
                    </div>
                </div>

                {/* Active Tasks Panel */}
                <div className="w-full md:w-80 flex-shrink-0">
                    <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-4 h-full">
                        <h3 className="font-bold text-brand-text mb-4 flex items-center gap-2">
                            <BeakerIcon className="w-5 h-5 text-brand-accent" /> Active Simulations
                        </h3>
                        <div className="space-y-3">
                            {activeTasks.map(task => (
                                <div key={task.id} className="bg-brand-dark p-3 rounded-lg border border-brand-border">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-brand-text truncate w-2/3">{task.fileName}</span>
                                        <span className="text-xs text-brand-accent font-mono">{task.progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-brand-surface rounded-full h-1.5 mb-2">
                                        <div className="bg-brand-accent h-1.5 rounded-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                                    </div>
                                    <p className="text-xs text-brand-text-secondary">{task.stage}</p>
                                </div>
                            ))}
                            {activeTasks.length === 0 && (
                                <p className="text-sm text-brand-text-secondary text-center py-8 italic">No active simulations.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {aeroResults.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List of Results */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="font-bold text-brand-text text-xl">Recent Results</h3>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                            {aeroResults.map(result => (
                                <div 
                                    key={result.id} 
                                    onClick={() => setSelectedResultId(result.id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedResult?.id === result.id ? 'bg-brand-accent/10 border-brand-accent' : 'bg-brand-dark border-brand-border hover:border-brand-text-secondary'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-brand-text">{result.parameters.carName}</p>
                                            <p className="text-xs text-brand-text-secondary">{new Date(result.timestamp).toLocaleString()}</p>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); deleteAeroResult(result.id); }} className="text-red-400 hover:bg-red-500/10 p-1 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-brand-surface rounded p-1">
                                            <p className="text-[10px] text-brand-text-secondary uppercase">Cd</p>
                                            <p className="font-mono font-bold text-brand-text">{result.cd.toFixed(3)}</p>
                                        </div>
                                        <div className="bg-brand-surface rounded p-1">
                                            <p className="text-[10px] text-brand-text-secondary uppercase">L/D</p>
                                            <p className="font-mono font-bold text-brand-text">{result.liftToDragRatio.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-brand-surface rounded p-1">
                                            <p className="text-[10px] text-brand-text-secondary uppercase">Time</p>
                                            <p className="font-mono font-bold text-brand-text">{result.raceTimePrediction?.averageRaceTime.toFixed(3)}s</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detail View */}
                    {selectedResult && (
                        <div className="lg:col-span-2 space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <DashboardWidget title="Drag Coeff." icon={<WindIcon className="w-4 h-4"/>}>
                                    <p className="text-3xl font-black text-brand-text">{selectedResult.cd.toFixed(4)}</p>
                                </DashboardWidget>
                                <DashboardWidget title="Downforce (Cl)" icon={<WindIcon className="w-4 h-4"/>}>
                                    <p className="text-3xl font-black text-brand-text">{selectedResult.cl.toFixed(4)}</p>
                                </DashboardWidget>
                                <DashboardWidget title="Efficiency" icon={<WindIcon className="w-4 h-4"/>}>
                                    <p className="text-3xl font-black text-brand-text">{selectedResult.liftToDragRatio.toFixed(2)}</p>
                                </DashboardWidget>
                                <DashboardWidget title="Pred. Time" icon={<WindIcon className="w-4 h-4"/>}>
                                    <p className="text-3xl font-black text-brand-text">{selectedResult.raceTimePrediction?.averageRaceTime.toFixed(3)}s</p>
                                </DashboardWidget>
                            </div>

                            {/* Graphs */}
                            <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-6">
                                <h3 className="font-bold text-brand-text mb-4">Performance Analysis</h3>
                                <div className="space-y-8">
                                    <PerformanceGraph results={[selectedResult]} />
                                    <SpeedTimeGraph result={selectedResult} />
                                </div>
                            </div>

                            {/* Visualization */}
                            {selectedResult.parameters.rawModelData && (
                                <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-6">
                                    <h3 className="font-bold text-brand-text mb-4">Flow Visualization</h3>
                                    <FlowFieldVisualizer parameters={selectedResult.parameters} flowFieldData={selectedResult.flowFieldData} />
                                </div>
                            )}

                            {/* Convergence */}
                            {selectedResult.residualHistory && (
                                <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-6">
                                    <h3 className="font-bold text-brand-text mb-4">Solver Convergence</h3>
                                    <ConvergenceGraph history={selectedResult.residualHistory} />
                                </div>
                            )}

                            {/* Suggestions */}
                            {selectedResult.suggestions && (
                                <div className="bg-brand-dark-secondary rounded-xl border border-brand-border p-6">
                                    <h3 className="font-bold text-brand-text mb-4 flex items-center gap-2">
                                        <AlertTriangleIcon className="w-5 h-5 text-yellow-400" /> AI Suggestions
                                    </h3>
                                    <div className="prose prose-invert text-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-brand-text-secondary">{selectedResult.suggestions}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AeroPage;
