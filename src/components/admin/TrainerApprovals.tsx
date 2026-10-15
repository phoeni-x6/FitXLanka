
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  MapPin,
  CalendarDays,
  DollarSign,
  LoaderCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  approved: "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B]",
  rejected: "border-red-400/20 bg-red-400/10 text-red-300",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(value: number) {
  return `LKR ${Number(value).toLocaleString("en-LK")}`;
}

export default function TrainerApprovals() {
  const [applications, setApplications] = useState<TrainerApplication[]>([]);
  const [selected, setSelected] = useState<TrainerApplication | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Please sign in again to view trainer applications.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        setError("You must be an administrator to view these applications.");
        return;
      }

      const { data, error: queryError } = await supabase
        .from("trainer_applications")
        .select(
          "id, user_id, full_name, specialty, bio, location, experience_years, price_per_session, profile_image_url, status, admin_notes, reviewed_by, reviewed_at, created_at"
        )
        .order("created_at", { ascending: false });

      if (queryError) {
        console.error("Trainer applications query error:", queryError);
        setError(
          "Could not load applications. Check your Supabase table permissions and RLS policies."
        );
        return;
      }

      setApplications((data ?? []) as TrainerApplication[]);
    } catch (err) {
      console.error("Unexpected applications error:", err);
      setError("Something went wrong while loading applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.full_name.toLowerCase().includes(query) ||
        application.specialty.toLowerCase().includes(query) ||
        application.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((item) => item.status === "pending").length,
      approved: applications.filter((item) => item.status === "approved").length,
      rejected: applications.filter((item) => item.status === "rejected").length,
    }),
    [applications]
  );

  async function reviewApplication(
    application: TrainerApplication,
    nextStatus: "approved" | "rejected"
  ) {
    const confirmation =
      nextStatus === "approved"
        ? `Approve ${application.full_name} as a trainer?`
        : `Reject ${application.full_name}'s application?`;

    if (!window.confirm(confirmation)) return;

    setUpdatingId(application.id);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Your session has expired. Please sign in again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        setError("Only administrators can review applications.");
        return;
      }

      const { data, error: updateError } = await supabase
        .from("trainer_applications")
        .update({
          status: nextStatus,
          admin_notes: adminNotes.trim() || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id)
        .eq("status", "pending")
        .select(
          "id, user_id, full_name, specialty, bio, location, experience_years, price_per_session, profile_image_url, status, admin_notes, reviewed_by, reviewed_at, created_at"
        )
        .maybeSingle();

      if (updateError) {
        console.error("Application review error:", updateError);
        setError(
          "Could not save the decision. Check your administrator permissions and RLS policies."
        );
        return;
      }

      if (!data) {
        setError(
          "No application was updated. It may have already been reviewed."
        );
        await loadApplications();
        return;
      }

      const updatedApplication = data as TrainerApplication;

      setApplications((current) =>
        current.map((item) =>
          item.id === updatedApplication.id ? updatedApplication : item
        )
      );

      setSelected((current) =>
        current?.id === updatedApplication.id ? updatedApplication : current
      );

      setAdminNotes("");
      setSuccess(
        `Application ${nextStatus === "approved" ? "approved" : "rejected"} successfully.`
      );
    } catch (err) {
      console.error("Unexpected review error:", err);
      setError("Something went wrong while reviewing the application.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6 text-[#F4F5F0]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Trainer Applications</h1>
          <p className="mt-1 text-sm text-white/50">
            Review applications submitted by fitness professionals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadApplications()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#222723] px-4 py-3 text-sm hover:border-[#C7F36B]/40 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-[#C7F36B]/20 bg-[#C7F36B]/10 p-4 text-sm text-[#C7F36B]"
        >
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Total applications", value: stats.total, icon: Users },
          { label: "Pending review", value: stats.pending, icon: Clock },
          { label: "Approved", value: stats.approved, icon: CheckCircle2 },
          { label: "Rejected", value: stats.rejected, icon: XCircle },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[#222723] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-white/50 sm:text-sm">
                  {stat.label}
                </p>
                <Icon size={18} className="shrink-0 text-[#C7F36B]" />
              </div>
              <p className="mt-3 text-2xl font-semibold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, specialty or location..."
            className="w-full rounded-xl border border-white/10 bg-[#222723] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#C7F36B]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-white/10 bg-[#222723] px-4 py-3 text-sm outline-none focus:border-[#C7F36B]"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#222723]">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-white/50">
            <LoaderCircle size={28} className="animate-spin text-[#C7F36B]" />
            <p className="text-sm">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center sm:p-14">
            <Users size={34} className="text-white/25" />
            <h3 className="mt-4 font-semibold">No applications found</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/45">
              {applications.length === 0
                ? "No trainer applications have been submitted yet. Submit an application through the trainer application form to see it here."
                : "No applications match your current search or status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 bg-[#171A18]/60 text-xs uppercase tracking-wide text-white/45">
                <tr>
                  <th className="px-5 py-4 font-medium">Trainer</th>
                  <th className="px-5 py-4 font-medium">Location</th>
                  <th className="px-5 py-4 font-medium">Experience</th>
                  <th className="px-5 py-4 font-medium">Session price</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Submitted</th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="font-medium">{application.full_name}</p>
                      <p className="mt-1 text-xs text-white/45">
                        {application.specialty}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-white/65">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={14} />
                        {application.location}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-white/65">
                      {application.experience_years} years
                    </td>

                    <td className="px-5 py-4 text-white/65">
                      {formatPrice(Number(application.price_per_session))}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyles[application.status]}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-white/55">
                      {formatDate(application.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(application);
                          setAdminNotes(application.admin_notes ?? "");
                          setError("");
                          setSuccess("");
                        }}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium hover:border-[#C7F36B]/40 hover:text-[#C7F36B]"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-title"
            className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#222723] p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#C7F36B]">
                  Trainer application
                </p>
                <h2
                  id="application-title"
                  className="mt-2 text-xl font-semibold"
                >
                  {selected.full_name}
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  {selected.specialty}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close application details"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#171A18] p-4">
                <MapPin size={17} className="text-[#C7F36B]" />
                <p className="mt-2 text-xs text-white/45">Location</p>
                <p className="mt-1 text-sm">{selected.location}</p>
              </div>

              <div className="rounded-xl bg-[#171A18] p-4">
                <CalendarDays size={17} className="text-[#C7F36B]" />
                <p className="mt-2 text-xs text-white/45">Experience</p>
                <p className="mt-1 text-sm">
                  {selected.experience_years} years
                </p>
              </div>

              <div className="rounded-xl bg-[#171A18] p-4 sm:col-span-2">
                <DollarSign size={17} className="text-[#C7F36B]" />
                <p className="mt-2 text-xs text-white/45">
                  Price per session
                </p>
                <p className="mt-1 text-sm">
                  {formatPrice(Number(selected.price_per_session))}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-medium">Professional biography</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/60">
                {selected.bio?.trim() || "No biography provided."}
              </p>
            </div>

            <div className="mt-5">
              <label
                htmlFor="adminNotes"
                className="text-sm font-medium"
              >
                Admin notes
              </label>
              <textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(event) => setAdminNotes(event.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="Optional review notes..."
                disabled={selected.status !== "pending" || updatingId !== null}
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#171A18] p-3 text-sm outline-none focus:border-[#C7F36B] disabled:opacity-60"
              />
            </div>

            <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
              <span
                className={`w-fit rounded-full border px-3 py-1.5 text-xs capitalize ${statusStyles[selected.status]}`}
              >
                {selected.status}
              </span>

              {selected.status === "pending" ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={updatingId === selected.id}
                    onClick={() =>
                      void reviewApplication(selected, "rejected")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 px-4 py-3 text-sm text-red-300 hover:bg-red-400/10 disabled:opacity-50"
                  >
                    {updatingId === selected.id ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    Reject
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === selected.id}
                    onClick={() =>
                      void reviewApplication(selected, "approved")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-semibold text-[#171A18] hover:bg-[#d5fa8b] disabled:opacity-50"
                  >
                    {updatingId === selected.id ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    Approve trainer
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5"
                >
                  Close
                </button>
              )}
            </div>

            {selected.reviewed_at && (
              <p className="mt-4 text-xs text-white/40">
                Reviewed on {formatDate(selected.reviewed_at)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
