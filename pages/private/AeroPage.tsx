
import React, { useState, useRef, useEffect, useMemo, DragEvent } from 'react';
import { useData } from '../../contexts/AppContext';
import { AeroResult, ProbabilisticRaceTimePrediction, BackgroundTask } from '../../types';
import { WindIcon, TrophyIcon, BeakerIcon, LightbulbIcon, FileTextIcon, BarChartIcon, StopwatchIcon, UploadCloudIcon, SparklesIcon, CheckCircleIcon, XCircleIcon, VideoIcon, FileCheckIcon, AlertTriangleIcon, ShieldCheckIcon, ShieldAlertIcon, InfoIcon, ScaleIcon } from '../../components/icons';
import ErrorBoundary from '../../components/ErrorBoundary';
import Modal from '../../components/shared/Modal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import FlowFieldVisualizer from '../../components/hq/FlowFieldVisualizer';


const DetailedAnalysisModal: React.FC<{ result: AeroResult; bestResult: AeroResult | null; onClose: () => void }> = ({ result, bestResult, onClose }) => {
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
    
    const renderBenchmarking = () => {
        if (!bestResult || !result.raceTimePrediction || !bestResult.raceTimePrediction) return null;
        
        const isBest = result.id === bestResult.id;
        const currentAvgTime = result.raceTimePrediction.averageRaceTime;
        const bestAvgTime = bestResult.raceTimePrediction.averageRaceTime;
        const timeDiff = currentAvgTime - bestAvgTime;
        
        // Physics Comparisons
        const dragDiffPct = ((result.cd - bestResult.cd) / bestResult.cd) * 100;
        const weightDiff = result.parameters.totalWeight - bestResult.parameters.totalWeight;
        const liftDiff = result.cl - bestResult.cl;

        return (
            <div className="mt-6 border-t border-brand-border pt-6 animate-fade-in">
                <h3 className="text-lg font-bold text-brand-text mb-4 flex items-center">
                    <BarChartIcon className="w-5 h-5 mr-2 text-brand-accent"/> 
                    Competitive Benchmarking & Physics Insight
                </h3>
                
                <div className={`p-4 rounded-lg mb-4 border ${isBest ? 'bg-brand-accent/10 border-brand-accent/50' : 'bg-brand-dark border-brand-border'}`}>
                    <div className="flex items-start gap-3">
                        {isBest ? <TrophyIcon className="w-8 h-8 text-yellow-400 flex-shrink-0"/> : <InfoIcon className="w-8 h-8 text-blue-400 flex-shrink-0"/>}
                        <div>
                            <p className="font-bold text-brand-text text-lg">
                                {isBest ? "Class Leader: The Benchmark Design" : `Gap to Leader: +${timeDiff.toFixed(3)}s`}
                            </p>
                            <p className="text-sm text-brand-text-secondary mt-1">
                                {isBest 
                                    ? "This car currently holds the fastest average race time in your database. It represents the optimal balance of variables found so far."
                                    : `Compared to "${bestResult.fileName}", the current class leader (${bestAvgTime.toFixed(3)}s).`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {!isBest && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Drag Analysis */}
                        <div className="bg-brand-dark p-4 rounded-lg border border-brand-border">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-brand-text flex items-center"><WindIcon className="w-4 h-4 mr-2"/> Aerodynamic Drag</h4>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${dragDiffPct > 0 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                    {dragDiffPct > 0 ? `+${dragDiffPct.toFixed(1)}% Higher` : `${dragDiffPct.toFixed(1)}% Lower`}
                                </span>
                            </div>
                            <p className="text-xs text-brand-text-secondary leading-relaxed">
                                {dragDiffPct > 0 
                                    ? "This car has higher air resistance than the leader. Drag forces increase with the square of velocity. This means as the car accelerates, this extra drag acts like a progressively stronger brake, punishing top speed and killing momentum during the coasting phase."
                                    : "Surprisingly, this car has lower drag than the leader! This implies the time loss is coming from elsewhere—likely mass or friction."
                                }
                            </p>
                        </div>

                        {/* Mass Analysis */}
                        <div className="bg-brand-dark p-4 rounded-lg border border-brand-border">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-brand-text flex items-center"><ScaleIcon className="w-4 h-4 mr-2"/> Mass (Weight)</h4>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${weightDiff > 0.5 ? 'bg-red-500/20 text-red-300' : (weightDiff < -0.5 ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300')}`}>
                                    {weightDiff > 0 ? `+${weightDiff.toFixed(1)}g Heavier` : (weightDiff < 0 ? `${weightDiff.toFixed(1)}g Lighter` : 'Equal Weight')}
                                </span>
                            </div>
                            <p className="text-xs text-brand-text-secondary leading-relaxed">
                                {weightDiff > 1 
                                    ? "According to Newton's Second Law (F=ma), more mass requires more force to accelerate. Since the CO2 cartridge force is fixed, a heavier car accelerates slower off the line."
                                    : "The weight is competitive. The performance difference is primarily aerodynamic."
                                }
                            </p>
                        </div>

                        {/* Lift/Stability Analysis */}
                        <div className="bg-brand-dark p-4 rounded-lg border border-brand-border md:col-span-2">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-brand-text flex items-center"><WindIcon className="w-4 h-4 mr-2 rotate-90"/> Stability (Lift)</h4>
                                <span className="text-xs font-mono text-brand-text-secondary">
                                    Current Cl: {result.cl} vs Best Cl: {bestResult.cl}
                                </span>
                            </div>
                            <p className="text-xs text-brand-text-secondary leading-relaxed">
                                {result.cl > 0.1 && result.cl > bestResult.cl
                                    ? "This car generates significantly more lift (upward force) or less downforce than the leader. While F1 in Schools cars don't need massive downforce, positive lift reduces tire contact patch pressure, potentially causing instability or 'skating' which wastes energy."
                                    : (result.cl < bestResult.cl && result.cl < -0.5
                                        ? "This car generates a lot of downforce. While good for stability, excessive downforce often comes with an 'induced drag' penalty. If the car is stable but slow, try reducing wing angles to trade unnecessary grip for speed."
                                        : "The lift characteristics are comparable. The focus should remain on reducing form drag (frontal area) and interference drag."
                                    )
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderRaceAnalysis = () => {
        if (!result.raceTimePrediction) return <div className="text-center p-8 text-brand-text-secondary">Race time prediction not available for this run.</div>;
        const pred = result.raceTimePrediction;
        const toFixedSafe = (val: number | undefined, digits: number) => (val != null ? val.toFixed(digits) : 'N/A');
        const thrustVersion = result.thrustModel === 'pro-competition' ? '5.3' : result.thrustModel === 'competition' ? '5.2' : '5.1';

        // Check if the new average speed metrics are available (for backward compatibility with old results)
        const hasTrackSpeed = pred.averageSpeed !== undefined;

        return (
            <div className="space-y-4">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">Best Time</p><p className="text-2xl font-bold text-green-400 font-mono">{toFixedSafe(pred.bestRaceTime, 3)}s</p></div>
                    <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Avg Time</p><p className="text-2xl font-bold text-brand-text font-mono">{toFixedSafe(pred.averageRaceTime, 3)}s</p></div>
                    <div className="p-4 bg-red-500/10 rounded-lg"><p className="text-sm text-red-300">Worst Time</p><p className="text-2xl font-bold text-red-400 font-mono">{toFixedSafe(pred.worstRaceTime, 3)}s</p></div>
                    
                    {hasTrackSpeed ? (
                        <>
                            <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">Best Track Speed</p><p className="text-2xl font-bold text-green-400 font-mono">{toFixedSafe(pred.bestAverageSpeed, 2)} m/s</p></div>
                            <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Avg Speed (Track)</p><p className="text-2xl font-bold text-brand-text font-mono">{toFixedSafe(pred.averageSpeed, 2)} m/s</p></div>
                            <div className="p-4 bg-red-500/10 rounded-lg"><p className="text-sm text-red-300">Worst Track Speed</p><p className="text-2xl font-bold text-red-400 font-mono">{toFixedSafe(pred.worstAverageSpeed, 2)} m/s</p></div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">Best Finish Speed</p><p className="text-2xl font-bold text-green-400 font-mono">{toFixedSafe(pred.bestFinishLineSpeed, 2)} m/s</p></div>
                            <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Avg Finish Speed</p><p className="text-2xl font-bold text-brand-text font-mono">{toFixedSafe(pred.averageFinishLineSpeed, 2)} m/s</p></div>
                            <div className="p-4 bg-red-500/10 rounded-lg"><p className="text-sm text-red-300">Worst Finish Speed</p><p className="text-2xl font-bold text-red-400 font-mono">{toFixedSafe(pred.worstFinishLineSpeed, 2)} m/s</p></div>
                        </>
                    )}
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
                    <p className="text-xs text-brand-text-secondary mt-2">
                        Simulation Mode: <span className={`font-semibold ${result.tier === 'premium' ? 'text-purple-400' : 'text-blue-400'}`}>
                            {result.tier === 'premium' ? 'Accuracy' : 'Speed'}
                        </span>
                    </p>
                </div>
                
                {renderBenchmarking()}
            </div>
        );
    };
    
    const renderVerificationChecks = () => {
        if (!result.verificationChecks) return <div className="text-center p-8 text-brand-text-secondary">No verification checks were performed for this run.</div>;
        return (
            <div className="space-y-3">
                {result.verificationChecks.map((check, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${check.status === 'PASS' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <div className="flex items-center font-semibold">
                            {check.status === 'PASS' ? <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" /> : <XCircleIcon className="w-5 h-5 text-red-400 mr-2" />}
                            <span className={check.status === 'PASS' ? 'text-green-300' : 'text-red-300'}>{check.name}</span>
                        </div>
                        <p className="text-sm pl-7 mt-1 text-brand-text-secondary">{check.message}</p>
                    </div>
                ))}
            </div>
        );
    };

    const renderValidationLog = () => {
        if ((!result.validationLog || result.validationLog.length === 0) && !result.auditLog) {
            return <div className="text-center p-8 text-brand-text-secondary">No validation or audit logs available for this run.</div>;
        }
        return (
            <div className="space-y-3 font-mono text-sm">
                {result.auditLog && (
                    <div className={`p-3 rounded-md flex items-start gap-3 ${result.auditLog.includes('WARNING') ? 'bg-yellow-500/10 text-yellow-300' : 'bg-blue-500/10 text-blue-300'}`}>
                        {result.auditLog.includes('WARNING') ? 
                            <ShieldAlertIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/> :
                            <ShieldCheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-300"/>}
                        <span>{result.auditLog}</span>
                    </div>
                )}
                {result.validationLog && result.validationLog.map((log, index) => {
                    const isPass = log.startsWith('PASSED:');
                    return (
                        <div key={index} className={`p-3 rounded-md flex items-start gap-3 ${isPass ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300'}`}>
                            {isPass ? <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/> : <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5"/>}
                            <span>{log}</span>
                        </div>
                    );
                })}
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
                <button onClick={() => setActiveTab('verification')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'verification' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><ShieldCheckIcon className="w-4 h-4" /> Verification</button>
                <button onClick={() => setActiveTab('validation')} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'validation' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><FileCheckIcon className="w-4 h-4" /> Validation</button>
                <button onClick={() => setActiveTab('flow')} disabled={!result.flowFieldData} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'flow' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'} disabled:text-gray-600 disabled:cursor-not-allowed`}><VideoIcon className="w-4 h-4" /> Flow Viz</button>
            </div>
            <div className="relative">
                {activeTab === 'prediction' && renderRaceAnalysis()}
                {activeTab === 'analysis' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Cd (Drag)</p><p className="text-2xl font-bold text-brand-text">{result.cd}</p></div>
                            <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Cl (Lift)</p><p className="text-2xl font-bold text-brand-text">{result.cl}</p></div>
                            <div className="p-4 bg-green-500/10 rounded-lg"><p className="text-sm text-green-300">L/D Ratio</p><p className="text-2xl font-bold text-green-400">{result.liftToDragRatio}</p></div>
                            <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Aero Balance</p><p className="text-2xl font-bold text-brand-text">{result.aeroBalance}% F</p></div>
                        </div>
                        <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm font-semibold text-brand-text-secondary">Solver Flow Analysis</p><p className="text-brand-text mt-1">{result.flowAnalysis}</p></div>
                        {result.aiFlowFeatures && result.aiFlowFeatures.length > 0 && (
                             <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm font-semibold text-brand-text-secondary">AI Feature Detection</p><ul className="list-disc list-inside text-brand-text mt-1 text-sm space-y-1">
                                {result.aiFlowFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
                             </ul></div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                             <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Mesh Quality</p><p className="text-2xl font-bold text-brand-text">{result.meshQuality}%</p></div>
                             <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Convergence</p><p className={`text-2xl font-bold ${result.convergenceStatus === 'Converged' ? 'text-green-400' : 'text-red-400'}`}>{result.convergenceStatus}</p></div>
                             <div className="p-4 bg-brand-dark rounded-lg"><p className="text-sm text-brand-text-secondary">Sim Time</p><p className="text-2xl font-bold text-brand-text">{result.simulationTime} s</p></div>
                        </div>
                        <div className="p-4 bg-brand-dark rounded-lg text-sm space-y-2">
                             <p className="font-semibold text-brand-text-secondary">Solver Details</p>
                             <div className="flex justify-between font-mono text-xs"><span>Mesh Cells:</span> <span className="font-bold text-brand-text">{result.meshCellCount?.toLocaleString()}</span></div>
                             {result.autoSelectedSettings && (
                                 <>
                                  <div className="flex justify-between font-mono text-xs"><span>Flow Regime:</span> <span className="font-bold text-brand-text">{result.autoSelectedSettings.flowRegime}</span></div>
                                  <div className="flex justify-between font-mono text-xs"><span>Turbulence Model:</span> <span className="font-bold text-brand-text">{result.autoSelectedSettings.turbulenceModel}</span></div>
                                 </>
                             )}
                             {result.solverSettings && (
                                <>
                                 <div className="flex justify-between font-mono text-xs"><span>Discretization (Momentum):</span> <span className="font-bold text-brand-text">{result.solverSettings.spatialDiscretization.momentum}</span></div>
                                 <div className="flex justify-between font-mono text-xs"><span>Solver:</span> <span className="font-bold text-brand-text">{result.solverSettings.solver} ({result.solverSettings.precision})</span></div>
                                </>
                             )}
                             {result.aiCorrectionModel && (
                                <div className="pt-2 border-t border-brand-border/50">
                                    <p className="font-semibold text-brand-text-secondary text-xs">AI Correction Layer:</p>
                                    <div className="font-mono text-xs space-y-1 mt-1">
                                        <div className="flex justify-between"><span>Model Version:</span> <span className="font-bold text-brand-text">{result.aiCorrectionModel.version}</span></div>
                                        <div className="flex justify-between"><span>Model Confidence:</span> <span className="font-bold text-brand-text">{(result.aiCorrectionModel.confidence * 100).toFixed(1)}%</span></div>
                                        <div className={`flex justify-between ${result.aiCorrectionModel.correctionApplied ? 'text-green-400' : 'text-yellow-400'}`}>
                                            <span>Status:</span>
                                            <span className="font-bold">{result.aiCorrectionModel.correctionApplied ? 'Correction Applied' : 'Correction Discarded'}</span>
                                        </div>
                                        {result.aiCorrectionModel.correctionApplied && result.aiCorrectionModel.originalCd && (
                                            <div className="flex justify-between"><span>Cd Change:</span> <span className="font-bold text-brand-text">{result.aiCorrectionModel.originalCd.toFixed(4)} → {result.cd.toFixed(4)}</span></div>
                                        )}
                                        {result.aiCorrectionModel.reason && (
                                            <div className="text-gray-500 pt-1">
                                                <span>{`> ${result.aiCorrectionModel.reason}`}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                             {result.finalResiduals && (
                                <div className="pt-2 border-t border-brand-border/50">
                                    <p className="font-semibold text-brand-text-secondary text-xs">Final Residuals:</p>
                                    <div className="grid grid-cols-2 gap-x-4">
                                        {Object.entries(result.finalResiduals).map(([key, value]) => (
                                            <div key={key} className="flex justify-between font-mono text-xs"><span>{key}:</span> <span className="font-bold text-brand-text">{(value as number).toExponential(2)}</span></div>
                                        ))}
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                )}
                {activeTab === 'suggestions' && renderSuggestions()}
                {activeTab === 'scrutineering' && renderScrutineering()}
                {activeTab === 'verification' && renderVerificationChecks()}
                {activeTab === 'validation' && renderValidationLog()}
                {activeTab === 'flow' && result.flowFieldData && (
                    <FlowFieldVisualizer flowFieldData={result.flowFieldData} parameters={result.parameters} />
                )}
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
  const [mode, setMode] = useState<'speed' | 'accuracy'>('speed');
  
  const runningSimulations = backgroundTasks.filter(t => t.type === 'simulation' && t.status === 'running');
  
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

  const bestResult = useMemo(() => {
    if (aeroResults.length === 0) return null;
    return aeroResults.reduce((best, current) => {
        const bestTime = best.raceTimePrediction?.averageRaceTime ?? Infinity;
        const currentTime = current.raceTimePrediction?.averageRaceTime ?? Infinity;
        return currentTime < bestTime ? current : best;
    });
  }, [aeroResults]);

  const bestResultId = bestResult?.id || null;

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
    runSimulationTask(stepFile, mode);
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
                        <label className="text-sm font-semibold text-brand-text-secondary block mb-2">Simulation Mode</label>
                        <div className="flex bg-brand-dark p-1 rounded-lg border border-brand-border">
                             <button onClick={() => setMode('speed')} className={`flex-1 p-2 rounded-md text-sm font-bold transition-colors ${mode === 'speed' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>Speed</button>
                             <button onClick={() => setMode('accuracy')} className={`flex-1 p-2 rounded-md text-sm font-bold transition-colors ${mode === 'accuracy' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-surface'}`}>Accuracy</button>
                        </div>
                    </div>
                    
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
                        disabled={!stepFile || runningSimulations.length > 0}
                        className="w-full mt-4 bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-text-secondary disabled:text-brand-dark flex items-center justify-center"
                    >
                       <WindIcon className="w-5 h-5 mr-2" /> Run Simulation
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
                                      {result.tier === 'premium' ? (
                                          <span className="ml-2 text-xs font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1"><SparklesIcon className="w-3 h-3" /> Accuracy</span>
                                      ) : (
                                          <span className="ml-2 text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1"><WindIcon className="w-3 h-3" /> Speed</span>
                                      )}
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
      {selectedResult && <DetailedAnalysisModal result={selectedResult} bestResult={bestResult} onClose={() => setSelectedResult(null)} />}
    </div>
  );
};

export default AeroPage;
