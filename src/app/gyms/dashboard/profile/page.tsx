
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import GymProfileForm from "@/components/gyms/profile/GymProfileForm";

export default function GymProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [gymId, setGymId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadGym() {
      const supabase = createClient();

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          router.replace("/login?next=/gyms/dashboard/profile");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.role !== "gym_owner") {
          router.replace("/gyms/application-status");
          return;
        }

        const { data: gym, error: gymError } = await supabase
          .from("gym_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (gymError) throw gymError;

        if (!gym) {
          throw new Error(
            "Your gym profile could not be found. Please contact the FitXLanka administrator."
          );
        }

        if (!cancelled) {
          setGymId(gym.id);
          setAuthorized(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your gym profile."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadGym();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171A18] text-[#F4F5F0]">
        <div className="flex items-center gap-3">
          <LoaderCircle className="animate-spin text-[#C7F36B]" size={24} />
          <p className="text-sm text-white/70">Loading gym profile...</p>
        </div>
      </main>
    );
  }

  if (error || !authorized || !gymId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171A18] px-5 text-[#F4F5F0]">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#222723] p-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
            <Building2 size={24} />
          </div>

          <h1 className="text-xl font-bold">Gym profile unavailable</h1>

          <p className="mt-3 break-words text-sm leading-6 text-white/60">
            {error || "You do not have access to this page."}
          </p>

          <Link
            href="/gyms/application-status"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-bold text-[#171A18] transition hover:bg-[#b9e45e]"
          >
            <ArrowLeft size={16} />
            Back to application status
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#171A18] px-4 py-8 text-[#F4F5F0] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/gyms/dashboard"
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#C7F36B]"
        >
          <ArrowLeft size={16} />
          Back to gym dashboard
        </Link>

        <header className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C7F36B]/10 text-[#C7F36B]">
            <Building2 size={28} />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C7F36B]">
            Gym owner portal
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Gym profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            Manage your gym information, facilities, pricing, and photos
            displayed on FitXLanka.
          </p>
        </header>

        <GymProfileForm gymId={gymId} />
      </div>
    </main>
  );
}
