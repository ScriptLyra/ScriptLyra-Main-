export type Story = {
  slug: string;
  kind: string;
  title: string;
  standfirst: string;
  author: string;
  readingTime: string;
  date: string;
  featured?: boolean;
};

export const stories: Story[] = [
  {
    slug: "worth-remembering",
    kind: "Essay",
    title: "The art of writing something worth remembering.",
    standfirst:
      "Memorable prose is not decorated prose. It is prose that has decided what it is willing to lose.",
    author: "Rosalind Ferrier",
    readingTime: "12 min",
    date: "2026-08-28",
    featured: true,
  },
  {
    slug: "first-sentence",
    kind: "On craft",
    title: "What a first sentence owes the reader",
    standfirst: "Not a hook. A contract.",
    author: "Ilya Marren",
    readingTime: "7 min",
    date: "2026-08-14",
  },
  {
    slug: "okonjo-interview",
    kind: "Interview",
    title: "Nadia Okonjo on making weather do the talking",
    standfirst: "Sixty-one poems, two climates, one grammar.",
    author: "The Journal",
    readingTime: "18 min",
    date: "2026-07-30",
  },
  {
    slug: "small-press-economics",
    kind: "Publishing",
    title: "The quiet economics of a small press",
    standfirst: "Where the money actually goes, line by line.",
    author: "Rosalind Ferrier",
    readingTime: "9 min",
    date: "2026-07-11",
  },
  {
    slug: "metal-type",
    kind: "Behind the book",
    title: "Why we still set two titles a year in metal",
    standfirst: "It is slower, more expensive, and worth it for reasons we can defend.",
    author: "The Journal",
    readingTime: "6 min",
    date: "2026-06-19",
  },
];

export const featuredStory = stories.find((s) => s.featured)!;
export const journalStories = stories.filter((s) => !s.featured);
