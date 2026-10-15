
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#171A18] py-3.5 pl-11 pr-4 text-sm text-[#F4F5F0] outline-none transition placeholder:text-white/30 focus:border-[#C7F36B]";

  const dashboardByRole: Record<string, string> = {
    client: "/dashboard",
    trainer: "/trainers/dashboard",
    gym_owner: "/gyms/dashboard",
    admin: "/admin/dashboard",
  };

  async function redirectByRole(userId: string) {
    const supabase = createClient();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      setError(
        "You signed in, but your profile could not be loaded. Please try again."
      );
      return;
    }

    if (!profile) {
      setError(
        "Your account profile was not found. Please contact support."
      );
      return;
    }

    const destination = dashboardByRole[profile.role];

    if (!destination) {
      setError(
        "Your account has an unrecognized role. Please contact support."
      );
      return;
    }

    router.replace(destination);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    if (loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: googleError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              prompt: "select_account",
            },
          },
        });

      if (googleError) {
        console.error("Google sign-in error:", googleError);
        setError(
          "Unable to start Google sign-in. Please check your configuration and try again."
        );
        setLoading(false);
      }
      // On success, Supabase redirects the browser to Google.
    } catch (err) {
      console.error("Unexpected Google sign-in error:", err);
      setError("Something went wrong while connecting to Google.");
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      // Password reset
      if (resetMode) {
        if (!email.trim()) {
          setError("Please enter your email address.");
          return;
        }

        const { error: resetError } =
          await supabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase(),
            {
              redirectTo: `${window.location.origin}/reset-password`,
            }
          );

        if (resetError) {
          console.error("Password reset error:", resetError);
          setError(
            "Unable to send the reset link. Please try again later."
          );
          return;
        }

        setResetSent(true);
        setMessage(
          "If an account exists for this email, a password reset link will be sent."
        );
        return;
      }

      // Email and password sign-in
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (signInError) {
        console.error("Supabase sign-in error:", signInError);

        if (
          signInError.message.toLowerCase().includes("email not confirmed")
        ) {
          setError(
            "Please confirm your email address before signing in. Check your inbox."
          );
        } else {
          setError(
            "Unable to sign in with those credentials. Check your email and password."
          );
        }

        return;
      }

      if (!data.user || !data.session) {
        setError(
          "Your login session could not be created. Please try again."
        );
        return;
      }

      await redirectByRole(data.user.id);
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Something went wrong while signing in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (resetSent) {
    return (
      <div className="rounded-2xl border border-[#C7F36B]/20 bg-[#222723] p-7 text-center sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C7F36B]/10">
          <CheckCircle2 size={28} className="text-[#C7F36B]" />
        </div>

        <h2 className="mt-5 text-2xl font-semibold">Check your email</h2>

        <p className="mt-3 text-sm leading-6 text-white/55">{message}</p>

        <button
          type="button"
          onClick={() => {
            setResetSent(false);
            setResetMode(false);
            setMessage("");
            setError("");
          }}
          className="mt-6 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-medium text-[#C7F36B]">
          {resetMode ? "ACCOUNT RECOVERY" : "WELCOME BACK"}
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          {resetMode ? "Reset your password" : "Sign in to your account"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/50">
          {resetMode
            ? "Enter your account email to request a password reset link."
            : "Continue your fitness journey."}
        </p>
      </div>

      {!resetMode && (
        <>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#171A18] px-4 py-3.5 text-sm font-medium transition hover:border-white/25 hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
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
            )}

            {loading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/35">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </>
      )}

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
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        {!resetMode && (
          <div>
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="loginPassword" className="text-sm text-white/70">
                Password
              </label>

              <button
                type="button"
                onClick={() => {
                  setResetMode(true);
                  setError("");
                  setMessage("");
                }}
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
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className={`${inputClass} pr-12`}
                disabled={loading}
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
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-4 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Please wait...
            </>
          ) : resetMode ? (
            <>
              Send reset link
              <ArrowRight size={17} />
            </>
          ) : (
            <>
              Sign in
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        {resetMode ? (
          <button
            type="button"
            onClick={() => {
              setResetMode(false);
              setError("");
              setMessage("");
            }}
            className="font-medium text-[#C7F36B] hover:underline"
          >
            Back to sign in
          </button>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[#C7F36B] hover:underline"
            >
              Create account
            </Link>
          </>
        )}
      </p>

      {message && (
        <p role="status" className="mt-4 text-center text-sm text-white/60">
          {message}
        </p>
      )}
    </div>
  );
}
  