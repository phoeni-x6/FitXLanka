
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Dumbbell,
  MapPin,
  UserRound,
  Wallet,
  LoaderCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const specialties = [
  "Weight Training",
  "Bodybuilding",
  "Weight Loss",
  "Strength Training",
  "Personal Training",
  "Functional Fitness",
  "Calisthenics",
  "Yoga",
  "Cardio & Endurance",
  "Sports Conditioning",
  "Other",
];

export default function TrainerApplicationPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    specialty: "",
    location: "",
    experience_years: "",
    price_per_session: "",
    bio: "",
    profile_image_url: "",
  });

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#171A18] px-4 py-3.5 text-sm text-[#F4F5F0] outline-none transition duration-200 placeholder:text-white/30 hover:border-white/20 focus:border-[#C7F36B]/70 focus:ring-2 focus:ring-[#C7F36B]/10";

  const labelClass = "text-sm font-medium text-[#F4F5F0]";

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!formData.specialty) {
      setError("Please select your training specialty.");
      return;
    }

    const experience = Number(formData.experience_years);
    const price = Number(formData.price_per_session);

    if (
      !Number.isInteger(experience) ||
      experience < 0 ||
      experience > 80
    ) {
      setError("Enter a valid number of years of experience.");
      return;
    }

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      price > 10000000
    ) {
      setError("Enter a valid session price.");
      return;
    }

    if (
      formData.profile_image_url &&
      !/^https?:\/\/\S+$/i.test(formData.profile_image_url)
    ) {
      setError("Please enter a valid profile image URL.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login?redirectTo=/trainers/apply");
        router.refresh();
        return;
      }

      const { error: insertError } = await supabase
        .from("trainer_applications")
        .insert({
          user_id: user.id,
          full_name: formData.full_name.trim(),
          specialty: formData.specialty,
          location: formData.location.trim(),
          experience_years: experience,
          price_per_session: price,
          bio: formData.bio.trim() || null,
          profile_image_url:
            formData.profile_image_url.trim() || null,
          status: "pending",
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError(
            "You may already have an application. Please check your application status."
          );
        } else {
          setError(insertError.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171A18] px-4 py-12 text-[#F4F5F0]">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#222723] p-8 text-center shadow-2xl sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#C7F36B]/[0.06] blur-3xl" />

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#C7F36B]/20 bg-[#C7F36B]/10">
            <CheckCircle2 className="h-10 w-10 text-[#C7F36B]" />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-[#C7F36B]">
            Application submitted
          </p>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#F4F5F0] sm:text-4xl">
            You&apos;re one step closer.
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/55">
            Thanks for applying to join FitX Lanka. Your application
            has been submitted successfully and is waiting for admin
            review.
          </p>

          <div className="mt-7 flex items-center justify-center gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] px-4 py-4">
            <Clock className="h-5 w-5 text-amber-300" />
            <div className="text-left">
              <p className="text-sm font-semibold text-[#F4F5F0]">
                Pending review
              </p>
              <p className="mt-1 text-xs text-white/45">
                We&apos;ll review your application before approval.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/trainers"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#C7F36B] px-5 py-3.5 text-sm font-bold text-[#171A18] transition hover:bg-[#D6FF84]"
            >
              Explore trainers
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/"
              className="flex flex-1 items-center justify-center rounded-full border border-white/10 px-5 py-3.5 text-sm font-semibold text-[#F4F5F0] transition hover:border-white/20 hover:bg-white/5"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#171A18] text-[#F4F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-[#C7F36B]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        <div className="mt-8 grid items-start gap-8 lg:mt-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left introduction panel */}
          <section className="lg:sticky lg:top-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C7F36B]/20 bg-[#C7F36B]/[0.07] px-3.5 py-2 text-xs font-semibold tracking-wide text-[#C7F36B]">
              <Dumbbell className="h-4 w-4" />
              FITX LANKA TRAINER NETWORK
            </div>

            <h1 className="mt-7 text-4xl font-bold leading-[1.12] tracking-tight text-[#F4F5F0] sm:text-5xl xl:text-6xl">
              Turn your passion into{" "}
              <span className="text-[#C7F36B]">
                your profession.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/55">
              Bring your expertise to a growing fitness community.
              Connect with people across Sri Lanka and help them
              become stronger, healthier, and more confident.
            </p>

            <div className="mt-9 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#222723]">
                  <BadgeCheck className="h-5 w-5 text-[#C7F36B]" />
                </div>

                <div className="pt-0.5">
                  <h3 className="font-semibold text-[#F4F5F0]">
                    Verified trainer profiles
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-white/45">
                    Applications are reviewed before a trainer
                    receives verified status.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#222723]">
                  <UserRound className="h-5 w-5 text-[#C7F36B]" />
                </div>

                <div className="pt-0.5">
                  <h3 className="font-semibold text-[#F4F5F0]">
                    Showcase your expertise
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-white/45">
                    Introduce your specialties, experience, and
                    approach to fitness.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#222723]">
                  <Wallet className="h-5 w-5 text-[#C7F36B]" />
                </div>

                <div className="pt-0.5">
                  <h3 className="font-semibold text-[#F4F5F0]">
                    Set your session rate
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-white/45">
                    Share your intended session price in Sri Lankan
                    rupees.
                  </p>
                </div>
              </div>
            </div>

            {/* Application reminder */}
            <div className="mt-9 rounded-2xl border border-white/[0.07] bg-[#222723] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C7F36B]" />
                <p className="text-sm font-semibold text-[#F4F5F0]">
                  Before you apply
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-white/45">
                Make sure your details are accurate. You must be
                signed in to submit your application. Submission
                does not automatically grant trainer privileges.
              </p>
            </div>

            <div className="mt-6 hidden items-center gap-2 text-xs text-white/25 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C7F36B]" />
              Built for Sri Lanka&apos;s fitness community
            </div>
          </section>

          {/* Right application form */}
          <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#222723] shadow-2xl shadow-black/10">
            {/* Form header */}
            <div className="border-b border-white/[0.07] p-5 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C7F36B]">
                    Trainer registration
                  </p>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#F4F5F0] sm:text-3xl">
                    Your application
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Tell us about yourself and your fitness expertise.
                  </p>
                </div>

                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C7F36B]/15 bg-[#C7F36B]/[0.06] sm:flex">
                  <Dumbbell className="h-5 w-5 text-[#C7F36B]" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-[#C7F36B]" />
                <div className="h-1 flex-1 rounded-full bg-white/10" />
                <div className="h-1 flex-1 rounded-full bg-white/10" />
              </div>

              <p className="mt-2 text-[11px] text-white/35">
                Application details · Complete all required fields
              </p>
            </div>

            <div className="p-5 sm:p-8">
              {error && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-300"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="break-words">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal information */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C7F36B]/10 text-xs font-bold text-[#C7F36B]">
                      01
                    </span>
                    <h3 className="font-semibold text-[#F4F5F0]">
                      Personal information
                    </h3>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label htmlFor="full_name" className={labelClass}>
                        Full name <span className="text-[#C7F36B]">*</span>
                      </label>

                      <input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        maxLength={120}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className={labelClass}>
                        City or district{" "}
                        <span className="text-[#C7F36B]">*</span>
                      </label>

                      <div className="relative">
                        <MapPin className="absolute left-4 top-[26px] h-4 w-4 text-white/35" />

                        <input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className={`${inputClass} pl-11`}
                          placeholder="e.g. Colombo, Gampaha, Kandy"
                          maxLength={150}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional information */}
                <div className="border-t border-white/[0.07] pt-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C7F36B]/10 text-xs font-bold text-[#C7F36B]">
                      02
                    </span>
                    <h3 className="font-semibold text-[#F4F5F0]">
                      Professional details
                    </h3>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label htmlFor="specialty" className={labelClass}>
                        Primary training specialty{" "}
                        <span className="text-[#C7F36B]">*</span>
                      </label>

                      <select
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="" disabled>
                          Select your specialty
                        </option>

                        {specialties.map((specialty) => (
                          <option
                            key={specialty}
                            value={specialty}
                            className="bg-[#222723] text-[#F4F5F0]"
                          >
                            {specialty}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="experience_years"
                        className={labelClass}
                      >
                        Years of experience{" "}
                        <span className="text-[#C7F36B]">*</span>
                      </label>

                      <input
                        id="experience_years"
                        name="experience_years"
                        type="number"
                        min="0"
                        max="80"
                        step="1"
                        value={formData.experience_years}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="e.g. 3"
                        required
                      />

                      <p className="mt-2 text-xs leading-5 text-white/35">
                        Enter 0 if you are just starting your professional
                        career.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="bio" className={labelClass}>
                        About you{" "}
                        <span className="font-normal text-white/35">
                          (Optional)
                        </span>
                      </label>

                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className={`${inputClass} min-h-32 resize-y`}
                        placeholder="Describe your training experience, approach, and the people you help..."
                        maxLength={1500}
                        rows={5}
                      />

                      <p className="mt-2 text-right text-xs text-white/30">
                        {formData.bio.length}/1500 characters
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing and profile */}
                <div className="border-t border-white/[0.07] pt-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C7F36B]/10 text-xs font-bold text-[#C7F36B]">
                      03
                    </span>
                    <h3 className="font-semibold text-[#F4F5F0]">
                      Pricing and profile
                    </h3>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div>
                      <label
                        htmlFor="price_per_session"
                        className={labelClass}
                      >
                        Price per session{" "}
                        <span className="text-[#C7F36B]">*</span>
                      </label>

                      <div className="relative">
                        <span className="absolute left-4 top-[26px] text-xs font-bold text-[#C7F36B]">
                          LKR
                        </span>

                        <input
                          id="price_per_session"
                          name="price_per_session"
                          type="number"
                          min="0"
                          max="10000000"
                          step="0.01"
                          value={formData.price_per_session}
                          onChange={handleChange}
                          className={`${inputClass} pl-14`}
                          placeholder="e.g. 2500"
                          required
                        />
                      </div>

                      <p className="mt-2 text-xs leading-5 text-white/35">
                        Your intended rate for one training session.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="profile_image_url"
                        className={labelClass}
                      >
                        Profile image URL{" "}
                        <span className="font-normal text-white/35">
                          (Optional)
                        </span>
                      </label>

                      <input
                        id="profile_image_url"
                        name="profile_image_url"
                        type="url"
                        value={formData.profile_image_url}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="https://example.com/your-photo.jpg"
                        maxLength={2048}
                      />

                      <p className="mt-2 text-xs leading-5 text-white/35">
                        Provide a publicly accessible image URL. Direct
                        photo uploads can be added later using Supabase
                        Storage.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="border-t border-white/[0.07] pt-7">
                  <p className="text-xs leading-6 text-white/40">
                    By submitting this form, you confirm that the
                    information provided is accurate and agree to have
                    your application reviewed by FitX Lanka administrators.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#C7F36B] px-5 py-4 text-sm font-bold text-[#171A18] transition duration-200 hover:bg-[#D6FF84] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Submitting application...
                      </>
                    ) : (
                      <>
                        Submit application
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="mt-5 text-center text-xs text-white/40">
                    Already applied?{" "}
                    <Link
                      href="/trainers"
                      className="font-semibold text-[#C7F36B] transition hover:text-[#D6FF84]"
                    >
                      Return to trainers
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/[0.07] py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/30 sm:flex-row">
            <Link href="/" className="font-bold tracking-wide text-[#F4F5F0]">
              FITX<span className="text-[#C7F36B]">LANKA</span>
            </Link>

            <p>
              Built for a stronger Sri Lanka.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
