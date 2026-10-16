
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Dumbbell,
  ImagePlus,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const categories = [
  "General Fitness",
  "Bodybuilding",
  "Strength & Conditioning",
  "CrossFit",
  "Functional Training",
  "Premium Fitness",
  "Sports Performance",
  "Yoga & Wellness",
  "Other",
];

const facilityOptions = [
  "Free weights",
  "Strength machines",
  "Cardio zone",
  "Personal training",
  "Group classes",
  "Changing rooms",
  "Showers",
  "Parking",
  "Recovery area",
  "Air conditioning",
];

type ExistingApplication = {
  id: string;
  gym_name: string;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
};

const statusStyles = {
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  approved: "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B]",
  rejected: "border-red-400/20 bg-red-400/10 text-red-300",
};

export default function GymApplicationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingApplication, setExistingApplication] =
    useState<ExistingApplication | null>(null);
  const [pageError, setPageError] = useState("");
  const [success, setSuccess] = useState(false);

  const [gymName, setGymName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("General Fitness");
  const [priceFrom, setPriceFrom] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [galleryText, setGalleryText] = useState("");

  useEffect(() => {
    let active = true;

    async function checkUserAndApplication() {
      setLoading(true);
      setPageError("");

      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          router.replace("/login?next=/gyms/apply");
          return;
        }

        if (!active) return;

        setUserId(user.id);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (!active) return;

        if (profile.role !== "client" && profile.role !== "gym_owner") {
          setPageError(
            "Only client accounts can submit a gym application. If your account has another role, please contact an administrator."
          );
          return;
        }

        const { data: application, error: applicationError } = await supabase
          .from("gym_applications")
          .select("id, gym_name, status, admin_notes")
          .eq("user_id", user.id)
          .maybeSingle();

        if (applicationError) throw applicationError;

        if (active && application) {
          setExistingApplication(application as ExistingApplication);
        }
      } catch (error) {
        console.error("Unable to prepare gym application:", error);

        if (active) {
          setPageError(
            error instanceof Error
              ? error.message
              : "Unable to load the application form. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void checkUserAndApplication();

    return () => {
      active = false;
    };
  }, [router]);

  function toggleFeature(feature: string) {
    setFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPageError("");

    if (!userId) {
      setPageError("Your session has expired. Please sign in again.");
      return;
    }

    if (existingApplication) {
      setPageError("You have already submitted a gym application.");
      return;
    }

    const price = Number(priceFrom);

    if (!Number.isFinite(price) || price < 0) {
      setPageError("Enter a valid monthly membership starting price.");
      return;
    }

    if (mainImageUrl.trim()) {
      try {
        const url = new URL(mainImageUrl.trim());

        if (url.protocol !== "https:" && url.protocol !== "http:") {
          throw new Error("Invalid URL protocol");
        }
      } catch {
        setPageError("Enter a valid image URL, or leave that field empty.");
        return;
      }
    }

    const galleryImages = galleryText
      .split(/\n|,/)
      .map((url) => url.trim())
      .filter(Boolean);

    for (const galleryUrl of galleryImages) {
      try {
        const url = new URL(galleryUrl);

        if (url.protocol !== "https:" && url.protocol !== "http:") {
          throw new Error("Invalid URL protocol");
        }
      } catch {
        setPageError(
          `This gallery image URL is invalid: ${galleryUrl}`
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user || authData.user.id !== userId) {
        throw new Error("Your session has changed. Please sign in again.");
      }

      const { error } = await supabase.from("gym_applications").insert({
        user_id: userId,
        gym_name: gymName.trim(),
        description: description.trim() || null,
        location: location.trim(),
        category,
        price_from: price,
        features,
        main_image_url: mainImageUrl.trim() || null,
        gallery_images: galleryImages,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error(
            "You already have a gym application. Check its status instead."
          );
        }

        throw error;
      }

      setSuccess(true);
    } catch (error) {
      console.error("Gym application submission failed:", error);

      setPageError(
        error instanceof Error
          ? error.message
          : "Your application could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#171A18] px-4 py-8 text-[#F4F5F0] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <header className="mb-8 mt-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B]">
            <Building2 size={28} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#C7F36B]">
            FitXLanka Partner Programme
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Register your gym
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Introduce your fitness facility to the FitXLanka community.
            Submit your details for review, and our administration team will
            assess your application before publishing your listing.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-[#222723] p-12 text-sm text-white/60">
            <LoaderCircle size={20} className="animate-spin" />
            Checking your account...
          </div>
        ) : success ? (
          <section className="rounded-2xl border border-[#C7F36B]/20 bg-[#222723] p-6 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C7F36B]/10 text-[#C7F36B]">
              <CheckCircle2 size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Application submitted
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
              Your application for{" "}
              <strong className="text-white/85">{gymName}</strong> has been
              submitted successfully. It is now awaiting administrator review.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
              <Clock3 size={16} />
              Pending review
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/gyms/application-status")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5ff84]"
              >
                View application status
                <ArrowRight size={16} />
              </button>

              <Link
                href="/"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5"
              >
                Back to home
              </Link>
            </div>
          </section>
        ) : existingApplication ? (
          <section className="rounded-2xl border border-white/[0.08] bg-[#222723] p-6 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C7F36B]/10 text-[#C7F36B]">
              <Building2 size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              You already have an application
            </h2>

            <p className="mt-2 text-sm text-white/55">
              Application for{" "}
              <strong className="text-white/85">
                {existingApplication.gym_name}
              </strong>
            </p>

            <span
              className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles[existingApplication.status]}`}
            >
              {existingApplication.status.toUpperCase()}
            </span>

            {existingApplication.admin_notes && (
              <p className="mt-4 text-sm leading-6 text-white/55">
                Administrator notes: {existingApplication.admin_notes}
              </p>
            )}

            <div className="mt-7">
              <button
                onClick={() => router.push("/gyms/application-status")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5ff84]"
              >
                Check application status
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {pageError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
                <XCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-red-300"
                />
                <p className="break-words text-sm leading-6 text-red-200/80">
                  {pageError}
                </p>
              </div>
            )}

            {/* Basic details */}
            <section className="rounded-2xl border border-white/[0.08] bg-[#222723] p-5 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-white/[0.05] p-2.5 text-[#C7F36B]">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">Gym information</h2>
                  <p className="mt-1 text-xs text-white/40">
                    Tell us about your facility.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="gymName"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Gym name <span className="text-[#C7F36B]">*</span>
                  </label>
                  <input
                    id="gymName"
                    required
                    maxLength={120}
                    value={gymName}
                    onChange={(event) => setGymName(event.target.value)}
                    placeholder="e.g. Iron House Fitness"
                    className="w-full rounded-xl border border-white/10 bg-[#171A18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C7F36B]/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Gym description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    maxLength={2000}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe your gym, training environment, equipment and membership experience..."
                    className="w-full resize-y rounded-xl border border-white/10 bg-[#171A18] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#C7F36B]/50"
                  />
                  <p className="mt-2 text-right text-xs text-white/30">
                    {description.length}/2000
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75"
                    >
                      <MapPin size={15} />
                      Gym location *
                    </label>
                    <input
                      id="location"
                      required
                      maxLength={200}
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="e.g. Nugegoda, Colombo"
                      className="w-full rounded-xl border border-white/10 bg-[#171A18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C7F36B]/50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-medium text-white/75"
                    >
                      Gym category *
                    </label>
                    <select
                      id="category"
                      required
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#171A18] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C7F36B]/50"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="priceFrom"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Starting monthly membership price (LKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/40">
                      LKR
                    </span>
                    <input
                      id="priceFrom"
                      required
                      type="number"
                      min="0"
                      max="10000000"
                      step="0.01"
                      value={priceFrom}
                      onChange={(event) => setPriceFrom(event.target.value)}
                      placeholder="5000"
                      className="w-full rounded-xl border border-white/10 bg-[#171A18] py-3 pl-14 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C7F36B]/50"
                    />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-white/35">
                    Enter the lowest price for a standard one-month membership.
                  </p>
                </div>
              </div>
            </section>

            {/* Facilities */}
            <section className="rounded-2xl border border-white/[0.08] bg-[#222723] p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-white/[0.05] p-2.5 text-[#C7F36B]">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">Facilities and equipment</h2>
                  <p className="mt-1 text-xs text-white/40">
                    Select everything available at your gym.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {facilityOptions.map((facility) => {
                  const checked = features.includes(facility);

                  return (
                    <label
                      key={facility}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition ${
                        checked
                          ? "border-[#C7F36B]/30 bg-[#C7F36B]/5 text-[#F4F5F0]"
                          : "border-white/[0.08] bg-[#171A18] text-white/60 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFeature(facility)}
                        className="h-4 w-4 accent-[#C7F36B]"
                      />
                      {facility}
                    </label>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-white/35">
                {features.length} facilities selected
              </p>
            </section>

            {/* Images */}
            <section className="rounded-2xl border border-white/[0.08] bg-[#222723] p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-white/[0.05] p-2.5 text-[#C7F36B]">
                  <ImagePlus size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">Gym photos</h2>
                  <p className="mt-1 text-xs text-white/40">
                    Add image URLs to showcase your facility.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="mainImageUrl"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Main gym image URL
                  </label>
                  <input
                    id="mainImageUrl"
                    type="url"
                    maxLength={2048}
                    value={mainImageUrl}
                    onChange={(event) => setMainImageUrl(event.target.value)}
                    placeholder="https://example.com/gym-photo.jpg"
                    className="w-full rounded-xl border border-white/10 bg-[#171A18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#C7F36B]/50"
                  />
                  <p className="mt-2 text-xs leading-5 text-white/35">
                    Optional. Paste a publicly accessible image URL. File
                    uploads can be added later using Supabase Storage.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="galleryText"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Gallery image URLs
                  </label>
                  <textarea
                    id="galleryText"
                    rows={3}
                    value={galleryText}
                    onChange={(event) => setGalleryText(event.target.value)}
                    placeholder={"https://example.com/gym-interior.jpg\nhttps://example.com/equipment.jpg"}
                    className="w-full resize-y rounded-xl border border-white/10 bg-[#171A18] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#C7F36B]/50"
                  />
                  <p className="mt-2 text-xs leading-5 text-white/35">
                    Optional. Enter one URL per line, or separate URLs with
                    commas.
                  </p>
                </div>
              </div>
            </section>

            {/* Review information */}
            <div className="flex items-start gap-3 rounded-xl border border-[#C7F36B]/15 bg-[#C7F36B]/[0.04] p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#C7F36B]"
              />
              <div>
                <p className="text-sm font-medium text-white/80">
                  Administrator review required
                </p>
                <p className="mt-1 text-xs leading-5 text-white/45">
                  Your gym will not be published simply by submitting this
                  form. An administrator must approve the application first.
                  Make sure your information and images are accurate.
                </p>
              </div>
            </div>

            {pageError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
                <XCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-red-300"
                />
                <p className="break-words text-sm leading-6 text-red-200/80">
                  {pageError}
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/65 transition hover:bg-white/5"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-6 py-3 text-sm font-bold text-[#171A18] transition hover:bg-[#d5ff84] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Submitting application...
                  </>
                ) : (
                  <>
                    Submit gym application
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <footer className="mt-10 flex flex-col gap-2 border-t border-white/[0.08] pt-5 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} FitXLanka</span>
          <span>Helping Sri Lankan fitness communities connect.</span>
        </footer>
      </div>
    </main>
  );
}
