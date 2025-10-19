'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-indigo-600">
                            Caplink Store
                        </Link>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link
                                href="/store"
                                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Loja
                            </Link>
                            {session?.user.role === 'SELLER' && (
                                <>
                                    <Link
                                        href="/seller/products"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Meus Produtos
                                    </Link>
                                    <Link
                                        href="/seller/dashboard"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            )}
                            {session?.user.role === 'CLIENT' && (
                                <>
                                    <Link
                                        href="/favorites"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Favoritos
                                    </Link>
                                    <Link
                                        href="/cart"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Carrinho
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Pedidos
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-700">
                                    {session.user.name} ({session.user.role})
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link
                                    href="/login"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
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
