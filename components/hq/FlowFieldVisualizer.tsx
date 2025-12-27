
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlowFieldPoint, DesignParameters, SurfaceMapPoint } from '../../types';

interface FlowFieldVisualizerProps {
  flowFieldData?: FlowFieldPoint[];
  surfaceMapData?: SurfaceMapPoint[];
  parameters: DesignParameters;
}

type ViewMode = 'velocity' | 'pressure' | 'density' | 'surface_cp' | 'sensitivity';

const FlowFieldVisualizer: React.FC<FlowFieldVisualizerProps> = ({ flowFieldData, surfaceMapData, parameters }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>('velocity');

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // --- SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.01, 10);
    camera.position.set(0.2, 0.3, 0.5);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.innerHTML = ''; // Clear previous
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // --- GEOMETRY ---
    
    // 1. Car Body Reference (Wireframe or solid)
    if (viewMode !== 'surface_cp' && viewMode !== 'sensitivity') {
        const carLength = parameters.totalLength / 1000;
        const carWidth = parameters.totalWidth / 1000;
        const carHeight = 45 / 1000;
        const carGeo = new THREE.BoxGeometry(carLength, carHeight, carWidth);
        const carMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, transparent: true, opacity: 0.3 });
        const carMesh = new THREE.Mesh(carGeo, carMat);
        carMesh.position.set(carLength / 2, 0, 0); 
        scene.add(carMesh);
        
        // Wireframe edges
        const edges = new THREE.EdgesGeometry(carGeo);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x555555 } ) );
        line.position.set(carLength / 2, 0, 0); 
        scene.add(line);
    }

    // 2. Flow Field Points (Cloud)
    if ((viewMode === 'velocity' || viewMode === 'pressure' || viewMode === 'density') && flowFieldData) {
        const count = flowFieldData.length;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color();

        // Calculate ranges for normalization
        let minVal = Infinity, maxVal = -Infinity;
        flowFieldData.forEach(p => {
            let val = 0;
            if (viewMode === 'velocity') val = p[4];
            else if (viewMode === 'pressure') val = p[3];
            else if (viewMode === 'density') val = p[5];
            
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
        });
        
        // Sanity check range
        if (minVal === maxVal) maxVal = minVal + 1;

        flowFieldData.forEach((point, i) => {
            positions[i * 3] = point[0];
            positions[i * 3 + 1] = point[1];
            positions[i * 3 + 2] = point[2];

            let val = 0;
            if (viewMode === 'velocity') val = point[4];
            else if (viewMode === 'pressure') val = point[3];
            else if (viewMode === 'density') val = point[5];

            const norm = (val - minVal) / (maxVal - minVal);
            
            if (viewMode === 'velocity') color.setHSL(0.6 * (1.0 - norm), 1.0, 0.5); // Blue to Red
            else if (viewMode === 'pressure') color.setHSL(0.7 * (1.0 - norm), 1.0, 0.5); // Blue (low P) to Red (High P)
            else if (viewMode === 'density') color.setHSL(0.0, norm, 0.5); // Grey to Red (CO2)

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const mat = new THREE.PointsMaterial({ size: 0.004, vertexColors: true, transparent: true, opacity: 0.8 });
        scene.add(new THREE.Points(geo, mat));
    }

    // 3. Surface Map (Solid Points)
    if ((viewMode === 'surface_cp' || viewMode === 'sensitivity') && surfaceMapData) {
        const count = surfaceMapData.length;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color();

        // Range calc
        let minVal = Infinity, maxVal = -Infinity;
        surfaceMapData.forEach(p => {
            const val = viewMode === 'surface_cp' ? p.cp : p.sensitivity;
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
        });
        if (minVal === maxVal) maxVal = minVal + 1;

        surfaceMapData.forEach((point, i) => {
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;

            const val = viewMode === 'surface_cp' ? point.cp : point.sensitivity;
            const norm = (val - minVal) / (maxVal - minVal);

            if (viewMode === 'surface_cp') {
                // Pressure: Blue (Suction) -> Green (Neutral) -> Red (Stagnation)
                color.setHSL(0.66 * (1.0 - norm), 1.0, 0.5); 
            } else {
                // Sensitivity: Green (Okay) -> Red (Bad/Drag Inducing)
                color.setHSL(0.33 * (1.0 - norm), 1.0, 0.5);
            }

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        // Denser, larger points to simulate a solid surface
        const mat = new THREE.PointsMaterial({ size: 0.005, vertexColors: true }); 
        scene.add(new THREE.Points(geo, mat));
    }

    // Animation
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (currentMount) currentMount.removeChild(renderer.domElement);
        renderer.dispose();
    };
  }, [flowFieldData, surfaceMapData, parameters, viewMode]);

  return (
    <div className="relative">
        <div className="absolute top-4 right-4 z-10 bg-brand-dark/80 p-2 rounded-lg border border-brand-border flex flex-col gap-2 backdrop-blur-md">
             <div className="text-[10px] uppercase font-bold text-brand-text-secondary tracking-widest px-1">Flow Physics</div>
             <div className="flex gap-1">
                <button onClick={() => setViewMode('velocity')} className={`px-2 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'velocity' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text bg-brand-surface'}`}>Velocity</button>
                <button onClick={() => setViewMode('pressure')} className={`px-2 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'pressure' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text bg-brand-surface'}`}>Pressure</button>
                <button onClick={() => setViewMode('density')} className={`px-2 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'density' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text bg-brand-surface'}`}>CO2 Plume</button>
             </div>
             
             <div className="text-[10px] uppercase font-bold text-brand-text-secondary tracking-widest px-1 mt-1">Optimization</div>
             <div className="flex gap-1">
                <button onClick={() => setViewMode('surface_cp')} className={`px-2 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'surface_cp' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text bg-brand-surface'}`}>Surface Cp</button>
                <button onClick={() => setViewMode('sensitivity')} className={`px-2 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'sensitivity' ? 'bg-purple-500 text-white' : 'text-brand-text-secondary hover:text-brand-text bg-brand-surface'}`}>Adjoint Sens.</button>
             </div>
        </div>
        <div ref={mountRef} className="w-full h-[400px] rounded-lg bg-gradient-to-b from-brand-dark/20 to-brand-dark/50 border border-brand-border/50" />
    </div>
  );
};

export default FlowFieldVisualizer;
