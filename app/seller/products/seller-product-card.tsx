import Image from "next/image";
import { Card } from "@/components";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  active: boolean;
  publishedAt: string;
}

interface SellerProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function SellerProductCard({
  product,
  onEdit,
  onDelete
}: SellerProductCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row gap-4">
      <div className="relative h-40 sm:h-24 w-full sm:w-24 flex-shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
          {product.description}
        </p>
        <p className="text-base sm:text-lg font-bold text-primary mt-2">
          R$ {product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex sm:flex-col gap-2 justify-end sm:justify-center">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors flex-1 sm:flex-initial whitespace-nowrap"
          title="Editar produto"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="hidden sm:inline">Editar</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex-1 sm:flex-initial whitespace-nowrap"
          title="Excluir produto"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="hidden sm:inline">Excluir</span>
        </button>
      </div>
    </Card>
  );
}
