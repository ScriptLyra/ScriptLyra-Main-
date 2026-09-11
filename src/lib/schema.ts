import { booksByAuthor, type Book } from "@/lib/books";
import type { Author } from "@/lib/authors";
import type { Post, Profile } from "@/lib/types";
import { site } from "@/lib/site";

/** Everything the house publishes hangs off one Organization node. */
const publisher = { "@id": `${site.url}/#organization` };

export function bookSchema(book: Book) {
  return {
    "@type": "Book",
    "@id": `${site.url}/books/${book.slug}#book`,
    url: `${site.url}/books/${book.slug}`,
    name: book.title,
    description: book.description[0],
    abstract: book.line,
    genre: book.genre,
    inLanguage: "en",
    isbn: book.isbn,
    numberOfPages: book.pages,
    datePublished: book.published,
    bookFormat: "https://schema.org/Paperback",
    publisher,
    author: {
      "@type": "Person",
      "@id": `${site.url}/authors/${book.authorSlug}#person`,
      name: book.author,
      url: `${site.url}/authors/${book.authorSlug}`,
    },
    ...(book.reviews.length
      ? {
          review: book.reviews.map((review) => ({
            "@type": "Review",
            reviewBody: review.quote,
            author: { "@type": "Organization", name: review.source },
          })),
        }
      : {}),
  };
}

export function personSchema(author: Author) {
  return {
    "@type": "Person",
    "@id": `${site.url}/authors/${author.slug}#person`,
    url: `${site.url}/authors/${author.slug}`,
    name: author.name,
    description: author.blurb,
    disambiguatingDescription: author.bio[0],
    jobTitle: "Author",
    knowsAbout: author.genre,
    homeLocation: { "@type": "Place", name: author.based },
    publishingPrinciples: `${site.url}/publish`,
    worksFor: publisher,
    ...(booksByAuthor(author.slug).length
      ? {
          hasOccupation: { "@type": "Occupation", name: "Writer" },
          workExample: booksByAuthor(author.slug).map((book) => ({
            "@type": "Book",
            "@id": `${site.url}/books/${book.slug}#book`,
            name: book.title,
            url: `${site.url}/books/${book.slug}`,
          })),
        }
      : {}),
  };
}

/**
 * A registered writer's public page. Like personSchema but built from a
 * profile row and pointed at /writers, and without the house-catalogue
 * workExample the static authors carry.
 */
export function writerSchema(profile: Profile) {
  return {
    "@type": "Person",
    "@id": `${site.url}/writers/${profile.username}#person`,
    url: `${site.url}/writers/${profile.username}`,
    name: profile.name,
    ...(profile.blurb ? { description: profile.blurb } : {}),
    ...(profile.bio ? { disambiguatingDescription: profile.bio.split(/\n{2,}/)[0] } : {}),
    ...(profile.genre ? { knowsAbout: profile.genre } : {}),
    ...(profile.based ? { homeLocation: { "@type": "Place", name: profile.based } } : {}),
  };
}

/** A published blog post. */
export function articleSchema(post: Post, author: { username: string; name: string }) {
  const url = `${site.url}/blog/${author.username}/${post.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline: post.title,
    ...(post.standfirst ? { description: post.standfirst } : {}),
    ...(post.published_at
      ? { datePublished: post.published_at, dateModified: post.updated_at }
      : {}),
    author: {
      "@type": "Person",
      "@id": `${site.url}/writers/${author.username}#person`,
      name: author.name,
      url: `${site.url}/writers/${author.username}`,
    },
    publisher,
  };
}

export function listSchema(name: string, path: string, items: { name: string; url: string }[]) {  return {
    "@type": "ItemList",
    "@id": `${site.url}${path}#list`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: `${site.url}${step.path}`,
    })),
  };
}
