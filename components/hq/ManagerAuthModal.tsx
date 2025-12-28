
import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { useAuth } from '../../contexts/AppContext';
import { authenticateWithBiometrics } from '../../utils/biometrics';
import { FingerprintIcon, ShieldAlertIcon, ShieldCheckIcon, AlertTriangleIcon } from '../icons';

const ManagerAuthModal: React.FC<{ isOpen: boolean; onSuccess: () => void; onClose: () => void }> = ({ isOpen, onSuccess, onClose }) => {
    const { user, verifyPassword, getBiometricConfig } = useAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [biometricsAvailable, setBiometricsAvailable] = useState(false);
    const [authStatus, setAuthStatus] = useState<'idle' | 'success' | 'error'>('idle');
    
    const biometricConfig = getBiometricConfig();

    useEffect(() => {
        if (biometricConfig && user && biometricConfig.userId === user.id) {
            setBiometricsAvailable(true);
        } else {
            setBiometricsAvailable(false);
        }
    }, [biometricConfig, user]);

    // Reset status when modal opens
    useEffect(() => {
        if (isOpen) {
            setAuthStatus('idle');
            setPassword('');
            setError('');
        }
    }, [isOpen]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Artificial delay for "Processing" effect
        await new Promise(resolve => setTimeout(resolve, 800));

        const isValid = await verifyPassword(password);
        if (isValid) {
            setAuthStatus('success');
            setTimeout(() => {
                onSuccess();
            }, 1500); // Allow time for the "Dome Deactivated" animation
        } else {
            setAuthStatus('error');
            setError('Access Denied. Defense Systems Active.');
            // Reset error status after shake animation
            setTimeout(() => setAuthStatus('idle'), 500);
        }
        setLoading(false);
    };

    const handleBiometricAuth = async () => {
        if (!biometricConfig) return;
        setLoading(true);
        setError('');
        try {
            await authenticateWithBiometrics(biometricConfig.credentialId);
            setAuthStatus('success');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err) {
            console.error(err);
            setAuthStatus('error');
            setError('Biometric Signature Mismatch.');
            setTimeout(() => setAuthStatus('idle'), 500);
        }
        setLoading(false);
    };

    // --- FRONTIER DOME VISUALS ---
    const laserColor = authStatus === 'success' ? 'rgba(74, 222, 128, 0.5)' : 'rgba(239, 68, 68, 0.5)';
    const beamColor = authStatus === 'success' ? '#4ade80' : '#ef4444';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            {/* BACKDROP: The Frontier Dome Laser Grid */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm">
                {/* Vertical Lasers */}
                <div 
                    className="absolute inset-0 opacity-30" 
                    style={{
                        backgroundImage: `linear-gradient(90deg, ${laserColor} 1px, transparent 1px)`,
                        backgroundSize: '40px 100%'
                    }}
                ></div>
                {/* Horizontal Lasers */}
                <div 
                    className="absolute inset-0 opacity-30" 
                    style={{
                        backgroundImage: `linear-gradient(0deg, ${laserColor} 1px, transparent 1px)`,
                        backgroundSize: '100% 40px'
                    }}
                ></div>
                {/* Moving Beam Effect */}
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${authStatus === 'success' ? 'via-green-500/10' : 'via-red-500/10'} to-transparent animate-scanline pointer-events-none`}></div>
            </div>

            {/* MAIN PANEL */}
            <div 
                className={`relative w-full max-w-md bg-[#0F172A] border-2 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-transform duration-100 ${authStatus === 'error' ? 'animate-[rubberHeartbeat_0.2s_ease-in-out] border-red-500' : (authStatus === 'success' ? 'border-green-500 scale-105' : 'border-red-500/50')}`}
            >
                {/* Status Bar Header */}
                <div className={`px-6 py-3 flex justify-between items-center border-b ${authStatus === 'success' ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                    <div className="flex items-center gap-2">
                        {authStatus === 'success' ? <ShieldCheckIcon className="w-5 h-5 text-green-400" /> : <ShieldAlertIcon className="w-5 h-5 text-red-500 animate-pulse" />}
                        <span className={`font-egghead font-bold text-xs tracking-widest ${authStatus === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                            {authStatus === 'success' ? 'DOME DEACTIVATED' : 'FRONTIER DOME: ACTIVE'}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text text-xs uppercase hover:underline">
                        Abort
                    </button>
                </div>

                <div className="p-8 relative">
                    {/* Holographic Scan Line */}
                    {loading && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent shadow-[0_0_15px_var(--color-accent-default)] animate-[scanline_1s_linear_infinite]"></div>
                    )}

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-brand-text mb-2 font-display tracking-tight">LABOPHASE GATE</h2>
                        <p className="text-xs text-brand-text-secondary font-mono">Restricted to Gorosei & Satellite Clearance.</p>
                    </div>

                    {authStatus === 'success' ? (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                                <ShieldCheckIcon className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-green-400 mb-1">Access Granted</h3>
                            <p className="text-xs text-brand-text-secondary">Welcome to the Control Room.</p>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div className="relative group">
                                <input
                                    id="manager-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="ENTER PASSCODE"
                                    className="w-full px-4 py-4 bg-black/50 border border-brand-border rounded-none text-center font-mono text-lg tracking-[0.5em] text-brand-text focus:outline-none focus:border-brand-accent transition-colors placeholder-brand-text-secondary/30"
                                    autoFocus
                                />
                                {/* Tech corners for input */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-brand-text-secondary group-focus-within:border-brand-accent transition-colors"></div>
                                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-brand-text-secondary group-focus-within:border-brand-accent transition-colors"></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-brand-text-secondary group-focus-within:border-brand-accent transition-colors"></div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-brand-text-secondary group-focus-within:border-brand-accent transition-colors"></div>
                            </div>
                        
                            {error && (
                                <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold animate-pulse">
                                    <AlertTriangleIcon className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-brand-accent text-brand-dark font-black py-3 px-4 rounded-none hover:bg-brand-accent-hover transition-all disabled:opacity-50 uppercase tracking-wider text-sm shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none"
                            >
                                {loading ? 'VERIFYING CREDENTIALS...' : 'DISABLE SECURITY'}
                            </button>
                        </form>
                    )}

                    {biometricsAvailable && authStatus !== 'success' && (
                        <div className="mt-6 pt-6 border-t border-brand-border/30 text-center">
                            <button 
                                onClick={handleBiometricAuth} 
                                disabled={loading} 
                                className="text-brand-text-secondary hover:text-brand-accent text-xs font-mono flex items-center justify-center gap-2 mx-auto transition-colors"
                            >
                               <FingerprintIcon className="w-4 h-4"/> USE VEGA-CHIP (BIOMETRICS)
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Footer Deco */}
                <div className="bg-black/40 p-2 flex justify-between items-center text-[9px] text-brand-text-secondary font-mono border-t border-white/5">
                    <span>SYS.ID: PUNK-01</span>
                    <span>SEC.LVL: OMEGA</span>
                </div>
            </div>
        </div>
    );
};
export default ManagerAuthModal;
