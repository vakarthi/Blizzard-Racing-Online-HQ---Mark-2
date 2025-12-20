
import React, { useMemo, useState } from 'react';
import { AeroResult } from '../../types';

interface SpeedTimeGraphProps {
  result: AeroResult | AeroResult[];
  height?: number;
  showTitle?: boolean;
}

const SpeedTimeGraph: React.FC<SpeedTimeGraphProps> = ({ result, height = 280, showTitle = true }) => {
  const [unit, setUnit] = useState<'ms' | 'kmh'>('kmh');
  const [hoveredPoint, setHoveredPoint] = useState<{ time: number; speed: number; x: number; y: number; carName: string; color: string } | null>(null);

  const results = Array.isArray(result) ? result : [result];
  const padding = { top: 40, right: 40, bottom: 40, left: 60 };
  const width = 800;
  const steps = 60;

  const curves = useMemo(() => {
    const colors = ['#00BFFF', '#A78BFA', '#4ADE80', '#FBBF24', '#F472B6'];
    
    return results.map((res, idx) => {
      const points: { time: number; speed: number }[] = [];
      const pred = res.raceTimePrediction;
      if (!pred) return { id: res.id, name: res.fileName, color: colors[idx % colors.length], points: [] };

      const totalTime = pred.averageRaceTime;
      const finalSpeed = pred.averageFinishLineSpeed;

      // Physics-based curve: initial high acceleration decaying as drag increases
      // v(t) = v_max * (1 - e^(-k*t))
      const k = 6.5; 
      for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * totalTime;
          const rawSpeed = finalSpeed * (1 - Math.exp(-k * (t / totalTime)));
          // Add micro-jitter for "simulated data" feel
          const jitter = (Math.sin(t * 25) * 0.03) * (t / totalTime);
          points.push({ time: t, speed: Math.max(0, rawSpeed + jitter) });
      }
      
      return {
        id: res.id,
        name: res.fileName,
        color: colors[idx % colors.length],
        points
      };
    });
  }, [results]);

  const maxTime = Math.max(...curves.flatMap(c => c.points.map(p => p.time)), 1.5);
  const maxSpeedRaw = Math.max(...curves.flatMap(c => c.points.map(p => p.speed)), 20);
  const displayFactor = unit === 'kmh' ? 3.6 : 1;
  const maxSpeed = maxSpeedRaw * displayFactor;

  const getX = (t: number) => padding.left + (t / maxTime) * (width - padding.left - padding.right);
  const getY = (s: number) => height - padding.bottom - ((s * displayFactor) / (maxSpeed * 1.1)) * (height - padding.top - padding.bottom);

  return (
    <div className="relative bg-brand-dark/40 rounded-xl border border-brand-border p-4 w-full overflow-hidden shadow-inner group">
      <div className="flex justify-between items-center mb-6">
        {showTitle && (
            <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m19 9-7 7-7-7"/></svg>
                Velocity Profile Analysis
            </h4>
        )}
        <div className="flex bg-brand-dark rounded-md border border-brand-border p-0.5 ml-auto">
            <button 
                onClick={() => setUnit('ms')} 
                className={`px-3 py-1 text-[10px] font-bold rounded transition-colors ${unit === 'ms' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}
            >
                M/S
            </button>
            <button 
                onClick={() => setUnit('kmh')} 
                className={`px-3 py-1 text-[10px] font-bold rounded transition-colors ${unit === 'kmh' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}
            >
                KM/H
            </button>
        </div>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Grid lines */}
        {[0, 0.5, 1].map(pct => {
          const y = height - padding.bottom - pct * (height - padding.top - padding.bottom);
          return <line key={pct} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeOpacity="0.2" />;
        })}

        {/* X Axis Labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
            const timeVal = t * maxTime;
            return (
                <g key={t}>
                    <text x={getX(timeVal)} y={height - padding.bottom + 18} fill="var(--color-text-secondary)" fontSize="10" fontWeight="bold" textAnchor="middle">{timeVal.toFixed(2)}s</text>
                    <line x1={getX(timeVal)} y1={height - padding.bottom} x2={getX(timeVal)} y2={height - padding.bottom + 5} stroke="var(--color-border)" strokeWidth="1" />
                </g>
            );
        })}

        {/* Y Axis Labels */}
        {[0, 0.5, 1].map(v => {
            const speedVal = v * maxSpeed;
            return <text key={v} x={padding.left - 10} y={getY(speedVal / displayFactor)} fill="var(--color-text-secondary)" fontSize="10" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">{speedVal.toFixed(0)}</text>;
        })}

        {/* Acceleration Curves */}
        {curves.map(curve => (
            <g key={curve.id}>
                <path
                    d={curve.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.time)} ${getY(p.speed)}`).join(' ')}
                    fill="none"
                    stroke={curve.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(0,191,255,0.3)] transition-all duration-300 group-hover:opacity-40 hover:!opacity-100 hover:!stroke-width-[4px]"
                />
                {/* Interaction zones */}
                {curve.points.map((p, i) => (
                    <rect
                        key={i}
                        x={getX(p.time) - (width/steps/2)}
                        y={padding.top}
                        width={width/steps}
                        height={height - padding.top - padding.bottom}
                        fill="transparent"
                        onMouseEnter={() => setHoveredPoint({ time: p.time, speed: p.speed, x: getX(p.time), y: getY(p.speed), carName: curve.name, color: curve.color })}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="cursor-crosshair"
                    />
                ))}
            </g>
        ))}

        {/* Axis Labels */}
        <text x={width/2} y={height - 5} fill="var(--color-text-secondary)" fontSize="10" fontWeight="black" textAnchor="middle" className="uppercase tracking-widest">Race Time (Elapsed)</text>
        <text x={15} y={height/2} fill="var(--color-text-secondary)" fontSize="10" fontWeight="black" textAnchor="middle" transform={`rotate(-90 15 ${height/2})`} className="uppercase tracking-widest">
            Velocity ({unit === 'kmh' ? 'km/h' : 'm/s'})
        </text>

        {/* Active Tooltip */}
        {hoveredPoint && (
          <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y})`}>
            <circle r="5" fill={hoveredPoint.color} stroke="white" strokeWidth="2" />
            <g transform="translate(10, -50)">
                <rect width="120" height="50" fill="rgba(13,17,23,0.95)" rx="6" stroke={hoveredPoint.color} strokeWidth="1" />
                <text x="10" y="18" fill="white" fontSize="10" fontWeight="black">{hoveredPoint.carName}</text>
                <text x="10" y="32" fill={hoveredPoint.color} fontSize="12" fontWeight="bold">
                    {(hoveredPoint.speed * displayFactor).toFixed(2)} {unit === 'kmh' ? 'km/h' : 'm/s'}
                </text>
                <text x="10" y="42" fill="var(--color-text-secondary)" fontSize="9">@ {hoveredPoint.time.toFixed(3)}s</text>
            </g>
            <line x1="0" y1={-hoveredPoint.y + padding.top} x2="0" y2={height - padding.bottom - hoveredPoint.y} stroke={hoveredPoint.color} strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
          </g>
        )}
      </svg>
      
      {results.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
              {curves.map(c => (
                  <div key={c.id} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                      <span className="text-[10px] font-bold text-brand-text-secondary uppercase">{c.name}</span>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default SpeedTimeGraph;
