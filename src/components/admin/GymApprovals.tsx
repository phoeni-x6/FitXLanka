
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Search,
  X,
  XCircle,
  RefreshCw,
  UserRound,
  CalendarDays,
  DollarSign,
  Tag,
  ClipboardList,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

/* =========================================================
   TYPES
========================================================= */

type ApplicationStatus = "pending" | "approved" | "rejected";

type GymApplication = {
  id: string;
  user_id: string;
  gym_name: string;
  description: string | null;
  location: string;
  category: string;
  price_from: number;
  features: string[];
  main_image_url: string | null;
  gallery_images?: string[];
  status: ApplicationStatus;
  admin_notes: string | null;
  created_at: string;
  applicant_name: string;
};

type GymApplicationRow = {
  id: string;
  user_id: string;
  gym_name: string;
  description: string | null;
  location: string;
  category: string;
  price_from: number | string;
  features: string[] | null;
  main_image_url: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  profiles:
    | { display_name: string | null }
    | { display_name: string | null }[]
    | null;
};

type StatusFilter = "all" | ApplicationStatus;

/* =========================================================
   HELPERS
========================================================= */

function mapApplication(row: GymApplicationRow): GymApplication {
  const profile = Array.isArray(row.profiles)
    ? row.profiles[0]
    : row.profiles;

  const validStatus: ApplicationStatus =
    row.status === "approved" || row.status === "rejected"
      ? row.status
      : "pending";

  return {
    id: row.id,
    user_id: row.user_id,
    gym_name: row.gym_name,
    description: row.description,
    location: row.location,
    category: row.category || "General",
    price_from: Number(row.price_from) || 0,
    features: row.features ?? [],
    main_image_url: row.main_image_url,
    status: validStatus,
    admin_notes: row.admin_notes,
    created_at: row.created_at,
    applicant_name: profile?.display_name?.trim() || "Unknown applicant",
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    maximumFractionDigits: 2,
  }).format(price);
}

function getStatusClasses(status: ApplicationStatus) {
  switch (status) {
    case "approved":
      return "border-green-200 bg-green-50 text-green-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function GymApprovals() {
  const [applications, setApplications] = useState<GymApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [selectedGym, setSelectedGym] =
    useState<GymApplication | null>(null);

  const [confirmation, setConfirmation] = useState<{
    gym: GymApplication;
    status: "approved" | "rejected";
  } | null>(null);

  const [reviewing, setReviewing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  /* -------------------------------------------------------
     FETCH APPLICATIONS

     Important:
     Explicitly identify the applicant's profiles relationship
     to prevent PostgREST error PGRST201.
  ------------------------------------------------------- */

  const loadApplications = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setPageError(null);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("gym_applications")
        .select(`
          id,
          user_id,
          gym_name,
          description,
          location,
          category,
          price_from,
          features,
          main_image_url,
          status,
          admin_notes,
          created_at,
          profiles!gym_applications_user_id_fkey(display_name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const rows = (data ?? []) as unknown as GymApplicationRow[];

      setApplications(rows.map(mapApplication));
    } catch (error) {
      console.error("Failed to load gym applications:", error);

      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to load gym applications. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  /* -------------------------------------------------------
     FILTERS
  ------------------------------------------------------- */

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return applications.filter((gym) => {
      const matchesStatus =
        statusFilter === "all" || gym.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        gym.gym_name.toLowerCase().includes(normalizedSearch) ||
        gym.location.toLowerCase().includes(normalizedSearch) ||
        gym.category.toLowerCase().includes(normalizedSearch) ||
        gym.applicant_name.toLowerCase().includes(normalizedSearch) ||
        gym.user_id.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((item) => item.status === "pending")
        .length,
      approved: applications.filter((item) => item.status === "approved")
        .length,
      rejected: applications.filter((item) => item.status === "rejected")
        .length,
    }),
    [applications]
  );

  /* -------------------------------------------------------
     APPROVE / REJECT
  ------------------------------------------------------- */

  const handleReview = async () => {
    if (!confirmation || reviewing) return;

    setReviewing(true);
    setActionError(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.rpc("review_gym_application", {
        p_application_id: confirmation.gym.id,
        p_status: confirmation.status,
        p_admin_notes: null,
      });

      if (error) {
        throw error;
      }

      const reviewedId = confirmation.gym.id;

      setApplications((current) =>
        current.map((gym) =>
          gym.id === reviewedId
            ? { ...gym, status: confirmation.status }
            : gym
        )
      );

      setSelectedGym((current) =>
        current?.id === reviewedId
          ? { ...current, status: confirmation.status }
          : current
      );

      setConfirmation(null);

      await loadApplications(true);
    } catch (error) {
      console.error("Failed to review gym application:", error);

      setActionError(
        error instanceof Error
          ? error.message
          : "The application could not be reviewed. Please try again."
      );
    } finally {
      setReviewing(false);
    }
  };

  /* -------------------------------------------------------
     STATUS BADGE
  ------------------------------------------------------- */

  const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
    const Icon =
      status === "approved"
        ? CheckCircle2
        : status === "rejected"
          ? XCircle
          : Clock;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
          status
        )}`}
      >
        <Icon size={13} />
        {status}
      </span>
    );
  };

  /* -------------------------------------------------------
     LOADING STATE
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-3 text-[#61665F]">
        <Loader2 className="animate-spin text-[#C7F36B]" size={34} />
        <p className="text-sm font-medium">Loading gym applications...</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     PAGE
  ------------------------------------------------------- */

  return (
    <div className="min-h-screen space-y-6 bg-[#F4F5F0] p-4 text-[#171A18] sm:p-6 lg:p-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#747970]">
            <Building2 size={16} />
            Admin Dashboard
            <span>/</span>
            Gym Approvals
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Gym Approvals
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#747970]">
            Review gym registration applications and manage which gyms can
            appear on FitXLanka.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadApplications(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#E0E3DA] bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-[#F8F9F5] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* PAGE ERROR */}

      {pageError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />

          <div className="flex-1">
            <p className="font-semibold">Could not load applications</p>
            <p className="mt-1 break-words">{pageError}</p>
          </div>

          <button
            type="button"
            onClick={() => void loadApplications()}
            className="shrink-0 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon={<ClipboardList size={20} />}
          description="All submitted applications"
        />

        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon={<Clock size={20} />}
          description="Waiting for a decision"
          accent="amber"
        />

        <StatCard
          label="Approved Gyms"
          value={stats.approved}
          icon={<CheckCircle2 size={20} />}
          description="Applications approved"
          accent="green"
        />

        <StatCard
          label="Rejected Applications"
          value={stats.rejected}
          icon={<XCircle size={20} />}
          description="Applications declined"
          accent="red"
        />
      </div>

      {/* APPLICATIONS PANEL */}

      <section className="overflow-hidden rounded-2xl border border-[#E3E5DE] bg-white shadow-sm">
        {/* FILTER BAR */}

        <div className="flex flex-col gap-4 border-b border-[#ECEEE8] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold">Applications</h2>
            <p className="mt-1 text-sm text-[#747970]">
              {filteredApplications.length}{" "}
              {filteredApplications.length === 1
                ? "application"
                : "applications"}{" "}
              found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 sm:w-64">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858A80]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search gyms, owners..."
                className="w-full rounded-xl border border-[#E0E3DA] bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-[#9A9E95] focus:border-[#A6CB53] focus:ring-2 focus:ring-[#C7F36B]/30"
              />
            </div>

            <div className="relative sm:w-44">
              <Filter
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#858A80]"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="w-full appearance-none rounded-xl border border-[#E0E3DA] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#A6CB53] focus:ring-2 focus:ring-[#C7F36B]/30"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}

        {filteredApplications.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8F9F5] text-xs uppercase tracking-wide text-[#747970]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Gym</th>
                    <th className="px-5 py-4 font-semibold">Applicant</th>
                    <th className="px-5 py-4 font-semibold">Location</th>
                    <th className="px-5 py-4 font-semibold">Starting Price</th>
                    <th className="px-5 py-4 font-semibold">Submitted</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#ECEEE8]">
                  {filteredApplications.map((gym) => (
                    <tr
                      key={gym.id}
                      className="transition hover:bg-[#FAFBF8]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-[200px] items-center gap-3">
                          <GymThumbnail
                            src={gym.main_image_url}
                            name={gym.gym_name}
                          />

                          <div className="min-w-0">
                            <p className="truncate font-semibold">
                              {gym.gym_name}
                            </p>
                            <p className="mt-1 text-xs text-[#747970]">
                              {gym.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF1E9] text-[#555B50]">
                            <UserRound size={15} />
                          </div>

                          <span className="max-w-[170px] truncate font-medium">
                            {gym.applicant_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex max-w-[180px] items-center gap-1.5 text-[#61665F]">
                          <MapPin size={15} className="shrink-0" />
                          <span className="truncate">{gym.location}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        LKR {formatPrice(gym.price_from)}
                        <span className="ml-1 text-xs font-normal text-[#858A80]">
                          /month
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-[#61665F]">
                        {formatDate(gym.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={gym.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <ActionIconButton
                            label="View details"
                            onClick={() => {
                              setActionError(null);
                              setSelectedGym(gym);
                            }}
                          >
                            <Eye size={16} />
                          </ActionIconButton>

                          {gym.status === "pending" && (
                            <>
                              <ActionIconButton
                                label="Approve application"
                                variant="approve"
                                onClick={() => {
                                  setActionError(null);
                                  setConfirmation({
                                    gym,
                                    status: "approved",
                                  });
                                }}
                              >
                                <Check size={16} />
                              </ActionIconButton>

                              <ActionIconButton
                                label="Reject application"
                                variant="reject"
                                onClick={() => {
                                  setActionError(null);
                                  setConfirmation({
                                    gym,
                                    status: "rejected",
                                  });
                                }}
                              >
                                <X size={16} />
                              </ActionIconButton>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}

            <div className="grid gap-4 p-4 lg:hidden">
              {filteredApplications.map((gym) => (
                <article
                  key={gym.id}
                  className="rounded-xl border border-[#E6E8E1] p-4"
                >
                  <div className="flex items-start gap-3">
                    <GymThumbnail
                      src={gym.main_image_url}
                      name={gym.gym_name}
                      large
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-bold">
                        {gym.gym_name}
                      </h3>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-[#747970]">
                        <MapPin size={14} />
                        <span className="break-words">{gym.location}</span>
                      </p>

                      <div className="mt-2">
                        <StatusBadge status={gym.status} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#F8F9F5] p-3 text-sm">
                    <div>
                      <p className="text-xs text-[#747970]">Applicant</p>
                      <p className="mt-1 break-words font-medium">
                        {gym.applicant_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#747970]">Category</p>
                      <p className="mt-1 font-medium">{gym.category}</p>
                    </div>

                    <div>
                      <p className="text-xs text-[#747970]">Starting price</p>
                      <p className="mt-1 font-semibold">
                        LKR {formatPrice(gym.price_from)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#747970]">Submitted</p>
                      <p className="mt-1 font-medium">
                        {formatDate(gym.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActionError(null);
                        setSelectedGym(gym);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#E0E3DA] px-3 py-2.5 text-sm font-semibold hover:bg-[#F8F9F5]"
                    >
                      <Eye size={16} />
                      View details
                    </button>

                    {gym.status === "pending" && (
                      <>
                        <button
                          type="button"
                          aria-label="Approve application"
                          onClick={() => {
                            setActionError(null);
                            setConfirmation({
                              gym,
                              status: "approved",
                            });
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C7F36B] px-3 py-2.5 text-sm font-bold text-[#171A18] hover:bg-[#B9E45E]"
                        >
                          <Check size={17} />
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null);
                            setConfirmation({
                              gym,
                              status: "rejected",
                            });
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          <X size={17} />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F2EB] text-[#747970]">
              <Building2 size={26} />
            </div>

            <h3 className="mt-4 font-bold">No applications found</h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#747970]">
              {applications.length === 0
                ? "Gym applications will appear here when users submit them."
                : "Try changing your search or status filter to find applications."}
            </p>

            {(search || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-4 rounded-lg bg-[#C7F36B] px-4 py-2 text-sm font-semibold hover:bg-[#B9E45E]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* FOOTER */}

        <div className="flex flex-col gap-2 border-t border-[#ECEEE8] bg-[#FCFCFA] px-4 py-3 text-xs text-[#747970] sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>
            Showing {filteredApplications.length} of {applications.length}{" "}
            applications
          </span>

          <span>Sorted by newest submission</span>
        </div>
      </section>

      {/* DETAILS MODAL */}

      {selectedGym && (
        <Modal
          title="Gym application details"
          onClose={() => setSelectedGym(null)}
          wide
        >
          <div className="space-y-5">
            {selectedGym.main_image_url ? (
              <div className="overflow-hidden rounded-xl bg-[#F0F2EB]">
                <img
                  src={selectedGym.main_image_url}
                  alt={selectedGym.gym_name}
                  className="max-h-64 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl bg-[#F0F2EB] text-[#747970]">
                <div className="text-center">
                  <ImageIcon size={28} className="mx-auto mb-2" />
                  <p className="text-sm">No gym image provided</p>
                </div>
              </div>
            )}

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-xl font-bold">
                  {selectedGym.gym_name}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#747970]">
                  <MapPin size={15} />
                  {selectedGym.location}
                </p>
              </div>

              <StatusBadge status={selectedGym.status} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem
                icon={<UserRound size={17} />}
                label="Applicant"
                value={selectedGym.applicant_name}
              />

              <DetailItem
                icon={<Tag size={17} />}
                label="Category"
                value={selectedGym.category}
              />

              <DetailItem
                icon={<DollarSign size={17} />}
                label="Starting monthly price"
                value={`LKR ${formatPrice(selectedGym.price_from)}`}
              />

              <DetailItem
                icon={<CalendarDays size={17} />}
                label="Submitted on"
                value={formatDate(selectedGym.created_at)}
              />
            </div>

            <div>
              <h4 className="text-sm font-bold">Description</h4>

              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#61665F]">
                {selectedGym.description?.trim() ||
                  "No description provided."}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold">Features and facilities</h4>

              {selectedGym.features.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedGym.features.map((feature, index) => (
                    <span
                      key={`${feature}-${index}`}
                      className="rounded-full border border-[#E0E3DA] bg-[#F8F9F5] px-3 py-1.5 text-sm text-[#454A42]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-[#747970]">
                  No features listed.
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold">Application reference</h4>

              <p className="mt-2 break-all rounded-lg bg-[#F8F9F5] p-3 font-mono text-xs text-[#61665F]">
                {selectedGym.id}
              </p>
            </div>

            {selectedGym.admin_notes && (
              <div className="rounded-xl border border-[#E0E3DA] bg-[#F8F9F5] p-4">
                <h4 className="text-sm font-bold">Admin notes</h4>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#61665F]">
                  {selectedGym.admin_notes}
                </p>
              </div>
            )}

            {selectedGym.status === "pending" && (
              <div className="flex flex-col gap-3 border-t border-[#ECEEE8] pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setConfirmation({
                      gym: selectedGym,
                      status: "approved",
                    });
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-bold text-[#171A18] transition hover:bg-[#B9E45E]"
                >
                  <Check size={17} />
                  Approve application
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActionError(null);
                    setConfirmation({
                      gym: selectedGym,
                      status: "rejected",
                    });
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                >
                  <X size={17} />
                  Reject application
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* APPROVE / REJECT CONFIRMATION */}

      {confirmation && (
        <Modal
          title={
            confirmation.status === "approved"
              ? "Approve gym application?"
              : "Reject gym application?"
          }
          onClose={() => {
            if (!reviewing) {
              setConfirmation(null);
              setActionError(null);
            }
          }}
        >
          <div className="space-y-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                confirmation.status === "approved"
                  ? "bg-[#EFF8DD] text-[#4D6F18]"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {confirmation.status === "approved" ? (
                <CheckCircle2 size={25} />
              ) : (
                <XCircle size={25} />
              )}
            </div>

            <p className="text-sm leading-6 text-[#61665F]">
              {confirmation.status === "approved" ? (
                <>
                  You are about to approve{" "}
                  <strong className="text-[#171A18]">
                    {confirmation.gym.gym_name}
                  </strong>
                  . The applicant will receive the gym owner role, and the
                  gym profile will be created or updated through the database
                  review function.
                </>
              ) : (
                <>
                  You are about to reject the application for{" "}
                  <strong className="text-[#171A18]">
                    {confirmation.gym.gym_name}
                  </strong>
                  . Make sure you want to decline this application before
                  continuing.
                </>
              )}
            </p>

            {actionError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={17} />
                <span className="break-words">{actionError}</span>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-[#ECEEE8] pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={reviewing}
                onClick={() => {
                  setConfirmation(null);
                  setActionError(null);
                }}
                className="rounded-xl border border-[#E0E3DA] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#F8F9F5] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={reviewing}
                onClick={() => void handleReview()}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmation.status === "approved"
                    ? "bg-[#C7F36B] text-[#171A18] hover:bg-[#B9E45E]"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {reviewing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : confirmation.status === "approved" ? (
                  <>
                    <Check size={16} />
                    Confirm approval
                  </>
                ) : (
                  <>
                    <X size={16} />
                    Confirm rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  icon,
  description,
  accent = "default",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  accent?: "default" | "amber" | "green" | "red";
}) {
  const iconClasses = {
    default: "bg-[#F0F2EB] text-[#454A42]",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-[#E3E5DE] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#747970]">{label}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClasses[accent]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-[#858A80]">{description}</p>
    </div>
  );
}

/* =========================================================
   GYM THUMBNAIL
========================================================= */

function GymThumbnail({
  src,
  name,
  large = false,
}: {
  src: string | null;
  name: string;
  large?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const size = large ? "h-16 w-16" : "h-12 w-12";

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F0F2EB] text-[#747970]`}
    >
      {src && !imageFailed ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Building2 size={large ? 25 : 21} />
      )}
    </div>
  );
}

/* =========================================================
   ACTION ICON BUTTON
========================================================= */

function ActionIconButton({
  children,
  label,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "approve" | "reject";
}) {
  const variants = {
    default:
      "border-[#E0E3DA] text-[#555B50] hover:bg-[#F0F2EB]",
    approve:
      "border-[#DCEBBF] text-[#52721D] hover:bg-[#EFF8DD]",
    reject:
      "border-red-200 text-red-600 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#E6E8E1] p-3">
      <div className="mt-0.5 shrink-0 text-[#747970]">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-[#747970]">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#ECEEE8] px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#747970] transition hover:bg-[#F0F2EB] hover:text-[#171A18]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
