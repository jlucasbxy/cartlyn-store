import Image from "next/image";
import { Button } from "@/components";

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
    <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-4 flex gap-4 animate-fade-in">
      <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700/50">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {item.product.name}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {item.product.seller.name}
        </p>
        <p className="text-base font-bold text-primary mt-1">
          R$ {item.product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button
          onClick={() => onRemove(item.product.id)}
          variant="danger"
          size="sm"
        >
          Remover
        </Button>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            className="w-7 h-7 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm cursor-pointer"
          >
            -
          </button>
          <span className="w-8 text-center font-semibold text-sm text-gray-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            className="w-7 h-7 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm cursor-pointer"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Subtotal: R$ {(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
