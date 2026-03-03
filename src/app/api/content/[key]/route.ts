import { NextResponse } from "next/server";
import { getWebsiteContent } from "@/lib/repositories";
import type { WebsiteContent } from "@/lib/models";

type Params = {
  params: {
    key: WebsiteContent["key"];
  };
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const doc = await getWebsiteContent(params.key);
    if (!doc) {
      return NextResponse.json({ content: null }, { status: 200 });
    }

    return NextResponse.json({ content: doc.content });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[SmartCampusTech] Failed to fetch content", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

