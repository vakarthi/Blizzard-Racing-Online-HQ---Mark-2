
import React, { useState, useMemo } from 'react';
import { CalculatorIcon } from '../icons';

type Unit = {
    name: string;
    factor: number; // Factor to convert from a base unit
};

const CONVERSION_CATEGORIES = {
    length: {
        baseUnit: 'mm',
        units: {
            mm: { name: 'Millimeters', factor: 1 },
            cm: { name: 'Centimeters', factor: 10 },
            m: { name: 'Meters', factor: 1000 },
            in: { name: 'Inches', factor: 25.4 },
            ft: { name: 'Feet', factor: 304.8 },
        },
    },
    weight: {
        baseUnit: 'g',
        units: {
            g: { name: 'Grams', factor: 1 },
            kg: { name: 'Kilograms', factor: 1000 },
            oz: { name: 'Ounces', factor: 28.3495 },
            lb: { name: 'Pounds', factor: 453.592 },
        },
    },
    pressure: {
        baseUnit: 'psi',
        units: {
            psi: { name: 'PSI', factor: 1 },
            bar: { name: 'Bar', factor: 14.5038 },
            kpa: { name: 'kPa', factor: 0.145038 },
            atm: { name: 'Atmospheres', factor: 14.696 },
        },
    },
};

const UnitConverter: React.FC = () => {
    const [category, setCategory] = useState<keyof typeof CONVERSION_CATEGORIES>('length');
    const [inputValue, setInputValue] = useState('1');
    
    const { units, baseUnit } = CONVERSION_CATEGORIES[category];
    const unitKeys = Object.keys(units);
    
    const [fromUnit, setFromUnit] = useState(unitKeys[0]);
    const [toUnit, setToUnit] = useState(unitKeys[1]);

    const result = useMemo(() => {
        const value = parseFloat(inputValue);
        if (isNaN(value)) return 'Invalid Input';
        
        const safeUnits = units as Record<string, Unit>;
        const fromFactor = safeUnits[fromUnit].factor;
        const toFactor = safeUnits[toUnit].factor;
        
        // Convert input value to base unit, then to target unit
        const valueInBase = value * fromFactor;
        const convertedValue = valueInBase / toFactor;

        return convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }, [inputValue, fromUnit, toUnit, category, units]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as keyof typeof CONVERSION_CATEGORIES;
        setCategory(newCategory);
        const newUnitKeys = Object.keys(CONVERSION_CATEGORIES[newCategory].units);
        setFromUnit(newUnitKeys[0]);
        setToUnit(newUnitKeys[1]);
    };
    
    return (
        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border h-full">
            <div className="flex items-center mb-4">
                <CalculatorIcon className="w-6 h-6 mr-3 text-brand-accent"/>
                <h2 className="text-xl font-bold text-brand-text">Unit Converter</h2>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-brand-text-secondary">Category</label>
                    <select value={category} onChange={handleCategoryChange} className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg">
                        <option value="length">Length</option>
                        <option value="weight">Weight</option>
                        <option value="pressure">Pressure</option>
                    </select>
                </div>
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-brand-text-secondary">From</label>
                        <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg" />
                        <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg text-sm">
                           {Object.entries(units as Record<string, Unit>).map(([key, unit]) => <option key={key} value={key}>{unit.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-brand-text-secondary">To</label>
                         <div className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg font-bold text-lg">{result}</div>
                         <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full mt-1 p-2 bg-brand-dark border border-brand-border rounded-lg text-sm">
                           {Object.entries(units as Record<string, Unit>).map(([key, unit]) => <option key={key} value={key}>{unit.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitConverter;
