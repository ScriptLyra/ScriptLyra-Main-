"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { updateProfileAction, type ProfileState } from "./actions";
import type { Profile, ProfileLink } from "@/lib/types";

const initial: ProfileState = {};

/**
 * Edits the writer's public profile — the same fields the house authors carry
 * (blurb, bio, genre, based, links), so a writer's page reads like an author's.
 * Links are a small add/remove editor, serialised to a hidden field the action
 * validates.
 */
export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);
  const [links, setLinks] = useState<ProfileLink[]>(
    profile.links.length ? profile.links : [],
  );

  const setLink = (i: number, patch: Partial<ProfileLink>) =>
    setLinks((rows) => rows.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const addLink = () => setLinks((rows) => [...rows, { label: "", href: "" }]);
  const removeLink = (i: number) => setLinks((rows) => rows.filter((_, j) => j !== i));

  const cleanLinks = links.filter((l) => l.label.trim() && l.href.trim());

  return (
    <form action={formAction} className="border-rule border-t pt-10">
      <input type="hidden" name="links" value={JSON.stringify(cleanLinks)} />

      <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
        <p>
          <label htmlFor="p-name" className="field-label">
            Display name
          </label>
          <input
            id="p-name"
            name="name"
            required
            defaultValue={profile.name}
            className="field mt-2"
          />
        </p>

        <p>
          <label htmlFor="p-username" className="field-label">
            Username — your address is /writers/{profile.username || "…"}
          </label>
          <input
            id="p-username"
            name="username"
            required
            defaultValue={profile.username}
            pattern="[a-z0-9-]{3,30}"
            className="field mt-2"
          />
        </p>

        <p className="sm:col-span-2">
          <label htmlFor="p-blurb" className="field-label">
            One line — shown over your monogram
          </label>
          <input
            id="p-blurb"
            name="blurb"
            maxLength={200}
            defaultValue={profile.blurb ?? ""}
            placeholder="The sentence a reader meets first."
            className="field mt-2"
          />
        </p>

        <p>
          <label htmlFor="p-genre" className="field-label">
            What you write
          </label>
          <input
            id="p-genre"
            name="genre"
            defaultValue={profile.genre ?? ""}
            placeholder="Essays, fiction, criticism…"
            className="field mt-2"
          />
        </p>

        <p>
          <label htmlFor="p-based" className="field-label">
            Based in
          </label>
          <input
            id="p-based"
            name="based"
            defaultValue={profile.based ?? ""}
            placeholder="A city, a country"
            className="field mt-2"
          />
        </p>

        <p className="sm:col-span-2">
          <label htmlFor="p-bio" className="field-label">
            About you
          </label>
          <textarea
            id="p-bio"
            name="bio"
            rows={6}
            defaultValue={profile.bio ?? ""}
            placeholder="A paragraph or two. Leave a blank line between paragraphs."
            className="field mt-2 resize-y"
          />
        </p>

        <div className="sm:col-span-2">
          <span className="field-label">Links</span>
          <ul className="mt-3 space-y-4">
            {links.map((link, i) => (
              <li key={i} className="flex items-center gap-3">
                <input
                  aria-label="Link label"
                  value={link.label}
                  onChange={(e) => setLink(i, { label: e.target.value })}
                  placeholder="Label"
                  className="field flex-1"
                />
                <input
                  aria-label="Link URL"
                  value={link.href}
                  onChange={(e) => setLink(i, { href: e.target.value })}
                  placeholder="https:// or /path"
                  className="field flex-[2]"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="text-graphite hover:text-ink grid size-8 shrink-0 place-items-center transition-colors"
                  aria-label="Remove link"
                >
                  <X size={16} strokeWidth={1.25} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={addLink}
            className="link-rule mt-4 inline-flex items-center gap-2 text-[0.9375rem]"
          >
            <Plus size={15} strokeWidth={1.5} aria-hidden="true" /> Add a link
          </button>
        </div>
      </div>

      {state.error ? (
        <p role="alert" className="t-micro text-ink border-ink/20 mt-8 border-l-2 pl-4">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p role="status" className="t-micro mt-8">
          Saved. Your profile is live.
        </p>
      ) : null}

      <div className="mt-10">
        <button type="submit" className="btn btn-ink" disabled={pending}>
          <span>{pending ? "Saving…" : "Save profile"}</span>
        </button>
      </div>
    </form>
  );
}
