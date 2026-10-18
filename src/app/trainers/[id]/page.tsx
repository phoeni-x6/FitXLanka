
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
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

type Props = {
  params: Promise<{ id: string }>;
};

type TrainerProfile = {
  id: string;
  full_name: string;
  specialty: string | null;
  bio: string | null;
  location: string | null;
  experience_years: number | null;
  price_per_session: number | string | null;
  profile_image_url: string | null;
};

export default async function TrainerProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = createClient();

  const { data, error } = await supabase
    .from("trainer_profiles")
    .select(
      "id, full_name, specialty, bio, location, experience_years, price_per_session, profile_image_url"
    )
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load trainer profile:", error);
    throw new Error(
      "Unable to load this trainer profile. Please try again."
    );
  }

  if (!data) {
    notFound();
  }

  const trainer = data as TrainerProfile;
  const name = trainer.full_name || "Personal Trainer";
  const specialty = trainer.specialty?.trim() || "Personal Training";
  const location = trainer.location?.trim() || "Location not specified";
  const experience = Number(trainer.experience_years ?? 0);
  const price = Number(trainer.price_per_session ?? 0);
  const description =
    trainer.bio?.trim() ||
    `${name} is listed on FitXLanka. Contact the trainer to learn more about their coaching approach, experience, and available training options.`;

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
            <div className="relative flex h-[350px] items-center justify-center overflow-hidden bg-[#1C201D] sm:h-[480px]">
              {trainer.profile_image_url ? (
                <img
                  src={trainer.profile_image_url}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-white/30">
                  <Dumbbell size={64} />
                  <span className="text-sm">Profile photo not available</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#C7F36B]" />
                Trainer profile
              </div>

              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                <div className="mb-3">
                  <span className="inline-flex rounded-full bg-[#C7F36B] px-3 py-1.5 text-xs font-bold text-[#171A18]">
                    {specialty}
                  </span>
                </div>

                <h1 className="break-words text-3xl font-black sm:text-5xl">
                  {name}
                </h1>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                  <MapPin
                    size={17}
                    className="shrink-0 text-[#C7F36B]"
                  />
                  {location}
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">
              <div className="rounded-2xl border border-white/10 p-4">
                <Clock3 className="mb-3 text-[#C7F36B]" size={22} />
                <p className="text-xs text-gray-400">Experience</p>
                <p className="mt-1 font-bold">
                  {experience > 0
                    ? `${experience} ${experience === 1 ? "year" : "years"}`
                    : "Not specified"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-4">
                <Dumbbell className="mb-3 text-[#C7F36B]" size={22} />
                <p className="text-xs text-gray-400">Specialty</p>
                <p className="mt-1 break-words font-bold">{specialty}</p>
              </div>

              <div className="rounded-2xl border border-white/10 p-4">
                <MapPin className="mb-3 text-[#C7F36B]" size={22} />
                <p className="text-xs text-gray-400">Location</p>
                <p className="mt-1 break-words font-bold">{location}</p>
              </div>
            </div>
          </div>

          {/* Booking card */}
          <aside className="rounded-3xl border border-white/10 bg-[#222723] p-6 lg:sticky lg:top-28">
            <p className="text-sm text-gray-400">Session price</p>

            {price > 0 ? (
              <>
                <p className="mt-2 text-3xl font-black">
                  LKR {price.toLocaleString("en-LK")}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Per session · Confirm final pricing with the trainer
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-2xl font-black text-[#C7F36B]">
                  Contact for price
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Ask the trainer about session fees.
                </p>
              </>
            )}

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
                    Discuss training tailored to your fitness goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays
                  size={19}
                  className="mt-0.5 shrink-0 text-[#C7F36B]"
                />
                <div>
                  <p className="text-sm font-semibold">Request a session</p>
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
                  <p className="text-sm font-semibold">Confirm your details</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Confirm the session arrangements before payment.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/bookings?trainer=${encodeURIComponent(trainer.id)}`}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-4 text-sm font-bold text-[#171A18] transition hover:bg-white"
            >
              Request booking <ArrowRight size={17} />
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Contact the trainer to confirm availability, location, and
              final session details.
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
            About {name.split(" ")[0]}
          </h2>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-400">
            {description}
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="flex items-center gap-2 font-bold">
              <Award size={19} className="text-[#C7F36B]" />
              Training focus
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
                {specialty}
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
            Use your booking request to communicate your goals and preferred
            session time. Confirm the location, session duration, availability,
            and final price with the trainer before making payment.
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
