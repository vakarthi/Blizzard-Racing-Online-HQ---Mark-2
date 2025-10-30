import React, { useState, useMemo } from 'react';
import { ScaleIcon, PlusCircleIcon, TrashIcon } from '../icons';

interface Component {
  id: number;
  name: string;
  weight: string; // use string to handle empty input
  position: string; // use string to handle empty input
}

const WeightBalanceCalculator: React.FC = () => {
    const [components, setComponents] = useState<Component[]>([
        { id: 1, name: 'Chassis', weight: '35', position: '100' },
        { id: 2, name: 'Front Wing Assembly', weight: '8', position: '10' },
        { id: 3, name: 'Rear Wing Assembly', weight: '7', position: '190' },
        { id: 4, name: 'Wheels (Set of 4)', weight: '12', position: '105' },
    ]);
    const [wheelbase, setWheelbase] = useState('200');

    const handleComponentChange = (id: number, field: keyof Omit<Component, 'id'>, value: string) => {
        setComponents(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const addComponent = () => {
        setComponents(prev => [...prev, { id: Date.now(), name: '', weight: '', position: '' }]);
    };
    
    const removeComponent = (id: number) => {
        setComponents(prev => prev.filter(c => c.id !== id));
    };

    const { totalWeight, centerOfMass, frontWeight, rearWeight, frontDistribution, rearDistribution } = useMemo(() => {
        const validComponents = components.filter(c => c.weight && c.position);
        const wb = parseFloat(wheelbase);
        if (validComponents.length === 0 || isNaN(wb) || wb <= 0) {
            return { totalWeight: 0, centerOfMass: 0, frontWeight: 0, rearWeight: 0, frontDistribution: 0, rearDistribution: 0 };
        }

        const totalWeight = validComponents.reduce((sum, c) => sum + parseFloat(c.weight), 0);
        const totalMoment = validComponents.reduce((sum, c) => sum + (parseFloat(c.weight) * parseFloat(c.position)), 0);
        
        const centerOfMass = totalWeight > 0 ? totalMoment / totalWeight : 0;

        // Weight distribution calculation (assuming datum is front axle)
        const rearWeight = totalMoment / wb;
        const frontWeight = totalWeight - rearWeight;
        const frontDistribution = totalWeight > 0 ? (frontWeight / totalWeight) * 100 : 0;
        const rearDistribution = totalWeight > 0 ? (rearWeight / totalWeight) * 100 : 0;

        return {
            totalWeight,
            centerOfMass,
            frontWeight,
            rearWeight,
            frontDistribution,
            rearDistribution,
        };
    }, [components, wheelbase]);

    return (
        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full flex flex-col">
            <div className="flex items-center mb-4">
                <ScaleIcon className="w-6 h-6 mr-3 text-brand-accent"/>
                <h2 className="text-xl font-bold text-brand-text">Weight & Balance Calculator</h2>
            </div>
            <div className="flex-grow space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-brand-text-secondary">Wheelbase (mm)</label>
                    <input type="number" value={wheelbase} onChange={e => setWheelbase(e.target.value)} placeholder="e.g., 200" className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-brand-text">Components</h3>
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                    {components.map(c => (
                        <div key={c.id} className="flex gap-2 items-center">
                            <input type="text" placeholder="Name" value={c.name} onChange={e => handleComponentChange(c.id, 'name', e.target.value)} className="w-2/5 p-1 bg-brand-dark border border-brand-border rounded-md text-sm" />
                            <input type="number" placeholder="Weight (g)" value={c.weight} onChange={e => handleComponentChange(c.id, 'weight', e.target.value)} className="w-1/4 p-1 bg-brand-dark border border-brand-border rounded-md text-sm" />
                            <input type="number" placeholder="Pos (mm)" value={c.position} onChange={e => handleComponentChange(c.id, 'position', e.target.value)} className="w-1/4 p-1 bg-brand-dark border border-brand-border rounded-md text-sm" />
                            <button onClick={() => removeComponent(c.id)} className="text-red-400 p-1 rounded-full hover:bg-red-500/20"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                    </div>
                     <button onClick={addComponent} className="text-sm text-brand-accent hover:underline flex items-center gap-1"><PlusCircleIcon className="w-4 h-4"/> Add Component</button>
                </div>

                <div className="border-t border-brand-border pt-4 space-y-3">
                    <h3 className="text-lg font-semibold text-brand-text">Results</h3>
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-brand-dark p-3 rounded-lg"><p className="text-xs text-brand-text-secondary">Total Weight</p><p className="font-bold text-lg">{totalWeight.toFixed(2)} g</p></div>
                        <div className="bg-brand-dark p-3 rounded-lg"><p className="text-xs text-brand-text-secondary">Center of Mass</p><p className="font-bold text-lg">{centerOfMass.toFixed(2)} mm</p></div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-brand-text text-center mb-1">Weight Distribution</p>
                        <div className="flex w-full h-8 bg-brand-dark rounded-lg overflow-hidden border border-brand-border">
                            <div className="bg-blue-500 flex items-center justify-center text-xs font-bold" style={{width: `${frontDistribution > 0 ? frontDistribution : 0}%`}}>{frontDistribution.toFixed(1)}%</div>
                            <div className="bg-purple-500 flex items-center justify-center text-xs font-bold" style={{width: `${rearDistribution > 0 ? rearDistribution : 0}%`}}>{rearDistribution.toFixed(1)}%</div>
                        </div>
                        <div className="flex justify-between text-xs mt-1 px-1">
                            <span className="text-blue-400">Front: {frontWeight.toFixed(2)}g</span>
                            <span className="text-purple-400">Rear: {rearWeight.toFixed(2)}g</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeightBalanceCalculator;
