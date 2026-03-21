import { prisma } from "@/lib";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "healthy" });
  } catch {
    return Response.json({ status: "unhealthy" }, { status: 503 });
  }
}
