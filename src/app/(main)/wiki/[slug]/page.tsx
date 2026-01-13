import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { BrutalistInfobox } from "@/components/brutalist-infobox";
import WikiContent from "@/components/wiki-content";
import { getWikiSummary, getWikiHtml } from "@/services/wiki";

import { getThemeColor } from "@/config/themes";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function WikiPage({ params }: PageProps) {
    const { slug } = await params;
    const title = decodeURIComponent(slug).replace(/_/g, " ");
    const themeColor = getThemeColor(slug); // Get the mapped color

    // Fetch Data in Parallel
    const [summary, html] = await Promise.all([
        getWikiSummary(title),
        getWikiHtml(title)
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
