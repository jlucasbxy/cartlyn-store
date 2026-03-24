import type { DashboardDTO } from "@/dtos";
import { toNumber } from "@/lib/price";
import { createProductsRepository } from "@/repositories/products-repository";
import { createSellerDashboardRepository } from "@/repositories/seller-dashboard-repository";
import type { SellerDashboardService } from "./seller-dashboard-service.interface";

type Deps = {
  sellerDashboardRepository: ReturnType<typeof createSellerDashboardRepository>;
  productsRepository: ReturnType<typeof createProductsRepository>;
};

export function createSellerDashboardService(
  deps: Deps
): SellerDashboardService {
  async function getDashboard(sellerId: string): Promise<DashboardDTO> {
    const stats =
      await deps.sellerDashboardRepository.getDashboardStats(sellerId);

    let bestSellingProduct = null;

    if (stats.bestSellingProductId) {
      const product = await deps.productsRepository.findBasicById(
        stats.bestSellingProductId
      );

      if (product) {
        bestSellingProduct = {
          ...product,
          price: toNumber(product.price),
          quantitySold: stats.bestSellingProductQuantity
        };
      }
    }

    return {
      totalProducts: stats.totalProducts,
      totalProductsSold: stats.totalProductsSold,
      totalRevenue: toNumber(stats.totalRevenue),
      bestSellingProduct
    };
  }

  return { getDashboard };
}
