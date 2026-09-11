import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AuthForm from "@/components/AuthForm";
import { site } from "@/lib/site";

const description = "Sign in to ScriptLyra to write, edit and publish your work.";

export const metadata: Metadata = {
  title: "Sign in",
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/signin" },
  openGraph: { title: `Sign in — ${site.wordmark}`, description, url: "/signin" },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <>
      <PageHeader
        head="Your desk"
        meta="Members"
        lines={["Welcome", "back."]}
        lead="Sign in to pick up a draft, edit what you have published, or start something new."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Sign in">
        <div className="max-w-[34rem]">
          <AuthForm mode="signin" next={next} />
        </div>
      </section>
    </>
  );
}
