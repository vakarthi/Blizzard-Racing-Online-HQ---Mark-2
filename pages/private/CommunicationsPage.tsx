
import React, { useState, useMemo } from 'react';
import { useData, useAuth } from '../../contexts/AppContext';
import { DiscussionThread, UserRole } from '../../types';
import { ArrowLeftIcon } from '../../components/icons';

const CommunicationsPage: React.FC = () => {
    const { user } = useAuth();
    const { discussionThreads, getTeamMember, addThread, addPostToThread } = useData();
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [showNewThreadModal, setShowNewThreadModal] = useState(false);
    const isMember = user?.role === UserRole.Member;

    const sortedThreads = useMemo(() => {
        return [...discussionThreads].sort((a, b) => {
            const lastPostA = a.posts[a.posts.length - 1].createdAt;
            const lastPostB = b.posts[b.posts.length - 1].createdAt;
            return new Date(lastPostB).getTime() - new Date(lastPostA).getTime();
        });
    }, [discussionThreads]);
    
    const selectedThread = useMemo(() => {
        if (!selectedThreadId) return null;
        const thread = sortedThreads.find(thread => thread.id === selectedThreadId);
        return thread || null;
    }, [selectedThreadId, sortedThreads]);


    const handleSelectThread = (thread: DiscussionThread) => {
        setSelectedThreadId(thread.id);
    };

    const handleBackToList = () => {
        setSelectedThreadId(null);
    };

    const handleReply = () => {
        if (!replyContent.trim() || !selectedThread || !user) return;
        addPostToThread(selectedThread.id, replyContent, user.id);
        setReplyContent('');
    };
    
    const NewThreadModal = () => {
        const [title, setTitle] = useState('');
        const [content, setContent] = useState('');

        const handleSubmit = () => {
            if (!title.trim() || !content.trim() || !user) return;
            addThread(title, content, user.id);
            setShowNewThreadModal(false);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in p-4">
                <div className="bg-brand-dark-secondary p-6 rounded-lg shadow-xl w-full max-w-lg border border-brand-border">
                    <h2 className="text-2xl font-bold text-brand-text mb-4">Start New Discussion</h2>
                    <input type="text" placeholder="Thread Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-brand-dark border border-brand-border rounded-md mb-4"/>
                    <textarea placeholder="Your message..." value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full p-2 bg-brand-dark border border-brand-border rounded-md mb-4"/>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowNewThreadModal(false)} className="px-4 py-2 bg-brand-border rounded-md">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-brand-accent text-brand-dark font-bold rounded-md">Create Thread</button>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="animate-fade-in h-full flex flex-col">
            {showNewThreadModal && <NewThreadModal />}
            <div className={`flex justify-between items-center mb-6 ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
                <h1 className="text-3xl font-bold text-brand-text">Communications Hub</h1>
                {!isMember && (
                    <button onClick={() => setShowNewThreadModal(true)} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors">
                        + New Thread
                    </button>
                )}
            </div>
            
            <div className="flex-grow flex border border-brand-border rounded-xl bg-brand-dark-secondary shadow-md overflow-hidden relative">
                {/* Threads List Column */}
                <div className={`flex-col bg-brand-dark border-r border-brand-border transition-all duration-300
                    ${selectedThread ? 'hidden md:flex md:w-1/3' : 'flex w-full md:w-1/3'}
                `}>
                    <div className="p-4 border-b border-brand-border flex-shrink-0">
                        <h2 className="font-bold text-lg text-brand-text">Discussions</h2>
                    </div>
                    <ul className="overflow-y-auto flex-grow">
                        {sortedThreads.map(thread => {
                            const author = getTeamMember(thread.createdBy);
                            const lastPost = thread.posts[thread.posts.length - 1];
                            return (
                                <li key={thread.id} onClick={() => handleSelectThread(thread)} className={`p-4 border-b border-brand-border cursor-pointer transition-colors ${selectedThread?.id === thread.id ? 'bg-brand-accent/20' : 'hover:bg-brand-surface'}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-brand-text truncate pr-2">{thread.title}</h3>
                                        <span className="text-[10px] text-brand-text-secondary whitespace-nowrap">{new Date(lastPost.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-brand-text-secondary truncate">Started by {author?.name}</p>
                                    <p className="text-xs text-brand-text-secondary/70 mt-1 truncate">{lastPost.content}</p>
                                </li>
                            )
                        })}
                        {sortedThreads.length === 0 && <li className="p-6 text-center text-brand-text-secondary">No discussions yet.</li>}
                    </ul>
                </div>

                {/* Selected Thread View Column */}
                <div className={`flex-col bg-brand-dark-secondary transition-all duration-300
                    ${selectedThread ? 'flex w-full md:w-2/3' : 'hidden md:flex md:w-2/3'}
                `}>
                    {selectedThread ? (
                        <>
                            <div className="p-4 border-b border-brand-border flex items-center gap-3 bg-brand-dark md:bg-transparent shadow-sm md:shadow-none z-10">
                                <button onClick={handleBackToList} className="md:hidden p-2 -ml-2 rounded-full hover:bg-brand-surface text-brand-text">
                                    <ArrowLeftIcon className="w-5 h-5"/>
                                </button>
                                <h2 className="font-bold text-xl text-brand-text truncate">{selectedThread.title}</h2>
                            </div>
                            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-brand-dark">
                                {selectedThread.posts.map(post => {
                                    const author = getTeamMember(post.authorId);
                                    return (
                                        <div key={post.id} className="flex items-start gap-3">
                                            <img src={author?.avatarUrl} alt={author?.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover" />
                                            <div className="bg-brand-dark-secondary p-3 rounded-lg border border-brand-border flex-1 min-w-0">
                                                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                                                    <p className="font-bold text-brand-text text-sm md:text-base">{author?.name}</p>
                                                    <p className="text-[10px] md:text-xs text-brand-text-secondary">{new Date(post.createdAt).toLocaleString()}</p>
                                                </div>
                                                <p className="text-brand-text-secondary text-sm md:text-base whitespace-pre-wrap break-words">{post.content}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {!isMember && (
                                <div className="p-4 border-t border-brand-border bg-brand-dark-secondary flex-shrink-0">
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} rows={2} placeholder="Type your reply..." className="flex-grow p-3 bg-brand-dark border border-brand-border rounded-lg focus:ring-1 focus:ring-brand-accent focus:outline-none resize-none" />
                                        <button onClick={handleReply} disabled={!replyContent.trim()} className="px-4 py-2 bg-brand-accent text-brand-dark font-bold rounded-lg self-end md:self-stretch disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-accent-hover transition-colors">Reply</button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-brand-text-secondary p-8 text-center">
                            <div className="w-16 h-16 bg-brand-dark rounded-full flex items-center justify-center mb-4 border border-brand-border">
                                <ArrowLeftIcon className="w-8 h-8 opacity-20" />
                            </div>
                            <p>Select a discussion from the list to view it here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunicationsPage;
