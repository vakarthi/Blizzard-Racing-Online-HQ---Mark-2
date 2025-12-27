
import React, { useState, useEffect, useMemo, useRef, DragEvent } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { useData, useAppState } from '../contexts/AppContext';
import { HomeIcon, UsersIcon, CarIcon, NewspaperIcon, MailIcon, TrophyIcon, MenuIcon, XIcon, ExternalLinkIcon, InfoIcon, FlagIcon, SparklesIcon, UploadCloudIcon, WindIcon, StopwatchIcon, BeakerIcon, LightbulbIcon, FileTextIcon, CheckSquareIcon } from '../components/icons';
import FbxViewer from '../components/shared/FbxViewer';
import ErrorBoundary from '../components/ErrorBoundary';


// --- Components for Public Pages ---

const PublicHomePage: React.FC = () => {
    const { news } = useData();
    const { publicPortalContent } = useData();
    const { home: homeContent } = publicPortalContent;
    const latestNews = news.filter(n => n.isPublic).slice(0, 1)[0];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section 
                className="relative bg-cover bg-center h-[60vh] text-brand-text flex items-center justify-center text-center"
                style={{backgroundImage: `url('${homeContent.heroBackgroundImage}')`}}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-slide-in-up">{homeContent.heroTitle}</h1>
                    <p className="text-lg md:text-2xl mb-8 animate-slide-in-up [animation-delay:0.2s]">{homeContent.heroSubtitle}</p>
                    <Link to="/sponsors" className="bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-accent-hover transition-transform transform hover:scale-105 inline-block animate-slide-in-up [animation-delay:0.4s]">
                        {homeContent.heroCtaText}
                    </Link>
                </div>
            </section>

            {/* Latest News Section */}
            {latestNews && (
                <section className="py-16 bg-brand-dark-secondary">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="text-3xl font-bold text-center text-brand-text mb-2">Latest News</h2>
                        <div className="text-center mb-8 text-brand-text-secondary">From the Track and the Factory</div>
                        <div className="bg-brand-dark rounded-lg shadow-lg overflow-hidden border border-brand-border">
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-brand-text mb-3">{latestNews.title}</h3>
                                <p className="text-brand-text-secondary mb-6 line-clamp-3">{latestNews.content}</p>
                                <Link to="/news" className="font-semibold text-brand-accent hover:text-brand-accent-hover">
                                    Read More &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

const AboutPage: React.FC = () => {
    const { publicPortalContent } = useData();
    const { about: aboutContent } = publicPortalContent;
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{aboutContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-3xl mx-auto">{aboutContent.subtitle}</p>

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-brand-dark-secondary p-8 rounded-lg shadow-lg border border-brand-border">
                    <h2 className="text-2xl font-bold text-brand-accent mb-3">Our Mission</h2>
                    <p className="text-brand-text-secondary leading-relaxed">{aboutContent.mission}</p>
                </div>

                <div className="bg-brand-dark-secondary p-8 rounded-lg shadow-lg border border-brand-border">
                    <h2 className="text-2xl font-bold text-brand-accent mb-3">Our Journey</h2>
                    <p className="text-brand-text-secondary leading-relaxed">{aboutContent.history}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {aboutContent.stats.map(stat => (
                        <div key={stat.id} className="bg-brand-dark-secondary p-4 rounded-lg border border-brand-border">
                            <p className="text-3xl font-bold text-brand-text">{stat.value}</p>
                            <p className="text-sm text-brand-text-secondary">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Update Team Page to use Wanted Posters ONLY
const TeamPage: React.FC = () => {
    const { users } = useData();

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center mt-8">
                {users.map(member => (
                    <div key={member.id} className="relative w-72 h-[450px] bg-[#F3E5AB] text-[#3e2723] p-5 flex flex-col items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300 font-display rotate-1 hover:rotate-0 border-2 border-[#3e2723]/10">
                        <div className="absolute top-4 left-0 w-full text-center text-3xl font-black opacity-80 tracking-widest uppercase">
                            MEMBER
                        </div>
                        
                        <div className="mt-12 w-full h-56 bg-gray-300 border-4 border-[#3e2723] overflow-hidden relative shadow-inner">
                             <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover grayscale contrast-125 sepia-[.3]" />
                        </div>
                        
                        <h2 className="text-4xl font-black mt-5 uppercase tracking-tighter w-full text-center truncate px-2">{member.name.split(' ')[0]}</h2>
                        
                        <div className="w-full flex items-center justify-between px-4 mt-auto mb-3 font-mono font-bold text-xl border-t-4 border-b-4 border-[#3e2723] py-2 bg-[#3e2723]/5">
                            <span className="text-[10px] self-end mb-1 opacity-70 tracking-widest font-sans font-bold">VALUE</span>
                            <span className="tracking-tighter text-2xl">{(member.bounty || 0).toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] font-bold text-[#3e2723]/70 uppercase tracking-[0.3em] text-center w-full">{member.role}</p>
                        
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-60 pointer-events-none mix-blend-multiply"></div>
                        {/* Pin */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-md border border-black/30"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CarPage: React.FC = () => {
    const { carHighlights, publicPortalContent } = useData();
    const { car: carContent } = publicPortalContent;
    const publicHighlights = carHighlights.filter(h => h.isPublic);
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{carContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-3xl mx-auto">{carContent.subtitle}</p>
            
            <div className="mb-12">
                <FbxViewer fbxDataUrl={carContent.carModelFbx} isBlurred={carContent.isCarModelBlurred} />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {publicHighlights.map(highlight => (
                    <div key={highlight.id} className="bg-brand-dark-secondary rounded-lg shadow-lg overflow-hidden border border-brand-border md:flex">
                         <div className="md:w-1/2">
                            <img src={highlight.imageUrl} alt={highlight.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-8 md:w-1/2">
                            <h2 className="text-2xl font-bold text-brand-accent mb-3">{highlight.title}</h2>
                            <p className="text-brand-text-secondary">{highlight.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CompetitionPage: React.FC = () => {
    const { competitionProgress, publicPortalContent } = useData();
    const { competition: competitionContent } = publicPortalContent;
    const { competitionDate } = useAppState();

    const colors = useMemo(() => ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'], []);

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{competitionContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-3xl mx-auto">{competitionContent.subtitle}</p>
            
            {competitionDate && (
                <div className="text-center mb-12 p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-lg max-w-lg mx-auto">
                    <p className="font-bold text-brand-accent">Next Competition Date</p>
                    <p className="text-xl text-brand-text">{new Date(competitionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                </div>
            )}
            
            <div className="max-w-3xl mx-auto bg-brand-dark-secondary p-8 rounded-lg shadow-lg border border-brand-border space-y-6">
                {competitionProgress.map((item, index) => (
                    <div key={item.category}>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-semibold text-brand-text">{item.category}</span>
                            <span className="font-bold text-brand-text-secondary">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-brand-dark rounded-full h-4 border border-brand-border">
                            <div className={`${colors[index % colors.length]} h-full rounded-full transition-all duration-500`} style={{ width: `${item.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SponsorsPage: React.FC = () => {
    const { sponsors, publicPortalContent } = useData();
    const { sponsors: sponsorsContent } = publicPortalContent;

    const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze'];
    const groupedSponsors = useMemo(() => {
        const groups: { [key: string]: typeof sponsors } = {};
        tiers.forEach(tier => {
            groups[tier] = sponsors.filter(s => s.tier === tier && s.status === 'secured');
        });
        return groups;
    }, [sponsors]);

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{sponsorsContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-3xl mx-auto">{sponsorsContent.subtitle}</p>
            
            <div className="space-y-12">
                {tiers.map(tier => (
                    groupedSponsors[tier].length > 0 && (
                        <div key={tier}>
                            <h2 className="text-2xl font-bold text-brand-accent mb-6 text-center">{tier} Partners</h2>
                            <div className="flex flex-wrap justify-center items-center gap-8">
                                {groupedSponsors[tier].map(sponsor => (
                                    <div key={sponsor.id} className="bg-brand-dark-secondary p-6 rounded-lg shadow-md border border-brand-border">
                                        <img src={sponsor.logoUrl} alt={sponsor.name} className="h-16 w-48 object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
};


const NewsPage: React.FC = () => {
    const { news, getTeamMember, publicPortalContent } = useData();
    const { news: newsContent } = publicPortalContent;
    const publicNews = news.filter(n => n.isPublic).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{newsContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-3xl mx-auto">{newsContent.subtitle}</p>

            <div className="max-w-3xl mx-auto space-y-8">
                {publicNews.map(post => {
                    const author = getTeamMember(post.authorId);
                    return (
                        <div key={post.id} className="bg-brand-dark-secondary rounded-lg shadow-lg p-8 border border-brand-border">
                            <h2 className="text-2xl font-bold text-brand-text mb-2">{post.title}</h2>
                            <p className="text-sm text-brand-text-secondary mb-4">
                                By {author?.name || 'Blizzard Racing'} on {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-brand-text-secondary leading-relaxed whitespace-pre-line">{post.content}</p>
                        </div>
                    )
                })}
                 {publicNews.length === 0 && (
                    <div className="text-center text-brand-text-secondary p-12 bg-brand-dark-secondary rounded-lg border border-brand-border">
                        No public news articles have been posted yet. Check back soon!
                    </div>
                )}
            </div>
        </div>
    )
}

const AerotestPage: React.FC = () => {
    const { publicPortalContent, addInquiry } = useData();
    const { aerotest: aerotestContent } = publicPortalContent;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [message, setMessage] = useState('I\'m interested in learning more about the Aerotest simulation suite.');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addInquiry({ name, email, company, message });
        setFormSubmitted(true);
    };

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{aerotestContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-3xl mx-auto">{aerotestContent.subtitle}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                {/* Standard Tier */}
                <div className="bg-brand-dark-secondary p-8 rounded-xl shadow-lg border border-brand-border">
                    <h2 className="text-2xl font-bold text-brand-text mb-2">Standard: F1S Edition</h2>
                    <p className="text-brand-text-secondary mb-4">The perfect tool for competitive F1 in Schools teams.</p>
                    <ul className="space-y-2 text-brand-text-secondary">
                        <li className="flex items-center gap-2"><CheckSquareIcon className="w-5 h-5 text-brand-accent"/> High-fidelity CFD simulation</li>
                        <li className="flex items-center gap-2"><CheckSquareIcon className="w-5 h-5 text-brand-accent"/> 5,000-race probabilistic analysis</li>
                        <li className="flex items-center gap-2"><CheckSquareIcon className="w-5 h-5 text-brand-accent"/> Automated scrutineering checks</li>
                        <li className="flex items-center gap-2"><CheckSquareIcon className="w-5 h-5 text-brand-accent"/> Actionable aerodynamic suggestions</li>
                    </ul>
                </div>
                {/* Premium Tier */}
                <div className="bg-brand-dark-secondary p-8 rounded-xl shadow-lg border-2 border-brand-accent">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold text-brand-accent">Premium: Pro-Grade Solver</h2>
                        <span className="text-xs font-bold bg-brand-accent text-brand-dark px-2 py-1 rounded-full">RECOMMENDED</span>
                    </div>
                    <p className="text-brand-text-secondary mb-4">F1-team level analysis for ultimate performance.</p>
                     <ul className="space-y-2 text-brand-text-secondary">
                        <li className="flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-brand-accent"/> All Standard features, plus:</li>
                        <li className="flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-brand-accent"/> Advanced RANS solver</li>
                        <li className="flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-brand-accent"/> 100,000-race high-fidelity analysis</li>
                        <li className="flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-brand-accent"/> Deeper performance metrics</li>
                        <li className="flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-brand-accent"/> Variable thrust & condition models</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-2xl mx-auto bg-brand-dark-secondary p-8 rounded-xl shadow-lg border border-brand-border">
                 <h3 className="text-xl font-bold text-brand-accent mb-2 text-center">Request a Consultation</h3>
                <p className="text-sm text-brand-text-secondary mb-4 text-center">Contact us for pricing and to learn how Aerotest can give your team the winning edge.</p>
                {formSubmitted ? (
                    <div className="text-center py-8">
                        <h3 className="text-xl font-bold text-green-400">Thank you!</h3>
                        <p className="text-brand-text-secondary mt-2">Your inquiry has been submitted. We will be in touch shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                        </div>
                        <input type="text" placeholder="Team / Company (Optional)" value={company} onChange={e => setCompany(e.target.value)} className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} required className="w-full p-2 bg-brand-dark border border-brand-border rounded-lg" />
                        <button type="submit" className="w-full bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors">Submit Inquiry</button>
                    </form>
                )}
            </div>
        </div>
    );
};

const ContactPage: React.FC = () => {
    const { publicPortalContent } = useData();
    const { contact: contactContent } = publicPortalContent;

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{contactContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-3xl mx-auto">{contactContent.subtitle}</p>

            <div className="max-w-lg mx-auto bg-brand-dark-secondary p-8 rounded-lg shadow-lg border border-brand-border">
                <p className="text-brand-text-secondary">
                    For all inquiries, including sponsorships and media requests, please reach out to our team manager.
                </p>
                <div className="mt-4">
                    <a href="mailto:shrivatsakarth.kart@saintolaves.net" className="font-bold text-brand-accent text-lg hover:underline">
                        shrivatsakarth.kart@saintolaves.net
                    </a>
                </div>
                <p className="text-sm text-brand-text-secondary mt-6">
                    We are based at St. Olave's Grammar School, Orpington.
                </p>
            </div>
        </div>
    )
}

// --- Main Layout ---

const PublicPortal: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { teamLogoUrl } = useAppState();

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon className="w-5 h-5"/> },
    { name: 'About', path: '/about', icon: <InfoIcon className="w-5 h-5"/> },
    { name: 'The Team', path: '/team', icon: <UsersIcon className="w-5 h-5"/> },
    { name: 'The Car', path: '/car', icon: <CarIcon className="w-5 h-5"/> },
    { name: 'Competition', path: '/competition', icon: <TrophyIcon className="w-5 h-5"/> },
    { name: 'Sponsors', path: '/sponsors', icon: <SparklesIcon className="w-5 h-5"/> },
    { name: 'News', path: '/news', icon: <NewspaperIcon className="w-5 h-5"/> },
    { name: 'Aerotest', path: '/aerotest', icon: <WindIcon className="w-5 h-5"/> },
    { name: 'Contact', path: '/contact', icon: <MailIcon className="w-5 h-5"/> },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text">
      {/* Header */}
      <header className="sticky top-0 bg-brand-dark-secondary/80 backdrop-blur-md z-30 border-b border-brand-border">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
             <div className="bg-white p-1 rounded-md border border-brand-border">
                <img src={teamLogoUrl} alt="Blizzard Racing Logo" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-xl font-bold text-brand-text hidden sm:block">Blizzard Racing</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map(item => (
                <NavLink key={item.name} to={item.path} end={item.path === '/'} className={({isActive}) => `px-3 py-2 rounded-md text-sm font-semibold transition-colors ${isActive ? 'text-brand-accent bg-brand-accent/10' : 'text-brand-text-secondary hover:bg-brand-border hover:text-brand-text'}`}>{item.name}</NavLink>
            ))}
            <a href="#/login" className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-full text-sm hover:bg-brand-accent-hover transition-transform transform hover:scale-105 inline-block ml-4">
              Team HQ
            </a>
          </nav>

          {/* Mobile Nav Button */}
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-brand-dark-secondary z-20 pt-20 lg:hidden animate-fade-in">
          <nav className="container mx-auto px-6 flex flex-col items-center space-y-4">
            {navItems.map(item => (
              <NavLink key={item.name} to={item.path} end={item.path==='/'} onClick={() => setMenuOpen(false)} className={({isActive}) => `w-full text-center flex items-center justify-center gap-3 py-3 text-lg font-semibold rounded-lg ${isActive ? 'text-brand-accent bg-brand-accent/10' : 'text-brand-text-secondary'}`}>
                {item.icon} {item.name}
              </NavLink>
            ))}
             <a href="#/login" className="w-full text-center bg-brand-accent text-brand-dark font-bold py-3 rounded-full text-lg mt-4">
              Team HQ
            </a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<PublicHomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/car" element={<CarPage />} />
          <Route path="/competition" element={<CompetitionPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/aerotest" element={<AerotestPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<div className="text-center py-20">404 - Page Not Found</div>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark-secondary border-t border-brand-border">
        <div className="container mx-auto px-6 py-8 text-center text-brand-text-secondary">
          <p>&copy; {new Date().getFullYear()} Blizzard Racing. All Rights Reserved.</p>
          <p className="text-sm mt-2">F1 in Schools STEM Challenge Team from St. Olave's Grammar School</p>
           <div className="mt-4">
                <a href="#/login" className="text-sm text-brand-accent hover:underline">Team HQ Portal</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortal;
