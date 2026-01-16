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

export default async function FandomPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { api } = await searchParams; // API is required for this route

    // Safety check for API url
    if (typeof api !== 'string') {
        // If no API url provided, we can't fetch Fandom content comfortably.
        // Maybe redirect or show error? For now, 404.
        notFound();
    }

    const apiBaseUrl = decodeURIComponent(api);
    const title = decodeURIComponent(slug).replace(/_/g, " ");
    const themeColor = getThemeColor(slug); // We can stick to standard logic or add 'fandom' specific coloring

    // Fetch Data in Parallel
    const [summary, html] = await Promise.all([
        getWikiSummary(title, apiBaseUrl),
        getWikiHtml(title, apiBaseUrl)
    ]);

    if (!summary || !html) {
        notFound();
    }

    // Fandom Stats
    const infoboxStats = [
        { label: "Network", value: "FANDOM.COM" },
        { label: "Community", value: new URL(apiBaseUrl).hostname.replace('.fandom.com', '').replace('api.php', '').toUpperCase() },
        { label: "Type", value: summary.type || "Community Article" },
        ...(summary.description ? [{ label: "Desc", value: summary.description }] : [])
    ];

    return (
        <ArticleLayout
            title={summary.title}
            lead={summary.extract || `Entry from the ${infoboxStats[1].value} archive.`}
            themeColor={themeColor} // Or use a distinct Fandom color, e.g. '#FF0055'
            imageUrl={summary.thumbnail?.source}
            // Tagging specifically as Fandom for layout if needed, but styling is global
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
