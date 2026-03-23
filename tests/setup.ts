import "@testing-library/jest-dom/vitest";

// Provide required env vars so config/env.config.ts validation passes during tests
process.env.DATABASE_URL = "postgresql://localhost:5432/test";
process.env.NEXTAUTH_SECRET = "test-secret-key-at-least-32-chars-xxxxx";
process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.SMTP_HOST = "localhost";
process.env.SMTP_PORT = "1025";
process.env.SMTP_USER = "test";
process.env.SMTP_PASS = "test";
process.env.EMAIL_FROM = "test@example.com";
process.env.NODE_ENV = "test";
