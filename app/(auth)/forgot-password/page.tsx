"use client";
import Link from "next/link";
import { Button, FormInput } from "@/components";
import { useForgotPasswordForm } from "@/hooks";

export default function ForgotPasswordPage() {
  const { formRef, errors, error, success, loading, handleSubmit } =
    useForgotPasswordForm();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-[#0f172a] transition-colors">
      {/* Branding side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/90 to-primary-dark relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold">
              C
            </span>
            <span className="text-2xl font-bold">Cartlyn</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Recupere o acesso
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Enviaremos um link para você criar uma nova senha com segurança.
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
            Esqueceu sua senha?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Informe seu email e enviaremos um link de recuperação.
          </p>

          {success ? (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 p-4">
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                Email enviado!
              </p>
              <p className="text-sm text-green-600 dark:text-green-500">
                Se esse email estiver cadastrado, você receberá um link para
                redefinir sua senha em breve.
              </p>
            </div>
          ) : (
            <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Clique em enviar novamente para tentar outra vez.
                  </p>
                </div>
              )}
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="seu@email.com"
                errorMsg={errors.email}
              />
              <Button type="submit" disabled={loading} fullWidth>
                {loading
                  ? "Enviando..."
                  : error
                    ? "Enviar novamente"
                    : "Enviar link de recuperação"}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Lembrou sua senha?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
