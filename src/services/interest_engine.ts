
interface WikiPage {
    pageid: number;
    title: string;
    extract?: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    fullurl?: string;
}

export interface InterestResult {
    title: string;
    type: 'USER_SELECTED' | 'AI_DISCOVERY';
    source: 'WIKIPEDIA' | 'FANDOM';
    category?: string;
    summary?: any;
    apiBaseUrl?: string;
}

const WIKI_API_BASE = 'https://en.wikipedia.org/w/api.php?origin=*';

// --- WIKIPEDIA HELPERS ---

async function findCanonicalPage(term: string): Promise<WikiPage | null> {
    const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: term,
        srlimit: '1',
        format: 'json'
    });

    try {
        const res = await fetch(`${WIKI_API_BASE}&${params.toString()}`);
        const data = await res.json();

        if (data.query?.search?.length > 0) {
            return {
                pageid: data.query.search[0].pageid,
                title: data.query.search[0].title
            };
        }
        return null;
    } catch (e) {
        console.error("Error finding canonical page:", e);
        return null;
    }
}

async function fetchWikiMoreLike(title: string, limit: number = 5): Promise<WikiPage[]> {
    const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: `morelike:${title}`,
        gsrlimit: limit.toString(),
        prop: 'pageimages|extracts|info',
        pithumbsize: '500',
        exintro: 'true',
        explaintext: 'true',
        inprop: 'url',
        format: 'json'
    });

    try {
        const res = await fetch(`${WIKI_API_BASE}&${params.toString()}`);
        const data = await res.json();

        if (data.query?.pages) {
            return Object.values(data.query.pages) as WikiPage[];
        }
        return [];
    } catch (e) {
        console.error("Error fetching related wiki pages:", e);
        return [];
    }
}

// --- FANDOM HELPERS ---

async function findFandomWiki(topic: string): Promise<string | null> {
    // Simple heuristic: Try common URL patterns
    // In a real app, use Google Search API or a Fandom directory API
    const candidates = [
        `https://${topic.replace(/ /g, '').toLowerCase()}.fandom.com`,
        `https://${topic.replace(/ /g, '').toLowerCase()}wiki.fandom.com`,
        `https://${topic.replace(/ /g, '-').toLowerCase()}.fandom.com`
    ];

    for (const url of candidates) {
        try {
            // We use a simple fetch to see if it exists (HEAD or GET)
            // Note: CORS might block this on client-side strictly, but we'll try
            // For this demo environment, we assume standard ones exist or we simulate.
            // Since we can't easily bypass CORS for checking existence purely in browser without proxy,
            // we will proceed with the most likely candidate if we can fetch its API.

            const apiUrl = `${url}/api.php?origin=*&action=query&meta=siteinfo&format=json`;
            const res = await fetch(apiUrl);
            if (res.ok) {
                return url;
            }
        } catch (e) {
            // Convert to a "soft" check: if we are in a protected env, just assume 
            // the first formatted one might work if we can query it later.
            // However, let's try to fail gracefully.
            continue;
        }
    }

    // Fallback: If the topic is known good ones
    const manualMap: Record<string, string> = {
        'Star Wars': 'https://starwars.fandom.com',
        'Fallout': 'https://fallout.fandom.com',
        'Warhammer': 'https://warhammer40k.fandom.com',
        'Minecraft': 'https://minecraft.fandom.com',
        'Elder Scrolls': 'https://elderscrolls.fandom.com',
        'Tanks': 'https://gup.fandom.com' // Girls und Panzer? Or maybe WOT. Let's act dumb.
    };

    const found = Object.keys(manualMap).find(k => k.toLowerCase() === topic.toLowerCase());
    if (found) return manualMap[found];

    return null;
}

async function fetchFandomMoreLike(baseUrl: string, topic: string, limit: number = 7): Promise<WikiPage[]> {
    const apiUrl = `${baseUrl}/api.php?origin=*`;

    // First, search for the topic in the fandom to get a base page
    const searchParams = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: topic,
        srlimit: '1',
        format: 'json'
    });

    let fandomTitle = topic;
    try {
        const searchRes = await fetch(`${apiUrl}&${searchParams.toString()}`);
        const searchData = await searchRes.json();
        if (searchData.query?.search?.length > 0) {
            fandomTitle = searchData.query.search[0].title;
        }
    } catch (e) {
        console.warn("Fandom search failed, using raw topic");
    }

    // Now get morelike
    const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: `morelike:${fandomTitle}`,
        gsrlimit: limit.toString(),
        prop: 'pageimages|extracts|info',
        pithumbsize: '500',
        exintro: 'true',
        explaintext: 'true',
        inprop: 'url',
        format: 'json'
    });

    try {
        const res = await fetch(`${apiUrl}&${params.toString()}`);
        const data = await res.json();
        if (data.query?.pages) {
            return Object.values(data.query.pages) as WikiPage[];
        }
        return [];
    } catch (e) {
        console.error(`Error fetching Fandom data from ${baseUrl}:`, e);
        return [];
    }
}


// --- MAIN LOGIC ---

export async function getHybridRecommendations(userInputs: string[], depth: number = 2): Promise<InterestResult[]> {
    const results: InterestResult[] = [];
    const usedTitles = new Set<string>();

    const targetSize = 10;

    // Determine rations based on depth
    // Depth 1 (Surface): 8 Wiki / 2 Fandom
    // Depth 2 (Hybrid): 5 Wiki / 5 Fandom (Balanced)
    // Depth 3 (Deep): 2 Wiki / 8 Fandom
    let wikiLimit = 5;
    let fandomLimit = 5;

    if (depth === 1) {
        wikiLimit = 8;
        fandomLimit = 2;
    } else if (depth === 3) {
        wikiLimit = 2;
        fandomLimit = 8;
    }

    for (const input of userInputs) {
        // 0. Add User Input (Direct Hit)
        const canonical = await findCanonicalPage(input);
        const title = canonical ? canonical.title : input;

        if (!usedTitles.has(title)) {
            results.push({
                title: title,
                type: 'USER_SELECTED',
                source: 'WIKIPEDIA', // Default source for user input
                summary: canonical ? {
                    title: canonical.title,
                    extract: canonical.extract,
                    thumbnail: canonical.thumbnail
                } : undefined
            });
            usedTitles.add(title);
        }

        // STEP A: Wikipedia Search (The Anchor)
        const wikiResults = await fetchWikiMoreLike(title, wikiLimit);
        wikiResults.forEach(page => {
            if (!usedTitles.has(page.title) && !page.title.includes("(disambiguation)")) {
                results.push({
                    title: page.title,
                    type: 'AI_DISCOVERY',
                    source: 'WIKIPEDIA',
                    summary: {
                        title: page.title,
                        extract: page.extract,
                        thumbnail: page.thumbnail
                    }
                });
                usedTitles.add(page.title);
            }
        });

        // STEP B: Fandom Search (The Deep Dive)
        const fandomUrl = await findFandomWiki(input);

        if (fandomUrl) {
            // Found a specific wiki!
            const fandomResults = await fetchFandomMoreLike(fandomUrl, input, fandomLimit);
            fandomResults.forEach(page => {
                if (!usedTitles.has(page.title)) {
                    results.push({
                        title: page.title,
                        type: 'AI_DISCOVERY',
                        source: 'FANDOM',
                        apiBaseUrl: fandomUrl,
                        summary: {
                            title: page.title,
                            extract: page.extract,
                            thumbnail: page.thumbnail
                        }
                    });
                    usedTitles.add(page.title);
                }
            });
        } else {
            // No Fandom found. Fill the gap with more Wikipedia if needed.
            // If we are in Deep Mode but no Fandom found, we just do more Wiki but maybe warn?
            // For now, just fill up.
            const moreWiki = await fetchWikiMoreLike(title, fandomLimit);
            moreWiki.forEach(page => {
                if (!usedTitles.has(page.title)) {
                    results.push({
                        title: page.title,
                        type: 'AI_DISCOVERY',
                        source: 'WIKIPEDIA',
                        summary: {
                            title: page.title,
                            extract: page.extract,
                            thumbnail: page.thumbnail
                        }
                    });
                    usedTitles.add(page.title);
                }
            });
        }
    }

    // Shuffle results
    const userSelected = results.filter(r => r.type === 'USER_SELECTED');
    const discovery = results.filter(r => r.type === 'AI_DISCOVERY');

    // Sort logic? If Deep mode, maybe prioritize Fandom items in the shuffle?
    // For now, pure shuffle is fine as the Quantity ratio does the work.
    const shuffledDiscovery = discovery.sort(() => 0.5 - Math.random());

    return [...userSelected, ...shuffledDiscovery].slice(0, 12);
}

// Alias for compatibility if needed, but we replace the export
export const generateGrid = getHybridRecommendations;
