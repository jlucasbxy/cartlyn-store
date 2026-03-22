import { NextResponse } from "next/server";
import { DomainError } from "@/errors";
import { logger } from "./logger";

export function handleServiceError(error: unknown, fallbackMessage: string) {
  if (
    error != null &&
    typeof error === "object" &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string"
  ) {
    throw error;
  }

  if (error instanceof DomainError) {
    const status = (error as DomainError & { status: number }).status ?? 500;
    const details = (error as DomainError & { details?: unknown }).details;

    const body: Record<string, unknown> = {
      error: error.message,
      code: error.code
    };
    if (details !== undefined) body.details = details;

    return NextResponse.json(body, { status });
  }

  logger.error({ err: error }, fallbackMessage);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
