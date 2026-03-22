import { Button, Card } from "@/components";

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
    <Card className="sticky top-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Resumo do Pedido
      </h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Frete</span>
          <span>Grátis</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={checkoutLoading}
        fullWidth
        size="lg"
      >
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
    </Card>
  );
}
