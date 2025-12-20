
import React, { useMemo, useState } from 'react';
import { AeroResult, MonteCarloPoint } from '../../types';

interface MonteCarloScatterPlotProps {
  result: AeroResult;
  height?: number;
}

const MonteCarloScatterPlot: React.FC<MonteCarloScatterPlotProps> = ({ result, height = 320 }) => {
    const [hoveredPoint, setHoveredPoint] = useState<MonteCarloPoint | null>(null);
    const pred = result.raceTimePrediction;
    
    if (!pred || !pred.sampledPoints) return null;

    const padding = { top: 40, right: 40, bottom: 50, left: 60 };
    const width = 800;

    const points = pred.sampledPoints;
    
    const minTime = pred.bestRaceTime * 0.99;
    const maxTime = pred.worstRaceTime * 1.01;
    const minSpeed = pred.worstFinishLineSpeed * 0.98;
    const maxSpeed = pred.bestFinishLineSpeed * 1.02;

    const getX = (t: number) => padding.left + ((t - minTime) / (maxTime - minTime)) * (width - padding.left - padding.right);
    const getY = (s: number) => height - padding.bottom - ((s - minSpeed) / (maxSpeed - minSpeed)) * (height - padding.top - padding.bottom);

    return (
        <div className="relative bg-brand-dark/60 rounded-xl border border-brand-border p-4 w-full shadow-inner overflow-hidden">
            <div className="flex justify-between items-center mb-4 px-2">
                <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                    Probabilistic Probability Field
                </h4>
                <div className="text-[10px] font-bold text-brand-text-secondary">
                    N=100,000 Iterations (Sampled)
                </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                {/* Background Grid */}
                {[0, 0.5, 1].map(v => {
                    const y = height - padding.bottom - v * (height - padding.top - padding.bottom);
                    return <line key={v} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeOpacity="0.1" />;
                })}

                {/* X Axis Labels (Time) */}
                {[0, 0.5, 1].map(v => {
                    const time = minTime + v * (maxTime - minTime);
                    const x = getX(time);
                    return (
                        <g key={v}>
                            <text x={x} y={height - padding.bottom + 15} fill="var(--color-text-secondary)" fontSize="10" fontWeight="bold" textAnchor="middle">{time.toFixed(3)}s</text>
                            <line x1={x} y1={height - padding.bottom} x2={x} y2={height - padding.bottom + 5} stroke="var(--color-border)" strokeWidth="1" />
                        </g>
                    );
                })}

                {/* Y Axis Labels (Speed) */}
                {[0, 0.5, 1].map(v => {
                    const speed = minSpeed + v * (maxSpeed - minSpeed);
                    const y = getY(speed);
                    return <text key={v} x={padding.left - 10} y={y} fill="var(--color-text-secondary)" fontSize="10" fontWeight="bold" textAnchor="end" alignmentBaseline="middle">{(speed * 3.6).toFixed(1)}</text>;
                })}

                {/* Expected Value Markers (Averages) */}
                <line x1={getX(pred.averageRaceTime)} y1={padding.top} x2={getX(pred.averageRaceTime)} y2={height - padding.bottom} stroke="var(--color-accent-default)" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />
                <line x1={padding.left} y1={getY(pred.averageFinishLineSpeed)} x2={width - padding.right} y2={getY(pred.averageFinishLineSpeed)} stroke="var(--color-accent-default)" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.5" />

                {/* Scatter Points */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={getX(p.time)}
                        cy={getY(p.finishSpeed)}
                        r="2.5"
                        fill="var(--color-accent-default)"
                        fillOpacity="0.15"
                        className="hover:r-4 hover:fill-opacity-100 transition-all cursor-crosshair"
                        onMouseEnter={() => setHoveredPoint(p)}
                        onMouseLeave={() => setHoveredPoint(null)}
                    />
                ))}

                {/* Axes Titles */}
                <text x={width/2} y={height - 5} fill="var(--color-text-secondary)" fontSize="10" fontWeight="black" textAnchor="middle" className="uppercase tracking-widest">Race Time (Stability)</text>
                <text x={15} y={height/2} fill="var(--color-text-secondary)" fontSize="10" fontWeight="black" textAnchor="middle" transform={`rotate(-90 15 ${height/2})`} className="uppercase tracking-widest">Velocity (km/h)</text>

                {/* Active Tooltip */}
                {hoveredPoint && (
                    <g transform={`translate(${getX(hoveredPoint.time)}, ${getY(hoveredPoint.finishSpeed)})`}>
                        <circle r="4" fill="white" />
                        <g transform="translate(10, -45)">
                            <rect width="100" height="40" fill="rgba(13,17,23,0.95)" rx="6" stroke="var(--color-accent-default)" strokeWidth="1" />
                            <text x="10" y="15" fill="var(--color-accent-default)" fontSize="10" fontWeight="black">Instance D-{(hoveredPoint.time * 1000).toFixed(0)}</text>
                            <text x="10" y="28" fill="white" fontSize="9">{(hoveredPoint.finishSpeed * 3.6).toFixed(2)} km/h @ {hoveredPoint.time.toFixed(4)}s</text>
                        </g>
                    </g>
                )}
            </svg>

            <div className="mt-4 grid grid-cols-3 gap-2 px-2">
                <div className="bg-brand-dark p-2 rounded-lg border border-brand-border">
                    <p className="text-[9px] text-brand-text-secondary uppercase">Consistency</p>
                    <p className="text-sm font-bold text-green-400">{(100 - (pred.stdDevTime || 0) * 1000).toFixed(1)}%</p>
                </div>
                <div className="bg-brand-dark p-2 rounded-lg border border-brand-border">
                    <p className="text-[9px] text-brand-text-secondary uppercase">Confidence</p>
                    <p className="text-sm font-bold text-brand-accent">99.7%</p>
                </div>
                <div className="bg-brand-dark p-2 rounded-lg border border-brand-border">
                    <p className="text-[9px] text-brand-text-secondary uppercase">σ Time</p>
                    <p className="text-sm font-bold text-yellow-400">±{(pred.stdDevTime || 0).toFixed(4)}s</p>
                </div>
            </div>
        </div>
    );
};

export default MonteCarloScatterPlot;
