import { mongoClientPromise } from "./mongodb";
import type {
  Lead,
  Project,
  Testimonial,
  WebsiteContent
} from "./models";
import { ObjectId } from "mongodb";

const DB_NAME = "smartcampustech";

import type { Document } from "mongodb";

async function getCollection<T extends Document>(name: string) {
  const client = await mongoClientPromise;
  const db = client.db(DB_NAME);
  return db.collection<T>(name);
}

export async function listProjects(options?: {
  category?: string;
  featuredOnly?: boolean;
}) {
  const collection = await getCollection<Project>("projects");
  const query: Record<string, unknown> = {
    // Treat missing flag as published for backward compatibility
    isPublished: { $ne: false }
  };

  if (options?.category) {
    query.category = options.category;
  }
  if (options?.featuredOnly) {
    query.isFeatured = true;
  }

  const projects = await collection
    .find(query)
    .sort({ isFeatured: -1, createdAt: -1 })
    .toArray();

  return projects;
}

export async function getProjectBySlug(slug: string) {
  const collection = await getCollection<Project>("projects");
  return collection.findOne({
    slug,
    // Only expose published projects publicly by default
    isPublished: { $ne: false }
  });
}

export async function listTestimonials(limit = 6) {
  const collection = await getCollection<Testimonial>("testimonials");
  return collection
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function createLead(lead: Omit<Lead, "_id" | "createdAt" | "updatedAt">) {
  const collection = await getCollection<Lead>("leads");
  const now = new Date();
  const doc: Lead = {
    ...lead,
    createdAt: now,
    updatedAt: now
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function getWebsiteContent(key: WebsiteContent["key"]) {
  const collection = await getCollection<WebsiteContent>("websiteContent");
  return collection.findOne({ key });
}

export async function upsertWebsiteContent(
  key: WebsiteContent["key"],
  content: unknown
) {
  const collection = await getCollection<WebsiteContent>("websiteContent");
  const now = new Date();
  await collection.updateOne(
    { key },
    {
      $set: {
        key,
        content,
        updatedAt: now
      },
      $setOnInsert: {
        createdAt: now
      }
    },
    { upsert: true }
  );
}

export async function attachDriveFileToProject(params: {
  projectId: string;
  fileUrl: string;
  asCover?: boolean;
}) {
  const collection = await getCollection<Project>("projects");
  const _id = new ObjectId(params.projectId);

  const update: Record<string, unknown> = {
    $addToSet: { imageUrls: params.fileUrl }
  };

  if (params.asCover) {
    update.$set = { coverImageUrl: params.fileUrl };
  }

  await collection.updateOne({ _id }, update);
}

