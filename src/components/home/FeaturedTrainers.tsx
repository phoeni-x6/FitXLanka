
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { trainers } from "@/data/trainers";

type Props = {
  query: string;
};

export default function FeaturedTrainers({ query }: Props) {
  const filteredTrainers = trainers.filter((trainer) => {
    const searchable = [
      trainer.name,
      trainer.specialty,
      trainer.location,
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

      {filteredTrainers.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-brand-surface p-8 text-center">
          <p className="font-semibold">No trainers found</p>
          <p className="mt-2 text-sm text-gray-400">
            Try a different name, location, or specialty.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredTrainers.map((trainer) => (
            <article
              key={trainer.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-brand-surface transition duration-300 hover:-translate-y-1 hover:border-brand-lime/40"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  <Star
                    size={13}
                    className="mr-1 inline fill-brand-lime text-brand-lime"
                  />
                  {trainer.rating.toFixed(1)}
                </div>

                <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur">
                  {trainer.available ? "Available" : "Check availability"}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold">{trainer.name}</h3>
                <p className="mt-1 text-sm text-brand-lime">
                  {trainer.specialty}
                </p>

                <div className="mt-4 space-y-2 text-xs text-gray-400">
                  <p className="flex items-center gap-2">
                    <MapPin size={14} /> {trainer.location}, Sri Lanka
                  </p>
                  <p>{trainer.experience}</p>
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-gray-400">Starting from</p>
                    <p className="mt-1 text-lg font-black">
                      LKR {trainer.price.toLocaleString("en-LK")}
                      <span className="text-xs font-normal text-gray-400">
                        {" "}/ session
                      </span>
                    </p>
                  </div>

                  <Link
                    href="/trainers"
                    aria-label={`View ${trainer.name}`}
                    className="rounded-xl bg-white/5 p-3 text-white transition hover:bg-brand-lime hover:text-brand-charcoal"
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
