import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { BrutalistInfobox } from "@/components/brutalist-infobox";
import WikiContent from "@/components/wiki-content";
import { getWikiSummary, getWikiHtml } from "@/services/wiki";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function WikiPage({ params }: PageProps) {
    const { slug } = await params;
    const title = decodeURIComponent(slug).replace(/_/g, " ");

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
        // If we had more structured data we would map it here
        ...(summary.description ? [{ label: "Desc", value: summary.description }] : [])
    ];

    return (
        <ArticleLayout
            title={summary.title}
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
