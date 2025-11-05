import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useData } from '../../contexts/AppContext';
import { runVirtualGrandPrixSimulation } from '../../services/simulationService';
import { generateAeroSuggestions, performScrutineering } from '../../services/localSimulationService';
import { extractParametersFromFileName } from '../../services/fileAnalysisService';
import { AeroResult, DesignParameters } from '../../types';
import { WindIcon, TrophyIcon, BeakerIcon, LightbulbIcon, FileTextIcon, UploadCloudIcon, BarChartIcon, StopwatchIcon } from '../../components/icons';
import ErrorBoundary from '../../components/ErrorBoundary';
import Modal from '../../components/shared/Modal';

// Add new icons for the page
// FIX: Corrected typo in viewBox attribute (was "0 0 24" 24", is now "0 0 24 24").
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9"x2="15" y2="15"/></svg>
);
const SpeedometerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg>
)

const SimulationProgressModal: React.FC<{ progressData: { stage: string; progress: number; logs: string[] } | null }> = ({ progressData }) => {
    if (!progressData) return null;

    const { stage, progress, logs } = progressData;
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-brand-dark-secondary rounded-xl shadow-2xl w-full max-w-2xl border border-brand-border">
                <div className="p-4 border-b border-brand-border">
                    <h2 className="text-xl font-bold text-brand-accent">Virtual GP Simulation in Progress</h2>
                    <p className="text-sm text-brand-text-secondary">This process is computationally intensive and will take a few minutes.</p>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-md font-semibold text-brand-text">{stage}</span>
                            <span className="text-md font-bold text-brand-text-secondary">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-brand-dark rounded-full h-4 border border-brand-border">
                            <div className="bg-brand-accent h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-brand-dark p-3 rounded-md border border-brand-border h-48 overflow-y-auto font-mono text-sm text-brand-text-secondary">
                        {logs.map((log, index) => (
                            <p key={index} className="animate-fade-in">{`> ${log}`}</p>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                    {progress === 100 && stage === 'Complete' && (
                        <div className="text-center mt-4 text-green-400 font-semibold animate-fade-in">
                            Simulation complete! Finalizing results...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

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

        return (
            <div className="space-y-4">
                <div className="text-center bg-brand-dark p-4 rounded-lg">
                    <p className="text-sm text-brand-text-secondary">Average Race Time (10,000 Races)</p>
                    <p className="text-5xl font-bold text-brand-accent font-mono tracking-tighter">{pred.averageRaceTime != null ? `${pred.averageRaceTime.toFixed(3)}s` : 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">Best Time</p><p className="text-2xl font-bold text-green-400 font-mono">{pred.bestRaceTime != null ? `${pred.bestRaceTime.toFixed(3)}s` : 'N/A'}</p></div>
                    <div className="p-4 bg-red-500/10 rounded-lg"><p className="text-sm text-red-300">Worst Time</p><p className="text-2xl font-bold text-red-400 font-mono">{pred.worstRaceTime != null ? `${pred.worstRaceTime.toFixed(3)}s` : 'N/A'}</p></div>
                    <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Avg Drag (Cd)</p><p className="text-2xl font-bold text-brand-text font-mono">{pred.averageDrag != null ? pred.averageDrag.toFixed(4) : 'N/A'}</p></div>
                    <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Avg Top Speed</p><p className="text-2xl font-bold text-brand-text font-mono">{pred.averageTopSpeed != null ? `${pred.averageTopSpeed.toFixed(2)} m/s` : 'N/A'}</p></div>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Analysis: ${result.parameters.carName}`}>
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
                                <th key={r.id} className="text-center p-2 font-semibold truncate" title={r.parameters.carName}>{r.parameters.carName}</th>
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

const AeroPage: React.FC = () => {
  const { aeroResults, addAeroResult } = useData();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState<{ stage: string; progress: number; logs: string[] } | null>(null);
  const [selectedResult, setSelectedResult] = useState<AeroResult | null>(null);
  const [carName, setCarName] = useState('BR-04-Alpha');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comparisonIds, setComparisonIds] = useState<Set<string>>(new Set());

  const bestResultId = useMemo(() => {
    if (aeroResults.length === 0) return null;
    // Best result is the one with the fastest average race time.
    return aeroResults.reduce((best, current) => {
        if (!best.raceTimePrediction) return current;
        if (!current.raceTimePrediction) return best;
        return current.raceTimePrediction.averageRaceTime < best.raceTimePrediction.averageRaceTime ? current : best;
    }).id;
  }, [aeroResults]);

  const comparisonResults = useMemo(() => {
    // Preserve original sort order from aeroResults for consistency
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const handleSimulate = async () => {
    if (!file || !carName.trim()) {
        alert("Please provide a design name and a STEP file.");
        return;
    }
    setIsSimulating(true);
    setSimulationProgress({ stage: 'Preparing...', progress: 0, logs: ['Simulation requested...'] });
    try {
        const onProgress = (update: { stage: string; progress: number; log?: string }) => {
            setSimulationProgress(prev => {
                const newLogs = [...(prev?.logs || [])];
                if (update.log && newLogs[newLogs.length - 1] !== update.log) {
                    newLogs.push(update.log);
                }
                return {
                    stage: update.stage,
                    progress: update.progress,
                    logs: newLogs.slice(-10) // Keep log from getting too long
                };
            });
        };

        const extractedParams = extractParametersFromFileName(file.name);
        const designParameters: DesignParameters = {
            carName,
            ...extractedParams,
        };
        
        const simResultData = await runVirtualGrandPrixSimulation(designParameters, onProgress);
        
        const tempResultForAnalysis: AeroResult = {
            ...simResultData,
            id: 'temp',
            fileName: file.name
        };
        const suggestions = generateAeroSuggestions(tempResultForAnalysis);
        const scrutineeringReport = performScrutineering(designParameters);
        
        const finalResult: Omit<AeroResult, 'id'> = {
            ...simResultData,
            fileName: file.name,
            suggestions,
            scrutineeringReport
        };
        
        addAeroResult(finalResult);
        setFile(null);
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Pause on completion

    } catch (error) {
        console.error("Simulation failed", error);
        alert("Simulation failed. Please check the console.");
    } finally {
        setIsSimulating(false);
        setSimulationProgress(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-brand-text">Aero Analysis & Scrutineering</h1>
      {isSimulating && <SimulationProgressModal progressData={simulationProgress} />}
      
      {comparisonResults.length >= 2 && (
          <AeroComparison results={comparisonResults} onClear={clearComparison} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <ErrorBoundary>
                <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full">
                    <h2 className="text-xl font-bold text-brand-text mb-4">New VGP Simulation</h2>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSimulate(); }}>
                        <div>
                            <label htmlFor="carName" className="text-sm font-semibold text-brand-text-secondary">Design Iteration Name</label>
                            <input
                                type="text"
                                id="carName"
                                value={carName}
                                onChange={(e) => setCarName(e.target.value)}
                                className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-brand-text-secondary">Upload STEP File</label>
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={openFileExplorer}
                                className={`mt-1 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${dragActive ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border hover:border-brand-accent'}`}
                            >
                                <input ref={fileInputRef} type="file" className="hidden" accept=".step,.stp" onChange={handleFileChange} />
                                <UploadCloudIcon className="w-10 h-10 mx-auto text-brand-text-secondary mb-2" />
                                {file ? (
                                    <p className="text-brand-accent font-semibold">{file.name}</p>
                                ) : (
                                    <p className="text-brand-text-secondary">Drag & drop your file here or click to browse</p>
                                )}
                                <p className="text-xs text-brand-text-secondary/50 mt-1">Accepted formats: .step, .stp</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSimulating || !file || !carName.trim()}
                            className="w-full mt-4 bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-text-secondary disabled:text-brand-dark flex items-center justify-center"
                        >
                           <WindIcon className="w-5 h-5 mr-2" /> Start VGP Analysis
                        </button>
                    </form>
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
                                      {result.parameters.carName}
                                  </p>
                                  <p className="text-xs text-brand-text-secondary">{new Date(result.timestamp).toLocaleString()}</p>
                                </div>
                              </div>

                              <div onClick={() => setSelectedResult(result)} className="flex items-center gap-4 text-sm text-center cursor-pointer w-full sm:w-auto justify-end mt-2 sm:mt-0">
                                <div>
                                    <p className="font-semibold text-brand-text-secondary text-xs">Avg. Race Time</p>
                                    <p className="font-bold text-brand-text text-lg">{result.raceTimePrediction?.averageRaceTime != null ? `${result.raceTimePrediction.averageRaceTime.toFixed(3)}s` : 'N/A'}</p>
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
                              <p className="text-sm">Upload a STEP file to get started.</p>
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
