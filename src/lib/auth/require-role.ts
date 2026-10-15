
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "client" | "trainer" | "gym_owner" | "admin";

const dashboardRoutes: Record<UserRole, string> = {
  client: "/dashboard",
  trainer: "/trainer/dashboard",
  gym_owner: "/gym/dashboard",
  admin: "/admin/dashboard",
};

export async function requireRole(requiredRole: UserRole) {
  const supabase = await createClient();

  // Verify the user's authenticated session on the server.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Read the role from the database, not from client-side input.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  const role = profile.role as UserRole;

  if (!(role in dashboardRoutes)) {
    redirect("/login");
  }

  // Send users to their own dashboard if they open the wrong one.
  if (role !== requiredRole) {
    redirect(dashboardRoutes[role]);
  }

  return { user, profile, supabase };
}
