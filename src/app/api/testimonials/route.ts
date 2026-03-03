import { NextResponse } from "next/server";
import { listTestimonials } from "@/lib/repositories";

export async function GET() {
  try {
    const testimonials = await listTestimonials();
    return NextResponse.json({ testimonials });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[SmartCampusTech] Failed to fetch testimonials", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

