"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { trainers } from "@/data/trainers";

export default function SavedTrainers() {
  const savedTrainers = trainers.slice(0, 2);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#F4F5F0]">
            Recommended trainers
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Find a coach for your goals.
          </p>
        </div>

        <Link
          href="/trainers"
          aria-label="Explore all trainers"
          className="rounded-lg p-2 text-[#C7F36B] hover:bg-white/5"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {savedTrainers.map((trainer) => (
          <div key={trainer.id} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
              <Image
                src={trainer.image}
                alt={trainer.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/trainers/${trainer.id}`}
                className="truncate font-medium text-white hover:text-[#C7F36B]"
              >
                {trainer.name}
              </Link>

              <p className="mt-1 truncate text-xs text-white/50">
                {trainer.specialty}
              </p>

              <div className="mt-1 flex items-center gap-3 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {trainer.location}
                </span>

                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#C7F36B] text-[#C7F36B]" />
                  {trainer.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <p className="shrink-0 text-sm font-semibold text-[#C7F36B]">
              LKR {trainer.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-white/35">
        Recommendations are mock data; favorites are not saved yet.
      </p>
    </section>
  );
}