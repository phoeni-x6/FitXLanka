
"use client";

import Link from "next/link";
import { Dumbbell, Menu, X } from "lucide-react";
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
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime text-brand-charcoal">
            <Dumbbell size={23} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-black tracking-tight">
            Fit<span className="text-brand-lime">XLanka</span>
          </span>
        </Link>

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

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-white md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/10 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-200 hover:text-brand-lime"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-200"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-brand-lime px-5 py-3 text-center text-sm font-bold text-brand-charcoal"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
