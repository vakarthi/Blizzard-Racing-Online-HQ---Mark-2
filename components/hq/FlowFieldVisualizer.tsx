
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlowFieldPoint, DesignParameters } from '../../types';

interface FlowFieldVisualizerProps {
  flowFieldData: FlowFieldPoint[];
  parameters: DesignParameters;
}

const FlowFieldVisualizer: React.FC<FlowFieldVisualizerProps> = ({ flowFieldData, parameters }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'velocity' | 'pressure'>('velocity');

  useEffect(() => {
    if (!mountRef.current || !flowFieldData) return;

    const currentMount = mountRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.01, 10);
    camera.position.set(0.2, 0.3, 0.5);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Car Body Geometry (Approximation)
    const carLength = parameters.totalLength / 1000;
    const carWidth = parameters.totalWidth / 1000;
    const carHeight = 45 / 1000; // approx height
    const carGeo = new THREE.BoxGeometry(carLength, carHeight, carWidth);
    const carMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5 });
    const carMesh = new THREE.Mesh(carGeo, carMat);
    carMesh.position.set(carLength / 2, 0, 0); // Position it relative to the flow field
    scene.add(carMesh);

    // Flow Field Points Geometry
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(flowFieldData.length * 3);
    const colors = new Float32Array(flowFieldData.length * 3);
    
    const [minVal, maxVal] = flowFieldData.reduce(([min, max], point) => {
        const val = viewMode === 'velocity' ? point[4] : point[3];
        return [Math.min(min, val), Math.max(max, val)];
    }, [Infinity, -Infinity]);

    const color = new THREE.Color();
    flowFieldData.forEach((point, i) => {
        positions[i * 3] = point[0];
        positions[i * 3 + 1] = point[1];
        positions[i * 3 + 2] = point[2];

        const value = viewMode === 'velocity' ? point[4] : point[3];
        const normalizedValue = (value - minVal) / (maxVal - minVal);
        
        // Heatmap: Blue (low) to Red (high)
        color.setHSL(0.7 * (1 - normalizedValue), 1.0, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    });

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({ size: 0.003, vertexColors: true });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
        if (currentMount) {
            currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, [flowFieldData, parameters, viewMode]);

  return (
    <div className="relative">
        <div className="absolute top-4 right-4 z-10 bg-brand-dark/50 p-1 rounded-lg border border-brand-border flex gap-1">
             <button onClick={() => setViewMode('velocity')} className={`px-2 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'velocity' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>Velocity</button>
             <button onClick={() => setViewMode('pressure')} className={`px-2 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'pressure' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:text-brand-text'}`}>Pressure</button>
        </div>
        <div ref={mountRef} className="w-full h-[400px] rounded-lg bg-brand-dark/20 border border-brand-border/50" />
    </div>
  );
};

export default FlowFieldVisualizer;
