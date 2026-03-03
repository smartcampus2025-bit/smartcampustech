import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { requireAdmin, logAdminActivity } from "@/lib/adminAuth";
import { rateLimit } from "@/lib/rateLimit";
import { mongoClientPromise } from "@/lib/mongodb";

const DB_NAME = "smartcampustech";

const updateSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    shortDescription: z.string().min(10).max(400).optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional()
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided"
  });

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(req: NextRequest, { params }: Params) {
  const limited = rateLimit({
    req,
    key: "admin-projects-patch",
    limit: 30,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("projects");
  const _id = new ObjectId(params.id);

  const result = await collection.updateOne(
    { _id },
    { $set: { ...parsed.data, updatedAt: new Date() } }
  );

  await logAdminActivity({
    adminEmail: auth.admin.email,
    action: "project_updated",
    details: { projectId: params.id, fields: Object.keys(parsed.data) },
    req
  });

  return NextResponse.json({ modifiedCount: result.modifiedCount });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const limited = rateLimit({
    req,
    key: "admin-projects-delete",
    limit: 20,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("projects");
  const _id = new ObjectId(params.id);

  const result = await collection.deleteOne({ _id });

  await logAdminActivity({
    adminEmail: auth.admin.email,
    action: "project_deleted",
    details: { projectId: params.id },
    req
  });

  return NextResponse.json({ deletedCount: result.deletedCount });
}

