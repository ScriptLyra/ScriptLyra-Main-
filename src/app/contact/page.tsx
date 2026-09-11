import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/Motion";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description =
  "How to reach ScriptLyra: submissions, rights and permissions, press, and letters for our authors.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact — ${site.wordmark}`, description, url: "/contact" },
  twitter: { title: `Contact — ${site.wordmark}`, description },
};

const desks = [
  {
    name: "Submissions",
    email: "submissions@scriptlyra.com",
    detail:
      "An editor reads everything, in the order it arrives. The form takes less time than the email.",
    link: { label: "Use the submission form", href: "/publish#submit" },
  },
  {
    name: "Rights and permissions",
    email: "rights@scriptlyra.com",
    detail:
      "Translation, audio, serial and performance rights, and any extract over four hundred words.",
  },
  {
    name: "Press and reviews",
    email: "press@scriptlyra.com",
    detail:
      "Review copies, interview requests, festival programming. Digital proofs go out three months ahead of publication.",
  },
  {
    name: "Letters for our authors",
    email: "letters@scriptlyra.com",
    detail: "We forward reader letters unopened, by post, on the first of the month.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        nodes={[
          {
            "@type": "ContactPage",
            "@id": `${site.url}/contact#page`,
            url: `${site.url}/contact`,
            name: `Contact — ${site.wordmark}`,
            description,
            about: { "@id": `${site.url}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />

      <PageHeader
        head="Contact"
        meta="Answered by people"
        lines={["Write to the house."]}
        lead="Four desks, four addresses, and no ticketing system. Whoever answers you will be the person dealing with it."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Desks">
        <ul className="grid gap-x-16 gap-y-12 sm:grid-cols-2">
          {desks.map((desk, i) => (
            <li key={desk.name} className="border-rule border-t pt-6">
              <Reveal delay={(i % 2) * 0.05} y={16}>
                <h2 className="t-display-s">{desk.name}</h2>
                <p className="t-body text-graphite mt-3">{desk.detail}</p>
                <p className="mt-5">
                  <a href={`mailto:${desk.email}`} className="link-rule text-[0.9375rem]">
                    {desk.email}
                  </a>
                </p>
                {desk.link ? (
                  <p className="mt-2">
                    <Link href={desk.link.href} className="link-rule text-graphite text-[0.9375rem]">
                      {desk.link.label}
                    </Link>
                  </p>
                ) : null}
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="grain-paper bg-leaf relative" data-nav-tone="ink" aria-labelledby="message">
        <div className="above-grain shell py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 id="message" className="t-display-l max-w-[14ch]">
                Or use this.
              </h2>

              <address className="t-body-serif mt-10 not-italic">
                ScriptLyra
                <br />
                Second floor, above Pellam Books
                <br />
                14 Cathedral Row
                <br />
                Edinburgh EH1 2QF
              </address>

              <p className="t-micro mt-8">
                The office is a flat above a bookshop. Someone is usually in between ten and six,
                and there is no reception, so do write first.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
