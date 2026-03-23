import { notFound } from "next/navigation";
import { env } from "@/config/env.config";
import { getApiDocs } from "@/lib/swagger";
import SwaggerUIComponent from "./swagger-ui";

export default function ApiDocsPage() {
  if (env.nodeEnv === "production") {
    notFound();
  }

  const spec = getApiDocs() as Record<string, unknown>;
  return <SwaggerUIComponent spec={spec} />;
}
