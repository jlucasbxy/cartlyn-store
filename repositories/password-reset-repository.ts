import crypto from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/prisma";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

type Deps = {
  prisma: PrismaClient;
};

export function createPasswordResetRepository(deps: Deps) {
  function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  async function createToken(userId: string) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    await deps.prisma.$transaction([
      deps.prisma.passwordResetToken.deleteMany({ where: { userId } }),
      deps.prisma.passwordResetToken.create({
        data: { token: hashedToken, userId, expiresAt }
      })
    ]);

    return rawToken;
  }

  async function findValidToken(rawToken: string) {
    const hashedToken = hashToken(rawToken);

    return deps.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: {
        user: { select: { id: true, email: true, name: true, active: true } }
      }
    });
  }

  function deleteToken(rawToken: string) {
    const hashedToken = hashToken(rawToken);
    return deps.prisma.passwordResetToken.delete({
      where: { token: hashedToken }
    });
  }

  return { createToken, findValidToken, deleteToken };
}

export const passwordResetRepository = createPasswordResetRepository({
  prisma
});
