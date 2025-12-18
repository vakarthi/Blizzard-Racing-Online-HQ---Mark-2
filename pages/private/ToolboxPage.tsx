
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AppContext';
import { UserRole } from '../../types';
import ErrorBoundary from '../../components/ErrorBoundary';
import UnitConverter from '../../components/tools/UnitConverter';
import InteractiveChecklist from '../../components/tools/InteractiveChecklist';
import WeightBalanceCalculator from '../../components/tools/WeightBalanceCalculator';
import AiRenderTool from '../../components/tools/AiRenderTool';
import { WrenchIcon, ShieldCheckIcon, PackageIcon, FileTextIcon, PaletteIcon, ClipboardListIcon } from '../../components/icons';

// --- NEW ROLE-SPECIFIC TOOLS ---

const ManufacturingQCTool: React.FC = () => {
    const [logs, setLogs] = useState<{id: number, part: string, target: number, actual: number, date: string}[]>([]);
    const [part, setPart] = useState('');
    const [target, setTarget] = useState('');
    const [actual, setActual] = useState('');

    const addLog = () => {
        if (!part || !target || !actual) return;
        setLogs(prev => [{id: Date.now(), part, target: parseFloat(target), actual: parseFloat(actual), date: new Date().toLocaleTimeString()}, ...prev]);
        setPart(''); setTarget(''); setActual('');
    };

    return (
        <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border space-y-4">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-3">
                <ShieldCheckIcon className="text-green-400" /> Physical QC Log (Digital Calipers)
            </h3>
            <p className="text-sm text-brand-text-secondary">Track manufacturing deviations for technical portfolio evidence.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input type="text" value={part} onChange={e => setPart(e.target.value)} placeholder="Part (e.g. Front Axle)" className="p-2 bg-brand-dark border border-brand-border rounded-lg text-sm" />
                <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="CAD Target (mm)" className="p-2 bg-brand-dark border border-brand-border rounded-lg text-sm" />
                <input type="number" value={actual} onChange={e => setActual(e.target.value)} placeholder="Measured (mm)" className="p-2 bg-brand-dark border border-brand-border rounded-lg text-sm" />
                <button onClick={addLog} className="bg-brand-accent text-brand-dark font-bold rounded-lg text-sm">Log Measurement</button>
            </div>
            <div className="space-y-2 mt-4">
                {logs.map(log => (
                    <div key={log.id} className="p-3 bg-brand-dark rounded-lg flex justify-between items-center text-xs border border-brand-border">
                        <span className="font-bold">{log.part}</span>
                        <span className="text-brand-text-secondary">Diff: <span className={Math.abs(log.target - log.actual) > 0.05 ? 'text-red-400' : 'text-green-400'}>{(log.actual - log.target).toFixed(3)}mm</span></span>
                        <span className="opacity-50">{log.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProcurementTracker: React.FC = () => {
    const items = [
        { name: 'Ceramic Bearings', stock: 12, status: 'In-House' },
        { name: 'SLS Nylon Stock', stock: 3, status: 'Ordered' },
        { name: 'CO2 Canisters', stock: 45, status: 'Critical' },
    ];
    return (
        <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border space-y-4">
            <h3 className="text-xl font-bold text-brand-text flex items-center gap-3">
                <PackageIcon className="text-yellow-400" /> Inventory & Logistics Manager
            </h3>
            <p className="text-sm text-brand-text-secondary">Coordinate physical assets for the race season.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map(item => (
                    <div key={item.name} className="p-4 bg-brand-dark rounded-xl border border-brand-border">
                        <p className="text-xs font-bold text-brand-text-secondary uppercase">{item.name}</p>
                        <p className="text-2xl font-black text-brand-text">{item.stock}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-brand-accent/20 text-brand-accent'}`}>{item.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PressKitComposer: React.FC = () => (
    <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border space-y-4">
        <h3 className="text-xl font-bold text-brand-text flex items-center gap-3">
            <FileTextIcon className="text-blue-400" /> Press Kit & Talking Points
        </h3>
        <p className="text-sm text-brand-text-secondary">Draft standardized responses for judging interviews and media.</p>
        <div className="space-y-3">
            <div className="p-3 bg-brand-dark border-l-4 border-brand-accent rounded">
                <p className="text-xs font-bold text-brand-accent">Q: What is the main innovation of the BR-03?</p>
                <p className="text-sm text-brand-text mt-1 italic">"We implemented a 2nd-order upwind solver with GNN calibration to bridge the reality gap between CFD and track performance."</p>
            </div>
            <button className="w-full py-2 bg-brand-surface border border-brand-border rounded-lg text-xs font-bold hover:bg-brand-border transition-colors">Generate New Briefing</button>
        </div>
    </div>
);

const BrandAssetLibrary: React.FC = () => (
    <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border space-y-4">
        <h3 className="text-xl font-bold text-brand-text flex items-center gap-3">
            <PaletteIcon className="text-pink-400" /> Brand Style Vault
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['#0D1117', '#00BFFF', '#FFFFFF', '#161B22'].map(c => (
                <div key={c} className="p-2 bg-brand-dark rounded border border-brand-border flex items-center gap-2">
                    <div className="w-6 h-6 rounded border border-white/10" style={{backgroundColor: c}}></div>
                    <span className="text-[10px] font-mono text-brand-text-secondary">{c}</span>
                </div>
            ))}
        </div>
        <p className="text-xs text-brand-text-secondary bg-brand-dark p-2 rounded italic">Tip: Use 2.5mm safe zones for all CNC-engraved sponsor logos on the car chassis.</p>
    </div>
);

const ToolboxPage: React.FC = () => {
  const { user } = useAuth();

  const renderPrimaryTool = () => {
      switch(user?.role) {
          case UserRole.ManufacturingEngineer: return <ManufacturingQCTool />;
          case UserRole.ResourcesManager: return <ProcurementTracker />;
          case UserRole.MarketingManager: return <PressKitComposer />;
          case UserRole.GraphicDesigner: return <BrandAssetLibrary />;
          case UserRole.DesignEngineer: return <AiRenderTool />;
          case UserRole.ProjectManager: return <div className="p-8 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl text-center"><h3 className="text-xl font-bold text-brand-accent">Project Manager Override</h3><p className="text-sm text-brand-text-secondary mt-2">You have access to all specialized utilities below.</p></div>;
          default: return null;
      }
  };

  const showUniversalTools = user?.role === UserRole.ProjectManager || user?.role === UserRole.DesignEngineer || user?.role === UserRole.ManufacturingEngineer;

  return (
    <div className="animate-fade-in space-y-10">
      <header>
          <h1 className="text-4xl font-black text-brand-text tracking-tighter">THE SUITE</h1>
          <p className="text-brand-text-secondary text-lg mt-1 font-medium">Role-optimized engineering and enterprise utilities.</p>
      </header>
      
      <div className="space-y-8 max-w-6xl">
        {/* Primary Role-Specific Utility */}
        <section className="animate-slide-in-up">
            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-3 px-1">Primary Pillar Utility</p>
            <ErrorBoundary>
                {renderPrimaryTool()}
            </ErrorBoundary>
        </section>

        {/* Secondary Universal Utilities */}
        {showUniversalTools && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                     <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest px-1">Dimensional & Math Labs</p>
                    <ErrorBoundary>
                        <UnitConverter />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <WeightBalanceCalculator />
                    </ErrorBoundary>
                </div>
                <div className="space-y-8">
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest px-1">Regulatory Lab</p>
                    <ErrorBoundary>
                        <InteractiveChecklist />
                    </ErrorBoundary>
                </div>
            </section>
        )}

        {/* Catch-all for non-engineering users to see visual tools */}
        {/* Fix: Remove redundant comparison user?.role !== UserRole.DesignEngineer to resolve the type overlap error */}
        {(user?.role === UserRole.ProjectManager || user?.role === UserRole.GraphicDesigner || user?.role === UserRole.MarketingManager) && (
             <section>
                 <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-3 px-1">Media Lab</p>
                 <ErrorBoundary>
                     <AiRenderTool />
                 </ErrorBoundary>
             </section>
        )}
      </div>
    </div>
  );
};

export default ToolboxPage;
