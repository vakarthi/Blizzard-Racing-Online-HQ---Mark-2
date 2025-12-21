
import React from 'react';
import { BeakerIcon, GraduationCapIcon, WindIcon, BookOpenIcon, SparklesIcon, ShieldCheckIcon, BarChartIcon, CommandIcon, AlertTriangleIcon, FileTextIcon, InfoIcon, EyeIcon, LayersIcon, DownloadIcon } from '../../components/icons';

const AeroEducationPage: React.FC = () => {
    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-12 pb-20">
            <header className="text-center space-y-4">
                <div className="inline-block p-3 bg-brand-accent/20 rounded-full border border-brand-accent/30 shadow-glow-accent">
                    <GraduationCapIcon className="w-10 h-10 text-brand-accent" />
                </div>
                <h1 className="text-4xl font-bold text-brand-text">Aerotest Academy</h1>
                <p className="text-brand-text-secondary text-lg max-w-2xl mx-auto">
                    Mastering the physics, strategy, and narrative of our proprietary simulation engine.
                </p>
            </header>

            {/* NEW SECTION: AERODYNAMICS 101 */}
            <section className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border space-y-8">
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                        <BookOpenIcon className="w-6 h-6 text-brand-accent" />
                        Aerodynamics 101: The Physics of Speed
                    </h2>
                    <span className="text-xs font-mono text-brand-text-secondary uppercase">Theory Module</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* DRAG */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                                <WindIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-brand-text">Drag ($F_d$)</h3>
                        </div>
                        <p className="text-sm text-brand-text-secondary leading-relaxed">
                            The aerodynamic force resisting forward motion. In F1 in Schools, minimizing drag is the primary way to reduce race time.
                        </p>
                        <div className="bg-brand-dark p-4 rounded-xl border border-brand-border space-y-3">
                            <p className="font-mono text-xs text-center p-2 bg-brand-dark-secondary rounded border border-brand-border">
                                $F_d = \frac{1}{2} \rho v^2 C_d A$
                            </p>
                            <ul className="text-xs space-y-2 text-brand-text-secondary">
                                <li><strong className="text-brand-text">$\rho$ (Density):</strong> Fixed (Air).</li>
                                <li><strong className="text-brand-text">$v$ (Velocity):</strong> The speed of the car. Drag increases with the square of speed!</li>
                                <li><strong className="text-brand-text">$A$ (Frontal Area):</strong> The visible area from the front. Keep it small.</li>
                                <li><strong className="text-brand-text">$C_d$ (Coefficient):</strong> Shape efficiency. Streamlining reduces this.</li>
                            </ul>
                        </div>
                    </div>

                    {/* DOWNFORCE */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                <DownloadIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-brand-text">Downforce ($-C_l$)</h3>
                        </div>
                        <p className="text-sm text-brand-text-secondary leading-relaxed">
                            Vertical force pushing the car into the track. Essential for cornering grip, but often comes at the cost of increased drag (Induced Drag).
                        </p>
                        <div className="bg-brand-dark p-4 rounded-xl border border-brand-border space-y-3">
                            <h4 className="text-xs font-bold text-brand-accent uppercase">Bernoulli's Principle</h4>
                            <p className="text-xs text-brand-text-secondary">
                                Faster moving air has lower pressure.
                            </p>
                            <div className="h-1 bg-brand-border rounded-full overflow-hidden flex">
                                <div className="w-1/2 bg-blue-500/50"></div>
                                <div className="w-1/2 bg-red-500/50"></div>
                            </div>
                            <p className="text-[10px] text-brand-text-secondary italic">
                                By speeding up air *under* the car (Venturi effect) or over curved wings, we create low pressure that sucks the car to the track.
                            </p>
                        </div>
                    </div>

                    {/* CFD SIMULATION */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <BeakerIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-brand-text">How Aerotest Simulates It</h3>
                        </div>
                        <p className="text-sm text-brand-text-secondary leading-relaxed">
                            We can't see air, so we use math. Aerotest divides the air around the car into millions of tiny cubes called the "Mesh".
                        </p>
                        <div className="bg-brand-dark p-4 rounded-xl border border-brand-border space-y-3">
                            <ul className="space-y-3 text-xs">
                                <li className="flex gap-2">
                                    <span className="font-bold text-brand-accent">1.</span>
                                    <span className="text-brand-text-secondary">The solver calculates Conservation of Mass & Momentum (Navier-Stokes) for every single cube.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold text-brand-accent">2.</span>
                                    <span className="text-brand-text-secondary">It repeats this thousands of times ("Iterations") until the values stop changing ("Convergence").</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold text-brand-accent">3.</span>
                                    <span className="text-brand-text-secondary">It sums up the pressure on every surface of your car to give the final Drag ($C_d$) and Lift ($C_l$) numbers.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

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

            {/* PORTFOLIO STRATEGY SECTION */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                        <FileTextIcon className="w-6 h-6 text-brand-accent" />
                        The Portfolio Playbook
                    </h2>
                    <span className="text-xs font-mono text-brand-text-secondary uppercase">For Marketing & Engineering Portfolios</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border">
                        <h3 className="text-lg font-bold text-brand-text mb-4">The Narrative Arc</h3>
                        <p className="text-sm text-brand-text-secondary mb-6">
                            Judges don't just want to see a fast car; they want to see the <i>process</i>. Structure your engineering portfolio section using the <b>"Iterative Loop"</b> narrative.
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center font-bold text-xs">1</div>
                                <div>
                                    <h4 className="font-bold text-sm text-brand-text">Hypothesis</h4>
                                    <p className="text-xs text-brand-text-secondary">"We believed reducing the sidepod inlet area would lower pressure drag without stalling rear airflow."</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center font-bold text-xs">2</div>
                                <div>
                                    <h4 className="font-bold text-sm text-brand-text">Simulation (CFD)</h4>
                                    <p className="text-xs text-brand-text-secondary">"Using Aerotest's RANS solver, we ran 50 variations of the inlet geometry. We visualized pressure maps to identify flow separation."</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-brand-accent/20 text-brand-accent flex items-center justify-center font-bold text-xs">3</div>
                                <div>
                                    <h4 className="font-bold text-sm text-brand-text">Validation</h4>
                                    <p className="text-xs text-brand-text-secondary">"The optimal design showed a 4% reduction in Cd. We validated this by checking the Monte Carlo stability cloud."</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-brand-dark-secondary p-6 rounded-2xl border border-brand-border">
                            <h3 className="text-lg font-bold text-brand-text mb-4">Buzzword Decoder</h3>
                            <p className="text-sm text-brand-text-secondary mb-4">Use these technical terms to boost credibility, but ensure you can explain them.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                    <p className="text-xs font-bold text-brand-accent mb-1">Stochastic Analysis</p>
                                    <p className="text-[10px] text-brand-text-secondary">Testing randomness. "We didn't just test the perfect run; we tested 5,000 messy runs to ensure consistency."</p>
                                </div>
                                <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                    <p className="text-xs font-bold text-brand-accent mb-1">Convergence</p>
                                    <p className="text-[10px] text-brand-text-secondary">Mathematical stability. "Our simulations achieved residuals below 1e-5, ensuring the result wasn't a calculation error."</p>
                                </div>
                                <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                    <p className="text-xs font-bold text-brand-accent mb-1">Boundary Layer</p>
                                    <p className="text-[10px] text-brand-text-secondary">Air sticking to surface. "We aimed to keep the boundary layer attached to the rear wing to prevent stall."</p>
                                </div>
                                <div className="p-3 bg-brand-dark rounded-lg border border-brand-border">
                                    <p className="text-xs font-bold text-brand-accent mb-1">L/D Ratio</p>
                                    <p className="text-[10px] text-brand-text-secondary">Efficiency metric. "Lift divided by Drag. A higher number means we get grip without losing speed."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISUAL DECODER */}
            <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                        <EyeIcon className="w-6 h-6 text-brand-accent" />
                        Visual Data Decoder
                    </h2>
                    <span className="text-xs font-mono text-brand-text-secondary uppercase">How to read CFD images</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group relative bg-brand-dark-secondary rounded-xl overflow-hidden border border-brand-border">
                        <div className="h-32 bg-gradient-to-br from-red-500/20 to-brand-dark flex items-center justify-center">
                            <span className="text-4xl font-bold text-red-500">RED</span>
                        </div>
                        <div className="p-5">
                            <h4 className="font-bold text-brand-text mb-2">High Pressure</h4>
                            <p className="text-xs text-brand-text-secondary mb-3">Air acts like a hammer hitting a wall.</p>
                            <ul className="text-xs space-y-1">
                                <li className="flex gap-2"><span className="text-red-400">●</span> <b>Nose/Front Wings:</b> Bad. Creates Drag.</li>
                                <li className="flex gap-2"><span className="text-green-400">●</span> <b>Top of Wings:</b> Good. Pushes car down (Downforce).</li>
                            </ul>
                        </div>
                    </div>

                    <div className="group relative bg-brand-dark-secondary rounded-xl overflow-hidden border border-brand-border">
                        <div className="h-32 bg-gradient-to-br from-blue-500/20 to-brand-dark flex items-center justify-center">
                            <span className="text-4xl font-bold text-blue-500">BLUE</span>
                        </div>
                        <div className="p-5">
                            <h4 className="font-bold text-brand-text mb-2">Low Pressure (Suction)</h4>
                            <p className="text-xs text-brand-text-secondary mb-3">Air moves fast, pulling surfaces with it.</p>
                            <ul className="text-xs space-y-1">
                                <li className="flex gap-2"><span className="text-red-400">●</span> <b>Rear of Car:</b> Bad. Creates "Wake" drag.</li>
                                <li className="flex gap-2"><span className="text-green-400">●</span> <b>Under Wings:</b> Good. Sucks car to track (Downforce).</li>
                            </ul>
                        </div>
                    </div>

                    <div className="group relative bg-brand-dark-secondary rounded-xl overflow-hidden border border-brand-border">
                        <div className="h-32 bg-gradient-to-br from-green-500/20 to-brand-dark flex items-center justify-center">
                            <span className="text-4xl font-bold text-green-500">LINES</span>
                        </div>
                        <div className="p-5">
                            <h4 className="font-bold text-brand-text mb-2">Streamlines</h4>
                            <p className="text-xs text-brand-text-secondary mb-3">The path a particle of air takes.</p>
                            <ul className="text-xs space-y-1">
                                <li className="flex gap-2"><span className="text-green-400">●</span> <b>Straight/Smooth:</b> Laminar flow. Low drag.</li>
                                <li className="flex gap-2"><span className="text-red-400">●</span> <b>Swirling/Chaotic:</b> Turbulent flow. High drag.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Aerotest? Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-brand-border pt-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                        <SparklesIcon className="w-6 h-6 text-yellow-400" />
                        Why We Use Aerotest
                    </h2>
                    <p className="text-brand-text-secondary leading-relaxed">
                        Conventional commercial CFD tools are designed for general-purpose engineering. They are slow, expensive, and often require expert knowledge to configure correctly for a 20-meter sprint.
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

            {/* TECHNICAL DEEP DIVE (GLOSSARY) */}
            <section className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
                        <InfoIcon className="w-6 h-6 text-brand-accent" />
                        Deep Dive: Aerodynamic Lexicon
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-brand-text mb-3">Stability Concepts</h4>
                        <ul className="space-y-4">
                            <li className="bg-brand-dark p-3 rounded-lg border border-brand-border">
                                <p className="font-bold text-sm text-brand-accent">CoP vs CoM</p>
                                <p className="text-xs text-brand-text-secondary mt-1">
                                    <b>Center of Pressure (CoP)</b> must be behind the <b>Center of Mass (CoM)</b>. Think of a dart; the weight is at the front, feathers at the back. If CoP is in front, the car spins.
                                </p>
                            </li>
                            <li className="bg-brand-dark p-3 rounded-lg border border-brand-border">
                                <p className="font-bold text-sm text-brand-accent">Reynolds Number</p>
                                <p className="text-xs text-brand-text-secondary mt-1">
                                    A dimensionless number describing how air behaves at different scales. F1 in Schools cars operate at a lower Reynolds number than real cars, meaning air feels "stickier" to them.
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-text mb-3">Flow Concepts</h4>
                        <ul className="space-y-4">
                            <li className="bg-brand-dark p-3 rounded-lg border border-brand-border">
                                <p className="font-bold text-sm text-brand-accent">Flow Separation</p>
                                <p className="text-xs text-brand-text-secondary mt-1">
                                    When air can't follow a curve (e.g., back of a wheel) and detaches. This creates a vacuum (low pressure) that sucks the car backwards, causing massive drag.
                                </p>
                            </li>
                            <li className="bg-brand-dark p-3 rounded-lg border border-brand-border">
                                <p className="font-bold text-sm text-brand-accent">Ground Effect</p>
                                <p className="text-xs text-brand-text-secondary mt-1">
                                    Air accelerating between the bottom of the car and the track. Fast air = low pressure (Bernoulli's principle), sucking the car to the ground for free downforce.
                                </p>
                            </li>
                        </ul>
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
