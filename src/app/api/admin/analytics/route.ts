import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { mongoClientPromise } from "@/lib/mongodb";
import { rateLimit } from "@/lib/rateLimit";

const DB_NAME = "smartcampustech";

export async function GET(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-analytics",
    limit: 60,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const client = await mongoClientPromise;
  const db = client.db(DB_NAME);

  const [projects, leads, testimonials] = await Promise.all([
    db.collection("projects").countDocuments(),
    db.collection("leads").countDocuments(),
    db.collection("testimonials").countDocuments()
  ]);

  return NextResponse.json({
    projects,
    leads,
    testimonials
  });
}

