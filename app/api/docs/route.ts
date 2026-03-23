import { NextResponse } from "next/server";
import { env } from "@/config/env.config";
import { getApiDocs } from "@/lib/swagger";

export async function GET() {
  if (env.nodeEnv === "production") {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(getApiDocs());
}
