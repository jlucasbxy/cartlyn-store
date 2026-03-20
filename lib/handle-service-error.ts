import { NextResponse } from "next/server";
import { ServiceError } from "@/services";

export function handleServiceError(error: unknown, fallbackMessage: string) {
  if (error instanceof ServiceError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details
      },
      { status: error.status }
    );
  }
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
