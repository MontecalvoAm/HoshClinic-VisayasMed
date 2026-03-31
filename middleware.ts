import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter (Note: In production with multiple instances, use Redis)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_THRESHOLD = 5; // 5 requests
const RATE_LIMIT_WINDOW = 60000; // 1 minute

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("sb-access-token")?.value;
    
    if (!sessionCookie) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Reservation and Login routes with rate limiting
  if (pathname.startsWith("/api/reservation") || pathname.startsWith("/api/auth/login")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - rateData.lastReset > RATE_LIMIT_WINDOW) {
      rateData.count = 1;
      rateData.lastReset = now;
    } else {
      rateData.count++;
    }

    rateLimitMap.set(ip, rateData);

    if (rateData.count > RATE_LIMIT_THRESHOLD) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/reservation", "/api/auth/:path*", "/admin/:path*"],
};
