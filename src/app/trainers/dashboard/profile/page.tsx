
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Camera,
  Clock3,
  Dumbbell,
  MapPin,
  Pencil,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function TrainerProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/trainers/dashboard/profile");
  }

  const { data: account } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (account?.role !== "trainer") {
    redirect("/");
  }

  const { data: trainer, error } = await supabase
    .from("trainer_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center bg-[#171A18] px-4 text-[#F4F5F0]">
          <div className="max-w-lg rounded-3xl border border-red-400/20 bg-[#222723] p-8">
            <h1 className="text-xl font-bold">Unable to load profile</h1>
            <p className="mt-3 text-sm leading-6 text-white/55">
              {error.message}
            </p>
            <Link
              href="/trainers/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-semibold text-[#171A18]"
            >
              <ArrowLeft size={17} />
              Back to dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!trainer) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center bg-[#171A18] px-4 text-[#F4F5F0]">
          <div className="max-w-lg rounded-3xl border border-white/10 bg-[#222723] p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C7F36B]/10">
              <UserRound className="h-7 w-7 text-[#C7F36B]" />
            </div>
            <h1 className="text-2xl font-bold">Profile not found</h1>
            <p className="mt-3 text-sm leading-6 text-white/55">
              Your trainer account is active, but a public profile has not
              been created yet. Please contact the administrator.
            </p>
            <Link
              href="/trainers/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-semibold text-[#171A18]"
            >
              <ArrowLeft size={17} />
              Back to dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const experience = Number(trainer.experience_years) || 0;
  const price = Number(trainer.price_per_session) || 0;

  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price);

  const formattedDate = new Date(trainer.created_at).toLocaleDateString(
    "en-LK",
    {
      month: "long",
      year: "numeric",
    }
  );

  const stats = [
    {
      label: "Experience",
      value: `${experience} ${experience === 1 ? "year" : "years"}`,
      icon: Clock3,
    },
    {
      label: "Session rate",
      value: formattedPrice,
      icon: Banknote,
    },
    {
      label: "Location",
      value: trainer.location,
      icon: MapPin,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] text-[#F4F5F0]">
        {/* Decorative background */}
        <div className="pointer-events-none absolute left-0 right-0 top-20 -z-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(199,243,107,0.08),transparent_65%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/trainers/dashboard"
              className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
            >
              <ArrowLeft size={16} />
              Trainer dashboard
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#C7F36B]/20 bg-[#C7F36B]/[0.06] px-3 py-1.5 text-xs font-medium text-[#C7F36B]">
              <ShieldCheck size={14} />
              Verified trainer account
            </div>
          </div>

          {/* Page heading */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C7F36B]">
                Your coaching identity
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                My trainer profile<span className="text-[#C7F36B]">.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
                Manage the information that helps clients discover you and
                learn about your coaching expertise.
              </p>
            </div>

            <Link
              href={`/trainers/${user.id}`}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold transition hover:border-[#C7F36B]/40 hover:bg-[#C7F36B]/[0.06]"
            >
              Preview public page
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Profile hero card */}
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#222723]">
            <div className="relative h-32 overflow-hidden bg-[linear-gradient(110deg,#30392E_0%,#222723_55%,#171A18_100%)] sm:h-44">
              <div className="absolute -right-8 -top-24 h-64 w-64 rounded-full border border-[#C7F36B]/10" />
              <div className="absolute -right-1 -top-16 h-52 w-52 rounded-full border border-[#C7F36B]/10" />
              <div className="absolute bottom-5 left-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 sm:left-10">
                <Dumbbell size={15} />
                FITXLANKA COACH
              </div>
            </div>

            <div className="px-5 pb-6 sm:px-8 sm:pb-8">
              <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#222723] bg-[#30382F] sm:h-28 sm:w-28">
                    {trainer.profile_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={trainer.profile_image_url}
                        alt={trainer.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-11 w-11 text-[#C7F36B]" />
                    )}
                    <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#222723] bg-[#C7F36B]">
                      <BadgeCheck className="h-3 w-3 text-[#171A18]" />
                    </span>
                  </div>

                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="break-words text-2xl font-bold sm:text-3xl">
                        {trainer.full_name}
                      </h2>
                      <BadgeCheck
                        className="h-5 w-5 shrink-0 text-[#C7F36B]"
                        aria-label="Verified trainer"
                      />
                    </div>

                    <p className="mt-1 text-sm font-medium text-[#C7F36B]">
                      {trainer.specialty}
                    </p>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-white/45">
                      <MapPin size={14} />
                      {trainer.location}
                    </p>
                  </div>
                </div>

                <Link
                  href="/trainers/dashboard/profile"
                  className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-bold text-[#171A18] transition hover:bg-[#D6FF84]"
                >
                  <Pencil size={16} />
                  Edit profile
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-5 text-xs text-white/45">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C7F36B]/15 bg-[#C7F36B]/[0.06] px-3 py-1.5 text-[#C7F36B]">
                  <BadgeCheck size={13} />
                  Approved trainer
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  Member since {formattedDate}
                </span>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/[0.08] bg-[#222723] p-5 transition hover:border-[#C7F36B]/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-white/45">{label}</p>
                  <div className="rounded-xl bg-[#C7F36B]/10 p-2.5">
                    <Icon className="h-5 w-5 text-[#C7F36B]" />
                  </div>
                </div>
                <p className="mt-4 break-words text-xl font-bold sm:text-2xl">
                  {value}
                </p>
              </div>
            ))}
          </section>

          {/* About section and profile completion */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="rounded-3xl border border-white/[0.08] bg-[#222723] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#C7F36B]/10 p-3">
                  <Users className="h-5 w-5 text-[#C7F36B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">About me</h3>
                  <p className="mt-1 text-xs text-white/40">
                    Introduce yourself to potential clients
                  </p>
                </div>
              </div>

              <div className="mt-6">
                {trainer.bio ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                    {trainer.bio}
                  </p>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5">
                    <p className="text-sm text-white/50">
                      You haven't added a biography yet. Tell clients about
                      your coaching approach, qualifications, and training
                      philosophy.
                    </p>
                    <Link
                      href="/trainers/dashboard/profile"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C7F36B] hover:underline"
                    >
                      Complete your profile
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-7 border-t border-white/[0.07] pt-6">
                <h3 className="text-sm font-semibold">Coaching specialty</h3>
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#C7F36B]/15 bg-[#C7F36B]/[0.06] px-4 py-3 text-sm text-[#C7F36B]">
                  <Dumbbell size={16} />
                  {trainer.specialty}
                </div>
              </div>
            </section>

            <aside className="flex flex-col rounded-3xl border border-[#C7F36B]/15 bg-[linear-gradient(145deg,rgba(199,243,107,0.08),rgba(34,39,35,0.9)_55%)] p-6 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C7F36B]/10">
                <Camera className="h-6 w-6 text-[#C7F36B]" />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Make a strong first impression
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                A clear profile photo, a helpful biography, and accurate
                coaching details help clients understand what you offer.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  {
                    label: "Profile photo",
                    complete: Boolean(trainer.profile_image_url),
                  },
                  {
                    label: "Biography",
                    complete: Boolean(trainer.bio?.trim()),
                  },
                  {
                    label: "Coaching specialty",
                    complete: Boolean(trainer.specialty?.trim()),
                  },
                  {
                    label: "Location",
                    complete: Boolean(trainer.location?.trim()),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-white/65">{item.label}</span>
                    <span
                      className={
                        item.complete
                          ? "text-[#C7F36B]"
                          : "text-white/35"
                      }
                    >
                      {item.complete ? "Added" : "Missing"}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/trainers/dashboard/profile"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-bold text-[#171A18] transition hover:bg-[#D6FF84]"
              >
                Manage profile
                <ArrowUpRight size={16} />
              </Link>
            </aside>
          </div>

          {/* Bottom notice */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#C7F36B]" />
              <p className="text-xs leading-5 text-white/45">
                Your trainer account has been approved. Keep your public
                information accurate and professional.
              </p>
            </div>

            <Link
              href="/trainers/dashboard"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#C7F36B] hover:underline"
            >
              Return to dashboard
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
