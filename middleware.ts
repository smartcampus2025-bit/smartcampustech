import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_JWT_COOKIE = "sct_admin_token";

function verifyAdminToken(token: string | undefined) {
  if (!token) return null;

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;

  try {
    const payload = jwt.verify(token, secret) as { role?: string } | null;
    if (!payload || payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/secure-admin")) {
    const token = request.cookies.get(ADMIN_JWT_COOKIE)?.value;
    const valid = verifyAdminToken(token);

    if (!valid) {
      const loginUrl = new URL("/secure-admin-login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(ADMIN_JWT_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0
      });
      return response;
    }

    return NextResponse.next();
  }

  if (pathname === "/secure-admin-login") {
    const token = request.cookies.get(ADMIN_JWT_COOKIE)?.value;
    const valid = verifyAdminToken(token);
    if (valid) {
      const dashboardUrl = new URL("/secure-admin", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/secure-admin/:path*", "/secure-admin-login"]
};

