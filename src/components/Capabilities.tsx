import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { Reveal } from "./Motion";
import { folios } from "@/lib/site";

/**
 * What the house actually does, set as a contents page: three faculties, one
 * hairline between each. Not a sequence, so it carries no numbers.
 */
const faculties = [
  {
    title: "Discover",
    body: "Reading here is not a feed. It is a list, kept deliberately short, with a person behind every entry and a reason for each one being on it.",
    link: { label: "Explore the list", href: "/explore" },
  },
  {
    title: "Create",
    body: "Draft in a room built for prose. No dashboards, no streaks, no notification pretending to be encouragement — only the page and how far you have got.",
    link: { label: "Inside the workshop", href: "/publish#how" },
  },
  {
    title: "Publish",
    body: "Editing, design, print and distribution: the unglamorous half of a book, done properly, by people who have done it before.",
    link: { label: "Publish with us", href: "/publish" },
  },
];

export default function Capabilities() {
  return (
    <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="world-title">
      <div className="above-grain shell py-24 sm:py-32 lg:py-40">
        <hr className="crease mb-14" />

        <SectionHeading
          folio={folios.world}
          id="world-title"
          lines={["Words can", "become worlds."]}
          lead="ScriptLyra is a publishing house with a workshop attached: one place to read what has been made, and to make the thing you have been carrying."
        />

        <ul className="mt-20 sm:mt-24">
          {faculties.map((faculty, i) => (
            <li key={faculty.title} className="border-rule border-t first:border-t-0">
              <Reveal delay={i * 0.06} y={18}>
                <div className="grid gap-6 py-10 sm:py-12 lg:grid-cols-12 lg:items-baseline lg:gap-10">
                  <h3 className="t-display-m lg:col-span-3">{faculty.title}</h3>
                  <p className="t-body lg:col-span-6">{faculty.body}</p>
                  <div className="lg:col-span-3 lg:text-right">
                    <Link href={faculty.link.href} className="link-rule text-[0.9375rem]">
                      {faculty.link.label}
                    </Link>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
