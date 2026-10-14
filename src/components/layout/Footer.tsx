
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#131513]">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="FitX Lanka home"
              className="inline-flex items-center"
            >
              <Image
                src="/images/fitx-lanka-logo.png.png"
                alt="FitX Lanka"
                width={200}
                height={67}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Your place to discover gyms and personal trainers
              across Sri Lanka. Start your fitness journey on your terms.
            </p>

            {/* Social links */}
            <div className="mt-5 flex gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-lg border border-white/10 p-2.5 text-gray-400 transition hover:border-brand-lime/40 hover:text-brand-lime"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="0.75"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-lg border border-white/10 p-2.5 text-gray-400 transition hover:border-brand-lime/40 hover:text-brand-lime"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  className="h-[18px] w-[18px]"
                  fill="currentColor"
                >
                  <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Discover links */}
          <div>
            <h3 className="font-bold text-white">Discover</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
              <Link
                href="/trainers"
                className="transition hover:text-brand-lime"
              >
                Personal trainers
              </Link>

              <Link
                href="/gyms"
                className="transition hover:text-brand-lime"
              >
                Gyms and fitness clubs
              </Link>

              <Link
                href="/bookings"
                className="transition hover:text-brand-lime"
              >
                My bookings
              </Link>
            </div>
          </div>

          {/* Get involved links */}
          <div>
            <h3 className="font-bold text-white">Get involved</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
              <Link
                href="/register"
                className="transition hover:text-brand-lime"
              >
                Join as a member
              </Link>

              <Link
                href="/register?role=trainer"
                className="inline-flex items-center gap-1 transition hover:text-brand-lime"
              >
                Become a trainer
                <ArrowUpRight size={14} />
              </Link>

              <Link
                href="/register?role=gym"
                className="inline-flex items-center gap-1 transition hover:text-brand-lime"
              >
                List your gym
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} FitX Lanka. All rights reserved.
          </p>

          <p>Built for the fitness community in Sri Lanka.</p>
        </div>
      </div>
    </footer>
  );
}
