<div align="center">
  <img src="public/brand/logo-lockup.png" alt="ScriptLyra" width="300" />

  <br />
  <br />

  **Where stories find their voice.**
  
  *A publishing house on the web: one design system, black and white only — now with accounts, writer profiles, and a blog anyone with an account can publish to.*

  <br />

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🚀 Getting Started

ScriptLyra requires **Node 18.18 or newer**. The marketing site runs with no configuration out of the box.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
# The site will be available at http://localhost:3000
```

### Production Build

```bash
npm run typecheck  # Type checking: tsc --noEmit
npm run build      # Create a production build
npm start          # Serve the production build
```

---

## 📖 Accounts and the Blog

The catalogue (books, authors, the Journal) is static content in `src/lib` and needs nothing. Everything a *reader* can join — signing up, a public writer profile at `/writers/[username]`, and posting to `/blog` — is backed by **Supabase** (hosted Postgres, Auth and Row Level Security). 

No custom server is needed: the browser and the server components talk to Supabase directly, always as the signed-in user.

### Setup (about five minutes):

1. **Create a project** at [supabase.com](https://supabase.com).
2. **Run Migrations:** Open the SQL editor and run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql). It creates the `profiles` and `posts` tables, the RLS policies, and a trigger that makes a profile row for every new sign-up.
3. **Configure Auth:** In **Authentication → URL configuration**, set the site URL to `http://localhost:3000` and add `/auth/confirm` and `/auth/callback` as redirect URLs.
4. **Environment Variables:** Copy `.env.example` to `.env.local` and fill in the project URL and the **anon** key (Project settings → API):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   ```
5. **Publish your first post:** `npm run dev`, then: sign up → confirm from the email → `/dashboard/profile` → `/write` → publish. The post appears on `/blog` and on your `/writers` page.

### 🛡️ Security Posture
Only the public anon key is ever used — the `service_role` key is **never** added to this project. Every read and write goes through RLS: a writer sees their own drafts and nobody else's, and can only edit their own posts. Rendered Markdown does **not** allow raw HTML, preventing script injection.

### ⚡ Static stays static
Only `/blog`, `/writers`, `/dashboard`, `/write` and the auth routes read the session and render dynamically. The shared layout never touches cookies, so `/`, `/books/*`, `/authors/*`, `/explore`, and `/stories` are completely prerendered.

---

## 🎨 The Design System

Five values, no sixth. They live as `@theme` tokens at the top of `src/app/globals.css`, available as Tailwind utilities (`bg-ink`, `text-graphite`, `border-rule`).

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `ink` | <img src="https://placehold.co/15x15/000000/000000.png" width="12" /> `#000000` | True black. Type, rules, inverted sections |
| `paper` | <img src="https://placehold.co/15x15/FFFFFF/FFFFFF.png" width="12" /> `#FFFFFF` | The page background |
| `leaf` | <img src="https://placehold.co/15x15/F7F7F5/F7F7F5.png" width="12" /> `#F7F7F5` | Warmer sheet, for alternating bands |
| `graphite`| <img src="https://placehold.co/15x15/8A8A8A/8A8A8A.png" width="12" /> `#8A8A8A` | Secondary text |
| `rule` | <img src="https://placehold.co/15x15/EAEAEA/EAEAEA.png" width="12" /> `#EAEAEA` | Hairlines |

### 🖋️ Typography

Two typefaces, loaded via `next/font/google`:
- **Instrument Serif** (`font-display`): Every headline, every numeral, the quotes, the book covers. *The voice of the house.*
- **Inter** (`font-sans`): Interface, body copy, forms. *Stays out of the way.*

Type is set through semantic named classes (e.g. `t-display-l`, `t-body`, `t-quote`) using `clamp()`, ensuring fluid scaling without responsive overrides.

---

## 🏗️ Structure

```text
src/
  app/
    layout.tsx          # fonts, metadata, the chrome, JSON-LD
    page.tsx            # the homepage: eight passages
    globals.css         # tokens, type scale, component classes
    books/              # the catalogue & read extracts
    authors/            # curated house list and profiles
    explore/            # filterable index
    (auth)/             # signup, signin, server actions
    writers/            # dynamic directory and public profiles
    blog/               # published feed & specific posts
    write/              # Markdown editor
    dashboard/          # a writer's own posts
  components/           # motion primitives, PostEditor, chrome...
  lib/
    books.ts            # 6 titles, covers, extracts, contents
    authors.ts          # 4 house writers
    supabase/           # browser, server and middleware clients
  middleware.ts         # session refresh, route guards
supabase/
  migrations/           # tables, RLS, triggers
```

Static content is data, not markup. Adding a new book means adding one object to `src/lib/books.ts`.

---

## ✨ Motion & Accessibility

- **Motion:** Handled purely by `motion` (Framer Motion) and `lenis` for smooth scrolling. `MotionProvider` defaults to OS-level preferences (`reducedMotion="user"`).
- **Accessibility:** Semantic HTML elements are used throughout (`<dl>`, `<ol>`, `<address>`). Features include visible custom focus rings, ARIA roles, skip links, and a custom cursor that gracefully falls back for touch and keyboard users.
- **SEO:** Per-route metadata, auto-generated sitemap including dynamic user posts, and extensive JSON-LD structured data.

---

## 🔒 What is not wired up

- **Marketing forms** (submission, contact, newsletter) validate and acknowledge but do not send data anywhere.
- **Search** filters local content, but doesn't index user posts yet.
- **Portraits** are monogram bookplates by design, not placeholders for photographs.
- **Moderation**: Posts publish immediately with no review queue.

---

<div align="center">
  <sub>ScriptLyra © 2024. All copy, books, and authors listed are fictional.</sub>
</div>
