
// --- Types ---

export interface WikiPage {
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

export interface InterestVector {
    term: string;
    lockedSource?: string; // Fandom URL if manually selected
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

export async function getHybridRecommendations(
    userInputs: (string | InterestVector)[], // Backwards compat with string[]
    depth: number = 2,
    mode: 'PARALLEL' | 'SYNTHESIS' = 'PARALLEL'
): Promise<InterestResult[]> {
    const results: InterestResult[] = [];
    const usedTitles = new Set<string>();

    // Normalize inputs to InterestVector objects
    const vectors: InterestVector[] = userInputs.map(i =>
        typeof i === 'string' ? { term: i } : i
    );

    // Determine rations based on depth
    let wikiLimit = 5;
    let fandomLimit = 5;

    if (depth === 1) {
        wikiLimit = 8;
        fandomLimit = 2;
    } else if (depth === 3) {
        wikiLimit = 2;
        fandomLimit = 8;
    }

    // --- SYNTHESIS MODE LOGIC ---
    if (mode === 'SYNTHESIS' && vectors.length > 1) {
        const combinedQuery = vectors.map(v => v.term).join(' ');
        console.log(`[SYNTHESIS] Attempting cross-vector search: "${combinedQuery}"`);

        // 1. Try to find a Wikipedia page for the combined string (e.g., "Star Wars Lego")
        const synthesisResults = await fetchWikiMoreLike(combinedQuery, wikiLimit);

        // 2. Try Fandom for the combined string
        // We use the first term (or its locked source) as the likely "base" fandom
        let fandomUrl = vectors[0].lockedSource;
        if (!fandomUrl) {
            fandomUrl = await findFandomWiki(vectors[0].term) || undefined;
        }

        let synthesisFandom: WikiPage[] = [];

        if (fandomUrl) {
            synthesisFandom = await fetchFandomMoreLike(fandomUrl, combinedQuery, fandomLimit);
        }

        const combinedResults = [...synthesisResults, ...synthesisFandom];

        if (combinedResults.length > 0) {
            // SUCCESS: We found intersection data!
            // Map them
            combinedResults.forEach(page => {
                if (!usedTitles.has(page.title) && !page.title.includes("(disambiguation)")) {
                    results.push({
                        title: page.title,
                        type: 'AI_DISCOVERY',
                        source: synthesisResults.includes(page) ? 'WIKIPEDIA' : 'FANDOM',
                        apiBaseUrl: synthesisResults.includes(page) ? undefined : fandomUrl!,
                        summary: {
                            title: page.title,
                            extract: page.extract,
                            thumbnail: page.thumbnail
                        }
                    });
                    usedTitles.add(page.title);
                }
            });

            // Also add the original inputs as "User Selected" anchors
            for (const vec of vectors) {
                // Determine Source based on lock
                if (vec.lockedSource) {
                    results.unshift({
                        title: vec.term, // Might need to fetch actual title
                        type: 'USER_SELECTED',
                        source: 'FANDOM',
                        apiBaseUrl: vec.lockedSource,
                        summary: { title: vec.term, extract: "User Selected Fandom Source" }
                    });
                    usedTitles.add(vec.term);
                } else {
                    const canonical = await findCanonicalPage(vec.term);
                    const title = canonical ? canonical.title : vec.term;
                    if (!usedTitles.has(title)) {
                        results.unshift({
                            title: title,
                            type: 'USER_SELECTED',
                            source: 'WIKIPEDIA'
                        });
                        usedTitles.add(title);
                    }
                }
            }

            return results.slice(0, 12);
        } else {
            // FAIL: No intersection found. Fallback to Parallel.
            console.warn("[SYNTHESIS] No correlation found. Reverting to PARALLEL.");
        }
    }


    // --- PARALLEL MODE LOGIC (Default & Fallback) ---
    for (const vec of vectors) {

        // 0. Add User Input (Direct Hit)
        // Check for Locked Source
        if (vec.lockedSource) {
            results.push({
                title: vec.term,
                type: 'USER_SELECTED',
                source: 'FANDOM',
                apiBaseUrl: vec.lockedSource,
                summary: { title: vec.term, extract: "Direct Fandom Access" } // Placeholder summary until fetch
            });
            usedTitles.add(vec.term);

            // STEP B: Fandom Search (The Deep Dive) - Explicitly using locked source
            const fandomResults = await fetchFandomMoreLike(vec.lockedSource, vec.term, fandomLimit + wikiLimit); // Take all slots since Wiki is skipped? Or respect ratio?
            // Actually, if I locked it to Fandom, should I show Wiki results? 
            // The prompt says "Sourcing ONLY from that Fandom URL".
            // So we override the limits to be 100% Fandom for this vector.

            fandomResults.forEach(page => {
                if (!usedTitles.has(page.title)) {
                    results.push({
                        title: page.title,
                        type: 'AI_DISCOVERY',
                        source: 'FANDOM',
                        apiBaseUrl: vec.lockedSource,
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
            // Standard Wikipedia Path
            const canonical = await findCanonicalPage(vec.term);
            const title = canonical ? canonical.title : vec.term;

            if (!usedTitles.has(title)) {
                results.push({
                    title: title,
                    type: 'USER_SELECTED',
                    source: 'WIKIPEDIA',
                    summary: canonical ? {
                        title: canonical.title,
                        extract: canonical.extract,
                        thumbnail: canonical.thumbnail
                    } : undefined
                });
                usedTitles.add(title);
            }

            // STEP A: Wikipedia Search
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

            // STEP B: Fandom Search (Auto-Discovery)
            const fandomUrl = await findFandomWiki(vec.term);

            if (fandomUrl) {
                const fandomResults = await fetchFandomMoreLike(fandomUrl, vec.term, fandomLimit);
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
                // Fill with more Wiki
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
