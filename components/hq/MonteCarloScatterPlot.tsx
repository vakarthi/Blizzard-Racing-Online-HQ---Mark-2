
import React, { useMemo, useState } from 'react';
import { AeroResult, MonteCarloPoint } from '../../types';

interface MonteCarloScatterPlotProps {
  result: AeroResult;
  height?: number;
}

const MonteCarloScatterPlot: React.FC<MonteCarloScatterPlotProps> = ({ result, height = 360 }) => {
    const [hoveredPoint, setHoveredPoint] = useState<MonteCarloPoint | null>(null);
    const pred = result.raceTimePrediction;
    
    if (!pred || !pred.sampledPoints) return null;

    const padding = { top: 40, right: 60, bottom: 60, left: 80 };
    const width = 800;

    const points = pred.sampledPoints;
    
    // Calculate precise bounds for the scatter plot
    const times = points.map(p => p.time);
    const speeds = points.map(p => p.startSpeed);
    
    const minTime = Math.min(...times) * 0.995;
    const maxTime = Math.max(...times) * 1.005;
    
    // Dynamic Speed Bounds: Handles velocities up to and beyond 101 km/h
    const minSpeed = Math.min(...speeds) * 0.95;
    const maxSpeed = Math.max(...speeds) * 1.05;

    const getX = (t: number) => padding.left + ((t - minTime) / (maxTime - minTime)) * (width - padding.left - padding.right);
    const getY = (s: number) => height - padding.bottom - ((s - minSpeed) / (maxSpeed - minSpeed)) * (height - padding.top - padding.bottom);

    return (
        <div className="relative bg-brand-dark/80 rounded-xl border border-brand-border p-4 w-full shadow-2xl overflow-hidden group">
            <div className="flex justify-between items-center mb-6 px-2">
                <div>
                    <h4 className="text-[11px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                        Monte Carlo Performance Cloud
                    </h4>
                    <p className="text-[9px] text-brand-text-secondary uppercase mt-0.5">Time vs. Sampling Velocity @ 5.0m</p>
                </div>
                <div className="bg-brand-dark border border-brand-border px-3 py-1 rounded text-[10px] font-bold text-brand-text-secondary">
                    N=100,000 (Sampled Dist.)
                </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                {/* Background Grid */}
                {[0, 0.25, 0.5, 0.75, 1].map(v => {
                    const y = height - padding.bottom - v * (height - padding.top - padding.bottom);
                    const x = padding.left + v * (width - padding.left - padding.right);
                    return (
                        <React.Fragment key={v}>
                            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeOpacity="0.05" />
                            <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="var(--color-border)" strokeWidth="1" strokeOpacity="0.05" />
                        </React.Fragment>
                    );
                })}

                {/* X Axis Labels (Time) */}
                {[0, 0.5, 1].map(v => {
                    const time = minTime + v * (maxTime - minTime);
                    const x = getX(time);
                    return (
                        <g key={v}>
                            <text x={x} y={height - padding.bottom + 20} fill="var(--color-text-secondary)" fontSize="11" fontWeight="bold" textAnchor="middle">{time.toFixed(3)}s</text>
                            <line x1={x} y1={height - padding.bottom} x2={x} y2={height - padding.bottom + 6} stroke="var(--color-border)" strokeWidth="1.5" />
                        </g>
                    );
                })}

                {/* Y Axis Labels (Start Speed) - Calibrated for high velocities */}
                {[0, 0.5, 1].map(v => {
                    const speed = minSpeed + v * (maxSpeed - minSpeed);
                    const y = getY(speed);
                    return (
                        <g key={v}>
                            <text x={padding.left - 15} y={y} fill="var(--color-text-secondary)" fontSize="11" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">{(speed * 3.6).toFixed(1)}</text>
                            <line x1={padding.left - 6} y1={y} x2={padding.left} y2={y} stroke="var(--color-border)" strokeWidth="1.5" />
                        </g>
                    );
                })}

                {/* Expected Value Intersection */}
                <line x1={getX(pred.averageRaceTime)} y1={padding.top} x2={getX(pred.averageRaceTime)} y2={height - padding.bottom} stroke="var(--color-accent-default)" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.3" />
                <line x1={padding.left} y1={getY(pred.averageStartSpeed)} x2={width - padding.right} y2={getY(pred.averageStartSpeed)} stroke="var(--color-accent-default)" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.3" />

                {/* The Cloud (Scatter Points) */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={getX(p.time)}
                        cy={getY(p.startSpeed)}
                        r="3.5"
                        fill="var(--color-accent-default)"
                        fillOpacity="0.14"
                        className="hover:r-5 hover:fill-opacity-100 transition-all cursor-crosshair hover:stroke-white hover:stroke-1"
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                    />
                ))}

                {/* Legend/Axes Titles */}
                <text x={width/2} y={height - 10} fill="var(--color-text-secondary)" fontSize="11" fontWeight="black" textAnchor="middle" className="uppercase tracking-[0.3em]">Cumulative Race Time (s)</text>
                <text x={20} y={height/2} fill="var(--color-text-secondary)" fontSize="11" fontWeight="black" textAnchor="middle" transform={`rotate(-90 20 ${height/2})`} className="uppercase tracking-[0.3em]">Launch Velocity (km/h)</text>

                {/* Tooltip Overlay */}
                {hoveredPoint && (
                    <g transform={`translate(${getX(hoveredPoint.time)}, ${getY(hoveredPoint.startSpeed)})`}>
                        <circle r="5" fill="white" stroke="var(--color-accent-default)" strokeWidth="2" />
                        <g transform="translate(15, -50)">
                            <rect width="135" height="45" fill="rgba(13,17,23,0.98)" rx="8" stroke="var(--color-accent-default)" strokeWidth="1.5" className="shadow-xl" />
                            <text x="12" y="18" fill="white" fontSize="10" fontWeight="black" className="uppercase">Iteration D-{(hoveredPoint.time * 1000).toFixed(0)}</text>
                            <text x="12" y="32" fill="var(--color-accent-default)" fontSize="12" fontWeight="bold">{(hoveredPoint.startSpeed * 3.6).toFixed(2)} km/h</text>
                            <text x="125" y="32" fill="var(--color-text-secondary)" fontSize="10" textAnchor="end">{hoveredPoint.time.toFixed(4)}s</text>
                        </g>
                    </g>
                )}
            </svg>

            <div className="mt-8 grid grid-cols-4 gap-4 px-2">
                <div className="bg-brand-dark p-3 rounded-xl border border-brand-border group-hover:border-brand-accent/30 transition-colors">
                    <p className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-widest mb-1">Consistency</p>
                    <p className="text-xl font-mono font-bold text-green-400">{(100 - (pred.stdDevTime || 0) * 800).toFixed(1)}%</p>
                </div>
                <div className="bg-brand-dark p-3 rounded-xl border border-brand-border group-hover:border-brand-accent/30 transition-colors">
                    <p className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-widest mb-1">Peak Velocity</p>
                    <p className="text-xl font-mono font-bold text-brand-accent">{(pred.bestFinishLineSpeed * 3.6).toFixed(1)} <span className="text-[10px]">km/h</span></p>
                </div>
                <div className="bg-brand-dark p-3 rounded-xl border border-brand-border group-hover:border-brand-accent/30 transition-colors">
                    <p className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-widest mb-1">μ Velocity</p>
                    <p className="text-xl font-mono font-bold text-brand-text">{(pred.averageStartSpeed * 3.6).toFixed(1)} <span className="text-[10px]">km/h</span></p>
                </div>
                <div className="bg-brand-dark p-3 rounded-xl border border-brand-border group-hover:border-brand-accent/30 transition-colors">
                    <p className="text-[10px] text-brand-text-secondary uppercase font-bold tracking-widest mb-1">μ Race Time</p>
                    <p className="text-xl font-mono font-bold text-yellow-400">{pred.averageRaceTime.toFixed(3)}s</p>
                </div>
            </div>
        </div>
    );
};

export default MonteCarloScatterPlot;
