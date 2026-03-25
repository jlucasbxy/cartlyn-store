import { prisma } from "@/prisma";
import { createEmailProvider } from "@/providers/email-provider";
import { createCartRepository } from "@/repositories/cart-repository";
import { createFavoritesRepository } from "@/repositories/favorites-repository";
import { createOrdersRepository } from "@/repositories/orders-repository";
import { createPasswordResetRepository } from "@/repositories/password-reset-repository";
import { createProductsRepository } from "@/repositories/products-repository";
import { createSellerDashboardRepository } from "@/repositories/seller-dashboard-repository";
import { createUsersRepository } from "@/repositories/users-repository";
import { createAccountService } from "@/services/account-service";
import { createAuthService } from "@/services/auth-service";
import { createCartService } from "@/services/cart-service";
import { createFavoritesService } from "@/services/favorites-service";
import { createFakePaymentGatewayService } from "@/services/fake-payment-gateway-service";
import { createOrdersService } from "@/services/orders-service";
import { createPasswordResetService } from "@/services/password-reset-service";
import { createProductsService } from "@/services/products-service";
import { createRegisterService } from "@/services/register-service";
import { createSellerDashboardService } from "@/services/seller-dashboard-service";
import nodemailer from "nodemailer";

// Repositories
export const cartRepository = createCartRepository({ prisma });
export const favoritesRepository = createFavoritesRepository({ prisma });
export const ordersRepository = createOrdersRepository({ prisma });
export const passwordResetRepository = createPasswordResetRepository({
  prisma
});
export const productsRepository = createProductsRepository({ prisma });
export const sellerDashboardRepository = createSellerDashboardRepository({
  prisma
});
export const usersRepository = createUsersRepository({ prisma });

// Providers
export const emailProvider = createEmailProvider({
  createTransport: nodemailer.createTransport
});
export const paymentGateway = createFakePaymentGatewayService();

// Services
export const accountService = createAccountService({ prisma });
export const authService = createAuthService({ usersRepository });
export const cartService = createCartService({
  cartRepository,
  productsRepository
});
export const favoritesService = createFavoritesService({
  favoritesRepository,
  productsRepository
});
export const ordersService = createOrdersService({ prisma, paymentGateway });
export const passwordResetService = createPasswordResetService({
  usersRepository,
  passwordResetRepository,
  emailProvider
});
export const productsService = createProductsService({ productsRepository });
export const registerService = createRegisterService({ usersRepository });
export const sellerDashboardService = createSellerDashboardService({
  sellerDashboardRepository,
  productsRepository
});
