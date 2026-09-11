import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ProfileForm from "./ProfileForm";
import { requireProfile } from "@/lib/auth";
import { normalizeLinks } from "@/lib/profiles";

export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const profile = await requireProfile();
  const clean = { ...profile, links: normalizeLinks(profile.links) };

  return (
    <>
      <PageHeader
        head="Your profile"
        meta="Members"
        lines={["How readers", "meet you."]}
        lead="This is your public page. What you put here appears on your profile and beside everything you publish."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Edit profile">
        <div className="max-w-[46rem]">
          <p className="t-micro mb-8">
            <Link href={`/writers/${profile.username}`} className="link-rule text-ink">
              View your public page
            </Link>
            <span className="text-graphite"> · </span>
            <Link href="/dashboard" className="link-rule">
              Back to your writing
            </Link>
          </p>

          <ProfileForm profile={clean} />
        </div>
      </section>
    </>
  );
}
