
import React, { useState } from 'react';
import { SparklesIcon } from '../../components/icons';
import { generateSocialPostTemplate } from '../../services/localSimulationService';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const SocialsPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setGeneratedPost('');
    // Simulate a brief generation time for better UX
    setTimeout(() => {
        const post = generateSocialPostTemplate(topic);
        setGeneratedPost(post);
        setIsLoading(false);
    }, 500);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-text mb-6">Socials Post Generator</h1>
      
      <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border mb-8">
        <h2 className="text-xl font-bold text-brand-text mb-4">Generate New Post</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-brand-text-secondary mb-1">
              What is the post about?
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., A new front wing design, a race weekend win..."
              className="w-full px-4 py-2 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-text-secondary flex items-center justify-center"
          >
            {isLoading ? (
              <><LoadingSpinner /> <span className="ml-2">Generating...</span></>
            ) : (
              <><SparklesIcon className="w-5 h-5 mr-2" /> Generate Post from Template</>
            )}
          </button>
        </div>
      </div>

      {generatedPost && (
        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border animate-fade-in">
            <h2 className="text-xl font-bold text-brand-text mb-4">Generated Post</h2>
            <div className="bg-brand-dark p-4 rounded-lg whitespace-pre-wrap font-mono text-brand-text-secondary border border-brand-border">
                {generatedPost}
            </div>
             <button
                onClick={() => navigator.clipboard.writeText(generatedPost)}
                className="mt-4 bg-brand-accent text-brand-dark font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors"
            >
                Copy to Clipboard
            </button>
        </div>
      )}
    </div>
  );
};

export default SocialsPage;