import type { DashboardDTO } from "@/dtos";
import { toNumber } from "@/lib";
import { productsRepository, sellerDashboardRepository } from "@/repositories";

type Deps = {
  sellerDashboardRepository: typeof sellerDashboardRepository;
  productsRepository: typeof productsRepository;
};

export function createSellerDashboardService(deps: Deps) {
  async function getDashboard(sellerId: string): Promise<DashboardDTO> {
    const stats = await deps.sellerDashboardRepository.getDashboardStats(sellerId);

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

export const sellerDashboardService = createSellerDashboardService({
  sellerDashboardRepository,
  productsRepository
});
