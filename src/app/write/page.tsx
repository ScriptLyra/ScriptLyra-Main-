import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PostEditor from "@/components/PostEditor";
import { requireProfile } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Write a post",
  robots: { index: false, follow: false },
};

export default async function WritePage() {
  // Guarantees a session and a profile (the middleware guards, this confirms).
  await requireProfile();

  return (
    <>
      <PageHeader
        head="The desk"
        meta="New piece"
        lines={["Write", "something."]}
        lead="Markdown in, a published piece out. Save as often as you like; publish when it is ready."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Write a post">
        <div className="max-w-[52rem]">
          <PostEditor />
        </div>
      </section>
    </>
  );
}
