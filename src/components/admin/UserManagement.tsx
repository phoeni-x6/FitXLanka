
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Eye,
  Users,
  UserRound,
  Dumbbell,
  Building2,
  ShieldCheck,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  CheckCircle2,
  Clock3,
  Ban,
  X,
  CircleAlert,
} from "lucide-react";

type UserRole = "Client" | "Trainer" | "Gym Owner" | "Admin";
type AccountStatus = "Active" | "Pending" | "Suspended";

type PlatformUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  location: string;
  joinedAt: string;
  lastActive: string;
  description: string;
};

const initialUsers: PlatformUser[] = [
  {
    id: "USR-001",
    name: "Dilan Perera",
    email: "dilan.perera@example.com",
    phone: "+94 77 123 4567",
    role: "Client",
    status: "Active",
    location: "Colombo",
    joinedAt: "2026-09-12",
    lastActive: "2026-10-14",
    description: "Member looking for trainers and fitness facilities.",
  },
  {
    id: "USR-002",
    name: "Kasun Perera",
    email: "kasun.trainer@example.com",
    phone: "+94 71 234 5678",
    role: "Trainer",
    status: "Pending",
    location: "Nugegoda",
    joinedAt: "2026-10-10",
    lastActive: "2026-10-13",
    description: "Trainer account awaiting profile approval.",
  },
  {
    id: "USR-003",
    name: "Nethmi Silva",
    email: "nethmi.silva@example.com",
    phone: "+94 72 345 6789",
    role: "Trainer",
    status: "Active",
    location: "Rajagiriya",
    joinedAt: "2026-09-20",
    lastActive: "2026-10-14",
    description: "Personal trainer specialising in strength and conditioning.",
  },
  {
    id: "USR-004",
    name: "Amal Fernando",
    email: "amal.owner@example.com",
    phone: "+94 76 456 7890",
    role: "Gym Owner",
    status: "Active",
    location: "Maharagama",
    joinedAt: "2026-08-30",
    lastActive: "2026-10-12",
    description: "Gym owner managing a fitness facility listing.",
  },
  {
    id: "USR-005",
    name: "Dinithi Jayawardena",
    email: "dinithi.j@example.com",
    phone: "+94 75 567 8901",
    role: "Client",
    status: "Pending",
    location: "Dehiwala",
    joinedAt: "2026-10-12",
    lastActive: "2026-10-12",
    description: "Recently registered platform member.",
  },
  {
    id: "USR-006",
    name: "Ravindu Perera",
    email: "ravindu.p@example.com",
    phone: "+94 70 678 9012",
    role: "Gym Owner",
    status: "Suspended",
    location: "Kandy",
    joinedAt: "2026-07-15",
    lastActive: "2026-10-02",
    description: "Gym owner account temporarily suspended for review.",
  },
  {
    id: "USR-007",
    name: "Tharushi Silva",
    email: "tharushi.s@example.com",
    phone: "+94 78 789 0123",
    role: "Client",
    status: "Active",
    location: "Wattala",
    joinedAt: "2026-09-28",
    lastActive: "2026-10-11",
    description: "Member interested in gym memberships and group training.",
  },
  {
    id: "USR-008",
    name: "FitX Administrator",
    email: "admin@example.com",
    phone: "+94 11 234 5678",
    role: "Admin",
    status: "Active",
    location: "Colombo",
    joinedAt: "2026-06-01",
    lastActive: "2026-10-14",
    description: "Demo administrator account for the platform prototype.",
  },
];

const statusStyles: Record<AccountStatus, string> = {
  Active: "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B]",
  Pending: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  Suspended: "border-red-400/20 bg-red-400/10 text-red-300",
};

const roleStyles: Record<UserRole, string> = {
  Client: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  Trainer: "border-violet-400/20 bg-violet-400/10 text-violet-200",
  "Gym Owner": "border-orange-400/20 bg-orange-400/10 text-orange-200",
  Admin: "border-white/15 bg-white/[0.06] text-white/75",
};

function getRoleIcon(role: UserRole) {
  switch (role) {
    case "Trainer":
      return Dumbbell;
    case "Gym Owner":
      return Building2;
    case "Admin":
      return ShieldCheck;
    default:
      return UserRound;
  }
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Users;
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
      <p className="mt-2 text-xs text-white/35">Demo account data</p>
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    user: PlatformUser;
    status: AccountStatus;
  } | null>(null);

  const stats = useMemo(
    () => ({
      total: users.length,
      clients: users.filter((user) => user.role === "Client").length,
      trainers: users.filter((user) => user.role === "Trainer").length,
      gymOwners: users.filter((user) => user.role === "Gym Owner").length,
      pending: users.filter((user) => user.status === "Pending").length,
      suspended: users.filter((user) => user.status === "Suspended").length,
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.location.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function confirmAction() {
    if (!pendingAction) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === pendingAction.user.id
          ? { ...user, status: pendingAction.status }
          : user
      )
    );

    if (selectedUser?.id === pendingAction.user.id) {
      setSelectedUser({
        ...pendingAction.user,
        status: pendingAction.status,
      });
    }

    setPendingAction(null);
  }

  return (
    <div className="space-y-6">
      {/* Overview statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={stats.total}
          icon={Users}
          accent="text-white/70"
        />
        <StatCard
          label="Clients"
          value={stats.clients}
          icon={UserRound}
          accent="text-sky-300"
        />
        <StatCard
          label="Trainers"
          value={stats.trainers}
          icon={Dumbbell}
          accent="text-violet-300"
        />
        <StatCard
          label="Gym owners"
          value={stats.gymOwners}
          icon={Building2}
          accent="text-orange-300"
        />
      </div>

      {/* Account review summary */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#222723] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-amber-400/10 p-2.5 text-amber-200">
            <Clock3 size={19} />
          </div>
          <div>
            <h2 className="font-semibold text-[#F4F5F0]">
              Account review summary
            </h2>
            <p className="mt-1 text-sm text-white/45">
              Review pending registrations and check suspended accounts.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setStatusFilter("Pending");
              setRoleFilter("All");
            }}
            className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs font-medium text-amber-200 transition hover:bg-amber-400/10"
          >
            {stats.pending} pending
          </button>
          <button
            onClick={() => {
              setStatusFilter("Suspended");
              setRoleFilter("All");
            }}
            className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-400/10"
          >
            {stats.suspended} suspended
          </button>
        </div>
      </div>

      {/* User directory */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#222723]">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#F4F5F0]">
              Platform users
            </h2>
            <p className="mt-1 text-sm text-white/45">
              Search accounts and review user roles and statuses.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:flex">
            <div className="relative sm:col-span-2 xl:min-w-[250px]">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, ID..."
                className="w-full rounded-xl border border-white/10 bg-[#171A18] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#C7F36B]/50"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                aria-label="Filter users by role"
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#171A18] py-2.5 pl-9 pr-8 text-sm text-white outline-none focus:border-[#C7F36B]/50"
              >
                <option value="All">All roles</option>
                <option value="Client">Client</option>
                <option value="Trainer">Trainer</option>
                <option value="Gym Owner">Gym Owner</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter users by account status"
              className="w-full rounded-xl border border-white/10 bg-[#171A18] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C7F36B]/50"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-white/[0.025] text-xs uppercase tracking-wider text-white/40">
              <tr>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Joined</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);

                return (
                  <tr
                    key={user.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#171A18] text-[#C7F36B]">
                          <RoleIcon size={19} />
                        </div>
                        <div>
                          <p className="font-semibold text-[#F4F5F0]">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-white/45">
                            {user.email}
                          </p>
                          <p className="mt-1 text-xs text-white/30">
                            {user.id} · {user.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${roleStyles[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/55">
                      {formatDate(user.joinedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition hover:border-white/20 hover:text-white"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        {user.role !== "Admin" && (
                          <button
                            onClick={() =>
                              setPendingAction({
                                user,
                                status:
                                  user.status === "Suspended"
                                    ? "Active"
                                    : "Suspended",
                              })
                            }
                            title={
                              user.status === "Suspended"
                                ? "Reactivate account"
                                : "Suspend account"
                            }
                            aria-label={
                              user.status === "Suspended"
                                ? `Reactivate ${user.name}`
                                : `Suspend ${user.name}`
                            }
                            className={`rounded-lg border p-2 transition ${
                              user.status === "Suspended"
                                ? "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B] hover:bg-[#C7F36B]/20"
                                : "border-red-400/20 bg-red-400/5 text-red-300 hover:bg-red-400/10"
                            }`}
                          >
                            {user.status === "Suspended" ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <Ban size={15} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Users className="mx-auto text-white/20" size={30} />
              <p className="mt-3 text-sm text-white/60">
                No users match your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                }}
                className="mt-3 text-xs font-medium text-[#C7F36B] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 md:hidden">
          {filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role);

            return (
              <article
                key={user.id}
                className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#222723] text-[#C7F36B]">
                    <RoleIcon size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#F4F5F0]">{user.name}</p>
                    <p className="mt-1 break-all text-xs text-white/45">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      {user.id} · {user.location}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${roleStyles[user.role]}`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${statusStyles[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.08] pt-3">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70"
                  >
                    <Eye size={14} />
                    View details
                  </button>
                  {user.role !== "Admin" && (
                    <button
                      onClick={() =>
                        setPendingAction({
                          user,
                          status:
                            user.status === "Suspended" ? "Active" : "Suspended",
                        })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs ${
                        user.status === "Suspended"
                          ? "border-[#C7F36B]/20 text-[#C7F36B]"
                          : "border-red-400/20 text-red-300"
                      }`}
                    >
                      {user.status === "Suspended" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Ban size={14} />
                      )}
                      {user.status === "Suspended" ? "Reactivate" : "Suspend"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-white/45">
                No users match your filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                }}
                className="mt-3 text-xs font-medium text-[#C7F36B] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] px-5 py-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredUsers.length} of {users.length} demo accounts
          </span>
          <span>Changes are not saved to a database.</span>
        </div>
      </section>

      {/* User details modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUser(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-details-title"
            className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#222723] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#C7F36B]/10 p-3 text-[#C7F36B]">
                  {(() => {
                    const RoleIcon = getRoleIcon(selectedUser.role);
                    return <RoleIcon size={23} />;
                  })()}
                </div>
                <div>
                  <h3
                    id="user-details-title"
                    className="text-xl font-bold text-[#F4F5F0]"
                  >
                    {selectedUser.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    User ID: {selectedUser.id}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs ${roleStyles[selectedUser.role]}`}
                    >
                      {selectedUser.role}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs ${statusStyles[selectedUser.status]}`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                aria-label="Close user details"
                className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <h4 className="text-sm font-semibold text-[#F4F5F0]">
                  Account information
                </h4>
                <div className="mt-3 space-y-3 text-sm text-white/60">
                  <p className="flex items-start gap-3 break-all">
                    <Mail size={16} className="mt-0.5 shrink-0 text-white/35" />
                    {selectedUser.email}
                  </p>
                  <p className="flex items-start gap-3">
                    <Phone size={16} className="mt-0.5 shrink-0 text-white/35" />
                    {selectedUser.phone}
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-white/35"
                    />
                    {selectedUser.location}
                  </p>
                  <p className="flex items-start gap-3">
                    <CalendarDays
                      size={16}
                      className="mt-0.5 shrink-0 text-white/35"
                    />
                    Joined {formatDate(selectedUser.joinedAt)}
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock3
                      size={16}
                      className="mt-0.5 shrink-0 text-white/35"
                    />
                    Last active {formatDate(selectedUser.lastActive)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#171A18] p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Profile summary
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {selectedUser.description}
                </p>
              </div>

              {selectedUser.role !== "Admin" && (
                <button
                  onClick={() =>
                    setPendingAction({
                      user: selectedUser,
                      status:
                        selectedUser.status === "Suspended"
                          ? "Active"
                          : "Suspended",
                    })
                  }
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    selectedUser.status === "Suspended"
                      ? "border-[#C7F36B]/20 bg-[#C7F36B]/10 text-[#C7F36B] hover:bg-[#C7F36B]/15"
                      : "border-red-400/20 bg-red-400/5 text-red-300 hover:bg-red-400/10"
                  }`}
                >
                  {selectedUser.status === "Suspended" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Ban size={16} />
                  )}
                  {selectedUser.status === "Suspended"
                    ? "Reactivate account"
                    : "Suspend account"}
                </button>
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
            aria-labelledby="user-confirm-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#222723] p-6 shadow-2xl"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                pendingAction.status === "Suspended"
                  ? "bg-red-400/10 text-red-300"
                  : "bg-[#C7F36B]/10 text-[#C7F36B]"
              }`}
            >
              {pendingAction.status === "Suspended" ? (
                <CircleAlert size={24} />
              ) : (
                <CheckCircle2 size={24} />
              )}
            </div>

            <h3
              id="user-confirm-title"
              className="mt-4 text-xl font-bold text-[#F4F5F0]"
            >
              {pendingAction.status === "Suspended"
                ? "Suspend this account?"
                : "Reactivate this account?"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/55">
              You are about to mark{" "}
              <span className="font-semibold text-white/85">
                {pendingAction.user.name}
              </span>{" "}
              as{" "}
              <span
                className={
                  pendingAction.status === "Suspended"
                    ? "font-semibold text-red-300"
                    : "font-semibold text-[#C7F36B]"
                }
              >
                {pendingAction.status.toLowerCase()}
              </span>
              . This demo action does not change real access permissions.
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
                  pendingAction.status === "Suspended"
                    ? "bg-red-400 text-[#171A18] hover:bg-red-300"
                    : "bg-[#C7F36B] text-[#171A18] hover:bg-[#d5ff84]"
                }`}
              >
                Confirm
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
