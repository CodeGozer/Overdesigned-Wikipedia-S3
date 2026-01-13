import { ArticleLayout } from "@/components/article-layout";
import { BrutalistInfobox } from "@/components/brutalist-infobox";
import data from "@/data/ef-2000.json";

export default function EF2000Page() {
    return (
        <ArticleLayout
            title={data.title}
            infobox={
                <BrutalistInfobox
                    title={data.infobox.title}
                    image={data.infobox.image}
                    stats={data.infobox.stats}
                />
            }
        >
            {data.sections.map((section, index) => (
                <section key={index} className="mb-8" data-scroll-section>
                    <h2 className="text-2xl font-bold font-display text-white mb-4 border-b border-neon-green/30 pb-2">
                        {section.heading}
                    </h2>
                    <div
                        className="prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-neon-green"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                </section>
            ))}
        </ArticleLayout>
    );
}
