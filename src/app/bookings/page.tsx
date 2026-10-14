import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Dumbbell, MapPin } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingForm from "@/components/bookings/BookingForm";
import { trainers } from "@/data/trainers";
import { gyms } from "@/data/gyms";

type Props = {
  searchParams: Promise<{
    trainer?: string;
    gym?: string;
  }>;
};

export default async function BookingsPage({ searchParams }: Props) {
  const params = await searchParams;

  // Trainer booking
  if (params.trainer) {
    const trainer = trainers.find(
      (item) => item.id === Number(params.trainer)
    );

    if (!trainer) notFound();

    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#171A18] px-4 py-10 text-[#F4F5F0] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Link
              href={`/trainers/${trainer.id}`}
              className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
            >
              <ArrowLeft size={16} />
              Back to trainer
            </Link>

            <div className="mb-8">
              <p className="text-sm font-medium text-[#C7F36B]">
                BOOK A TRAINING SESSION
              </p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Let’s plan your next session.
              </h1>
              <p className="mt-3 leading-7 text-white/50">
                Choose your preferred date and time with {trainer.name}.
              </p>
            </div>

            <BookingForm
              listingType="trainer"
              listingId={trainer.id}
              listingName={trainer.name}
              location={trainer.location}
              price={trainer.price}
            />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Gym visit or membership enquiry
  if (params.gym) {
    const gym = gyms.find((item) => item.id === Number(params.gym));

    if (!gym) notFound();

    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#171A18] px-4 py-10 text-[#F4F5F0] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Link
              href={`/gyms/${gym.id}`}
              className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
            >
              <ArrowLeft size={16} />
              Back to gym
            </Link>

            <div className="mb-8">
              <p className="text-sm font-medium text-[#C7F36B]">
                GYM VISIT & MEMBERSHIP
              </p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Find your place to train.
              </h1>
              <p className="mt-3 leading-7 text-white/50">
                Arrange a visit or enquire about membership at {gym.name}.
              </p>
            </div>

            <BookingForm
              listingType="gym"
              listingId={gym.id}
              listingName={gym.name}
              location={gym.location}
              price={gym.priceFrom}
            />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // If the visitor opens /bookings without selecting a listing
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#171A18] px-4 py-16 text-[#F4F5F0] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium text-[#C7F36B]">
            YOUR FITNESS JOURNEY
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">
            What would you like to book?
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/50">
            Choose a personal trainer for individual coaching, or find a
            gym that suits your routine.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Link
              href="/trainers"
              className="group rounded-2xl border border-white/10 bg-[#222723] p-6 transition hover:border-[#C7F36B]/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
                <Dumbbell size={23} />
              </div>
              <h2 className="mt-5 text-xl font-semibold transition group-hover:text-[#C7F36B]">
                Book a personal trainer
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Explore trainers, compare their specialties, and prepare
                a training session request.
              </p>
              <span className="mt-5 inline-block text-sm font-medium text-[#C7F36B]">
                Explore trainers →
              </span>
            </Link>

            <Link
              href="/gyms"
              className="group rounded-2xl border border-white/10 bg-[#222723] p-6 transition hover:border-[#C7F36B]/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
                <MapPin size={23} />
              </div>
              <h2 className="mt-5 text-xl font-semibold transition group-hover:text-[#C7F36B]">
                Find a gym
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Browse gyms, compare indicative membership prices, and
                prepare a visit or membership enquiry.
              </p>
              <span className="mt-5 inline-block text-sm font-medium text-[#C7F36B]">
                Explore gyms →
              </span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}