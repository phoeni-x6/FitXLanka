import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";
import type { Gym } from "@/data/gyms";

type GymCardProps = {
  gym: Gym;
};

export default function GymCard({ gym }: GymCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#222723] transition duration-300 hover:-translate-y-1 hover:border-[#C7F36B]/40">
      <Link
        href={`/gyms/${gym.id}`}
        className="relative block h-52 overflow-hidden bg-[#171A18]"
      >
        <Image
          src={gym.image}
          alt={gym.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur">
          {gym.category}
        </span>

        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#171A18]/85 px-2.5 py-1.5 text-sm">
          <Star size={14} className="fill-[#C7F36B] text-[#C7F36B]" />
          {gym.rating.toFixed(1)}
        </span>
      </Link>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold transition group-hover:text-[#C7F36B]">
              {gym.name}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
              <MapPin size={14} />
              {gym.location}
            </p>
          </div>

          <Link
            href={`/gyms/${gym.id}`}
            aria-label={`View ${gym.name}`}
            className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-[#C7F36B] hover:text-[#C7F36B]"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {gym.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/65"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-white/45">Membership starts at</p>
            <p className="mt-1 text-lg font-semibold text-[#C7F36B]">
              LKR {gym.priceFrom.toLocaleString("en-LK")}
              <span className="ml-1 text-xs font-normal text-white/45">
                / month
              </span>
            </p>
          </div>

          <Link
            href={`/gyms/${gym.id}`}
            className="text-sm font-medium text-white/80 transition hover:text-[#C7F36B]"
          >
            View gym
          </Link>
        </div>
      </div>
    </article>
  );
}