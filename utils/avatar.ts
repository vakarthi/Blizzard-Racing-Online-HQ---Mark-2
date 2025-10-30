const COLORS = ['#00BFFF', '#64FFDA', '#FBBF24', '#A78BFA', '#4ADE80', '#F472B6', '#F97316'];

/**
 * Generates a unique, colorful SVG avatar based on a user's name.
 * @param name The full name of the user.
 * @returns A base64-encoded data URL for the generated SVG image.
 */
export const generateAvatar = (name: string): string => {
    if (!name) return '';
    
    const initials = name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = COLORS[charCodeSum % COLORS.length];

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="${color}" />
            <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="40" fill="#FFF" font-weight="600">
                ${initials}
            </text>
        </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
};
