import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerAuthModal from '../../components/hq/ManagerAuthModal';
import ManagerPanelPage from './ManagerPanelPage';

const ManagerPanelGate: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const navigate = useNavigate();

  if (isUnlocked) {
    return <ManagerPanelPage />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* This component manages the modal state for the manager panel */}
      <ManagerAuthModal
        isOpen={!isUnlocked}
        onSuccess={() => setIsUnlocked(true)}
        onClose={() => navigate('/')} // Go back to dashboard if modal is closed
      />
    </div>
  );
};

export default ManagerPanelGate;
