
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Star,
  Clock3,
} from "lucide-react";
import type { Trainer } from "@/data/trainers";

type Props = {
  trainer: Trainer;
};

export default function TrainerCard({ trainer }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#222723] transition duration-300 hover:-translate-y-1 hover:border-[#C7F36B]/40">
      <Link
        href={`/trainers/${trainer.id}`}
        className="relative block h-64 overflow-hidden"
        aria-label={`View ${trainer.name}'s profile`}
      >
        <img
          src={trainer.image}
          alt={trainer.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          <Star
            size={13}
            className="fill-[#C7F36B] text-[#C7F36B]"
          />
          {trainer.rating.toFixed(1)}
        </div>

        <div className="absolute bottom-3 left-3">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              trainer.available
                ? "bg-[#C7F36B] text-[#171A18]"
                : "bg-black/70 text-gray-200"
            }`}
          >
            {trainer.available ? "Available" : "Availability unconfirmed"}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white">
          {trainer.name}
        </h3>

        <p className="mt-1 text-sm text-[#C7F36B]">
          {trainer.specialty}
        </p>

        <div className="mt-4 space-y-2 text-xs text-gray-400">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" />
            {trainer.location}, Sri Lanka
          </p>
          <p className="flex items-center gap-2">
            <Clock3 size={14} className="shrink-0" />
            {trainer.experience}
          </p>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-gray-400">
              Price per session
            </p>
            <p className="mt-1 font-black text-white">
              LKR {trainer.price.toLocaleString("en-LK")}
            </p>
          </div>

          <Link
            href={`/trainers/${trainer.id}`}
            className="inline-flex items-center gap-1 rounded-xl bg-[#C7F36B] px-3 py-2.5 text-xs font-bold text-[#171A18] transition hover:bg-white"
          >
            View profile
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
