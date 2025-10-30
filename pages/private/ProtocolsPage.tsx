import React, { useState } from 'react';
import { useData } from '../../contexts/AppContext';
import { Protocol } from '../../types';
import { FileCheckIcon } from '../../components/icons';

const ProtocolsPage: React.FC = () => {
  const { protocols } = useData();
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(protocols[0] || null);

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <h1 className="text-3xl font-bold text-brand-text mb-6">Team Protocols</h1>
      <div className="flex-grow flex border border-brand-border rounded-xl bg-brand-dark-secondary shadow-md overflow-hidden">
        {/* Protocol List */}
        <div className="w-1/3 border-r border-brand-border flex flex-col bg-brand-dark">
          <div className="p-4 border-b border-brand-border">
            <h2 className="font-bold text-lg text-brand-text">Available Procedures</h2>
          </div>
          <ul className="overflow-y-auto flex-grow">
            {protocols.map(protocol => (
              <li
                key={protocol.id}
                onClick={() => setSelectedProtocol(protocol)}
                className={`p-4 border-b border-brand-border cursor-pointer ${selectedProtocol?.id === protocol.id ? 'bg-brand-accent/20' : 'hover:bg-brand-border'}`}
              >
                <h3 className="font-semibold text-brand-text truncate">{protocol.title}</h3>
                <p className="text-sm text-brand-text-secondary truncate">{protocol.description}</p>
              </li>
            ))}
            {protocols.length === 0 && (
                <li className="p-4 text-center text-brand-text-secondary">No protocols created yet.</li>
            )}
          </ul>
        </div>
        {/* Selected Protocol View */}
        <div className="w-2/3 flex flex-col">
          {selectedProtocol ? (
            <>
              <div className="p-4 border-b border-brand-border">
                <h2 className="font-bold text-xl text-brand-text">{selectedProtocol.title}</h2>
                <p className="text-sm text-brand-text-secondary mt-1">{selectedProtocol.description}</p>
              </div>
              <div className="flex-grow p-6 overflow-y-auto bg-brand-dark">
                <ol className="list-decimal list-inside space-y-4 text-brand-text">
                  {selectedProtocol.steps.map((step, index) => (
                    <li key={index} className="pl-2 border-l-2 border-brand-accent/50">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-brand-text-secondary">
                <FileCheckIcon className="w-16 h-16 mb-4 text-brand-border" />
                <p className="font-semibold">Select a protocol to view its steps.</p>
                <p className="text-sm">Managers can create new protocols in the Manager Command Center.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolsPage;
