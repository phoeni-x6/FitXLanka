
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Clock3,
  Dumbbell,
} from "lucide-react";

export type DirectoryTrainer = {
  id: string;
  name: string;
  specialty: string;
  description: string;
  location: string;
  experienceYears: number;
  price: number;
  image: string | null;
};

type Props = {
  trainer: DirectoryTrainer;
};

export default function TrainerCard({ trainer }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#222723] transition duration-300 hover:-translate-y-1 hover:border-[#C7F36B]/40">
      <Link
        href={`/trainers/${trainer.id}`}
        className="relative block h-64 overflow-hidden bg-[#171A18]"
        aria-label={`View ${trainer.name}'s profile`}
      >
        {trainer.image ? (
          <img
            src={trainer.image}
            alt={trainer.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-white/25">
            <Dumbbell size={42} />
            <span className="text-xs">Profile photo not available</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3">
          <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {trainer.specialty}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <h3 className="break-words text-lg font-bold text-white">
          {trainer.name}
        </h3>

        <p className="mt-1 text-sm text-[#C7F36B]">
          Personal Trainer
        </p>

        {trainer.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
            {trainer.description}
          </p>
        )}

        <div className="mt-4 space-y-2 text-xs text-gray-400">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" />
            {trainer.location}
          </p>

          <p className="flex items-center gap-2">
            <Clock3 size={14} className="shrink-0" />
            {trainer.experienceYears > 0
              ? `${trainer.experienceYears} ${
                  trainer.experienceYears === 1 ? "year" : "years"
                } of experience`
              : "Experience not specified"}
          </p>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-400">
              Price per session
            </p>

            <p className="mt-1 font-black text-white">
              {trainer.price > 0
                ? `LKR ${trainer.price.toLocaleString("en-LK")}`
                : "Contact for price"}
            </p>
          </div>

          <Link
            href={`/trainers/${trainer.id}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[#C7F36B] px-3 py-2.5 text-xs font-bold text-[#171A18] transition hover:bg-white"
          >
            View profile
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
