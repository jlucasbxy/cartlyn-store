import { prisma } from "@/lib";
import type { RegisterInput } from "@/schemas";

function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

function findActiveByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

function createUser(
  data: Omit<RegisterInput, "password"> & { password: string }
) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });
}

function deactivateClientAccount(userId: string) {
  return prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { active: false }
    }),
    prisma.cartItem.deleteMany({
      where: { userId }
    }),
    prisma.favorite.deleteMany({
      where: { userId }
    })
  ]);
}

function deactivateSellerAccount(userId: string) {
  return prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { active: false }
    }),
    prisma.product.updateMany({
      where: { sellerId: userId },
      data: { active: false }
    })
  ]);
}

export const usersRepository = {
  findByEmail,
  findActiveByEmail,
  createUser,
  deactivateClientAccount,
  deactivateSellerAccount
};
