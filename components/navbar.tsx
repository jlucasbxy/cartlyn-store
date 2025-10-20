'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/button';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
    return (
        <Link
            href={href}
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-2 sm:px-3 lg:px-4 py-2 rounded-md text-xs sm:text-sm lg:text-base font-medium transition-colors whitespace-nowrap"
        >
            {children}
        </Link>
    );
}

interface NavItem {
    href: string;
    label: string;
}

const sellerLinks: NavItem[] = [
    { href: '/seller/products', label: 'Produtos' },
    { href: '/seller/dashboard', label: 'Dashboard' },
    { href: '/settings', label: 'Configurações' },
];

const clientLinks: NavItem[] = [
    { href: '/favorites', label: 'Favoritos' },
    { href: '/cart', label: 'Carrinho' },
    { href: '/orders', label: 'Pedidos' },
    { href: '/settings', label: 'Configurações' },
];

export default function Navbar() {
    const { data: session } = useSession();
    const { isDark, toggle, mounted } = useColorScheme();

    const roleLinks = session?.user.role === 'SELLER' ? sellerLinks : session?.user.role === 'CLIENT' ? clientLinks : [];

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex justify-between h-16 sm:h-20 overflow-x-auto">
                    <div className="flex items-center min-w-0 gap-2 sm:gap-4 lg:gap-6">
                        <Link href="/" className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary dark:text-primary whitespace-nowrap flex-shrink-0">
                            Caplink Store
                        </Link>
                        <div className="flex items-baseline gap-1 sm:gap-2 lg:gap-4">
                            <NavLink href="/store">Loja</NavLink>
                            {roleLinks.map((link) => (
                                <NavLink key={link.href} href={link.href}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <button
                            onClick={toggle}
                            className="p-2 sm:p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {mounted ? (
                                isDark ? (
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )
                            ) : (
                                // Placeholder to prevent layout shift
                                <div className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>
                        {session ? (
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <span className="hidden lg:block text-sm lg:text-base text-gray-700 dark:text-gray-300">
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
                            <div className="flex space-x-2 sm:space-x-3">
                                <Link
                                    href="/login"
                                    className="bg-primary text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-base font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-base font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
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
