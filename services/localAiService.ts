
import { DataContextType } from '../contexts/AppContext';
import { TaskStatus, SponsorTier } from '../types';

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// --- Knowledge Base ---
const KNOWLEDGE_BASE: Record<string, string> = {
    'aerodynamics': 'Aerodynamics is the study of the properties of moving air and the interaction between the air and solid bodies moving through it. For us, it\'s about shaping the car to cut through the air with minimal drag while creating downforce.',
    'downforce': 'Downforce is a downwards lift force created by the aerodynamic features of the car. It allows a car to travel faster through a corner by increasing the vertical force on the tires, thus creating more grip.',
    'chassis': 'The chassis is the base frame of a vehicle. In our F1 in Schools car, it\'s the main body to which all other parts, like wheels and wings, are attached.',
    'drag': 'Drag, or air resistance, is the aerodynamic force that opposes the car\'s motion through the air. Our goal is to minimize drag to achieve the highest possible speed on the straight.',
    'lift': 'Lift is the aerodynamic force perpendicular to the direction of motion. While airplanes use it to fly, we invert it to create "downforce" that presses our car onto the track.',
    'cfd': 'CFD stands for Computational Fluid Dynamics. It\'s a tool we use to simulate airflow over our car designs on a computer, allowing us to test and refine aerodynamic performance without building a physical model.'
};

// --- Responder Interface and List ---
interface Responder {
    regex: RegExp;
    handler: (match: RegExpMatchArray, data: DataContextType) => string;
}

const RESPONDERS: Responder[] = [
    // --- Conversational ---
    {
        regex: /^(hello|hi|hey|greetings)/i,
        handler: () => {
            const greetings = ["Hello! How can I assist with the Blizzard Racing data today?", "Hi there! What can I help you analyze?", "Greetings! Icicle at your service."];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
    },
    {
        regex: /^(thanks|thank you)/i,
        handler: () => "You're welcome! Is there anything else I can help you with?"
    },

    // --- Knowledge Base ---
    {
        regex: /(what is|what's|define) (aerodynamics|downforce|chassis|drag|lift|cfd)/i,
        handler: (match) => {
            const term = match[2].toLowerCase();
            return KNOWLEDGE_BASE[term] || `I don't have a definition for "${term}" right now.`;
        }
    },

    // --- Protocol Responder ---
    {
        regex: /(?:protocol for|run protocol|what is the procedure for|show protocol) (.*)/i,
        handler: (match, data) => {
            const protocolKeyword = match[1].trim().toLowerCase();
            const protocol = data.protocols.find(p => p.title.toLowerCase().includes(protocolKeyword));

            if (protocol) {
                const steps = protocol.steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
                return `Certainly. Here is the protocol for "${protocol.title}":\n\n**${protocol.description}**\n\n${steps}`;
            }

            return `I could not find a protocol related to "${protocolKeyword}". You can ask a manager to create one in the Manager Command Center.`;
        }
    },

    // --- Data Analysis ---
    {
        regex: /best (aero|design|car)/i,
        // Fix: The 'isBest' property does not exist on AeroResult. The best result is determined by the highest lift-to-drag ratio.
        handler: (_, data) => {
            if (!data.aeroResults || data.aeroResults.length === 0) {
                return "There are no simulation results marked as 'best' yet. Run some simulations to find the optimal design!";
            }
            
            const bestResult = data.aeroResults.reduce((best, current) => 
                current.liftToDragRatio > best.liftToDragRatio ? current : best
            );

            return `The best performing design is "${bestResult.parameters.carName}". It has a lift-to-drag ratio of ${bestResult.liftToDragRatio}, a drag coefficient (Cd) of ${bestResult.cd}, and a lift coefficient (Cl) of ${bestResult.cl}.`;
        }
    },
    {
        regex: /(most active member|who posts the most)/i,
        handler: (_, data) => {
            if (data.discussionThreads.length === 0) {
                return "There are no discussion posts to analyze yet.";
            }
            const postCounts: Record<string, number> = {};
            data.discussionThreads.forEach(thread => {
                thread.posts.forEach(post => {
                    postCounts[post.authorId] = (postCounts[post.authorId] || 0) + 1;
                });
            });
            
            if (Object.keys(postCounts).length === 0) {
                return "There are posts, but I couldn't determine the most active member.";
            }

            const mostActiveAuthorId = Object.keys(postCounts).reduce((a, b) => postCounts[a] > postCounts[b] ? a : b);
            const mostActiveMember = data.getTeamMember(mostActiveAuthorId);

            if (!mostActiveMember) {
                return "I couldn't determine the most active member from the discussion data.";
            }
            return `The most active member in the discussions is ${mostActiveMember.name}, with a total of ${postCounts[mostActiveAuthorId]} posts.`;
        }
    },
    {
        regex: /(most valuable|top|platinum) sponsor/i,
        handler: (_, data) => {
            const platinumSponsors = data.sponsors.filter(s => s.tier === SponsorTier.Platinum && s.status === 'secured');
            if (platinumSponsors.length > 0) {
                return `Our top partner is our Platinum sponsor: ${platinumSponsors.map(s => s.name).join(', ')}.`;
            }
            const goldSponsors = data.sponsors.filter(s => s.tier === SponsorTier.Gold && s.status === 'secured');
            if (goldSponsors.length > 0) {
                return `Our most valuable secured sponsors are our Gold tier partners: ${goldSponsors.map(s => s.name).join(', ')}.`;
            }
            return "We value all our sponsors equally! You can see a full list in the sponsors section.";
        }
    },
    {
        regex: /how many tasks are (in progress|in review|to do|done|completed)/i,
        handler: (match, data) => {
            const statusStr = match[1].toLowerCase();
            let status: TaskStatus;
            switch(statusStr) {
                case 'in progress': status = TaskStatus.InProgress; break;
                case 'in review': status = TaskStatus.InReview; break;
                case 'to do': status = TaskStatus.ToDo; break;
                case 'done':
                case 'completed': status = TaskStatus.Done; break;
                default: return "I don't recognize that task status.";
            }
            const tasks = data.tasks.filter(t => t.status === status);
            const taskList = tasks.map(t => `- "${t.title}"`).join('\n');
            if(tasks.length > 0) {
                 return `There are ${tasks.length} tasks with the status "${status}". They are:\n${taskList}`;
            }
            return `There are currently no tasks with the status "${status}".`;
        }
    },

    // --- Financial Queries ---
    {
        regex: /net profit/i,
        handler: (_, data) => {
            const income = data.finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
            const expenses = data.finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
            const net = income - expenses;
            return `The current net profit is ${formatCurrency(net)}. This is calculated from a total income of ${formatCurrency(income)} and total expenses of ${formatCurrency(expenses)}.`;
        }
    },
    {
        regex: /(total income|revenue)/i,
        handler: (_, data) => {
            const income = data.finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
            const latestIncome = data.finances.find(f => f.type === 'income');
            return `Total income is ${formatCurrency(income)}. The most recent income source was "${latestIncome?.description}".`;
        }
    },
    {
        regex: /(total expense|spending|costs?)/i,
        handler: (_, data) => {
            const expenses = data.finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
            const latestExpense = data.finances.find(f => f.type === 'expense');
            return `Total expenses are ${formatCurrency(expenses)}. The most recent expense was for "${latestExpense?.description}".`;
        }
    },
    {
        regex: /(financial|finance|money|budget)/i,
        handler: (_, data) => {
            const income = data.finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
            const expenses = data.finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
            const net = income - expenses;
            return `I've analyzed the team's finances. Total income is ${formatCurrency(income)}, total expenses are ${formatCurrency(expenses)}, resulting in a net profit of ${formatCurrency(net)}.`;
        }
    },
    
    // --- Task/Project Queries ---
    {
        regex: /who is working on (.*)/i,
        handler: (match, data) => {
            const taskKeyword = match[1].trim().toLowerCase();
            const relevantTasks = data.tasks.filter(t => t.title.toLowerCase().includes(taskKeyword) || t.description.toLowerCase().includes(taskKeyword));

            if (relevantTasks.length > 0) {
                const task = relevantTasks[0];
                if (task.status === TaskStatus.Done) {
                    return `The task "${task.title}" is already completed.`;
                }
                const assignee = task.assigneeId ? data.getTeamMember(task.assigneeId) : null;
                if (assignee) {
                    return `${assignee.name} is assigned to the task "${task.title}". The current status is "${task.status}".`;
                } else {
                    return `The task "${task.title}" is currently unassigned. Its status is "${task.status}".`;
                }
            }
            return `I couldn't find any active tasks related to "${taskKeyword}".`;
        }
    },

    // --- Discussion Queries ---
    {
        regex: /(summarize|discussion on|strategy for|thread on) (.*)/i,
        handler: (match, data) => {
            const threadKeyword = match[2].trim().toLowerCase();
            const relevantThreads = data.discussionThreads.filter(t => t.title.toLowerCase().includes(threadKeyword));
            
            if (relevantThreads.length > 0) {
                const thread = relevantThreads[0];
                const firstPost = thread.posts[0];
                const lastPost = thread.posts[thread.posts.length - 1];
                const firstAuthor = data.getTeamMember(firstPost.authorId);
                const lastAuthor = data.getTeamMember(lastPost.authorId);

                return `The discussion on "${thread.title}" was started by ${firstAuthor?.name}. The latest contribution is from ${lastAuthor?.name}, who said: "${lastPost.content}". There are ${thread.posts.length} posts in total.`;
            }
            return `I couldn't find a discussion thread about "${threadKeyword}".`;
        }
    },
    
    // --- General User Query ---
    {
        regex: /who is (.*)/i,
        handler: (match, data) => {
            const name = match[1].trim().toLowerCase();
            const user = data.users.find(u => u.name.toLowerCase().includes(name));
            if(user) {
                return `${user.name} is a ${user.role} on the team. You can reach them at ${user.email}.`;
            }
            return `I couldn't find a team member named "${name}".`;
        }
    }
];

export const queryLocalAI = (query: string, data: DataContextType): string => {
    const q = query.toLowerCase().trim().replace(/[?.,!]/g, '');

    for (const responder of RESPONDERS) {
        const match = q.match(responder.regex);
        if (match) {
            return responder.handler(match, data);
        }
    }

    // --- Fallback Response ---
    return "I'm sorry, I can't answer that. You can ask me about protocols ('protocol for pre-race check'), to define terms ('what is downforce?'), ask about data ('who is our top sponsor?'), or ask about team members ('who is Shrivatsa?').";
};