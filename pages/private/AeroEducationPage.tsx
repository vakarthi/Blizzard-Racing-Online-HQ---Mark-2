
import React, { useState } from 'react';
import { BeakerIcon, GraduationCapIcon, WindIcon, BookOpenIcon, SparklesIcon, ShieldCheckIcon, BarChartIcon, CommandIcon, AlertTriangleIcon, FileTextIcon, InfoIcon, EyeIcon, LayersIcon, DownloadIcon, MenuIcon, LightbulbIcon, CheckCircleIcon } from '../../components/icons';

const ModuleHeader: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
    <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
        <h2 className="text-2xl font-bold text-brand-text flex items-center gap-3">
            {icon}
            {title}
        </h2>
        <span className="hidden md:block text-xs font-mono text-brand-text-secondary uppercase">{subtitle}</span>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold text-brand-accent mb-4 uppercase tracking-wider text-xs">{title}</h3>
        {children}
    </div>
);

const ConceptCard: React.FC<{ title: string; formula?: string; description: string; tags?: string[] }> = ({ title, formula, description, tags }) => (
    <div className="bg-brand-dark p-5 rounded-xl border border-brand-border hover:border-brand-accent/30 transition-all h-full">
        <h4 className="text-base font-bold text-brand-text mb-2">{title}</h4>
        {formula && (
            <div className="bg-brand-dark-secondary p-2 rounded border border-brand-border text-center mb-3 font-mono text-xs text-brand-accent">
                {formula}
            </div>
        )}
        <p className="text-sm text-brand-text-secondary leading-relaxed mb-4">
            {description}
        </p>
        {tags && (
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-brand-surface rounded-full text-brand-text-secondary uppercase">
                        {tag}
                    </span>
                ))}
            </div>
        )}
    </div>
);

const PhysicsModule: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <ModuleHeader title="Fundamentals of Fluid Mechanics" subtitle="Module PHY-101" icon={<WindIcon className="w-6 h-6 text-brand-accent" />} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ConceptCard 
                title="The Continuity Equation"
                formula="A₁v₁ = A₂v₂"
                description="Mass is conserved. If air enters a smaller cross-section (like between the wheel and sidepod), it MUST speed up. This acceleration drops pressure."
                tags={['Conservation', 'Velocity']}
            />
            <ConceptCard 
                title="Bernoulli's Principle"
                formula="P + ½ρv² = Constant"
                description="The core of downforce. As velocity (v) increases, static pressure (P) decreases. We shape wings to accelerate air underneath them, creating suction."
                tags={['Pressure', 'Downforce']}
            />
            <ConceptCard 
                title="Reynolds Number (Re)"
                formula="Re = (ρvL) / μ"
                description="The ratio of inertial forces to viscous forces. F1 in Schools cars operate at relatively low Re (~200,000), meaning air feels 'stickier' than it does to a full-size F1 car. Laminar flow is harder to maintain."
                tags={['Scale', 'Viscosity']}
            />
        </div>

        <Section title="The Four Horsemen of Drag">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <h4 className="font-bold text-brand-text">1. Pressure (Form) Drag</h4>
                    </div>
                    <p className="text-sm text-brand-text-secondary mb-3">Caused by the shape of the object. A flat plate facing the wind has huge pressure drag (high pressure front, vacuum back). A teardrop has very low form drag.</p>
                    <div className="p-3 bg-brand-dark rounded border border-brand-border">
                        <span className="text-xs text-brand-accent font-bold">Mitigation:</span> <span className="text-xs text-brand-text-secondary">Streamline bodywork, taper rear sections (Boattailing).</span>
                    </div>
                </div>
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <h4 className="font-bold text-brand-text">2. Skin Friction Drag</h4>
                    </div>
                    <p className="text-sm text-brand-text-secondary mb-3">Caused by air "sticking" to the surface (viscosity) in the boundary layer. Proportional to total surface area.</p>
                    <div className="p-3 bg-brand-dark rounded border border-brand-border">
                        <span className="text-xs text-brand-accent font-bold">Mitigation:</span> <span className="text-xs text-brand-text-secondary">Reduce total surface area (wetted area), smooth surface finish.</span>
                    </div>
                </div>
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <h4 className="font-bold text-brand-text">3. Induced Drag</h4>
                    </div>
                    <p className="text-sm text-brand-text-secondary mb-3">The penalty for creating lift/downforce. High pressure leaks to low pressure at wingtips, creating vortices that consume energy.</p>
                    <div className="p-3 bg-brand-dark rounded border border-brand-border">
                        <span className="text-xs text-brand-accent font-bold">Mitigation:</span> <span className="text-xs text-brand-text-secondary">Use wing endplates to seal pressure differences.</span>
                    </div>
                </div>
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <h4 className="font-bold text-brand-text">4. Interference Drag</h4>
                    </div>
                    <p className="text-sm text-brand-text-secondary mb-3">Occurs where surfaces meet (e.g., wing strut meets chassis). The boundary layers collide and thicken, creating extra turbulence.</p>
                    <div className="p-3 bg-brand-dark rounded border border-brand-border">
                        <span className="text-xs text-brand-accent font-bold">Mitigation:</span> <span className="text-xs text-brand-text-secondary">Fillet (round) all internal corners and junctions.</span>
                    </div>
                </div>
            </div>
        </Section>
    </div>
);

const AdvancedAeroModule: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <ModuleHeader title="The Mechanics of Speed" subtitle="Module MECH-404" icon={<SparklesIcon className="w-6 h-6 text-brand-accent" />} />
        
        <div className="p-6 bg-brand-dark-secondary rounded-xl border border-brand-border mb-8">
            <h3 className="text-xl font-bold text-brand-text mb-2">The Master Equation Breakdown</h3>
            <div className="flex justify-center my-6">
                <div className="px-8 py-4 bg-brand-dark rounded-lg border-2 border-brand-accent shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                    <span className="font-mono text-2xl font-bold text-white">F<span className="text-xs align-sub">d</span> = ½ · ρ · v² · C<span className="text-xs align-sub">d</span> · A</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
                <div className="p-3 bg-brand-dark rounded border border-brand-border">
                    <div className="text-brand-accent font-bold">ρ (Rho)</div>
                    <div className="text-[10px] text-brand-text-secondary uppercase">Air Density</div>
                    <div className="text-xs mt-1">1.225 kg/m³</div>
                </div>
                <div className="p-3 bg-brand-dark rounded border border-brand-border">
                    <div className="text-brand-accent font-bold">v² (Velocity)</div>
                    <div className="text-[10px] text-brand-text-secondary uppercase">Speed Squared</div>
                    <div className="text-xs mt-1">Exponential Impact</div>
                </div>
                <div className="p-3 bg-brand-dark rounded border border-brand-border">
                    <div className="text-brand-accent font-bold">Cd</div>
                    <div className="text-[10px] text-brand-text-secondary uppercase">Drag Coeff.</div>
                    <div className="text-xs mt-1">Shape Efficiency</div>
                </div>
                <div className="p-3 bg-brand-dark rounded border border-brand-border">
                    <div className="text-brand-accent font-bold">A (Area)</div>
                    <div className="text-[10px] text-brand-text-secondary uppercase">Reference Area</div>
                    <div className="text-xs mt-1">Frontal Size</div>
                </div>
                <div className="p-3 bg-brand-dark rounded border border-brand-border">
                    <div className="text-brand-accent font-bold">½</div>
                    <div className="text-[10px] text-brand-text-secondary uppercase">Constant</div>
                    <div className="text-xs mt-1">Maths.</div>
                </div>
            </div>
        </div>

        <Section title="Factors Influencing Downforce (Cl)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <h4 className="font-bold text-brand-text mb-2">1. Angle of Attack (AoA)</h4>
                    <p className="text-sm text-brand-text-secondary">
                        The angle at which the wing meets the air. 
                        <br/><br/>
                        <span className="text-green-400">↑ AoA = ↑ Downforce</span>
                        <br/>
                        <span className="text-red-400">↑ AoA = ↑ Drag</span>
                        <br/><br/>
                        <b>Limit:</b> If AoA exceeds ~15-20°, the air can no longer stick to the surface. It separates, causing a <b>STALL</b>. Downforce disappears, Drag skyrockets.
                    </p>
                </div>
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <h4 className="font-bold text-brand-text mb-2">2. Camber (Curvature)</h4>
                    <p className="text-sm text-brand-text-secondary">
                        The curvature of the airfoil. A more curved wing accelerates air faster underneath, creating lower pressure (suction).
                        <br/><br/>
                        Highly cambered wings can generate more downforce at lower speeds but are more prone to separation at the trailing edge.
                    </p>
                </div>
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <h4 className="font-bold text-brand-text mb-2">3. Ground Effect</h4>
                    <p className="text-sm text-brand-text-secondary">
                        As a wing (or chassis floor) gets closer to the ground, the air is squeezed through a Venturi tunnel.
                        <br/><br/>
                        <span className="text-blue-400 font-bold">Rule of Thumb:</span> Reducing ride height usually increases downforce for "free" (minimal drag penalty) until you hit the track surface.
                    </p>
                </div>
            </div>
        </Section>

        <Section title="Advanced Drag Management">
            <div className="bg-brand-dark p-6 rounded-xl border border-brand-border space-y-6">
                <div>
                    <h4 className="flex items-center gap-2 font-bold text-brand-text mb-2">
                        <LayersIcon className="w-4 h-4 text-brand-accent"/>
                        The Aspect Ratio Trade-off
                    </h4>
                    <p className="text-sm text-brand-text-secondary mb-2">
                        Aspect Ratio (AR) = Span² / Area. 
                    </p>
                    <ul className="list-disc list-inside text-sm text-brand-text-secondary space-y-1">
                        <li><b>High AR (Gliders):</b> Very efficient, low induced drag. Good for efficiency.</li>
                        <li><b>Low AR (Fighter Jets / F1):</b> Large chord, short span. Creates strong vortex lift (good for high AoA) but creates significant induced drag.</li>
                        <li><b>F1S Tip:</b> Keep wings as wide (high span) as the rules allow to maximize efficiency (L/D).</li>
                    </ul>
                </div>
                <div className="border-t border-brand-border pt-4">
                    <h4 className="flex items-center gap-2 font-bold text-brand-text mb-2">
                        <WindIcon className="w-4 h-4 text-brand-accent"/>
                        Surface Roughness (k)
                    </h4>
                    <p className="text-sm text-brand-text-secondary">
                        While simulation often assumes smooth walls, reality has 3D print lines. Rough surfaces trip the boundary layer into turbulence earlier.
                        <br/>
                        <b>Aerotest Simulation:</b> We assume a standard roughness value ($k_s$) equivalent to 600-grit sanded primer. If you leave raw 3D print lines, your <b>actual drag will be 15-20% higher</b> than the simulation predicts.
                    </p>
                </div>
            </div>
        </Section>
    </div>
);

const CFDModule: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <ModuleHeader title="Inside the Solver" subtitle="Module CFD-201" icon={<BeakerIcon className="w-6 h-6 text-brand-accent" />} />

        <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border mb-8">
            <h3 className="text-lg font-bold text-brand-text mb-4">Navier-Stokes Equations</h3>
            <p className="text-sm text-brand-text-secondary mb-4">
                These are the governing equations of fluid motion. They represent the conservation of mass, momentum, and energy. Since they have no general analytical solution, we must solve them numerically by breaking the space into grid cells.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-brand-dark rounded border border-brand-border">
                    <div className="font-mono font-bold text-brand-accent">∇·u = 0</div>
                    <div className="text-[10px] text-brand-text-secondary uppercase mt-1">Conservation of Mass</div>
                </div>
                <div className="p-3 bg-brand-dark rounded border border-brand-border">
                    <div className="font-mono font-bold text-brand-accent">ρ(Du/Dt) = -∇p + μ∇²u + f</div>
                    <div className="text-[10px] text-brand-text-secondary uppercase mt-1">Conservation of Momentum</div>
                </div>
                <div className="p-3 bg-brand-dark rounded border border-brand-border">
                    <div className="font-mono font-bold text-brand-accent">ρ(De/Dt) = ...</div>
                    <div className="text-[10px] text-brand-text-secondary uppercase mt-1">Conservation of Energy</div>
                </div>
            </div>
        </div>

        <Section title="1. Discretization (The Voxel Grid)">
            <p className="text-sm text-brand-text-secondary mb-4">
                Aerotest now uses a state-of-the-art <b>Cartesian Voxel</b> approach instead of traditional tetrahedral meshing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-dark p-5 rounded-xl border border-brand-border">
                    <h4 className="font-bold text-brand-text mb-2">Voxel-Based FVM</h4>
                    <ul className="text-sm space-y-2 text-brand-text-secondary">
                        <li><b>Automatic Meshing:</b> The geometry is "rasterized" into a 3D grid of cubes (voxels), similar to Minecraft but with physics.</li>
                        <li><b>Immersed Boundary Method:</b> We don't need a perfectly watertight mesh. The solver detects which voxels are "solid" and which are "fluid" automatically.</li>
                        <li><span className="text-green-400 font-bold">Benefit:</span> Handles raw STL files instantly without hours of cleanup.</li>
                    </ul>
                </div>
                <div className="bg-brand-dark p-5 rounded-xl border border-brand-border">
                    <h4 className="font-bold text-brand-text mb-2">Resolution Tiers</h4>
                    <ul className="text-sm space-y-2 text-brand-text-secondary">
                        <li><b>Standard Mode:</b> Uses a coarse voxel grid (~32x16x16) for rapid iteration (under 5 seconds). Good for general trends.</li>
                        <li><b>Deep Solve (Premium):</b> Uses a high-fidelity grid (~64x32x32+) with dense sampling. Captures wake structures and pressure gradients accurately.</li>
                    </ul>
                </div>
            </div>
        </Section>

        <Section title="2. Turbulence Modeling (LES-ish)">
            <p className="text-sm text-brand-text-secondary mb-4">
               Our Voxel solver uses an approach similar to <b>Large Eddy Simulation (LES)</b> on a coarse scale.
            </p>
            <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                <h4 className="font-bold text-brand-accent mb-3">Advection & Diffusion</h4>
                <p className="text-sm text-brand-text-secondary leading-relaxed mb-4">
                    The solver splits the physics into steps:
                </p>
                <div className="space-y-2 text-sm text-brand-text-secondary">
                    <p><b>1. Advection:</b> Moves velocity and smoke/dye through the grid based on current flow speed.</p>
                    <p><b>2. Diffusion:</b> Simulates the viscosity (stickiness) of air, smoothing out sharp velocity differences.</p>
                    <p><b>3. Projection:</b> Solves a massive system of linear equations (Poisson Equation) to ensure mass is conserved—making sure air doesn't just disappear or compress infinitely.</p>
                </div>
            </div>
        </Section>

        <Section title="3. Convergence & Divergence">
            <div className="space-y-4">
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-brand-surface rounded text-brand-accent"><BarChartIcon className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-brand-text text-sm">Divergence-Free</h4>
                        <p className="text-xs text-brand-text-secondary mt-1">
                            Incompressible flow means the amount of air entering a cell must equal the amount leaving. If this isn't true, the simulation "blows up". The Project step enforces this.
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    </div>
);

const AerotestManifestoModule: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <ModuleHeader title="The Aerotest Advantage" subtitle="Module AERO-X" icon={<ShieldCheckIcon className="w-6 h-6 text-brand-accent" />} />

        <div className="bg-gradient-to-br from-brand-dark-secondary to-brand-dark p-8 rounded-2xl border border-brand-accent/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <SparklesIcon className="w-32 h-32 text-brand-accent" />
            </div>
            <h3 className="text-2xl font-black text-brand-text mb-4 italic">Why did we build our own solver?</h3>
            <p className="text-brand-text-secondary leading-relaxed max-w-2xl mb-6">
                Industry standards like ANSYS Fluent and Siemens Star-CCM+ are incredible tools, but they are generalists. They are designed to simulate everything from jet engines to blood flow. They require PhD-level setup, hours of mesh cleaning, and huge computing power.
                <br/><br/>
                <b>Aerotest is different.</b> It is a specialist. It knows it is simulating an F1 in Schools car.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                    <h4 className="text-red-400 font-bold mb-2">Industry Standard (Old Way)</h4>
                    <ul className="text-xs text-brand-text-secondary space-y-2">
                        <li>❌ Requires "Watertight" Geometry (Hours of CAD fix)</li>
                        <li>❌ Manual Meshing (Tetra/Poly/Hex decisions)</li>
                        <li>❌ Slow Convergence (Hours/Days)</li>
                        <li>❌ Generic Physics (Doesn't know about CO2 thrust)</li>
                    </ul>
                </div>
                <div className="bg-brand-accent/10 p-4 rounded-xl border border-brand-accent/30">
                    <h4 className="text-green-400 font-bold mb-2">Aerotest Mark 3 (Egghead Way)</h4>
                    <ul className="text-xs text-brand-text space-y-2">
                        <li>✅ <b>Immersed Boundary Voxelization:</b> Ignores holes/gaps.</li>
                        <li>✅ <b>Automated Gridding:</b> Instant Cartesian mesh.</li>
                        <li>✅ <b>Hybrid Solver:</b> Inviscid Pressure + Viscous Corrections.</li>
                        <li>✅ <b>Context Aware:</b> Integrated Physics Engine (Thrust/Friction/Mass).</li>
                    </ul>
                </div>
            </div>
        </div>

        <Section title="The Hybrid-AI Architecture">
            <div className="flex gap-6 items-start">
                <div className="hidden md:block w-32 shrink-0 text-center">
                    <div className="w-24 h-24 bg-brand-dark rounded-full border-4 border-brand-accent/20 flex items-center justify-center mx-auto mb-2 relative">
                        <div className="absolute inset-0 rounded-full border-t-4 border-brand-accent animate-spin"></div>
                        <span className="font-black text-2xl text-brand-accent">AI</span>
                    </div>
                    <span className="text-xs font-bold text-brand-text-secondary uppercase">Neural Kernel</span>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-brand-text mb-2">Punk Records (The Secondary Lobe)</h4>
                    <p className="text-sm text-brand-text-secondary leading-relaxed mb-4">
                        Aerotest doesn't just run math; it <b>remembers</b>. We have trained a neural network on thousands of previous race results and wind tunnel data points.
                    </p>
                    <p className="text-sm text-brand-text-secondary leading-relaxed">
                        1. <b>CFD Step:</b> The Voxel solver calculates the raw pressure field and ideal $C_d$.
                        <br/>
                        2. <b>Correction Step:</b> The Neural Kernel analyzes the geometry features (wheel proximity, wing angles) and applies a "Realism Factor" derived from historical data.
                        <br/>
                        3. <b>Result:</b> A drag number that is closer to the <i>track reality</i> than a pure CFD simulation which assumes perfect conditions.
                    </p>
                </div>
            </div>
        </Section>

        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex gap-4">
            <LightbulbIcon className="w-6 h-6 text-yellow-400 shrink-0" />
            <div>
                <h4 className="font-bold text-yellow-400 text-sm uppercase mb-1">Portfolio Gold</h4>
                <p className="text-xs text-yellow-200/80">
                    Use this section in your Engineering Portfolio! Judges love to see that you understand the <b>limitations of your tools</b> and why you chose a specific workflow. Mentioning "Immersed Boundary Voxelization" and "Hybrid Neural Correction" shows innovation.
                </p>
            </div>
        </div>
    </div>
);

const F1SModule: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <ModuleHeader title="F1 in Schools Specifics" subtitle="Module F1S-301" icon={<GraduationCapIcon className="w-6 h-6 text-brand-accent" />} />

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2"><AlertTriangleIcon className="w-5 h-5"/> Unique Constraints</h3>
            <p className="text-sm text-brand-text-secondary">
                F1 in Schools cars are not just scaled-down F1 cars. They have unique physics problems: The CO2 jet, the tether line, and exposed wheels on a flat track.
            </p>
        </div>

        <Section title="The Wheel Wake Problem">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-2/3">
                    <p className="text-sm text-brand-text-secondary leading-relaxed mb-4">
                        Wheels account for <b>35-45% of total drag</b>. They are rotating cylinders that churn air into a chaotic "mushroom" shape wake.
                    </p>
                    <ul className="space-y-3 text-sm text-brand-text-secondary">
                        <li className="flex gap-2 items-start">
                            <span className="text-red-400 font-bold">Problem:</span>
                            <span>The wake from the front wheels hits the sidepods and rear wings, rendering them useless.</span>
                        </li>
                        <li className="flex gap-2 items-start">
                            <span className="text-green-400 font-bold">Solution:</span>
                            <span><b>Outwash:</b> Use front wings to push air OUTSIDE the front wheels. <br/><b>Inwash:</b> Use front wings to channel air INSIDE the wheels (closer to body).</span>
                        </li>
                    </ul>
                </div>
                <div className="md:w-1/3 bg-brand-dark p-4 rounded-xl border border-brand-border text-center">
                    <div className="w-24 h-40 mx-auto border-2 border-dashed border-brand-text-secondary rounded-lg relative mb-2">
                        <div className="absolute -left-4 top-4 w-4 h-12 bg-brand-surface border border-brand-border"></div>
                        <div className="absolute -right-4 top-4 w-4 h-12 bg-brand-surface border border-brand-border"></div>
                        <div className="absolute inset-x-0 bottom-0 top-20 bg-brand-accent/20 mx-auto w-10"></div>
                        {/* Streamlines */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-blue-400"></div>
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-blue-400"></div>
                    </div>
                    <p className="text-xs font-mono text-brand-text-secondary">Outwash Topology</p>
                </div>
            </div>
        </Section>

        <Section title="The CO2 Cartridge Effect">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <h4 className="font-bold text-brand-text mb-3">Base Drag & The Void</h4>
                    <p className="text-sm text-brand-text-secondary leading-relaxed">
                        The rear of the car is a flat vertical face (where the cartridge goes). This creates a massive low-pressure void behind the car, sucking it backwards.
                    </p>
                </div>
                <div className="bg-brand-dark-secondary p-6 rounded-xl border border-brand-border">
                    <h4 className="font-bold text-brand-text mb-3">The Jet Pump Effect</h4>
                    <p className="text-sm text-brand-text-secondary leading-relaxed">
                        As high-speed gas shoots out of the cartridge, it entrains (pulls) nearby air with it. If designed correctly, you can use this to suck air out of the rear wheel wakes, reducing their drag.
                    </p>
                </div>
            </div>
        </Section>

        <Section title="Launch & Friction Physics">
            <div className="bg-brand-dark p-5 rounded-xl border border-brand-border space-y-4">
                <p className="text-sm text-brand-text-secondary">
                    <b>Total Force = Thrust - Drag - Friction</b>
                </p>
                <ul className="text-xs space-y-2 text-brand-text-secondary">
                    <li><b>Rolling Resistance ($F_r$):</b> $F_r = \mu N$. Where $N$ is the Normal force (Weight + Aerodynamic Downforce). Too much downforce slows you down!</li>
                    <li><b>Tether Line Friction:</b> The car is guided by a nylon line. If the car lifts or dives (pitch), the eyelets rub against the line, creating friction. <b>Aero Balance must be neutral.</b></li>
                </ul>
            </div>
        </Section>
    </div>
);

const ReferenceModule: React.FC = () => (
    <div className="space-y-8 animate-fade-in">
        <ModuleHeader title="Glossary & Reference" subtitle="Module REF-401" icon={<InfoIcon className="w-6 h-6 text-brand-accent" />} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { term: "AoA (Angle of Attack)", def: "The angle between a wing's chord line and the oncoming airflow." },
                { term: "Boundary Layer", def: "The layer of fluid in the immediate vicinity of a bounding surface where the effects of viscosity are significant." },
                { term: "Camber", def: "The asymmetry between the two acting surfaces of an airfoil." },
                { term: "Chord", def: "The straight line connecting the leading and trailing edges of an airfoil." },
                { term: "CoP (Center of Pressure)", def: "The point where the total sum of a pressure field acts on a body." },
                { term: "Diffuser", def: "A shaped section of the car underbody which improves the transition between high-velocity airflow underneath the car and the slower free-stream airflow." },
                { term: "Flow Separation", def: "When the boundary layer detaches from the surface of the object, creating a wake of turbulent eddies." },
                { term: "Laminar Flow", def: "Streamlined flow in which the fluid moves in parallel layers with no disruption." },
                { term: "Mach Number", def: "Ratio of flow velocity to the speed of sound. (Negligible in F1S, max speed ~20m/s is Mach 0.06)." },
                { term: "Mesh / Grid", def: "The discrete cells into which the domain is divided for CFD calculation." },
                { term: "Pressure Gradient", def: "The rate of pressure change in a certain direction. Adverse gradients cause separation." },
                { term: "Stall", def: "A sudden reduction in lift (and increase in drag) caused by flow separation." },
                { term: "Turbulence", def: "Flow characterized by chaotic changes in pressure and flow velocity." },
                { term: "Venturi Effect", def: "The reduction in fluid pressure that results when a fluid flows through a constricted section (or under the car)." },
                { term: "Vortex", def: "A spinning flow of fluid. Can be used to energize boundary layers or seal edges." },
                { term: "Y+", def: "A non-dimensional distance from the wall to the first mesh node, used to check mesh suitability for turbulence models." },
            ].map(item => (
                <div key={item.term} className="bg-brand-dark-secondary p-4 rounded-lg border border-brand-border hover:bg-brand-dark transition-colors">
                    <h5 className="font-bold text-brand-accent text-sm mb-1">{item.term}</h5>
                    <p className="text-xs text-brand-text-secondary">{item.def}</p>
                </div>
            ))}
        </div>
    </div>
);

const AeroEducationPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'physics' | 'mechanics' | 'cfd' | 'manifesto' | 'f1s' | 'reference'>('physics');

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-20 flex flex-col h-full">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-brand-accent/20 rounded-xl border border-brand-accent/30 shadow-glow-accent">
                        <GraduationCapIcon className="w-8 h-8 text-brand-accent" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-brand-text tracking-tight">Aerotest Academy</h1>
                        <p className="text-brand-text-secondary">Advanced Aerodynamics & Simulation Knowledge Base</p>
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <nav className="lg:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-2">
                        <button onClick={() => setActiveTab('physics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'physics' ? 'bg-brand-accent text-brand-dark font-bold shadow-lg' : 'text-brand-text-secondary hover:bg-brand-dark-secondary'}`}>
                            <WindIcon className="w-5 h-5" /> Fundamentals
                        </button>
                        <button onClick={() => setActiveTab('mechanics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'mechanics' ? 'bg-brand-accent text-brand-dark font-bold shadow-lg' : 'text-brand-text-secondary hover:bg-brand-dark-secondary'}`}>
                            <SparklesIcon className="w-5 h-5" /> Advanced Aero
                        </button>
                        <button onClick={() => setActiveTab('cfd')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'cfd' ? 'bg-brand-accent text-brand-dark font-bold shadow-lg' : 'text-brand-text-secondary hover:bg-brand-dark-secondary'}`}>
                            <BeakerIcon className="w-5 h-5" /> CFD Internals
                        </button>
                        <button onClick={() => setActiveTab('manifesto')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'manifesto' ? 'bg-brand-accent text-brand-dark font-bold shadow-lg' : 'text-brand-text-secondary hover:bg-brand-dark-secondary'}`}>
                            <ShieldCheckIcon className="w-5 h-5" /> Why Aerotest?
                        </button>
                        <button onClick={() => setActiveTab('f1s')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'f1s' ? 'bg-brand-accent text-brand-dark font-bold shadow-lg' : 'text-brand-text-secondary hover:bg-brand-dark-secondary'}`}>
                            <TrophyIcon className="w-5 h-5" /> F1S Specifics
                        </button>
                        <button onClick={() => setActiveTab('reference')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'reference' ? 'bg-brand-accent text-brand-dark font-bold shadow-lg' : 'text-brand-text-secondary hover:bg-brand-dark-secondary'}`}>
                            <InfoIcon className="w-5 h-5" /> Glossary
                        </button>
                        
                        <div className="mt-8 p-4 bg-brand-dark-secondary rounded-xl border border-brand-border">
                            <h4 className="text-xs font-bold text-brand-text uppercase mb-2">Pro Tip</h4>
                            <p className="text-xs text-brand-text-secondary leading-relaxed">
                                Use concepts from the <b>Advanced Aero</b> and <b>Aerotest Advantage</b> modules to justify your design decisions in your Engineering Portfolio. Judges look for <span className="text-brand-accent">"Iterative Design based on Data."</span>
                            </p>
                        </div>
                    </div>
                </nav>

                {/* Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="bg-brand-surface/5 p-1 rounded-2xl"> {/* Subtle container */}
                        {activeTab === 'physics' && <PhysicsModule />}
                        {activeTab === 'mechanics' && <AdvancedAeroModule />}
                        {activeTab === 'cfd' && <CFDModule />}
                        {activeTab === 'manifesto' && <AerotestManifestoModule />}
                        {activeTab === 'f1s' && <F1SModule />}
                        {activeTab === 'reference' && <ReferenceModule />}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Helper for the icon in nav that isn't imported in this scope but available
const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export default AeroEducationPage;
