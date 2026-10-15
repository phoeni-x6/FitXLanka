
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Eye,
  Check,
  X,
  Clock3,
  Users,
  BadgeCheck,
  Ban,
  MapPin,
  Mail,
  CalendarDays,
  Dumbbell,
  ArrowLeft,
  XCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type ApplicationStatus = "Pending" | "Approved" | "Rejected";

type TrainerApplication = {
  id: number;
  name: string;
  email: string;
  specialty: string;
  location: string;
  experience: number;
  price: number;
  submittedAt: string;
  status: ApplicationStatus;
  bio: string;
};

const initialApplications: TrainerApplication[] = [
  {
    id: 1,
    name: "Kasun Perera",
    email: "kasun.demo@example.com",
    specialty: "Strength & Muscle Building",
    location: "Colombo",
    experience: 5,
    price: 3500,
    submittedAt: "12 Oct 2026",
    status: "Pending",
    bio: "Focuses on strength development, progressive overload, and structured muscle-building programmes for different experience levels.",
  },
  {
    id: 2,
    name: "Nethmi Silva",
    email: "nethmi.demo@example.com",
    specialty: "Weight Loss & Fitness",
    location: "Nugegoda",
    experience: 4,
    price: 3000,
    submittedAt: "11 Oct 2026",
    status: "Pending",
    bio: "Specialises in sustainable fitness routines, weight management, and building long-term exercise habits.",
  },
  {
    id: 3,
    name: "Amal Fernando",
    email: "amal.demo@example.com",
    specialty: "Bodybuilding & Conditioning",
    location: "Dehiwala",
    experience: 7,
    price: 4000,
    submittedAt: "10 Oct 2026",
    status: "Approved",
    bio: "Works with clients on bodybuilding fundamentals, conditioning, and structured training plans.",
  },
  {
    id: 4,
    name: "Dinithi Jayawardena",
    email: "dinithi.demo@example.com",
    specialty: "Functional Training",
    location: "Maharagama",
    experience: 3,
    price: 2500,
    submittedAt: "09 Oct 2026",
    status: "Pending",
    bio: "Focuses on functional movement, mobility, and general fitness for everyday activities.",
  },
  {
    id: 5,
    name: "Ravindu Perera",
    email: "ravindu.demo@example.com",
    specialty: "Personal Training",
    location: "Kotte",
    experience: 2,
    price: 2000,
    submittedAt: "08 Oct 2026",
    status: "Rejected",
    bio: "Provides general personal training and beginner-friendly workout guidance.",
  },
  {
    id: 6,
    name: "Tharushi Silva",
    email: "tharushi.demo@example.com",
    specialty: "Strength & Conditioning",
    location: "Rajagiriya",
    experience: 6,
    price: 3500,
    submittedAt: "07 Oct 2026",
    status: "Approved",
    bio: "Focuses on strength training, conditioning, and goal-oriented workout programmes.",
  },
];

const statusOptions = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
] as const;

type StatusFilter = (typeof statusOptions)[number];

export default function TrainerApprovals() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");
  const [selected, setSelected] =
    useState<TrainerApplication | null>(null);
  const [confirmation, setConfirmation] = useState<{
    application: TrainerApplication;
    status: "Approved" | "Rejected";
  } | null>(null);

  const stats = useMemo(
    () => [
      {
        label: "Total applications",
        value: applications.length,
        icon: Users,
        color: "text-sky-400",
        bg: "bg-sky-400/10",
      },
      {
        label: "Pending review",
        value: applications.filter((item) => item.status === "Pending").length,
        icon: Clock3,
        color: "text-amber-300",
        bg: "bg-amber-400/10",
      },
      {
        label: "Approved",
        value: applications.filter((item) => item.status === "Approved").length,
        icon: BadgeCheck,
        color: "text-[#C7F36B]",
        bg: "bg-[#C7F36B]/10",
      },
      {
        label: "Rejected",
        value: applications.filter((item) => item.status === "Rejected").length,
        icon: Ban,
        color: "text-red-300",
        bg: "bg-red-400/10",
      },
    ],
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesSearch =
        !term ||
        application.name.toLowerCase().includes(term) ||
        application.email.toLowerCase().includes(term) ||
        application.specialty.toLowerCase().includes(term) ||
        application.location.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  function requestStatusChange(
    application: TrainerApplication,
    status: "Approved" | "Rejected"
  ) {
    setConfirmation({ application, status });
  }

  function confirmStatusChange() {
    if (!confirmation) return;

    const { application, status } = confirmation;

    setApplications((current) =>
      current.map((item) =>
        item.id === application.id
          ? { ...item, status }
          : item
      )
    );

    setSelected((current) =>
      current?.id === application.id
        ? { ...current, status }
        : current
    );

    setConfirmation(null);
  }

  const statusStyles: Record<ApplicationStatus, string> = {
    Pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    Approved: "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B]",
    Rejected: "border-red-400/20 bg-red-400/10 text-red-300",
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-[#222723] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-white/50">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-white">
                    {stat.value.toString().padStart(2, "0")}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="mt-3 text-xs text-white/35">
                Demo application data
              </p>
            </div>
          );
        })}
      </div>

      {/* Applications table */}
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#222723]">
        <div className="border-b border-white/10 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Trainer applications
              </h2>
              <p className="mt-1 text-sm text-white/45">
                Review applications before trainer profiles are published.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, specialty..."
                  aria-label="Search trainer applications"
                  className="w-full rounded-xl border border-white/10 bg-[#171A18] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#C7F36B]/50"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusFilter)
                  }
                  aria-label="Filter by application status"
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#171A18] py-3 pl-9 pr-8 text-sm text-white outline-none focus:border-[#C7F36B]/50 sm:w-auto"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "All" ? "All statuses" : status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  statusFilter === status
                    ? "bg-[#C7F36B] text-[#171A18]"
                    : "border border-white/10 text-white/55 hover:bg-white/5"
                }`}
              >
                {status}
                {status !== "All" && (
                  <span className="ml-2 opacity-70">
                    {
                      applications.filter(
                        (item) => item.status === status
                      ).length
                    }
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[#171A18]/60">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Trainer
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Specialty
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Submitted
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-white/40">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredApplications.map((application) => (
                <tr
                  key={application.id}
                  className="transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C7F36B]/10 text-sm font-bold text-[#C7F36B]">
                        {application.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {application.name}
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          {application.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-white/75">
                      {application.specialty}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      {application.location}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-white/55">
                    {application.submittedAt}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[application.status]}`}
                    >
                      {application.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelected(application)}
                        aria-label={`View ${application.name}'s application`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:border-white/20 hover:text-white"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      {application.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              requestStatusChange(application, "Approved")
                            }
                            aria-label={`Approve ${application.name}`}
                            className="rounded-lg bg-[#C7F36B] p-2 text-[#171A18] transition hover:bg-[#d6ff84]"
                          >
                            <Check size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              requestStatusChange(application, "Rejected")
                            }
                            aria-label={`Reject ${application.name}`}
                            className="rounded-lg border border-red-400/20 p-2 text-red-300 transition hover:bg-red-400/10"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <Search className="mx-auto h-8 w-8 text-white/20" />
                    <p className="mt-3 text-sm font-medium text-white/65">
                      No applications found
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      Try a different search term or status filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                      }}
                      className="mt-4 text-xs font-semibold text-[#C7F36B] hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 px-5 py-4 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
          <p>Sample data · Changes are not saved</p>
        </div>
      </section>

      {/* Application details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="trainer-details-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#222723] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C7F36B]">
                  Application details
                </p>
                <h2
                  id="trainer-details-title"
                  className="mt-2 text-xl font-bold text-white"
                >
                  {selected.name}
                </h2>
                <p className="mt-1 text-sm text-white/45">
                  Trainer application #{selected.id.toString().padStart(4, "0")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close application details"
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles[selected.status]}`}
                >
                  {selected.status}
                </span>

                <span className="text-xs text-white/40">
                  Submitted {selected.submittedAt}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#171A18] p-4">
                  <Mail className="h-4 w-4 text-[#C7F36B]" />
                  <p className="mt-3 text-xs text-white/40">Email</p>
                  <p className="mt-1 break-all text-sm text-white">
                    {selected.email}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#171A18] p-4">
                  <MapPin className="h-4 w-4 text-[#C7F36B]" />
                  <p className="mt-3 text-xs text-white/40">Location</p>
                  <p className="mt-1 text-sm text-white">
                    {selected.location}, Sri Lanka
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#171A18] p-4">
                  <Dumbbell className="h-4 w-4 text-[#C7F36B]" />
                  <p className="mt-3 text-xs text-white/40">Specialty</p>
                  <p className="mt-1 text-sm text-white">
                    {selected.specialty}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#171A18] p-4">
                  <CalendarDays className="h-4 w-4 text-[#C7F36B]" />
                  <p className="mt-3 text-xs text-white/40">Experience</p>
                  <p className="mt-1 text-sm text-white">
                    {selected.experience} years
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
                  About the trainer
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {selected.bio}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#171A18] p-4">
                <p className="text-xs text-white/40">
                  Listed session price
                </p>
                <p className="mt-1 text-xl font-bold text-[#C7F36B]">
                  LKR {selected.price.toLocaleString("en-LK")}
                  <span className="ml-1 text-xs font-normal text-white/40">
                    / session
                  </span>
                </p>
              </div>

              {selected.status === "Pending" ? (
                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      requestStatusChange(selected, "Approved")
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-bold text-[#171A18] transition hover:bg-[#d6ff84]"
                  >
                    <CheckCircle2 size={17} />
                    Approve trainer
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      requestStatusChange(selected, "Rejected")
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/20 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                  >
                    <XCircle size={17} />
                    Reject application
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/10 pt-5">
                  <p className="text-sm text-white/45">
                    This application is already {selected.status.toLowerCase()}.
                    Only pending applications can be reviewed here.
                  </p>
                </div>
              )}

              <p className="text-xs leading-5 text-amber-200/60">
                Demo profile only. Verify identity, qualifications, and any
                required credentials before approving real trainer listings.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Status confirmation modal */}
      {confirmation && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setConfirmation(null)}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#222723] p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                confirmation.status === "Approved"
                  ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                  : "bg-red-400/10 text-red-300"
              }`}
            >
              {confirmation.status === "Approved" ? (
                <CheckCircle2 size={23} />
              ) : (
                <AlertTriangle size={23} />
              )}
            </div>

            <h2
              id="confirmation-title"
              className="mt-4 text-lg font-bold text-white"
            >
              {confirmation.status === "Approved"
                ? "Approve this trainer?"
                : "Reject this application?"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/55">
              {confirmation.status === "Approved"
                ? `${confirmation.application.name} will be marked as approved in this prototype.`
                : `${confirmation.application.name} will be marked as rejected in this prototype.`}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmStatusChange}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  confirmation.status === "Approved"
                    ? "bg-[#C7F36B] text-[#171A18] hover:bg-[#d6ff84]"
                    : "bg-red-400 text-[#171A18] hover:bg-red-300"
                }`}
              >
                Confirm {confirmation.status.toLowerCase()}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
