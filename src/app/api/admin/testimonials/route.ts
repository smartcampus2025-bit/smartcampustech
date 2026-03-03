import { NextRequest, NextResponse } from "next/server";
import { mongoClientPromise } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";
import { requireAdmin, logAdminActivity } from "@/lib/adminAuth";
import { z } from "zod";

const DB_NAME = "smartcampustech";

const testimonialSchema = z.object({
  name: z.string().min(2).max(120),
  roleOrCourse: z.string().min(2).max(160),
  context: z.enum(["student", "sme", "founder"]),
  quote: z.string().min(10).max(600),
  projectSlug: z.string().optional()
});

export async function GET(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-testimonials-get",
    limit: 60,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("testimonials");

  const testimonials = await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-testimonials-post",
    limit: 30,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = testimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("testimonials");
  const now = new Date();

  const doc = {
    ...parsed.data,
    createdAt: now,
    updatedAt: now
  };

  const result = await collection.insertOne(doc);

  await logAdminActivity({
    adminEmail: auth.admin.email,
    action: "testimonial_created",
    details: { testimonialId: result.insertedId.toString() },
    req
  });

  return NextResponse.json(
    { testimonialId: result.insertedId.toString() },
    { status: 201 }
  );
}

