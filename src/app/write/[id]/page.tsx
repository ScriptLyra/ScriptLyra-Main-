import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import PostEditor from "@/components/PostEditor";
import { requireProfile } from "@/lib/auth";
import { myPostById } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

type Params = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Params) {
  const profile = await requireProfile();
  const { id } = await params;
  const post = await myPostById(id);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        head="The desk"
        meta={post.status === "published" ? "Editing — published" : "Editing — draft"}
        lines={["Edit", "your piece."]}
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Edit post">
        <div className="max-w-[52rem]">
          <PostEditor post={post} username={profile.username} />
        </div>
      </section>
    </>
  );
}
