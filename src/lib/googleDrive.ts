import { google } from "googleapis";
import { env } from "./env";

const driveScopes = ["https://www.googleapis.com/auth/drive.file"];

export type UploadTarget = "project-images" | "client-assets" | "documents";

export interface DriveUploadResult {
  id: string;
  webViewLink?: string;
  webContentLink?: string;
}

function getDriveFolderId(target: UploadTarget) {
  switch (target) {
    case "project-images":
      return process.env.GOOGLE_DRIVE_PROJECT_IMAGES_FOLDER_ID;
    case "client-assets":
      return process.env.GOOGLE_DRIVE_CLIENT_ASSETS_FOLDER_ID;
    case "documents":
      return process.env.GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID;
  }
}

function getAuthClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[SmartCampusTech] Google Drive env vars are not configured. Uploads will be disabled."
      );
    }
    throw new Error("Google Drive credentials are not configured");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: driveScopes
  });
}

export async function uploadBufferToDrive(params: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  target: UploadTarget;
}): Promise<DriveUploadResult> {
  const folderId = getDriveFolderId(params.target);

  if (!folderId) {
    throw new Error(`Google Drive folder not configured for target: ${params.target}`);
  }

  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const fileMetaData = {
    name: params.fileName,
    parents: [folderId]
  };

  const media = {
    mimeType: params.mimeType,
    body: Buffer.from(params.buffer)
  } as any;

  const response = await drive.files.create({
    requestBody: fileMetaData,
    media,
    fields: "id, webViewLink, webContentLink"
  });

  const data = response.data;

  return {
    id: data.id as string,
    webViewLink: data.webViewLink ?? undefined,
    webContentLink: data.webContentLink ?? undefined
  };
}

