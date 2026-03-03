import { NextRequest, NextResponse } from "next/server";

type BucketKey = string;

type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<BucketKey, Bucket>();

export function rateLimit(options: {
  req: NextRequest;
  key: string;
  limit: number;
  windowMs: number;
}): NextResponse | null {
  const ip =
    options.req.ip ??
    options.req.headers.get("x-forwarded-for") ??
    "unknown-ip";
  const bucketKey = `${options.key}:${ip}`;
  const now = Date.now();
  const existing = buckets.get(bucketKey);

  if (!existing || existing.expiresAt < now) {
    buckets.set(bucketKey, {
      count: 1,
      expiresAt: now + options.windowMs
    });
    return null;
  }

  if (existing.count >= options.limit) {
    const retryAfter = Math.ceil(
      (existing.expiresAt - now) / 1000
    ).toString();
    return new NextResponse(
      JSON.stringify({ error: "Too many requests, slow down." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter
        }
      }
    );
  }

  existing.count += 1;
  buckets.set(bucketKey, existing);
  return null;
}

