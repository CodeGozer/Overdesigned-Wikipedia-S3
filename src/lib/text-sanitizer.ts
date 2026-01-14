/**
 * Utility to sanitize and clean formatting from Wiki API summaries.
 * Removes HTML, Citations, Wiki Markup, and handles Fandom oddities.
 */

export function sanitizeSummary(htmlOrText: string): string {
    if (!htmlOrText) return "";

    let text = htmlOrText;

    // 1. Strip HTML tags
    text = text.replace(/<[^>]*>/g, '');

    // 2. Remove References like [1], [42], [note 1]
    text = text.replace(/\[\d+\]/g, '');       // Simple numbers
    text = text.replace(/\[note \d+\]/g, '');  // Notes

    // 3. Remove Wiki Markup artifacts
    text = text.replace(/'''/g, ''); // Bold
    text = text.replace(/''/g, '');  // Italic
    text = text.replace(/\{\{[^}]*\}\}/g, ''); // Template artifacts if any leak

    // 4. Decode HTML Entities (Basic set)
    const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' '
    };
    text = text.replace(/&[a-z0-9#]+;/gi, (entity) => entities[entity] || entity);

    // 5. Cleanup Whitespace
    text = text.replace(/\s+/g, ' ').trim();

    // 6. Fandom Specifics: Filter boilerplate
    // Example: "Cyberpunk is a genre..." vs "Cyberpunk is a 1980s role-playing game..."
    // Sometimes Fandom returns "Advertisement" or "Name is a character in..."
    // If it starts with a very short boilerplate sentence, maybe skip it? 
    // For now, let's just look for specific annoyance patterns.
    if (text.startsWith("Advertisement")) {
        text = text.replace(/^Advertisement\s*/, '');
    }

    // 7. Limit Length (180 chars)
    if (text.length > 180) {
        // Cut at last space before 180 to avoid cutting words
        const cut = text.substring(0, 180);
        const lastSpace = cut.lastIndexOf(' ');
        if (lastSpace > 0) {
            text = cut.substring(0, lastSpace) + '...';
        } else {
            text = cut + '...';
        }
    }

    return text;
}
