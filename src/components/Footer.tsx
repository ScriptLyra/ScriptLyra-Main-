import Link from "next/link";
import Lockup from "./Lockup";
import { footerNav, legalNav, site } from "@/lib/site";

const year = new Date().getFullYear();

/**
 * The last page of the book: imprint, contents, colophon. Quiet by design —
 * the closing call to action above it does the talking.
 */
export default function Footer() {
  return (
    <footer className="border-rule border-t">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="ScriptLyra — home" className="inline-block">
              <Lockup className="w-[10.5rem]" label="ScriptLyra" />
            </Link>
            <p className="t-body text-graphite mt-6 max-w-[30ch]">
              A publishing house for stories worth remembering — and a workshop for the
              people writing them.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:col-span-7 lg:col-start-6"
          >
            {footerNav.map((group) => (
              <div key={group.heading}>
                <h2 className="font-display text-ink text-[1.0625rem] italic">
                  {group.heading}
                </h2>
                <ul className="mt-5 space-y-3.5">
                  {group.links.map((link) => {
                    const external = link.href.startsWith("http");
                    return (
                      <li key={link.label}>
                        {external ? (
                          <a
                            href={link.href}
                            className="link-rule text-graphite hover:text-ink text-[0.9375rem] transition-colors duration-300"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="link-rule text-graphite hover:text-ink text-[0.9375rem] transition-colors duration-300"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <hr className="crease mt-16 mb-8" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="t-micro max-w-[46ch]">
            Set in Instrument Serif and Inter. Made by people who argue about commas.
          </p>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="link-rule t-micro">
                {item.label}
              </Link>
            ))}
            <p className="t-micro">
              © {year} {site.wordmark}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
