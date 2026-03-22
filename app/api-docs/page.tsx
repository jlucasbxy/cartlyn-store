import { getApiDocs } from "@/lib/swagger";
import SwaggerUIComponent from "./swagger-ui";

export default function ApiDocsPage() {
  const spec = getApiDocs() as Record<string, unknown>;
  return <SwaggerUIComponent spec={spec} />;
}
