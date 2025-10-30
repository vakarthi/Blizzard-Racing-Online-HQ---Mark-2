import { AeroResult, DesignParameters, ScrutineeringItem } from '../types';
import { F1_IN_SCHOOLS_RULES } from './mockData';

// --- Scrutineering Logic ---

export const performScrutineering = (params: DesignParameters): ScrutineeringItem[] => {
    return F1_IN_SCHOOLS_RULES.map(rule => {
        const value = params[rule.key as keyof DesignParameters];
        let status: 'PASS' | 'FAIL' = 'PASS';
        let notes = 'Within specified limits.';

        // Fix: Add type check to ensure value is a number before comparison.
        if (typeof value === 'number') {
            if ('min' in rule && value < rule.min) {
                status = 'FAIL';
                notes = `Value is below the minimum of ${rule.min}${rule.unit}.`;
            }
            if ('max' in rule && value > rule.max) {
                status = 'FAIL';
                notes = `Value is above the maximum of ${rule.max}${rule.unit}.`;
            }
        } else {
            status = 'FAIL';
            notes = `Invalid or missing value for this parameter.`
        }

        return {
            ruleId: rule.id,
            description: rule.description,
            status: status,
            value: `${value}${rule.unit}`,
            notes: notes,
        };
    });
};

// --- Aero Suggestions Logic ---

export const generateAeroSuggestions = (result: AeroResult): string => {
    const suggestions: string[] = [];
    const { liftToDragRatio, aeroBalance, dragBreakdown, parameters } = result;

    if (liftToDragRatio < 3.5) {
        suggestions.push("Your **lift-to-drag ratio is low**, indicating inefficiency. Try increasing the span of your front or rear wings to generate more downforce relative to drag, or reduce the front wing chord to cut drag if downforce is sufficient.");
    } else if (liftToDragRatio > 5.0) {
        suggestions.push("Excellent **lift-to-drag ratio!** Your design is very efficient. Consider if you can trade a small amount of efficiency for more overall downforce by increasing wing chord angles.");
    }

    if (aeroBalance < 45) {
        suggestions.push("The **aero balance is heavily rear-biased** (<45% front). This can lead to understeer. Increase the front wing's chord or span to shift the center of pressure forward and improve turn-in stability.");
    } else if (aeroBalance > 55) {
        suggestions.push("The **aero balance is heavily front-biased** (>55% front), which can cause high-speed instability and oversteer. Consider increasing the rear wing's height or span to add more rear downforce.");
    }

    if (dragBreakdown.pressure > 75) {
        suggestions.push("A high percentage of **pressure drag** suggests flow separation is occurring. Examine the trailing edges of your wings and the transition from the chassis to the rear wheels for abrupt changes that could be smoothed out.");
    }
    
    if (suggestions.length === 0) {
        suggestions.push("This is a very balanced and well-performing design. Further improvements will likely come from minor iterative changes and testing.");
    }

    return `### Aerodynamic Improvement Suggestions
Based on the simulation results for **${parameters.carName}**, here are some actionable recommendations:
\n- ${suggestions.join('\n- ')}`;
};


// --- Social Post Generation ---

export const generateSocialPostTemplate = (topic: string): string => {
  const templates = [
    `🚀 Progress update from Blizzard Racing HQ! The team has been hard at work on the ${topic}. We're pushing the boundaries of performance and can't wait to show you more! #BlizzardRacing #F1inSchools #EngineeringExcellence`,
    `Lights out and away we go! 🏎️ This week's focus in the workshop has been on perfecting the ${topic}. Every millisecond counts on the track. Thanks to our amazing sponsors for making it all possible! #PushingTheLimits #STEM #Motorsport`,
    `From CAD to reality! Check out our latest development: the ${topic}. The dedication from our design and engineering team is incredible. Stay tuned for more updates from the Blizzard Racing garage! #Innovation #F1 #BlizzardHQ`
  ];
  // Pick one deterministically based on topic length to feel random but be testable
  return templates[topic.length % templates.length];
};