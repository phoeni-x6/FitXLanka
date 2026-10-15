"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";

type GymGalleryProps = {
  name: string;
  images: string[];
};

export default function GymGallery({ name, images }: GymGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-[#222723] text-[#F4F5F0]/60">
        <Images className="mr-2" size={22} />
        No gym photos available
      </div>
    );
  }

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <>
      <section className="space-y-3">
        {/* Main photo */}
        <div className="group relative h-[260px] overflow-hidden rounded-2xl bg-[#222723] sm:h-[400px]">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="h-full w-full cursor-zoom-in"
            aria-label={`View ${name} photo ${activeIndex + 1} larger`}
          >
            <img
              src={images[activeIndex]}
              alt={`${name} - photo ${activeIndex + 1}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <p className="text-sm font-medium text-white">{name}</p>
            <p className="mt-1 text-xs text-white/75">
              {activeIndex + 1} of {images.length} photos
            </p>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#C7F36B] hover:text-[#171A18]"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-[#C7F36B] hover:text-[#171A18]"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-36 ${
                activeIndex === index
                  ? "border-[#C7F36B]"
                  : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Expanded photo viewer */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo gallery`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous photo"
            className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#C7F36B] hover:text-[#171A18] sm:left-6"
          >
            <ChevronLeft size={26} />
          </button>

          <img
            src={images[activeIndex]}
            alt={`${name} - photo ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
          />

          <button
            type="button"
            onClick={showNext}
            aria-label="Next photo"
            className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#C7F36B] hover:text-[#171A18] sm:right-6"
          >
            <ChevronRight size={26} />
          </button>

          <p className="absolute bottom-4 text-sm text-white/75">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}