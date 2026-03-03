import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { requireAdmin } from "@/lib/adminAuth";
import { mongoClientPromise } from "@/lib/mongodb";

const DB_NAME = "smartcampustech";

export async function GET(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-logs-get",
    limit: 30,
    windowMs: 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const client = await mongoClientPromise;
  const collection = client.db(DB_NAME).collection("adminActivityLogs");

  const logs = await collection
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return NextResponse.json({ logs });
}

