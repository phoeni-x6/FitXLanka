import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Dumbbell,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GymGallery from "@/components/gyms/GymGallery";
import { gyms } from "@/data/gyms";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GymProfilePage({ params }: Props) {
  const { id } = await params;
  const gym = gyms.find((item) => item.id === Number(id));

  if (!gym) {
    notFound();
  }

  const galleryImages =
    gym.gallery?.length > 0 ? gym.gallery : [gym.image];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] text-[#F4F5F0]">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            href="/gyms"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
          >
            <ArrowLeft size={16} />
            Back to gyms
          </Link>
        </div>

        {/* Gym heading */}
        <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-[#C7F36B]/20 bg-[#C7F36B]/10 px-3 py-1.5 text-xs font-medium text-[#C7F36B]">
                {gym.category}
              </span>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                {gym.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#C7F36B]" />
                  {gym.location}
                </span>

                <span className="flex items-center gap-1.5">
                  <Star
                    size={16}
                    className="fill-[#C7F36B] text-[#C7F36B]"
                  />
                  {gym.rating.toFixed(1)}
                  <span className="text-white/40">demo rating</span>
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <p className="text-xs text-white/40">
                Monthly membership from
              </p>
              <p className="mt-1 text-xl font-semibold text-[#C7F36B]">
                LKR {gym.priceFrom.toLocaleString("en-LK")}
                <span className="ml-1 text-sm font-normal text-white/40">
                  / month
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Gym photo gallery */}
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <GymGallery
            name={gym.name}
            images={galleryImages}
          />
        </section>

        {/* Main content */}
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="space-y-8">
            {/* About */}
            <div className="rounded-2xl border border-white/10 bg-[#222723] p-6 sm:p-8">
              <p className="text-sm font-medium text-[#C7F36B]">
                ABOUT THIS GYM
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Your next step starts here
              </h2>

              <p className="mt-4 leading-7 text-white/55">
                Explore the facilities and training options available at{" "}
                {gym.name}. Compare membership costs and find out whether
                this gym fits your training routine and fitness goals.
              </p>

              <p className="mt-3 text-sm leading-6 text-white/40">
                This is a demonstration profile. Contact details,
                opening hours, exact facilities, and other gym information
                will be added when verified listings become available.
              </p>
            </div>

            {/* Facilities */}
            <div className="rounded-2xl border border-white/10 bg-[#222723] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
                  <Dumbbell size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Facilities &amp; features
                  </h2>
                  <p className="mt-1 text-sm text-white/45">
                    Listed features for this demo profile
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {gym.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#171A18] p-4"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-[#C7F36B]"
                    />
                    <span className="text-sm text-white/75">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-white/10 bg-[#222723] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <MapPin size={21} className="text-[#C7F36B]" />
                <h2 className="text-xl font-semibold">Location</h2>
              </div>

              <p className="mt-4 text-white/65">{gym.location}</p>

              <p className="mt-2 text-sm leading-6 text-white/40">
                A full address and map can be added once the gym owner
                submits their verified business details.
              </p>
            </div>
          </div>

          {/* Membership card */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#222723] p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <ShieldCheck size={17} className="text-[#C7F36B]" />
              Membership information
            </div>

            <p className="mt-6 text-sm text-white/50">
              Monthly membership from
            </p>

            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-semibold text-[#C7F36B]">
                LKR {gym.priceFrom.toLocaleString("en-LK")}
              </span>
              <span className="text-sm text-white/40">/ month</span>
            </div>

            <p className="mt-3 text-sm leading-6 text-white/45">
              This is an indicative demo price, not a confirmed offer.
              Actual plans and fees may differ.
            </p>

            <div className="my-6 border-t border-white/10" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 text-white/40" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="mt-1 text-sm text-white/50">
                    {gym.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Star size={17} className="mt-0.5 text-white/40" />
                <div>
                  <p className="text-sm font-medium">Demo rating</p>
                  <p className="mt-1 text-sm text-white/50">
                    {gym.rating.toFixed(1)} / 5.0
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={17} className="mt-0.5 text-white/40" />
                <div>
                  <p className="text-sm font-medium">Opening hours</p>
                  <p className="mt-1 text-sm text-white/50">
                    To be confirmed
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/bookings?gym=${gym.id}`}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-3.5 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
            >
              Continue to booking
              <ArrowUpRight size={17} />
            </Link>

            <p className="mt-3 text-center text-xs leading-5 text-white/35">
              Booking functionality will be connected in the next stage.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}