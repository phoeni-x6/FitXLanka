"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#171A18] py-3.5 pl-11 pr-4 text-sm text-[#F4F5F0] outline-none transition placeholder:text-white/30 focus:border-[#C7F36B]";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }

    // Prototype only: no authentication request is made.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#C7F36B]/20 bg-[#222723] p-7 text-center sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C7F36B]/10">
          <CheckCircle2 size={28} className="text-[#C7F36B]" />
        </div>

        <h2 className="mt-5 text-2xl font-semibold">Demo sign-in submitted</h2>

        <p className="mt-3 text-sm leading-6 text-white/55">
          The login interface is working, but authentication has not
          been connected. No account was authenticated.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-medium text-[#C7F36B]">
          WELCOME BACK
        </p>

        <h2 className="mt-2 text-2xl font-semibold">Sign in to your account</h2>

        <p className="mt-2 text-sm leading-6 text-white/50">
          Continue your fitness journey.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setError("Google sign-in will be enabled during Clerk integration.")
        }
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#171A18] px-4 py-3.5 text-sm font-medium transition hover:border-white/25"
      >
        <svg
          viewBox="0 0 48 48"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.73 7.18l7.26 5.64c4.24-3.91 6.51-9.67 6.51-17.29Z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.93 23.93 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-7.26-5.64c-2.01 1.35-4.59 2.15-8.64 2.15-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/35">OR CONTINUE WITH EMAIL</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="loginEmail" className="text-sm text-white/70">
            Email address
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              id="loginEmail"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="loginPassword" className="text-sm text-white/70">
              Password
            </label>

            <button
              type="button"
              onClick={() =>
                setError("Password reset will be enabled during Clerk integration.")
              }
              className="text-xs text-[#C7F36B] transition hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <LockKeyhole
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
            />

            <input
              id="loginPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="status"
            className="rounded-xl border border-white/10 bg-[#171A18] p-3 text-sm text-white/65"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-4 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
        >
          Sign in
          <ArrowRight size={17} />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#C7F36B] hover:underline"
        >
          Create account
        </Link>
      </p>

      <p className="mt-5 text-center text-xs leading-5 text-white/35">
        Authentication is not connected yet. This screen does not verify
        credentials or sign you in.
      </p>
    </div>
  );
}
