
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type ClientProfile = {
  display_name: string | null;
  role: string;
};

export default function ClientProfileForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<ClientProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const supabase = createClient();

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          if (active) {
            setError("Your session could not be verified. Please sign in again.");
          }
          return;
        }

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("display_name, role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (active) {
          setEmail(user.email ?? "");
          setProfile(data as ClientProfile);
          setDisplayName(data.display_name ?? "");
        }
      } catch (err) {
        console.error("Unable to load client profile:", err);

        if (active) {
          setError("We couldn't load your profile. Please refresh and try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setError("Please enter your display name.");
      return;
    }

    if (trimmedName.length > 60) {
      setError("Your display name must be 60 characters or fewer.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({ display_name: trimmedName })
        .eq("id", user.id)
        .select("display_name, role")
        .single();

      if (updateError) throw updateError;

      setProfile(data as ClientProfile);
      setDisplayName(data.display_name ?? "");
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      console.error("Unable to update client profile:", err);

      setError(
        err instanceof Error
          ? err.message
          : "We couldn't save your changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-2xl border border-white/10 bg-[#222723]">
        <LoaderCircle className="h-6 w-6 animate-spin text-[#C7F36B]" />
        <span className="ml-3 text-sm text-white/60">
          Loading your profile...
        </span>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-[#222723] p-6">
        <p className="text-sm text-red-300">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-xl bg-[#C7F36B] px-4 py-2 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5ff83]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account overview */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#222723]">
        <div className="h-2 bg-[#C7F36B]" />

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#C7F36B]/10 text-[#C7F36B]">
            <UserRound className="h-8 w-8" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Your account
            </p>

            <h2 className="mt-1 break-words text-xl font-bold">
              {profile?.display_name || "FitX Lanka member"}
            </h2>

            <p className="mt-1 break-all text-sm text-white/50">
              {email}
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C7F36B]/20 bg-[#C7F36B]/10 px-3 py-1.5 text-xs font-medium text-[#C7F36B]">
            <ShieldCheck className="h-4 w-4" />
            Client account
          </span>
        </div>
      </section>

      {/* Editable profile information */}
      <section className="rounded-2xl border border-white/10 bg-[#222723] p-6 sm:p-8">
        <div className="mb-7">
          <h2 className="text-lg font-semibold">Personal information</h2>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Update the name displayed on your FitX Lanka account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="displayName"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Display name
            </label>

            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />

              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                maxLength={60}
                required
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  setSuccess("");
                  setError("");
                }}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-white/10 bg-[#171A18] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C7F36B]/60 focus:ring-2 focus:ring-[#C7F36B]/10"
              />
            </div>

            <p className="mt-2 text-xs text-white/35">
              Maximum 60 characters.
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Email address
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />

              <input
                id="email"
                type="email"
                value={email}
                readOnly
                aria-describedby="email-note"
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-[#171A18]/70 py-3 pl-12 pr-4 text-sm text-white/50 outline-none"
              />
            </div>

            <p id="email-note" className="mt-2 text-xs text-white/35">
              Your email is managed by your authentication account.
            </p>
          </div>

          <div>
            <label
              htmlFor="accountRole"
              className="mb-2 block text-sm font-medium text-white/80"
            >
              Account type
            </label>

            <input
              id="accountRole"
              type="text"
              value="Client"
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-[#171A18]/70 px-4 py-3 text-sm text-white/50 outline-none"
            />

            <p className="mt-2 text-xs text-white/35">
              Account roles cannot be changed from this page.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-[#C7F36B]/20 bg-[#C7F36B]/5 px-4 py-3 text-sm text-[#C7F36B]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5ff83] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
