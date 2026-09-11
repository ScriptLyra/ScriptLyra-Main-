"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInAction,
  signUpAction,
  sendMagicLinkAction,
  type AuthState,
} from "@/app/(auth)/actions";

const initial: AuthState = {};

/**
 * One form serves both /signin and /signup. Built from the same field / btn
 * primitives as the submission form, and it acknowledges rather than pretends:
 * a sign-up that needs email confirmation says so, in the "Received." pattern
 * the manuscript form uses.
 */
export default function AuthForm({ mode, next }: { mode: "signin" | "signup"; next?: string }) {
  const action = mode === "signup" ? signUpAction : signInAction;
  const [state, formAction, pending] = useActionState(action, initial);
  const [linkState, linkAction, linkPending] = useActionState(sendMagicLinkAction, initial);

  // Sign-up confirmation, or a magic link on its way: the same quiet receipt.
  const receipt = state.message ?? linkState.message;
  if (receipt) {
    return (
      <div className="border-rule border-t pt-10" role="status">
        <h2 className="t-display-m">Check your email.</h2>
        <p className="t-body-serif mt-6">{receipt}</p>
        <p className="t-micro mt-8">
          Nothing else is needed here. You can close this tab once you have followed the link.
        </p>
      </div>
    );
  }

  return (
    <div className="border-rule border-t pt-10">
      <form action={formAction} className="grid gap-x-10 gap-y-9">
        {next ? <input type="hidden" name="next" value={next} /> : null}

        {mode === "signup" ? (
          <p>
            <label htmlFor="a-name" className="field-label">
              What we should call you
            </label>
            <input id="a-name" name="name" required autoComplete="name" className="field mt-2" />
          </p>
        ) : null}

        <p>
          <label htmlFor="a-email" className="field-label">
            Email address
          </label>
          <input
            id="a-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field mt-2"
          />
        </p>

        <p>
          <label htmlFor="a-password" className="field-label">
            Password
          </label>
          <input
            id="a-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="field mt-2"
          />
          {mode === "signup" ? (
            <span className="t-micro mt-2 block">At least eight characters.</span>
          ) : null}
        </p>

        {state.error ? (
          <p role="alert" className="t-micro text-ink border-ink/20 border-l-2 pl-4">
            {state.error}
          </p>
        ) : null}

        <div className="mt-2">
          <button type="submit" className="btn btn-ink" disabled={pending}>
            <span>{pending ? "One moment…" : mode === "signup" ? "Create account" : "Sign in"}</span>
          </button>
        </div>
      </form>

      {mode === "signin" ? (
        <form action={linkAction} className="border-rule mt-10 border-t pt-8">
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <p className="t-micro">
            Forgotten your password, or would rather not have one? Have a one-time link sent
            instead.
          </p>
          <p className="mt-5">
            <label htmlFor="a-link-email" className="field-label">
              Email address
            </label>
            <input
              id="a-link-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="field mt-2"
            />
          </p>
          {linkState.error ? (
            <p role="alert" className="t-micro text-ink border-ink/20 mt-4 border-l-2 pl-4">
              {linkState.error}
            </p>
          ) : null}
          <div className="mt-5">
            <button type="submit" className="link-rule text-[0.9375rem]" disabled={linkPending}>
              {linkPending ? "Sending…" : "Email me a link instead"}
            </button>
          </div>
        </form>
      ) : null}

      <p className="t-micro mt-10">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/signin" className="link-rule text-ink">
              Sign in
            </Link>
            .
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="link-rule text-ink">
              Create an account
            </Link>{" "}
            and start writing.
          </>
        )}
      </p>
    </div>
  );
}
