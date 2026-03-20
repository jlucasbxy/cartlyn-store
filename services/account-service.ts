import { usersRepository } from "@/repositories/users-repository";
import { ServiceError } from "@/services/service-error";

async function deactivateOrDeleteAccount(userId: string, role: string) {
  if (role === "CLIENT") {
    await usersRepository.deactivateClientAccount(userId);
    return {
      message:
        "Conta excluída com sucesso. Seu histórico de compras foi preservado."
    };
  }

  if (role === "SELLER") {
    await usersRepository.deactivateSellerAccount(userId);
    return {
      message:
        "Conta desativada com sucesso. Todos os seus produtos foram ocultados da loja."
    };
  }

  throw new ServiceError("Tipo de usuário inválido", 400);
}

export const accountService = {
  deactivateOrDeleteAccount
};
