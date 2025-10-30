


import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { useData, useAppState } from '../contexts/AppContext';
import { HomeIcon, UsersIcon, CarIcon, NewspaperIcon, MailIcon, TrophyIcon, MenuIcon, XIcon, ExternalLinkIcon, InfoIcon, FlagIcon } from '../components/icons';

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

const TeamPage: React.FC = () => {
    const { users, publicPortalContent } = useData();
    const { team: teamContent } = publicPortalContent;
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{teamContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">{teamContent.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {users.map(member => (
                    <div key={member.id} className="text-center bg-brand-dark-secondary p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-brand-border">
                        <img src={member.avatarUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-brand-border"/>
                        <h3 className="text-xl font-bold text-brand-text">{member.name}</h3>
                        <p className="text-brand-accent font-semibold">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OurCarPage: React.FC = () => {
    const { carHighlights, publicPortalContent } = useData();
    const { car: carContent } = publicPortalContent;
    const publicHighlights = carHighlights.filter(h => h.isPublic);
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{carContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">{carContent.subtitle}</p>
            <div className="space-y-16">
                {publicHighlights.map((highlight, index) => (
                    <div key={highlight.id} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="md:w-1/2">
                            <img src={highlight.imageUrl} alt={highlight.title} className="rounded-lg shadow-2xl w-full h-auto object-cover border-2 border-brand-border"/>
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold text-brand-text mb-3">{highlight.title}</h2>
                            <p className="text-brand-text-secondary leading-relaxed">{highlight.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CompetitionCountdown: React.FC = () => {
    const { competitionDate } = useAppState();
    const targetDate = useMemo(() => competitionDate ? new Date(competitionDate) : null, [competitionDate]);
    const [timeLeft, setTimeLeft] = useState(targetDate ? targetDate.getTime() - new Date().getTime() : 0);

    useEffect(() => {
        if (!targetDate) return;
        const timer = setInterval(() => {
            setTimeLeft(targetDate.getTime() - new Date().getTime());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!targetDate || isNaN(targetDate.getTime())) {
        return (
             <div className="text-center p-6 bg-brand-dark rounded-xl text-brand-text shadow-lg border border-brand-border">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Competition date is not yet announced.</h3>
                <p className="text-brand-text-secondary">Please check back for updates!</p>
            </div>
        )
    }

    const isPast = timeLeft < 0;
    const absTimeLeft = Math.abs(timeLeft);

    const days = Math.floor(absTimeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absTimeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((absTimeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((absTimeLeft / 1000) % 60);

    return (
        <div className="text-center p-8 bg-brand-dark-secondary rounded-xl text-brand-text shadow-lg border border-brand-border">
            <h3 className="text-2xl font-semibold text-brand-accent mb-4">{isPast ? "Competition Is Live!" : "Countdown to Competition"}</h3>
            <div className="flex justify-center space-x-4 md:space-x-8 text-4xl font-bold">
                <div>{days}<span className="block text-sm font-normal text-brand-text-secondary">Days</span></div>
                <div>{hours}<span className="block text-sm font-normal text-brand-text-secondary">Hours</span></div>
                <div>{minutes}<span className="block text-sm font-normal text-brand-text-secondary">Minutes</span></div>
                <div>{seconds}<span className="block text-sm font-normal text-brand-text-secondary">Seconds</span></div>
            </div>
        </div>
    );
};

const CompetitionPage: React.FC = () => {
    const { competitionProgress, publicPortalContent } = useData();
    const { competition: competitionContent } = publicPortalContent;
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
             <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{competitionContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">{competitionContent.subtitle}</p>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-brand-dark-secondary p-8 rounded-lg shadow-lg border border-brand-border space-y-6">
                    {competitionProgress.map((item, index) => (
                        <div key={item.category}>
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-md font-semibold text-brand-text">{item.category}</span>
                                <span className="text-md font-bold text-brand-text-secondary">{item.progress}%</span>
                            </div>
                            <div className="w-full bg-brand-dark rounded-full h-4 border border-brand-border">
                                <div className={`${colors[index % colors.length]} h-full rounded-full transition-all duration-500`} style={{ width: `${item.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <CompetitionCountdown />
            </div>
        </div>
    );
};

const SponsorsPage: React.FC = () => {
    const { sponsors, publicPortalContent } = useData();
    const { sponsors: sponsorsContent } = publicPortalContent;
    const securedSponsors = sponsors.filter(s => s.status === 'secured');
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{sponsorsContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">{sponsorsContent.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {securedSponsors.map(sponsor => (
                    <div key={sponsor.id} className="bg-brand-text/5 p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-xl transition-shadow border border-brand-border">
                        <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-16 w-auto object-contain" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const NewsPage: React.FC = () => {
    const { news, getTeamMember, publicPortalContent } = useData();
    const { news: newsContent } = publicPortalContent;
    const publicNews = news.filter(n => n.isPublic).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{newsContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">{newsContent.subtitle}</p>
            <div className="space-y-8 max-w-3xl mx-auto">
                {publicNews.map(post => {
                    const author = getTeamMember(post.authorId);
                    return (
                    <div key={post.id} className="bg-brand-dark-secondary p-8 rounded-lg shadow-md border border-brand-border">
                        <h2 className="text-2xl font-bold text-brand-text mb-2">{post.title}</h2>
                        <div className="text-sm text-brand-text-secondary mb-4">
                            By {author?.name || 'Blizzard Racing'} on {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <p className="text-brand-text-secondary leading-relaxed">{post.content}</p>
                    </div>
                )}
                )}
            </div>
        </div>
    );
};


const ContactPage: React.FC = () => {
    const { publicPortalContent } = useData();
    const { contact: contactContent } = publicPortalContent;
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">{contactContent.title}</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">{contactContent.subtitle}</p>
            <div className="max-w-xl mx-auto bg-brand-dark-secondary p-8 rounded-lg shadow-lg border border-brand-border">
                {submitted ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-400 mb-2">Thank You!</h2>
                        <p className="text-brand-text">Your message has been sent. We'll get back to you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
                            <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary">Email Address</label>
                            <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-brand-text-secondary">Message</label>
                            <textarea id="message" rows={4} required className="mt-1 block w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"></textarea>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-brand-dark bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent">
                                Send Message
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


// --- Public Portal Layout ---

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { teamLogoUrl } = useAppState();
    const navItems = [
        { name: 'Home', path: '/', icon: <HomeIcon className="w-5 h-5"/> },
        { name: 'About Us', path: '/about', icon: <InfoIcon className="w-5 h-5"/> },
        { name: 'The Team', path: '/team', icon: <UsersIcon className="w-5 h-5"/> },
        { name: 'Our Car', path: '/car', icon: <CarIcon className="w-5 h-5"/> },
        { name: 'Competition', path: '/competition', icon: <FlagIcon className="w-5 h-5"/> },
        { name: 'Sponsors', path: '/sponsors', icon: <TrophyIcon className="w-5 h-5"/> },
        { name: 'News', path: '/news', icon: <NewspaperIcon className="w-5 h-5"/> },
        { name: 'Contact', path: '/contact', icon: <MailIcon className="w-5 h-5"/> },
    ];
    
    const NavLinks = ({isMobile = false}: {isMobile?: boolean}) => (
        <>
            {navItems.map(item => (
                <NavLink 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setMenuOpen(false)}
                    end={item.path === '/'}
                    className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-brand-accent text-brand-dark' : 'text-brand-text hover:bg-brand-text/10'}`}
                >
                    {item.icon} {item.name}
                </NavLink>
            ))}
        </>
    );

    return (
        <div className="min-h-screen bg-brand-dark font-sans">
            <header className="bg-brand-dark-secondary/80 backdrop-blur-sm shadow-lg sticky top-0 z-30 border-b border-brand-border">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center text-brand-text text-xl font-bold">
                           <div className="bg-white p-1 rounded-md mr-2">
                                <img src={teamLogoUrl} alt="Blizzard Racing Logo" className="h-8 w-8 object-contain" />
                           </div>
                            Blizzard Racing
                        </Link>
                        <nav className="hidden md:flex items-center space-x-2">
                           <NavLinks />
                        </nav>
                        <div className="md:hidden">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="text-brand-text">
                                {menuOpen ? <XIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden bg-brand-dark-secondary/95 p-4 space-y-2">
                        <NavLinks isMobile={true}/>
                    </div>
                )}
            </header>
            <main>{children}</main>
            <footer className="bg-brand-dark-secondary text-brand-text-secondary py-12 border-t border-brand-border">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} Blizzard Racing. All Rights Reserved.</p>
                    <Link to="/login" className="text-sm text-brand-accent hover:underline mt-4 inline-flex items-center gap-1">
                        Team HQ Login <ExternalLinkIcon className="w-4 h-4"/>
                    </Link>
                </div>
            </footer>
        </div>
    );
};

// --- Public Portal Router ---

const PublicPortal: React.FC = () => {
    return (
        <PublicLayout>
            <Routes>
                <Route path="about" element={<AboutPage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="car" element={<OurCarPage />} />
                <Route path="competition" element={<CompetitionPage />} />
                <Route path="sponsors" element={<SponsorsPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route index element={<PublicHomePage />} />
            </Routes>
        </PublicLayout>
    );
};

export default PublicPortal;