import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AuthForm from "@/components/AuthForm";
import { site } from "@/lib/site";

const description =
  "Create a ScriptLyra account to publish your writing and keep a public profile of your work.";

export const metadata: Metadata = {
  title: "Create an account",
  description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/signup" },
  openGraph: { title: `Create an account — ${site.wordmark}`, description, url: "/signup" },
};

export default function SignUpPage() {
  return (
    <>
      <PageHeader
        head="A place to write"
        meta="New members"
        lines={["Start", "writing."]}
        lead="An account gives you a public profile and a place to write, edit and publish. It takes a minute, and there is nothing to pay."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Create an account">
        <div className="max-w-[34rem]">
          <AuthForm mode="signup" />
        </div>
      </section>
    </>
  );
}
