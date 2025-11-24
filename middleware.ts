import { NextResponse } from "next/server";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;

    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      token?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

