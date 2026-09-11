import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import SubscribeForm from "@/components/SubscribeForm";
import { Reveal } from "@/components/Motion";
import { featuredStory, journalStories, stories } from "@/lib/journal";
import { breadcrumbSchema, listSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description =
  "The ScriptLyra Journal: essays on craft, interviews with our authors, and notes on how the books actually get made.";

export const metadata: Metadata = {
  title: "The Journal",
  description,
  alternates: { canonical: "/stories" },
  openGraph: { title: `The Journal — ${site.wordmark}`, description, url: "/stories" },
  twitter: { title: `The Journal — ${site.wordmark}`, description },
};

function pretty(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function StoriesPage() {
  return (
    <>
      <JsonLd
        nodes={[
          listSchema(
            "The ScriptLyra Journal",
            "/stories",
            stories.map((story) => ({ name: story.title, url: `${site.url}/stories#${story.slug}` })),
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Journal", path: "/stories" },
          ]),
        ]}
      />

      <PageHeader
        head="The Journal"
        meta="Issue eleven"
        lines={["Notes from", "the workshop."]}
        lead="What we are reading, arguing about, and learning while the books are in production. Written by our editors and the people on our list."
      />

      <section className="shell pb-8" aria-label="Current issue">
        <article id={featuredStory.slug} className="scroll-mt-28">
          <Reveal y={22}>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-8">
                <p className="t-micro border-rule flex items-baseline justify-between border-b pb-3">
                  <span>{featuredStory.kind}</span>
                  <span>{featuredStory.readingTime}</span>
                </p>

                <h2 className="t-display-l mt-8 max-w-[24ch]">{featuredStory.title}</h2>

                <p className="t-body-serif text-graphite mt-8">{featuredStory.standfirst}</p>
              </div>

              <div className="lg:col-span-3 lg:col-start-10 lg:self-end">
                <dl className="border-rule border-t pt-5">
                  <dt className="t-micro">Written by</dt>
                  <dd className="mt-1 text-[0.9375rem]">{featuredStory.author}</dd>
                  <dt className="t-micro mt-5">Published</dt>
                  <dd className="t-numeral mt-1 text-[0.9375rem]">{pretty(featuredStory.date)}</dd>
                </dl>
              </div>
            </div>
          </Reveal>
        </article>
      </section>

      <section className="shell pb-24 sm:pb-32" aria-label="Earlier pieces">
        <ul className="mt-16 sm:mt-24">
          {journalStories.map((story, i) => (
            <li key={story.slug} className="border-rule border-t">
              <article id={story.slug} className="scroll-mt-28">
                <Reveal delay={Math.min(i, 3) * 0.05} y={16}>
                  <div className="grid gap-x-10 gap-y-4 py-9 lg:grid-cols-12">
                    <p className="t-micro t-numeral lg:col-span-2">{pretty(story.date)}</p>

                    <div className="lg:col-span-7">
                      <h3 className="t-display-s max-w-[32ch]">{story.title}</h3>
                      <p className="t-body text-graphite mt-3">{story.standfirst}</p>
                    </div>

                    <p className="t-micro lg:col-span-3 lg:text-right">
                      {story.kind}
                      <span className="block lg:mt-1">
                        {story.author}, {story.readingTime}
                      </span>
                    </p>
                  </div>
                </Reveal>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="subscribe">
        <div className="above-grain shell pb-24 sm:pb-32">
          <hr className="crease" />

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <h2 id="subscribe" className="t-display-m max-w-[18ch]">
                Have it sent to you.
              </h2>
              <p className="t-body text-graphite mt-6">
                The Journal goes out by email before it appears here. Nine hundred readers, no
                tracking pixels, and an unsubscribe link that works on the first click.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
