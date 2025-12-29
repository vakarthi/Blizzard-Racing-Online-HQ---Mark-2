import React, { useCallback } from 'react';
import { useData } from '../../contexts/AppContext';
import { UploadCloudIcon, WindIcon } from '../../components/icons';
import PerformanceGraph from '../../components/hq/PerformanceGraph';
import SpeedTimeGraph from '../../components/hq/SpeedTimeGraph';
import MonteCarloScatterPlot from '../../components/hq/MonteCarloScatterPlot';
import ConvergenceGraph from '../../components/hq/ConvergenceGraph';
import FlowFieldVisualizer from '../../components/hq/FlowFieldVisualizer';

const AeroPage: React.FC = () => {
    const { aeroResults, runSimulationTask, backgroundTasks } = useData();
    const latestResult = aeroResults[0];

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Default to 'accuracy' mode for UI simplicity for now
            runSimulationTask(e.target.files[0], 'accuracy', 'Professional');
        }
    }, [runSimulationTask]);

    const activeTask = backgroundTasks.find(t => t.status === 'running');

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text">Egghead Aero Lab</h1>
                    <p className="text-brand-text-secondary">Advanced CFD & Neural Physics Engine</p>
                </div>
                
                <div className="flex gap-4">
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold cursor-pointer transition-all ${activeTask ? 'bg-brand-dark border border-brand-border text-brand-text-secondary cursor-not-allowed' : 'bg-brand-accent text-brand-dark hover:bg-brand-accent-hover shadow-glow-accent'}`}>
                        {activeTask ? (
                            <>
                                <div className="w-4 h-4 border-2 border-brand-text-secondary border-t-transparent rounded-full animate-spin"></div>
                                Simulating...
                            </>
                        ) : (
                            <>
                                <UploadCloudIcon className="w-5 h-5"/>
                                Upload Geometry (STEP/STL)
                                <input type="file" onChange={handleFileUpload} accept=".stl,.step,.stp" className="hidden" disabled={!!activeTask}/>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {activeTask && (
                <div className="bg-brand-dark-secondary p-4 rounded-xl border border-brand-border animate-pulse">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-brand-accent font-mono font-bold">{activeTask.stage}</span>
                        <span className="text-brand-text font-mono">{activeTask.progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-brand-dark h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-accent transition-all duration-300" style={{ width: `${activeTask.progress}%` }}></div>
                    </div>
                    <p className="text-xs text-brand-text-secondary mt-2 font-mono">{activeTask.latestLog}</p>
                </div>
            )}

            {latestResult ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Primary Metrics */}
                    <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border shadow-lg">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text">{latestResult.parameters.carName}</h2>
                                <span className="px-2 py-0.5 rounded bg-brand-accent/10 text-brand-accent text-xs font-bold border border-brand-accent/20 uppercase">{latestResult.tier} Solve</span>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-mono font-bold text-brand-accent">{latestResult.cd.toFixed(4)}</p>
                                <p className="text-xs text-brand-text-secondary uppercase tracking-wider">Drag Coefficient (Cd)</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                <p className="text-brand-text-secondary text-xs uppercase">Lift (Cl)</p>
                                <p className="text-xl font-bold text-brand-text">{latestResult.cl.toFixed(4)}</p>
                            </div>
                            <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                <p className="text-brand-text-secondary text-xs uppercase">L/D Ratio</p>
                                <p className="text-xl font-bold text-green-400">{latestResult.liftToDragRatio.toFixed(3)}</p>
                            </div>
                            <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                <p className="text-brand-text-secondary text-xs uppercase">Race Time</p>
                                <p className="text-xl font-bold text-yellow-400">{latestResult.raceTimePrediction?.averageRaceTime.toFixed(3)}s</p>
                            </div>
                            <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                <p className="text-brand-text-secondary text-xs uppercase">Balance</p>
                                <p className="text-xl font-bold text-brand-text">{latestResult.aeroBalance.toFixed(1)}% <span className="text-xs font-normal text-brand-text-secondary">Front</span></p>
                            </div>
                        </div>

                        {latestResult.suggestions && (
                            <div className="bg-brand-dark p-4 rounded-lg border border-brand-border">
                                <h3 className="font-bold text-brand-text mb-2 flex items-center gap-2">
                                    <WindIcon className="w-4 h-4 text-brand-accent"/> AI Insight
                                </h3>
                                <div className="text-sm text-brand-text-secondary whitespace-pre-wrap leading-relaxed">
                                    {latestResult.suggestions}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Flow Visualization */}
                    <div className="flex flex-col gap-6">
                        <FlowFieldVisualizer parameters={latestResult.parameters} flowFieldData={latestResult.flowFieldData} />
                    </div>

                    {/* Detailed Graphs - Full Width usually */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PerformanceGraph results={[latestResult]} height={300} />
                            <SpeedTimeGraph result={latestResult} height={300} />
                        </div>
                        {latestResult.tier === 'premium' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <MonteCarloScatterPlot result={latestResult} height={300} />
                                {latestResult.residualHistory && <ConvergenceGraph history={latestResult.residualHistory} height={300} />}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-96 bg-brand-dark-secondary rounded-xl border border-brand-border border-dashed">
                    <WindIcon className="w-16 h-16 text-brand-border mb-4"/>
                    <h3 className="text-xl font-bold text-brand-text">No Simulation Data</h3>
                    <p className="text-brand-text-secondary">Upload a 3D model to begin analysis.</p>
                </div>
            )}
        </div>
    );
};

export default AeroPage;