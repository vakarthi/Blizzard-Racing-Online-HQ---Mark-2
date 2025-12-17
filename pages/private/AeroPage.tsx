
import React, { useState, useRef, useEffect, useMemo, DragEvent } from 'react';
import { useData } from '../../contexts/AppContext';
import { AeroResult, ProbabilisticRaceTimePrediction, BackgroundTask } from '../../types';
import { WindIcon, TrophyIcon, BeakerIcon, LightbulbIcon, FileTextIcon, BarChartIcon, StopwatchIcon, UploadCloudIcon, SparklesIcon, CheckCircleIcon, XCircleIcon, VideoIcon, FileCheckIcon, AlertTriangleIcon, ShieldCheckIcon, ShieldAlertIcon, InfoIcon, ScaleIcon, CommandIcon, SettingsIcon } from '../../components/icons';
import ErrorBoundary from '../../components/ErrorBoundary';
import Modal from '../../components/shared/Modal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import FlowFieldVisualizer from '../../components/hq/FlowFieldVisualizer';
import PerformanceGraph from '../../components/hq/PerformanceGraph';
import { THEORETICAL_OPTIMUM } from '../../services/mockData';


const DetailedAnalysisModal: React.FC<{ result: AeroResult; bestResult: AeroResult | null; onClose: () => void }> = ({ result, bestResult, onClose }) => {
    const [activeTab, setActiveTab] = useState('prediction');
    const isBenchmark = result.id === 'benchmark-optimum';

    const renderScrutineering = () => {
        if (!result.scrutineeringReport && !isBenchmark) return <div className="text-center p-8 text-brand-text-secondary">No scrutineering report available.</div>;
        if (isBenchmark) return <div className="text-center p-8 text-brand-accent italic font-bold">Benchmark car is mathematically perfect and bypasses manual scrutineering.</div>;
        
        return (
            <div className="space-y-3">
                {result.scrutineeringReport?.map(item => (
                    <div key={item.ruleId} className={`p-3 rounded-lg border ${item.status === 'PASS' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <div className="flex items-center justify-between font-semibold">
                            <div className="flex items-center">
                                {item.status === 'PASS' ? <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> : <XCircleIcon className="w-5 h-5 text-red-400 mr-2" />}
                                <span className={item.status === 'PASS' ? 'text-green-300' : 'text-red-300'}>{item.ruleId}: {item.description}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.status === 'PASS' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{item.status}</span>
                        </div>
                        <div className="text-sm pl-7 mt-1">
                            <p className={item.status === 'PASS' ? 'text-brand-text-secondary' : 'text-red-300'}>{item.notes}</p>
                            <p className="text-gray-500 font-mono text-xs">Value: {item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderSuggestions = () => {
        if (isBenchmark) return <div className="text-center p-8 text-brand-text-secondary">This is the theoretical limit. No further improvements are possible within current physics model.</div>;
        if (!result.suggestions) return <div className="text-center p-8 text-brand-text-secondary">No suggestions were generated for this run.</div>;
        return <div className="prose prose-sm max-w-none prose-invert" dangerouslySetInnerHTML={{__html: result.suggestions.replace(/\n/g, '<br />')}} />;
    };
    
    const renderBenchmarking = () => {
        const benchmark = THEORETICAL_OPTIMUM;
        if (!result.raceTimePrediction) return null;
        
        const currentAvgTime = result.raceTimePrediction.averageRaceTime;
        const limitAvgTime = benchmark.raceTimePrediction!.averageRaceTime;
        const deltaToLimit = currentAvgTime - limitAvgTime;

        return (
            <div className="mt-6 border-t border-brand-border pt-6 animate-fade-in">
                <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center">
                    <CommandIcon className="w-5 h-5 mr-2 text-yellow-400"/> 
                    Delta to Theoretical Perfection (Ω-OPTIMUM)
                </h3>
                
                <div className="bg-brand-dark border border-yellow-500/30 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-brand-text-secondary">Time Gap to Perfect:</span>
                        <span className="text-xl font-mono font-bold text-yellow-400">+{deltaToLimit.toFixed(3)}s</span>
                    </div>
                    <div className="w-full bg-brand-surface rounded-full h-1.5 mt-3">
                        <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${Math.max(5, 100 - (deltaToLimit * 500))}%` }}></div>
                    </div>
                    <p className="text-[10px] text-brand-text-secondary mt-2 text-right uppercase tracking-widest font-bold">Optimization Score</p>
                </div>
            </div>
        );
    };

    const renderRaceAnalysis = () => {
        if (!result.raceTimePrediction) return <div className="text-center p-8 text-brand-text-secondary">Race time prediction not available for this run.</div>;
        const pred = result.raceTimePrediction;
        const toFixedSafe = (val: number | undefined, digits: number) => (val != null ? val.toFixed(digits) : 'N/A');

        return (
            <div className="space-y-4">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">Best Time</p><p className="text-2xl font-bold text-green-400 font-mono">{toFixedSafe(pred.bestRaceTime, 3)}s</p></div>
                    <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Avg Time</p><p className="text-2xl font-bold text-brand-text font-mono">{toFixedSafe(pred.averageRaceTime, 3)}s</p></div>
                    <div className="p-4 bg-red-500/10 rounded-lg"><p className="text-sm text-red-300">Worst Time</p><p className="text-2xl font-bold text-red-400 font-mono">{toFixedSafe(pred.worstRaceTime, 3)}s</p></div>
                </div>
                {isBenchmark && (
                    <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Theoretical Solver Model</p>
                        <p className="text-brand-text font-mono">Regulation-Max V2.5 (Isentropic Limit)</p>
                    </div>
                )}
                <div className="text-center bg-brand-dark p-4 rounded-lg mt-4">
                    <p className="text-sm text-brand-text-secondary">Average Drag Coefficient (Cd)</p>
                    <p className="text-3xl font-bold text-brand-accent font-mono tracking-tighter">{toFixedSafe(pred.averageDrag, 4)}</p>
                </div>
                {!isBenchmark && renderBenchmarking()}
            </div>
        );
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Analysis: ${result.fileName}`}>
            <div className="flex border-b border-brand-border mb-4 overflow-x-auto">
                <button onClick={() => setActiveTab('prediction')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'prediction' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><StopwatchIcon className="w-4 h-4" /> Race Analysis</button>
                <button onClick={() => setActiveTab('curves')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'curves' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><BarChartIcon className="w-4 h-4" /> Curves</button>
                <button onClick={() => setActiveTab('analysis')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'analysis' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><BeakerIcon className="w-4 h-4" /> Aerodynamics</button>
                <button onClick={() => setActiveTab('suggestions')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'suggestions' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><LightbulbIcon className="w-4 h-4" /> Suggestions</button>
                <button onClick={() => setActiveTab('scrutineering')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'scrutineering' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><FileTextIcon className="w-4 h-4" /> Scrutineering</button>
            </div>
            <div className="relative">
                {activeTab === 'prediction' && renderRaceAnalysis()}
                {activeTab === 'curves' && (
                    <div className="space-y-4">
                        <p className="text-sm text-brand-text-secondary">Lift-to-Drag efficiency comparison.</p>
                        <PerformanceGraph results={[result]} />
                    </div>
                )}
                {activeTab === 'analysis' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Cd (Drag)</p><p className="text-2xl font-bold text-brand-text">{result.cd}</p></div>
                            <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Cl (Lift)</p><p className="text-2xl font-bold text-brand-text">{result.cl}</p></div>
                            <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">L/D Ratio</p><p className="text-2xl font-bold text-green-400">{result.liftToDragRatio}</p></div>
                            <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Aero Balance</p><p className="text-2xl font-bold text-brand-text">{result.aeroBalance}% F</p></div>
                        </div>
                        <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm font-semibold text-brand-text-secondary">Flow Analysis</p><p className="text-brand-text mt-1">{result.flowAnalysis}</p></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                             <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Mesh Quality</p><p className="text-2xl font-bold text-brand-text">{result.meshQuality}%</p></div>
                             <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Convergence</p><p className="text-2xl font-bold text-green-400">{result.convergenceStatus}</p></div>
                             <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Sim Time</p><p className="text-2xl font-bold text-brand-text">{result.simulationTime} s</p></div>
                        </div>
                    </div>
                )}
                {activeTab === 'suggestions' && renderSuggestions()}
                {activeTab === 'scrutineering' && renderScrutineering()}
            </div>
        </Modal>
    );
};

interface MetricDef {
  key: string;
  label: string;
  higherIsBetter?: boolean;
  format?: (v: any) => string;
}

const AeroComparison: React.FC<{ results: AeroResult[]; onClear: () => void; }> = ({ results, onClear }) => {
    const metrics: MetricDef[] = [
        { key: 'cd', label: 'Drag (Cd)', higherIsBetter: false, format: (v) => v.toFixed(4) },
        { key: 'cl', label: 'Lift (Cl)', higherIsBetter: false, format: (v) => v.toFixed(4) },
        { key: 'liftToDragRatio', label: 'Efficiency (L/D)', higherIsBetter: true, format: (v) => v.toFixed(3) },
        { key: 'aeroBalance', label: 'Balance (%F)', format: (v) => `${v.toFixed(1)}%` },
        { key: 'avgRaceTime', label: 'Race Time (Avg)', higherIsBetter: false, format: (v) => `${v.toFixed(3)}s` },
        { key: 'exitSpeed', label: 'Exit Speed', higherIsBetter: true, format: (v) => `${v.toFixed(2)}m/s` },
        { key: 'avgSpeed', label: 'Track Speed', higherIsBetter: true, format: (v) => `${v.toFixed(2)}m/s` },
        { key: 'meshQuality', label: 'Mesh Reliability', higherIsBetter: true, format: (v) => `${v}%` },
        { key: 'launchVariance', label: 'Launch Stability', higherIsBetter: false, format: (v) => `${v.toFixed(1)}ms` },
        { key: 'residuals', label: 'Solver Precision', higherIsBetter: false, format: (v) => v.toExponential(1) },
    ];

    const getRawValue = (result: AeroResult, key: string) => {
        const pred = result.raceTimePrediction;
        switch (key) {
            case 'avgRaceTime': return pred?.averageRaceTime ?? Infinity;
            case 'exitSpeed': return pred?.averageFinishLineSpeed ?? 0;
            case 'avgSpeed': return pred?.averageSpeed ?? 0;
            case 'launchVariance': return pred?.launchVariance ?? Infinity;
            case 'residuals': return result.finalResiduals?.continuity ?? Infinity;
            case 'aeroBalance': return Math.abs(50 - (result.aeroBalance || 50)); // Lower diff is better
            default: return (result as any)[key] ?? 0;
        }
    };

    const winningMap = useMemo(() => {
        const winners: Record<string, string> = {};
        metrics.forEach(m => {
            const vals = results.map(r => ({ id: r.id, val: getRawValue(r, m.key) }));
            if (m.key === 'aeroBalance') {
                // Special case: lower difference from 50 is better
                const best = vals.reduce((prev, curr) => prev.val < curr.val ? prev : curr);
                winners[m.key] = best.id;
            } else if (m.higherIsBetter) {
                const best = vals.reduce((prev, curr) => prev.val > curr.val ? prev : curr);
                winners[m.key] = best.id;
            } else {
                const best = vals.reduce((prev, curr) => prev.val < curr.val ? prev : curr);
                winners[m.key] = best.id;
            }
        });
        return winners;
    }, [results]);

    return (
        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border animate-fade-in space-y-6">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-brand-text flex items-center gap-3"><BarChartIcon className="w-6 h-6 text-brand-accent"/> High-Fidelity Comparison</h2>
                 <button onClick={onClear} className="text-sm font-semibold text-brand-accent hover:underline">Clear Selection</button>
            </div>

            <div className="bg-brand-dark p-4 rounded-lg border border-brand-border">
                <h3 className="text-sm font-bold text-brand-text-secondary mb-4 flex items-center gap-2">
                    <WindIcon className="w-4 h-4"/> Multi-Car Efficiency Mapping
                </h3>
                <PerformanceGraph results={results} height={240} />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr className="border-b-2 border-brand-border">
                            <th className="text-left p-2 font-semibold text-brand-text-secondary">Ω-Metric</th>
                            {results.map(r => (
                                <th key={r.id} className={`text-center p-2 font-semibold truncate ${r.id === 'benchmark-optimum' ? 'text-yellow-400' : ''}`} title={r.fileName}>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs uppercase opacity-60 tracking-widest">{r.tier || 'Car'}</span>
                                        <span>{r.fileName}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map(metric => (
                            <tr key={metric.key} className="border-b border-brand-border/50 group">
                                <td className="p-2 font-semibold text-brand-text-secondary group-hover:text-brand-accent transition-colors">{metric.label}</td>
                                {results.map(r => {
                                    const isWinner = winningMap[metric.key] === r.id;
                                    const raw = getRawValue(r, metric.key);
                                    // Format correctly for display (undo balance diff if needed)
                                    const displayVal = metric.key === 'aeroBalance' ? r.aeroBalance : raw;
                                    
                                    return (
                                        <td key={`${r.id}-${metric.key}`} className={`text-center p-2 font-mono transition-all duration-300 ${
                                            isWinner 
                                            ? 'text-green-400 bg-green-500/10 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]' 
                                            : 'text-brand-text'
                                        }`}>
                                            <div className="flex items-center justify-center gap-1">
                                                {isWinner && <CheckCircleIcon className="w-3 h-3 text-green-500" />}
                                                {metric.format ? metric.format(displayVal) : displayVal}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-brand-text-secondary uppercase tracking-widest bg-brand-dark/50 p-2 rounded border border-brand-border/50">
                <InfoIcon className="w-3 h-3 text-brand-accent" />
                Emerald highlights indicate superior performance in that specific metric across compared vehicles.
            </div>
        </div>
    );
};

const AeroPage: React.FC = () => {
  const { aeroResults, runSimulationTask, backgroundTasks } = useData();
  const [selectedResult, setSelectedResult] = useState<AeroResult | null>(null);
  const [stepFile, setStepFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comparisonIds, setComparisonIds] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<'speed' | 'accuracy'>('speed');
  const [showBenchmark, setShowBenchmark] = useState(false);
  
  const resultsWithBenchmark = useMemo(() => {
    return showBenchmark ? [THEORETICAL_OPTIMUM, ...aeroResults] : aeroResults;
  }, [aeroResults, showBenchmark]);

  const runningSimulations = backgroundTasks.filter(t => t.type === 'simulation' && t.status === 'running');
  
  const handleSimulate = async () => {
    if (!stepFile) {
        alert("Please upload a STEP file to simulate.");
        return;
    }
    runSimulationTask(stepFile, mode);
    setStepFile(null);
  };

  const comparisonResults = useMemo(() => {
    const list = aeroResults.filter(r => comparisonIds.has(r.id));
    if (comparisonIds.has('benchmark-optimum')) {
        list.unshift(THEORETICAL_OPTIMUM);
    }
    return list;
  }, [aeroResults, comparisonIds]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-text">Aerotest Simulation Suite</h1>
        <button 
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${showBenchmark ? 'bg-yellow-500 text-brand-dark border-yellow-400 shadow-glow-accent' : 'bg-brand-dark border-brand-border text-brand-text-secondary'}`}
        >
            <CommandIcon className="w-4 h-4" />
            {showBenchmark ? 'Ω-OPTIMUM Active' : 'View Theoretical limit'}
        </button>
      </div>
      
      {comparisonResults.length >= 2 && (
          <AeroComparison results={comparisonResults} onClear={() => setComparisonIds(new Set())} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full flex flex-col">
                <h2 className="text-xl font-bold text-brand-text mb-4">New Simulation</h2>
                
                <div className="mb-4">
                    <label className="text-sm font-semibold text-brand-text-secondary block mb-2">Simulation Mode</label>
                    <div className="flex bg-brand-dark p-1 rounded-lg border border-brand-border">
                         <button onClick={() => setMode('speed')} className={`flex-1 p-2 rounded-md text-sm font-bold transition-colors ${mode === 'speed' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>Speed</button>
                         <button onClick={() => setMode('accuracy')} className={`flex-1 p-2 rounded-md text-sm font-bold transition-colors ${mode === 'accuracy' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>Accuracy</button>
                    </div>
                </div>
                
                <div 
                    onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) setStepFile(e.dataTransfer.files[0]); }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-grow flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragOver ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border hover:border-brand-accent/50'}`}
                >
                    <UploadCloudIcon className="w-12 h-12 text-brand-text-secondary mb-2" />
                    <p className="font-semibold text-brand-text text-center">
                        {stepFile ? stepFile.name : 'Drag & drop STEP file'}
                    </p>
                    <input type="file" ref={fileInputRef} onChange={(e) => setStepFile(e.target.files?.[0] || null)} accept=".step,.stp" className="hidden" />
                </div>
                <button
                    onClick={handleSimulate}
                    disabled={!stepFile || runningSimulations.length > 0}
                    className="w-full mt-4 bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors flex items-center justify-center disabled:opacity-50"
                >
                    <WindIcon className="w-5 h-5 mr-2" /> Run Simulation
                </button>
            </div>
        </div>

        <div className="lg:col-span-2">
            <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full">
              <h2 className="text-xl font-bold text-brand-text mb-4">Simulation History</h2>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {resultsWithBenchmark.map((result) => {
                    const isSelected = comparisonIds.has(result.id);
                    const isPerfect = result.id === 'benchmark-optimum';
                    return (
                      <div key={result.id} className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                            isPerfect ? 'bg-yellow-500/10 border-yellow-500/40 border-2 shadow-glow-accent' :
                            isSelected ? 'bg-brand-accent/10 border-brand-accent/50' : 'bg-brand-dark border-brand-border hover:border-brand-accent/30'
                        }`}
                      >
                          <div className="flex items-center gap-4 flex-grow">
                            <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => setComparisonIds(prev => {
                                    const next = new Set(prev);
                                    if (next.has(result.id)) next.delete(result.id); else next.add(result.id);
                                    return next;
                                })}
                                className="h-5 w-5 rounded border-brand-border text-brand-accent focus:ring-brand-accent bg-brand-dark"
                            />
                            <div onClick={() => setSelectedResult(result)} className="cursor-pointer">
                              <p className={`font-bold flex items-center gap-2 ${isPerfect ? 'text-yellow-400' : 'text-brand-text'}`}>
                                  {isPerfect && <SparklesIcon className="w-4 h-4" />}
                                  {result.fileName}
                                  {isPerfect && <span className="text-[10px] bg-yellow-500/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">Target</span>}
                              </p>
                              <p className="text-xs text-brand-text-secondary">{isPerfect ? 'Mathematical Limit' : new Date(result.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <div onClick={() => setSelectedResult(result)} className="flex items-center gap-6 text-sm font-mono cursor-pointer">
                             <div className="text-center">
                                <p className="text-[10px] text-brand-text-secondary uppercase">Cd</p>
                                <p className="font-bold">{result.cd.toFixed(4)}</p>
                             </div>
                             <div className="text-center">
                                <p className="text-[10px] text-brand-text-secondary uppercase">L/D</p>
                                <p className="font-bold text-green-400">{result.liftToDragRatio.toFixed(3)}</p>
                             </div>
                          </div>
                      </div>
                    )
                  })}
              </div>
            </div>
        </div>
      </div>
      {selectedResult && <DetailedAnalysisModal result={selectedResult} bestResult={null} onClose={() => setSelectedResult(null)} />}
    </div>
  );
};

export default AeroPage;
