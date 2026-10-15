
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Eye,
  Check,
  X,
  MapPin,
  Dumbbell,
  Users,
  Clock3,
  XCircle,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

type ApprovalStatus = "Pending" | "Approved" | "Rejected";

type GymApplication = {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  submittedAt: string;
  status: ApprovalStatus;
  monthlyPrice: number;
  capacity: number;
  facilities: string[];
  description: string;
};

const initialApplications: GymApplication[] = [
  {
    id: "GYM-001",
    name: "Iron House Fitness",
    owner: "Kasun Perera",
    email: "ironhouse@example.com",
    phone: "+94 77 123 4567",
    location: "Nugegoda, Colombo",
    category: "Strength & Conditioning",
    submittedAt: "2026-10-10",
    status: "Pending",
    monthlyPrice: 6500,
    capacity: 120,
    facilities: ["Free weights", "Personal training", "Changing rooms"],
    description:
      "A strength-focused gym offering free weights, resistance machines, and personal training for members of all experience levels.",
  },
  {
    id: "GYM-002",
    name: "Elevate Fitness Club",
    owner: "Nethmi Silva",
    email: "elevate@example.com",
    phone: "+94 71 234 5678",
    location: "Rajagiriya, Colombo",
    category: "Premium Fitness",
    submittedAt: "2026-10-11",
    status: "Pending",
    monthlyPrice: 9500,
    capacity: 180,
    facilities: ["Cardio zone", "Group classes", "Showers"],
    description:
      "A modern fitness club with cardio equipment, group workouts, and guided training sessions.",
  },
  {
    id: "GYM-003",
    name: "Power Zone Gym",
    owner: "Amal Fernando",
    email: "powerzone@example.com",
    phone: "+94 76 345 6789",
    location: "Maharagama, Colombo",
    category: "Bodybuilding",
    submittedAt: "2026-10-08",
    status: "Approved",
    monthlyPrice: 5000,
    capacity: 100,
    facilities: ["Free weights", "Strength machines", "Parking"],
    description:
      "A community gym focused on bodybuilding, strength development, and accessible monthly memberships.",
  },
  {
    id: "GYM-004",
    name: "Core Motion Studio",
    owner: "Dinithi Jayawardena",
    email: "coremotion@example.com",
    phone: "+94 72 456 7890",
    location: "Dehiwala, Colombo",
    category: "Functional Training",
    submittedAt: "2026-10-12",
    status: "Pending",
    monthlyPrice: 7500,
    capacity: 70,
    facilities: ["Functional training", "Group classes", "Personal training"],
    description:
      "A small-group training studio offering functional workouts and personalised fitness programmes.",
  },
  {
    id: "GYM-005",
    name: "Fit District",
    owner: "Ravindu Perera",
    email: "fitdistrict@example.com",
    phone: "+94 75 567 8901",
    location: "Kandy",
    category: "General Fitness",
    submittedAt: "2026-10-07",
    status: "Rejected",
    monthlyPrice: 4500,
    capacity: 90,
    facilities: ["Cardio zone", "Free weights"],
    description:
      "A neighbourhood fitness centre offering general gym access and basic training equipment.",
  },
  {
    id: "GYM-006",
    name: "Athletica Performance",
    owner: "Tharushi Silva",
    email: "athletica@example.com",
    phone: "+94 70 678 9012",
    location: "Wattala, Gampaha",
    category: "Sports Performance",
    submittedAt: "2026-10-09",
    status: "Approved",
    monthlyPrice: 8500,
    capacity: 140,
    facilities: ["Performance training", "Strength machines", "Recovery area"],
    description:
      "A performance-oriented gym supporting strength, conditioning, and sports-specific training.",
  },
];

const statusStyles: Record<ApprovalStatus, string> = {
  Pending: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  Approved: "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B]",
  Rejected: "border-red-400/20 bg-red-400/10 text-red-300",
};

function formatLKR(amount: number) {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Building2;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#222723] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/50">{label}</p>
        <div className={`rounded-xl bg-white/[0.04] p-2 ${accent}`}>
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-[#F4F5F0]">
        {value}
      </p>
      <p className="mt-2 text-xs text-white/35">Demo application data</p>
    </div>
  );
}

export default function GymApprovals() {
  const [applications, setApplications] =
    useState<GymApplication[]>(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedGym, setSelectedGym] =
    useState<GymApplication | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    gym: GymApplication;
    status: "Approved" | "Rejected";
  } | null>(null);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((gym) => gym.status === "Pending").length,
      approved: applications.filter((gym) => gym.status === "Approved").length,
      rejected: applications.filter((gym) => gym.status === "Rejected").length,
    }),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((gym) => {
      const matchesSearch =
        !query ||
        gym.name.toLowerCase().includes(query) ||
        gym.owner.toLowerCase().includes(query) ||
        gym.location.toLowerCase().includes(query) ||
        gym.category.toLowerCase().includes(query) ||
        gym.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || gym.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  function confirmAction() {
    if (!pendingAction) return;

    setApplications((current) =>
      current.map((gym) =>
        gym.id === pendingAction.gym.id
          ? { ...gym, status: pendingAction.status }
          : gym
      )
    );

    if (selectedGym?.id === pendingAction.gym.id) {
      setSelectedGym({
        ...pendingAction.gym,
        status: pendingAction.status,
      });
    }

    setPendingAction(null);
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total applications"
          value={stats.total}
          icon={Building2}
          accent="text-white/70"
        />
        <StatCard
          label="Pending review"
          value={stats.pending}
          icon={Clock3}
          accent="text-amber-300"
        />
        <StatCard
          label="Approved gyms"
          value={stats.approved}
          icon={CheckCircle2}
          accent="text-[#C7F36B]"
        />
        <StatCard
          label="Rejected applications"
          value={stats.rejected}
          icon={XCircle}
          accent="text-red-300"
        />
      </div>

      {/* Search and filters */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#222723]">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#F4F5F0]">
              Gym applications
            </h2>
            <p className="mt-1 text-sm text-white/45">
              Review and manage gym listings submitted to FitX Lanka.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 sm:min-w-[260px]">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search gyms, owners, locations..."
                className="w-full rounded-xl border border-white/10 bg-[#171A18] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#C7F36B]/50"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#171A18] py-2.5 pl-9 pr-9 text-sm text-white outline-none focus:border-[#C7F36B]/50 sm:w-auto"
                aria-label="Filter applications by status"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="px-5 py-4 font-medium">Gym</th>
                <th className="px-5 py-4 font-medium">Owner</th>
                <th className="px-5 py-4 font-medium">Submitted</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredApplications.map((gym) => (
                <tr key={gym.id} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#171A18] text-[#C7F36B]">
                        <Dumbbell size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#F4F5F0]">
                          {gym.name}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-white/40">
                          <MapPin size={12} />
                          {gym.location}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          {gym.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-white/80">{gym.owner}</p>
                    <p className="mt-1 text-xs text-white/40">{gym.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/55">
                    {new Date(`${gym.submittedAt}T00:00:00`).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[gym.status]}`}
                    >
                      {gym.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedGym(gym)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:border-white/20 hover:text-white"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      {gym.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              setPendingAction({ gym, status: "Approved" })
                            }
                            aria-label={`Approve ${gym.name}`}
                            className="rounded-lg bg-[#C7F36B] p-2 text-[#171A18] transition hover:bg-[#d5ff84]"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() =>
                              setPendingAction({ gym, status: "Rejected" })
                            }
                            aria-label={`Reject ${gym.name}`}
                            className="rounded-lg border border-red-400/20 bg-red-400/10 p-2 text-red-300 transition hover:bg-red-400/20"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApplications.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Building2 className="mx-auto text-white/20" size={30} />
              <p className="mt-3 text-sm text-white/60">
                No gym applications found.
              </p>
              <p className="mt-1 text-xs text-white/35">
                Try another search term or status filter.
              </p>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 md:hidden">
          {filteredApplications.map((gym) => (
            <article
              key={gym.id}
              className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#222723] text-[#C7F36B]">
                  <Dumbbell size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#F4F5F0]">{gym.name}</p>
                  <p className="mt-1 text-xs text-white/45">{gym.owner}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-white/40">
                    <MapPin size={12} />
                    {gym.location}
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs ${statusStyles[gym.status]}`}
                  >
                    {gym.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.08] pt-3">
                <button
                  onClick={() => setSelectedGym(gym)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70"
                >
                  <Eye size={14} />
                  View details
                </button>
                {gym.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        setPendingAction({ gym, status: "Approved" })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#C7F36B] px-3 py-2 text-xs font-semibold text-[#171A18]"
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        setPendingAction({ gym, status: "Rejected" })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}

          {filteredApplications.length === 0 && (
            <p className="py-10 text-center text-sm text-white/45">
              No gym applications found.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] px-5 py-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredApplications.length} of {applications.length} demo
            applications
          </span>
          <span>Changes are not saved to a database.</span>
        </div>
      </section>

      {/* Gym details modal */}
      {selectedGym && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedGym(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="gym-details-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#222723] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#C7F36B]/10 p-3 text-[#C7F36B]">
                  <Dumbbell size={23} />
                </div>
                <div>
                  <h3
                    id="gym-details-title"
                    className="text-xl font-bold text-[#F4F5F0]"
                  >
                    {selectedGym.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/45">
                    Application ID: {selectedGym.id}
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs ${statusStyles[selectedGym.status]}`}
                  >
                    {selectedGym.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedGym(null)}
                aria-label="Close gym details"
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <h4 className="text-sm font-semibold text-[#F4F5F0]">
                  Gym description
                </h4>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {selectedGym.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <Users size={15} />
                    Owner
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/85">
                    {selectedGym.owner}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <MapPin size={15} />
                    Location
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/85">
                    {selectedGym.location}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <IndianRupee size={15} />
                    Monthly membership
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/85">
                    {formatLKR(selectedGym.monthlyPrice)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <Users size={15} />
                    Stated capacity
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/85">
                    {selectedGym.capacity} members
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#F4F5F0]">
                  Contact information
                </h4>
                <div className="mt-3 space-y-3 text-sm text-white/60">
                  <p className="flex items-center gap-2 break-all">
                    <Mail size={15} className="shrink-0 text-white/35" />
                    {selectedGym.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={15} className="shrink-0 text-white/35" />
                    {selectedGym.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays
                      size={15}
                      className="shrink-0 text-white/35"
                    />
                    Submitted on{" "}
                    {new Date(
                      `${selectedGym.submittedAt}T00:00:00`
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#F4F5F0]">
                  Category and facilities
                </h4>
                <p className="mt-2 text-sm text-white/50">
                  {selectedGym.category}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedGym.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="rounded-lg border border-white/10 bg-[#171A18] px-3 py-2 text-xs text-white/65"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {selectedGym.status === "Pending" && (
                <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row">
                  <button
                    onClick={() =>
                      setPendingAction({
                        gym: selectedGym,
                        status: "Approved",
                      })
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C7F36B] px-4 py-3 text-sm font-semibold text-[#171A18] transition hover:bg-[#d5ff84]"
                  >
                    <Check size={17} />
                    Approve gym
                  </button>
                  <button
                    onClick={() =>
                      setPendingAction({
                        gym: selectedGym,
                        status: "Rejected",
                      })
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                  >
                    <X size={17} />
                    Reject application
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Confirmation modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="gym-confirm-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#222723] p-6 shadow-2xl"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                pendingAction.status === "Approved"
                  ? "bg-[#C7F36B]/10 text-[#C7F36B]"
                  : "bg-red-400/10 text-red-300"
              }`}
            >
              {pendingAction.status === "Approved" ? (
                <CheckCircle2 size={24} />
              ) : (
                <XCircle size={24} />
              )}
            </div>
            <h3
              id="gym-confirm-title"
              className="mt-4 text-xl font-bold text-[#F4F5F0]"
            >
              {pendingAction.status === "Approved"
                ? "Approve this gym?"
                : "Reject this application?"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/55">
              You are about to mark{" "}
              <span className="font-semibold text-white/85">
                {pendingAction.gym.name}
              </span>{" "}
              as{" "}
              <span
                className={
                  pendingAction.status === "Approved"
                    ? "font-semibold text-[#C7F36B]"
                    : "font-semibold text-red-300"
                }
              >
                {pendingAction.status.toLowerCase()}
              </span>
              . This is a demo action and will not publish or remove a real
              listing.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPendingAction(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  pendingAction.status === "Approved"
                    ? "bg-[#C7F36B] text-[#171A18] hover:bg-[#d5ff84]"
                    : "bg-red-400 text-[#171A18] hover:bg-red-300"
                }`}
              >
                Confirm {pendingAction.status.toLowerCase()}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
