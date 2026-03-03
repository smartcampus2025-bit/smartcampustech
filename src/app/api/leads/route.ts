import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/repositories";
import { rateLimit } from "@/lib/rateLimit";

const leadSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  requirement: z.enum([
    "final-year-project",
    "business-website",
    "other"
  ]),
  message: z.string().min(10).max(1000)
});

export async function POST(request: Request) {
  try {
    const limited = rateLimit({
      // Cast to any because this route uses the standard Request type
      req: request as any,
      key: "public-leads-post",
      limit: 10,
      windowMs: 5 * 60 * 1000
    } as any);
    if (limited) return limited;

    const json = await request.json();
    const parsed = leadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    const lead = await createLead({
      ...payload,
      source: "website-contact-form",
      status: "new"
    });

    return NextResponse.json(
      {
        success: true,
        leadId: lead._id?.toString()
      },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[SmartCampusTech] Failed to create lead", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

