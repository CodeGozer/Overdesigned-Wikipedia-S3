
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
    category?: string;
    summary?: any; // Pass full wiki summary to avoid re-fetching
}

const WIKI_API_BASE = 'https://en.wikipedia.org/w/api.php?origin=*';

/**
 * Step A: The Handshake
 * Validates the input and finds the official Wikipedia title.
 */
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

/**
 * Step B: The Brain
 * Uses the "morelike" algorithm to find related pages with full metadata.
 */
async function fetchRelated(title: string): Promise<WikiPage[]> {
    const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: `morelike:${title}`,
        gsrlimit: '5', // Fetch a few to filter through
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
        console.error("Error fetching related pages:", e);
        return [];
    }
}


// 4. The "Expansion" Logic
export async function generateGrid(userInputs: string[]): Promise<InterestResult[]> {
    const results: InterestResult[] = [];
    const usedTitles = new Set<string>();

    // 1. Process User Inputs (Validation & Normalization)
    const validInputs: WikiPage[] = [];

    await Promise.all(userInputs.map(async (input) => {
        const page = await findCanonicalPage(input);
        if (page) {
            validInputs.push(page);
            results.push({
                title: page.title, // Use official title
                type: 'USER_SELECTED'
            });
            usedTitles.add(page.title);
        } else {
            // Keep user input even if not found, marked as raw? 
            // Better to show what they typed.
            results.push({
                title: input,
                type: 'USER_SELECTED'
            });
            usedTitles.add(input);
        }
    }));

    // 2. AI Discovery Phase
    // Target size logic: If >2 inputs, go for 10 total. Else 4.
    let targetSize = userInputs.length > 2 ? 10 : 4;

    // Safety cap
    if (targetSize > 12) targetSize = 12;

    const discoveryPool: WikiPage[] = [];

    // Fetch related for each valid input
    await Promise.all(validInputs.map(async (page) => {
        const related = await fetchRelated(page.title);
        related.forEach(r => {
            // Filter duplicates and disambiguation pages
            if (!usedTitles.has(r.title) && !r.title.includes("(disambiguation)")) {
                discoveryPool.push(r);
            }
        });
    }));

    // Shuffle discovery pool
    const shuffledDiscovery = discoveryPool.sort(() => 0.5 - Math.random());

    // Fill the grid
    for (const item of shuffledDiscovery) {
        if (results.length >= targetSize) break;
        if (!usedTitles.has(item.title)) {
            results.push({
                title: item.title,
                type: 'AI_DISCOVERY',
                summary: {
                    title: item.title,
                    extract: item.extract,
                    thumbnail: item.thumbnail
                }
            });
            usedTitles.add(item.title);
        }
    }

    return results;
}
