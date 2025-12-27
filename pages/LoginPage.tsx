
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useData } from '../contexts/AppContext';
import { CarIcon, FingerprintIcon, ShieldAlertIcon } from '../components/icons';
import { UserRole, User } from '../types';
import { authenticateWithBiometrics } from '../utils/biometrics';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, getBiometricConfig } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();
  const [isManagerLogin, setIsManagerLogin] = useState(false);
  const [biometricUser, setBiometricUser] = useState<User | null>(null);

  useEffect(() => {
    const config = getBiometricConfig();
    if (config) {
      const user = users.find(u => u.id === config.userId);
      if (user) {
        setBiometricUser(user);
      }
    }
  }, [users, getBiometricConfig]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Play the full "Drums of Liberation" animation sequence (5 seconds)
    const startTime = Date.now();
    
    try {
        const user = await login(email, password);
        const elapsedTime = Date.now() - startTime;
        // Extended delay for the "Welcome" effect
        const remainingTime = Math.max(0, 5000 - elapsedTime);

        if (!user) {
            setLoading(false);
            setError('Invalid email or password.');
        } else {
            setTimeout(() => {
                navigate('/hq');
            }, remainingTime);
        }
    } catch (err) {
        setLoading(false);
        setError('Login failed');
    }
  };

  const checkEmailForManager = () => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (foundUser && foundUser.role === UserRole.Manager) {
        setIsManagerLogin(true);
    } else {
        setIsManagerLogin(false);
    }
  };

  const handleBiometricLogin = async () => {
    const config = getBiometricConfig();
    if (!config || !biometricUser) return;
    setLoading(true);
    setError('');
    
    const startTime = Date.now();

    try {
        await authenticateWithBiometrics(config.credentialId);
        await login(biometricUser.email, '__BIOMETRIC_SUCCESS__');
        
        const elapsedTime = Date.now() - startTime;
        // Extended delay for the "Welcome" effect
        const remainingTime = Math.max(0, 5000 - elapsedTime);
        
        setTimeout(() => {
            navigate('/hq');
        }, remainingTime);
        
    } catch (err) {
        console.error(err);
        setError('Biometric login failed. Please use your password.');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Full Screen Loading Overlay (Nika Awakening) */}
      {loading && (
          <div className="fixed inset-0 z-50 bg-[#0F0518] flex items-center justify-center animate-fade-in overflow-hidden">
              {/* Deep purple/black background for maximum contrast with white Gear 5 effects */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2e1065_0%,_#020617_70%)] animate-pulse"></div>
              
              {/* Subtle rising particles */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-smoke-spin"></div>
              
              <LoadingSpinner />
          </div>
      )}

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className={`w-full max-w-md glass-panel rounded-3xl p-8 md:p-10 animate-fade-in relative z-10 shadow-2xl transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center bg-gradient-to-br from-brand-surface to-brand-dark p-4 rounded-2xl mb-6 border border-brand-border/50 shadow-lg">
                <CarIcon className="w-10 h-10 text-brand-accent"/>
            </div>
            <h1 className="text-3xl font-display font-bold text-brand-text tracking-tight">Blizzard HQ</h1>
            <p className="text-brand-text-secondary mt-2 font-medium">Secure Team Access</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={checkEmailForManager}
                className="w-full px-4 py-3 border border-brand-border/50 bg-brand-dark/50 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent/50 focus:outline-none transition-all text-brand-text placeholder-brand-text-secondary/50"
                placeholder="engineer@blizzard.rac"
                required
              />
            </div>

            {isManagerLogin && (
                <div className="flex items-center gap-3 p-3 bg-brand-accent/5 rounded-xl border border-brand-accent/20 animate-fade-in text-sm text-brand-accent">
                    <ShieldAlertIcon className="w-5 h-5 flex-shrink-0" />
                    <div>
                        <p className="font-bold">Manager Access Detected</p>
                        <p className="text-xs opacity-80">Higher privilege authentication required.</p>
                    </div>
                </div>
            )}

            <div>
              <label htmlFor="password"  className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-brand-border/50 bg-brand-dark/50 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent/50 focus:outline-none transition-all text-brand-text placeholder-brand-text-secondary/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm text-center font-medium bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
          
          <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-accent text-brand-dark font-bold py-3.5 px-4 rounded-xl hover:bg-brand-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-accent flex items-center justify-center"
          >
              Sign In
          </button>
        </form>

        {biometricUser && (
            <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-brand-text-secondary/50">
                    <div className="h-px bg-brand-border flex-grow"></div>
                    <span className="text-xs font-mono">QUICK ACCESS</span>
                    <div className="h-px bg-brand-border flex-grow"></div>
                </div>
                <button onClick={handleBiometricLogin} disabled={loading} className="w-full bg-brand-surface hover:bg-white/5 text-brand-text font-bold py-3 px-4 rounded-xl border border-brand-border flex items-center justify-center gap-3 transition-all group">
                    <FingerprintIcon className="w-5 h-5 text-brand-accent group-hover:scale-110 transition-transform"/> 
                    <span>Authenticate as {biometricUser.name}</span>
                </button>
            </div>
        )}

        <div className="mt-8 text-center space-y-4">
            <p className="text-xs text-brand-text-secondary">
                <a href="#/" className="text-brand-text hover:text-brand-accent transition-colors underline decoration-brand-border underline-offset-4">Return to Public Portal</a>
            </p>
             <p className="text-[10px] text-brand-text-secondary/50 font-mono">
                System ID: BLZ-HQ-V2.8 | Dev Pass: 'password123'
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
