
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { useData } from '../../contexts/AppContext';
import { queryLocalAI } from '../../services/localAiService';
import { BotIcon, XIcon, SparklesIcon, BrainCircuitIcon } from '../icons';
import LoadingSpinner from '../shared/LoadingSpinner';

interface IcicleProps {
    gear5Mode: boolean;
}

const Icicle: React.FC<IcicleProps> = ({ gear5Mode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [isAiCoreMode, setIsAiCoreMode] = useState(gear5Mode);
    
    const data = useData();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsAiCoreMode(gear5Mode);
    }, [gear5Mode]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen) {
            const greeting = isAiCoreMode 
                ? "Connection established to Punk Records. This is AI Core Shaka. State your query." 
                : "Hello! I am Icicle, your intelligent assistant. How can I help you analyze our team data today?";
            
            setMessages([{
                id: 'welcome-1',
                sender: 'bot',
                text: greeting,
                timestamp: new Date().toISOString()
            }]);
        }
    }, [isOpen, isAiCoreMode]);

    // Easter Egg Trigger via clicks (alternate to Konami code)
    const handleIconClick = () => {
        if (!gear5Mode) {
            setClickCount(prev => {
                const newCount = prev + 1;
                if (newCount === 5) {
                    setIsAiCoreMode(true);
                }
                return newCount;
            });
        }
        setIsOpen(true);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: input,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        setTimeout(() => {
            // Pass the AI Core state to the AI service to flavor the response
            const botResponseText = queryLocalAI(input, data, isAiCoreMode);
            const botMessage: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                sender: 'bot',
                text: botResponseText,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={handleIconClick}
                className={`fixed bottom-6 right-6 ${isAiCoreMode ? 'bg-pink-500' : 'bg-brand-accent'} text-brand-dark rounded-full p-4 shadow-lg hover:brightness-110 transition-transform transform hover:scale-110 z-50 shadow-glow-accent`}
                aria-label="Open Assistant"
            >
                {isAiCoreMode ? <BrainCircuitIcon className="w-8 h-8" /> : <SparklesIcon className="w-8 h-8" />}
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 w-[400px] h-[600px] ${isAiCoreMode ? 'bg-black/90 border-pink-500/30' : 'bg-brand-dark-secondary/70 border-brand-accent/20'} backdrop-blur-md rounded-2xl shadow-2xl flex flex-col animate-slide-in-up z-50 border`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-transparent text-brand-text border-b border-white/10">
                <div className="flex items-center">
                    {isAiCoreMode ? <BrainCircuitIcon className="w-6 h-6 mr-2 text-pink-400" /> : <BotIcon className="w-6 h-6 mr-2 text-brand-accent" />}
                    <h3 className={`font-bold text-lg ${isAiCoreMode ? 'font-egghead uppercase tracking-widest' : ''}`}>
                        {isAiCoreMode ? 'AI Core' : 'Icicle'}
                    </h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-brand-border/50 p-1 rounded-full">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && (
                                isAiCoreMode 
                                ? <BrainCircuitIcon className="w-8 h-8 p-1.5 bg-pink-500/20 text-pink-400 rounded-full flex-shrink-0 border border-pink-500/30" />
                                : <BotIcon className="w-8 h-8 p-1.5 bg-brand-dark/50 text-brand-accent rounded-full flex-shrink-0 border border-brand-border/50" />
                            )}
                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? (isAiCoreMode ? 'bg-pink-500 text-white' : 'bg-brand-accent text-brand-dark') + ' font-semibold' : 'bg-brand-surface/80 text-brand-text'}`}>
                                <p className={`text-sm ${isAiCoreMode && msg.sender === 'bot' ? 'font-mono' : ''}`}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2">
                            {isAiCoreMode 
                                ? <BrainCircuitIcon className="w-8 h-8 p-1.5 bg-pink-500/20 text-pink-400 rounded-full flex-shrink-0 border border-pink-500/30" />
                                : <BotIcon className="w-8 h-8 p-1.5 bg-brand-dark/50 text-brand-accent rounded-full flex-shrink-0 border border-brand-border/50" />
                            }
                            <div className="max-w-xs px-4 py-2 rounded-2xl bg-brand-surface/80 text-brand-text">
                                <LoadingSpinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isAiCoreMode ? "Connect to Punk Records..." : "Ask about projects, finances..."}
                        className={`w-full px-4 py-2 border bg-brand-dark/80 rounded-full focus:ring-2 focus:outline-none text-brand-text ${isAiCoreMode ? 'border-pink-500/30 focus:ring-pink-500 font-mono text-xs' : 'border-brand-border/50 focus:ring-brand-accent'}`}
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className={`rounded-full p-2 disabled:bg-brand-text-secondary ${isAiCoreMode ? 'bg-pink-500 text-white' : 'bg-brand-accent text-brand-dark'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Icicle;
