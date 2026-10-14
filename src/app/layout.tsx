
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitXLanka | Find Your Fit",
  description:
    "Discover gyms and personal trainers across Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
