
import { DataContextType } from '../contexts/AppContext';
import { TaskStatus, SponsorTier } from '../types';

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// --- Knowledge Base ---
const KNOWLEDGE_BASE: Record<string, string> = {
    'aerodynamics': 'Aerodynamics is the study of moving air. In Egghead terms, it is manipulating the unseen fluids to generate the lift of the future!',
    'downforce': 'Downforce is the invisible hand that presses the car to the track. Essential for cornering speeds that defy logic.',
    'drag': 'Drag is the enemy of speed. It is the resistance of the air. We must eliminate it with efficient shaping, like the Sea Beasts of the Calm Belt.',
    'cfd': 'Computational Fluid Dynamics. Simulating the winds of the Grand Line inside a computer chip. Our Aerotest module uses a Voxel FVM solver.',
    'boundary layer': 'The thin layer of air clinging to the surface. Control it, and you control the flow.',
    'one piece': 'The One Piece? That is the ultimate data we seek at the end of the simulation. Wealth, Fame, Power... or perhaps just the perfect Drag Coefficient.',
    'egghead': 'The island of the future. The codename for our Mark 3 Aerotest engine. It symbolizes intelligence far ahead of its time.',
    'vegapunk': 'The world\'s smartest scientist. Our AI strives to emulate his (or their) genius. Beware of York-like bugs.',
    'mother flame': 'An infinite energy source... or perhaps just a very efficient battery setup for our F1 car.',
    'void century': 'The 100-year gap in history. Just like the data we lost when the server crashed last month. Do not speak of it.',
};

// --- Responder Interface and List ---
interface Responder {
    regex: RegExp;
    handler: (match: RegExpMatchArray, data: DataContextType, isEggheadMode: boolean) => string;
}

const RESPONDERS: Responder[] = [
    // --- Conversational ---
    {
        regex: /^(hello|hi|hey|greetings)/i,
        handler: (_, __, isEggheadMode) => {
            if (isEggheadMode) {
                return "Puru puru puru... Connection established. This is Satellite Punk-01 Shaka. What logic do you require?";
            }
            const greetings = ["Hello! How can I assist with the Blizzard Racing data today?", "Hi there! What can I help you analyze?", "Greetings! Icicle at your service."];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
    },
    {
        regex: /^(thanks|thank you)/i,
        handler: (_, __, isEggheadMode) => isEggheadMode ? "Logic dictates gratitude is inefficient, but acknowledged." : "You're welcome! Is there anything else I can help you with?"
    },

    // --- Knowledge Base ---
    {
        regex: /(what is|what's|define|explain|who is) (aerodynamics|downforce|chassis|drag|lift|cfd|boundary layer|one piece|egghead|vegapunk|mother flame|void century)/i,
        handler: (match) => {
            const term = match[2].toLowerCase();
            return KNOWLEDGE_BASE[term] || `I don't have a definition for "${term}" in the Punk Records archives.`;
        }
    },

    // --- Protocol Responder ---
    {
        regex: /(?:protocol for|run protocol|what is the procedure for|show protocol) (.*)/i,
        handler: (match, data, isEggheadMode) => {
            const protocolKeyword = match[1].trim().toLowerCase();
            const protocol = data.protocols.find(p => p.title.toLowerCase().includes(protocolKeyword));

            if (protocol) {
                const steps = protocol.steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
                return isEggheadMode 
                    ? `Accessing Punk Records... Protocol "${protocol.title}" found. Executing logic sequence:\n\n${steps}`
                    : `Certainly. Here is the protocol for "${protocol.title}":\n\n**${protocol.description}**\n\n${steps}`;
            }

            return `I could not find a protocol related to "${protocolKeyword}".`;
        }
    },

    // --- Data Analysis ---
    {
        regex: /best (aero|design|car)/i,
        handler: (_, data, isEggheadMode) => {
            if (!data.aeroResults || data.aeroResults.length === 0) {
                return "The void is empty. Run simulations to fill the Poneglyphs.";
            }
            
            const bestResult = data.aeroResults.reduce((best, current) => 
                current.liftToDragRatio > best.liftToDragRatio ? current : best
            );

            return isEggheadMode
                ? `Analyzing Punk Records... The "Stella" design is "${bestResult.parameters.carName}". Efficiency L/D: ${bestResult.liftToDragRatio}. A marvel of science!`
                : `The best performing design is "${bestResult.parameters.carName}". It has a lift-to-drag ratio of ${bestResult.liftToDragRatio}.`;
        }
    },
    {
        regex: /(most active member|who posts the most)/i,
        handler: (_, data, isEggheadMode) => {
            const postCounts: Record<string, number> = {};
            data.discussionThreads.forEach(thread => {
                thread.posts.forEach(post => {
                    postCounts[post.authorId] = (postCounts[post.authorId] || 0) + 1;
                });
            });
            
            if (Object.keys(postCounts).length === 0) return "No communications detected.";

            const mostActiveAuthorId = Object.keys(postCounts).reduce((a, b) => postCounts[a] > postCounts[b] ? a : b);
            const mostActiveMember = data.getTeamMember(mostActiveAuthorId);

            if (!mostActiveMember) return "Identity unknown.";
            
            return isEggheadMode
                ? `The most vocal Satellite is ${mostActiveMember.name} with ${postCounts[mostActiveAuthorId]} transmissions.`
                : `The most active member is ${mostActiveMember.name} with ${postCounts[mostActiveAuthorId]} posts.`;
        }
    },
];

export const queryLocalAI = (query: string, data: DataContextType, isEggheadMode: boolean = false): string => {
    const q = query.toLowerCase().trim().replace(/[?.,!]/g, '');

    for (const responder of RESPONDERS) {
        const match = q.match(responder.regex);
        if (match) {
            return responder.handler(match, data, isEggheadMode);
        }
    }

    // --- Fallback Response ---
    if (isEggheadMode) {
        return "Puru puru... My logic banks do not compute this query. Try asking about 'Aerodynamics', 'Best Car', or check the 'Protocols'.";
    }
    return "I'm sorry, I can't answer that. You can ask me about protocols, define terms, or ask about team data.";
};
