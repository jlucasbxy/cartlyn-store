"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Loading } from "@/components";

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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f172a]">
        <Loading />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 dark:bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
            C
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Cartlyn
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/store"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Explorar
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-lg transition-colors"
          >
            Criar Conta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 sm:pt-32 pb-20">
        <div className="max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/15 text-primary text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Plataforma de e-commerce
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Compre e venda
            <br />
            <span className="text-primary">sem complicação</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-10">
            Uma plataforma completa para vendedores e compradores. Cadastre
            produtos, gerencie seu catálogo e compre com facilidade.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-base font-medium text-white bg-primary hover:bg-primary-dark px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              Começar agora
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
            >
              Ver produtos
            </Link>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 stagger-children">
          <div className="animate-fade-in-up rounded-xl border border-gray-200/80 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/40 p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Catálogo completo
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Cadastre produtos individualmente ou importe via CSV em massa.
            </p>
          </div>

          <div className="animate-fade-in-up rounded-xl border border-gray-200/80 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/40 p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Dashboard do vendedor
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Acompanhe vendas, faturamento e seus produtos mais populares.
            </p>
          </div>

          <div className="animate-fade-in-up rounded-xl border border-gray-200/80 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/40 p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Favoritos e carrinho
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Salve seus produtos preferidos e compre quando quiser.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
