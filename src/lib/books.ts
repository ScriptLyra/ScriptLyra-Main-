export type CoverDesign =
  | "silent-city"
  | "grammar-of-rain"
  | "unsent"
  | "cartographer"
  | "plain";

export type Book = {
  slug: string;
  /** Catalogue number. These are a real sequence — a publisher’s list. */
  index: string;
  title: string;
  line: string;
  author: string;
  authorSlug: string;
  genre: string;
  published: string;
  year: string;
  pages: number;
  isbn: string;
  ground: "ink" | "paper" | "leaf";
  design: CoverDesign;
  description: string[];
  contents: { n: string; title: string }[];
  excerpt: string[];
  reviews: { quote: string; source: string }[];
  featured?: boolean;
};

export const books: Book[] = [
  {
    slug: "the-silent-city",
    index: "01",
    title: "The Silent City",
    line: "Some stories are found. Others find you.",
    author: "Ilya Marren",
    authorSlug: "ilya-marren",
    genre: "Literary fiction",
    published: "2026-03-17",
    year: "2026",
    pages: 328,
    isbn: "978-1-9998-0141-2",
    ground: "ink",
    design: "silent-city",
    featured: true,
    description: [
      "For eleven years the city of Vares has not made a sound. No sirens, no bells, no argument carried up from a courtyard. The residents go on living, and they go on refusing to explain.",
      "A sound archivist arrives to record what is left, and finds that silence is not an absence but a decision — one the city renews every morning. What she assembles is less a record than a confession.",
    ],
    contents: [
      { n: "i", title: "An inventory of quiet things" },
      { n: "ii", title: "The last recorded argument" },
      { n: "iii", title: "Twelve doors, none of them locked" },
      { n: "iv", title: "What the river kept" },
      { n: "v", title: "Vares, in the ordinary sense" },
    ],
    excerpt: [
      "The first thing you notice about Vares is not the silence. It is how ordinary everyone is inside it — a butcher wrapping paper, a boy counting steps, a woman deciding against an umbrella.",
      "I set the recorder on the parapet and let it run for forty minutes. When I played it back that evening there was wind, and under the wind, faintly, the sound of a city holding its breath on purpose.",
      "You cannot archive a decision. I have tried. What I have instead is eleven years of people agreeing, every single morning, not to say the thing.",
    ],
    reviews: [
      {
        quote:
          "Marren writes cities the way other novelists write difficult relatives — with exhausted, unbreakable love.",
        source: "The Paper Review",
      },
      {
        quote: "A novel that earns its quiet. Not a syllable is wasted.",
        source: "Fold Quarterly",
      },
    ],
  },
  {
    slug: "a-grammar-of-rain",
    index: "02",
    title: "A Grammar of Rain",
    line: "She wrote the weather until it answered.",
    author: "Nadia Okonjo",
    authorSlug: "nadia-okonjo",
    genre: "Poetry",
    published: "2025-11-04",
    year: "2025",
    pages: 96,
    isbn: "978-1-9998-0142-9",
    ground: "paper",
    design: "grammar-of-rain",
    featured: true,
    description: [
      "Sixty-one poems that treat weather as a language with tenses, moods and a subjunctive. Rain gets conjugated. A dry season is parsed for what it will not say.",
      "Okonjo grew up between Lagos and Leeds, and this collection keeps both climates in the same mouth. The result is a book about translation that never once uses the word.",
    ],
    contents: [
      { n: "i", title: "Present continuous" },
      { n: "ii", title: "Conditional" },
      { n: "iii", title: "Subjunctive, for a dry year" },
      { n: "iv", title: "Imperative" },
    ],
    excerpt: [
      "Say it began in the plural.\nSay the roof learned first, then the gutter,\nthen the argument in the kitchen\nthat stopped to listen.",
      "There is a tense for weather you expect\nand a tense for weather that arrives\nlike a letter you already answered\nyears ago, badly.",
    ],
    reviews: [
      {
        quote:
          "Okonjo has invented a grammar and then written fluently in it, which is the only convincing kind of invention.",
        source: "The Paper Review",
      },
    ],
  },
  {
    slug: "everything-we-left-unsent",
    index: "03",
    title: "Everything We Left Unsent",
    line: "Four hundred letters. Not one of them mailed.",
    author: "Theo Vance",
    authorSlug: "theo-vance",
    genre: "Epistolary fiction",
    published: "2026-01-22",
    year: "2026",
    pages: 274,
    isbn: "978-1-9998-0143-6",
    ground: "leaf",
    design: "unsent",
    featured: true,
    description: [
      "A house clearance turns up four hundred letters, all addressed, all stamped, none posted. They span thirty-one years and two people who saw each other most weeks.",
      "Vance arranges them without commentary and lets the gaps do the work. What emerges is a portrait of everything a person will write down precisely because they intend never to say it.",
    ],
    contents: [
      { n: "i", title: "1968–1974" },
      { n: "ii", title: "The years with no letters" },
      { n: "iii", title: "1981–1990" },
      { n: "iv", title: "Two drafts of the same apology" },
      { n: "v", title: "1999" },
    ],
    excerpt: [
      "14 March. I have written this four times and each version is kinder than the truth, so I am keeping the fourth and sending none of them.",
      "You asked at dinner whether I minded. I said no in the voice I use for that, and you accepted it in the voice you use for that, and we cleared the plates.",
      "There is a shelf in the hall cupboard. If you are reading this, you have found the shelf, and I am no longer in a position to be embarrassed.",
    ],
    reviews: [
      {
        quote:
          "Devastating by arrangement alone. Vance edits like a surgeon and disappears like a good one.",
        source: "Fold Quarterly",
      },
      {
        quote: "The best novel about the postal service ever written without a single delivery.",
        source: "Marginalia",
      },
    ],
  },
  {
    slug: "the-cartographers-apology",
    index: "04",
    title: "The Cartographer’s Apology",
    line: "Every map is an argument about what matters.",
    author: "Rosalind Ferrier",
    authorSlug: "rosalind-ferrier",
    genre: "Essays",
    published: "2025-09-09",
    year: "2025",
    pages: 212,
    isbn: "978-1-9998-0144-3",
    ground: "ink",
    design: "cartographer",
    featured: true,
    description: [
      "Nine essays on maps and the people who drew them, and on the quiet violence of deciding which villages are large enough to name.",
      "Ferrier is interested less in what maps get wrong than in what they were built to be confident about. She takes the same interest in museums, indexes, and the word 'neutral'.",
    ],
    contents: [
      { n: "i", title: "On being large enough to name" },
      { n: "ii", title: "The confident blank" },
      { n: "iii", title: "Scale, and who pays for it" },
      { n: "iv", title: "An apology, with contours" },
    ],
    excerpt: [
      "A map does not lie. Lying requires an alternative in mind. A map simply declines, at scale, to consider you.",
      "The cartographers I admire most are the ones who left a margin note. Not a correction — a hesitation. Here the surveyor was tired. Here the river moved and we did not go back.",
    ],
    reviews: [
      {
        quote: "Ferrier argues with objects, and the objects lose.",
        source: "The Paper Review",
      },
    ],
  },
  {
    slug: "small-hours-atlas",
    index: "05",
    title: "Small Hours Atlas",
    line: "A record of everywhere she went at four in the morning.",
    author: "Nadia Okonjo",
    authorSlug: "nadia-okonjo",
    genre: "Short stories",
    published: "2024-06-11",
    year: "2024",
    pages: 188,
    isbn: "978-1-9998-0139-9",
    ground: "leaf",
    design: "plain",
    description: [
      "Fourteen stories set entirely between three and five in the morning, in kitchens, night buses, hospital corridors and one very well-lit petrol station.",
    ],
    contents: [
      { n: "i", title: "Night bus, the 43" },
      { n: "ii", title: "Petrol station, fully lit" },
      { n: "iii", title: "Corridor, fourth floor" },
    ],
    excerpt: [
      "At four in the morning a kitchen is a different room. The same chairs, but they have stopped pretending to be furniture.",
    ],
    reviews: [
      { quote: "Okonjo can make a bus timetable feel like a confession.", source: "Marginalia" },
    ],
  },
  {
    slug: "the-index-of-forgetting",
    index: "06",
    title: "The Index of Forgetting",
    line: "He alphabetised what he could not keep.",
    author: "Ilya Marren",
    authorSlug: "ilya-marren",
    genre: "Literary fiction",
    published: "2023-10-05",
    year: "2023",
    pages: 402,
    isbn: "978-1-9998-0128-3",
    ground: "paper",
    design: "plain",
    description: [
      "A retired indexer begins compiling an index to his own life, and discovers that alphabetical order is the cruellest possible arrangement of a marriage.",
    ],
    contents: [
      { n: "i", title: "A–D" },
      { n: "ii", title: "E–L, with omissions" },
      { n: "iii", title: "M–Z" },
    ],
    excerpt: [
      "An index promises that everything can be found again. It is the most optimistic document a person can produce, and I have produced two hundred of them.",
    ],
    reviews: [
      {
        quote: "Formally daring and quietly wrecking. Marren’s best before The Silent City.",
        source: "Fold Quarterly",
      },
    ],
  },
];

export const featuredBooks = books.filter((b) => b.featured);

export function bookBySlug(slug: string) {
  return books.find((b) => b.slug === slug);
}

export function booksByAuthor(authorSlug: string) {
  return books.filter((b) => b.authorSlug === authorSlug);
}
