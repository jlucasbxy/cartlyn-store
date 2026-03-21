import pino from "pino";
import { env } from "@/config/env.config";

export const logger = pino({
  level: env.logLevel || "info"
});
