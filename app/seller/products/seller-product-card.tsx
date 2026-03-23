import Image from "next/image";

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
    <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-4 flex flex-col sm:flex-row gap-4 animate-fade-in">
      <div className="relative h-36 sm:h-20 w-full sm:w-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700/50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
          {product.description}
        </p>
        <p className="text-base font-bold text-primary mt-1">
          R$ {product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex sm:flex-col gap-2 justify-end sm:justify-center">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex-1 sm:flex-initial cursor-pointer"
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
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="hidden sm:inline">Editar</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(product.id)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-1 sm:flex-initial cursor-pointer"
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
              strokeWidth={1.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="hidden sm:inline">Excluir</span>
        </button>
      </div>
    </div>
  );
}
