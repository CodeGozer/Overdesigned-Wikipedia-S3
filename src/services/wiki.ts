const REST_API_BASE = "https://en.wikipedia.org/api/rest_v1/";
const ACTION_API_BASE = "https://en.wikipedia.org/w/api.php";

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
    };
    description?: string;
    type?: string;
    lang?: string;
}

const HEADERS = {
    "User-Agent": "Nicopedia/1.0 (nicokornuijt@example.com) NextJS-Education-Project",
    "Accept": "application/json"
};

export interface WikiSearchResult {
    title: string;
    url: string;
}

/**
 * Fetch a summary of an article (Title, Extract, Thumbnail)
 */
export async function getWikiSummary(title: string, apiBaseUrl?: string): Promise<WikiSummary | null> {
    try {
        let url = `${REST_API_BASE}page/summary/${encodeURIComponent(title)}`;

        // If external API (Fandom/MediaWiki) is provided, we probably need to use the Action API
        // because consistent REST API support is spotty on Fandom.
        if (apiBaseUrl) {
            // Check if it's strictly the REST base or the root
            // For now, let's assume we map to Action API for robust Fandom support
            // Fandom Action API: ?action=query&prop=extracts|pageimages&...
            const params = new URLSearchParams({
                action: 'query',
                titles: title,
                prop: 'extracts|pageimages|info',
                exintro: 'true',
                explaintext: 'true',
                pithumbsize: '1000', // High res
                inprop: 'url',
                format: 'json',
                origin: '*'
            });
            // Construct the API endpoint. apiBaseUrl usually is "https://wiki.fandom.com".
            // We expect it to need "/api.php" appended if not present, but our InterestEngine sets it as the root.
            const endpoint = apiBaseUrl.endsWith('api.php') ? apiBaseUrl : `${apiBaseUrl}/api.php`;
            const actionUrl = `${endpoint}?${params.toString()}`;

            const res = await fetch(actionUrl);
            const data = await res.json();
            const page = Object.values(data.query?.pages || {})[0] as any;

            if (!page || page.missing) return null;

            return {
                title: page.title,
                extract: page.extract,
                thumbnail: page.thumbnail,
                type: 'Fandom',
                lang: 'en'
            };
        }

        // Standard Wikipedia REST
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) return null;
        return await res.json();
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
 * Search/Autocomplete using Opensearch
 */
export async function searchWiki(query: string): Promise<WikiSearchResult[]> {
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
            url: urls[index]
        }));

    } catch (error) {
        console.error("Search API Error:", error);
        return [];
    }
}
