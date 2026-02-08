
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { useData } from '../../contexts/AppContext';
import { queryLocalAI } from '../../services/localAiService';
import { BotIcon, XIcon, SparklesIcon } from '../icons';
import LoadingSpinner from '../shared/LoadingSpinner';

interface IcicleProps {
    gear5Mode: boolean; // Kept as prop to not break signature, but ignored
}

const Icicle: React.FC<IcicleProps> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const data = useData();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen) {
            setMessages([{
                id: 'welcome-1',
                sender: 'bot',
                text: "Hello! I am the Blizzard AI Assistant. Ask me about project status, team data, or engineering protocols.",
                timestamp: new Date().toISOString()
            }]);
        }
    }, [isOpen]);

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
            const botResponseText = queryLocalAI(input, data, false);
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
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-brand-accent text-brand-dark rounded-full p-4 shadow-lg hover:brightness-110 transition-transform transform hover:scale-110 z-50 shadow-glow-accent"
                aria-label="Open Assistant"
            >
               <SparklesIcon className="w-6 h-6" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-brand-dark-secondary border border-brand-border backdrop-blur-md rounded-2xl shadow-2xl flex flex-col animate-slide-in-up z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-brand-dark border-b border-brand-border rounded-t-2xl">
                <div className="flex items-center">
                    <BotIcon className="w-5 h-5 mr-2 text-brand-accent" />
                    <h3 className="font-bold text-sm text-brand-text">Blizzard AI</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full text-brand-text-secondary">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto bg-brand-dark/50">
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && (
                                <BotIcon className="w-6 h-6 p-1 bg-brand-dark border border-brand-border rounded-full flex-shrink-0 text-brand-accent" />
                            )}
                            <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-brand-accent text-brand-dark font-medium rounded-br-none' : 'bg-brand-surface text-brand-text border border-brand-border rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2">
                            <BotIcon className="w-6 h-6 p-1 bg-brand-dark border border-brand-border rounded-full flex-shrink-0 text-brand-accent" />
                            <div className="px-4 py-2 rounded-2xl bg-brand-surface border border-brand-border rounded-bl-none">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-brand-text-secondary rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-brand-text-secondary rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-brand-text-secondary rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-brand-border bg-brand-dark rounded-b-2xl">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 bg-brand-dark-secondary border border-brand-border rounded-full focus:ring-1 focus:ring-brand-accent focus:outline-none text-sm text-brand-text"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-2 bg-brand-accent text-brand-dark rounded-full hover:bg-brand-accent-hover disabled:opacity-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Icicle;
