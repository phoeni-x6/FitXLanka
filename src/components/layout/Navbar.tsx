
"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Find Trainers", href: "/trainers" },
  { label: "Explore Gyms", href: "/gyms" },
  { label: "Bookings", href: "/bookings" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-charcoal/95 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          aria-label="FitX Lanka home"
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
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-white transition hover:text-brand-lime md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-200 transition hover:text-brand-lime"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-1 border-t border-white/10" />

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-200 transition hover:text-brand-lime"
            >
              Log in
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-brand-lime px-5 py-3 text-center text-sm font-bold text-brand-charcoal transition hover:bg-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
