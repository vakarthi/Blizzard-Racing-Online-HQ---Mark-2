
import React, { useState } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import { useData } from '../contexts/AppContext';
import { HomeIcon, UsersIcon, CarIcon, NewspaperIcon, MailIcon, TrophyIcon, MenuIcon, XIcon, ExternalLinkIcon } from '../components/icons';

// --- Components for Public Pages ---

const PublicHomePage: React.FC = () => {
    const { news } = useData();
    const latestNews = news.filter(n => n.isPublic).slice(0, 1)[0];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section 
                className="relative bg-cover bg-center h-[60vh] text-brand-text flex items-center justify-center text-center"
                style={{backgroundImage: "url('https://picsum.photos/seed/racecar/1600/900')"}}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-slide-in-up">BLIZZARD RACING</h1>
                    <p className="text-lg md:text-2xl mb-8 animate-slide-in-up [animation-delay:0.2s]">Welcome to the Official Hub of Blizzard Racing</p>
                    <Link to="/public/sponsors" className="bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-full text-lg hover:bg-brand-accent-hover transition-transform transform hover:scale-105 inline-block animate-slide-in-up [animation-delay:0.4s]">
                        Become a Partner
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
                                <Link to="/public/news" className="font-semibold text-brand-accent hover:text-brand-accent-hover">
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

const TeamPage: React.FC = () => {
    const { users } = useData();
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">Meet The Team</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">The dedicated individuals driving Blizzard Racing forward. A blend of experience, innovation, and passion for motorsport.</p>
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
    const { carHighlights } = useData();
    const publicHighlights = carHighlights.filter(h => h.isPublic);
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">The BR-02 Challenger</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">A culmination of cutting-edge technology and relentless innovation. Explore the key features of our latest car.</p>
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

const SponsorsPage: React.FC = () => {
    const { sponsors } = useData();
    const securedSponsors = sponsors.filter(s => s.status === 'secured');
    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">Our Partners</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">We are proud to be supported by industry leaders who share our vision for excellence and innovation. Their partnership is crucial to our success.</p>
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
    const { news, getTeamMember } = useData();
    const publicNews = news.filter(n => n.isPublic).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">News Feed</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">The latest updates, announcements, and stories from inside Blizzard Racing.</p>
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
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="container mx-auto px-6 py-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-brand-text mb-4">Contact Us</h1>
            <p className="text-center text-brand-text-secondary mb-12 max-w-2xl mx-auto">Have a question or a partnership inquiry? We'd love to hear from you.</p>
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
    const navItems = [
        { name: 'Home', path: '/public', icon: <HomeIcon className="w-5 h-5"/> },
        { name: 'The Team', path: '/public/team', icon: <UsersIcon className="w-5 h-5"/> },
        { name: 'Our Car', path: '/public/car', icon: <CarIcon className="w-5 h-5"/> },
        { name: 'Sponsors', path: '/public/sponsors', icon: <TrophyIcon className="w-5 h-5"/> },
        { name: 'News', path: '/public/news', icon: <NewspaperIcon className="w-5 h-5"/> },
        { name: 'Contact', path: '/public/contact', icon: <MailIcon className="w-5 h-5"/> },
    ];
    
    const NavLinks = ({isMobile = false}: {isMobile?: boolean}) => (
        <>
            {navItems.map(item => (
                <NavLink 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setMenuOpen(false)}
                    end={item.path === '/public'}
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
                        <Link to="/public" className="flex items-center text-brand-text text-xl font-bold">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
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
                    <Link to="/" className="text-sm text-brand-accent hover:underline mt-4 inline-flex items-center gap-1">
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
                <Route path="team" element={<TeamPage />} />
                <Route path="car" element={<OurCarPage />} />
                <Route path="sponsors" element={<SponsorsPage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route index element={<PublicHomePage />} />
            </Routes>
        </PublicLayout>
    );
};

export default PublicPortal;