
import React, { useState, useEffect } from 'react';
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
        
        await new Promise(resolve => setTimeout(resolve, 800));

        const isValid = await verifyPassword(password);
        if (isValid) {
            setAuthStatus('success');
            setTimeout(() => {
                onSuccess();
            }, 1000); 
        } else {
            setAuthStatus('error');
            setError('Invalid Passcode.');
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
            }, 1000);
        } catch (err) {
            console.error(err);
            setAuthStatus('error');
            setError('Authentication Failed.');
            setTimeout(() => setAuthStatus('idle'), 500);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-brand-dark rounded-xl border border-brand-border shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-brand-dark-secondary">
                    <h3 className="font-bold text-brand-text text-sm uppercase tracking-wide flex items-center gap-2">
                        <ShieldAlertIcon className="w-4 h-4 text-brand-accent"/> Manager Authorization
                    </h3>
                    <button onClick={onClose} className="text-brand-text-secondary hover:text-white text-xs uppercase hover:underline">
                        Cancel
                    </button>
                </div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <p className="text-sm text-brand-text-secondary">This area requires elevated privileges.</p>
                    </div>

                    {authStatus === 'success' ? (
                        <div className="text-center py-4 animate-fade-in">
                            <ShieldCheckIcon className="w-12 h-12 text-green-400 mx-auto mb-2" />
                            <h3 className="text-lg font-bold text-green-400">Access Granted</h3>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="ENTER PASSCODE"
                                className="w-full px-4 py-3 bg-brand-dark-secondary border border-brand-border rounded-lg text-center font-mono text-lg tracking-widest text-brand-text focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                                autoFocus
                            />
                        
                            {error && (
                                <div className="text-center text-red-500 text-xs font-bold">
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Unlock Panel'}
                            </button>
                        </form>
                    )}

                    {biometricsAvailable && authStatus !== 'success' && (
                        <div className="mt-6 text-center">
                            <button 
                                onClick={handleBiometricAuth} 
                                disabled={loading} 
                                className="text-brand-accent hover:text-brand-accent-hover text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                            >
                               <FingerprintIcon className="w-4 h-4"/> Use Biometrics
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ManagerAuthModal;
