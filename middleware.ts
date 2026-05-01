import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { redis } from "@/lib/redis"; // Import redis client
import logger from "@/lib/logger"; // Import the logger

const RATE_LIMIT_THRESHOLD = 5; // 5 requests
const RATE_LIMIT_WINDOW = 60; // 1 minute in seconds for Redis expiry

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin routes with RBAC (existing logic)
  if (pathname.startsWith("/admin")) {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.user.role !== 'Admin' && session.user.role !== 'Super Admin') {
      logger.warn({ user: session.user.email, role: session.user.role, path: pathname }, `Unauthorized access attempt to /admin`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect Reservation and Login routes with distributed rate limiting
  if (pathname.startsWith("/api/reservation") || pathname.startsWith("/api/auth/login")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const key = `rate_limit:${ip}`;

    try {
      // Increment the counter for the IP. Set expiry if it's a new key.
      const [count, _] = await redis.multi()
        .incr(key)
        .expire(key, RATE_LIMIT_WINDOW)
        .exec();

      if (typeof count === 'number' && count > RATE_LIMIT_THRESHOLD) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    } catch (error) {
      logger.error({ error, ip, key }, "Rate limiting with Redis failed");
      // In case of Redis error, decide if you want to fail open (allow request) or fail closed (deny request).
      // For now, fail open to avoid blocking legitimate users if Redis is down.
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/reservation", "/api/auth/:path*", "/admin/:path*"],
};
