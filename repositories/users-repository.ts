import type { PrismaClient } from "@prisma/client";
import type { RegisterDTO } from "@/dtos";
import { prisma } from "@/prisma";

type Deps = {
  prisma: PrismaClient;
};

export function createUsersRepository(deps: Deps) {
  function findByEmail(email: string) {
    return deps.prisma.user.findUnique({
      where: { email }
    });
  }

  function findActiveByEmail(email: string) {
    return deps.prisma.user.findUnique({
      where: { email, active: true }
    });
  }

  function createUser(
    data: Omit<RegisterDTO, "password"> & { password: string }
  ) {
    return deps.prisma.user.create({
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
    return deps.prisma.$transaction([
      deps.prisma.user.update({
        where: { id: userId },
        data: { active: false }
      }),
      deps.prisma.cartItem.deleteMany({
        where: { userId }
      }),
      deps.prisma.favorite.deleteMany({
        where: { userId }
      })
    ]);
  }

  function deactivateSellerAccount(userId: string) {
    return deps.prisma.$transaction([
      deps.prisma.user.update({
        where: { id: userId },
        data: { active: false }
      }),
      deps.prisma.product.updateMany({
        where: { sellerId: userId },
        data: { active: false }
      })
    ]);
  }

  return {
    findByEmail,
    findActiveByEmail,
    createUser,
    deactivateClientAccount,
    deactivateSellerAccount
  };
}

export const usersRepository = createUsersRepository({ prisma });
