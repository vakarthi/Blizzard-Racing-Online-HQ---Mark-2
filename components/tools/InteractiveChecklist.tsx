import React, { useState } from 'react';
import { F1_IN_SCHOOLS_RULES } from '../../services/mockData';
import { CheckSquareIcon } from '../icons';

const InteractiveChecklist: React.FC = () => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleToggle = (ruleId: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [ruleId]: !prev[ruleId],
        }));
    };
    
    const resetChecklist = () => {
        setCheckedItems({});
    }

    const totalItems = F1_IN_SCHOOLS_RULES.length;
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    return (
        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full flex flex-col">
            <div className="flex items-center mb-4">
                <CheckSquareIcon className="w-6 h-6 mr-3 text-brand-accent"/>
                <h2 className="text-xl font-bold text-brand-text">Interactive Scrutineering Checklist</h2>
            </div>
             <p className="text-sm text-brand-text-secondary mb-4">Use this tool to informally check for compliance against the key dimensional regulations.</p>

            <div className="mb-4">
                 <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-semibold text-brand-text">Progress</span>
                    <span className="text-sm font-bold text-brand-text-secondary">{completedItems} / {totalItems}</span>
                </div>
                <div className="w-full bg-brand-dark rounded-full h-2.5">
                    <div className="bg-brand-accent h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="space-y-2 flex-grow overflow-y-auto pr-2">
                {F1_IN_SCHOOLS_RULES.map(rule => (
                    <label key={rule.id} className={`flex items-start p-3 rounded-lg cursor-pointer border transition-colors ${checkedItems[rule.id] ? 'bg-green-500/10 border-green-500/30' : 'bg-brand-dark border-brand-border hover:border-brand-accent/30'}`}>
                        <input
                            type="checkbox"
                            checked={!!checkedItems[rule.id]}
                            onChange={() => handleToggle(rule.id)}
                            className="mt-1 h-4 w-4 rounded border-brand-border text-brand-accent focus:ring-brand-accent bg-brand-dark"
                        />
                        <div className="ml-3 text-sm">
                            <p className={`font-medium ${checkedItems[rule.id] ? 'text-green-300' : 'text-brand-text'}`}>{rule.id}: {rule.description}</p>
                            <p className="text-brand-text-secondary">
                                {'min' in rule && `Min: ${rule.min}${rule.unit} `}
                                {'max' in rule && `Max: ${rule.max}${rule.unit}`}
                            </p>
                        </div>
                    </label>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border text-right">
                <button onClick={resetChecklist} className="text-sm font-semibold text-brand-accent hover:underline">Reset Checklist</button>
            </div>
        </div>
    );
};

export default InteractiveChecklist;