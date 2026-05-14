import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/getSession";
import { applyRateLimit } from "@/lib/rate-limit";

const STRICT_PATHS = ["/api/auth", "/api/chat"];

export async function proxy(req: NextRequest) {
  // 1. Handle dashboard authentication
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);
    }
  }

  // 2. Handle API rate limiting
  if (req.nextUrl.pathname.startsWith("/api")) {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const identifier = `${ip}:${req.nextUrl.pathname}`;

    const isStrictPath = STRICT_PATHS.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    );
    const rateLimitType = isStrictPath ? "strict" : "common";

    const { success, limit, remaining, reset } = await applyRateLimit(
      identifier,
      rateLimitType
    );

    if (!success) {
      return NextResponse.json(
        {
          error: "Too Many Requests",
          message: "You have exceeded the rate limit. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
  ],
};