import { ObjectId } from "mongodb";

export type Id = ObjectId | string;

export type ProjectCategory =
  | "student-final-year"
  | "student-mini"
  | "sme-website"
  | "founder-portfolio"
  | "other";

export interface BaseDocument {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project extends BaseDocument {
  slug: string;
  title: string;
  shortDescription: string;
  category: ProjectCategory;
  isFeatured: boolean;
  isPublished?: boolean;
  imageUrls: string[]; // Public Google Drive file URLs
  coverImageUrl?: string;
  clientType: "student" | "sme" | "founder";
  techStack: string[];
}

export interface Testimonial extends BaseDocument {
  name: string;
  roleOrCourse: string;
  context: "student" | "sme" | "founder";
  quote: string;
  projectSlug?: string;
}

export interface Lead extends BaseDocument {
  name: string;
  email: string;
  phone: string;
  requirement: "final-year-project" | "business-website" | "other";
  message: string;
  source: "website-contact-form";
  status: "new" | "in-review" | "closed";
}

export interface WebsiteContent extends BaseDocument {
  key:
    | "home-hero"
    | "home-offerings"
    | "services-header"
    | "about-intro"
    | "contact-intro"
    | "seo-defaults";
  content: unknown;
}

