
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { trainers } from "@/data/trainers";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TrainerProfilePage({ params }: Props) {
  const { id } = await params;

  const trainer = trainers.find((item) => item.id === Number(id));

  if (!trainer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#171A18] text-[#F4F5F0]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <Link
          href="/trainers"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#C7F36B]"
        >
          <ArrowLeft size={16} />
          Back to trainers
        </Link>
      </div>

      {/* Profile header */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#222723]">
            <div className="relative h-[350px] sm:h-[480px]">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#C7F36B]" />
                Trainer profile
              </div>

              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#C7F36B] px-3 py-1.5 text-xs font-bold text-[#171A18]">
                    {trainer.specialty}
                  </span>

                  <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
                    <Star
                      size={13}
                      className="fill-[#C7F36B] text-[#C7F36B]"
                    />
                    {trainer.rating.toFixed(1)} rating
                  </span>
                </div>

                <h1 className="text-3xl font-black sm:text-5xl">
                  {trainer.name}
                </h1>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                  <MapPin size={17} className="text-[#C7F36B]" />
                  {trainer.location}, Sri Lanka
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">
              <div className="rounded-2xl border border-white/10 p-4">
                <Clock3 className="mb-3 text-[#C7F36B]" size={22} />
                <p className="text-xs text-gray-400">Experience</p>
                <p className="mt-1 font-bold">{trainer.experience}</p>
              </div>

              <div className="rounded-2xl border border-white/10 p-4">
                <Star className="mb-3 text-[#C7F36B]" size={22} />
                <p className="text-xs text-gray-400">Rating</p>
                <p className="mt-1 font-bold">
                  {trainer.rating.toFixed(1)} / 5
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-4">
                <MapPin className="mb-3 text-[#C7F36B]" size={22} />
                <p className="text-xs text-gray-400">Location</p>
                <p className="mt-1 font-bold">{trainer.location}</p>
              </div>
            </div>
          </div>

          {/* Booking card */}
          <aside className="rounded-3xl border border-white/10 bg-[#222723] p-6 lg:sticky lg:top-28">
            <p className="text-sm text-gray-400">Session price</p>

            <p className="mt-2 text-3xl font-black">
              LKR {trainer.price.toLocaleString("en-LK")}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Per session · Final pricing to be confirmed
            </p>

            <div className="my-6 border-t border-white/10" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-[#C7F36B]"
                />
                <div>
                  <p className="text-sm font-semibold">Personal coaching</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Training tailored to your fitness goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays
                  size={19}
                  className="mt-0.5 shrink-0 text-[#C7F36B]"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Request a session
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Submit your preferred date and time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-[#C7F36B]"
                />
                <div>
                  <p className="text-sm font-semibold">
                    Review before booking
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Confirm the details before your session.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/bookings?trainer=${trainer.id}`}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-4 text-sm font-bold text-[#171A18] transition hover:bg-white"
            >
              Request booking <ArrowRight size={17} />
            </Link>

            {!trainer.available && (
              <p className="mt-3 text-center text-xs text-amber-300">
                Availability has not been confirmed. Check before requesting.
              </p>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              This is a demonstration listing. Trainer details and
              availability have not been verified.
            </p>
          </aside>
        </div>
      </section>

      {/* About and specialties */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-[#222723] p-6 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-[#C7F36B]">
            GET TO KNOW YOUR COACH
          </p>

          <h2 className="mt-3 text-2xl font-black">
            About {trainer.name.split(" ")[0]}
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-400">
            Looking to improve your fitness with guidance from a
            personal trainer? {trainer.name} focuses on{" "}
            {trainer.specialty.toLowerCase()} and is listed in{" "}
            {trainer.location}. Explore the coaching options, review
            the session price, and submit a booking request to discuss
            your goals and training requirements.
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="flex items-center gap-2 font-bold">
              <Award size={19} className="text-[#C7F36B]" />
              Training focus
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
                {trainer.specialty}
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
                Personal training
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
                Fitness coaching
              </span>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-3xl border border-white/10 bg-[#222723] p-6 sm:p-8">
          <h2 className="text-xl font-black">Before you book</h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Use your booking request to communicate your goals and
            preferred session time. Confirm the location, session
            duration and final price with the trainer before making
            payment.
          </p>

          <Link
            href="/trainers"
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#C7F36B] hover:text-white"
          >
            Explore other trainers <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
