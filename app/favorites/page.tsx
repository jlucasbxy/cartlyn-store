import { redirect } from "next/navigation";
import { auth } from "@/lib";
import { favoritesService } from "@/services";
import { FavoritesClient } from "./favorites-client";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const favorites = await favoritesService.getFavorites(session.user.id);

  return <FavoritesClient initialFavorites={favorites} />;
}
