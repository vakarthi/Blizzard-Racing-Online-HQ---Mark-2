
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useData } from '../../contexts/AppContext';
import { AeroResult } from '../../types';
import { WindIcon, BeakerIcon, LightbulbIcon, FileTextIcon, BarChartIcon, StopwatchIcon, UploadCloudIcon, SparklesIcon, CheckCircleIcon, XCircleIcon, CommandIcon, InfoIcon, SettingsIcon, HistoryIcon, TrashIcon, AlertTriangleIcon } from '../../components/icons';
import Modal from '../../components/shared/Modal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PerformanceGraph from '../../components/hq/PerformanceGraph';
import { THEORETICAL_OPTIMUM } from '../../services/mockData';

// --- SUB-COMPONENTS ---

const MetricCard: React.FC<{ label: string; value: string | number; subValue?: string; color?: string }> = ({ label, value, subValue, color = 'text-brand-text' }) => (
    <div className="bg-brand-dark p-4 rounded-xl border border-brand-border">
        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-mono font-bold ${color}`}>{value}</p>
        {subValue && <p className="text-[10px] text-brand-text-secondary mt-1">{subValue}</p>}
    </div>
);

const DetailedAnalysisContent: React.FC<{ result: AeroResult }> = ({ result }) => {
    const [activeSubTab, setActiveSubTab] = useState('summary');
    const isBenchmark = result.id === 'benchmark-optimum';
    const pred = result.raceTimePrediction;

    const renderSummary = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Drag (Cd)" value={result.cd.toFixed(4)} />
                <MetricCard label="Efficiency (L/D)" value={result.liftToDragRatio.toFixed(3)} color="text-green-400" />
                <MetricCard label="Avg Race Time" value={`${pred?.averageRaceTime.toFixed(3)}s`} color="text-brand-accent" />
                <MetricCard label="Aero Balance" value={`${result.aeroBalance.toFixed(1)}%`} subValue="Front Bias" />
            </div>
            
            <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                <h3 className="text-sm font-bold text-brand-accent uppercase mb-4 flex items-center gap-2">
                    <StopwatchIcon className="w-4 h-4" /> Race Performance Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <p className="text-xs text-brand-text-secondary mb-1">Exit Velocity</p>
                        <p className="text-xl font-bold font-mono">{pred?.averageFinishLineSpeed.toFixed(2)} m/s</p>
                    </div>
                    <div className="text-center border-x border-brand-border">
                        <p className="text-xs text-brand-text-secondary mb-1">Avg Track Speed</p>
                        <p className="text-xl font-bold font-mono text-brand-accent">{pred?.averageSpeed.toFixed(2)} m/s</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-brand-text-secondary mb-1">Launch Stability</p>
                        <p className="text-xl font-bold font-mono">{pred?.launchVariance?.toFixed(1) || '0.0'} ms</p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-brand-dark/50 rounded-xl border border-brand-border italic text-sm text-brand-text-secondary">
                "{result.flowAnalysis}"
            </div>
        </div>
    );

    const renderTechSpecs = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-4">Solver Accuracy Metrics</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span>Mesh Quality:</span>
                            <span className="font-mono font-bold text-green-400">{result.meshQuality}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Continuity Residual:</span>
                            <span className="font-mono">{result.finalResiduals?.continuity.toExponential(1)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Convergence:</span>
                            <span className="font-bold text-brand-accent">{result.convergenceStatus}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h4 className="text-xs font-bold text-brand-text-secondary uppercase mb-4">Geometric Parameters</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                        <span className="text-brand-text-secondary">Length:</span> <span className="text-right">{result.parameters.totalLength}mm</span>
                        <span className="text-brand-text-secondary">Width:</span> <span className="text-right">{result.parameters.totalWidth}mm</span>
                        <span className="text-brand-text-secondary">Weight:</span> <span className="text-right">{result.parameters.totalWeight}g</span>
                        <span className="text-brand-text-secondary">F-Wing Span:</span> <span className="text-right">{result.parameters.frontWingSpan}mm</span>
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
            <div className="flex gap-2 p-1 bg-brand-dark rounded-lg border border-brand-border w-fit">
                <button onClick={() => setActiveSubTab('summary')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'summary' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>SUMMARY</button>
                <button onClick={() => setActiveSubTab('tech')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'tech' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>TECH DATA</button>
                <button onClick={() => setActiveSubTab('scrutineering')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'scrutineering' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>COMPLIANCE</button>
                <button onClick={() => setActiveSubTab('suggestions')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeSubTab === 'suggestions' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>OPTIMIZATION</button>
            </div>

            {activeSubTab === 'summary' && renderSummary()}
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
            {activeSubTab === 'suggestions' && (
                <div className="prose prose-sm prose-invert max-w-none bg-brand-dark p-6 rounded-xl border border-brand-border animate-fade-in" 
                     dangerouslySetInnerHTML={{__html: result.suggestions?.replace(/\n/g, '<br />') || 'No data available.'}} />
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
                    <p className="text-brand-text-secondary max-w-sm mx-auto">Select at least two cars from the 'History' tab to compare their aerodynamic signatures and race predicted performance.</p>
                </div>
            </div>
        );
    }

    const metrics = [
        { key: 'cd', label: 'Drag (Cd)', higherIsBetter: false },
        { key: 'liftToDragRatio', label: 'Efficiency (L/D)', higherIsBetter: true },
        { key: 'aeroBalance', label: 'Stability (Balance)', isBalance: true },
        { key: 'avgRaceTime', label: 'Avg Race Time', higherIsBetter: false },
    ];

    const getRaw = (r: AeroResult, k: string) => {
        if (k === 'avgRaceTime') return r.raceTimePrediction?.averageRaceTime || 0;
        if (k === 'aeroBalance') return Math.abs(50 - r.aeroBalance);
        return (r as any)[k];
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><BarChartIcon className="w-6 h-6 text-brand-accent"/> Performance Head-to-Head</h2>
                <button onClick={onClear} className="text-sm font-bold text-red-400 hover:underline">Reset Comparison</button>
            </div>

            <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                <PerformanceGraph results={results} height={300} />
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-brand-dark-secondary text-brand-text-secondary uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Metric</th>
                            {results.map(r => (
                                <th key={r.id} className="px-6 py-4 text-center">{r.fileName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                        {metrics.map(m => {
                            const winners = results.map(r => ({ id: r.id, val: getRaw(r, m.key) }));
                            const bestVal = m.higherIsBetter ? Math.max(...winners.map(w => w.val)) : Math.min(...winners.map(w => w.val));
                            
                            return (
                                <tr key={m.key} className="bg-brand-dark/30 hover:bg-brand-dark/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-brand-text-secondary">{m.label}</td>
                                    {results.map(r => {
                                        const raw = getRaw(r, m.key);
                                        const isWinner = raw === bestVal;
                                        return (
                                            <td key={r.id} className={`px-6 py-4 text-center font-mono ${isWinner ? 'text-green-400 bg-green-500/5 font-bold' : ''}`}>
                                                {m.key === 'avgRaceTime' ? `${r.raceTimePrediction?.averageRaceTime.toFixed(3)}s` : 
                                                 m.key === 'aeroBalance' ? `${r.aeroBalance.toFixed(1)}%` : (r as any)[m.key].toFixed(4)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const AeroPage: React.FC = () => {
  const { aeroResults, runSimulationTask, backgroundTasks, resetAeroResults, deleteAeroResult, clearBackgroundTasks } = useData();
  const [activeTab, setActiveTab] = useState<'setup' | 'results' | 'comparison' | 'history'>('setup');
  const [selectedResultId, setSelectedResultId] = useState<string | null>(aeroResults[0]?.id || null);
  const [stepFile, setStepFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comparisonIds, setComparisonIds] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<'speed' | 'accuracy'>('speed');
  const [showBenchmark, setShowBenchmark] = useState(false);
  
  const currentResult = useMemo(() => {
    if (selectedResultId === 'benchmark-optimum') return THEORETICAL_OPTIMUM;
    return aeroResults.find(r => r.id === selectedResultId) || aeroResults[0];
  }, [selectedResultId, aeroResults]);

  const runningSimulations = backgroundTasks.filter(t => t.type === 'simulation' && t.status === 'running');
  
  const handleSimulate = async () => {
    if (!stepFile) return;
    runSimulationTask(stepFile, mode);
    setStepFile(null);
  };

  const toggleComparison = (id: string) => {
      setComparisonIds(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id); else next.add(id);
          return next;
      });
  };

  const handleClearStuckTasks = () => {
    if (window.confirm("This will clear all active operations. Only do this if the solver appears to be frozen or if you want to abort all pending runs.")) {
        clearBackgroundTasks();
    }
  };

  const comparisonResults = useMemo(() => {
    const list = aeroResults.filter(r => comparisonIds.has(r.id));
    if (comparisonIds.has('benchmark-optimum')) list.unshift(THEORETICAL_OPTIMUM);
    return list;
  }, [aeroResults, comparisonIds]);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-4xl font-bold text-brand-text tracking-tight">Aerotest Engine</h1>
            <p className="text-brand-text-secondary mt-1">High-fidelity computational fluid dynamics for F1 in Schools.</p>
        </div>
        
        <div className="flex bg-brand-dark-secondary p-1 rounded-xl border border-brand-border shadow-lg">
            {(['setup', 'results', 'comparison', 'history'] as const).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize ${
                        activeTab === tab 
                        ? 'bg-brand-accent text-brand-dark shadow-glow-accent' 
                        : 'text-brand-text-secondary hover:text-brand-text hover:bg-brand-dark'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </header>

      <main className="min-h-[60vh]">
          {/* TAB: SETUP */}
          {activeTab === 'setup' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
                  <div className="lg:col-span-3 space-y-8">
                      <div className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                          
                          <h2 className="text-2xl font-bold text-brand-text mb-6 flex items-center gap-3">
                              <UploadCloudIcon className="w-8 h-8 text-brand-accent" />
                              Initialize Simulation
                          </h2>

                          <div 
                                onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                onDragOver={(e) => e.preventDefault()}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) setStepFile(e.dataTransfer.files[0]); }}
                                onClick={() => fileInputRef.current?.click()}
                                className={`group relative flex flex-col justify-center items-center py-16 px-10 border-4 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
                                    isDragOver 
                                    ? 'border-brand-accent bg-brand-accent/10 scale-[1.02]' 
                                    : 'border-brand-border bg-brand-dark/50 hover:border-brand-accent/50 hover:bg-brand-dark'
                                }`}
                            >
                                <div className="mb-6 p-4 bg-brand-dark rounded-full border border-brand-border group-hover:border-brand-accent group-hover:shadow-glow-accent transition-all">
                                    <UploadCloudIcon className={`w-12 h-12 transition-colors ${isDragOver ? 'text-brand-accent' : 'text-brand-text-secondary group-hover:text-brand-accent'}`} />
                                </div>
                                <h3 className="text-xl font-bold text-brand-text mb-2 text-center">
                                    {stepFile ? stepFile.name : 'Select Car Geometry'}
                                </h3>
                                <p className="text-brand-text-secondary text-sm text-center max-w-xs">
                                    Drag and drop your high-fidelity <span className="text-brand-text font-bold">.STEP</span> or <span className="text-brand-text font-bold">.STP</span> file here to begin analysis.
                                </p>
                                <input type="file" ref={fileInputRef} onChange={(e) => setStepFile(e.target.files?.[0] || null)} accept=".step,.stp" className="hidden" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">Simulation Fidelity</label>
                                    <div className="flex bg-brand-dark p-1.5 rounded-xl border border-brand-border">
                                        <button onClick={() => setMode('speed')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'speed' ? 'bg-brand-accent text-brand-dark shadow-md' : 'text-brand-text-secondary hover:text-brand-text'}`}>SPEED</button>
                                        <button onClick={() => setMode('accuracy')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'accuracy' ? 'bg-brand-accent text-brand-dark shadow-md' : 'text-brand-text-secondary hover:text-brand-text'}`}>ACCURACY</button>
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleSimulate}
                                        disabled={!stepFile || runningSimulations.length > 0}
                                        className="w-full bg-brand-accent text-brand-dark font-black py-4 rounded-xl hover:bg-brand-accent-hover transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed text-lg shadow-glow-accent group"
                                    >
                                        <WindIcon className="w-6 h-6 mr-3 group-hover:animate-pulse" /> RUN SOLVER
                                    </button>
                                </div>
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                      <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border h-full">
                          <div className="flex justify-between items-center mb-4">
                              <h2 className="text-lg font-bold text-brand-text flex items-center gap-2">
                                  <InfoIcon className="w-5 h-5 text-brand-accent" />
                                  Active Operations
                              </h2>
                              {backgroundTasks.length > 0 && (
                                <button 
                                    onClick={handleClearStuckTasks}
                                    title="Force reset solver state"
                                    className="p-1 hover:bg-red-500/10 text-brand-text-secondary hover:text-red-400 rounded transition-colors"
                                >
                                    <AlertTriangleIcon className="w-4 h-4" />
                                </button>
                              )}
                          </div>
                          <div className="space-y-4">
                              {runningSimulations.length > 0 ? runningSimulations.map(task => (
                                  <div key={task.id} className="bg-brand-dark p-4 rounded-xl border border-brand-border animate-pulse">
                                      <div className="flex justify-between items-center mb-2">
                                          <span className="text-sm font-bold text-brand-accent">In Progress: {task.fileName}</span>
                                          <span className="text-xs font-mono">{task.progress.toFixed(0)}%</span>
                                      </div>
                                      <div className="w-full bg-brand-surface h-2 rounded-full overflow-hidden">
                                          <div className="bg-brand-accent h-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                                      </div>
                                      <p className="text-[10px] text-brand-text-secondary mt-2 uppercase tracking-tighter">{task.stage}</p>
                                  </div>
                              )) : (
                                  <div className="flex flex-col items-center justify-center py-10 text-brand-text-secondary border border-dashed border-brand-border rounded-xl">
                                      <CommandIcon className="w-10 h-10 opacity-20 mb-2" />
                                      <p className="text-xs font-bold uppercase tracking-widest">No Active Solves</p>
                                  </div>
                              )}
                          </div>
                          
                          <div className="mt-8 pt-8 border-t border-brand-border space-y-4">
                                <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">Quick Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                        <p className="text-[10px] text-brand-text-secondary uppercase">Historical Runs</p>
                                        <p className="text-xl font-bold">{aeroResults.length}</p>
                                    </div>
                                    <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                        <p className="text-[10px] text-brand-text-secondary uppercase">Average Cd</p>
                                        <p className="text-xl font-bold text-brand-accent">{aeroResults.length > 0 ? (aeroResults.reduce((a,b)=>a+b.cd, 0)/aeroResults.length).toFixed(3) : '--'}</p>
                                    </div>
                                </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* TAB: RESULTS */}
          {activeTab === 'results' && (
              <div className="animate-fade-in">
                  {currentResult ? (
                      <div className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border shadow-2xl">
                          <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-brand-text">{currentResult.fileName}</h2>
                                    <p className="text-brand-text-secondary font-mono text-sm">{currentResult.id === 'benchmark-optimum' ? 'Ω-OPTIMUM Reference' : `Simulated on ${new Date(currentResult.timestamp).toLocaleString()}`}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleComparison(currentResult.id)} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${comparisonIds.has(currentResult.id) ? 'bg-brand-accent text-brand-dark border-brand-accent' : 'border-brand-border text-brand-text-secondary hover:text-brand-text'}`}>
                                        {comparisonIds.has(currentResult.id) ? 'Selected for Compare' : 'Add to Compare'}
                                    </button>
                                </div>
                          </div>
                          <DetailedAnalysisContent result={currentResult} />
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                          <WindIcon className="w-16 h-16 text-brand-border" />
                          <div>
                              <h3 className="text-xl font-bold text-brand-text">No Results Found</h3>
                              <p className="text-brand-text-secondary">Run a simulation in the 'Setup' tab to view results.</p>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* TAB: COMPARISON */}
          {activeTab === 'comparison' && (
              <ComparisonTab results={comparisonResults} onClear={() => setComparisonIds(new Set())} />
          )}

          {/* TAB: HISTORY */}
          {activeTab === 'history' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-end">
                      <h2 className="text-2xl font-bold">Simulation Ledger</h2>
                      <div className="flex gap-4">
                          <button onClick={() => setShowBenchmark(!showBenchmark)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${showBenchmark ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'text-brand-text-secondary border-brand-border'}`}>
                              <CommandIcon className="w-4 h-4" /> Ω-Limit
                          </button>
                          {aeroResults.length > 0 && (
                            <button onClick={resetAeroResults} className="text-sm font-bold text-red-400 hover:underline flex items-center gap-2"><TrashIcon className="w-4 h-4"/> Purge Ledger</button>
                          )}
                      </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                      {(showBenchmark ? [THEORETICAL_OPTIMUM, ...aeroResults] : aeroResults).map(res => {
                          const isPerfect = res.id === 'benchmark-optimum';
                          const isSelected = comparisonIds.has(res.id);
                          return (
                              <div key={res.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                  isPerfect ? 'bg-yellow-500/5 border-yellow-500/30' : 
                                  isSelected ? 'bg-brand-accent/5 border-brand-accent/40 shadow-glow-accent' : 
                                  'bg-brand-dark-secondary border-brand-border hover:border-brand-accent/30'
                              }`}>
                                  <div className="flex items-center gap-4">
                                      <input 
                                          type="checkbox" 
                                          checked={isSelected} 
                                          onChange={() => toggleComparison(res.id)}
                                          className="w-5 h-5 rounded border-brand-border text-brand-accent bg-brand-dark focus:ring-brand-accent"
                                      />
                                      <div onClick={() => { setSelectedResultId(res.id); setActiveTab('results'); }} className="cursor-pointer">
                                          <p className={`font-bold flex items-center gap-2 ${isPerfect ? 'text-yellow-400' : 'text-brand-text'}`}>
                                              {isPerfect && <SparklesIcon className="w-4 h-4" />}
                                              {res.fileName}
                                              <span className="text-[10px] uppercase font-black opacity-30 tracking-widest">{res.tier}</span>
                                          </p>
                                          <p className="text-xs text-brand-text-secondary">{isPerfect ? 'Theoretical Baseline' : new Date(res.timestamp).toLocaleString()}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-8">
                                      <div className="text-center font-mono">
                                          <p className="text-[10px] text-brand-text-secondary uppercase">Cd</p>
                                          <p className="font-bold">{res.cd.toFixed(4)}</p>
                                      </div>
                                      <div className="text-center font-mono">
                                          <p className="text-[10px] text-brand-text-secondary uppercase">L/D</p>
                                          <p className="font-bold text-green-400">{res.liftToDragRatio.toFixed(3)}</p>
                                      </div>
                                      <div className="flex gap-2">
                                          <button onClick={() => { setSelectedResultId(res.id); setActiveTab('results'); }} className="p-2 hover:bg-brand-accent/10 rounded-lg text-brand-accent transition-colors"><BeakerIcon className="w-5 h-5" /></button>
                                          {!isPerfect && (
                                              <button onClick={() => deleteAeroResult?.(res.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-all"><TrashIcon className="w-5 h-5" /></button>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                      {aeroResults.length === 0 && !showBenchmark && (
                          <div className="text-center py-20 border-2 border-dashed border-brand-border rounded-2xl">
                              <HistoryIcon className="w-12 h-12 text-brand-border mx-auto mb-4" />
                              <p className="text-brand-text-secondary font-bold uppercase tracking-widest">No Simulations in Ledger</p>
                          </div>
                      )}
                  </div>
              </div>
          )}
      </main>

      <footer className="mt-12 p-8 bg-brand-accent/5 rounded-3xl border border-brand-accent/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-2xl">
                  <WindIcon className="w-8 h-8 text-brand-accent" />
              </div>
              <div>
                  <p className="text-brand-text font-bold">Aerotest v2.5.2-stable</p>
                  <p className="text-xs text-brand-text-secondary">First-principles physics engine & RANS solver.</p>
              </div>
          </div>
          <div className="flex gap-4">
                <button className="px-4 py-2 text-xs font-bold border border-brand-border rounded-lg hover:bg-brand-border transition-colors">Documentation</button>
                <button className="px-4 py-2 text-xs font-bold border border-brand-border rounded-lg hover:bg-brand-border transition-colors">Export Logs</button>
          </div>
      </footer>
    </div>
  );
};

export default AeroPage;
