import { ErrorCode } from "@/dtos";
import { ValidationError } from "@/errors";
import { usersRepository } from "@/repositories";

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

  throw new ValidationError(ErrorCode.INVALID_USER_TYPE, "Tipo de usuário inválido");
}

export const accountService = {
  deactivateOrDeleteAccount
};
