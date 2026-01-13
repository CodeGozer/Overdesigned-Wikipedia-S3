import { ArticleLayout } from "@/components/article-layout";
import { KineticMarquee } from "@/components/kinetic-marquee";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="pt-4 pb-2">
        <KineticMarquee />
      </div>
      <ArticleLayout title="Wiki Skeleton">
        <p className="lead">
          This is a demonstration of the <strong>Nicopedia</strong> article skeleton.
          It features a clean, readable layout optimized for information density and aesthetics.
        </p>

        <h2>Core Architecture</h2>
        <p>
          The skeleton is built using <strong>Next.js 15</strong> (App Router) and <strong>Tailwind CSS v4</strong>.
          It utilizes a component-based architecture for maximum modularity.
        </p>

        <h3>Key Components</h3>
        <ul>
          <li><strong>SiteHeader</strong>: Sticky navigation bar with blur effect.</li>
          <li><strong>ArticleLayout</strong>: Responsive grid layout with sidebar support.</li>
          <li><strong>SiteFooter</strong>: Simple footer with links.</li>
        </ul>

        <h2>Typography</h2>
        <p>
          We use the <code>@tailwindcss/typography</code> plugin to ensure extensive content is
          beautifully formatted by default. Headings, lists, code blocks, and quotes look professional
          out of the box.
        </p>

        <blockquote>
          "Simplicity is the ultimate sophistication." — Leonardo da Vinci
        </blockquote>

        <h2>Responsive Design</h2>
        <p>
          Resize your browser window to see how the layout adapts. On mobile screens:
        </p>
        <ol>
          <li>The sidebar infobox disappears (or moves to bottom).</li>
          <li>Navigation simplifies.</li>
          <li>Margins adjust for better readability.</li>
        </ol>

        <div className="not-prose mt-8 p-4 rounded-lg bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Developer Note</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This skeleton is ready for dynamic data integration. You can fetch article content via CMS
            or Markdown files and pass it into the <code>ArticleLayout</code> component.
          </p>
        </div>
      </ArticleLayout>
    </>
  );
}
