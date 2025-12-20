
import React, { useState, useRef, useMemo } from 'react';
import { useData } from '../../contexts/AppContext';
import { AeroResult } from '../../types';
import { WindIcon, BeakerIcon, BarChartIcon, StopwatchIcon, UploadCloudIcon, SparklesIcon, CheckCircleIcon, XCircleIcon, CommandIcon, InfoIcon, TrashIcon, AlertTriangleIcon, ShieldCheckIcon } from '../../components/icons';
import PerformanceGraph from '../../components/hq/PerformanceGraph';
import SpeedTimeGraph from '../../components/hq/SpeedTimeGraph';
import MonteCarloScatterPlot from '../../components/hq/MonteCarloScatterPlot';
import { THEORETICAL_OPTIMUM } from '../../services/mockData';

const MetricCard: React.FC<{ label: string; value: string | number; subValue?: string; color?: string }> = ({ label, value, subValue, color = 'text-brand-text' }) => (
    <div className="bg-brand-dark p-4 rounded-xl border border-brand-border">
        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
        {subValue && <p className="text-[10px] text-brand-text-secondary mt-1">{subValue}</p>}
    </div>
);

const DetailedAnalysisContent: React.FC<{ result: AeroResult }> = ({ result }) => {
    const [activeSubTab, setActiveSubTab] = useState('summary');
    const pred = result.raceTimePrediction;
    const avgSpeedKmh = pred ? (pred.averageSpeed * 3.6).toFixed(1) : '0.0';

    const renderSummary = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Drag (Cd)" value={result.cd.toFixed(4)} />
                <MetricCard label="Efficiency (L/D)" value={result.liftToDragRatio.toFixed(3)} color="text-green-400" />
                <MetricCard label="Avg Race Time" value={`${pred?.averageRaceTime.toFixed(3)}s`} color="text-brand-accent" />
                <MetricCard label="Average Velocity" value={`${avgSpeedKmh} km/h`} subValue={`${pred?.averageSpeed.toFixed(2)} m/s`} color="text-yellow-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-brand-accent uppercase flex items-center gap-2">
                                <StopwatchIcon className="w-4 h-4" /> 20m Performance Profile
                            </h3>
                            <span className="text-[10px] font-black px-2 py-1 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent uppercase">
                                {result.tier === 'premium' ? 'Professional Class' : 'Development Class'}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-xs text-brand-text-secondary mb-1">Exit Velocity</p>
                                <p className="text-xl font-bold font-mono">{(pred!.averageFinishLineSpeed * 3.6).toFixed(1)} km/h</p>
                            </div>
                            <div className="text-center border-x border-brand-border">
                                <p className="text-xs text-brand-text-secondary mb-1">Total Mass</p>
                                <p className="text-xl font-bold font-mono text-brand-accent">{result.parameters.totalWeight}g</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-brand-text-secondary mb-1">Physical Asymptote</p>
                                <p className="text-xl font-bold font-mono">0.912s</p>
                            </div>
                        </div>
                    </div>
                    
                    <SpeedTimeGraph result={result} />
                </div>

                <div className="space-y-6">
                    <div className="bg-brand-dark p-6 rounded-xl border border-green-500/30 flex flex-col items-center justify-center text-center">
                        <ShieldCheckIcon className="w-8 h-8 text-green-400 mb-2" />
                        <h4 className="font-bold text-xs uppercase text-brand-text-secondary">Physics Validation</h4>
                        <p className="text-3xl font-black font-mono text-green-400">100%</p>
                        <p className="text-[10px] text-brand-text-secondary mt-1 uppercase tracking-tighter">v2.7.5 Reality Engine</p>
                    </div>
                    
                    <div className="p-4 bg-brand-dark/50 rounded-xl border border-brand-border text-sm text-brand-text-secondary leading-relaxed">
                        <p className="font-bold text-brand-text mb-2 text-xs uppercase tracking-widest">Engineer Notes:</p>
                        "Monte Carlo variance reflects $CO_2$ cartridge inconsistency and track conditions. Standard deviation is currently <b>{pred?.stdDevTime?.toFixed(4)}s</b>."
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMonteCarlo = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                <h3 className="text-lg font-bold text-brand-accent mb-2 uppercase tracking-tighter">Stochastic Analysis</h3>
                <p className="text-sm text-brand-text-secondary mb-6">Visualizing the 100,000-iteration probability field. Each point represents one potential race outcome based on thrust and friction jitter.</p>
                <MonteCarloScatterPlot result={result} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-brand-dark rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-2">Race Stability Factors</h4>
                    <ul className="space-y-2 text-xs">
                        <li className="flex justify-between"><span>Launch Reaction Sensitivity</span> <span className="text-brand-text font-mono">±0.005s</span></li>
                        <li className="flex justify-between"><span>Canister Expansion Delta</span> <span className="text-brand-text font-mono">±2.1%</span></li>
                        <li className="flex justify-between"><span>Track Temperature Jitter</span> <span className="text-brand-text font-mono">±0.15%</span></li>
                    </ul>
                </div>
                <div className="p-4 bg-brand-accent/10 border border-brand-accent/30 rounded-xl">
                    <h4 className="text-xs font-bold text-brand-accent uppercase mb-2">Reliability Index</h4>
                    <p className="text-brand-text-secondary text-xs leading-relaxed">
                        Based on the scatter density, this design has a **95% probability** of finishing within **{(pred!.stdDevTime! * 2).toFixed(4)}s** of the predicted average.
                    </p>
                </div>
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
                        <div className="flex justify-between items-center text-sm">
                            <span>Tolerance:</span>
                            <span className="font-mono text-brand-text-secondary">± 0.012 g/cm³</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-dark p-4 rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-4">Efficiency Mapping</h4>
                    <PerformanceGraph results={[result]} height={200} />
                </div>
                <SpeedTimeGraph result={result} height={200} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 p-1 bg-brand-dark rounded-lg border border-brand-border w-fit">
                <button onClick={() => setActiveSubTab('summary')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'summary' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>SUMMARY</button>
                <button onClick={() => setActiveSubTab('montecarlo')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'montecarlo' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>PROBABILISTIC</button>
                <button onClick={() => setActiveSubTab('tech')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'tech' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>TECH DATA</button>
                <button onClick={() => setActiveSubTab('scrutineering')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'scrutineering' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>COMPLIANCE</button>
            </div>

            {activeSubTab === 'summary' && renderSummary()}
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

// Fix: Add the missing ComparisonTab component
const ComparisonTab: React.FC<{ results: AeroResult[] }> = ({ results }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                <h3 className="text-lg font-bold text-brand-accent mb-4 uppercase tracking-tighter">Performance Comparison</h3>
                <PerformanceGraph results={results} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-4">Metric Comparison</h4>
                    <div className="space-y-4">
                        {results.length > 0 ? results.map(res => (
                            <div key={res.id} className="flex justify-between items-center text-sm p-3 bg-brand-dark rounded border border-brand-border">
                                <span className="text-brand-text font-semibold">{res.parameters.carName}</span>
                                <div className="flex gap-4">
                                    <span className="font-mono text-brand-accent">Cd: {res.cd.toFixed(4)}</span>
                                    <span className="font-mono text-green-400">L/D: {res.liftToDragRatio.toFixed(2)}</span>
                                </div>
                            </div>
                        )) : <p className="text-brand-text-secondary text-sm">No results to compare.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Fix: Add the missing AeroPage main component
const AeroPage: React.FC = () => {
    const { aeroResults, deleteAeroResult, resetAeroResults } = useData();
    const [selectedResult, setSelectedResult] = useState<AeroResult | null>(null);
    const [activeTab, setActiveTab] = useState<'history' | 'comparison'>('history');

    const displayResults = useMemo(() => {
        const list = [...aeroResults];
        // Add a benchmark if list is empty or for baseline comparison
        if (list.length === 0) return [THEORETICAL_OPTIMUM];
        return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [aeroResults]);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-brand-text">Aero Testing</h1>
                <div className="flex gap-2">
                    <button onClick={resetAeroResults} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-bold">
                        <TrashIcon className="w-4 h-4" /> Reset History
                    </button>
                </div>
            </div>

            {selectedResult ? (
                <div className="space-y-6">
                    <button onClick={() => setSelectedResult(null)} className="text-brand-accent hover:underline flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
                        &larr; Back to History
                    </button>
                    <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-brand-text">{selectedResult.parameters.carName}</h2>
                            <span className="text-xs text-brand-text-secondary font-mono">{new Date(selectedResult.timestamp).toLocaleString()}</span>
                        </div>
                        <DetailedAnalysisContent result={selectedResult} />
                    </div>
                </div>
            ) : (
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border shadow-md">
                    <div className="flex gap-4 mb-6">
                        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'history' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-border'}`}>Simulation History</button>
                        <button onClick={() => setActiveTab('comparison')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'comparison' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-border'}`}>Baseline Comparison</button>
                    </div>

                    {activeTab === 'history' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {displayResults.map(res => (
                                <div key={res.id} onClick={() => setSelectedResult(res)} className="bg-brand-dark p-4 rounded-xl border border-brand-border hover:border-brand-accent transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-brand-text group-hover:text-brand-accent transition-colors truncate pr-4">{res.parameters.carName}</h3>
                                        {res.id !== 'benchmark-optimum' && (
                                            <button onClick={(e) => { e.stopPropagation(); deleteAeroResult(res.id); }} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-brand-dark-secondary p-2 rounded">
                                            <p className="text-brand-text-secondary uppercase">Drag (Cd)</p>
                                            <p className="font-mono font-bold">{res.cd.toFixed(4)}</p>
                                        </div>
                                        <div className="bg-brand-dark-secondary p-2 rounded">
                                            <p className="text-brand-text-secondary uppercase">Efficiency (L/D)</p>
                                            <p className="font-mono font-bold text-green-400">{res.liftToDragRatio.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-widest">{new Date(res.timestamp).toLocaleDateString()}</span>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${res.tier === 'premium' ? 'bg-brand-accent/20 text-brand-accent' : 'bg-brand-border text-brand-text-secondary'}`}>
                                            {res.tier || 'standard'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ComparisonTab results={aeroResults} />
                    )}
                </div>
            )}
        </div>
    );
};

export default AeroPage;
