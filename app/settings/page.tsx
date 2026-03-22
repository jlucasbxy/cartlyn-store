"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deactivateOrDeleteAccount } from "@/app/actions";
import { Button, ConfirmModal, Loading, PageLayout } from "@/components";
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
      const result = await deactivateOrDeleteAccount();

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(
          isClient
            ? "Conta excluída com sucesso"
            : "Conta desativada com sucesso"
        );
        setTimeout(() => {
          signOut({ callbackUrl: "/" });
        }, 1500);
      }
    } catch {
      toast.error("Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Configurações
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gerencie sua conta
        </p>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Account Information */}
        <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informações da Conta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                Nome
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {session?.user.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                Email
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {session?.user.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                Tipo de Conta
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {isClient ? "Cliente" : "Vendedor"}
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-red-200/80 dark:border-red-800/30 p-5">
          <div className="flex items-center gap-2 mb-4">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Zona de Perigo
            </h2>
          </div>

          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-sm text-red-800 dark:text-red-300 mb-2">
              {isClient ? "Excluir Conta" : "Desativar Conta"}
            </h3>
            <div className="text-xs text-red-700 dark:text-red-300/80 space-y-1">
              {isClient ? (
                <>
                  <p>Ao excluir sua conta:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-1">
                    <li>Você não poderá mais fazer login</li>
                    <li>Seu histórico de compras será mantido</li>
                    <li>Favoritos e carrinho serão removidos</li>
                    <li>Esta ação é permanente</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>Ao desativar sua conta:</p>
                  <ul className="list-disc list-inside space-y-0.5 ml-1">
                    <li>Você não poderá mais fazer login</li>
                    <li>Seus produtos serão ocultados da loja</li>
                    <li>Os produtos não serão deletados</li>
                    <li>Esta ação é permanente</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          <Button
            onClick={handleDeleteAccount}
            disabled={loading}
            variant="danger"
            size="sm"
          >
            {loading
              ? "Processando..."
              : isClient
                ? "Excluir Minha Conta"
                : "Desativar Minha Conta"}
          </Button>
        </div>
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
