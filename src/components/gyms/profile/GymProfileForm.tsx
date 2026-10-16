
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Save,
  MapPin,
  Dumbbell,
  IndianRupee,
  Image as ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type GymProfile = {
  id: string;
  gym_name: string;
  description: string | null;
  location: string;
  category: string;
  price_from: number;
  features: string[];
  main_image_url: string | null;
  gallery_images: string[];
  is_published: boolean;
};

type Props = {
  gymId: string;
};

const facilityOptions = [
  "Personal Training",
  "Weight Training",
  "Cardio Equipment",
  "Group Classes",
  "Changing Rooms",
  "Showers",
  "Parking",
  "Air Conditioning",
  "Swimming Pool",
  "Sauna",
  "Yoga",
  "Nutrition Guidance",
];

export default function GymProfileForm({ gymId }: Props) {
  const [gym, setGym] = useState<GymProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    gym_name: "",
    description: "",
    location: "",
    category: "General",
    price_from: "0",
    features: [] as string[],
    main_image_url: "",
    gallery_images: "",
    is_published: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const supabase = createClient();

      try {
        const { data, error: fetchError } = await supabase
          .from("gym_profiles")
          .select(
            "id, gym_name, description, location, category, price_from, features, main_image_url, gallery_images, is_published"
          )
          .eq("id", gymId)
          .single();

        if (fetchError) throw fetchError;

        if (!cancelled && data) {
          const profile = data as GymProfile;

          setGym(profile);

          setForm({
            gym_name: profile.gym_name ?? "",
            description: profile.description ?? "",
            location: profile.location ?? "",
            category: profile.category ?? "General",
            price_from: String(profile.price_from ?? 0),
            features: profile.features ?? [],
            main_image_url: profile.main_image_url ?? "",
            gallery_images: (profile.gallery_images ?? []).join("\n"),
            is_published: profile.is_published,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load gym information."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [gymId]);

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setSuccess("");
  }

  function toggleFeature(feature: string) {
    setForm((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((item) => item !== feature)
        : [...current.features, feature],
    }));

    setSuccess("");
  }

  function isValidOptionalUrl(value: string) {
    if (!value.trim()) return true;

    try {
      const url = new URL(value.trim());
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const price = Number(form.price_from);

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid non-negative monthly starting price.");
      return;
    }

    if (!isValidOptionalUrl(form.main_image_url)) {
      setError("Enter a valid main image URL.");
      return;
    }

    const galleryImages = form.gallery_images
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter(Boolean);

    if (galleryImages.some((url) => !isValidOptionalUrl(url))) {
      setError("One or more gallery image URLs are invalid.");
      return;
    }

    if (!form.gym_name.trim() || !form.location.trim()) {
      setError("Gym name and location are required.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from("gym_profiles")
        .update({
          gym_name: form.gym_name.trim(),
          description: form.description.trim() || null,
          location: form.location.trim(),
          category: form.category.trim() || "General",
          price_from: price,
          features: form.features,
          main_image_url: form.main_image_url.trim() || null,
          gallery_images: galleryImages,
          is_published: form.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", gymId);

      if (updateError) throw updateError;

      setGym((current) =>
        current
          ? {
              ...current,
              gym_name: form.gym_name.trim(),
              description: form.description.trim() || null,
              location: form.location.trim(),
              category: form.category.trim() || "General",
              price_from: price,
              features: form.features,
              main_image_url: form.main_image_url.trim() || null,
              gallery_images: galleryImages,
              is_published: form.is_published,
            }
          : current
      );

      setSuccess("Your gym profile has been updated successfully.");
    } catch (err) {
      console.error("Gym profile update failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your gym profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#222723]">
        <LoaderCircle className="animate-spin text-[#C7F36B]" size={22} />
        <span className="text-sm text-white/60">Loading your profile...</span>
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-300">
        {error || "Gym profile not found."}
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#171A18] px-4 py-3 text-sm text-[#F4F5F0] outline-none transition placeholder:text-white/25 focus:border-[#C7F36B]/70 focus:ring-2 focus:ring-[#C7F36B]/10";

  const labelClass = "text-sm font-semibold text-white/80";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-[#C7F36B]/20 bg-[#C7F36B]/5 p-4 text-sm text-[#C7F36B]">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* PUBLIC VISIBILITY */}

      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#222723] p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="font-semibold">Public gym listing</p>
          <p className="mt-1 text-sm leading-6 text-white/50">
            Control whether your gym appears in the public FitXLanka gym
            directory.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              form.is_published ? "text-[#C7F36B]" : "text-white/50"
            }`}
          >
            {form.is_published ? "Published" : "Hidden"}
          </span>

          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(event) =>
              updateField("is_published", event.target.checked)
            }
            className="h-5 w-5 accent-[#C7F36B]"
          />
        </label>
      </section>

      {/* BASIC INFORMATION */}

      <section className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
            <Dumbbell size={21} />
          </div>

          <div>
            <h2 className="font-bold">Basic information</h2>
            <p className="mt-1 text-xs text-white/45">
              The essential details customers will see.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="gym_name" className={labelClass}>
              Gym name *
            </label>

            <input
              id="gym_name"
              required
              maxLength={120}
              value={form.gym_name}
              onChange={(event) =>
                updateField("gym_name", event.target.value)
              }
              className={inputClass}
              placeholder="e.g. Iron House Fitness"
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Gym category
            </label>

            <select
              id="category"
              value={form.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
              className={inputClass}
            >
              <option value="General">General Fitness</option>
              <option value="Strength">Strength Training</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Yoga">Yoga and Wellness</option>
              <option value="Martial Arts">Martial Arts</option>
              <option value="Personal Training">Personal Training</option>
              <option value="Women Only">Women Only</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Gym description
            </label>

            <textarea
              id="description"
              rows={5}
              maxLength={2000}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              className={`${inputClass} resize-y`}
              placeholder="Tell customers about your gym, equipment, training environment, and what makes it special..."
            />

            <p className="mt-1 text-right text-xs text-white/35">
              {form.description.length}/2000
            </p>
          </div>
        </div>
      </section>

      {/* LOCATION AND PRICE */}

      <section className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
            <MapPin size={21} />
          </div>

          <div>
            <h2 className="font-bold">Location and pricing</h2>
            <p className="mt-1 text-xs text-white/45">
              Help members find your gym and understand your pricing.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className={labelClass}>
              Location *
            </label>

            <input
              id="location"
              required
              maxLength={200}
              value={form.location}
              onChange={(event) =>
                updateField("location", event.target.value)
              }
              className={inputClass}
              placeholder="e.g. Nugegoda, Colombo"
            />
          </div>

          <div>
            <label htmlFor="price_from" className={labelClass}>
              Starting monthly price (LKR)
            </label>

            <div className="relative">
              <IndianRupee
                size={17}
                className="absolute left-3 top-[26px] -translate-y-1/2 text-white/35"
              />

              <input
                id="price_from"
                type="number"
                min="0"
                step="0.01"
                required
                value={form.price_from}
                onChange={(event) =>
                  updateField("price_from", event.target.value)
                }
                className={`${inputClass} pl-9`}
                placeholder="5000"
              />
            </div>

            <p className="mt-2 text-xs text-white/35">
              Enter the lowest monthly membership price.
            </p>
          </div>
        </div>
      </section>

      {/* FACILITIES */}

      <section className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
            <Dumbbell size={21} />
          </div>

          <div>
            <h2 className="font-bold">Facilities and features</h2>
            <p className="mt-1 text-xs text-white/45">
              Select every facility available at your gym.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facilityOptions.map((feature) => {
            const checked = form.features.includes(feature);

            return (
              <label
                key={feature}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                  checked
                    ? "border-[#C7F36B]/40 bg-[#C7F36B]/5 text-[#C7F36B]"
                    : "border-white/10 text-white/65 hover:border-white/20"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFeature(feature)}
                  className="h-4 w-4 accent-[#C7F36B]"
                />

                <span>{feature}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* IMAGES */}

      <section className="rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-[#C7F36B]">
            <ImageIcon size={21} />
          </div>

          <div>
            <h2 className="font-bold">Gym images</h2>
            <p className="mt-1 text-xs text-white/45">
              Add image URLs for your public gym listing.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="main_image_url" className={labelClass}>
            Main image URL
          </label>

          <input
            id="main_image_url"
            type="url"
            value={form.main_image_url}
            onChange={(event) =>
              updateField("main_image_url", event.target.value)
            }
            className={inputClass}
            placeholder="https://example.com/gym-image.jpg"
          />

          {form.main_image_url &&
            isValidOptionalUrl(form.main_image_url) && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.main_image_url}
                  alt="Gym preview"
                  className="max-h-64 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
        </div>

        <div className="mt-5">
          <label htmlFor="gallery_images" className={labelClass}>
            Gallery image URLs
          </label>

          <textarea
            id="gallery_images"
            rows={4}
            value={form.gallery_images}
            onChange={(event) =>
              updateField("gallery_images", event.target.value)
            }
            className={`${inputClass} resize-y`}
            placeholder={"https://example.com/gym-1.jpg\nhttps://example.com/gym-2.jpg"}
          />

          <p className="mt-2 text-xs leading-5 text-white/35">
            Enter one URL per line. Comma-separated URLs are also supported.
            File uploads can be added later through Supabase Storage.
          </p>
        </div>
      </section>

      {/* SAVE */}

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-white/40">
          Your changes are saved to your FitXLanka gym profile.
        </p>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-6 py-3.5 text-sm font-bold text-[#171A18] transition hover:bg-[#B9E45E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}

          {saving ? "Saving changes..." : "Save gym profile"}
        </button>
      </div>
    </form>
  );
}
