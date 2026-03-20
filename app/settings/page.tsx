"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, ConfirmModal, Loading, PageLayout } from "@/components";
import { useConfirm } from "@/hooks";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const { confirm, confirmState, handleClose } = useConfirm();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const isClient = session?.user.role === "CLIENT";

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: isClient ? "Excluir Conta" : "Desativar Conta",
      message: isClient
        ? "Tem certeza que deseja excluir sua conta? Seu histórico de compras será mantido, mas você não poderá mais fazer login."
        : "Tem certeza que deseja desativar sua conta? Todos os seus produtos serão ocultados da loja e você não poderá mais fazer login.",
      confirmText: isClient ? "Excluir Conta" : "Desativar Conta",
      variant: "danger"
    });

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch("/api/account", {
        method: "DELETE"
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);

        // Sign out and redirect after a short delay
        setTimeout(() => {
          signOut({ callbackUrl: "/" });
        }, 1500);
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao processar solicitação");
      }
    } catch {
      toast.error("Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Configurações da Conta
      </h1>

      <div className="max-w-3xl space-y-6">
        {/* Account Information */}
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Informações da Conta
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {session?.user.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {session?.user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tipo de Conta
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isClient ? "Cliente" : "Vendedor"}
              </p>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3 mb-4">
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
                Zona de Perigo
              </h2>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              {isClient ? "Excluir Conta" : "Desativar Conta"}
            </h3>
            <div className="text-sm text-red-800 dark:text-red-200 mb-3">
              {isClient ? (
                <>
                  <p className="mb-2">Ao excluir sua conta:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Você não poderá mais fazer login</li>
                    <li>Seu histórico de compras será mantido no sistema</li>
                    <li>
                      Suas informações de favoritos e carrinho serão removidas
                    </li>
                    <li>Esta ação é permanente e não pode ser desfeita</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="mb-2">Ao desativar sua conta:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Você não poderá mais fazer login</li>
                    <li>Todos os seus produtos serão ocultados da loja</li>
                    <li>
                      Os produtos existentes não serão deletados do sistema
                    </li>
                    <li>Esta ação é permanente e não pode ser desfeita</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          <Button
            onClick={handleDeleteAccount}
            disabled={loading}
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            {loading
              ? "Processando..."
              : isClient
                ? "Excluir Minha Conta"
                : "Desativar Minha Conta"}
          </Button>
        </Card>
      </div>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleClose}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
      />
    </PageLayout>
  );
}
