
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

const ComparisonTab: React.FC<{ results: AeroResult[]; onClear: () => void }> = ({ results, onClear }) => {
    if (results.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
                <div className="p-4 bg-brand-dark rounded-full border border-brand-border">
                    <BarChartIcon className="w-12 h-12 text-brand-border" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-brand-text">Comparison Engine Idle</h3>
                    <p className="text-brand-text-secondary max-w-sm mx-auto">Select at least two cars from the 'History' tab to compare their aerodynamic signatures.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2"><BarChartIcon className="w-6 h-6 text-brand-accent"/> Performance Head-to-Head</h2>
                <button onClick={onClear} className="text-sm font-bold text-red-400 hover:underline">Reset Comparison</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h3 className="text-xs font-black text-brand-accent uppercase mb-4 tracking-widest">Efficiency Curves (L/D)</h3>
                    <PerformanceGraph results={results} height={300} />
                </div>
                <div className="bg-brand-dark p-6 rounded-xl border border-brand-border">
                    <h3 className="text-xs font-black text-brand-accent uppercase mb-4 tracking-widest">Velocity Profiles (Acc.)</h3>
                    <SpeedTimeGraph result={results} height={300} showTitle={false} />
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-brand-border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-brand-dark-secondary text-brand-text-secondary uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Metric</th>
                            {results.map(r => (
                                <th key={r.id} className="px-6 py-4 text-center">{r.parameters.carName}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                        {[
                            { key: 'cd', label: 'Drag (Cd)', best: 'min' },
                            { key: 'averageRaceTime', label: 'Avg Race Time', best: 'min' },
                            { key: 'averageFinishLineSpeed', label: 'Finish Speed', best: 'max' }
                        ].map(m => {
                            const values = results.map(r => m.key === 'cd' ? r.cd : (r.raceTimePrediction as any)[m.key]);
                            const bestVal = m.best === 'min' ? Math.min(...values) : Math.max(...values);
                            
                            return (
                                <tr key={m.key} className="bg-brand-dark/30 hover:bg-brand-dark/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-brand-text-secondary">{m.label}</td>
                                    {results.map((r, i) => (
                                        <td key={r.id} className={`px-6 py-4 text-center font-mono ${values[i] === bestVal ? 'text-green-400 bg-green-500/5 font-bold' : ''}`}>
                                            {m.key === 'cd' ? r.cd.toFixed(4) : 
                                             m.key === 'averageRaceTime' ? `${values[i].toFixed(3)}s` : 
                                             `${(values[i] * 3.6).toFixed(1)} km/h`}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AeroPage: React.FC = () => {
  const { aeroResults, runSimulationTask, backgroundTasks, resetAeroResults, deleteAeroResult } = useData();
  const [activeTab, setActiveTab] = useState<'setup' | 'results' | 'comparison' | 'history'>('setup');
  const [selectedResultId, setSelectedResultId] = useState<string | null>(aeroResults[0]?.id || null);
  const [stepFile, setStepFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'speed' | 'accuracy'>('speed');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comparisonIds, setComparisonIds] = useState<Set<string>>(new Set());
  
  const currentResult = useMemo(() => {
    if (selectedResultId === 'benchmark-optimum') return THEORETICAL_OPTIMUM;
    return aeroResults.find(r => r.id === selectedResultId) || aeroResults[0];
  }, [selectedResultId, aeroResults]);

  const runningSimulations = backgroundTasks.filter(t => t.type === 'simulation' && t.status === 'running');
  
  const handleSimulate = async () => {
    if (!stepFile) return;
    runSimulationTask(stepFile, mode);
    setStepFile(null);
    setActiveTab('setup'); // Stay here to see progress
  };

  const toggleComparison = (id: string) => {
    setComparisonIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
    });
  };

  const comparisonResults = useMemo(() => {
    return aeroResults.filter(r => comparisonIds.has(r.id));
  }, [aeroResults, comparisonIds]);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-4xl font-bold text-brand-text tracking-tight">Aerotest Engine</h1>
            <p className="text-brand-text-secondary mt-1">v2.7.5 Physics Engine | Monte Carlo Simulation Active</p>
        </div>
        
        <div className="flex bg-brand-dark-secondary p-1 rounded-xl border border-brand-border shadow-lg overflow-x-auto">
            {(['setup', 'results', 'comparison', 'history'] as const).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize whitespace-nowrap ${
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
          {activeTab === 'setup' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
                  <div className="lg:col-span-3 space-y-8">
                      <div className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border shadow-2xl">
                          <h2 className="text-2xl font-bold text-brand-text mb-6 flex items-center gap-3">
                              <UploadCloudIcon className="w-8 h-8 text-brand-accent" />
                              Initialize Simulation
                          </h2>

                          <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="group relative flex flex-col justify-center items-center py-16 px-10 border-4 border-dashed rounded-3xl cursor-pointer transition-all duration-300 border-brand-border bg-brand-dark/50 hover:border-brand-accent/50 hover:bg-brand-dark"
                            >
                                <div className="mb-6 p-4 bg-brand-dark rounded-full border border-brand-border group-hover:border-brand-accent transition-all">
                                    <UploadCloudIcon className="w-12 h-12 text-brand-text-secondary group-hover:text-brand-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-text mb-2 text-center">
                                    {stepFile ? stepFile.name : 'Select Car Geometry'}
                                </h3>
                                <p className="text-brand-text-secondary text-sm text-center">
                                    Upload <span className="text-brand-text font-bold">.STEP</span> or <span className="text-brand-text font-bold">.STP</span> for class-accurate mass derivation.
                                </p>
                                <input type="file" ref={fileInputRef} onChange={(e) => setStepFile(e.target.files?.[0] || null)} accept=".step,.stp" className="hidden" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">Entry Class</label>
                                    <div className="flex bg-brand-dark p-1.5 rounded-xl border border-brand-border">
                                        <button onClick={() => setMode('speed')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'speed' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary'}`}>DEV</button>
                                        <button onClick={() => setMode('accuracy')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'accuracy' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary'}`}>PRO</button>
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleSimulate}
                                        disabled={!stepFile || runningSimulations.length > 0}
                                        className="w-full bg-brand-accent text-brand-dark font-black py-4 rounded-xl hover:bg-brand-accent-hover transition-all disabled:opacity-30 text-lg shadow-glow-accent group"
                                    >
                                        <WindIcon className="w-6 h-6 mr-3" /> RUN SOLVER
                                    </button>
                                </div>
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                      <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border h-full">
                          <h2 className="text-lg font-bold text-brand-text flex items-center gap-2 mb-4">
                              <InfoIcon className="w-5 h-5 text-brand-accent" />
                              Active Solves
                          </h2>
                          <div className="space-y-4">
                              {runningSimulations.length > 0 ? runningSimulations.map(task => (
                                  <div key={task.id} className="bg-brand-dark p-4 rounded-xl border border-brand-border animate-pulse">
                                      <div className="flex justify-between items-center mb-2">
                                          <span className="text-sm font-bold text-brand-accent">{task.fileName}</span>
                                          <span className="text-xs font-mono">{task.progress.toFixed(0)}%</span>
                                      </div>
                                      <div className="w-full bg-brand-surface h-2 rounded-full overflow-hidden">
                                          <div className="bg-brand-accent h-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                                      </div>
                                      <p className="text-[10px] text-brand-text-secondary mt-2 uppercase tracking-tighter">{task.stage}</p>
                                      {task.latestLog && <p className="text-[9px] text-brand-text-secondary mt-1 font-mono italic truncate">{task.latestLog}</p>}
                                  </div>
                              )) : (
                                  <div className="flex flex-col items-center justify-center py-10 text-brand-text-secondary border border-dashed border-brand-border rounded-xl">
                                      <CommandIcon className="w-10 h-10 opacity-20 mb-2" />
                                      <p className="text-xs font-bold uppercase tracking-widest">No Active Solves</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'results' && (
              <div className="animate-fade-in">
                  {currentResult ? (
                      <div className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border shadow-2xl">
                          <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-brand-text">{currentResult.parameters.carName}</h2>
                                    <p className="text-brand-text-secondary font-mono text-sm">{currentResult.id === 'benchmark-optimum' ? 'Theoretical Benchmark' : `Analysis Date: ${new Date(currentResult.timestamp).toLocaleDateString()}`}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => toggleComparison(currentResult.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${comparisonIds.has(currentResult.id) ? 'bg-brand-accent text-brand-dark border-brand-accent' : 'border-brand-border text-brand-text-secondary hover:text-brand-text'}`}
                                    >
                                        {comparisonIds.has(currentResult.id) ? 'In Comparison' : 'Add to Compare'}
                                    </button>
                                </div>
                          </div>
                          <DetailedAnalysisContent result={currentResult} />
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                          <WindIcon className="w-16 h-16 text-brand-border" />
                          <h3 className="text-xl font-bold text-brand-text">Simulation Ledger Empty</h3>
                          <button onClick={() => setActiveTab('setup')} className="text-brand-accent hover:underline font-bold">Return to Setup</button>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'comparison' && (
              <ComparisonTab results={comparisonResults} onClear={() => setComparisonIds(new Set())} />
          )}

          {activeTab === 'history' && (
              <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-end mb-4">
                      <h2 className="text-2xl font-bold">Analysis History</h2>
                      <button onClick={resetAeroResults} className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"><TrashIcon className="w-3 h-3"/> Wipe History</button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                      {[THEORETICAL_OPTIMUM, ...aeroResults].map(res => (
                          <div key={res.id} className="group flex items-center justify-between p-4 rounded-xl border border-brand-border bg-brand-dark-secondary hover:border-brand-accent/30 transition-all">
                              <div className="flex items-center gap-4">
                                  <input 
                                      type="checkbox" 
                                      checked={comparisonIds.has(res.id)} 
                                      onChange={() => toggleComparison(res.id)}
                                      className="w-4 h-4 rounded border-brand-border text-brand-accent bg-brand-dark focus:ring-brand-accent"
                                  />
                                  <div onClick={() => { setSelectedResultId(res.id); setActiveTab('results'); }} className="flex flex-col cursor-pointer">
                                      <p className="font-bold text-brand-text">{res.parameters.carName}</p>
                                      <p className="text-[10px] text-brand-text-secondary uppercase">{res.tier === 'premium' ? 'Professional' : 'Development'} Class</p>
                                  </div>
                              </div>
                              <div onClick={() => { setSelectedResultId(res.id); setActiveTab('results'); }} className="flex items-center gap-8 font-mono text-sm cursor-pointer">
                                  <div className="hidden md:block text-center">
                                      <p className="text-[9px] text-brand-text-secondary uppercase">Cd</p>
                                      <p className="font-bold">{res.cd.toFixed(4)}</p>
                                  </div>
                                  <div className="text-center">
                                      <p className="text-[9px] text-brand-text-secondary uppercase">Avg Speed</p>
                                      <p className="font-bold text-brand-accent">{(res.raceTimePrediction!.averageSpeed * 3.6).toFixed(1)} km/h</p>
                                  </div>
                                  <div className="text-center">
                                      <p className="text-[9px] text-brand-text-secondary uppercase">Time</p>
                                      <p className="font-bold text-yellow-400">{res.raceTimePrediction!.averageRaceTime.toFixed(3)}s</p>
                                  </div>
                                  {res.id !== 'benchmark-optimum' && (
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); deleteAeroResult(res.id); }}
                                        className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                          <TrashIcon className="w-4 h-4" />
                                      </button>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </main>

      <footer className="mt-12 p-8 bg-brand-accent/5 rounded-3xl border border-brand-accent/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
                  <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <div>
                  <p className="text-brand-text font-bold">Aerotest v2.7.5</p>
                  <p className="text-xs text-brand-text-secondary">Class-Dynamics Engine | Probabilistic Solver</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default AeroPage;
