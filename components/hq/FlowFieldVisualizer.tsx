
import React, { useEffect, useRef, useState } from 'react';
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
  float scanline = sin(vPosition.y * 50.0 - time * 3.0) * 0.1;
  float pulse = sin(time * 2.0) * 0.2 + 0.8;

  // Grid / Wireframe feel
  float grid = step(0.95, fract(vPosition.x * 20.0)) + step(0.95, fract(vPosition.z * 20.0));
  
  vec3 finalColor = color * (fresnel + grid * 0.5 + scanline) * pulse;
  
  // Additive blending alpha
  gl_FragColor = vec4(finalColor, fresnel * 0.8 + 0.15);
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
  
  const particleCount = 2000;

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Brand Dark
    // Add grid floor
    const gridHelper = new THREE.GridHelper(0.5, 20, 0x1E293B, 0x0F172A);
    scene.add(gridHelper);

    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 10);
    // Adjusted camera: Closer, looking down-ish
    camera.position.set(0.35, 0.25, 0.35); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.minDistance = 0.1;
    controls.maxDistance = 1.5;

    // 2. Holographic Car Mesh Construction
    // Convert mm to meters for rendering scale (1 unit = 1 meter)
    const carLen = (parameters.totalLength || 210) / 1000;
    const carWidth = (parameters.totalWidth || 65) / 1000;
    const fwSpan = (parameters.frontWingSpan || 75) / 1000;
    const rwSpan = (parameters.rearWingSpan || 65) / 1000;
    
    const material = new THREE.ShaderMaterial({
        vertexShader: HOLO_VERTEX_SHADER,
        fragmentShader: HOLO_FRAGMENT_SHADER,
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00BFFF) } // Brand Accent Blue
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    carMaterialRef.current = material;

    const carGroup = new THREE.Group();

    // --- ORIENTATION LOGIC ---
    // Flow is usually +X (Left -> Right).
    // Car should face the wind. Nose at -X (Left), Tail at +X (Right).

    // A. Main Body (Fuselage)
    // Cylinder along X axis
    const bodyGeo = new THREE.CylinderGeometry(0.015, 0.015, carLen * 0.85, 16);
    bodyGeo.rotateZ(Math.PI / 2); 
    const body = new THREE.Mesh(bodyGeo, material);
    carGroup.add(body);

    // B. CO2 Chamber (Rear Block) - At Positive X
    const chamberGeo = new THREE.BoxGeometry(0.05, 0.035, 0.03);
    const chamber = new THREE.Mesh(chamberGeo, material);
    chamber.position.set(carLen/2 - 0.01, 0.015, 0); // Tail end
    carGroup.add(chamber);

    // C. Sidepods (Boxes)
    const podLen = carLen * 0.4;
    const podGeo = new THREE.BoxGeometry(podLen, 0.025, carWidth * 0.25);
    
    const podLeft = new THREE.Mesh(podGeo, material);
    podLeft.position.set(0, 0, carWidth/3.5);
    carGroup.add(podLeft);
    
    const podRight = new THREE.Mesh(podGeo, material);
    podRight.position.set(0, 0, -carWidth/3.5);
    carGroup.add(podRight);

    // D. Front Wing (Wide, thin) - At Negative X (Nose)
    const fwGeo = new THREE.BoxGeometry(0.03, 0.005, fwSpan);
    const fw = new THREE.Mesh(fwGeo, material);
    fw.position.set(-carLen/2 + 0.015, -0.015, 0); // Nose end
    carGroup.add(fw);

    // E. Rear Wing (High, wide) - At Positive X (Tail)
    const rwGeo = new THREE.BoxGeometry(0.03, 0.005, rwSpan);
    const rw = new THREE.Mesh(rwGeo, material);
    rw.position.set(carLen/2 - 0.015, 0.045, 0); // Tail end, raised
    carGroup.add(rw);

    // F. Wheels (4x Cylinders)
    const wheelRad = 0.016; 
    const wheelThick = 0.015;
    const wheelGeo = new THREE.CylinderGeometry(wheelRad, wheelRad, wheelThick, 16);
    wheelGeo.rotateX(Math.PI / 2); // Rolling direction

    // Front Wheels (Near Nose / -X)
    const wheelFL = new THREE.Mesh(wheelGeo, material);
    wheelFL.position.set(-carLen/2 + 0.05, 0, carWidth/2);
    carGroup.add(wheelFL);

    const wheelFR = new THREE.Mesh(wheelGeo, material);
    wheelFR.position.set(-carLen/2 + 0.05, 0, -carWidth/2);
    carGroup.add(wheelFR);

    // Rear Wheels (Near Tail / +X)
    const wheelRL = new THREE.Mesh(wheelGeo, material);
    wheelRL.position.set(carLen/2 - 0.05, 0, carWidth/2);
    carGroup.add(wheelRL);

    const wheelRR = new THREE.Mesh(wheelGeo, material);
    wheelRR.position.set(carLen/2 - 0.05, 0, -carWidth/2);
    carGroup.add(wheelRR);

    // Lift car so wheels touch grid
    carGroup.position.set(0, wheelRad, 0);
    scene.add(carGroup);


    // 3. Flow Particles
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount * 3; i+=3) {
        pos[i] = (Math.random() - 0.5) * 0.6; // Spread along X
        pos[i+1] = (Math.random()) * 0.2; // Height
        pos[i+2] = (Math.random() - 0.5) * 0.3; // Width
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    
    const pMat = new THREE.PointsMaterial({
        color: 0x4ADE80, // Green for "Neural" data
        size: 0.002,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    particleSystem.visible = false;
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
        // Geometry cleanup
        bodyGeo.dispose(); chamberGeo.dispose(); podGeo.dispose();
        fwGeo.dispose(); rwGeo.dispose(); wheelGeo.dispose();
        pGeo.dispose();
        
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
          carMaterialRef.current.uniforms.color.value.setHex(0x333333); // Dim car
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
              const idx = i*3;
              // Flow moves +X (Left to Right)
              positions[idx] += 0.008; 
              // Reset if too far right
              if(positions[idx] > 0.3) positions[idx] = -0.3;
              
              // Slight turbulence wiggle
              positions[idx+1] += Math.sin(time*5 + positions[idx]*10) * 0.0002;
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
            
            <div className="absolute bottom-4 right-6 text-[9px] text-brand-text-secondary/50 font-mono text-right">
                <p>HOLOGRAPHIC RECONSTRUCTION</p>
                <p>FROM SCAN DATA PARAMS</p>
            </div>
        </div>
    </div>
  );
};

export default FlowFieldVisualizer;
