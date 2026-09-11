export const site = {
  name: "ScriptLyra",
  wordmark: "ScriptLyra™",
  url: "https://scriptlyra.com",
  tagline: "Where stories find their voice.",
  description:
    "ScriptLyra is a modern publishing platform for discovering, creating, and publishing stories worth remembering.",
};

export const primaryNav = [
  { label: "Explore", href: "/explore" },
  { label: "Books", href: "/books" },
  { label: "Authors", href: "/authors" },
  { label: "Publish", href: "/publish" },
  { label: "Stories", href: "/stories" },
  { label: "Blog", href: "/blog" },
];

export const footerNav: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Read",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Books", href: "/books" },
      { label: "Authors", href: "/authors" },
      { label: "The Journal", href: "/stories" },
      { label: "The Blog", href: "/blog" },
      { label: "Writers", href: "/writers" },
    ],
  },
  {
    heading: "Write",
    links: [
      { label: "Publish with us", href: "/publish" },
      { label: "How publishing works", href: "/publish#how" },
      { label: "Submit a manuscript", href: "/publish#submit" },
      { label: "Write a post", href: "/write" },
    ],
  },
  {
    heading: "House",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "X", href: "https://x.com" },
      { label: "YouTube", href: "https://youtube.com" },
    ],
  },
];

export const legalNav = [
  { label: "Privacy", href: "/about#privacy" },
  { label: "Terms", href: "/about#terms" },
  { label: "Copyright", href: "/about#copyright" },
];

/** The homepage read as a set book: each passage carries a folio. */
export const folios = {
  hero: { n: "01", head: "Beginning" },
  world: { n: "02", head: "The house" },
  books: { n: "03", head: "The list" },
  authors: { n: "04", head: "Voices" },
  publish: { n: "05", head: "Making a book" },
  journal: { n: "06", head: "The Journal" },
  close: { n: "07", head: "Colophon" },
};
