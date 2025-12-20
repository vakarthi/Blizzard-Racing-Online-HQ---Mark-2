
import React from 'react';
import { BeakerIcon, GraduationCapIcon, WindIcon, BookOpenIcon, SparklesIcon, ShieldCheckIcon, BarChartIcon, CommandIcon, AlertTriangleIcon } from '../../components/icons';

const AeroEducationPage: React.FC = () => {
    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-12 pb-20">
            <header className="text-center space-y-4">
                <div className="inline-block p-3 bg-brand-accent/20 rounded-full border border-brand-accent/30 shadow-glow-accent">
                    <GraduationCapIcon className="w-10 h-10 text-brand-accent" />
                </div>
                <h1 className="text-4xl font-bold text-brand-text">Aerotest Academy</h1>
                <p className="text-brand-text-secondary text-lg max-w-2xl mx-auto">
                    Mastering the physics and strategy of our proprietary simulation engine.
                </p>
            </header>

            {/* REAL-WORLD CASE STUDY */}
            <section className="bg-red-500/5 border border-red-500/20 p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <AlertTriangleIcon className="w-8 h-8 text-red-400" />
                    <h2 className="text-2xl font-bold text-brand-text">The "Penalty" Paradox: Regional Case Study</h2>
                </div>
                <p className="text-brand-text-secondary text-sm">
                    In our last Regional Final, Blizzard Racing (Team D05) produced a car with elite race pace (215/220 points). However, we finished <span className="text-brand-text font-bold">2nd instead of 1st</span> due to 65 points in technical penalties.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-brand-dark p-4 rounded-xl border border-brand-border">
                        <h4 className="text-brand-accent font-bold text-xs uppercase mb-2">The Failures We Missed:</h4>
                        <ul className="space-y-2 text-xs text-brand-text-secondary">
                            <li className="flex justify-between"><span>D4.3.2 Halo Visibility</span> <span className="text-red-400 font-bold">-5pts</span></li>
                            <li className="flex justify-between"><span>D7.6.3 Front Wing Thickness</span> <span className="text-red-400 font-bold">-5pts</span></li>
                            <li className="flex justify-between"><span>D4.2 No-Go-Zone Intrusion</span> <span className="text-red-400 font-bold">-25pts</span></li>
                            <li className="flex justify-between"><span>D6.2 Car Visibility</span> <span className="text-red-400 font-bold">-25pts</span></li>
                        </ul>
                    </div>
                    <div className="bg-brand-dark p-4 rounded-xl border border-brand-border flex items-center justify-center text-center">
                        <div>
                            <p className="text-3xl font-bold text-red-400">-65 PTS</p>
                            <p className="text-xs text-brand-text-secondary uppercase">Scrutineering Deficit</p>
                            <p className="mt-2 text-[10px] text-brand-text-secondary italic">Aerotest v2.5 has been updated to specifically flag these exact infringements.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Aerotest? Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                        <SparklesIcon className="w-6 h-6 text-yellow-400" />
                        Why We Use Aerotest
                    </h2>
                    <p className="text-brand-text-secondary leading-relaxed">
                        Conventional commercial CFD (Computational Fluid Dynamics) tools are designed for general-purpose engineering. They are slow, expensive, and often require expert knowledge to configure correctly for a 20-meter sprint.
                    </p>
                    <div className="bg-brand-dark-secondary p-4 rounded-xl border border-brand-border">
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm">
                                <span className="text-brand-accent font-bold">01.</span>
                                <div>
                                    <p className="font-bold text-brand-text uppercase text-xs">Iterative Speed</p>
                                    <p className="text-brand-text-secondary">Simulations take minutes, not hours, allowing for 10x more design iterations per week.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <span className="text-brand-accent font-bold">02.</span>
                                <div>
                                    <p className="font-bold text-brand-text uppercase text-xs">Material Intelligence</p>
                                    <p className="text-brand-text-secondary">Solver v2.6.1 is hard-coded with our block density of <span className="text-brand-text font-bold">0.163 ± 0.012 g/cm³</span> for accurate inertia modeling.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <span className="text-brand-accent font-bold">03.</span>
                                <div>
                                    <p className="font-bold text-brand-text uppercase text-xs">Contextual AI</p>
                                    <p className="text-brand-text-secondary">Our built-in AI Correction (v2.1-GNN) is trained specifically on F1 in Schools track data.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full -mr-16 -mt-16 group-hover:bg-brand-accent/10 transition-colors"></div>
                    <h3 className="text-lg font-bold text-brand-accent mb-4">The Strategic Advantage</h3>
                    <p className="text-brand-text-secondary text-sm italic">
                        "In F1 in Schools, you don't win with the prettiest CAD. You win with the design that has the most validated wind-tunnel data. Aerotest gives us that data at scale."
                    </p>
                    <div className="mt-6 flex justify-center">
                        <WindIcon className="w-24 h-24 text-brand-border animate-pulse" />
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                    <BeakerIcon className="w-6 h-6 text-brand-accent" />
                    How the Physics Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-brand-dark-secondary rounded-xl border border-brand-border hover:border-brand-accent/30 transition-all">
                        <div className="text-brand-accent font-mono text-xs font-bold mb-2 tracking-tighter">STAGE 1: MESHING</div>
                        <h4 className="font-bold text-brand-text mb-2">Adaptive Refinement</h4>
                        <p className="text-xs text-brand-text-secondary leading-relaxed">
                            We use a hybrid polyhedral-hexcore mesher. It creates smaller "cells" around the front and rear wings where airflow is most complex, ensuring we capture the exact pressure gradients.
                        </p>
                    </div>
                    <div className="p-5 bg-brand-dark-secondary rounded-xl border border-brand-border hover:border-brand-accent/30 transition-all">
                        <div className="text-brand-accent font-mono text-xs font-bold mb-2 tracking-tighter">STAGE 2: THE SOLVER</div>
                        <h4 className="font-bold text-brand-text mb-2">RANS vs DES</h4>
                        <p className="text-xs text-brand-text-secondary leading-relaxed">
                            Standard mode uses RANS (k-ω SST) for bulk flow. Accuracy mode switches to DES (Detached Eddy Simulation), which resolves the "eddies" behind the car that cause lift-off instability at the finish line.
                        </p>
                    </div>
                    <div className="p-5 bg-brand-dark-secondary rounded-xl border border-brand-border hover:border-brand-accent/30 transition-all">
                        <div className="text-brand-accent font-mono text-xs font-bold mb-2 tracking-tighter">STAGE 3: THE LIMIT</div>
                        <h4 className="font-bold text-brand-text mb-2">The Isentropic Boundary</h4>
                        <p className="text-xs text-brand-text-secondary leading-relaxed">
                            Our Ω-OPTIMUM model represents the "perfect car." It calculates the minimum possible drag if friction was zero and the air was perfectly compressible—our ultimate design target.
                        </p>
                    </div>
                </div>
            </section>

            {/* Practical Guide Section */}
            <section className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                        <BookOpenIcon className="w-6 h-6 text-brand-accent" />
                        Technical Lead Guide
                    </h2>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">OPERATIONAL V2.6.1</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h4 className="font-bold text-brand-text">Workflow Steps:</h4>
                        <ol className="space-y-4">
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center font-bold text-brand-accent border border-brand-border flex-shrink-0">1</div>
                                <div className="text-sm">
                                    <p className="font-bold text-brand-text">Export as .STEP</p>
                                    <p className="text-brand-text-secondary">Export your Fusion360/Onshape assembly as a high-precision STEP file. Avoid STL as it loses surface curvature data.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center font-bold text-brand-accent border border-brand-border flex-shrink-0">2</div>
                                <div className="text-sm">
                                    <p className="font-bold text-brand-text">Density Calibration</p>
                                    <p className="text-brand-text-secondary">Ensure your CAD volume translates to a legal weight. The solver assumes a core density of 0.163 g/cm³.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center font-bold text-brand-accent border border-brand-border flex-shrink-0">3</div>
                                <div className="text-sm">
                                    <p className="font-bold text-brand-text">Check Regulatory Compliance</p>
                                    <p className="text-brand-text-secondary">Before simulating, use the Toolbox Checklist. Don't waste compute time on an illegal car.</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div className="space-y-4">
                         <h4 className="font-bold text-brand-text">Key Metrics Decoder:</h4>
                         <div className="space-y-3">
                            <div className="p-3 bg-brand-dark rounded-lg border border-brand-border flex justify-between items-center">
                                <span className="font-mono text-xs text-brand-text-secondary">Cd (Coefficient of Drag)</span>
                                <span className="text-sm font-bold text-red-400">Lower is Faster</span>
                            </div>
                            <div className="p-3 bg-brand-dark rounded-lg border border-brand-border flex justify-between items-center">
                                <span className="font-mono text-xs text-brand-text-secondary">Cl (Coefficient of Lift)</span>
                                <span className="text-sm font-bold text-blue-400">Stability Control</span>
                            </div>
                            <div className="p-3 bg-brand-dark rounded-lg border border-brand-border flex justify-between items-center">
                                <span className="font-mono text-xs text-brand-text-secondary">L/D Ratio</span>
                                <span className="text-sm font-bold text-green-400">Aero Efficiency</span>
                            </div>
                            <div className="p-3 bg-brand-dark rounded-lg border border-brand-border flex justify-between items-center">
                                <span className="font-mono text-xs text-brand-text-secondary">Ω-Delta</span>
                                <span className="text-sm font-bold text-yellow-400">Distance to Perfect</span>
                            </div>
                         </div>
                    </div>
                </div>
            </section>

            <footer className="text-center p-8 bg-brand-accent/5 rounded-2xl border border-brand-accent/20">
                <p className="text-brand-text-secondary text-sm">
                    Questions about simulation results? Contact <span className="text-brand-text font-bold">Pranav</span> in the Design/Aero Sub-team.
                </p>
            </footer>
        </div>
    );
};

export default AeroEducationPage;
