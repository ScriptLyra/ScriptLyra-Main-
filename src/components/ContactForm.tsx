"use client";

import { useState } from "react";
import Button from "./Button";

const reasons = [
  "A manuscript",
  "Rights and permissions",
  "Press and reviews",
  "A letter for one of our authors",
  "Something else",
];

/**
 * The contact form. Front-end only: it acknowledges, and the acknowledgement
 * says who will answer and roughly when.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border-rule border-t pt-10" role="status">
        <h3 className="t-display-m">Sent.</h3>
        <p className="t-body-serif mt-6">
          Someone reads this inbox every morning. You will hear back within three working days —
          from a person, with a name.
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
        <p>
          <label htmlFor="c-name" className="field-label">
            Your name
          </label>
          <input id="c-name" name="name" required autoComplete="name" className="field mt-2" />
        </p>

        <p>
          <label htmlFor="c-email" className="field-label">
            Email address
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field mt-2"
          />
        </p>

        <p className="sm:col-span-2">
          <label htmlFor="c-reason" className="field-label">
            What it is about
          </label>
          <select
            id="c-reason"
            name="reason"
            required
            defaultValue=""
            className="field mt-2 cursor-pointer appearance-none"
          >
            <option value="" disabled>
              Choose one
            </option>
            {reasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </p>

        <p className="sm:col-span-2">
          <label htmlFor="c-message" className="field-label">
            Message
          </label>
          <textarea
            id="c-message"
            name="message"
            rows={6}
            required
            className="field mt-2 resize-y"
          />
        </p>
      </div>

      <div className="mt-12">
        <Button type="submit" variant="ink">
          Send message
        </Button>
      </div>
    </form>
  );
}
