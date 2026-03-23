"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/hooks";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
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
  { href: "/seller/products", label: "Produtos" },
  { href: "/seller/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Configurações" }
];

const clientLinks: NavItem[] = [
  { href: "/favorites", label: "Favoritos" },
  { href: "/cart", label: "Carrinho" },
  { href: "/orders", label: "Pedidos" },
  { href: "/settings", label: "Configurações" }
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const { isDark, toggle, mounted } = useColorScheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const roleLinks =
    session?.user.role === "SELLER"
      ? sellerLinks
      : session?.user.role === "CLIENT"
        ? clientLinks
        : [];

  return (
    <nav className="sticky top-0 z-40 glass bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center gap-2 lg:gap-6">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
                C
              </span>
              <span className="hidden sm:inline">Cartlyn</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 ml-4">
              <NavLink href="/store">Loja</NavLink>
              {status === "loading" ? (
                <>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-3" />
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-3" />
                </>
              ) : (
                roleLinks.map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    {link.label}
                  </NavLink>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Alternar tema"
            >
              {mounted ? (
                isDark ? (
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
            {status === "loading" ? (
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {session.user.name}
                  </span>
                </div>
                <Button onClick={() => signOut()} variant="outline" size="sm">
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button size="sm">Criar Conta</Button>
                </Link>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden absolute left-0 right-0 top-full border-t border-gray-200/60 dark:border-gray-700/40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg grid transition-[grid-template-rows,opacity] duration-200 ease-out ${menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/store"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Loja
            </Link>
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
