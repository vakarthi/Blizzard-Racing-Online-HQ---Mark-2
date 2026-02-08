
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { useData, useAppState } from '../contexts/AppContext';
import { HomeIcon, UsersIcon, CarIcon, NewspaperIcon, MailIcon, TrophyIcon, MenuIcon, XIcon, InfoIcon, SparklesIcon, WindIcon, CheckSquareIcon } from '../components/icons';
import FbxViewer from '../components/shared/FbxViewer';

// --- Custom Components ---

const BlizzardLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
    const { teamLogoUrl } = useAppState();
    return (
        <div className={`${className} relative`}>
            <img 
                src={teamLogoUrl} 
                alt="Blizzard Racing Eagle" 
                className="w-full h-full object-contain drop-shadow-md rounded-full bg-brand-dark border-2 border-brand-accent/20 p-1"
            />
        </div>
    );
};

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-4 uppercase tracking-tight">{title}</h2>
        {subtitle && <div className="w-24 h-1 bg-brand-accent mx-auto rounded-full mb-6"></div>}
        {subtitle && <p className="text-brand-text-secondary text-lg max-w-2xl mx-auto font-light">{subtitle}</p>}
    </div>
);

// --- Pages ---

const PublicHomePage: React.FC = () => {
    const { publicPortalContent } = useData();
    const { home } = publicPortalContent;

    return (
        <div className="animate-fade-in font-sans">
            {/* Hero Section */}
            <section 
                className="relative h-[85vh] flex items-center justify-center text-center overflow-hidden"
            >
                <div className="absolute inset-0 bg-[#020617]">
                    {/* Abstract Blue/Purple/Gold Gradient Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#1e1b4b_0%,_#020617_50%)]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#020617] to-transparent"></div>
                </div>
                
                <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
                    <div className="mb-8 animate-slide-in-up">
                        <BlizzardLogo className="w-32 h-32 md:w-48 md:h-48 border-4 border-white/10 rounded-full bg-white/5 p-4 backdrop-blur-sm" />
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-brand-text-secondary mb-6 tracking-tighter uppercase drop-shadow-2xl animate-slide-in-up [animation-delay:0.1s]">
                        Blizzard<br/><span className="text-brand-accent">Racing</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-brand-text-secondary mb-10 max-w-2xl font-light tracking-wide animate-slide-in-up [animation-delay:0.2s] italic">
                        "{home.heroSubtitle}"
                    </p>
                    <div className="flex gap-4 animate-slide-in-up [animation-delay:0.3s]">
                        <Link to="/about" className="bg-brand-accent hover:bg-white text-brand-dark font-bold py-4 px-10 rounded-full text-lg transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
                            Our Mission
                        </Link>
                        <Link to="/sponsors" className="bg-transparent border border-brand-text-secondary text-brand-text hover:bg-white/5 font-bold py-4 px-10 rounded-full text-lg transition-all">
                            Partner With Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const AboutPage: React.FC = () => {
    const { publicPortalContent } = useData();
    const { about } = publicPortalContent;

    return (
        <div className="bg-brand-dark min-h-screen py-20">
            <div className="container mx-auto px-6">
                <SectionTitle title={about.title} subtitle={about.subtitle} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
                    <div className="space-y-6 text-brand-text-secondary text-lg leading-relaxed">
                        <h3 className="text-2xl font-bold text-brand-text mb-4 border-l-4 border-brand-accent pl-4">Driven to Inspire</h3>
                        <p>{about.mission}</p>
                        <p className="text-base">{about.history}</p>
                    </div>
                    <div className="bg-brand-dark-secondary p-8 rounded-2xl border border-brand-border shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl group-hover:bg-brand-accent/10 transition-colors"></div>
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            {about.stats.map(stat => (
                                <div key={stat.id} className="text-center p-4 border border-brand-border rounded-xl bg-brand-dark/50">
                                    <div className="text-4xl font-black text-brand-accent mb-1">{stat.value}</div>
                                    <div className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TeamPage: React.FC = () => {
    const { users } = useData();

    // Map specific real bios to users based on ID/Name matching logic from mockData
    const bios: Record<string, string> = {
        'user-1': "I am a passionate young enthusiast of science and art, which has greatly influenced our car designs. I formed our team early on. Despite initial challenges, our dedication led to success.",
        'user-2': "Hello, I'm Anish. My ambitious career aspiration is to become an aeronautical engineer. I joined this journey in the early days of year 8 when I came across F1 in Schools.",
        'user-3': "Hello!!! My name is Hadi from St. Olave's. I enjoy sports and subjects including German, Maths, Physics. I schedule meetings and ensure we stay on top of the competition.",
        // Pranav (user-6) removed
        'user-5': "Hi, my name is Aarav. My contribution has been the portfolio and design ideas. I have a particular interest in DT, Engineering and cars.",
        'user-4': "I am Saint Olavian, passionate about cricket, rugby, and football. My friends Anish and Shrivatsa saw my potential and invited me to this group."
    };

    return (
        <div className="bg-brand-dark min-h-screen py-20">
            <div className="container mx-auto px-6">
                <SectionTitle title="Meet The Team" subtitle="The minds behind the machine." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {users.map(member => (
                        <div key={member.id} className="bg-brand-dark-secondary rounded-xl overflow-hidden border border-brand-border shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-300 group flex flex-col h-full">
                            <div className="h-2 bg-brand-accent w-full"></div>
                            {/* Updated Image Layout for Full Portraits */}
                            <div className="w-full h-96 relative bg-brand-dark overflow-hidden">
                                <img 
                                    src={member.avatarUrl} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-secondary via-transparent to-transparent opacity-90"></div>
                                <div className="absolute bottom-4 left-6">
                                    <h3 className="text-3xl font-black text-white mb-1 uppercase tracking-tight drop-shadow-md">{member.name}</h3>
                                    <p className="text-xs font-bold text-brand-accent uppercase tracking-widest">{member.role}</p>
                                </div>
                            </div>
                            
                            <div className="p-8 pt-4 flex flex-col flex-grow">
                                <div className="text-sm text-brand-text-secondary leading-relaxed italic border-l-2 border-brand-border pl-4">
                                    "{bios[member.id] || "Dedicated team member contributing to the success of Blizzard Racing through hard work and innovation."}"
                                </div>
                            </div>
                            <div className="bg-black/20 p-4 border-t border-brand-border mt-auto">
                                <div className="flex justify-between items-center text-xs text-brand-text-secondary font-mono">
                                    <span>STATUS: ACTIVE</span>
                                    <span>ID: {member.id.split('-')[1]}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const CarPage: React.FC = () => {
    const { publicPortalContent } = useData();
    const { car } = publicPortalContent;
    
    return (
        <div className="bg-brand-dark min-h-screen py-20">
            <div className="container mx-auto px-6">
                <SectionTitle title={car.title} subtitle={car.subtitle} />
                
                <div className="max-w-5xl mx-auto mb-16">
                    <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-2xl bg-brand-dark-secondary">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] pointer-events-none z-10"></div>
                        <FbxViewer fbxDataUrl={car.carModelFbx} isBlurred={car.isCarModelBlurred} />
                        {car.isCarModelBlurred && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-md">
                                <div className="text-center">
                                    <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">Confidential</h3>
                                    <p className="text-brand-accent font-mono">Design Reveal Pending</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const CompetitionPage: React.FC = () => {
    const { competitionProgress, publicPortalContent } = useData();
    const { competition } = publicPortalContent;
    const { competitionDate } = useAppState();

    return (
        <div className="bg-brand-dark min-h-screen py-20">
            <div className="container mx-auto px-6">
                <SectionTitle title={competition.title} subtitle={competition.subtitle} />
                
                <div className="max-w-4xl mx-auto">
                    {competitionDate && (
                        <div className="mb-12 p-8 bg-gradient-to-r from-brand-accent/20 to-transparent border-l-4 border-brand-accent rounded-r-xl">
                            <p className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-1">Next Event</p>
                            <p className="text-3xl font-bold text-white">
                                {new Date(competitionDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    )}

                    <div className="space-y-8">
                        {competitionProgress.map((item) => (
                            <div key={item.category} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <h4 className="text-lg font-bold text-brand-text group-hover:text-brand-accent transition-colors">{item.category}</h4>
                                    <span className="font-mono text-brand-text-secondary">{item.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-brand-dark-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-brand-accent transition-all duration-1000 ease-out relative" 
                                        style={{ width: `${item.progress}%` }}
                                    >
                                        <div className="absolute right-0 top-0 h-full w-20 bg-white/20 skew-x-12"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SponsorsPage: React.FC = () => {
    const { sponsors } = useData();
    const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze'];

    return (
        <div className="bg-brand-dark min-h-screen py-20">
            <div className="container mx-auto px-6">
                <SectionTitle title="Our Partners" subtitle="Fueling our journey to the podium." />
                
                <div className="max-w-5xl mx-auto space-y-16">
                    {tiers.map(tier => {
                        const tierSponsors = sponsors.filter(s => s.tier === tier && s.status === 'secured');
                        if (tierSponsors.length === 0) return null;

                        return (
                            <div key={tier} className="text-center">
                                <h3 className="text-2xl font-bold text-brand-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center justify-center gap-4">
                                    <span className="h-px w-12 bg-brand-border"></span>
                                    {tier}
                                    <span className="h-px w-12 bg-brand-border"></span>
                                </h3>
                                <div className="flex flex-wrap justify-center gap-8">
                                    {tierSponsors.map(sponsor => (
                                        <div key={sponsor.id} className="bg-white p-6 rounded-xl shadow-lg w-64 h-32 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 transform hover:-translate-y-1">
                                            <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
};

// --- Main Layout ---

const PublicPortal: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { teamLogoUrl } = useAppState();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Car', path: '/car' },
    { name: 'Competition', path: '/competition' },
    { name: 'Sponsors', path: '/sponsors' },
  ];

  return (
    // Added 'h-screen overflow-y-auto' to enable scrolling within the portal since body is hidden
    <div className="h-screen overflow-y-auto bg-brand-dark text-brand-text font-sans selection:bg-brand-accent selection:text-brand-dark scroll-smooth">
      {/* Navbar */}
      <header className="fixed w-full top-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-brand-border">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
             <div className="bg-white/10 p-1.5 rounded-lg border border-white/10 group-hover:border-brand-accent/50 transition-colors">
                <img src={teamLogoUrl} alt="Logo" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase group-hover:text-brand-accent transition-colors">Blizzard</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
                <NavLink 
                    key={item.name} 
                    to={item.path} 
                    end={item.path === '/'}
                    className={({isActive}) => `text-sm font-bold uppercase tracking-wider hover:text-brand-accent transition-colors ${isActive ? 'text-brand-accent' : 'text-brand-text-secondary'}`}
                >
                    {item.name}
                </NavLink>
            ))}
            <a href="#/login" className="bg-white text-brand-dark font-bold py-2 px-6 rounded-full text-xs uppercase tracking-wider hover:bg-brand-accent hover:text-white transition-all">
              Team HQ
            </a>
          </nav>

          {/* Mobile Nav Button */}
          <button className="lg:hidden text-brand-text" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-[#020617] z-40 pt-24 px-6 animate-fade-in lg:hidden">
          <nav className="flex flex-col gap-6 text-center">
            {navItems.map(item => (
              <NavLink 
                key={item.name} 
                to={item.path} 
                end={item.path === '/'} 
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-bold text-white uppercase tracking-tight py-2 border-b border-white/10"
              >
                {item.name}
              </NavLink>
            ))}
             <a href="#/login" className="mt-8 bg-brand-accent text-brand-dark font-bold py-4 rounded-xl text-lg uppercase tracking-wider">
              Team Login
            </a>
          </nav>
        </div>
      )}

      {/* Main Content Content */}
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<PublicHomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/car" element={<CarPage />} />
          <Route path="/competition" element={<CompetitionPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="*" element={<div className="text-center py-40 text-brand-text-secondary">Page Not Found</div>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-[#01040f] border-t border-brand-border py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
              <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">Blizzard Racing</h4>
              <p className="text-sm text-brand-text-secondary">St. Olave's Grammar School, Orpington</p>
          </div>
          <div className="text-brand-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Blizzard Racing. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortal;
