export type DashboardBestProductDTO = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantitySold: number;
};

export type DashboardDTO = {
    totalProducts: number;
    totalProductsSold: number;
    totalRevenue: number;
    bestSellingProduct: DashboardBestProductDTO | null;
};
