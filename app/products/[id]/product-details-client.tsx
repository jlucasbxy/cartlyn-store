"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { addFavorite, addToCart } from "@/app/actions";
import { Button, Card, FormInput, PageLayout } from "@/components";
import { ArrowLeftIcon } from "@/components/icons";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  publishedAt: string;
  seller: {
    id: string;
    name: string;
  };
}

interface ProductDetailsClientProps {
  product: Product;
  role?: string;
}

export function ProductDetailsClient({
  product,
  role
}: ProductDetailsClientProps) {
  const router = useRouter();
  const quantityRef = useRef<HTMLInputElement>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleAddToCart = async () => {
    const quantity = parseInt(quantityRef.current?.value || "1", 10);
    setCartLoading(true);
    const result = await addToCart(product.id, quantity);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Produto adicionado ao carrinho!");
      router.push("/cart");
    }
    setCartLoading(false);
  };

  const handleAddToFavorites = async () => {
    setFavoriteLoading(true);
    const result = await addFavorite(product.id);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Produto adicionado aos favoritos!");
    }
    setFavoriteLoading(false);
  };

  return (
    <PageLayout>
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeftIcon />
        <span>Voltar</span>
      </button>

      <Card padding="none" className="overflow-hidden animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-80 md:h-full min-h-[400px] bg-gray-100 dark:bg-gray-700/50">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="p-6 sm:p-8 flex flex-col">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {product.name}
              </h1>
              <span className="text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                Descrição
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            <div className="flex gap-6 mb-6 text-sm">
              <div>
                <p className="text-gray-400 dark:text-gray-500 mb-0.5">
                  Vendedor
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {product.seller.name}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500 mb-0.5">
                  Publicado
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(product.publishedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            {role === "CLIENT" && (
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <div className="mb-4">
                  <FormInput
                    ref={quantityRef}
                    label="Quantidade"
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    defaultValue="1"
                    className="w-20"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    fullWidth
                  >
                    {cartLoading ? "Adicionando..." : "Adicionar ao Carrinho"}
                  </Button>
                  <Button
                    onClick={handleAddToFavorites}
                    disabled={favoriteLoading}
                    variant="outline"
                    title="Adicionar aos favoritos"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="none"
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
                  </Button>
                </div>
              </div>
            )}

            {!role && (
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Faça login para comprar este produto
                </p>
                <Button onClick={() => router.push("/login")} fullWidth>
                  Fazer Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}
