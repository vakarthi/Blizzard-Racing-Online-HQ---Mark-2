import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { useAuth } from '../../contexts/AppContext';
import { authenticateWithBiometrics } from '../../utils/biometrics';
import { FingerprintIcon } from '../icons';

const ManagerAuthModal: React.FC<{ isOpen: boolean; onSuccess: () => void; onClose: () => void }> = ({ isOpen, onSuccess, onClose }) => {
    const { user, verifyPassword, getBiometricConfig } = useAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [biometricsAvailable, setBiometricsAvailable] = useState(false);
    
    const biometricConfig = getBiometricConfig();

    useEffect(() => {
        if (biometricConfig && user && biometricConfig.userId === user.id) {
            setBiometricsAvailable(true);
        } else {
            setBiometricsAvailable(false);
        }
    }, [biometricConfig, user]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const isValid = await verifyPassword(password);
        if (isValid) {
            onSuccess();
        } else {
            setError('Incorrect password.');
        }
        setLoading(false);
    };

    const handleBiometricAuth = async () => {
        if (!biometricConfig) return;
        setLoading(true);
        setError('');
        try {
            await authenticateWithBiometrics(biometricConfig.credentialId);
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('Biometric authentication failed.');
        }
        setLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manager Panel Authentication">
            <div className="text-center">
                <p className="text-brand-text-secondary mb-6">This area requires additional authentication to proceed.</p>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="manager-password" className="sr-only">Password</label>
                         <input
                            id="manager-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-brand-border bg-brand-dark rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
                        />
                    </div>
                   
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors">
                        {loading ? 'Verifying...' : 'Unlock Panel'}
                    </button>
                </form>

                {biometricsAvailable && (
                    <>
                        <div className="my-4 flex items-center gap-2">
                            <hr className="flex-grow border-brand-border"/>
                            <span className="text-xs text-brand-text-secondary">OR</span>
                            <hr className="flex-grow border-brand-border"/>
                        </div>
                        <button onClick={handleBiometricAuth} disabled={loading} className="w-full bg-brand-surface text-brand-text font-bold py-2 px-4 rounded-lg border border-brand-border flex items-center justify-center gap-2 hover:bg-brand-border transition-colors">
                           <FingerprintIcon className="w-5 h-5"/> Use Biometrics
                        </button>
                    </>
                )}
            </div>
        </Modal>
    );
};
export default ManagerAuthModal;
