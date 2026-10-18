
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Dumbbell,
  LoaderCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Props = {
  query: string;
};

type Trainer = {
  id: string;
  full_name: string;
  specialty: string | null;
  bio: string | null;
  location: string | null;
  experience_years: number | null;
  price_per_session: number | string | null;
  profile_image_url: string | null;
};

export default function FeaturedTrainers({ query }: Props) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchTrainers() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("trainer_profiles")
        .select(
          "id, full_name, specialty, bio, location, experience_years, price_per_session, profile_image_url"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (fetchError) {
        console.error("Failed to fetch featured trainers:", fetchError);
        setError("We couldn't load trainers right now.");
        setTrainers([]);
      } else {
        setTrainers((data ?? []) as Trainer[]);
      }

      setLoading(false);
    }

    fetchTrainers();

    return () => {
      active = false;
    };
  }, []);

  const filteredTrainers = useMemo(() => {
    const search = query.trim().toLowerCase();

    return trainers
      .filter((trainer) => {
        const searchable = [
          trainer.full_name,
          trainer.specialty,
          trainer.location,
          trainer.bio,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(search);
      })
      .slice(0, 4);
  }, [trainers, query]);

  return (
    <section className="py-16 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-brand-lime">
            TRAIN WITH PURPOSE
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Meet your trainers
          </h2>

          <p className="mt-3 text-sm text-gray-400 sm:text-base">
            Find a coach who understands your goals.
          </p>
        </div>

        <Link
          href="/trainers"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-lime hover:text-white"
        >
          View all <ArrowRight size={17} />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-brand-surface p-10 text-sm text-gray-400">
          <LoaderCircle size={20} className="animate-spin text-brand-lime" />
          Loading trainers...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-white/10 bg-brand-surface p-8 text-center">
          <p className="font-semibold">Unable to load trainers</p>
          <p className="mt-2 text-sm text-gray-400">{error}</p>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-brand-surface p-8 text-center">
          <p className="font-semibold">
            {query.trim() ? "No matching trainers found" : "No trainers yet"}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {query.trim()
              ? "Try another name, location, or specialty."
              : "Approved trainers will appear here once their profiles are published."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredTrainers.map((trainer) => {
            const price = Number(trainer.price_per_session ?? 0);
            const experience = Number(trainer.experience_years ?? 0);

            return (
              <article
                key={trainer.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-brand-surface transition duration-300 hover:-translate-y-1 hover:border-brand-lime/40"
              >
                <Link
                  href={`/trainers/${trainer.id}`}
                  className="block"
                  aria-label={`View ${trainer.full_name}'s profile`}
                >
                  <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#1c201d]">
                    {trainer.profile_image_url ? (
                      <img
                        src={trainer.profile_image_url}
                        alt={trainer.full_name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-white/30">
                        <Dumbbell size={42} />
                        <span className="text-xs">No profile image</span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                      <span className="inline-flex rounded-full bg-brand-lime px-3 py-1.5 text-xs font-bold text-brand-charcoal">
                        {trainer.specialty || "Personal Training"}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="p-5">
                  <h3 className="truncate text-lg font-bold">
                    {trainer.full_name}
                  </h3>

                  <p className="mt-1 text-sm text-brand-lime">
                    {trainer.specialty || "Personal Trainer"}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-gray-400">
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="shrink-0" />
                      {trainer.location || "Location not specified"}
                    </p>

                    <p>
                      {experience > 0
                        ? `${experience} ${experience === 1 ? "year" : "years"} of experience`
                        : "Experience not specified"}
                    </p>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Session price</p>
                      <p className="mt-1 text-lg font-black">
                        {price > 0
                          ? `LKR ${price.toLocaleString("en-LK")}`
                          : "Contact for price"}
                      </p>
                      {price > 0 && (
                        <p className="text-xs font-normal text-gray-400">
                          per session
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/trainers/${trainer.id}`}
                      aria-label={`View ${trainer.full_name}`}
                      className="shrink-0 rounded-xl bg-white/5 p-3 text-white transition hover:bg-brand-lime hover:text-brand-charcoal"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
