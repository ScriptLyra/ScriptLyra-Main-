# ScriptLyra™

Where stories find their voice.

A publishing house on the web: one design system, black and white only — now with
accounts, writer profiles, and a blog anyone with an account can publish to.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run typecheck  # tsc --noEmit
npm run build      # production build
npm start          # serve the build
```

Node 18.18 or newer. The marketing site runs with no configuration. Accounts and the
blog need Supabase — see [Accounts and the blog](#accounts-and-the-blog).

## Accounts and the blog

The catalogue (books, authors, the Journal) is static content in `src/lib` and needs
nothing. Everything a *reader* can join — signing up, a public writer profile at
`/writers/[username]`, and posting to `/blog` — is backed by **Supabase** (hosted
Postgres, Auth and Row Level Security). No custom server: the browser and the server
components talk to Supabase directly, always as the signed-in user.

**Setup (about five minutes):**

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   It creates the `profiles` and `posts` tables, the RLS policies, and a trigger that
   makes a profile row for every new sign-up.
3. In **Authentication → URL configuration**, set the site URL to `http://localhost:3000`
   and add `/auth/confirm` and `/auth/callback` as redirect URLs.
4. Copy `.env.example` to `.env.local` and fill in the project URL and the **anon** key
   (Project settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   ```

5. `npm run dev`, then: sign up → confirm from the email → `/dashboard/profile` →
   `/write` → publish. The post appears on `/blog` and on your `/writers` page.

**Security posture.** Only the public anon key is ever used — the `service_role` key is
never added to this project. Every read and write goes through RLS: a writer sees their
own drafts and nobody else's, and can only edit their own posts. The server actions
re-check ownership on top of RLS, not instead of it. Rendered Markdown does **not** allow
raw HTML (`react-markdown` without `rehype-raw`), so a post cannot inject script.

**Static stays static.** Only `/blog`, `/writers`, `/dashboard`, `/write` and the auth
routes read the session and render dynamically. The chrome learns whether you are signed
in from `AccountMenu`, a client component — the shared layout never touches cookies, so
`/`, `/books/*`, `/authors/*`, `/explore`, `/stories` and the rest are still prerendered.

## The design system

Five values, no sixth. They live as `@theme` tokens at the top of `src/app/globals.css`,
so they are available as Tailwind utilities (`bg-ink`, `text-graphite`, `border-rule`).

| Token      | Value     | What it is                                    |
| ---------- | --------- | --------------------------------------------- |
| `ink`      | `#000000` | True black. Type, rules, the inverted sections |
| `paper`    | `#FFFFFF` | The page                                       |
| `leaf`     | `#F7F7F5` | A second, warmer sheet, for alternating bands  |
| `graphite` | `#8A8A8A` | Secondary text, only ever secondary            |
| `rule`     | `#EAEAEA` | Hairlines                                      |

Two typefaces, both loaded from `next/font/google` in `src/app/layout.tsx`:

- **Instrument Serif** — `font-display`. Every headline, every numeral, the quotes,
  the book covers. It is the voice of the house.
- **Inter** — `font-sans`. Interface, body copy, forms. It stays out of the way.

To swap Inter for Geist, change two lines in `layout.tsx`: the import
(`import { Geist } from "next/font/google"`) and the call. The `--font-sans`
variable and every utility built on it keep working.

Type is set through named classes rather than ad-hoc sizes, so the scale holds
across all fifty-odd files: `t-display-l`, `t-display-m`, `t-display-s`, `t-lead`,
`t-body`, `t-body-serif`, `t-quote`, `t-folio`, `t-numeral`, `t-micro`. All are
defined once in `globals.css` and all use `clamp()`, so there are almost no
responsive type overrides in the components.

### The devices

Five things do the structural work, in place of the usual card-and-eyebrow kit:

- **Folios** (`Folio.tsx`) — a serif numeral and an italic running head, the way a
  book marks a section. Homepage passages carry them; inside pages pass `folio={null}`.
- **Creases** (`.crease`) — a hairline that fades out at both ends, like a fold rather
  than a border.
- **Grain** (`.grain-paper`, `.grain-ink`, `.above-grain`) — a 110px tile at low
  opacity, so the black is not a flat screen black. Content sits in `.above-grain`.
- **Covers** (`BookCover.tsx`) — typographic, drawn in the browser, no images. They use
  a CSS container query, so one design holds from a 48px index thumbnail to a
  half-screen showcase panel.
- **Plates** — an author's monogram struck into a flyleaf, in place of a headshot.

### The one orchestrated moment

`PublishTimeline.tsx` draws a rule down the margin at reading speed, marking off the
five stages of making a book. That is the only scroll-driven animation on the page;
everything else is a short reveal on entry or a response to something you did.

Numbers appear in exactly two places, because in both the content genuinely is a
sequence: the publishing stages (01–05) and the catalogue numbers on the books.

## Structure

```
src/
  app/
    layout.tsx          fonts, metadata, the chrome, JSON-LD organisation node
    page.tsx            the homepage: eight passages
    globals.css         tokens, type scale, component classes — the whole system
    books/              the list, a title, and an extract to read
    authors/            the curated house list and a profile
    explore/            one filterable index of everything
    publish/  about/  contact/  stories/
    (auth)/             /signup, /signin, and their server actions
    auth/               confirm + callback route handlers (email links, OAuth)
    writers/            the dynamic directory and public writer pages
    blog/               the published feed and /blog/[username]/[slug]
    write/              the Markdown editor: new post and /write/[id]
    dashboard/          a writer's own posts, and /dashboard/profile
    sitemap.ts  robots.ts  not-found.tsx  icon.svg
  components/           the chrome, the motion primitives, AccountMenu, PostEditor…
  lib/
    books.ts            6 titles, with covers, extracts, contents, notices
    authors.ts          4 writers (the static house list)
    journal.ts          5 pieces
    site.ts             wordmark, tagline, navigation, folios
    schema.ts           structured data builders
    types.ts            the Supabase row shapes (Profile, Post, …)
    supabase/           the browser, server and middleware clients
    auth.ts  profiles.ts  posts.ts  markdown.ts  initials.ts
  middleware.ts         refreshes the session, guards /dashboard and /write
supabase/
  migrations/0001_init.sql   tables, RLS policies, the new-user trigger
```

Static content is data, not markup. Adding a seventh book means one object in
`src/lib/books.ts`; it then appears in the catalogue, the index, the author's page,
the sitemap and the structured data without another edit. Blog posts and writer
profiles are the same idea, one table further out: rows in Supabase, rendered by the
same components.

## Motion

`motion` (the successor to Framer Motion) and `lenis`, nothing else.

`MotionProvider` sets `reducedMotion="user"` once, at the root, so every animation in
the tree respects the operating-system setting without each component remembering to.
Components that would still do something under that setting — the loader, the cursor,
the reading rule, the floating bird — check `useReducedMotion()` and return early or
render their finished state. `SmoothScroll` does not initialise Lenis at all when
reduced motion is on, because the browser's native scrolling is then the correct
behaviour.

## Accessibility

Semantic elements throughout: the catalogue is a `<table>` with an `sr-only` caption,
facts are `<dl>`s, the publishing stages are an `<ol>`, addresses are `<address>`.
One `<h1>` per page. A skip link above the navbar. Visible focus rings that use the
ink colour rather than the browser default. Filters expose `aria-pressed`, result
counts are `role="status"`, and the file input in the submission form is a real
focusable input behind a styled label. The custom cursor is a ring that never
replaces the system cursor for keyboard or touch users.

## SEO

Per-route `metadata` with canonical URLs and Open Graph and X card overrides, an
`async sitemap.ts` that lists the static routes and then appends published posts and
their writers from Supabase, `robots.ts`, and structured data for `Book`, `Person`,
`BlogPosting`, `ItemList`, `BreadcrumbList`, `ContactPage` and `AboutPage` assembled
through `src/lib/schema.ts` into one `@graph` per page. Drafts carry `noindex` and are
kept out of the sitemap and structured data.

Set the production origin in `src/lib/site.ts` (`url`) before deploying — `metadataBase`,
every canonical, the sitemap and every schema `@id` are derived from it.

## What is not wired up

The blog, accounts and writer profiles are wired up — see
[Accounts and the blog](#accounts-and-the-blog). What remains deliberately inert:

- **The three marketing forms** — submission, contact, newsletter — validate and then
  acknowledge. Nothing is sent anywhere. Each one says what would happen next rather
  than pretending to have delivered. Point them at an API route or a form service
  when there is somewhere to point them. (Sign-up and post publishing are separate,
  and do talk to Supabase.)
- **Search** (`SearchOverlay.tsx`) filters the local content in `src/lib`. It does not
  yet index user posts — that is a separate job for when the blog grows.
- **Portraits** are monogram bookplates by design, for the static authors and the
  registered writers alike — not placeholders for photographs. The colophon on `/about`
  says so out loud. Swapping in real photography means changing `plate` in `globals.css`
  and the plate markup in `AuthorsSection.tsx`, `authors/[slug]/page.tsx` and the
  `/writers` pages.
- **Moderation.** Posts publish immediately, with no review queue — the chosen model.
  RLS keeps writers to their own work; it does not screen content.

## Licence

The ScriptLyra logo is the client's mark and is used unmodified. The copy, the six
books, the four authors, the five Journal pieces and the Edinburgh address are
written for this build and are fiction.
