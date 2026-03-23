"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button, FormInput } from "@/components";
import { useResetPasswordForm } from "@/hooks";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { formRef, errors, error, loading, handleSubmit } =
    useResetPasswordForm(token);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="max-w-sm w-full text-center px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Link inválido
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Este link de recuperação é inválido ou expirou.
          </p>
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:text-primary-dark transition-colors text-sm"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f172a] transition-colors">
      {/* Branding side */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary/90 to-primary-dark relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold">
              C
            </span>
            <span className="text-2xl font-bold">Cartlyn</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">Nova senha</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Crie uma senha forte para proteger sua conta.
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
            Redefinir senha
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Crie uma nova senha para a sua conta.
          </p>

          <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
            <FormInput
              id="password"
              name="password"
              type="password"
              label="Nova senha"
              placeholder="Mínimo 8 caracteres"
              errorMsg={errors.password}
            />
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              errorMsg={errors.confirmPassword}
            />
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Carregando recuperação de senha...
      </p>
    </div>
  );
}
