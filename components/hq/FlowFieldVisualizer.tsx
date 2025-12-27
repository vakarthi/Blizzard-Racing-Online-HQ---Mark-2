
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlowFieldPoint, DesignParameters } from '../../types';
import { LayersIcon, WindIcon, EyeIcon } from '../icons';

interface FlowFieldVisualizerProps {
  flowFieldData?: FlowFieldPoint[];
  parameters: DesignParameters;
}

// --- HOLOGRAPHIC SHADERS ---
const HOLO_VERTEX_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const HOLO_FRAGMENT_SHADER = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
uniform float time;
uniform vec3 color;

void main() {
  // Fresnel Effect (Glowing edges)
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);

  // Scanline Effect
  float scanline = sin(vPosition.y * 50.0 + time * 5.0) * 0.1;
  float pulse = sin(time * 2.0) * 0.2 + 0.8;

  // Grid / Wireframe feel
  float grid = step(0.95, fract(vPosition.x * 20.0)) + step(0.95, fract(vPosition.z * 20.0));
  
  vec3 finalColor = color * (fresnel + grid * 0.5 + scanline) * pulse;
  
  gl_FragColor = vec4(finalColor, fresnel * 0.8 + 0.1);
}
`;

const FlowFieldVisualizer: React.FC<FlowFieldVisualizerProps> = ({ flowFieldData, parameters }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [visMode, setVisMode] = useState<'hologram' | 'neural-flow' | 'scan'>('hologram');
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const carMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number>(0);
  
  const particleCount = 4000;

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Brand Dark
    // Add grid floor
    const gridHelper = new THREE.GridHelper(4, 40, 0x1E293B, 0x0F172A);
    scene.add(gridHelper);

    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.01, 20);
    camera.position.set(-0.8, 0.5, 0.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // 2. Holographic Car Mesh (Procedural Box for demo, looks like FBX)
    const carLen = parameters.totalLength / 1000;
    const carWidth = parameters.totalWidth / 1000;
    const carHeight = 0.06;
    
    // Complex geometry to mimic an FBX model
    const geometry = new THREE.BoxGeometry(carLen, carHeight, carWidth, 10, 4, 6);
    const material = new THREE.ShaderMaterial({
        vertexShader: HOLO_VERTEX_SHADER,
        fragmentShader: HOLO_FRAGMENT_SHADER,
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00BFFF) } // Brand Accent
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    carMaterialRef.current = material;
    
    const carMesh = new THREE.Mesh(geometry, material);
    carMesh.position.set(0, carHeight/2, 0);
    scene.add(carMesh);

    // 3. Neural Particles (Flow Data)
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount * 3; i++) pos[i] = (Math.random() - 0.5) * 2;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    
    const pMat = new THREE.PointsMaterial({
        color: 0x4ADE80, // Green for "Neural" data
        size: 0.005,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    particleSystem.visible = false; // Hidden by default
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    controlsRef.current = controls;

    animate();

    const handleResize = () => {
        if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameIdRef.current);
        renderer.dispose();
        if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [parameters]);

  // --- MODE SWITCHING ---
  useEffect(() => {
      if (!carMaterialRef.current || !particlesRef.current) return;
      
      if (visMode === 'hologram') {
          carMaterialRef.current.uniforms.color.value.setHex(0x00BFFF); // Blue
          particlesRef.current.visible = false;
      } else if (visMode === 'neural-flow') {
          carMaterialRef.current.uniforms.color.value.setHex(0x222222); // Dim car
          particlesRef.current.visible = true;
      } else if (visMode === 'scan') {
          carMaterialRef.current.uniforms.color.value.setHex(0xFF00FF); // Magenta scan
          particlesRef.current.visible = false;
      }
  }, [visMode]);

  const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      if (carMaterialRef.current) {
          carMaterialRef.current.uniforms.time.value = time;
      }

      if (particlesRef.current && particlesRef.current.visible) {
          const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
          for(let i=0; i<particleCount; i++) {
              // Simple flow simulation
              positions[i*3] += 0.01; // X movement
              if(positions[i*3] > 1) positions[i*3] = -1;
              
              // Wiggle
              positions[i*3+1] += Math.sin(time + positions[i*3]*10) * 0.002;
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
  };

  return (
    <div className="relative w-full h-[500px] bg-black rounded-xl overflow-hidden border border-brand-border shadow-[0_0_50px_rgba(0,191,255,0.1)] group">
        <div ref={mountRef} className="w-full h-full cursor-crosshair" />

        {/* Vegapunk UI Overlay */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-brand-accent font-black text-xl tracking-tighter uppercase flex items-center gap-2 drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]">
                        <WindIcon className="w-5 h-5"/> EGGHEAD // HOLO-CORE
                    </h3>
                    <p className="text-[10px] text-brand-text-secondary font-mono mt-1 tracking-widest">
                        SYSTEM: OMEGA-NEURAL // LINK: ESTABLISHED
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/50 animate-pulse font-mono">
                        LIVE FEED
                    </p>
                </div>
            </div>

            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%]"></div>

            <div className="pointer-events-auto bg-black/80 backdrop-blur-md border border-brand-accent/30 rounded-xl p-1.5 self-center flex gap-4 shadow-2xl z-10">
                <button 
                    onClick={() => setVisMode('hologram')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all w-24 ${visMode === 'hologram' ? 'bg-brand-accent text-brand-dark shadow-[0_0_15px_rgba(0,191,255,0.5)]' : 'text-brand-text-secondary hover:bg-white/10'}`}
                >
                    <EyeIcon className="w-5 h-5 mb-1"/>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Blueprint</span>
                </button>
                
                <button 
                    onClick={() => setVisMode('neural-flow')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all w-24 ${visMode === 'neural-flow' ? 'bg-green-500 text-brand-dark shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'text-brand-text-secondary hover:bg-white/10'}`}
                >
                    <WindIcon className="w-5 h-5 mb-1"/>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Neural Flow</span>
                </button>

                <button 
                    onClick={() => setVisMode('scan')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all w-24 ${visMode === 'scan' ? 'bg-purple-500 text-brand-dark shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'text-brand-text-secondary hover:bg-white/10'}`}
                >
                    <LayersIcon className="w-5 h-5 mb-1"/>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Deep Scan</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default FlowFieldVisualizer;
