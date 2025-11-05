
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
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-brand-dark"><LoadingSpinner /></div>}>
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