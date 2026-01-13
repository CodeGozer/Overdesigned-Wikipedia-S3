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
export async function getWikiSummary(title: string): Promise<WikiSummary | null> {
    try {
        const res = await fetch(`${REST_API_BASE}page/summary/${encodeURIComponent(title)}`, { headers: HEADERS });
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
export async function getWikiHtml(title: string): Promise<string | null> {
    try {
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
