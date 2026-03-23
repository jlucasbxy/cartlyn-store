import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/server";
import { favoritesService } from "@/container";
import { FavoritesClient } from "./favorites-client";

export const metadata: Metadata = {
  title: "Favoritos - Cartlyn Store",
  description: "Seus produtos favoritos"
};

export default async function FavoritesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const favorites = await favoritesService.getFavorites(session.user.id);

  return <FavoritesClient initialFavorites={favorites} />;
}
