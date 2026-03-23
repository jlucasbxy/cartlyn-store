import type { Prisma } from "@prisma/client";

export interface SellerDashboardRepository {
  getDashboardStats(sellerId: string): Promise<{
    totalProducts: number;
    totalProductsSold: number;
    totalRevenue: Prisma.Decimal | number;
    bestSellingProductId: string | undefined;
    bestSellingProductQuantity: number;
  }>;
}
