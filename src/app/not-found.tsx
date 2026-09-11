import Link from "next/link";
import Button from "@/components/Button";
import OrigamiBird from "@/components/OrigamiBird";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="grain-paper relative" data-nav-tone="ink">
      <div className="above-grain shell flex min-h-[80svh] flex-col justify-center py-28">
        <OrigamiBird className="text-ink w-[5.5rem]" delay={0.1} />

        <h1 className="t-display-l mt-12 max-w-[20ch]">This page is not on the list.</h1>

        <p className="t-body text-graphite mt-7">
          The address may have changed, or the book may have gone out of print. The
          catalogue is a better place to start.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-7">
          <Button href="/books" variant="ink">
            Browse the list
          </Button>
          <Link href="/" className="link-rule text-[0.9375rem]">
            Back to the beginning
          </Link>
        </div>
      </div>
    </section>
  );
}
