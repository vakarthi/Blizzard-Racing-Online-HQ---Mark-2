
import React from 'react';
import { useData } from '../../contexts/AppContext';
import { BriefcaseIcon, MailIcon, UserCircleIcon } from '../../components/icons';

const LeadsPage: React.FC = () => {
    const { inquiries } = useData();

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-brand-text mb-2">Aerotest Premium Leads</h1>
            <p className="text-brand-text-secondary mb-6">Inquiries submitted through the public portal contact form.</p>

            <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border">
                {inquiries.length > 0 ? (
                    <div className="space-y-4">
                        {inquiries.map(inquiry => (
                            <div key={inquiry.id} className="bg-brand-dark p-4 rounded-lg border border-brand-border">
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
