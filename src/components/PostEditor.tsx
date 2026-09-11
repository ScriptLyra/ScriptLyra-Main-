"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  savePostAction,
  publishPostAction,
  unpublishPostAction,
  deletePostAction,
  type PostState,
} from "@/app/write/actions";
import Markdown from "@/components/Markdown";
import { readingMinutes } from "@/lib/markdown";
import { POST_KINDS, type Post } from "@/lib/types";

const initial: PostState = {};

/**
 * The composing surface. Title, standfirst and kind sit above a Markdown body
 * with a Write / Preview toggle; the preview renders through the very same
 * Markdown component the public page uses, so nothing shifts on publish.
 *
 * Saving keeps a draft. Publishing, unpublishing and deleting are separate
 * server actions on the last saved version — the small print says so.
 */
export default function PostEditor({
  post,
  username,
}: {
  post?: Post;
  username?: string;
}) {
  const [state, formAction, pending] = useActionState(savePostAction, initial);
  const [title, setTitle] = useState(post?.title ?? "");
  const [standfirst, setStandfirst] = useState(post?.standfirst ?? "");
  const [kind, setKind] = useState(post?.kind ?? "Essay");
  const [body, setBody] = useState(post?.body_md ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  const published = post?.status === "published";
  const minutes = readingMinutes(body);

  return (
    <div className="border-rule border-t pt-10">
      {/* Status line */}
      <div className="t-micro flex flex-wrap items-baseline justify-between gap-4">
        <span>
          {post ? (published ? "Published" : "Draft") : "New draft"}
          <span className="text-graphite"> · {minutes} min read</span>
        </span>
        {published && username && post ? (
          <Link href={`/blog/${username}/${post.slug}`} className="link-rule text-ink">
            View public page
          </Link>
        ) : null}
      </div>

      <form action={formAction} className="mt-8 grid gap-x-10 gap-y-9">
        {post ? <input type="hidden" name="id" value={post.id} /> : null}

        <p>
          <label htmlFor="w-title" className="field-label">
            Title
          </label>
          <input
            id="w-title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="field mt-2"
          />
        </p>

        <p>
          <label htmlFor="w-standfirst" className="field-label">
            Standfirst — the line under the title
          </label>
          <input
            id="w-standfirst"
            name="standfirst"
            value={standfirst}
            onChange={(e) => setStandfirst(e.target.value)}
            maxLength={280}
            className="field mt-2"
          />
        </p>

        <p className="max-w-[16rem]">
          <label htmlFor="w-kind" className="field-label">
            Kind
          </label>
          <select
            id="w-kind"
            name="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="field mt-2 cursor-pointer appearance-none"
          >
            {POST_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </p>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="field-label">Body — Markdown</span>
            <span className="border-rule inline-flex overflow-hidden rounded-full border text-[0.8125rem]">
              <button
                type="button"
                onClick={() => setTab("write")}
                className={`px-4 py-1.5 transition-colors ${tab === "write" ? "bg-ink text-paper" : "hover:bg-leaf"}`}
                aria-pressed={tab === "write"}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`px-4 py-1.5 transition-colors ${tab === "preview" ? "bg-ink text-paper" : "hover:bg-leaf"}`}
                aria-pressed={tab === "preview"}
              >
                Preview
              </button>
            </span>
          </div>

          {/* The textarea stays mounted (name=body_md) so its value posts even
              while the preview is showing. */}
          <textarea
            id="w-body"
            name="body_md"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            placeholder="Write in Markdown. A blank line starts a new paragraph; ## makes a heading; > makes a quote."
            className={`editor-field ${tab === "preview" ? "hidden" : ""}`}
          />

          {tab === "preview" ? (
            <div className="border-rule min-h-[20rem] border p-6 sm:p-8">
              {body.trim() ? (
                <Markdown>{body}</Markdown>
              ) : (
                <p className="t-body text-graphite">Nothing to preview yet.</p>
              )}
            </div>
          ) : null}
        </div>

        {state.error ? (
          <p role="alert" className="t-micro text-ink border-ink/20 border-l-2 pl-4">
            {state.error}
          </p>
        ) : null}
        {state.ok ? (
          <p role="status" className="t-micro">
            Saved.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-ink" disabled={pending}>
            <span>{pending ? "Saving…" : "Save draft"}</span>
          </button>
          {post ? (
            <Link href="/dashboard" className="link-rule text-[0.9375rem]">
              Done for now
            </Link>
          ) : null}
        </div>
      </form>

      {/* Publish / unpublish / delete act on the last saved version. */}
      {post ? (
        <div className="border-rule mt-12 border-t pt-8">
          <p className="t-micro text-graphite mb-5 max-w-[52ch]">
            Publishing makes the last saved version public at your address. Save first if you
            have unsaved edits above.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {published ? (
              <form action={unpublishPostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="btn btn-outline">
                  <span>Unpublish</span>
                </button>
              </form>
            ) : (
              <form action={publishPostAction}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit" className="btn btn-ink">
                  <span>Publish</span>
                </button>
              </form>
            )}

            <form
              action={deletePostAction}
              onSubmit={(e) => {
                if (!confirm("Delete this post? This cannot be undone.")) e.preventDefault();
              }}
            >
              <input type="hidden" name="id" value={post.id} />
              <button type="submit" className="link-rule text-graphite hover:text-ink text-[0.9375rem]">
                Delete
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
