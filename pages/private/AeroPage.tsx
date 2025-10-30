
import React, { useState, useRef } from 'react';
import { useData } from '../../contexts/AppContext';
import { runAdvancedCfdSimulation } from '../../services/simulationService';
import { generateAeroSuggestions, performScrutineering } from '../../services/localSimulationService';
import { extractParametersFromFileName } from '../../services/fileAnalysisService';
import { AeroResult, DesignParameters } from '../../types';
import { WindIcon, TrophyIcon, BeakerIcon, LightbulbIcon, FileTextIcon, UploadCloudIcon } from '../../components/icons';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorBoundary from '../../components/ErrorBoundary';
import Modal from '../../components/shared/Modal';

// Add new icons for the page
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9"x2="15" y2="15"/></svg>
);

const DetailedAnalysisModal: React.FC<{ result: AeroResult; onClose: () => void }> = ({ result, onClose }) => {
    const [activeTab, setActiveTab] = useState('analysis');

    const renderScrutineering = () => {
        if (!result.scrutineeringReport) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
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
        if (!result.suggestions) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
        return <div className="prose prose-sm max-w-none prose-invert" dangerouslySetInnerHTML={{__html: result.suggestions.replace(/\n/g, '<br />')}} />;
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Analysis: ${result.parameters.carName}`}>
            <div className="flex border-b border-brand-border mb-4">
                <button onClick={() => setActiveTab('analysis')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'analysis' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><BeakerIcon className="w-4 h-4" /> Performance</button>
                <button onClick={() => setActiveTab('suggestions')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'suggestions' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><LightbulbIcon className="w-4 h-4" /> Suggestions</button>
                <button onClick={() => setActiveTab('scrutineering')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${activeTab === 'scrutineering' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-brand-text-secondary'}`}><FileTextIcon className="w-4 h-4" /> Scrutineering</button>
            </div>
            <div>
                {activeTab === 'analysis' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-brand-dark rounded-lg">
                            <p className="text-sm text-brand-text-secondary">Cd (Drag)</p>
                            <p className="text-2xl font-bold text-brand-text">{result.cd}</p>
                        </div>
                        <div className="p-4 bg-brand-dark rounded-lg">
                            <p className="text-sm text-brand-text-secondary">Cl (Lift)</p>
                            <p className="text-2xl font-bold text-brand-text">{result.cl}</p>
                        </div>
                        <div className="p-4 bg-green-500/10 rounded-lg">
                            <p className="text-sm text-green-300">L/D Ratio</p>
                            <p className="text-2xl font-bold text-green-400">{result.liftToDragRatio}</p>
                        </div>
                        <div className="p-4 bg-brand-dark rounded-lg">
                            <p className="text-sm text-brand-text-secondary">Aero Balance</p>
                            <p className="text-2xl font-bold text-brand-text">{result.aeroBalance}% F</p>
                        </div>
                    </div>
                )}
                {activeTab === 'suggestions' && renderSuggestions()}
                {activeTab === 'scrutineering' && renderScrutineering()}
            </div>
        </Modal>
    );
};

const AeroPage: React.FC = () => {
  const { aeroResults, addAeroResult } = useData();
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AeroResult | null>(null);
  const [carName, setCarName] = useState('BR-04-Alpha');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    try {
        const extractedParams = extractParametersFromFileName(file.name);
        const designParameters: DesignParameters = {
            carName,
            ...extractedParams,
        };
        
        const simResultData = await runAdvancedCfdSimulation(designParameters);
        
        const tempResultForAnalysis: AeroResult = {
            ...simResultData,
            id: 'temp', 
            isBest: false,
            fileName: file.name
        };
        const suggestions = generateAeroSuggestions(tempResultForAnalysis);
        const scrutineeringReport = performScrutineering(designParameters);
        
        const finalResult: Omit<AeroResult, 'id' | 'isBest'> = {
            ...simResultData,
            fileName: file.name,
            suggestions,
            scrutineeringReport
        };
        
        addAeroResult(finalResult);
        setFile(null);

    } catch (error) {
        console.error("Simulation failed", error);
        alert("Simulation failed. Please check the console.");
    } finally {
        setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-brand-text">Aero Analysis & Scrutineering</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <ErrorBoundary>
                <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full">
                    <h2 className="text-xl font-bold text-brand-text mb-4">New Simulation</h2>
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
                            {isSimulating ? <><LoadingSpinner /> <span className="ml-2">Simulating...</span></> : <><WindIcon className="w-5 h-5 mr-2" /> Start CFD Analysis</>}
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
                      {aeroResults.map((result) => (
                      <div key={result.id} onClick={() => setSelectedResult(result)} className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${result.isBest ? 'bg-green-500/10 border-green-500/30 shadow-sm' : 'bg-brand-dark border-brand-border hover:bg-brand-border'}`}>
                          <div>
                              <p className="font-bold text-brand-text flex items-center">
                                  {result.isBest && <TrophyIcon className="w-4 h-4 text-yellow-400 mr-2" />}
                                  {result.parameters.carName}
                              </p>
                              <p className="text-xs text-brand-text-secondary">{result.fileName} &bull; {new Date(result.timestamp).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-center">
                            <div>
                                <p className="font-semibold text-brand-text-secondary">L/D</p>
                                <p className={`font-bold text-lg ${result.isBest ? 'text-green-400' : 'text-brand-text'}`}>{result.liftToDragRatio}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-brand-text-secondary">Cd</p>
                                <p className="text-brand-text">{result.cd}</p>
                            </div>
                             <div>
                                <p className="font-semibold text-brand-text-secondary">Cl</p>
                                <p className="text-brand-text">{result.cl}</p>
                            </div>
                          </div>
                      </div>
                      ))}
                      {aeroResults.length === 0 && <p className="text-center text-brand-text-secondary p-4">No simulations have been run yet.</p>}
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