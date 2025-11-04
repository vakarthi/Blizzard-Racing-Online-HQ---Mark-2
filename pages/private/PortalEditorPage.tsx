


import React, { useState, useEffect } from 'react';
import { useData, useAuth } from '../../contexts/AppContext';
import { PublicPortalContent, StatItem, UserRole } from '../../types';
import { EditIcon, HistoryIcon, SaveIcon, TrashIcon, UploadIcon, XIcon } from '../../components/icons';
import FbxViewer from '../../components/shared/FbxViewer';

const PortalEditorPage: React.FC = () => {
    const { user } = useAuth();
    const { publicPortalContent, publicPortalContentHistory, updatePublicPortalContent, revertToVersion, getTeamMember } = useData();
    const [view, setView] = useState<'editor' | 'history'>('editor');
    const [editableContent, setEditableContent] = useState<PublicPortalContent>(publicPortalContent);
    const [activeSection, setActiveSection] = useState<keyof PublicPortalContent>('home');
    const [isDirty, setIsDirty] = useState(false);
    const isMember = user?.role === UserRole.Member;

    useEffect(() => {
        setEditableContent(publicPortalContent);
        setIsDirty(false);
    }, [publicPortalContent]);

    const handleInputChange = (section: keyof PublicPortalContent, field: string, value: any) => {
        setEditableContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
        setIsDirty(true);
    };

    const handleImageUpload = (section: keyof PublicPortalContent, field: string, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            handleInputChange(section, field, reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFbxUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            handleInputChange('car', 'carModelFbx', reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    
    const handleStatChange = (index: number, field: 'label' | 'value', value: string) => {
        const newStats = [...editableContent.about.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setEditableContent(prev => ({
            ...prev,
            about: { ...prev.about, stats: newStats }
        }));
        setIsDirty(true);
    };

    const addStat = () => {
        const newStats = [...editableContent.about.stats, { id: Date.now(), label: 'New Stat', value: '0' }];
        setEditableContent(prev => ({
            ...prev,
            about: { ...prev.about, stats: newStats }
        }));
        setIsDirty(true);
    };

    const removeStat = (id: number) => {
        const newStats = editableContent.about.stats.filter(s => s.id !== id);
        setEditableContent(prev => ({
            ...prev,
            about: { ...prev.about, stats: newStats }
        }));
        setIsDirty(true);
    };

    const handleSaveChanges = () => {
        updatePublicPortalContent(editableContent);
        setIsDirty(false);
    };
    
    const sections: { key: keyof PublicPortalContent, name: string }[] = [
        { key: 'home', name: 'Home Page' },
        { key: 'about', name: 'About Page' },
        { key: 'team', name: 'Team Page' },
        { key: 'car', name: 'Our Car Page' },
        { key: 'competition', name: 'Competition Page' },
        { key: 'sponsors', name: 'Sponsors Page' },
        { key: 'news', name: 'News Page' },
        { key: 'contact', name: 'Contact Page' },
    ];

    const renderEditor = () => {
        const currentSectionData = editableContent[activeSection];
        
        if (activeSection === 'car') {
             return (
                 <fieldset disabled={isMember} className="space-y-6">
                    <h2 className="text-2xl font-bold text-brand-accent">Our Car Page Editor</h2>
                    <div>
                        <label className="block text-sm font-bold text-brand-text-secondary mb-1">Title</label>
                        <input type="text" value={editableContent.car.title} onChange={e => handleInputChange('car', 'title', e.target.value)} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-text-secondary mb-1">Subtitle</label>
                        <textarea value={editableContent.car.subtitle} onChange={e => handleInputChange('car', 'subtitle', e.target.value)} rows={3} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                    </div>
                    <div className="border-t border-brand-border pt-6 space-y-4">
                        <h3 className="text-xl font-bold text-brand-text">3D Model</h3>
                        <div>
                            <label className="block text-sm font-bold text-brand-text-secondary mb-1">Upload FBX Model</label>
                            <input type="file" accept=".fbx" onChange={e => e.target.files && handleFbxUpload(e.target.files[0])} className="block w-full text-sm text-brand-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent/20 file:text-brand-accent hover:file:bg-brand-accent/30 cursor-pointer"/>
                            {editableContent.car.carModelFbx && (
                                <button onClick={() => handleInputChange('car', 'carModelFbx', null)} className="text-xs text-red-400 hover:underline mt-1">Remove Model</button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="blur-toggle"
                                checked={editableContent.car.isCarModelBlurred}
                                onChange={e => handleInputChange('car', 'isCarModelBlurred', e.target.checked)}
                                className="h-5 w-5 rounded border-brand-border text-brand-accent focus:ring-brand-accent bg-brand-dark"
                            />
                            <label htmlFor="blur-toggle" className="text-sm font-medium text-brand-text">Blur model on public page (for reveals)</label>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-brand-text-secondary mb-2">Live Preview</label>
                            <FbxViewer fbxDataUrl={editableContent.car.carModelFbx} isBlurred={editableContent.car.isCarModelBlurred} />
                        </div>
                    </div>
                </fieldset>
            )
        }
        
        return (
            <fieldset disabled={isMember} className="space-y-6">
                <h2 className="text-2xl font-bold text-brand-accent">{sections.find(s=>s.key === activeSection)?.name} Editor</h2>
                {Object.entries(currentSectionData).map(([field, value]) => {
                    if (field === 'stats') { // Special handler for stats array
                        return (
                            <div key="stats-editor">
                                <label className="block text-sm font-bold text-brand-text-secondary mb-2">About Page Stats</label>
                                <div className="space-y-2">
                                    {editableContent.about.stats.map((stat, index) => (
                                        <div key={stat.id} className="flex items-center gap-2 bg-brand-dark p-2 rounded-md">
                                            <input type="text" value={stat.label} onChange={e => handleStatChange(index, 'label', e.target.value)} placeholder="Label" className="w-full p-2 bg-brand-dark-secondary border border-brand-border rounded-md" />
                                            <input type="text" value={stat.value} onChange={e => handleStatChange(index, 'value', e.target.value)} placeholder="Value" className="w-1/2 p-2 bg-brand-dark-secondary border border-brand-border rounded-md" />
                                            <button onClick={() => removeStat(stat.id)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addStat} className="text-sm text-brand-accent hover:underline mt-2">+ Add Stat</button>
                            </div>
                        )
                    }

                    const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    if (field.toLowerCase().includes('image')) {
                        return (
                             <div key={field}>
                                <label className="block text-sm font-bold text-brand-text-secondary mb-1">{label}</label>
                                <div className="flex items-center gap-4">
                                    <img src={value as string} alt="background preview" className="w-32 h-20 object-cover rounded-md bg-brand-dark" />
                                    <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(activeSection, field, e.target.files[0])} className="block w-full text-sm text-brand-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent/20 file:text-brand-accent hover:file:bg-brand-accent/30 cursor-pointer"/>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div key={field}>
                            <label className="block text-sm font-bold text-brand-text-secondary mb-1">{label}</label>
                            <textarea
                                value={value as string}
                                onChange={e => handleInputChange(activeSection, field, e.target.value)}
                                rows={(value as string).length > 100 ? 5 : 2}
                                className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
                            />
                        </div>
                    );
                })}
            </fieldset>
        );
    };

    const renderHistory = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-accent">Version History</h2>
            <p className="text-sm text-brand-text-secondary">Here you can see all past versions of the public portal content. You can revert to any previous state if needed.</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {publicPortalContentHistory.map((version, index) => {
                    const editor = getTeamMember(version.editorId);
                    return (
                        <div key={version.timestamp} className="p-4 bg-brand-dark rounded-lg border border-brand-border flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-brand-text">
                                    Edited by <span className="text-brand-accent">{editor?.name || version.editorId}</span>
                                </p>
                                <p className="text-sm text-brand-text-secondary">
                                    {new Date(version.timestamp).toLocaleString()}
                                </p>
                            </div>
                            {index > 0 && !isMember && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to revert to this version? This will create a new version based on this historical one.")) {
                                            revertToVersion(index);
                                        }
                                    }}
                                    className="text-sm font-semibold bg-brand-surface hover:bg-brand-border text-brand-text px-3 py-1 rounded-md"
                                >
                                    Revert to this version
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
             {isMember && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-3 rounded-lg text-sm text-center mb-6">
                    You are viewing in read-only mode. Content can only be modified by Managers, Engineers, or Designers.
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text">Public Portal Editor</h1>
                    <p className="text-brand-text-secondary">Manage the content displayed on the public website.</p>
                </div>
                <div className="flex items-center gap-4">
                     {isDirty && view === 'editor' && !isMember && (
                        <div className="flex items-center gap-2">
                            <p className="text-yellow-400 text-sm font-semibold">You have unsaved changes.</p>
                             <button onClick={() => setEditableContent(publicPortalContent)} className="bg-brand-border text-brand-text font-bold py-2 px-4 rounded-lg hover:bg-brand-text-secondary">
                                Discard
                            </button>
                            <button onClick={handleSaveChanges} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 flex items-center gap-2">
                                <SaveIcon className="w-5 h-5" /> Save Changes
                            </button>
                        </div>
                    )}
                    <div className="flex items-center bg-brand-dark-secondary p-1 rounded-lg border border-brand-border">
                        <button onClick={() => setView('editor')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${view === 'editor' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-border'}`}><EditIcon className="w-4 h-4"/> Editor</button>
                        <button onClick={() => setView('history')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${view === 'history' ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-border'}`}><HistoryIcon className="w-4 h-4"/> History</button>
                    </div>
                </div>
            </div>

            {view === 'editor' ? (
                 <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/4">
                        <nav className="flex flex-col gap-2">
                             {sections.map(section => (
                                <button key={section.key} onClick={() => setActiveSection(section.key)} className={`p-3 rounded-lg text-left font-semibold transition-colors ${activeSection === section.key ? 'bg-brand-accent text-brand-dark' : 'text-brand-text-secondary hover:bg-brand-dark-secondary'}`}>
                                    {section.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="lg:w-3/4">
                        <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border min-h-[60vh]">
                            {renderEditor()}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-brand-dark-secondary p-6 rounded-xl shadow-md border border-brand-border">
                    {renderHistory()}
                </div>
            )}
        </div>
    );
};

export default PortalEditorPage;