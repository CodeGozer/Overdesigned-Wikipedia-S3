import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { BrutalistInfobox } from "@/components/brutalist-infobox";
import WikiContent from "@/components/wiki-content";
import { getWikiSummary, getWikiHtml } from "@/services/wiki";

import { getThemeColor } from "@/config/themes";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WikiPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { api } = await searchParams; // Get API base url from query

    // Safety check for API url to ensure it's a valid string if present
    const apiBaseUrl = typeof api === 'string' ? decodeURIComponent(api) : undefined;

    const title = decodeURIComponent(slug).replace(/_/g, " ");
    const themeColor = getThemeColor(slug);

    // Fetch Data in Parallel (passing apiBaseUrl)
    const [summary, html] = await Promise.all([
        getWikiSummary(title, apiBaseUrl),
        getWikiHtml(title, apiBaseUrl)
    ]);

    if (!summary || !html) {
        notFound();
    }

    // Map Summary Data to Infobox Stats
    const infoboxStats = [
        { label: "Type", value: summary.type || "Article" },
        { label: "Source", value: "Wikipedia API" },
        { label: "Lang", value: summary.lang || "EN" },
        ...(summary.description ? [{ label: "Desc", value: summary.description }] : [])
    ];

    return (
        <ArticleLayout
            title={summary.title}
            lead={summary.extract || summary.description || "No description available."}
            themeColor={themeColor}
            imageUrl={summary.thumbnail?.source}
            infobox={
                <BrutalistInfobox
                    title={summary.title}
                    image={summary.thumbnail?.source}
                    stats={infoboxStats}
                />
            }
        >
            <WikiContent html={html} />
        </ArticleLayout>
    );
}
