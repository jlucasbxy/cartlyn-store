import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib";
import { cartService } from "@/services";
import { CartClient } from "./cart-client";

export const metadata: Metadata = {
  title: "Carrinho - Cartlyn Store",
  description: "Seu carrinho de compras"
};

export default async function CartPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { items, total } = await cartService.getCart(session.user.id);

  return <CartClient initialItems={items} total={total} />;
}
