
import React, { useMemo, useState } from 'react';
import { AeroResult } from '../../types';

interface PerformanceGraphProps {
  results: AeroResult[];
  height?: number;
}

const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ results, height = 300 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ car: string; speed: number; ld: number; x: number; y: number } | null>(null);

  const padding = { top: 40, right: 120, bottom: 50, left: 60 };
  const width = 800;

  // Generate curve data from results
  const curves = useMemo(() => {
    const colors = ['#00BFFF', '#A78BFA', '#4ADE80', '#FBBF24', '#F472B6'];
    
    return results.map((result, idx) => {
      let points = [];
      
      // Use real simulation data if available
      if (result.performanceCurve && result.performanceCurve.length > 0) {
          points = result.performanceCurve.map(p => ({
              speed: p.speed,
              ldRatio: p.ldRatio
          }));
      } else {
          // Fallback for older results (approximate physics)
          for (let speed = 5; speed <= 30; speed += 2.5) {
            const reEffect = 1 + (Math.log(speed / 10) * 0.05); 
            const ldRatio = result.liftToDragRatio * reEffect;
            points.push({ speed, ldRatio });
          }
      }
      
      return {
        id: result.id,
        name: result.fileName,
        color: colors[idx % colors.length],
        points,
        tier: result.tier
      };
    });
  }, [results]);

  const { minLd, maxLd } = useMemo(() => {
    let allLd = curves.flatMap(c => c.points.map(p => p.ldRatio));
    if (allLd.length === 0) return { minLd: 0, maxLd: 10 };
    return {
      minLd: Math.max(0, Math.min(...allLd) - 0.5),
      maxLd: Math.max(...allLd) + 0.5
    };
  }, [curves]);

  const getX = (speed: number) => padding.left + ((speed - 5) / 25) * (width - padding.left - padding.right);
  const getY = (ld: number) => height - padding.bottom - ((ld - minLd) / (maxLd - minLd)) * (height - padding.top - padding.bottom);

  return (
    <div className="relative bg-brand-dark rounded-xl border border-brand-border p-2 w-full overflow-hidden group">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = height - padding.bottom - pct * (height - padding.top - padding.bottom);
          const val = minLd + pct * (maxLd - minLd);
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeDasharray="4 4" strokeWidth="1" />
              <text x={padding.left - 10} y={y} fill="var(--color-text-secondary)" fontSize="12" textAnchor="end" alignmentBaseline="middle">{val.toFixed(1)}</text>
            </g>
          );
        })}

        {[5, 10, 15, 20, 25, 30].map(speed => {
          const x = getX(speed);
          return (
            <g key={speed}>
              <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="var(--color-border)" strokeDasharray="4 4" strokeWidth="1" />
              <text x={x} y={height - padding.bottom + 20} fill="var(--color-text-secondary)" fontSize="12" textAnchor="middle">{speed} m/s</text>
            </g>
          );
        })}

        {/* Axes Labels */}
        <text x={width/2 - padding.right/2} y={height - 5} fill="var(--color-text-secondary)" fontSize="12" fontWeight="bold" textAnchor="middle">Velocity (m/s)</text>
        <text x={15} y={height/2} fill="var(--color-text-secondary)" fontSize="12" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 15 ${height/2})`}>L/D Ratio</text>

        {/* Curves */}
        {curves.map(curve => {
          if (curve.points.length === 0) return null;
          const pathData = curve.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.speed)} ${getY(p.ldRatio)}`).join(' ');
          return (
            <g key={curve.id}>
              <path
                d={pathData}
                fill="none"
                stroke={curve.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 group-hover:opacity-30 hover:!opacity-100 hover:!stroke-width-[5px] cursor-pointer"
              />
              {/* Interaction points (sampled) */}
              {curve.points.filter((_, i) => i % 2 === 0).map(p => (
                <circle
                  key={p.speed}
                  cx={getX(p.speed)}
                  cy={getY(p.ldRatio)}
                  r="4"
                  fill={curve.color}
                  className="cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity"
                  onMouseEnter={() => setHoveredPoint({ car: curve.name, speed: p.speed, ld: p.ldRatio, x: getX(p.speed), y: getY(p.ldRatio) })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${width - padding.right + 10}, ${padding.top})`}>
          {curves.map((curve, i) => (
            <g key={curve.id} transform={`translate(0, ${i * 25})`}>
              <rect width="12" height="12" fill={curve.color} rx="2" />
              <text x="20" y="10" fill="var(--color-text-default)" fontSize="10" className="font-bold truncate max-w-[80px]">
                {curve.name.length > 12 ? curve.name.substring(0, 10) + '..' : curve.name}
              </text>
            </g>
          ))}
        </g>

        {/* Tooltip */}
        {hoveredPoint && (
          <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y})`}>
            <circle r="6" fill="white" stroke={hoveredPoint.y > height/2 ? "black" : "white"} strokeWidth="2" />
            <g transform={`translate(10, ${hoveredPoint.y < height / 2 ? 10 : -50})`}>
                <rect width="130" height="45" fill="rgba(13,17,23,0.95)" rx="4" stroke="var(--color-border)" className="shadow-xl" />
                <text x="65" y="18" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" className="truncate w-full px-2">{hoveredPoint.car}</text>
                <text x="65" y="34" fill="var(--color-accent-default)" fontSize="10" textAnchor="middle">{hoveredPoint.speed}m/s : {hoveredPoint.ld.toFixed(3)} L/D</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default PerformanceGraph;
