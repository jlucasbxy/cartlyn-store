"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addFavorite, addToCart, removeFavorite } from "@/app/actions";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    seller: {
      name: string;
    };
  };
  onFavoriteToggle?: (productId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export default function ProductCard({
  product,
  onFavoriteToggle,
  isFavorite = false
}: ProductCardProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleAddToCart = async () => {
    if (!session) {
      toast.warning("Por favor, faca login para adicionar ao carrinho");
      return;
    }

    setLoading(true);
    const result = await addToCart(product.id, 1);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Produto adicionado ao carrinho!");
    }
    setLoading(false);
  };

  const handleToggleFavorite = async () => {
    if (!session) {
      toast.warning("Por favor, faca login para favoritar");
      return;
    }

    setLoading(true);
    if (favorite) {
      const result = await removeFavorite(product.id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setFavorite(false);
        onFavoriteToggle?.(product.id, false);
        toast.success("Produto removido dos favoritos");
      }
    } else {
      const result = await addFavorite(product.id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setFavorite(true);
        onFavoriteToggle?.(product.id, true);
        toast.success("Produto adicionado aos favoritos!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="group bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:border-gray-300 dark:hover:border-gray-600 animate-fade-in">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700/50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
          {product.seller.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        {session?.user.role === "CLIENT" && (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={loading}
              className="flex-1 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-40 text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              {loading ? "..." : "Adicionar"}
            </button>
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={loading}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer ${
                favorite
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-500"
                  : "bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600/50 text-gray-400 dark:text-gray-500 hover:text-red-400 hover:border-red-200 dark:hover:border-red-800/50"
              }`}
              title={
                favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill={favorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
