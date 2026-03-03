import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  GOOGLE_DRIVE_CLIENT_EMAIL: z.string().optional(),
  GOOGLE_DRIVE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_DRIVE_PROJECT_IMAGES_FOLDER_ID: z.string().optional(),
  GOOGLE_DRIVE_CLIENT_ASSETS_FOLDER_ID: z.string().optional(),
  GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional()
});

const parsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  GOOGLE_DRIVE_CLIENT_EMAIL: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
  GOOGLE_DRIVE_PRIVATE_KEY: process.env.GOOGLE_DRIVE_PRIVATE_KEY,
  GOOGLE_DRIVE_PROJECT_IMAGES_FOLDER_ID:
    process.env.GOOGLE_DRIVE_PROJECT_IMAGES_FOLDER_ID,
  GOOGLE_DRIVE_CLIENT_ASSETS_FOLDER_ID:
    process.env.GOOGLE_DRIVE_CLIENT_ASSETS_FOLDER_ID,
  GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID: process.env.GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID
});

if (!parsed.success) {
  // In production we fail fast; during local dev we log but don't crash
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Invalid environment variables:\n" +
        JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
    );
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      "[SmartCampusTech] Invalid env configuration",
      parsed.error.flatten().fieldErrors
    );
  }
}

export const env = parsed.success
  ? parsed.data
  : ({
      MONGODB_URI: "",
      NEXT_PUBLIC_SITE_URL: undefined
    } as const);

