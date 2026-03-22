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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
            Criar nova conta
          </h2>
        </div>
        <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <FormInput
              id="name"
              name="name"
              type="text"
              placeholder="Nome completo"
              errorMsg={errors.name}
            />
            <FormInput
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              errorMsg={errors.email}
            />
            <FormInput
              id="password"
              name="password"
              type="password"
              placeholder="Senha (mínimo 8 caracteres)"
              errorMsg={errors.password}
            />
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirmar senha"
              errorMsg={errors.confirmPassword}
            />
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tipo de conta
              </label>
              <select
                id="role"
                name="role"
                defaultValue="CLIENT"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              >
                <option value="CLIENT">Cliente</option>
                <option value="SELLER">Vendedor</option>
              </select>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Já tem uma conta? Entre aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
