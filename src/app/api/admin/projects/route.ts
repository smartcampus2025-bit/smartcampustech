import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { requireAdmin, logAdminActivity } from "@/lib/adminAuth";
import { mongoClientPromise } from "@/lib/mongodb";
import { z } from "zod";
import type { ProjectCategory } from "@/lib/models";

const DB_NAME = "smartcampustech";

const projectSchema = z.object({
  slug: z.string().min(3).max(120),
  title: z.string().min(3).max(200),
  shortDescription: z.string().min(10).max(400),
  category: z.custom<ProjectCategory>(),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  clientType: z.enum(["student", "sme", "founder"]),
  techStack: z.array(z.string()).min(1),
  imageUrls: z.array(z.string().url()).optional()
});

export async function GET(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-projects-get",
    limit: 60,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("projects");

  const projects = await collection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-projects-post",
    limit: 30,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("projects");
  const now = new Date();

  const doc = {
    ...parsed.data,
    isPublished: parsed.data.isPublished ?? true,
    imageUrls: parsed.data.imageUrls ?? [],
    createdAt: now,
    updatedAt: now
  };

  const result = await collection.insertOne(doc);

  await logAdminActivity({
    adminEmail: auth.admin.email,
    action: "project_created",
    details: { slug: parsed.data.slug },
    req
  });

  return NextResponse.json(
    { projectId: result.insertedId.toString() },
    { status: 201 }
  );
}

