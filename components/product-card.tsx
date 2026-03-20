"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { addToCart } from "@/app/actions/cart";
import { addFavorite, removeFavorite } from "@/app/actions/favorites";

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

  const handleAddToCart = async () => {
    if (!session) {
      toast.warning("Por favor, faça login para adicionar ao carrinho");
      return;
    }

    setLoading(true);
    try {
      await addToCart(product.id, 1);
      toast.success("Produto adicionado ao carrinho!");
    } catch {
      toast.error("Erro ao adicionar ao carrinho");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!session) {
      toast.warning("Por favor, faça login para favoritar");
      return;
    }

    setLoading(true);
    try {
      if (favorite) {
        await removeFavorite(product.id);
        setFavorite(false);
        onFavoriteToggle?.(product.id, false);
        toast.success("Produto removido dos favoritos");
      } else {
        await addFavorite(product.id);
        setFavorite(true);
        onFavoriteToggle?.(product.id, true);
        toast.success("Produto adicionado aos favoritos!");
      }
    } catch {
      toast.error("Erro ao favoritar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/50 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-600/50 transition-all">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
          {product.description}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Vendedor: {product.seller.name}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        {session?.user.role === "CLIENT" && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={loading}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? "Adicionando..." : "Adicionar ao Carrinho"}
            </button>
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={loading}
              className={`px-4 py-2 rounded-md border-2 ${
                favorite
                  ? "bg-red-50 border-red-500 text-red-600"
                  : "bg-white border-gray-300 text-gray-600"
              } hover:bg-gray-50`}
              title={
                favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
            >
              {favorite ? "❤️" : "🤍"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
