export const THEME_COLORS: Record<string, string> = {
    'Vocaloid': '#39C5BB', // Miku Teal
    'Jet_fighter': '#FF4500', // Afterburner Orange
    'Fallout_(series)': '#14FDCE', // Pip-Boy Green (or #b4d455 for Amber) - let's go Green
    'Marvel_Comics': '#EC1D24', // Marvel Red
    'DC_Comics': '#0476F2', // DC Blue
    'Bleach_(manga)': '#FFFFFF', // Soul Reaper White
    'South_Africa': '#FFB81C', // SA Gold

    // Defaults
    'DEFAULT': '#00FF00' // Neon Green
};

export function getThemeColor(slug: string): string {
    return THEME_COLORS[slug] || THEME_COLORS['DEFAULT'];
}
