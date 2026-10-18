
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Dumbbell,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GymGallery from "@/components/gyms/GymGallery";
import { createClient } from "@/lib/supabase/client";

type Props = {
  params: Promise<{ id: string }>;
};

type GymProfile = {
  id: string;
  gym_name: string;
  description: string | null;
  location: string;
  category: string | null;
  price_from: number | string | null;
  features: string[] | null;
  main_image_url: string | null;
  gallery_images: string[] | null;
};

export default async function GymProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = createClient();

  const { data, error } = await supabase
    .from("gym_profiles")
    .select(
      "id, gym_name, description, location, category, price_from, features, main_image_url, gallery_images"
    )
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load gym profile:", error);
    throw new Error("Unable to load this gym profile. Please try again.");
  }

  if (!data) {
    notFound();
  }

  const gym = data as GymProfile;
  const priceFrom = Number(gym.price_from ?? 0);

  const galleryImages = Array.from(
    new Set(
      [gym.main_image_url, ...(gym.gallery_images ?? [])].filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0
      )
    )
  );

  const features = gym.features ?? [];
  const description =
    gym.description?.trim() ||
    "Contact this gym to learn more about its training facilities, membership options, and available services.";

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
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-[#C7F36B]/20 bg-[#C7F36B]/10 px-3 py-1.5 text-xs font-medium text-[#C7F36B]">
                {gym.category || "Fitness Centre"}
              </span>

              <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight sm:text-5xl">
                {gym.gym_name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="shrink-0 text-[#C7F36B]" />
                  {gym.location}
                </span>

                <span className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-[#C7F36B]"
                  />
                  Listed on FitXLanka
                </span>
              </div>
            </div>

            <div className="shrink-0 rounded-xl border border-white/10 bg-[#222723] px-5 py-4">
              <p className="text-xs text-white/40">
                Monthly membership from
              </p>

              {priceFrom > 0 ? (
                <p className="mt-1 text-xl font-semibold text-[#C7F36B]">
                  LKR {priceFrom.toLocaleString("en-LK")}
                  <span className="ml-1 text-sm font-normal text-white/40">
                    / month
                  </span>
                </p>
              ) : (
                <p className="mt-1 text-xl font-semibold text-[#C7F36B]">
                  Contact gym
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Gym photo gallery */}
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <GymGallery
            name={gym.gym_name}
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

              <p className="mt-4 whitespace-pre-line leading-7 text-white/60">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/55">
                  {gym.category || "Fitness Centre"}
                </span>

                <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/55">
                  Sri Lanka
                </span>
              </div>
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
                    Features provided by this gym
                  </p>
                </div>
              </div>

              {features.length > 0 ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <div
                      key={`${feature}-${index}`}
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
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-white/10 p-6 text-center">
                  <Dumbbell
                    size={24}
                    className="mx-auto text-white/30"
                  />
                  <p className="mt-3 text-sm text-white/55">
                    Facility information has not been added yet.
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    Contact the gym to learn about its available equipment
                    and services.
                  </p>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-white/10 bg-[#222723] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
                  <MapPin size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">Location</h2>
                  <p className="mt-1 text-sm text-white/45">
                    Find this gym in your area
                  </p>
                </div>
              </div>

              <p className="mt-5 text-white/75">{gym.location}</p>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Contact the gym for its full address and directions.
              </p>
            </div>
          </div>

          {/* Membership and enquiry card */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#222723] p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-sm text-white/55">
              <ShieldCheck size={17} className="text-[#C7F36B]" />
              Membership information
            </div>

            <p className="mt-6 text-sm text-white/50">
              Monthly membership from
            </p>

            {priceFrom > 0 ? (
              <div className="mt-2">
                <span className="text-3xl font-semibold text-[#C7F36B]">
                  LKR {priceFrom.toLocaleString("en-LK")}
                </span>
                <span className="ml-1 text-sm text-white/40">
                  / month
                </span>
              </div>
            ) : (
              <p className="mt-2 text-2xl font-semibold text-[#C7F36B]">
                Contact gym
              </p>
            )}

            <p className="mt-3 text-sm leading-6 text-white/45">
              {priceFrom > 0
                ? "This is the starting price listed by the gym. Contact the owner to confirm available plans, fees, and membership conditions."
                : "Contact the gym to ask about membership plans, pricing, and available facilities."}
            </p>

            <div className="my-6 border-t border-white/10" />

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-white/40" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">Location</p>
                  <p className="mt-1 break-words text-sm text-white/50">
                    {gym.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Dumbbell size={17} className="mt-0.5 shrink-0 text-white/40" />
                <div>
                  <p className="text-sm font-medium">Gym category</p>
                  <p className="mt-1 text-sm text-white/50">
                    {gym.category || "Fitness Centre"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-white/40"
                />
                <div>
                  <p className="text-sm font-medium">Listed facilities</p>
                  <p className="mt-1 text-sm text-white/50">
                    {features.length > 0
                      ? `${features.length} ${
                          features.length === 1 ? "feature" : "features"
                        } available`
                      : "Not provided yet"}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/bookings?gym=${encodeURIComponent(gym.id)}`}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-3.5 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5fa8b]"
            >
              Contact / Enquire
              <ArrowUpRight size={17} />
            </Link>

            <p className="mt-3 text-center text-xs leading-5 text-white/35">
              Continue to the enquiry page to find out more about this gym.
            </p>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
