"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInAction,
  signUpAction,
  sendMagicLinkAction,
  signInWithGoogleAction,
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
      {/* ── Continue with Google ── */}
      <form action={signInWithGoogleAction}>
        <button
          type="submit"
          className="btn btn-google w-full justify-center"
        >
          <svg className="btn-google-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

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
