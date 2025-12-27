
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center relative p-16">
        {/* Background Haki Pulse */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        {/* Manga SFX - The Drums of Liberation (Don Don) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <span className="absolute -left-20 top-0 font-manga font-black text-6xl text-white opacity-20 animate-rubber-heartbeat" style={{textShadow: '0 0 15px #9333ea', transformOrigin: 'right bottom'}}>DOOM</span>
            <span className="absolute -right-20 bottom-0 font-manga font-black text-6xl text-white opacity-20 animate-rubber-heartbeat [animation-delay:0.2s]" style={{textShadow: '0 0 15px #9333ea', transformOrigin: 'left top'}}>DOOM</span>
        </div>

        {/* The Gear 5 Core */}
        <div className="relative w-40 h-40 flex items-center justify-center">
            
            {/* The Sun God Core (Heart) - Violent Rubber Pulse */}
            <div className="absolute z-20 w-16 h-16 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.9)] animate-rubber-heartbeat flex items-center justify-center">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-40"></div>
            </div>

            {/* Hagoromo (The Cloud Raiment) - Floating Ring */}
            <div className="absolute inset-0 z-10 animate-smoke-spin opacity-90">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    <path 
                        d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="12" 
                        strokeDasharray="60 140" 
                        strokeLinecap="round"
                    />
                    <path 
                        d="M100,35 C130,35 165,65 165,100 C165,135 135,165 100,165 C65,165 35,135 35,100 C35,65 65,35 100,35 Z" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="8" 
                        strokeDasharray="40 100" 
                        strokeLinecap="round"
                        transform="rotate(180 100 100)"
                    />
                </svg>
            </div>

            {/* Conqueror's Haki (Black/Purple Lightning) */}
            <div className="absolute inset-[-20%] z-30 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-haki-flash overflow-visible">
                    <path d="M50,10 L55,30 L45,40 L60,60" fill="none" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_5px_#9333ea]" />
                    <path d="M10,50 L30,55 L40,45 L60,60" fill="none" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_5px_#9333ea]" transform="rotate(120 50 50)"/>
                    <path d="M80,80 L70,60 L85,50" fill="none" stroke="#3b0764" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_5px_#9333ea]" transform="rotate(240 50 50)"/>
                </svg>
            </div>

            {/* Joy Particles */}
            <div className="absolute -top-10 left-10 text-3xl animate-bounce text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">✨</div>
            <div className="absolute bottom-0 -right-10 text-2xl animate-bounce [animation-delay:0.3s] text-purple-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">✨</div>
        </div>
        
        <div className="mt-12 text-center relative z-10">
            <h2 className="text-4xl font-manga font-black text-white italic tracking-tighter animate-rubber-heartbeat drop-shadow-[0_0_20px_rgba(147,51,234,0.8)]">
                AWAKENING
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-[2px] w-8 bg-white/50"></div>
                <p className="text-[10px] font-mono text-white/80 tracking-[0.3em] uppercase">
                    Liberation Engine
                </p>
                <div className="h-[2px] w-8 bg-white/50"></div>
            </div>
        </div>
    </div>
  );
};

export default LoadingSpinner;
