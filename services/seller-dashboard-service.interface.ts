import type { DashboardDTO } from "@/dtos";

export interface SellerDashboardService {
  getDashboard(sellerId: string): Promise<DashboardDTO>;
}
