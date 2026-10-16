
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  MapPin,
  CalendarDays,
  Banknote,
  FileText,
  RefreshCw,
  Dumbbell,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type ApplicationStatus = "pending" | "approved" | "rejected";

type GymApplication = {
  id: string;
  gym_name: string;
  description: string | null;
  location: string;
  category: string;
  price_from: number;
  features: string[] | null;
  main_image_url: string | null;
  gallery_images: string[] | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
};

const statusConfig = {
  pending: {
    label: "Under Review",
    description:
      "Your gym application has been submitted and is waiting for an administrator to review it.",
    icon: Clock3,
    color: "text-amber-300",
    border: "border-amber-300/20",
    background: "bg-amber-300/10",
    dot: "bg-amber-300",
  },
  approved: {
    label: "Approved",
    description:
      "Congratulations! Your gym application has been approved.",
    icon: CheckCircle2,
    color: "text-brand-lime",
    border: "border-brand-lime/25",
    background: "bg-brand-lime/10",
    dot: "bg-brand-lime",
  },
  rejected: {
    label: "Not Approved",
    description:
      "Your application was not approved. Review the administrator's feedback below for more information.",
    icon: XCircle,
    color: "text-red-400",
    border: "border-red-400/20",
    background: "bg-red-400/10",
    dot: "bg-red-400",
  },
};

function formatDate(value: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function GymApplicationStatusPage() {
  const [application, setApplication] = useState<GymApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadApplication = useCallback(async (manualRefresh = false) => {
    const supabase = createClient();

    if (manualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setPageError(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setIsAuthenticated(false);
        setApplication(null);
        return;
      }

      setIsAuthenticated(true);

      const { data, error } = await supabase
        .from("gym_applications")
        .select(
          "id, gym_name, description, location, category, price_from, features, main_image_url, gallery_images, status, admin_notes, created_at, reviewed_at"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setApplication(null);
        return;
      }

      setApplication(data as GymApplication);
    } catch (error) {
      console.error("Unable to load gym application:", error);

      setPageError(
        "We couldn't load your application details. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadApplication();
  }, [loadApplication]);

  const currentStatus = application
    ? statusConfig[application.status]
    : null;

  const StatusIcon = currentStatus?.icon;

  return (
    <main className="min-h-screen bg-brand-charcoal px-4 py-10 text-brand-cream sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/gyms"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-brand-lime"
        >
          <ArrowLeft size={16} />
          Back to gyms
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-lime/20 bg-brand-lime/10">
            <FileText className="h-6 w-6 text-brand-lime" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
            Gym registration
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Application Status
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Track your gym registration, review your application details, and
            check for updates from the FitXLanka administration team.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-[#222723] p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-lime/10">
              <RefreshCw className="h-5 w-5 animate-spin text-brand-lime" />
            </div>

            <p className="mt-5 font-semibold text-white">
              Loading your application
            </p>

            <p className="mt-2 text-sm text-white/45">
              Please wait while we retrieve your latest status.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && pageError && (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div className="flex-1">
                <h2 className="font-semibold text-white">
                  Unable to load application
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  {pageError}
                </p>

                <button
                  type="button"
                  onClick={() => void loadApplication(true)}
                  disabled={refreshing}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-lime px-4 py-2.5 text-sm font-bold text-brand-charcoal transition hover:bg-white disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Not logged in */}
        {!loading && !pageError && !isAuthenticated && (
          <div className="rounded-3xl border border-white/10 bg-[#222723] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-lime/10">
              <ShieldCheck className="h-8 w-8 text-brand-lime" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-white">
              Log in to view your application
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
              Sign in to your FitXLanka account to view your gym registration
              status and administrator feedback.
            </p>

            <Link
              href="/login?next=/gyms/application-status"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-bold text-brand-charcoal transition hover:bg-white"
            >
              Log in
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* No application */}
        {!loading &&
          !pageError &&
          isAuthenticated &&
          !application && (
            <div className="rounded-3xl border border-white/10 bg-[#222723] p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                <Building2 className="h-8 w-8 text-white/60" />
              </div>

              <h2 className="mt-6 text-xl font-bold text-white">
                No gym application found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
                You haven't submitted a gym registration application using
                this account yet. Complete the application to get started.
              </p>

              <Link
                href="/gyms/apply"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-bold text-brand-charcoal transition hover:bg-white"
              >
                Apply to register your gym
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

        {/* Application details */}
        {!loading &&
          !pageError &&
          isAuthenticated &&
          application &&
          currentStatus &&
          StatusIcon && (
            <div className="space-y-6">
              {/* Status card */}
              <section
                className={`rounded-3xl border ${currentStatus.border} ${currentStatus.background} p-6 sm:p-8`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${currentStatus.border} ${currentStatus.background}`}
                    >
                      <StatusIcon
                        className={`h-6 w-6 ${currentStatus.color}`}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                        Current status
                      </p>

                      <h2
                        className={`mt-2 text-2xl font-bold ${currentStatus.color}`}
                      >
                        {currentStatus.label}
                      </h2>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                        {currentStatus.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void loadApplication(true)}
                    disabled={refreshing}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-brand-lime/30 hover:text-brand-lime disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                    Refresh status
                  </button>
                </div>

                {/* Progress indicator */}
                <div className="mt-8 grid grid-cols-3 gap-2">
                  {(
                    [
                      { label: "Submitted", complete: true },
                      {
                        label: "Under review",
                        complete:
                          application.status === "pending" ||
                          application.status === "approved" ||
                          application.status === "rejected",
                      },
                      {
                        label:
                          application.status === "rejected"
                            ? "Decision made"
                            : "Decision",
                        complete:
                          application.status === "approved" ||
                          application.status === "rejected",
                      },
                    ] as const
                  ).map((step, index) => (
                    <div key={step.label}>
                      <div
                        className={`h-1.5 rounded-full ${
                          step.complete
                            ? application.status === "rejected" &&
                              index === 2
                              ? "bg-red-400"
                              : "bg-brand-lime"
                            : "bg-white/10"
                        }`}
                      />

                      <p
                        className={`mt-2 text-[11px] sm:text-xs ${
                          step.complete ? "text-white/75" : "text-white/35"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gym information */}
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#222723]">
                {application.main_image_url && (
                  <div className="h-48 overflow-hidden bg-black/20 sm:h-64">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={application.main_image_url}
                      alt={application.gym_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-lime">
                        Submitted gym
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-white">
                        {application.gym_name}
                      </h2>

                      <p className="mt-2 inline-flex items-center gap-2 text-sm text-white/50">
                        <MapPin className="h-4 w-4 text-brand-lime" />
                        {application.location}
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60">
                      {application.category}
                    </span>
                  </div>

                  {application.description && (
                    <p className="mt-6 text-sm leading-7 text-white/55">
                      {application.description}
                    </p>
                  )}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Banknote className="h-4 w-4" />
                        Starting monthly price
                      </div>

                      <p className="mt-2 text-lg font-bold text-white">
                        LKR{" "}
                        {Number(application.price_from).toLocaleString(
                          "en-LK"
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <CalendarDays className="h-4 w-4" />
                        Application submitted
                      </div>

                      <p className="mt-2 text-sm font-semibold text-white">
                        {formatDate(application.created_at)}
                      </p>
                    </div>
                  </div>

                  {application.features &&
                    application.features.length > 0 && (
                      <div className="mt-7">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Dumbbell className="h-4 w-4 text-brand-lime" />
                          Facilities submitted
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {application.features.map((feature) => (
                            <span
                              key={feature}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </section>

              {/* Administrator feedback */}
              <section className="rounded-3xl border border-white/10 bg-[#222723] p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    <FileText className="h-5 w-5 text-brand-lime" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white">
                      Administrator feedback
                    </h2>

                    <p className="mt-1 text-sm text-white/45">
                      Updates and notes regarding your application.
                    </p>

                    {application.admin_notes ? (
                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-white/75">
                          {application.admin_notes}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-5 rounded-2xl border border-dashed border-white/10 p-4 text-sm leading-6 text-white/40">
                        {application.status === "pending"
                          ? "No administrator feedback yet. Check back later for updates."
                          : "No additional feedback has been provided for this application."}
                      </p>
                    )}

                    {application.reviewed_at && (
                      <p className="mt-4 text-xs text-white/35">
                        Last reviewed on{" "}
                        {formatDate(application.reviewed_at)}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {application.status === "approved" && (
                  <Link
                    href="/gyms/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-bold text-brand-charcoal transition hover:bg-white"
                  >
                    <Building2 className="h-4 w-4" />
                    Go to gym dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                {application.status === "rejected" && (
                  <p className="max-w-xl text-sm leading-6 text-white/50">
                    If you would like to submit a revised application, contact
                    the FitXLanka administration team first. Your current
                    application remains on record.
                  </p>
                )}

                <Link
                  href="/gyms"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-brand-lime/30 hover:text-brand-lime"
                >
                  Explore gyms
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
      </div>
    </main>
  );
}
