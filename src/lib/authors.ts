export type Author = {
  slug: string;
  name: string;
  initials: string;
  genre: string;
  publications: number;
  /** One line, shown when a bookplate is opened. */
  blurb: string;
  based: string;
  since: string;
  bio: string[];
  links: { label: string; href: string }[];
};

export const authors: Author[] = [
  {
    slug: "ilya-marren",
    name: "Ilya Marren",
    initials: "IM",
    genre: "Literary fiction",
    publications: 3,
    blurb: "Writes cities as though they were relatives who stopped speaking.",
    based: "Tallinn",
    since: "2019",
    bio: [
      "Ilya Marren worked for nine years as a sound engineer for public radio before publishing anything, and it shows: his novels are built out of what people do instead of talking.",
      "He writes in longhand, in a notebook per chapter, and has said in interview that he throws away the first notebook every time on principle. Three novels so far, each one set in a city that does not exist and is recognisable anyway.",
    ],
    links: [
      { label: "Journal", href: "/stories" },
      { label: "Reading list", href: "/explore" },
    ],
  },
  {
    slug: "nadia-okonjo",
    name: "Nadia Okonjo",
    initials: "NO",
    genre: "Poetry and short stories",
    publications: 5,
    blurb: "Lagos-born, Leeds-raised. Makes the weather do the talking.",
    based: "Lagos and Leeds",
    since: "2016",
    bio: [
      "Nadia Okonjo writes poems that behave like grammar exercises and short stories that behave like weather reports. She is the author of five collections, including A Grammar of Rain.",
      "She teaches a workshop on translation for writers who only speak one language, which is exactly as useful as it sounds, and runs a reading series out of a former launderette.",
    ],
    links: [
      { label: "Journal", href: "/stories" },
      { label: "Reading series", href: "/explore" },
    ],
  },
  {
    slug: "theo-vance",
    name: "Theo Vance",
    initials: "TV",
    genre: "Epistolary fiction",
    publications: 2,
    blurb: "Collects other people’s letters. Returns them as novels.",
    based: "Bristol",
    since: "2021",
    bio: [
      "Theo Vance buys other people’s correspondence at house clearances and estate sales, and has done since he was nineteen. Two novels have come out of the boxes so far.",
      "He describes his method as arrangement rather than writing, which is modest to the point of being inaccurate — the arrangement is the writing, and he is very good at it.",
    ],
    links: [{ label: "Journal", href: "/stories" }],
  },
  {
    slug: "rosalind-ferrier",
    name: "Rosalind Ferrier",
    initials: "RF",
    genre: "Essays and criticism",
    publications: 7,
    blurb: "Argues with maps, museums, and the idea of neutral ground.",
    based: "Edinburgh",
    since: "2011",
    bio: [
      "Rosalind Ferrier has written seven books of essays on the things institutions treat as settled: indexes, wall labels, borders, the standard metre.",
      "She spent four years as a picture researcher, which she credits for her suspicion of captions. She writes a monthly column for the ScriptLyra Journal.",
    ],
    links: [
      { label: "Journal column", href: "/stories" },
      { label: "Essays", href: "/explore" },
    ],
  },
];

export function authorBySlug(slug: string) {
  return authors.find((a) => a.slug === slug);
}
