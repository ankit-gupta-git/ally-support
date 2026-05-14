import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Common rate limiter for general API routes (10 requests per 10 seconds)
export const commonRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit/common",
});

// Strict rate limiter for sensitive routes (3 requests per 1 minute)
export const strictRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/strict",
});

// Apply rate limiting with fallback for local development
export async function applyRateLimit(
  identifier: string,
  type: "common" | "strict" = "common"
) {
  // Bypass if Redis is not configured
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("⚠️  Rate limiting bypassed: Upstash Redis environment variables are missing.");
    return {
      success: true,
      limit: 9999,
      remaining: 9999,
      reset: Date.now() + 100000,
    };
  }

  const limiter = type === "strict" ? strictRateLimiter : commonRateLimiter;
  
  return await limiter.limit(identifier);
}
