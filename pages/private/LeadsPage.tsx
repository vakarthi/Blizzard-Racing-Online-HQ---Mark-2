
import React from 'react';
import { useData } from '../../contexts/AppContext';
import { BriefcaseIcon, MailIcon } from '../../components/icons';

const LeadsPage: React.FC = () => {
    const { inquiries, updateInquiryStatus } = useData();

    const statusClasses = {
        pending: 'border-brand-border',
        accepted: 'border-green-500/50',
        rejected: 'border-red-500/50',
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-brand-text mb-2">Aerotest Premium Leads</h1>
            <p className="text-brand-text-secondary mb-6">Inquiries submitted through the public portal contact form.</p>

            <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border">
                {inquiries.length > 0 ? (
                    <div className="space-y-4">
                        {inquiries.map(inquiry => (
                            <div key={inquiry.id} className={`bg-brand-dark p-4 rounded-lg border ${statusClasses[inquiry.status]}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-brand-accent">{inquiry.name}</p>
                                        <div className="flex items-center gap-4 text-sm text-brand-text-secondary mt-1">
                                            <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:text-brand-accent"><MailIcon className="w-4 h-4" /> {inquiry.email}</a>
                                            {inquiry.company && <span className="flex items-center gap-1"><BriefcaseIcon className="w-4 h-4" /> {inquiry.company}</span>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-brand-text-secondary flex-shrink-0">{new Date(inquiry.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-brand-border">
                                    <p className="text-brand-text-secondary whitespace-pre-wrap">{inquiry.message}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-brand-border flex justify-end items-center gap-3">
                                    {inquiry.status === 'pending' ? (
                                        <>
                                            <button onClick={() => updateInquiryStatus(inquiry.id, 'rejected')} className="text-sm font-semibold bg-red-500/20 text-red-300 px-3 py-1 rounded-md hover:bg-red-500/30 transition-colors">
                                                Reject
                                            </button>
                                            <button onClick={() => updateInquiryStatus(inquiry.id, 'accepted')} className="text-sm font-semibold bg-green-500/20 text-green-300 px-3 py-1 rounded-md hover:bg-green-500/30 transition-colors">
                                                Accept
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${inquiry.status === 'accepted' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                         <BriefcaseIcon className="w-16 h-16 text-brand-border mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-brand-text">No Leads Yet</h3>
                        <p className="text-brand-text-secondary mt-2">When a visitor submits an inquiry on the Aerotest Premium page, it will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadsPage;