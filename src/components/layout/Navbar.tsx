
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  FileCheck2,
  UserRound,
  LayoutDashboard,
  ChevronDown,
  Settings2,
  LogOut,
  Building2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

const links = [
  { label: "Find Trainers", href: "/trainers" },
  { label: "Explore Gyms", href: "/gyms" },
  { label: "Bookings", href: "/bookings" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasTrainerApplication, setHasTrainerApplication] = useState(false);
  const [hasGymApplication, setHasGymApplication] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isTrainer = userRole === "trainer";
  const isGymOwner = userRole === "gym_owner";

  const checkUserStatus = useCallback(async () => {
    const supabase = createClient();

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setUserRole(null);
        setHasTrainerApplication(false);
        setHasGymApplication(false);
        setAuthChecked(true);
        return;
      }

      const [
        { data: profile, error: profileError },
        { data: trainerApplication, error: trainerApplicationError },
        { data: gymApplication, error: gymApplicationError },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle(),

        supabase
          .from("trainer_applications")
          .select("id, status")
          .eq("user_id", user.id)
          .maybeSingle(),

        supabase
          .from("gym_applications")
          .select("id, status")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      if (profileError) {
        console.error("Unable to check user role:", profileError.message);
      }

      if (trainerApplicationError) {
        console.error(
          "Unable to check trainer application:",
          trainerApplicationError.message
        );
      }

      if (gymApplicationError) {
        console.error(
          "Unable to check gym application:",
          gymApplicationError.message
        );
      }

      const role = profileError ? null : profile?.role ?? null;

      setUserRole(role);

      setHasTrainerApplication(
        role !== "trainer" &&
          !trainerApplicationError &&
          Boolean(trainerApplication)
      );

      setHasGymApplication(
        role !== "gym_owner" &&
          !gymApplicationError &&
          Boolean(gymApplication)
      );

      setAuthChecked(true);
    } catch (error) {
      console.error("Unable to check authentication status:", error);
      setUserRole(null);
      setHasTrainerApplication(false);
      setHasGymApplication(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    void checkUserStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (active) {
        setTimeout(() => {
          if (active) {
            void checkUserStatus();
          }
        }, 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [checkUserStatus]);

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        setLoggingOut(false);
        return;
      }

      setUserRole(null);
      setHasTrainerApplication(false);
      setHasGymApplication(false);
      setAuthChecked(true);
      closeMenus();

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("An unexpected error occurred during logout:", error);
      setLoggingOut(false);
    }
  };

  const trainerApplicationLink = (
    <Link
      href="/trainers/application-status"
      onClick={closeMenus}
      className="inline-flex items-center gap-2 rounded-full border border-brand-lime/25 bg-brand-lime/10 px-4 py-2.5 text-sm font-semibold text-brand-lime transition hover:bg-brand-lime/20"
    >
      <FileCheck2 className="h-4 w-4 shrink-0" />
      My Trainer Application
    </Link>
  );

  const gymApplicationLink = (
    <Link
      href="/gyms/application-status"
      onClick={closeMenus}
      className="inline-flex items-center gap-2 rounded-full border border-brand-lime/25 bg-brand-lime/10 px-4 py-2.5 text-sm font-semibold text-brand-lime transition hover:bg-brand-lime/20"
    >
      <Building2 className="h-4 w-4 shrink-0" />
      My Gym Application
    </Link>
  );

  const profileIconClass = (open: boolean) =>
    `flex h-11 w-11 items-center justify-center rounded-full border transition ${
      open
        ? "border-brand-lime bg-brand-lime/15 text-brand-lime"
        : "border-white/10 bg-white/[0.04] text-white hover:border-brand-lime/50 hover:text-brand-lime"
    }`;

  const trainerProfileDropdown = (
    <div className="absolute right-0 top-full z-[60] mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#222723] p-2 shadow-2xl shadow-black/40">
      <div className="border-b border-white/10 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime/10">
            <UserRound className="h-5 w-5 text-brand-lime" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Trainer account</p>
            <p className="mt-0.5 text-xs text-gray-400">
              Manage your coaching profile
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1 py-2">
        <Link
          href="/trainers/dashboard"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-200 transition hover:bg-brand-lime/10 hover:text-brand-lime"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="flex-1">Trainer Dashboard</span>
        </Link>

        <Link
          href="/trainers/dashboard/profile"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-200 transition hover:bg-brand-lime/10 hover:text-brand-lime"
        >
          <Settings2 className="h-4 w-4" />
          <span className="flex-1">My Profile</span>
        </Link>
      </div>

      <div className="border-t border-white/10 pt-2">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </div>
  );

  const gymOwnerProfileDropdown = (
    <div className="absolute right-0 top-full z-[60] mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#222723] p-2 shadow-2xl shadow-black/40">
      <div className="border-b border-white/10 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime/10">
            <Building2 className="h-5 w-5 text-brand-lime" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Gym owner account</p>
            <p className="mt-0.5 text-xs text-gray-400">
              Manage your gym listing
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1 py-2">
        <Link
          href="/gyms/dashboard"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-200 transition hover:bg-brand-lime/10 hover:text-brand-lime"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="flex-1">Gym Dashboard</span>
        </Link>

        <Link
          href="/gyms/dashboard/profile"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-200 transition hover:bg-brand-lime/10 hover:text-brand-lime"
        >
          <Settings2 className="h-4 w-4" />
          <span className="flex-1">My Gym Profile</span>
        </Link>

        <Link
          href="/gyms/application-status"
          onClick={closeMenus}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-200 transition hover:bg-brand-lime/10 hover:text-brand-lime"
        >
          <FileCheck2 className="h-4 w-4" />
          <span className="flex-1">Application Details</span>
        </Link>
      </div>

      <div className="border-t border-white/10 pt-2">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-charcoal/95 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="FitX Lanka home"
          onClick={closeMenus}
          className="relative flex shrink-0 items-center"
        >
          <Image
            src="/images/fitx-lanka-logo.png.png"
            alt="FitX Lanka"
            width={180}
            height={60}
            priority
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 transition hover:text-brand-lime"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {authChecked && (isTrainer || isGymOwner) ? (
            <div className="relative">
              <button
                type="button"
                aria-label={
                  isGymOwner
                    ? "Open gym owner profile menu"
                    : "Open trainer profile menu"
                }
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((open) => !open)}
                className={profileIconClass(profileMenuOpen)}
              >
                {isGymOwner ? (
                  <Building2 className="h-5 w-5" />
                ) : (
                  <>
                    <UserRound className="h-5 w-5" />
                    <ChevronDown className="ml-0.5 h-3 w-3" />
                  </>
                )}
              </button>

              {profileMenuOpen &&
                (isGymOwner
                  ? gymOwnerProfileDropdown
                  : trainerProfileDropdown)}
            </div>
          ) : (
            <>
              {authChecked && hasTrainerApplication && trainerApplicationLink}
              {authChecked && hasGymApplication && gymApplicationLink}

              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:text-brand-lime"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-brand-lime px-5 py-2.5 text-sm font-bold text-brand-charcoal transition hover:bg-white"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          {authChecked && (isTrainer || isGymOwner) && (
            <div className="relative">
              <button
                type="button"
                aria-label={
                  isGymOwner
                    ? "Open gym owner profile menu"
                    : "Open trainer profile menu"
                }
                aria-expanded={profileMenuOpen}
                onClick={() => {
                  setProfileMenuOpen((open) => !open);
                  setMenuOpen(false);
                }}
                className={profileIconClass(profileMenuOpen)}
              >
                {isGymOwner ? (
                  <Building2 className="h-5 w-5" />
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </button>

              {profileMenuOpen &&
                (isGymOwner
                  ? gymOwnerProfileDropdown
                  : trainerProfileDropdown)}
            </div>
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMenuOpen((open) => !open);
              setProfileMenuOpen(false);
            }}
            className="rounded-lg p-2 text-white transition hover:text-brand-lime"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="text-sm text-gray-200 transition hover:text-brand-lime"
              >
                {link.label}
              </Link>
            ))}

            {authChecked && !isTrainer && !isGymOwner && (
              <>
                {hasTrainerApplication && (
                  <>
                    <div className="my-1 border-t border-white/10" />
                    {trainerApplicationLink}
                  </>
                )}

                {hasGymApplication && (
                  <>
                    <div className="my-1 border-t border-white/10" />
                    {gymApplicationLink}
                  </>
                )}

                <div className="my-1 border-t border-white/10" />

                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="text-sm text-gray-200 transition hover:text-brand-lime"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="rounded-full bg-brand-lime px-5 py-3 text-center text-sm font-bold text-brand-charcoal transition hover:bg-white"
                >
                  Get started
                </Link>
              </>
            )}

            {authChecked && (isTrainer || isGymOwner) && (
              <>
                <div className="my-1 border-t border-white/10" />

                <Link
                  href={isGymOwner ? "/gyms/dashboard" : "/trainers/dashboard"}
                  onClick={closeMenus}
                  className="flex items-center gap-3 text-sm text-gray-200 transition hover:text-brand-lime"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {isGymOwner ? "Gym Dashboard" : "Trainer Dashboard"}
                </Link>

                <Link
                  href={
                    isGymOwner
                      ? "/gyms/dashboard/profile"
                      : "/trainers/dashboard/profile"
                  }
                  onClick={closeMenus}
                  className="flex items-center gap-3 text-sm text-gray-200 transition hover:text-brand-lime"
                >
                  <Settings2 className="h-4 w-4" />
                  {isGymOwner ? "My Gym Profile" : "My Profile"}
                </Link>

                {isGymOwner && (
                  <Link
                    href="/gyms/application-status"
                    onClick={closeMenus}
                    className="flex items-center gap-3 text-sm text-gray-200 transition hover:text-brand-lime"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    Application Details
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-3 text-left text-sm font-medium text-red-400 transition hover:text-red-300 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Logging out..." : "Log Out"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
