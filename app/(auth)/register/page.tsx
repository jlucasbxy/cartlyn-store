"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Button, FormInput, Loading } from "@/components";
import { useRegisterForm } from "@/hooks";

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const { formRef, errors, error, loading, handleSubmit } = useRegisterForm();

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
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f172a] transition-colors">
      {/* Branding side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 to-primary-dark relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold">
              C
            </span>
            <span className="text-2xl font-bold">Cartlyn</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Junte-se a nós
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Crie sua conta como cliente ou vendedor e comece a usar a plataforma
            hoje.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-sm w-full animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
              C
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Cartlyn
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Criar nova conta
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Preencha os dados abaixo para começar
          </p>

          <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
            <FormInput
              id="name"
              name="name"
              type="text"
              label="Nome completo"
              placeholder="Seu nome"
              errorMsg={errors.name}
            />
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="seu@email.com"
              errorMsg={errors.email}
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Senha"
              placeholder="Mínimo 8 caracteres"
              errorMsg={errors.password}
            />
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar senha"
              placeholder="Repita a senha"
              errorMsg={errors.confirmPassword}
            />
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Tipo de conta
              </label>
              <select
                id="role"
                name="role"
                defaultValue="CLIENT"
                className="appearance-none rounded-lg block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600/80 text-gray-900 dark:text-white bg-white dark:bg-gray-800/80 focus:outline-none focus-ring text-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer"
              >
                <option value="CLIENT">Cliente</option>
                <option value="SELLER">Vendedor</option>
              </select>
            </div>

            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
