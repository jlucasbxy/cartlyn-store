'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/button';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function Navbar() {
    const { data: session } = useSession();
    const { isDark, toggle, mounted } = useColorScheme();

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary dark:text-primary">
                            Caplink Store
                        </Link>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href="/store"
                                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Loja
                            </Link>
                            {session?.user.role === 'SELLER' && (
                                <>
                                    <Link
                                        href="/seller/products"
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Meus Produtos
                                    </Link>
                                    <Link
                                        href="/seller/dashboard"
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            )}
                            {session?.user.role === 'CLIENT' && (
                                <>
                                    <Link
                                        href="/favorites"
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Favoritos
                                    </Link>
                                    <Link
                                        href="/cart"
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Carrinho
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Pedidos
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggle}
                            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {mounted ? (
                                isDark ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )
                            ) : (
                                // Placeholder to prevent layout shift
                                <div className="w-5 h-5" />
                            )}
                        </button>
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {session.user.name} ({session.user.role})
                                </span>
                                <Button
                                    onClick={() => signOut()}
                                    variant="outline"
                                    size="sm"
                                >
                                    Sair
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link
                                    href="/login"
                                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Registrar
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
