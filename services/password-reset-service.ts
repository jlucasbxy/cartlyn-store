import argon2 from "argon2";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/prisma";
import { env } from "@/config/env.config";
import { emailProvider } from "@/providers/email-provider";
import {
  passwordResetRepository,
  createPasswordResetRepository
} from "@/repositories/password-reset-repository";
import {
  usersRepository,
  createUsersRepository
} from "@/repositories/users-repository";
import { PasswordResetEmail } from "@/emails/password-reset-email";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1
} as const;

type Deps = {
  usersRepository: typeof usersRepository;
  passwordResetRepository: typeof passwordResetRepository;
  emailProvider: typeof emailProvider;
  prisma: PrismaClient;
};

export function createPasswordResetService(deps: Deps) {
  async function requestReset(email: string) {
    const user = await deps.usersRepository.findActiveByEmail(email);

    // Always resolve successfully to prevent email enumeration
    if (!user) return;

    const rawToken = await deps.prisma.$transaction(async (tx) => {
      const repo = createPasswordResetRepository({ prisma: tx });
      await repo.deleteTokensByUser(user.id);
      return repo.createToken(user.id);
    });
    const resetUrl = `${env.nextAuthUrl}/reset-password?token=${rawToken}`;

    await deps.emailProvider.sendEmail({
      to: user.email,
      subject: "Redefinição de senha - Cartlyn",
      template: PasswordResetEmail({ resetUrl, userName: user.name })
    });
  }

  async function resetPassword(rawToken: string, newPassword: string) {
    const record = await deps.passwordResetRepository.findValidToken(rawToken);

    if (!record || !record.user.active || record.expiresAt < new Date()) {
      return false;
    }

    const hashedPassword = await argon2.hash(newPassword, ARGON2_OPTIONS);

    await deps.prisma.$transaction(async (tx) => {
      await createUsersRepository({ prisma: tx }).updatePassword(
        record.user.id,
        hashedPassword
      );
      await createPasswordResetRepository({ prisma: tx }).deleteToken(rawToken);
    });

    return true;
  }

  return { requestReset, resetPassword };
}

export const passwordResetService = createPasswordResetService({
  usersRepository,
  passwordResetRepository,
  emailProvider,
  prisma
});
