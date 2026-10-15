
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  FileCheck2,
  UserRound,
  LayoutDashboard,
  ChevronDown,
  Settings2,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasTrainerApplication, setHasTrainerApplication] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const isTrainer = userRole === "trainer";

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
        setAuthChecked(true);
        return;
      }

      const [
        { data: profile, error: profileError },
        { data: application, error: applicationError },
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
      ]);

      if (profileError) {
        console.error("Unable to check user role:", profileError.message);
      }

      if (applicationError) {
        console.error(
          "Unable to check trainer application:",
          applicationError.message
        );
      }

      const role = profileError ? null : profile?.role ?? null;

      setUserRole(role);

      // Only show the application link to applicants who are not trainers.
      setHasTrainerApplication(
        role !== "trainer" &&
          !applicationError &&
          Boolean(application)
      );

      setAuthChecked(true);
    } catch (error) {
      console.error("Unable to check authentication status:", error);
      setUserRole(null);
      setHasTrainerApplication(false);
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadStatus() {
      await checkUserStatus();
    }

    loadStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (active) {
        // Run the Supabase queries after the auth callback completes.
        setTimeout(() => {
          if (active) {
            checkUserStatus();
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

  const applicationLink = (
    <Link
      href="/trainers/application-status"
      onClick={closeMenus}
      className="inline-flex items-center gap-2 rounded-full border border-brand-lime/25 bg-brand-lime/10 px-4 py-2.5 text-sm font-semibold text-brand-lime transition hover:bg-brand-lime/20"
    >
      <FileCheck2 className="h-4 w-4 shrink-0" />
      My Trainer Application
    </Link>
  );

  const trainerProfileDropdown = (
    <div className="absolute right-0 top-full z-[60] mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#222723] p-2 shadow-2xl shadow-black/40">
      <div className="border-b border-white/10 px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime/10">
            <UserRound className="h-5 w-5 text-brand-lime" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Trainer account
            </p>
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
          {authChecked && isTrainer ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Open trainer profile menu"
                aria-expanded={profileMenuOpen}
                onClick={() =>
                  setProfileMenuOpen((open) => !open)
                }
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                  profileMenuOpen
                    ? "border-brand-lime bg-brand-lime/15 text-brand-lime"
                    : "border-white/10 bg-white/[0.04] text-white hover:border-brand-lime/50 hover:text-brand-lime"
                }`}
              >
                <UserRound className="h-5 w-5" />
                <ChevronDown className="ml-0.5 h-3 w-3" />
              </button>

              {profileMenuOpen && trainerProfileDropdown}
            </div>
          ) : (
            <>
              {authChecked && hasTrainerApplication && applicationLink}

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
          {authChecked && isTrainer && (
            <div className="relative">
              <button
                type="button"
                aria-label="Open trainer profile menu"
                aria-expanded={profileMenuOpen}
                onClick={() =>
                  setProfileMenuOpen((open) => !open)
                }
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  profileMenuOpen
                    ? "border-brand-lime bg-brand-lime/15 text-brand-lime"
                    : "border-white/10 text-white hover:border-brand-lime/50 hover:text-brand-lime"
                }`}
              >
                <UserRound className="h-5 w-5" />
              </button>

              {profileMenuOpen && trainerProfileDropdown}
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

            {authChecked && isTrainer && (
              <>
                <div className="my-1 border-t border-white/10" />

                <Link
                  href="/trainers/dashboard"
                  onClick={closeMenus}
                  className="flex items-center gap-3 text-sm text-gray-200 transition hover:text-brand-lime"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Trainer Dashboard
                </Link>

                <Link
                  href="/trainers/dashboard/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 text-sm text-gray-200 transition hover:text-brand-lime"
                >
                  <Settings2 className="h-4 w-4" />
                  My Profile
                </Link>
              </>
            )}

            {authChecked && !isTrainer && hasTrainerApplication && (
              <>
                <div className="my-1 border-t border-white/10" />
                {applicationLink}
              </>
            )}

            {(!authChecked || !isTrainer) && (
              <>
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
          </div>
        </div>
      )}
    </header>
  );
}
