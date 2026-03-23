import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components";
import { auth } from "@/lib/server";
import { ordersService } from "@/services";

export const metadata: Metadata = {
  title: "Pedidos - Cartlyn Store",
  description: "Historico de pedidos"
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const orders = await ordersService.getOrders(session.user.id);

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Histórico de Pedidos
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {orders.length === 0
            ? "Nenhum pedido ainda"
            : `${orders.length} ${orders.length === 1 ? "pedido" : "pedidos"}`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30 p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-4">
            <svg
              aria-hidden="true"
              className="w-7 h-7 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
            Você ainda não realizou nenhum pedido
          </p>
          <Link
            href="/store"
            className="inline-flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Começar a Comprar
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 overflow-hidden animate-fade-in"
            >
              <div className="bg-gray-50 dark:bg-gray-800/80 px-5 py-3 border-b border-gray-200/80 dark:border-gray-700/50">
                <div className="flex justify-between items-center flex-wrap gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Pedido
                    </p>
                    <p className="font-mono text-xs text-gray-600 dark:text-gray-300">
                      {order.id.slice(0, 8)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Data
                    </p>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Total
                    </p>
                    <p className="text-lg font-bold text-primary">
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700/50">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
