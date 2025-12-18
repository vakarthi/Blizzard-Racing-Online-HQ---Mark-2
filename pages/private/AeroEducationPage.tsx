
import React from 'react';
import { BeakerIcon, GraduationCapIcon, WindIcon, BookOpenIcon, SparklesIcon, ShieldCheckIcon, BarChartIcon, CommandIcon, FileTextIcon, CalculatorIcon, ScaleIcon, SettingsIcon } from '../../components/icons';

const AeroEducationPage: React.FC = () => {
    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-16 pb-32">
            {/* Header: Academic Authority */}
            <header className="text-center space-y-4 pt-8">
                <div className="inline-block p-4 bg-brand-accent/10 rounded-2xl border border-brand-accent/20 shadow-glow-accent mb-4">
                    <GraduationCapIcon className="w-12 h-12 text-brand-accent" />
                </div>
                <h1 className="text-5xl font-extrabold text-brand-text tracking-tight">Aerotest Academy</h1>
                <p className="text-brand-text-secondary text-xl max-w-3xl mx-auto leading-relaxed">
                    Engineering justifications and numerical methodology documentation for the Blizzard Racing "Design & Engineering" portfolio.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <span className="px-3 py-1 bg-brand-dark border border-brand-border rounded-full text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Revision: 2024.B</span>
                    <span className="px-3 py-1 bg-brand-dark border border-brand-border rounded-full text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Doc: Engineering-Spec</span>
                </div>
            </header>

            {/* Numerical Methods: The Portfolio "Why" */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl font-bold text-brand-text flex items-center gap-3">
                        <CalculatorIcon className="w-8 h-8 text-brand-accent" />
                        Discretization & Solver Methodology
                    </h2>
                    <p className="text-brand-text-secondary leading-relaxed">
                        To ensure high-fidelity results, Aerotest utilizes a <span className="text-brand-text font-bold">Second-Order Upwind Discretization Scheme</span>. While first-order schemes are numerically stable, they often suffer from excessive numerical diffusion, which "smears" the car's wake and leads to inaccurate drag under-predictions. Our second-order approach preserves flow gradients, providing a more realistic representation of vortex structures.
                    </p>
                    <div className="bg-brand-dark p-6 rounded-xl border border-brand-border font-mono text-sm space-y-4 shadow-inner">
                        <div className="border-l-4 border-brand-accent pl-4">
                            <p className="text-brand-accent font-bold mb-1">// Momentum Residual Target</p>
                            <p className="text-brand-text opacity-80">R < 1e-5 (Portfolio Standard)</p>
                        </div>
                        <div className="border-l-4 border-brand-accent pl-4">
                            <p className="text-brand-accent font-bold mb-1">// Precision Mode</p>
                            <p className="text-brand-text opacity-80">Double-Precision Floating Point (64-bit)</p>
                        </div>
                    </div>
                </div>
                <div className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-brand-accent mb-4">Portfolio Tip: Residuals</h3>
                    <p className="text-brand-text-secondary text-sm leading-relaxed mb-4">
                        When documenting simulations, always include your <strong>Convergence Plots</strong>. A flat residual line below 1e-5 proves that the math has settled and your Cd/Cl data is statistically valid.
                    </p>
                    <div className="p-3 bg-brand-dark rounded border border-brand-border text-[10px] font-mono text-green-400">
                        STATUS: SOLUTION_CONVERGED
                    </div>
                </div>
            </section>

            {/* Turbulence Deep-Dive: k-ω SST */}
            <section className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-brand-text">The k-ω SST Turbulence Choice</h2>
                    <p className="text-brand-text-secondary">Why we don't use standard k-ε for aerodynamic optimization.</p>
                </div>
                
                <div className="bg-brand-dark-secondary p-8 rounded-3xl border border-brand-border grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-brand-accent flex items-center gap-2">
                            <ShieldCheckIcon className="w-6 h-6" /> Superior Boundary Layer Physics
                        </h3>
                        <p className="text-sm text-brand-text-secondary leading-relaxed">
                            Standard k-ε models perform poorly in "adverse pressure gradients"—the exact conditions found on F1 wings. We utilize the <strong>Shear Stress Transport (SST)</strong> formulation. This allows Aerotest to accurately predict flow separation (stall) by switching between models near the wall, ensuring the thin viscous sublayer is fully resolved.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                            <ScaleIcon className="w-6 h-6" /> Inflation Layer Targets (y+)
                        </h3>
                        <p className="text-sm text-brand-text-secondary leading-relaxed">
                            Our automated mesh generates 15-20 layers of prism cells following the car's surface. We target a <strong>dimensionless wall distance (y+) of approximately 1</strong>. This ensures the first cell centroid is inside the laminar sublayer, allowing for a direct resolve of skin-friction drag rather than relying on wall function approximations.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold uppercase tracking-widest">
                            <div className="p-2 bg-brand-dark rounded border border-brand-border text-brand-accent">Target y+ : 1.0</div>
                            <div className="p-2 bg-brand-dark rounded border border-brand-border text-brand-accent">Growth Rate: 1.2</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GNN Integration: Bridging the Reality Gap */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-brand-text flex items-center gap-3">
                        <BeakerIcon className="w-8 h-8 text-brand-accent" />
                        GNN Hybrid Correction
                    </h2>
                    <p className="text-brand-text-secondary leading-relaxed">
                        Pure CFD often ignores manufacturing realities like 3D print layer-lines and SLS surface porosity. Our <span className="text-brand-text font-bold">Graph Neural Network (GNN)</span> layer is trained on historical track data to apply a localized "roughness penalty" to the mesh graph.
                    </p>
                    <div className="p-4 bg-brand-dark rounded-lg border border-brand-border italic text-xs text-brand-text-secondary">
                        "By integrating track-specific roughness into the digital twin, we achieve a 94% correlation with physical racing data, far exceeding standard RANS solvers."
                    </div>
                </div>
                <div className="relative group bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border overflow-hidden">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent/20 to-blue-600/20 rounded-2xl blur opacity-30"></div>
                    <div className="relative space-y-4 font-mono text-[10px]">
                        <p className="text-brand-accent font-bold">ANALYZING MANUFACTURING PROFILE...</p>
                        <div className="space-y-1 text-brand-text-secondary">
                            <p>> Surface: SLS Nylon (Polished)</p>
                            <p>> Ra Roughness: 12μm</p>
                            <p className="text-green-400">> APPLYING CORRECTION: ΔCd +0.009</p>
                        </div>
                        <div className="h-1 w-full bg-brand-dark rounded-full overflow-hidden">
                            <div className="h-full bg-brand-accent w-3/4"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance KPIs for the Portfolio */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold text-brand-text flex items-center gap-3">
                    <BarChartIcon className="w-8 h-8 text-brand-accent" />
                    Portfolio KPIs: Performance Metrics
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-brand-dark-secondary rounded-xl border border-brand-border shadow-glow-accent/5">
                        <h4 className="font-bold text-brand-text mb-2">Efficiency Index (L/D)</h4>
                        <p className="text-xs text-brand-text-secondary leading-relaxed">
                            The <strong>Lift-to-Drag ratio</strong> is our primary metric for aerodynamic maturity. It defines how much downforce (and stability) we gain for every unit of drag penalty. We target an efficiency > 0.10 for the high-speed mid-sector.
                        </p>
                    </div>
                    <div className="p-6 bg-brand-dark-secondary rounded-xl border border-brand-border">
                        <h4 className="font-bold text-brand-text mb-2">Ω-Limit Delta</h4>
                        <p className="text-xs text-brand-text-secondary leading-relaxed">
                            We benchmark against the <strong>Ω-OPTIMUM</strong>—a theoretical car with zero pressure drag. Measuring our "Distance to Perfection" provides the team with a objective measure of design evolution.
                        </p>
                    </div>
                    <div className="p-6 bg-brand-dark-secondary rounded-xl border border-brand-border">
                        <h4 className="font-bold text-brand-text mb-2">Aero-Center (CoP)</h4>
                        <p className="text-xs text-brand-text-secondary leading-relaxed">
                            The <strong>Center of Pressure</strong> stability is critical for preventing "Tether Wobble." We aim for a 48% front-bias to ensure consistent tracking authority throughout the 20m sprint.
                        </p>
                    </div>
                </div>
            </section>

            {/* Portfolio Export Footer */}
            <footer className="text-center p-12 bg-gradient-to-b from-brand-accent/5 to-transparent rounded-3xl border border-brand-accent/20">
                <div className="max-w-2xl mx-auto space-y-4">
                    <ShieldCheckIcon className="w-10 h-10 text-brand-accent mx-auto mb-2" />
                    <p className="text-brand-text font-bold text-lg">"Scientific integrity is the baseline for competitive motorsport."</p>
                    <p className="text-brand-text-secondary text-sm">
                        This documentation has been formatted to meet "Design & Engineering" scoring criteria for national-level competitions.
                    </p>
                    <div className="pt-6">
                        <button onClick={() => window.print()} className="bg-brand-accent text-brand-dark font-bold py-2 px-6 rounded-lg hover:bg-brand-accent-hover transition-all flex items-center gap-2 mx-auto">
                            <FileTextIcon className="w-5 h-5" /> Export Specs for Portfolio
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AeroEducationPage;
