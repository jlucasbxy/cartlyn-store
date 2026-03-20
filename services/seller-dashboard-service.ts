import type { DashboardDTO } from "@/dtos";
import { toNumber } from "@/lib/price";
import { productsRepository } from "@/repositories/products-repository";
import { sellerDashboardRepository } from "@/repositories/seller-dashboard-repository";

async function getDashboard(sellerId: string): Promise<DashboardDTO> {
  const stats = await sellerDashboardRepository.getDashboardStats(sellerId);

  let bestSellingProduct = null;

  if (stats.bestSellingProductId) {
    const product = await productsRepository.findBasicById(
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

export const sellerDashboardService = {
  getDashboard
};
