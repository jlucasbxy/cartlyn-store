"use client";

import Link from "next/link";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
          Erro
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Algo deu errado. Tente novamente ou volte para a pagina inicial.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Voltar ao Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
