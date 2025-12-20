
import React, { useMemo, useState } from 'react';
/* Fix: AeroResult is used as a type; THEORETICAL_OPTIMUM was incorrectly imported from types and is not used in this file. */
import { AeroResult } from '../../types';

interface SpeedTimeGraphProps {
  result: AeroResult;
  height?: number;
}

const SpeedTimeGraph: React.FC<SpeedTimeGraphProps> = ({ result, height = 250 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ time: number; speed: number; x: number; y: number } | null>(null);

  const padding = { top: 30, right: 40, bottom: 40, left: 50 };
  const width = 600;
  /* Fix: Move steps constant to component scope so it's accessible in both useMemo and the JSX return. */
  const steps = 30;

  const curveData = useMemo(() => {
    const points: { time: number; speed: number }[] = [];
    const pred = result.raceTimePrediction;
    if (!pred) return [];

    const totalTime = pred.averageRaceTime;
    const finalSpeed = pred.averageFinishLineSpeed;

    // Simulate an acceleration curve: v(t) = V_final * (1 - e^(-k*t))
    // We calibrate 'k' such that the area under the curve (distance) is 20m at t = averageRaceTime.
    // However, a simpler approximation for visualization:
    // Most cars reach top speed quickly.
    
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * totalTime;
        // Approximation of high-acceleration burst followed by drag-limited plateau
        // Adjusted to hit the finish line speed and time correctly.
        const speed = finalSpeed * (1 - Math.exp(-4 * (t / totalTime))) * (1 + 0.1 * Math.sin(t*2)); 
        const calibratedSpeed = Math.min(speed, finalSpeed * (t/totalTime < 0.2 ? 1.2 : 1));
        
        points.push({ time: t, speed: Math.max(0, calibratedSpeed) });
    }
    
    // Ensure last point is exactly the average finish line speed
    points[points.length-1].speed = finalSpeed;

    return points;
  }, [result, steps]);

  const maxTime = Math.max(...curveData.map(p => p.time), 1.5);
  const maxSpeed = Math.max(...curveData.map(p => p.speed), 25);

  const getX = (t: number) => padding.left + (t / maxTime) * (width - padding.left - padding.right);
  const getY = (s: number) => height - padding.bottom - (s / maxSpeed) * (height - padding.top - padding.bottom);

  const pathData = curveData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.time)} ${getY(p.speed)}`).join(' ');

  return (
    <div className="relative bg-brand-dark/50 rounded-xl border border-brand-border p-4 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"><path d="m19 9-7 7-7-7"/></svg>
            Acceleration Profile (20m Sprint)
        </h4>
        <div className="text-[10px] font-mono text-brand-accent px-2 py-0.5 bg-brand-accent/10 border border-brand-accent/20 rounded">
            Average Speed: {result.raceTimePrediction?.averageSpeed.toFixed(2)} m/s
        </div>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = height - padding.bottom - pct * (height - padding.top - padding.bottom);
          const val = pct * maxSpeed;
          return (
            <g key={pct}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeOpacity="0.3" />
              <text x={padding.left - 10} y={y} fill="var(--color-text-secondary)" fontSize="10" textAnchor="end" alignmentBaseline="middle">{val.toFixed(0)}</text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {[0, 0.5, 1, 1.5].map(t => {
            if (t > maxTime + 0.2) return null;
            const x = getX(t);
            return (
                <text key={t} x={x} y={height - padding.bottom + 15} fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle">{t}s</text>
            );
        })}

        {/* The Curve */}
        <path
          d={pathData}
          fill="none"
          stroke="var(--color-accent-default)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(0,191,255,0.4)]"
        />

        {/* Interaction Areas */}
        {curveData.map((p, i) => (
            <rect
                key={i}
                /* Fix: steps is now in component scope and accessible here. */
                x={getX(p.time) - (width/steps/2)}
                y={padding.top}
                /* Fix: steps is now in component scope and accessible here. */
                width={width/steps}
                height={height - padding.top - padding.bottom}
                fill="transparent"
                onMouseEnter={() => setHoveredPoint({ time: p.time, speed: p.speed, x: getX(p.time), y: getY(p.speed) })}
                onMouseLeave={() => setHoveredPoint(null)}
            />
        ))}

        {/* Axis Labels */}
        <text x={width/2} y={height - 5} fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle">Time (seconds)</text>
        <text x={10} y={height/2} fill="var(--color-text-secondary)" fontSize="10" textAnchor="middle" transform={`rotate(-90 10 ${height/2})`}>Velocity (m/s)</text>

        {/* Tooltip */}
        {hoveredPoint && (
          <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y})`}>
            <circle r="4" fill="var(--color-accent-default)" />
            <g transform="translate(10, -30)">
                <rect width="70" height="25" fill="rgba(0,0,0,0.8)" rx="4" stroke="var(--color-border)" />
                <text x="35" y="15" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {hoveredPoint.speed.toFixed(2)} m/s
                </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default SpeedTimeGraph;
