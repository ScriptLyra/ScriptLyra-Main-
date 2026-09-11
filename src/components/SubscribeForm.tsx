"use client";

import { useState } from "react";
import Button from "./Button";

/**
 * The Journal sign-up. Front-end only: on submit it acknowledges rather than
 * pretending to have sent anything, and the acknowledgement replaces the field
 * so there is no doubt about what happened.
 */
export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="t-body-serif" role="status">
        You are on the list. The next issue goes out a week from Thursday, and there is nothing
        else to do until then.
      </p>
    );
  }

  return (
    <form
      className="max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        if (email.trim()) setDone(true);
      }}
    >
      <label htmlFor="journal-email" className="field-label">
        Email address
      </label>
      <input
        id="journal-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@somewhere.com"
        className="field mt-2"
      />

      <div className="mt-8">
        <Button type="submit" variant="ink">
          Subscribe
        </Button>
      </div>

      <p className="t-micro mt-6">
        Every other Thursday. One essay, one interview, no announcements.
      </p>
    </form>
  );
}
