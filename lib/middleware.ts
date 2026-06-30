import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "./supabase/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = await getSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (path.startsWith("/checkout")) {
    if (!session) {
      url.pathname = "/login";
      url.searchParams.set("redirectTo", path);
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/vendor/register")) {
    if (!session) {
      url.pathname = "/login";
      url.searchParams.set("redirectTo", path);
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/my-shop")) {
    if (!session) {
      url.pathname = "/login";
      url.searchParams.set("redirectTo", path);
      return NextResponse.redirect(url);
    }

    const { data: vendorData } = await supabase
      .from("vendors")
      .select("id")
      .eq("vendor_id", session.user.id)
      .single();

    if (!vendorData) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/checkout/:path*", "/vendor/register/:path*", "/my-shop/:path*"],
};
