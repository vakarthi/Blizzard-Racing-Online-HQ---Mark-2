

import React, { useState, useRef, useEffect, useMemo, DragEvent } from 'react';
import { useData } from '../../contexts/AppContext';
import { AeroResult, ProbabilisticRaceTimePrediction, BackgroundTask } from '../../types';
import { WindIcon, TrophyIcon, BeakerIcon, LightbulbIcon, FileTextIcon, BarChartIcon, StopwatchIcon, UploadCloudIcon, SparklesIcon, CheckCircleIcon, XCircleIcon } from '../../components/icons';
import ErrorBoundary from '../../components/ErrorBoundary';
import Modal from '../../components/shared/Modal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';


const DetailedAnalysisModal: React.FC<{ result: AeroResult; onClose: () => void }> = ({ result, onClose }) => {
    const [activeTab, setActiveTab] = useState('prediction');

    const renderScrutineering = () => {
        if (!result.scrutineeringReport) return <div className="text-center p-8 text-brand-text-secondary">No scrutineering report available.</div>;
        return (
            <div className="space-y-3">
                {result.scrutineeringReport.map(item => (
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
        if (!result.suggestions) return <div className="text-center p-8 text-brand-text-secondary">No suggestions were generated for this run.</div>;
        return <div className="prose prose-sm max-w-none prose-invert" dangerouslySetInnerHTML={{__html: result.suggestions.replace(/\n/g, '<br />')}} />;
    };
    
    const renderRaceAnalysis = () => {
        if (!result.raceTimePrediction) return <div className="text-center p-8 text-brand-text-secondary">Race time prediction not available for this run.</div>;
        const pred = result.raceTimePrediction;
        const toFixedSafe = (val: number | undefined, digits: number) => (val != null ? val.toFixed(digits) : 'N/A');
        const thrustVersion = result.thrustModel === 'pro-competition' ? '5.3' : result.thrustModel === 'competition' ? '5.2' : '5.1';

        return (
            <div className="space-y-4">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">Best Time</p><p className="text-2xl font-bold text-green-400 font-mono">{toFixedSafe(pred.bestRaceTime, 3)}s</p></div>
                    <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Avg Time</p><p className="text-2xl font-bold text-brand-text font-mono">{toFixedSafe(pred.averageRaceTime, 3)}s</p></div>
                    <div className="p-4 bg-red-500/10 rounded-lg"><p className="text-sm text-red-300">Worst Time</p><p className="text-2xl font-bold text-red-400 font-mono">{toFixedSafe(pred.worstRaceTime, 3)}s</p></div>
                    <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">Best Finish Speed</p><p className="text-2xl font-bold text-green-400 font-mono">{toFixedSafe(pred.bestFinishLineSpeed, 2)} m/s</p></div>
                    <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Avg Finish Speed</p><p className="text-2xl font-bold text-brand-text font-mono">{toFixedSafe(pred.averageFinishLineSpeed, 2)} m/s</p></div>
                    <div className="p-4 bg-red-500/10 rounded-lg"><p className="text-sm text-red-300">Worst Finish Speed</p><p className="text-2xl font-bold text-red-400 font-mono">{toFixedSafe(pred.worstFinishLineSpeed, 2)} m/s</p></div>
                </div>
                {result.tier === 'premium' && pred.launchVariance != null && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                         <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Launch Variance</p><p className="text-xl font-bold text-brand-text font-mono">±{toFixedSafe(pred.launchVariance, 1)} ms</p></div>
                         <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Track Sensitivity</p><p className="text-xl font-bold text-brand-text font-mono">±{toFixedSafe(pred.trackConditionSensitivity, 1)} ms</p></div>
                         <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Canister Delta</p><p className="text-xl font-bold text-brand-text font-mono">±{toFixedSafe(pred.canisterPerformanceDelta, 1)} ms</p></div>
                    </div>
                )}
                <div className="text-center bg-brand-dark p-4 rounded-lg mt-4">
                    <p className="text-sm text-brand-text-secondary">Average Drag Coefficient (Cd)</p>
                    <p className="text-3xl font-bold text-brand-accent font-mono tracking-tighter">{toFixedSafe(pred.averageDrag, 4)}</p>
                    {result.thrustModel && result.tier === 'premium' && (
                      <p className="text-xs text-brand-text-secondary mt-2">
                        Thrust Model: <span className="font-semibold capitalize">{result.thrustModel.replace('-', ' ')} (v{thrustVersion})</span>
                      </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Analysis: ${result.fileName}`}>
            <div className="flex border-b border-brand-border mb-4 overflow-x-auto">
                <button onClick={() => setActiveTab('prediction')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'prediction' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><StopwatchIcon className="w-4 h-4" /> Race Analysis</button>
                <button onClick={() => setActiveTab('analysis')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'analysis' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><BeakerIcon className="w-4 h-4" /> Aerodynamics</button>
                <button onClick={() => setActiveTab('suggestions')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'suggestions' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><LightbulbIcon className="w-4 h-4" /> Suggestions</button>
                <button onClick={() => setActiveTab('scrutineering')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'scrutineering' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><FileTextIcon className="w-4 h-4" /> Scrutineering</button>
            </div>
            <div>
                {activeTab === 'prediction' && renderRaceAnalysis()}
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
                             <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Convergence</p><p className={`text-2xl font-bold ${result.convergenceStatus === 'Converged' ? 'text-green-400' : 'text-red-400'}`}>{result.convergenceStatus}</p></div>
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

const AeroComparison: React.FC<{ results: AeroResult[]; onClear: () => void; }> = ({ results, onClear }) => {
    const bestValues = useMemo(() => ({
        liftToDragRatio: Math.max(...results.map(r => r.liftToDragRatio)),
        cl: Math.max(...results.map(r => r.cl)),
        cd: Math.min(...results.map(r => r.cd)),
        aeroBalance: results.reduce((best, current) => 
            (Math.abs(current.aeroBalance - 50) < Math.abs(best.aeroBalance - 50) ? current : best), results[0]
        ).aeroBalance,
    }), [results]);

    const metrics: { key: keyof AeroResult; label: string; higherIsBetter?: boolean }[] = [
        { key: 'liftToDragRatio', label: 'L/D Ratio', higherIsBetter: true },
        { key: 'cd', label: 'Drag (Cd)', higherIsBetter: false },
        { key: 'cl', label: 'Lift (Cl)', higherIsBetter: true },
        { key: 'aeroBalance', label: 'Aero Balance (% F)' },
        { key: 'convergenceStatus', label: 'Convergence' },
        { key: 'simulationTime', label: 'Sim Time (s)' },
    ];

    return (
        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-brand-text flex items-center gap-3"><BarChartIcon className="w-6 h-6 text-brand-accent"/> Comparison Analysis</h2>
                 <button onClick={onClear} className="text-sm font-semibold text-brand-accent hover:underline">Clear Selection</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-sm">
                    <thead>
                        <tr className="border-b-2 border-brand-border">
                            <th className="text-left p-2 font-semibold text-brand-text-secondary">Metric</th>
                            {results.map(r => (
                                <th key={r.id} className="text-center p-2 font-semibold truncate" title={r.fileName}>{r.fileName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map(metric => (
                            <tr key={metric.key} className="border-b border-brand-border/50">
                                <td className="p-2 font-semibold text-brand-text-secondary">{metric.label}</td>
                                {results.map(r => {
                                    const value = r[metric.key as keyof AeroResult];
                                    let isBestValue = false;
                                    if (typeof value === 'number') {
                                        if (metric.key === 'aeroBalance') {
                                            isBestValue = value === bestValues.aeroBalance;
                                        } else if (metric.higherIsBetter) {
                                            isBestValue = value === bestValues[metric.key as keyof typeof bestValues];
                                        } else {
                                            isBestValue = value === bestValues[metric.key as keyof typeof bestValues];
                                        }
                                    }

                                    return (
                                        <td key={`${r.id}-${metric.key}`} className={`text-center p-2 font-mono ${isBestValue ? 'text-green-400 font-bold' : 'text-brand-text'}`}>
                                            {typeof value === 'number' ? value.toFixed(3) : String(value)}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const RunningSimulation: React.FC<{ task: BackgroundTask }> = ({ task }) => {
    return (
        <div className="bg-brand-dark p-4 rounded-lg border border-brand-border">
            <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-brand-text truncate pr-4">{task.fileName}</p>
                <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                    <LoadingSpinner />
                    <span>Running...</span>
                </div>
            </div>
            <div className="mb-2">
                <div className="flex justify-between items-baseline mb-1 text-sm">
                    <span className="font-semibold text-brand-text-secondary">{task.stage}</span>
                    <span className="font-bold text-brand-text-secondary">{task.progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-brand-surface rounded-full h-2.5 border border-brand-border/50">
                    <div className="bg-brand-accent h-full rounded-full transition-all duration-500" style={{ width: `${task.progress}%` }}></div>
                </div>
            </div>
            {task.latestLog && (
                <p className="font-mono text-xs text-brand-text-secondary mt-2 truncate">{`> ${task.latestLog}`}</p>
            )}
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
  const [tier, setTier] = useState<'standard' | 'premium'>('standard');
  const [thrustModel, setThrustModel] = useState<'standard' | 'competition' | 'pro-competition'>('standard');
  
  const runningSimulations = backgroundTasks.filter(t => t.type === 'simulation' && t.status === 'running');
  const isSimulating = runningSimulations.length > 0;
  
  useEffect(() => {
    // Reset thrust model if switching back to standard tier
    if (tier === 'standard') {
      setThrustModel('standard');
    }
  }, [tier]);
  
  const handleFileChange = (file: File | null) => {
    if (file && (file.name.toLowerCase().endsWith('.step') || file.name.toLowerCase().endsWith('.stp'))) {
        setStepFile(file);
    } else if (file) {
        alert("Invalid file type. Please upload a .STEP or .STP file.");
    }
  };

  const handleDragEvents = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragOver(true);
    } else if (e.type === 'dragleave') {
        setIsDragOver(false);
    }
  };
  
  const handleDrop = (e: DragEvent) => {
    handleDragEvents(e);
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const bestResultId = useMemo(() => {
    if (aeroResults.length === 0) return null;
    return aeroResults.reduce((best, current) => {
        const bestTime = best.raceTimePrediction?.averageRaceTime ?? Infinity;
        const currentTime = current.raceTimePrediction?.averageRaceTime ?? Infinity;
        return currentTime < bestTime ? current : best;
    }).id;
  }, [aeroResults]);

  const comparisonResults = useMemo(() => {
    return aeroResults.filter(r => comparisonIds.has(r.id));
  }, [aeroResults, comparisonIds]);
  
  const handleToggleComparison = (resultId: string) => {
    setComparisonIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(resultId)) {
            newSet.delete(resultId);
        } else {
            newSet.add(resultId);
        }
        return newSet;
    });
  };

  const clearComparison = () => {
      setComparisonIds(new Set());
  };

  const handleSimulate = async () => {
    if (!stepFile) {
        alert("Please upload a STEP file to simulate.");
        return;
    }
    runSimulationTask(stepFile, tier, thrustModel);
    setStepFile(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-brand-text">Aerotest Simulation Suite</h1>
      
      {comparisonResults.length >= 2 && (
          <AeroComparison results={comparisonResults} onClear={clearComparison} />
      )}
      
      {runningSimulations.length > 0 && (
        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border animate-fade-in">
            <h2 className="text-xl font-bold text-brand-text mb-4">Simulations in Progress</h2>
            <div className="space-y-4">
                {runningSimulations.map(task => <RunningSimulation key={task.id} task={task} />)}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <ErrorBoundary>
                <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full flex flex-col">
                    <h2 className="text-xl font-bold text-brand-text mb-4">New Simulation</h2>
                    
                    <div className="mb-4">
                        <label className="text-sm font-semibold text-brand-text-secondary block mb-2">Simulation Tier</label>
                        <div className="flex bg-brand-dark p-1 rounded-lg border border-brand-border">
                             <button onClick={() => setTier('standard')} className={`flex-1 p-2 rounded-md text-sm font-bold transition-colors ${tier === 'standard' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>Standard</button>
                             <button onClick={() => setTier('premium')} className={`flex-1 p-2 rounded-md text-sm font-bold transition-colors ${tier === 'premium' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>Premium</button>
                        </div>
                    </div>

                    {tier === 'premium' && (
                         <div className="mb-4 animate-fade-in">
                            <label className="text-sm font-semibold text-brand-text-secondary block mb-2">Thrust Model</label>
                            <div className="flex flex-col gap-1 bg-brand-dark p-1 rounded-lg border border-brand-border">
                                <button onClick={() => setThrustModel('standard')} className={`w-full p-2 rounded-md text-xs font-bold transition-colors ${thrustModel === 'standard' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>
                                    Standard (v5.1)
                                </button>
                                <button onClick={() => setThrustModel('competition')} className={`w-full p-2 rounded-md text-xs font-bold transition-colors ${thrustModel === 'competition' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>
                                    Competition (v5.2)
                                </button>
                                <button onClick={() => setThrustModel('pro-competition')} className={`w-full p-2 rounded-md text-xs font-bold transition-colors ${thrustModel === 'pro-competition' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>
                                    Pro Competition (v5.3)
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div 
                        onDragEnter={handleDragEvents}
                        onDragOver={handleDragEvents}
                        onDragLeave={handleDragEvents}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-grow flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragOver ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border hover:border-brand-accent/50'}`}
                    >
                        <UploadCloudIcon className="w-12 h-12 text-brand-text-secondary mb-2" />
                        <p className="font-semibold text-brand-text">
                            {stepFile ? 'File Selected:' : 'Drag & drop STEP file here'}
                        </p>
                        <p className="text-sm text-brand-text-secondary">
                           {stepFile ? stepFile.name : 'or click to browse'}
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                            accept=".step,.stp"
                            className="hidden"
                        />
                    </div>
                    {stepFile && <button onClick={() => setStepFile(null)} className="text-xs text-red-400 hover:underline text-center mt-2">Clear selection</button>}
                    <button
                        onClick={handleSimulate}
                        disabled={!stepFile}
                        className="w-full mt-4 bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-text-secondary disabled:text-brand-dark flex items-center justify-center"
                    >
                       <WindIcon className="w-5 h-5 mr-2" /> Run {tier === 'standard' ? 'Standard' : 'Premium'} Simulation
                    </button>
                </div>
            </ErrorBoundary>
        </div>

        <div className="lg:col-span-2">
            <ErrorBoundary>
                <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border">
                  <h2 className="text-xl font-bold text-brand-text mb-4">Simulation History</h2>
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                      {aeroResults.map((result) => {
                        const isSelected = comparisonIds.has(result.id);
                        const isBest = result.id === bestResultId;
                        const avgTime = result.raceTimePrediction?.averageRaceTime;
                        return (
                          <div key={result.id} className={`p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all gap-2 ${
                                isSelected ? 'bg-brand-accent/10 border-brand-accent/50 shadow-md' :
                                isBest ? 'bg-green-500/10 border-green-500/30' : 
                                'bg-brand-dark border-brand-border hover:border-brand-accent/30'
                            }`}
                          >
                              <div className="flex items-center w-full sm:w-auto">
                                <input 
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleComparison(result.id)}
                                    className="h-5 w-5 rounded border-brand-border text-brand-accent focus:ring-brand-accent bg-brand-dark mr-4 flex-shrink-0"
                                />
                                <div onClick={() => setSelectedResult(result)} className="cursor-pointer flex-grow">
                                  <p className="font-bold text-brand-text flex items-center">
                                      {isBest && <TrophyIcon className="w-4 h-4 text-yellow-400 mr-2" />}
                                      {result.fileName}
                                      {result.tier === 'premium' && <span className="ml-2 text-xs font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1"><SparklesIcon className="w-3 h-3" /> Premium</span>}
                                  </p>
                                  <p className="text-xs text-brand-text-secondary">{new Date(result.timestamp).toLocaleString()}</p>
                                </div>
                              </div>

                              <div onClick={() => setSelectedResult(result)} className="flex items-center gap-4 text-sm text-center cursor-pointer w-full sm:w-auto justify-end mt-2 sm:mt-0">
                                <div>
                                    <p className="font-semibold text-brand-text-secondary text-xs">Avg. Race Time</p>
                                    <p className="font-bold text-brand-text text-lg">{avgTime != null ? `${avgTime.toFixed(3)}s` : 'N/A'}</p>
                                </div>
                                <div className="w-px h-8 bg-brand-border mx-2"></div>
                                <div>
                                    <p className="font-semibold text-brand-text-secondary text-xs">L/D Ratio</p>
                                    <p className="font-bold text-brand-text text-lg">{result.liftToDragRatio}</p>
                                </div>
                              </div>
                          </div>
                        )
                      })}
                      {aeroResults.length === 0 && (
                          <div className="text-center p-8 text-brand-text-secondary">
                              <p>No simulations have been run yet.</p>
                              <p className="text-sm">Upload a STEP file to run your first analysis.</p>
                          </div>
                      )}
                  </div>
                </div>
            </ErrorBoundary>
        </div>
      </div>
      {selectedResult && <DetailedAnalysisModal result={selectedResult} onClose={() => setSelectedResult(null)} />}
    </div>
  );
};

export default AeroPage;