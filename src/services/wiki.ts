import { sanitizeSummary } from '@/lib/text-sanitizer';

const REST_API_BASE = "https://en.wikipedia.org/api/rest_v1/";
const ACTION_API_BASE = "https://en.wikipedia.org/w/api.php";

const HEADERS = {
    "User-Agent": "Nicopedia/1.0 (nicokornuijt@example.com) NextJS-Education-Project",
    "Accept": "application/json"
};

export interface WikiSummary {
    title: string;
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    content_urls?: {
        desktop: {
            page: string;
        };
        mobile: {
            page: string;
        };
    };
    description?: string;
    type?: string;
    lang?: string;
    gallery?: string[];
}



/**
 * Fetch a summary of an article (Title, Extract, Thumbnail)
 * AND a gallery of images (Smart Filtered)
 */
export async function getWikiSummary(title: string, apiBaseUrl?: string): Promise<WikiSummary | null> {
    try {
        // --- 1. Fetch Main Summary (REST or Action API) ---
        let mainData: any = null;
        let isFandom = false;

        if (apiBaseUrl) {
            // Fandom Logic
            isFandom = true;
            const params = new URLSearchParams({
                action: 'query',
                titles: title,
                prop: 'extracts|pageimages|info',
                exintro: 'true',
                explaintext: 'true',
                pithumbsize: '1000',
                inprop: 'url',
                format: 'json',
                origin: '*'
            });
            const endpoint = apiBaseUrl.endsWith('api.php') ? apiBaseUrl : `${apiBaseUrl}/api.php`;
            const res = await fetch(`${endpoint}?${params.toString()}`);
            const data = await res.json();
            const page = Object.values(data.query?.pages || {})[0] as any;

            if (page && !page.missing) {
                mainData = {
                    title: page.title,
                    extract: sanitizeSummary(page.extract),
                    thumbnail: page.thumbnail,
                    type: 'Fandom',
                    lang: 'en'
                };
            }
        } else {
            // Wikipedia REST Logic
            const url = `${REST_API_BASE}page/summary/${encodeURIComponent(title)}`;
            const res = await fetch(url, { headers: HEADERS });
            if (res.ok) {
                mainData = await res.json();
            }
        }

        if (!mainData) return null;

        // --- 2. Fetch Gallery Images (Parallel Action API Call) ---
        // We do this for both Wikipedia and Fandom to get better images
        const galleryEndpoint = apiBaseUrl
            ? (apiBaseUrl.endsWith('api.php') ? apiBaseUrl : `${apiBaseUrl}/api.php`)
            : ACTION_API_BASE;

        // Params: generator=images returns file pages used on the page
        const galleryParams = new URLSearchParams({
            action: 'query',
            titles: title,
            generator: 'images',
            gimlimit: '15', // Fetch a few more to allow for filtering
            prop: 'imageinfo',
            iiprop: 'url|mime|size',
            format: 'json',
            origin: '*'
        });

        const galleryRes = await fetch(`${galleryEndpoint}?${galleryParams.toString()}`, { headers: HEADERS });
        const galleryData = await galleryRes.json();

        // Extract pages from the generator result
        const imagePages = Object.values(galleryData.query?.pages || {}) as any[];

        // --- 3. Smart Filter ---
        const gallery = imagePages
            .filter((img: any) => {
                const info = img.imageinfo?.[0];
                if (!info) return false;

                // 1. MIME Type Check
                if (info.mime === 'image/svg+xml') return false;

                // 2. Extension Check
                const url = info.url?.toLowerCase() || '';
                if (!url.match(/\.(jpg|jpeg|png)$/)) return false;

                // 3. Name/Keyword Blocklist
                const name = img.title?.toLowerCase() || '';
                if (name.match(/(icon|logo|flag|stub|symbol|vote|question|ambox)/)) return false;

                // 4. Size Check (skip tiny images)
                if (info.width && info.width < 300) return false;
                if (info.height && info.height < 300) return false;

                return true;
            })
            .map((img: any) => img.imageinfo[0].url) // Extract just the URL
            .slice(0, 8); // Top 8 valid images

        // console.log(`[WikiAdapter] Gallery for ${title}:`, gallery);

        return {
            ...mainData,
            gallery
        };

    } catch (error) {
        console.error("Wiki Summary Fetch Error:", error);
        return null;
    }
}

/**
 * Fetch the raw HTML of an article
 */
export async function getWikiHtml(title: string, apiBaseUrl?: string): Promise<string | null> {
    try {
        if (apiBaseUrl) {
            // Fandom Action API Parsing
            const params = new URLSearchParams({
                action: 'parse',
                page: title,
                prop: 'text',
                format: 'json',
                origin: '*'
            });
            const endpoint = apiBaseUrl.endsWith('api.php') ? apiBaseUrl : `${apiBaseUrl}/api.php`;
            const res = await fetch(`${endpoint}?${params.toString()}`);
            const data = await res.json();
            return data.parse?.text?.['*'] || null;
        }

        const url = `${REST_API_BASE}page/html/${encodeURIComponent(title)}`;
        const res = await fetch(url, { headers: { ...HEADERS, "Accept": "text/html" } });
        if (!res.ok) {
            console.error(`HTML Fetch Failed: ${res.status} ${res.statusText}`);
            return null;
        }
        return await res.text();
    } catch (error) {
        console.error("Wiki HTML Fetch Error:", error);
        return null;
    }
}

/**
 * Get a random article summary
 * Uses Action API for random list -> then REST API for summary
 */
export async function getRandomArticle(): Promise<WikiSummary | null> {
    try {
        const params = new URLSearchParams({
            action: "query",
            list: "random",
            rnnamespace: "0", // Main namespace only
            rnlimit: "1",
            format: "json",
            origin: "*"
        });

        const res = await fetch(`${ACTION_API_BASE}?${params.toString()}`, { headers: HEADERS });
        if (!res.ok) return null;

        const data = await res.json();
        const randomTitle = data?.query?.random?.[0]?.title;

        if (!randomTitle) return null;
        return await getWikiSummary(randomTitle);

    } catch (error) {
        console.error("Random Article Error:", error);
        return null;
    }
}

/**
 * Get a random article from a specific category
 */
export async function getRandomFromCategory(category: string): Promise<string | null> {
    try {
        const params = new URLSearchParams({
            action: "query",
            list: "categorymembers",
            cmtitle: `Category:${category}`,
            cmlimit: "100", // Fetch up to 100 to pick from
            cmtype: "page", // Only pages, no subcats
            format: "json",
            origin: "*"
        });

        const res = await fetch(`${ACTION_API_BASE}?${params.toString()}`, { headers: HEADERS });
        if (!res.ok) return null;

        const data = await res.json();
        const members = data?.query?.categorymembers || [];

        if (members.length === 0) return null;

        // Pick random member
        const randomMember = members[Math.floor(Math.random() * members.length)];
        return randomMember.title;

    } catch (error) {
        console.error(`Random Category Fetch Error (${category}):`, error);
        return null;
    }
}

/**
 * Federated Search Result Interface
 */
export interface FederatedResult {
    title: string;
    url: string;
    type: 'WIKIPEDIA' | 'FANDOM';
    desc?: string; // Optional description/snippet
}

/**
 * Search/Autocomplete using Opensearch (Wikipedia)
 */
export async function searchWiki(query: string): Promise<FederatedResult[]> {
    if (!query) return [];

    try {
        const params = new URLSearchParams({
            action: "opensearch",
            search: query,
            limit: "5",
            namespace: "0",
            format: "json",
            origin: "*"
        });

        const res = await fetch(`${ACTION_API_BASE}?${params.toString()}`, { headers: HEADERS });
        if (!res.ok) return [];

        // Opensearch returns array: [query, [titles], [descriptions], [urls]]
        const data = await res.json();
        const titles = data[1] || [];
        const urls = data[3] || [];

        return titles.map((title: string, index: number) => ({
            title,
            url: urls[index],
            type: 'WIKIPEDIA'
        }));

    } catch (error) {
        console.error("Search API Error:", error);
        return [];
    }
}

/**
 * Search Fandom Communities
 * Finds wikis (e.g. "Fallout Wiki") rather than just pages.
 */
export async function searchFandomCommunities(query: string): Promise<FederatedResult[]> {
    if (!query || query.length < 2) return [];

    try {
        // Fandom's Cross-Wiki Search
        // API Endpoint: https://community.fandom.com/api.php
        const params = new URLSearchParams({
            action: "query",
            list: "wikis",
            gksearch: query,
            wklimit: "5",
            format: "json",
            origin: "*"
        });

        const res = await fetch(`https://community.fandom.com/api.php?${params.toString()}`, {
            headers: { "Accept": "application/json" }
        });

        if (!res.ok) return [];

        const data = await res.json();
        const wikis = data.query?.wikis || [];

        return wikis.map((wiki: any) => ({
            title: wiki.sitename || wiki.title, // 'sitename' is usually cleaner e.g. "Fallout Wiki"
            url: wiki.url,
            type: 'FANDOM',
            desc: `Community ID: ${wiki.id} • Lang: ${wiki.lang}`
        }));

    } catch (error) {
        console.error("Fandom Search Error:", error);
        return [];
    }
}
