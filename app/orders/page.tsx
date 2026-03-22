import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, PageLayout } from "@/components";
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
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Histórico de Pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/50 p-8 text-center transition-colors">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            Você ainda não realizou nenhum pedido
          </p>
          <Link
            href="/store"
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors inline-block"
          >
            Começar a Comprar
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} padding="none" className="overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 border-b dark:border-gray-700">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pedido
                    </p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Data
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total
                    </p>
                    <p className="text-xl font-bold text-primary">
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Itens do Pedido
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 items-center border-b dark:border-gray-700 pb-4 last:border-b-0"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover rounded"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Quantidade: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Preço unitário: R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
