import { Button } from "@/components";

interface OrderSummaryProps {
  total: number;
  checkoutLoading: boolean;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export function OrderSummary({
  total,
  checkoutLoading,
  onCheckout,
  onContinueShopping
}: OrderSummaryProps) {
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-5 sticky top-20">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Resumo do Pedido
      </h2>
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>Subtotal</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>Frete</span>
          <span className="text-primary font-medium">Grátis</span>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700/50 pt-3 mt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Button onClick={onCheckout} disabled={checkoutLoading} fullWidth>
        {checkoutLoading ? "Finalizando..." : "Finalizar Compra"}
      </Button>
      <Button
        onClick={onContinueShopping}
        variant="secondary"
        fullWidth
        className="mt-2"
      >
        Continuar Comprando
      </Button>
    </div>
  );
}
