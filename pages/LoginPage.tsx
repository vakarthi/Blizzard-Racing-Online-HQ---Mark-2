

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useData } from '../contexts/AppContext';
import { CarIcon, FingerprintIcon } from '../components/icons';
import { useKonamiCode } from '../hooks/useKonamiCode';
import { UserRole, User } from '../types';
import { authenticateWithBiometrics } from '../utils/biometrics';

// Konami Code sequence and hardcoded password
const KONAMI_CODE = ['h', 'y', 'd', 'r', 'a', '7'];
const KONAMI_PASSWORD = '__HYDRA7__';

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

  const handleRegularLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const user = await login(email, password);
    if (!user) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      navigate('/');
    }
  };
  
  const handleKonamiLogin = useCallback(async () => {
    setLoading(true);
    setError('');
    const user = await login(email, KONAMI_PASSWORD);
    if (!user) {
      setError('Authentication failed. Please check your email.');
      setLoading(false);
      setIsManagerLogin(false); // Revert to normal login on failure
    } else {
      navigate('/');
    }
  }, [email, login, navigate]);

  const matchedCount = useKonamiCode(handleKonamiLogin, KONAMI_CODE);

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
    try {
        await authenticateWithBiometrics(config.credentialId);
        // On success, use special password to log in the user
        await login(biometricUser.email, '__BIOMETRIC_SUCCESS__');
        navigate('/');
    } catch (err) {
        console.error(err);
        setError('Biometric login failed. Please use your password.');
    } finally {
        setLoading(false);
    }
  };

  const SequencePlaceholder: React.FC<{ matched: boolean }> = ({ matched }) => (
    <div className={`w-6 h-6 rounded-full transition-all duration-200 ${matched ? 'bg-brand-accent shadow-glow-accent' : 'bg-brand-dark border-2 border-brand-border'}`}></div>
  );

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-brand-dark-secondary rounded-2xl shadow-2xl p-8 animate-fade-in border border-brand-border">
        <div className="text-center mb-8">
            <div className="inline-block bg-brand-dark p-3 rounded-full mb-4 border border-brand-border">
                <CarIcon className="w-8 h-8 text-brand-accent"/>
            </div>
            <h1 className="text-3xl font-bold text-brand-text">Blizzard Racing HQ</h1>
            <p className="text-brand-text-secondary mt-2">Team HQ Login</p>
        </div>
        
        <form onSubmit={handleRegularLogin}>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={checkEmailForManager}
                className="w-full px-4 py-2 border border-brand-border bg-brand-dark rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
                placeholder="user@blizzard.rac"
                required
              />
            </div>

            {isManagerLogin ? (
                <div className="text-center p-4 bg-brand-dark rounded-lg border border-brand-border animate-fade-in">
                    <h3 className="font-bold text-brand-accent">Manager Login Detected</h3>
                    <p className="text-sm text-brand-text-secondary mt-1 mb-4">Enter the secret key sequence.</p>
                    <div className="flex justify-center items-center gap-3">
                        {Array.from({ length: KONAMI_CODE.length }).map((_, index) => (
                            <SequencePlaceholder key={index} matched={index < matchedCount} />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                  <label htmlFor="password"  className="block text-sm font-medium text-brand-text-secondary mb-1">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-brand-border bg-brand-dark rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
            )}
          </div>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          
          {!isManagerLogin && (
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-text-secondary flex items-center justify-center"
            >
                {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          )}
        </form>

        {biometricUser && (
            <>
                <div className="my-4 flex items-center gap-2">
                    <hr className="flex-grow border-brand-border"/>
                    <span className="text-xs text-brand-text-secondary">OR</span>
                    <hr className="flex-grow border-brand-border"/>
                </div>
                <button onClick={handleBiometricLogin} disabled={loading} className="w-full bg-brand-surface text-brand-text font-bold py-3 px-4 rounded-lg border border-brand-border flex items-center justify-center gap-2 hover:bg-brand-border transition-colors">
                    <FingerprintIcon className="w-5 h-5"/> Sign in as {biometricUser.name}
                </button>
            </>
        )}

        <p className="text-xs text-brand-text-secondary text-center mt-6">
            For public updates, visit our <a href="#/public" className="text-brand-accent hover:underline">Public Portal</a>.
        </p>
         <p className="text-xs text-brand-text-secondary text-center mt-2">
            (Hint: The password for all mock accounts is 'password123')
        </p>
      </div>
    </div>
  );
};

export default LoginPage;