
import Link from "next/link";
import { ArrowUpRight, MapPin, Dumbbell } from "lucide-react";

export type DirectoryGym = {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  priceFrom: number;
  features: string[];
  image: string | null;
  galleryImages: string[];
};

type GymCardProps = {
  gym: DirectoryGym;
};

export default function GymCard({ gym }: GymCardProps) {
  const detailUrl = `/gyms/${gym.id}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#222723] transition duration-300 hover:-translate-y-1 hover:border-[#C7F36B]/40">
      <Link
        href={detailUrl}
        className="relative block h-52 overflow-hidden bg-[#171A18]"
      >
        {gym.image ? (
          <img
            src={gym.image}
            alt={`${gym.name} gym`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/30">
            <Dumbbell size={38} />
            <span className="text-sm">Gym photo coming soon</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur">
          {gym.category}
        </span>
      </Link>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="break-words text-lg font-semibold transition group-hover:text-[#C7F36B]">
              {gym.name}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
              <MapPin size={14} className="shrink-0" />
              <span>{gym.location}</span>
            </p>
          </div>

          <Link
            href={detailUrl}
            aria-label={`View ${gym.name}`}
            className="shrink-0 rounded-full border border-white/10 p-2 text-white/60 transition hover:border-[#C7F36B] hover:text-[#C7F36B]"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {gym.description && (
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-white/50">
            {gym.description}
          </p>
        )}

        {gym.features.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {gym.features.slice(0, 4).map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/65"
              >
                {feature}
              </span>
            ))}

            {gym.features.length > 4 && (
              <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/45">
                +{gym.features.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-white/45">
              Starting monthly price
            </p>

            <p className="mt-1 text-lg font-semibold text-[#C7F36B]">
              {gym.priceFrom > 0
                ? `LKR ${gym.priceFrom.toLocaleString("en-LK")}`
                : "Contact gym"}
              {gym.priceFrom > 0 && (
                <span className="ml-1 text-xs font-normal text-white/45">
                  / month
                </span>
              )}
            </p>
          </div>

          <Link
            href={detailUrl}
            className="shrink-0 text-sm font-medium text-white/80 transition hover:text-[#C7F36B]"
          >
            View gym
          </Link>
        </div>
      </div>
    </article>
  );
}
