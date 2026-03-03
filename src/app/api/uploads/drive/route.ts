import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToDrive } from "@/lib/googleDrive";
import { attachDriveFileToProject } from "@/lib/repositories";
import { requireAdmin } from "@/lib/adminAuth";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limited = rateLimit({
    req: request,
    key: "admin-drive-upload",
    limit: 30,
    windowMs: 10 * 60 * 1000
  });
  if (limited) return limited;

  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const target =
      (formData.get("target") as "project-images" | "client-assets" | "documents") ??
      "project-images";
    const projectId = formData.get("projectId") as string | null;
    const asCover = formData.get("asCover") === "true";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadBufferToDrive({
      buffer,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      target
    });

    if (projectId) {
      const publicUrl = result.webViewLink ?? result.webContentLink;
      if (publicUrl) {
        await attachDriveFileToProject({
          projectId,
          fileUrl: publicUrl,
          asCover
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        fileId: result.id,
        webViewLink: result.webViewLink,
        webContentLink: result.webContentLink
      },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[SmartCampusTech] Failed to upload to Drive", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

