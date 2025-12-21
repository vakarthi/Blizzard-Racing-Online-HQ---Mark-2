
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import LoadingSpinner from './LoadingSpinner';

interface FbxViewerProps {
  fbxDataUrl: string | null;
  isBlurred: boolean;
}

const FbxViewer: React.FC<FbxViewerProps> = ({ fbxDataUrl, isBlurred }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || !fbxDataUrl) return;

    const currentMount = mountRef.current;
    if (loadingRef.current) loadingRef.current.style.display = 'flex';

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight1.position.set(5, 5, 5).normalize();
    scene.add(directionalLight1);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-5, -5, -5).normalize();
    scene.add(directionalLight2);
    
    // FBX Loading
    const loader = new FBXLoader();
    try {
        const base64Data = fbxDataUrl.split(',')[1];
        const decodedData = atob(base64Data);
        const len = decodedData.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = decodedData.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        const model = loader.parse(arrayBuffer, '');
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        
        model.scale.set(scale, scale, scale);
        model.position.sub(center.multiplyScalar(scale));

        scene.add(model);
        if (loadingRef.current) loadingRef.current.style.display = 'none';

    } catch (error) {
        console.error("Error loading FBX model:", error);
        if (loadingRef.current) {
            loadingRef.current.innerHTML = "<p>Error loading model.</p>";
        }
    }
    

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();

    // Handle resize
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
  }, [fbxDataUrl]);

  return (
    <div className="relative w-full h-[300px] md:h-[50vh] bg-brand-dark/50 rounded-lg overflow-hidden border border-brand-border">
      <div 
        ref={mountRef} 
        className={`w-full h-full transition-all duration-500 ease-in-out ${isBlurred ? 'blur-xl' : 'blur-0'}`}
      />
      <div ref={loadingRef} className="absolute inset-0 flex items-center justify-center text-brand-text">
        <LoadingSpinner />
      </div>
       {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <p className="text-xl font-bold text-brand-text text-center animate-pulse">
            CLASSIFIED
            <span className="block text-sm font-normal text-brand-text-secondary">Full reveal coming soon</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FbxViewer;
