
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { gyms } from "@/data/gyms";

type Props = {
  query: string;
};

export default function FeaturedGyms({ query }: Props) {
  const filteredGyms = gyms.filter((gym) => {
    const searchable = [
      gym.name,
      gym.location,
      gym.category,
      ...gym.features,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query.trim().toLowerCase());
  });

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

      {filteredGyms.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-brand-surface p-8 text-center">
          <p className="font-semibold">No gyms found</p>
          <p className="mt-2 text-sm text-gray-400">
            Try searching for another gym or location.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredGyms.map((gym) => (
            <article
              key={gym.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-brand-surface transition hover:-translate-y-1 hover:border-brand-lime/40"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/70 px-3 py-2 text-xs font-bold">
                  <Star size={14} className="fill-brand-lime text-brand-lime" />
                  {gym.rating.toFixed(1)}
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-lime">
                  {gym.category}
                </p>
                <h3 className="mt-2 text-xl font-bold">{gym.name}</h3>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={16} className="text-brand-lime" />
                  {gym.location}, Sri Lanka
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {gym.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-gray-400">
                      Membership from
                    </p>
                    <p className="mt-1 text-lg font-black">
                      LKR {gym.priceFrom.toLocaleString("en-LK")}
                      <span className="text-xs font-normal text-gray-400">
                        {" "}/ month
                      </span>
                    </p>
                  </div>

                  <Link
                    href="/gyms"
                    aria-label={`Explore ${gym.name}`}
                    className="rounded-xl bg-white/5 p-3 transition hover:bg-brand-lime hover:text-brand-charcoal"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
