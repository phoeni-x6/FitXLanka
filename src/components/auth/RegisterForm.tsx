
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Dumbbell,
  Building2,
  UserRound,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Role = "client" | "trainer" | "gym";

type Props = {
  initialRole: Role;
};

const roles: {
  value: Role;
  title: string;
  description: string;
  icon: typeof UserRound;
}[] = [
  {
    value: "client",
    title: "Fitness enthusiast",
    description: "Discover trainers and gyms",
    icon: UserRound,
  },
  {
    value: "trainer",
    title: "Personal trainer",
    description: "Request a trainer profile",
    icon: Dumbbell,
  },
  {
    value: "gym",
    title: "Gym owner",
    description: "Request a gym listing",
    icon: Building2,
  },
];

export default function RegisterForm({ initialRole }: Props) {
  const router = useRouter();

  const [role, setRole] = useState<Role>(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] =
    useState(false);

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#171A18] px-4 py-3.5 text-sm text-[#F4F5F0] outline-none transition placeholder:text-white/30 focus:border-[#C7F36B]";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

     const { data, error: signUpError } =
  await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        display_name: fullName.trim(),
      },
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!data.user) {
        setError("We couldn't create your account. Please try again.");
        return;
      }

      // Role selection is intentionally NOT sent as trusted user metadata.
      // The database trigger assigns every new account the client role.
      if (!data.session) {
        setEmailConfirmationRequired(true);
        setSubmitted(true);
        return;
      }

      setMessage("Your account has been created.");
      setSubmitted(true);
    } catch {
      setError(
        "Unable to connect to the authentication service. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#C7F36B]/20 bg-[#222723] p-7 text-center sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C7F36B]/10">
          <Check size={28} className="text-[#C7F36B]" />
        </div>

        <h2 className="mt-5 text-2xl font-semibold">
          {emailConfirmationRequired
            ? "Check your email"
            : "Account created"}
        </h2>

        <p className="mt-3 text-sm leading-6 text-white/55">
          {emailConfirmationRequired
            ? `We've requested an account for ${email}. Follow the confirmation link in your email before signing in.`
            : `Welcome to FitX Lanka, ${fullName.trim()}. Your account has been created.`}
        </p>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#171A18] p-4 text-left">
          <p className="text-xs text-white/40">Requested account type</p>
          <p className="mt-1 font-medium">
            {roles.find((item) => item.value === role)?.title}
          </p>

          <p className="mt-3 text-xs text-white/40">Email address</p>
          <p className="mt-1 break-all text-sm">{email}</p>

          <p className="mt-3 text-xs text-white/40">Account permissions</p>
          <p className="mt-1 text-sm text-white/65">
            Your initial role is Client. Trainer and gym-owner permissions
            require separate authorization.
          </p>
        </div>

        {role !== "client" && (
          <p className="mt-4 text-xs leading-5 text-white/45">
            Your selection is a request to become a {role === "trainer"
              ? "trainer"
              : "gym owner"}. It does not grant those permissions or create a public listing yet.
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-6 w-full rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
        >
          Continue to sign in
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-8"
    >
      <div className="mb-7">
        <p className="text-sm font-medium text-[#C7F36B]">
          CREATE YOUR ACCOUNT
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Join the community</h2>
        <p className="mt-2 text-sm leading-6 text-white/50">
          Choose how you want to use the fitness marketplace.
        </p>
      </div>

      <fieldset disabled={loading}>
        <legend className="mb-3 text-sm font-medium text-white/75">
          I want to join as a...
        </legend>

        <div className="grid gap-3">
          {roles.map((item) => {
            const Icon = item.icon;
            const selected = role === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setRole(item.value)}
                aria-pressed={selected}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-[#C7F36B] bg-[#C7F36B]/[0.06]"
                    : "border-white/10 hover:border-white/25"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    selected
                      ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                      : "bg-white/5 text-white/55"
                  }`}
                >
                  <Icon size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-xs text-white/45">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    selected
                      ? "border-[#C7F36B] bg-[#C7F36B] text-[#171A18]"
                      : "border-white/20"
                  }`}
                >
                  {selected && <Check size={13} />}
                </div>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="my-6 border-t border-white/10" />

      <div className="space-y-5">
        <div>
          <label htmlFor="fullName" className="text-sm text-white/70">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            maxLength={100}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your full name"
            className={inputClass}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="registerEmail" className="text-sm text-white/70">
            Email address
          </label>
          <input
            id="registerEmail"
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

        <div>
          <label htmlFor="registerPassword" className="text-sm text-white/70">
            Password
          </label>

          <div className="relative">
            <input
              id="registerPassword"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
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

        <div>
          <label htmlFor="confirmPassword" className="text-sm text-white/70">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Enter your password again"
            className={inputClass}
            disabled={loading}
          />
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-white/55">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-1 accent-[#C7F36B]"
          disabled={loading}
        />
        <span>
          I agree to the platform&apos;s terms of service and privacy policy.
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-4 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle size={17} className="animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Create account
            <ArrowRight size={17} />
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-white/35">
        Registration is powered by Supabase Auth. Email confirmation may be required.
      </p>

      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#C7F36B] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
