
import React, { useState, useMemo } from 'react';
import { useData, useAuth } from '../../contexts/AppContext';
import { DiscussionThread } from '../../types';

const CommunicationsPage: React.FC = () => {
    const { user } = useAuth();
    const { discussionThreads, getTeamMember, addThread, addPostToThread } = useData();
    const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [showNewThreadModal, setShowNewThreadModal] = useState(false);

    const sortedThreads = useMemo(() => {
        return [...discussionThreads].sort((a, b) => {
            const lastPostA = a.posts[a.posts.length - 1].createdAt;
            const lastPostB = b.posts[b.posts.length - 1].createdAt;
            return new Date(lastPostB).getTime() - new Date(lastPostA).getTime();
        });
    }, [discussionThreads]);

    const handleSelectThread = (thread: DiscussionThread) => {
        setSelectedThread(thread);
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
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in">
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-text">Communications Hub</h1>
                <button onClick={() => setShowNewThreadModal(true)} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors">
                    + New Thread
                </button>
            </div>
            <div className="flex-grow flex border border-brand-border rounded-xl bg-brand-dark-secondary shadow-md overflow-hidden">
                {/* Threads List */}
                <div className="w-1/3 border-r border-brand-border flex flex-col bg-brand-dark">
                    <div className="p-4 border-b border-brand-border">
                        <h2 className="font-bold text-lg text-brand-text">Discussions</h2>
                    </div>
                    <ul className="overflow-y-auto flex-grow">
                        {sortedThreads.map(thread => {
                            const author = getTeamMember(thread.createdBy);
                            return (
                                <li key={thread.id} onClick={() => handleSelectThread(thread)} className={`p-4 border-b border-brand-border cursor-pointer ${selectedThread?.id === thread.id ? 'bg-brand-accent/20' : 'hover:bg-brand-border'}`}>
                                    <h3 className="font-semibold text-brand-text truncate">{thread.title}</h3>
                                    <p className="text-sm text-brand-text-secondary">Started by {author?.name}</p>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                {/* Selected Thread View */}
                <div className="w-2/3 flex flex-col">
                    {selectedThread ? (
                        <>
                            <div className="p-4 border-b border-brand-border">
                                <h2 className="font-bold text-xl text-brand-text">{selectedThread.title}</h2>
                            </div>
                            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-brand-dark">
                                {selectedThread.posts.map(post => {
                                    const author = getTeamMember(post.authorId);
                                    return (
                                        <div key={post.id} className="flex items-start gap-3">
                                            <img src={author?.avatarUrl} alt={author?.name} className="w-10 h-10 rounded-full" />
                                            <div className="bg-brand-dark-secondary p-3 rounded-lg border border-brand-border flex-1">
                                                <div className="flex items-baseline gap-2">
                                                    <p className="font-bold text-brand-text">{author?.name}</p>
                                                    <p className="text-xs text-brand-text-secondary">{new Date(post.createdAt).toLocaleString()}</p>
                                                </div>
                                                <p className="text-brand-text-secondary mt-1">{post.content}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="p-4 border-t border-brand-border bg-brand-dark-secondary">
                                <div className="flex gap-2">
                                    <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} rows={2} placeholder="Type your reply..." className="flex-grow p-2 bg-brand-dark border border-brand-border rounded-md" />
                                    <button onClick={handleReply} className="px-4 py-2 bg-brand-accent text-brand-dark font-bold rounded-md self-end">Reply</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-brand-text-secondary">
                            <p>Select a discussion to view it here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunicationsPage;