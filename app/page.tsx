"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Loading from "@/components/loading";

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/store");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-primary/20 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <main className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Cartlyn Store
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Sua plataforma de e-commerce completa
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
          >
            Criar Conta
          </Link>
          <Link
            href="/store"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Ver Loja
          </Link>
        </div>
      </main>
    </div>
  );
}
