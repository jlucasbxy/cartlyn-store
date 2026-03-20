import "dotenv/config";
import { env } from "./config/env.config";
import { defineConfig } from "prisma/config";

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
