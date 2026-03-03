import { NextRequest } from "next/server";
import { handleAdminLogout, getAdminFromRequest } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return new Response(null, { status: 204 });
  }
  return handleAdminLogout();
}

