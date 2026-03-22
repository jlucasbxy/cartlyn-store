import Image from "next/image";
import { Button, Card } from "@/components";

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

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove
}: CartItemCardProps) {
  return (
    <Card className="flex gap-4">
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover rounded"
          unoptimized
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Vendedor: {item.product.seller.name}
        </p>
        <p className="text-lg font-bold text-primary mt-2">
          R$ {item.product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-3">
        <Button
          onClick={() => onRemove(item.product.id)}
          variant="danger"
          size="sm"
        >
          Remover
        </Button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center font-bold text-gray-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Subtotal: R$ {(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </Card>
  );
}
