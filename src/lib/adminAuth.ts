import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { mongoClientPromise } from "./mongodb";
import type { AdminUser, AdminActivityLog } from "./adminModels";

const DB_NAME = "smartcampustech";
const ADMIN_JWT_COOKIE = "sct_admin_token";

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type AdminJwtPayload = {
  sub: string;
  email: string;
  role: "admin";
};

export async function getAdminCollection() {
  const client = await mongoClientPromise;
  return client.db(DB_NAME).collection<AdminUser>("admins");
}

async function getActivityCollection() {
  const client = await mongoClientPromise;
  return client.db(DB_NAME).collection<AdminActivityLog>("adminActivityLogs");
}

function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not configured");
  }
  return secret;
}

export async function logAdminActivity(params: {
  adminEmail: string;
  action: string;
  details?: Record<string, unknown>;
  req?: NextRequest | Request;
}) {
  try {
    const collection = await getActivityCollection();
    const now = new Date();
    const base: AdminActivityLog = {
      adminEmail: params.adminEmail,
      action: params.action,
      details: params.details,
      ip:
        params.req instanceof NextRequest
          ? params.req.ip ?? params.req.headers.get("x-forwarded-for")
          : params.req?.headers.get("x-forwarded-for") ?? null,
      userAgent: params.req?.headers.get("user-agent") ?? null,
      createdAt: now,
      updatedAt: now
    };
    await collection.insertOne(base);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[SmartCampusTech] Failed to log admin activity", error);
  }
}

export async function seedAdminIfNeeded() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const collection = await getAdminCollection();
  const existing = await collection.findOne({ email });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();
  const admin: AdminUser = {
    email,
    passwordHash,
    role: "admin",
    name: "SmartCampusTech Admin",
    createdAt: now,
    updatedAt: now
  };

  await collection.insertOne(admin);
  // eslint-disable-next-line no-console
  console.info("[SmartCampusTech] Seeded initial admin user");
}

export async function handleAdminLogin(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const collection = await getAdminCollection();
  const admin = await collection.findOne({ email });

  if (!admin || !admin.passwordHash) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    await logAdminActivity({
      adminEmail: email,
      action: "login_failed",
      details: {},
      req: request
    });
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const payload: AdminJwtPayload = {
    sub: admin._id?.toString() ?? "",
    email: admin.email,
    role: "admin"
  };

  const token = jwt.sign(payload, getJwtSecret(), {
    expiresIn: "8h"
  });

  const response = NextResponse.json(
    { success: true },
    {
      status: 200
    }
  );

  response.cookies.set(ADMIN_JWT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  await logAdminActivity({
    adminEmail: admin.email,
    action: "login_success",
    details: {},
    req: request
  });

  return response;
}

export function getAdminFromRequest(req: NextRequest): AdminJwtPayload | null {
  try {
    const token = req.cookies.get(ADMIN_JWT_COOKIE)?.value;
    if (!token) return null;
    const payload = jwt.verify(token, getJwtSecret()) as AdminJwtPayload;
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export function requireAdmin(
  req: NextRequest
): { admin: AdminJwtPayload } | NextResponse {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { admin };
}

export function handleAdminLogout() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(ADMIN_JWT_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0
  });
  return response;
}

