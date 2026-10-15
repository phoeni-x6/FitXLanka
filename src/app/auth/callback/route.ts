
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const dashboardByRole: Record<string, string> = {
  client: "/dashboard",
  trainer: "/trainers/dashboard",
  gym_owner: "/gyms/dashboard",
  admin: "/admin/dashboard",
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=google_auth", requestUrl.origin)
    );
  }

  const supabase = await createClient();

  // Exchange Google's authorization code for a Supabase session.
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("OAuth callback error:", exchangeError.message);

    return NextResponse.redirect(
      new URL("/login?error=google_auth", requestUrl.origin)
    );
  }

  // Get the authenticated user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(
      new URL("/login?error=google_auth", requestUrl.origin)
    );
  }

  // Find the user's role in the profiles table.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    console.error("Profile lookup failed:", profileError?.message);

    return NextResponse.redirect(
      new URL("/login?error=profile_missing", requestUrl.origin)
    );
  }

  const destination = dashboardByRole[profile.role];

  if (!destination) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_role", requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
