
import React from 'react';
import { ResidualData } from '../../types';

interface ConvergenceGraphProps {
  history: ResidualData[];
  height?: number;
}

const ConvergenceGraph: React.FC<ConvergenceGraphProps> = ({ history, height = 300 }) => {
  if (!history || history.length === 0) {
    return (
        <div className="flex items-center justify-center bg-brand-dark rounded-xl border border-brand-border h-[300px]">
            <p className="text-brand-text-secondary text-sm">No convergence data available for this run.</p>
        </div>
    )
  }

  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const width = 800;
  
  // Find min/max for scaling (Log Scale for Y)
  const maxIter = history[history.length - 1].iteration;
  
  // Flatten all values to find bounds
  const allValues = history.flatMap(h => [h.continuity, h.xVelocity, h.yVelocity, h.zVelocity]);
  const minVal = Math.min(...allValues.filter(v => v > 0)) || 1e-6;
  const maxVal = Math.max(...allValues) || 1e-1;
  
  const logMin = Math.log10(minVal);
  const logMax = Math.log10(maxVal);
  const logRange = logMax - logMin;

  const getX = (iter: number) => padding.left + (iter / maxIter) * (width - padding.left - padding.right);
  const getY = (val: number) => {
      const logVal = Math.log10(Math.max(val, Number.EPSILON));
      return height - padding.bottom - ((logVal - logMin) / logRange) * (height - padding.top - padding.bottom);
  };

  const createPath = (key: keyof Omit<ResidualData, 'iteration'>, color: string) => {
      const pathData = history.map((point, i) => 
          `${i === 0 ? 'M' : 'L'} ${getX(point.iteration)} ${getY(point[key])}`
      ).join(' ');
      return <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />;
  };

  return (
    <div className="relative bg-brand-dark rounded-xl border border-brand-border p-4 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Residual Convergence (Log Scale)</h4>
          <div className="flex gap-4 text-[10px] font-bold">
              <span className="text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> Continuity</span>
              <span className="text-blue-400 flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> X-Momentum</span>
              <span className="text-purple-400 flex items-center gap-1"><span className="w-2 h-2 bg-purple-400 rounded-full"></span> Y-Momentum</span>
          </div>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Grid and Y-Axis Labels (Log) */}
        {[1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6].map((val) => {
            if (val < minVal || val > maxVal * 10) return null;
            const y = getY(val);
            return (
                <g key={val}>
                    <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeOpacity="0.2" />
                    <text x={padding.left - 10} y={y} fill="var(--color-text-secondary)" fontSize="10" textAnchor="end" alignmentBaseline="middle">10^{Math.log10(val)}</text>
                </g>
            )
        })}

        {/* X-Axis Labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
            const iter = Math.round(maxIter * pct);
            const x = getX(iter);
            return (
                <g key={pct}>
                    <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="var(--color-border)" strokeWidth="1" strokeOpacity="0.1" />
                    <text x={x} y={height - padding.bottom + 15} fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle">{iter}</text>
                </g>
            )
        })}

        {/* Data Paths */}
        {createPath('continuity', '#4ADE80')}
        {createPath('xVelocity', '#60A5FA')}
        {createPath('yVelocity', '#A78BFA')}
      </svg>
    </div>
  );
};

export default ConvergenceGraph;
