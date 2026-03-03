import { NextRequest } from "next/server";
import { handleAdminLogin, seedAdminIfNeeded } from "@/lib/adminAuth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const limited = rateLimit({
    req,
    key: "admin-login",
    limit: 10,
    windowMs: 10 * 60 * 1000
  });
  if (limited) return limited;

  await seedAdminIfNeeded();
  return handleAdminLogin(req);
}

