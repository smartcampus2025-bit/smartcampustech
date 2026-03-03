import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { requireAdmin, logAdminActivity } from "@/lib/adminAuth";
import { getWebsiteContent, upsertWebsiteContent } from "@/lib/repositories";
import { z } from "zod";

const contentSchema = z.object({
  key: z.string(),
  content: z.unknown()
});

export async function GET(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-content-get",
    limit: 60,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Missing key parameter" },
      { status: 400 }
    );
  }

  const doc = await getWebsiteContent(key as any);
  return NextResponse.json({ content: doc?.content ?? null });
}

export async function POST(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-content-post",
    limit: 30,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = contentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await upsertWebsiteContent(parsed.data.key as any, parsed.data.content);

  await logAdminActivity({
    adminEmail: auth.admin.email,
    action: "content_updated",
    details: { key: parsed.data.key },
    req
  });

  return NextResponse.json({ success: true });
}

