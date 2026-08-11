import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // create client that can refresh the session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // write cookies to both request and response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // this refreshes the session if expired — critical
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (
    path.startsWith("/checkout") ||
    path.startsWith("/vendor/register") ||
    path.startsWith("/my-shop") ||
    path.startsWith("/orders") ||
    path.startsWith("/my-orders")
  ) {
    if (!user) {
      url.pathname = "/login";
      url.searchParams.set("redirectTo", path);
      return NextResponse.redirect(url);
    }
  }

  if (path.startsWith("/my-shop")) {
    const { data: vendorData } = await supabase
      .from("vendors")
      .select("id")
      .eq("vendor_id", user!.id)
      .single();

    if (!vendorData) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/vendor/registration/:path*",
    "/my-shop/:path*",
    "/orders/:path*",
    "/my-orders/:path*",
    "/manage-products/:path*",
    "/add-product/:path*",
  ],
};
