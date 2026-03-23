import type { PasswordResetToken, Prisma } from "@prisma/client";

type PasswordResetTokenWithUser = Prisma.PasswordResetTokenGetPayload<{
  include: {
    user: { select: { id: true; email: true; name: true; active: true } };
  };
}>;

export interface PasswordResetRepository {
  deleteTokensByUser(userId: string): Promise<Prisma.BatchPayload>;
  createToken(userId: string): Promise<string>;
  findValidToken(rawToken: string): Promise<PasswordResetTokenWithUser | null>;
  deleteToken(rawToken: string): Promise<PasswordResetToken>;
}
