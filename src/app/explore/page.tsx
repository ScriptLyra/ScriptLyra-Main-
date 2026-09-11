import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ExploreIndex from "@/components/ExploreIndex";
import JsonLd from "@/components/JsonLd";
import { authors } from "@/lib/authors";
import { books } from "@/lib/books";
import { stories } from "@/lib/journal";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description =
  "One index over everything ScriptLyra publishes: books, the writers behind them, and the Journal. Filter by subject or read it top to bottom.";

export const metadata: Metadata = {
  title: "Explore",
  description,
  alternates: { canonical: "/explore" },
  openGraph: { title: `Explore — ${site.wordmark}`, description, url: "/explore" },
  twitter: { title: `Explore — ${site.wordmark}`, description },
};

export default function ExplorePage() {
  const total = books.length + authors.length + stories.length;

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Explore", path: "/explore" },
          ]),
        ]}
      />

      <PageHeader
        head="Index"
        meta={`${total} entries`}
        lines={["Everything we have,", "in one index."]}
        lead="Books, the people who wrote them, and the Journal. Narrow it by subject, or start at the top and work down."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Index">
        <ExploreIndex />
      </section>
    </>
  );
}
