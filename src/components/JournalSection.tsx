import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { Reveal } from "./Motion";
import { featuredStory, journalStories } from "@/lib/journal";
import { folios } from "@/lib/site";

function pretty(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * The Journal, set as a magazine spread: one long read given the width it
 * deserves, the rest as a column of contents beside it.
 */
export default function JournalSection() {
  return (
    <section
      className="grain-paper relative"
      data-nav-tone="ink"
      aria-labelledby="journal-title"
    >
      <div className="above-grain shell py-24 sm:py-32 lg:py-40">
        <hr className="crease mb-14" />

        <SectionHeading
          folio={folios.journal}
          id="journal-title"
          lines={["From the", "ScriptLyra Journal."]}
          lead="Essays on craft, interviews with the people on our list, and the occasional argument about publishing itself."
          link={{ label: "Read the Journal", href: "/stories" }}
        />

        <div className="mt-20 grid gap-x-10 gap-y-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-6" y={24}>
            <article>
              <p className="t-micro border-rule flex items-baseline justify-between border-b pb-3">
                <span>{featuredStory.kind}</span>
                <span>{featuredStory.readingTime}</span>
              </p>

              <h3 className="t-display-m mt-6 max-w-[26ch]">
                <Link href={`/stories#${featuredStory.slug}`} className="link-rule">
                  {featuredStory.title}
                </Link>
              </h3>

              <p className="t-body-serif text-graphite mt-7">{featuredStory.standfirst}</p>

              <p className="t-micro mt-8 flex items-baseline justify-between">
                <span>{featuredStory.author}</span>
                <span>{pretty(featuredStory.date)}</span>
              </p>
            </article>
          </Reveal>

          <div className="lg:col-span-5 lg:col-start-8">
            <ul>
              {journalStories.map((story, i) => (
                <li key={story.slug} className="border-rule border-t first:border-t-0">
                  <Reveal delay={i * 0.05} y={16}>
                    <Link href={`/stories#${story.slug}`} className="block py-7">
                      <p className="t-micro flex items-baseline justify-between gap-6">
                        <span>{story.kind}</span>
                        <span>{story.readingTime}</span>
                      </p>
                      <h3 className="t-display-s mt-3 max-w-[30ch]">
                        <span className="link-rule">{story.title}</span>
                      </h3>
                      <p className="t-micro mt-3">{story.standfirst}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
