import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageLayout, StatsCard } from "@/components";
import { auth } from "@/lib/server";
import { sellerDashboardService } from "@/services";

export const metadata: Metadata = {
  title: "Dashboard - Cartlyn Store",
  description: "Painel do vendedor"
};

export default async function SellerDashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER") {
    redirect("/");
  }

  const dashboardData = await sellerDashboardService.getDashboard(
    session.user.id
  );

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Acompanhe o desempenho da sua loja
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          label="Produtos Cadastrados"
          value={dashboardData.totalProducts}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          icon={
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />

        <StatsCard
          label="Produtos Vendidos"
          value={dashboardData.totalProductsSold}
          bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          icon={
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />

        <StatsCard
          label="Faturamento Total"
          value={`R$ ${dashboardData.totalRevenue.toFixed(2)}`}
          bgColor="bg-primary/10"
          icon={
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* Best Selling Product */}
      {dashboardData.bestSellingProduct ? (
        <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-5 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Produto Mais Vendido
          </h2>
          <div className="flex gap-5 items-start">
            <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700/50">
              <Image
                src={dashboardData.bestSellingProduct.imageUrl}
                alt={dashboardData.bestSellingProduct.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {dashboardData.bestSellingProduct.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                R$ {dashboardData.bestSellingProduct.price.toFixed(2)}
              </p>
              <div className="flex gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Vendidos
                  </p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {dashboardData.bestSellingProduct.quantitySold}
                  </p>
                </div>
                <div className="bg-primary/10 dark:bg-primary/15 px-3 py-2 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receita
                  </p>
                  <p className="text-lg font-bold text-primary">
                    R${" "}
                    {(
                      dashboardData.bestSellingProduct.price *
                      dashboardData.bestSellingProduct.quantitySold
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30 p-12 text-center mb-8">
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
            Nenhuma venda realizada ainda
          </p>
          <Link
            href="/seller/products"
            className="inline-flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Cadastrar Produtos
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/seller/products"
          className="group bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-5 transition-all duration-200 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
            Gerenciar Produtos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Adicione, edite ou remova seus produtos
          </p>
        </Link>
        <Link
          href="/store"
          className="group bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-5 transition-all duration-200 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
            Ver Loja
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Veja como seus produtos aparecem para os clientes
          </p>
        </Link>
      </div>
    </PageLayout>
  );
}
