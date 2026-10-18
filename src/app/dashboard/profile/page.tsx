
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ClientProfileForm from "@/components/dashboard/ClientProfileForm";
import { requireRole } from "@/lib/auth/require-role";

export default async function ClientProfilePage() {
  await requireRole("client");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#171A18] px-4 py-8 text-[#F4F5F0] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-[#C7F36B]">
              CLIENT WORKSPACE
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              My profile.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
              Manage your account information and keep your FitX Lanka
              profile up to date.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <DashboardSidebar />
            </div>

            <div className="min-w-0">
              <ClientProfileForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
