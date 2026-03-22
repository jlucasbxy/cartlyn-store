import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a] p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="text-[120px] font-bold leading-none text-gray-200 dark:text-gray-800 select-none mb-2">
          404
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Página não encontrada
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Voltar ao Início
          </Link>
          <Link
            href="/store"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Ver Loja
          </Link>
        </div>
      </div>
    </div>
  );
}
