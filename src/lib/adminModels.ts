import type { BaseDocument } from "./models";

export interface AdminUser extends BaseDocument {
  email: string;
  passwordHash: string;
  role: "admin";
  name?: string;
}

export interface AdminActivityLog extends BaseDocument {
  adminEmail: string;
  action: string;
  details?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}

