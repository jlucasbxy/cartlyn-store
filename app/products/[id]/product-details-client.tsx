"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { addToCart, addFavorite } from "@/app/actions";
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
  const [actionLoading, setActionLoading] = useState(false);

  const handleAddToCart = async () => {
    const quantity = parseInt(quantityRef.current?.value || "1", 10);
    setActionLoading(true);
    const result = await addToCart(product.id, quantity);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Produto adicionado ao carrinho!");
      router.push("/cart");
    }
    setActionLoading(false);
  };

  const handleAddToFavorites = async () => {
    setActionLoading(true);
    const result = await addFavorite(product.id);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Produto adicionado aos favoritos!");
    }
    setActionLoading(false);
  };

  return (
    <PageLayout>
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeftIcon />
        <span>Voltar</span>
      </Button>

      <Card padding="none" className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            <div className="mb-4">
              <span className="text-4xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Descrição
              </h2>
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-base text-gray-900 dark:text-gray-100">
                <span className="font-semibold">Vendedor:</span>{" "}
                {product.seller.name}
              </p>
              <p className="text-base text-gray-900 dark:text-gray-100">
                <span className="font-semibold">Publicado em:</span>{" "}
                {new Date(product.publishedAt).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {role === "CLIENT" && (
              <div className="mt-auto">
                <div className="mb-4">
                  <FormInput
                    ref={quantityRef}
                    label="Quantidade"
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    defaultValue="1"
                    className="w-24"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={actionLoading}
                    size="lg"
                    fullWidth
                  >
                    {actionLoading ? "Adicionando..." : "Adicionar ao Carrinho"}
                  </Button>
                  <Button
                    onClick={handleAddToFavorites}
                    disabled={actionLoading}
                    variant="outline"
                    size="lg"
                    title="Adicionar aos favoritos"
                  >
                    ❤️
                  </Button>
                </div>
              </div>
            )}

            {!role && (
              <div className="mt-auto">
                <p className="text-gray-900 dark:text-gray-100 text-base mb-4">
                  Faça login para comprar este produto
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  fullWidth
                >
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
