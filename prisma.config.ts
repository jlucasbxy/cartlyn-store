import "dotenv/config";
import { defineConfig } from "prisma/config";
import { env } from "./config/env.config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed/index.ts"
  },
  datasource: {
    url: env.databaseUrl
  }
});
