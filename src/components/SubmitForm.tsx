"use client";

import { useState } from "react";
import { Paperclip } from "lucide-react";
import Button from "./Button";
import { books } from "@/lib/books";

const subjects = Array.from(new Set(books.map((book) => book.genre)));

/**
 * The submission. Front-end only — nothing is uploaded — so the form says what
 * happens next rather than pretending to have sent anything anywhere.
 */
export default function SubmitForm() {
  const [sent, setSent] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="border-rule border-t pt-10" role="status">
        <h3 className="t-display-m">Received.</h3>
        <p className="t-body-serif mt-6">
          An editor reads every submission, in the order it arrives. That takes up to eight
          weeks, and you will get an answer either way — including the reasons, if the answer is
          no.
        </p>
        <p className="t-micro mt-8">
          Nothing else is needed from you in the meantime. Please keep writing the next one.
        </p>
      </div>
    );
  }

  return (
    <form
      className="border-rule border-t pt-10"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
        <p className="sm:col-span-2">
          <label htmlFor="s-name" className="field-label">
            Your name
          </label>
          <input id="s-name" name="name" required autoComplete="name" className="field mt-2" />
        </p>

        <p>
          <label htmlFor="s-email" className="field-label">
            Email address
          </label>
          <input
            id="s-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field mt-2"
          />
        </p>

        <p>
          <label htmlFor="s-profile" className="field-label">
            Where we can read more of your work
          </label>
          <input
            id="s-profile"
            name="profile"
            type="url"
            placeholder="A site, a journal, a profile"
            className="field mt-2"
          />
        </p>

        <p>
          <label htmlFor="s-title" className="field-label">
            Title of the work
          </label>
          <input id="s-title" name="title" required className="field mt-2" />
        </p>

        <p>
          <label htmlFor="s-subject" className="field-label">
            Subject
          </label>
          <select
            id="s-subject"
            name="subject"
            required
            defaultValue=""
            className="field mt-2 cursor-pointer appearance-none"
          >
            <option value="" disabled>
              Choose one
            </option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </p>

        <p className="sm:col-span-2">
          <label htmlFor="s-description" className="field-label">
            What it is about, in your own words
          </label>
          <textarea
            id="s-description"
            name="description"
            rows={5}
            required
            placeholder="Two hundred words is plenty. We would rather have your voice than a pitch."
            className="field mt-2 resize-y"
          />
        </p>

        <div className="sm:col-span-2">
          <span className="field-label">The manuscript</span>

          <label
            htmlFor="s-file"
            className="border-rule hover:border-graphite focus-within:border-ink mt-2 flex cursor-pointer items-center gap-3 border-b py-4 transition-colors duration-500"
          >
            <Paperclip size={16} strokeWidth={1.25} aria-hidden="true" />
            <span className={fileName ? "text-[0.9375rem]" : "text-graphite text-[0.9375rem]"}>
              {fileName ?? "Attach a document — the first fifty pages is enough"}
            </span>
            <input
              id="s-file"
              name="manuscript"
              type="file"
              accept=".pdf,.doc,.docx,.rtf,.txt,.odt"
              className="sr-only"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>

        <p className="flex items-start gap-3 sm:col-span-2">
          <input
            id="s-read"
            name="read"
            type="checkbox"
            required
            className="accent-ink mt-1 size-4 shrink-0"
          />
          <label htmlFor="s-read" className="t-micro">
            I have read what the house is looking for, and this is not a simultaneous submission
            to a dozen other publishers.
          </label>
        </p>
      </div>

      <div className="mt-12">
        <Button type="submit" variant="ink">
          Submit manuscript
        </Button>
      </div>
    </form>
  );
}
