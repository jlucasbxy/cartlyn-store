"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "react-toastify";
import { checkout, removeFromCart, updateCartItem } from "@/app/actions";
import { ConfirmModal, EmptyState, PageLayout } from "@/components";
import { useConfirm } from "@/hooks";
import { CartItemCard } from "./cart-item-card";
import { OrderSummary } from "./order-summary";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    seller: {
      name: string;
    };
  };
}

interface CartClientProps {
  initialItems: CartItem[];
  total: number;
}

export function CartClient({ initialItems, total }: CartClientProps) {
  const router = useRouter();
  const { confirm, confirmState, handleClose } = useConfirm();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    const result = await updateCartItem(productId, newQuantity);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    startTransition(() => router.refresh());
    toast.success("Quantidade atualizada");
  };

  const handleRemoveItem = async (productId: string) => {
    const confirmed = await confirm({
      title: "Remover Item",
      message: "Deseja remover este item do carrinho?",
      confirmText: "Remover",
      variant: "danger"
    });

    if (!confirmed) return;

    const result = await removeFromCart(productId);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    startTransition(() => router.refresh());
    toast.success("Item removido do carrinho");
  };

  const handleCheckout = async () => {
    if (initialItems.length === 0) {
      toast.warning("Seu carrinho está vazio");
      return;
    }

    const confirmed = await confirm({
      title: "Finalizar Compra",
      message: `Confirmar compra no valor de R$ ${total.toFixed(2)}?`,
      confirmText: "Confirmar",
      variant: "primary"
    });

    if (!confirmed) return;

    setCheckoutLoading(true);
    const result = await checkout();
    if (result && "error" in result) {
      toast.error(result.error);
      setCheckoutLoading(false);
    }
  };

  return (
    <PageLayout>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Carrinho de Compras
      </h1>

      {initialItems.length === 0 ? (
        <EmptyState
          title="Seu carrinho está vazio"
          actionLabel="Continuar Comprando"
          onAction={() => router.push("/store")}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {initialItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              total={total}
              checkoutLoading={checkoutLoading}
              onCheckout={handleCheckout}
              onContinueShopping={() => router.push("/store")}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleClose}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
      />
    </PageLayout>
  );
}
