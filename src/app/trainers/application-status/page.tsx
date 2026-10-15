
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

type ApplicationStatus = "pending" | "approved" | "rejected";

type TrainerApplication = {
  id: string;
  user_id: string;
  full_name: string;
  specialty: string;
  bio: string | null;
  location: string;
  experience_years: number;
  price_per_session: number;
  profile_image_url: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

function formatDate(date: string | null) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(price);
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles = {
    pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    approved: "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B]",
    rejected: "border-red-400/20 bg-red-400/10 text-red-300",
  };

  const labels = {
    pending: "Under review",
    approved: "Approved",
    rejected: "Not approved",
  };

  const icons = {
    pending: <Clock3 className="h-4 w-4" />,
    approved: <CheckCircle2 className="h-4 w-4" />,
    rejected: <XCircle className="h-4 w-4" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${styles[status]}`}
    >
      {icons[status]}
      {labels[status]}
    </span>
  );
}

function StatusTimeline({
  status,
  createdAt,
  reviewedAt,
}: {
  status: ApplicationStatus;
  createdAt: string;
  reviewedAt: string | null;
}) {
  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C7F36B]/10 text-[#C7F36B]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="mt-2 h-10 w-px bg-white/10" />
        </div>

        <div className="pb-5">
          <p className="font-medium text-white">Application submitted</p>
          <p className="mt-1 text-sm text-white/45">
            {formatDate(createdAt)}
          </p>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Your trainer application has been received.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              status === "pending"
                ? "bg-amber-400/10 text-amber-300"
                : status === "approved"
                  ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                  : "bg-red-400/10 text-red-300"
            }`}
          >
            {status === "pending" ? (
              <Clock3 className="h-5 w-5" />
            ) : status === "approved" ? (
              <BadgeCheck className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
          </div>
        </div>

        <div>
          <p className="font-medium text-white">
            {status === "pending"
              ? "Waiting for administrator review"
              : status === "approved"
                ? "Application approved"
                : "Application reviewed"}
          </p>

          <p className="mt-1 text-sm text-white/45">
            {reviewedAt
              ? formatDate(reviewedAt)
              : status === "pending"
                ? "Review in progress"
                : "Review date not available"}
          </p>

          <p className="mt-2 text-sm leading-6 text-white/55">
            {status === "pending"
              ? "Our team will review your details. You can return to this page to check for updates."
              : status === "approved"
                ? "Your application has been approved. You can now access your trainer workspace."
                : "Your application has been reviewed. Please read any feedback below."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function TrainerApplicationStatusPage() {
  const supabase = await createClient();

  // Require an authenticated user.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?redirectTo=/trainers/application-status");
  }

  // Fetch only this user's application.
  const { data, error } = await supabase
    .from("trainer_applications")
    .select(
      "id, user_id, full_name, specialty, bio, location, experience_years, price_per_session, profile_image_url, status, admin_notes, reviewed_at, created_at"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load trainer application:", error.message);

    return (
      <>
        <Navbar />

        <main className="flex min-h-[65vh] items-center justify-center bg-[#171A18] px-4 py-16 text-[#F4F5F0]">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#222723] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
              <XCircle className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Unable to load your application
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/55">
              We couldn't retrieve your application details. Please try again
              in a moment.
            </p>

            <Link
              href="/trainers/application-status"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d6ff84]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // Applicants without an application cannot access this section.
  if (!data) {
    redirect("/trainers/apply");
  }

  const application = data as TrainerApplication;

  // Defensive check for unexpected status values.
  if (
    !["pending", "approved", "rejected"].includes(application.status)
  ) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center bg-[#171A18] px-4 text-[#F4F5F0]">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold">
              Status temporarily unavailable
            </h1>
            <p className="mt-3 text-sm text-white/55">
              Your application status could not be displayed. Please contact
              support if the issue continues.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] px-4 py-10 text-[#F4F5F0] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Page heading */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#C7F36B]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C7F36B]">
                  Trainer applications
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Your application status
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                  Track your application and see when you're ready to start
                  your training business on FitX Lanka.
                </p>
              </div>

              <StatusBadge status={application.status} />
            </div>
          </div>

          {/* Main layout */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              {/* Status card */}
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#222723]">
                <div
                  className={`h-1 ${
                    application.status === "approved"
                      ? "bg-[#C7F36B]"
                      : application.status === "rejected"
                        ? "bg-red-400"
                        : "bg-amber-400"
                  }`}
                />

                <div className="p-6 sm:p-8">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      application.status === "approved"
                        ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                        : application.status === "rejected"
                          ? "bg-red-400/10 text-red-300"
                          : "bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {application.status === "approved" ? (
                      <ShieldCheck className="h-7 w-7" />
                    ) : application.status === "rejected" ? (
                      <XCircle className="h-7 w-7" />
                    ) : (
                      <Clock3 className="h-7 w-7" />
                    )}
                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    {application.status === "approved"
                      ? "Congratulations! You're approved."
                      : application.status === "rejected"
                        ? "Your application has been reviewed"
                        : "Your application is being reviewed"}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/55">
                    {application.status === "approved"
                      ? "Your trainer application has been approved. Visit your trainer dashboard to begin managing your coaching activity."
                      : application.status === "rejected"
                        ? "Your application was not approved this time. Check the administrator's feedback below for more information."
                        : "Thanks for applying to become a FitX Lanka trainer. Your application has been submitted successfully. You can check back here for status updates."}
                  </p>

                  {application.status === "approved" && (
                    <Link
                      href="/trainers/dashboard"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C7F36B] px-5 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d6ff84]"
                    >
                      Open trainer dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}

                  {application.status === "rejected" && (
                    <Link
                      href="/trainers/apply"
                      className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#C7F36B]/40 hover:text-[#C7F36B]"
                    >
                      Review application options
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </section>

              {/* Application timeline */}
              <section className="rounded-3xl border border-white/10 bg-[#222723] p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                  <div className="rounded-xl bg-[#C7F36B]/10 p-2.5 text-[#C7F36B]">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-semibold">Application timeline</h2>
                    <p className="mt-1 text-sm text-white/45">
                      Follow your application progress.
                    </p>
                  </div>
                </div>

                <StatusTimeline
                  status={application.status}
                  createdAt={application.created_at}
                  reviewedAt={application.reviewed_at}
                />
              </section>

              {/* Administrator feedback */}
              {application.status === "rejected" && (
                <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <MessageSquareText className="h-5 w-5 text-red-300" />
                    <h2 className="font-semibold">
                      Administrator feedback
                    </h2>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/65">
                    {application.admin_notes?.trim() ||
                      "No additional feedback was provided. Please contact FitX Lanka support for more information."}
                  </p>
                </section>
              )}

              {application.status === "pending" &&
                application.admin_notes?.trim() && (
                  <section className="rounded-3xl border border-white/10 bg-[#222723] p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <MessageSquareText className="h-5 w-5 text-[#C7F36B]" />
                      <h2 className="font-semibold">
                        Administrator note
                      </h2>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/60">
                      {application.admin_notes}
                    </p>
                  </section>
                )}
            </div>

            {/* Application details */}
            <aside className="space-y-6">
              <section className="rounded-3xl border border-white/10 bg-[#222723] p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#C7F36B]/10 p-2.5 text-[#C7F36B]">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="font-semibold">Submitted details</h2>
                    <p className="mt-1 text-xs text-white/45">
                      Your trainer application
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <Detail
                    label="Full name"
                    value={application.full_name}
                  />

                  <Detail
                    label="Specialty"
                    value={application.specialty}
                  />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                      Location
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
                      <MapPin className="h-4 w-4 shrink-0 text-[#C7F36B]" />
                      {application.location}
                    </p>
                  </div>

                  <Detail
                    label="Experience"
                    value={`${application.experience_years} ${
                      application.experience_years === 1
                        ? "year"
                        : "years"
                    }`}
                  />

                  <Detail
                    label="Price per session"
                    value={formatPrice(Number(application.price_per_session))}
                  />

                  <Detail
                    label="Submitted on"
                    value={formatDate(application.created_at)}
                  />

                  {application.bio && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                        About you
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/65">
                        {application.bio}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Help card */}
              <section className="rounded-3xl border border-[#C7F36B]/15 bg-[#C7F36B]/[0.04] p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#C7F36B]" />
                  <h2 className="font-semibold">Need help?</h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-white/55">
                  If you have questions about your application, contact the
                  FitX Lanka team through your available support channel.
                </p>

                <Link
                  href="/"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#C7F36B] hover:underline"
                >
                  Explore FitX Lanka
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-white/40">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium text-white/80">
        {value}
      </p>
    </div>
  );
}
