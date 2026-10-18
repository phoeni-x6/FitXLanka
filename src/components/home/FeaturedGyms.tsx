
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Building2,
  LoaderCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Props = {
  query: string;
};

type Gym = {
  id: string;
  gym_name: string;
  description: string | null;
  location: string | null;
  category: string | null;
  price_from: number | string | null;
  features: string[] | null;
  main_image_url: string | null;
};

export default function FeaturedGyms({ query }: Props) {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchGyms() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("gym_profiles")
        .select(
          "id, gym_name, description, location, category, price_from, features, main_image_url"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (fetchError) {
        console.error("Failed to fetch featured gyms:", fetchError);
        setError("We couldn't load gyms right now.");
        setGyms([]);
      } else {
        setGyms((data ?? []) as Gym[]);
      }

      setLoading(false);
    }

    fetchGyms();

    return () => {
      active = false;
    };
  }, []);

  const filteredGyms = useMemo(() => {
    const search = query.trim().toLowerCase();

    return gyms
      .filter((gym) => {
        const searchable = [
          gym.gym_name,
          gym.location,
          gym.category,
          gym.description,
          ...(gym.features ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(search);
      })
      .slice(0, 3);
  }, [gyms, query]);

  return (
    <section className="py-16 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-brand-lime">
            YOUR NEXT WORKOUT
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Explore gyms
          </h2>

          <p className="mt-3 text-sm text-gray-400 sm:text-base">
            Discover places to train, grow, and get stronger.
          </p>
        </div>

        <Link
          href="/gyms"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-lime hover:text-white"
        >
          View all <ArrowRight size={17} />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-brand-surface p-10 text-sm text-gray-400">
          <LoaderCircle size={20} className="animate-spin text-brand-lime" />
          Loading gyms...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-white/10 bg-brand-surface p-8 text-center">
          <p className="font-semibold">Unable to load gyms</p>
          <p className="mt-2 text-sm text-gray-400">{error}</p>
        </div>
      ) : filteredGyms.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-brand-surface p-8 text-center">
          <p className="font-semibold">
            {query.trim() ? "No matching gyms found" : "No gyms yet"}
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {query.trim()
              ? "Try searching for another gym, feature, or location."
              : "Approved gyms will appear here once their profiles are published."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredGyms.map((gym) => {
            const price = Number(gym.price_from ?? 0);
            const features = (gym.features ?? []).slice(0, 4);

            return (
              <article
                key={gym.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-brand-surface transition hover:-translate-y-1 hover:border-brand-lime/40"
              >
                <Link
                  href={`/gyms/${gym.id}`}
                  className="block"
                  aria-label={`View ${gym.gym_name}`}
                >
                  <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#1c201d]">
                    {gym.main_image_url ? (
                      <img
                        src={gym.main_image_url}
                        alt={gym.gym_name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-white/30">
                        <Building2 size={44} />
                        <span className="text-xs">No gym image</span>
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                      {gym.category || "Fitness"}
                    </div>
                  </div>
                </Link>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-lime">
                    {gym.category || "Fitness"}
                  </p>

                  <h3 className="mt-2 text-xl font-bold">{gym.gym_name}</h3>

                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={16} className="shrink-0 text-brand-lime" />
                    {gym.location || "Location not specified"}
                  </p>

                  {gym.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
                      {gym.description}
                    </p>
                  )}

                  {features.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Price from</p>
                      <p className="mt-1 text-lg font-black">
                        {price > 0
                          ? `LKR ${price.toLocaleString("en-LK")}`
                          : "Contact for price"}
                      </p>
                      {price > 0 && (
                        <p className="text-xs font-normal text-gray-400">
                          Ask about membership options
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/gyms/${gym.id}`}
                      aria-label={`Explore ${gym.gym_name}`}
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
