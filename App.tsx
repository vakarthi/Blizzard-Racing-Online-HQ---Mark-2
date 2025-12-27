
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/shared/LoadingSpinner';

const HqApp = lazy(() => import('./pages/HqApp'));
const PublicPortal = lazy(() => import('./pages/PublicPortal'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center bg-[#0F0518] relative overflow-hidden">
                {/* Subtle Haki background gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0F0518] to-[#0F0518]"></div>
                <LoadingSpinner />
            </div>
        }>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/hq" /> : <LoginPage />} />
            <Route
              path="/hq/*"
              element={user ? <HqApp /> : <Navigate to="/login" />}
            />
            <Route path="/*" element={<PublicPortal />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;
