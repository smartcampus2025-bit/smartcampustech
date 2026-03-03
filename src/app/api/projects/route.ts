import { NextResponse } from "next/server";
import { listProjects } from "@/lib/repositories";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const featured = searchParams.get("featured");

  try {
    const projects = await listProjects({
      category,
      featuredOnly: featured === "true"
    });

    return NextResponse.json({ projects });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[SmartCampusTech] Failed to fetch projects", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

