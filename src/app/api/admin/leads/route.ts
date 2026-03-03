import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";
import { requireAdmin, logAdminActivity } from "@/lib/adminAuth";
import { mongoClientPromise } from "@/lib/mongodb";

const DB_NAME = "smartcampustech";

const statusSchema = z.object({
  status: z.enum(["new", "in-review", "closed"])
});

export async function GET(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-leads-get",
    limit: 60,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("leads");

  const leads = await collection
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return NextResponse.json({ leads });
}

export async function PATCH(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-leads-patch",
    limit: 30,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = statusSchema
    .extend({
      id: z.string()
    })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id, status } = parsed.data;

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("leads");

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } }
  );

  await logAdminActivity({
    adminEmail: auth.admin.email,
    action: "lead_status_updated",
    details: { leadId: id, status },
    req
  });

  return NextResponse.json({ modifiedCount: result.modifiedCount });
}

