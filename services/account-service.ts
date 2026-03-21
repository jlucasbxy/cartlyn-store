import { InvalidUserTypeError } from "@/errors";
import { usersRepository } from "@/repositories";

type Deps = {
  usersRepository: typeof usersRepository;
};

export function createAccountService(deps: Deps) {
  async function deactivateOrDeleteAccount(userId: string, role: string) {
    if (role === "CLIENT") {
      await deps.usersRepository.deactivateClientAccount(userId);
      return {
        message:
          "Conta excluída com sucesso. Seu histórico de compras foi preservado."
      };
    }

    if (role === "SELLER") {
      await deps.usersRepository.deactivateSellerAccount(userId);
      return {
        message:
          "Conta desativada com sucesso. Todos os seus produtos foram ocultados da loja."
      };
    }

    throw new InvalidUserTypeError();
  }

  return { deactivateOrDeleteAccount };
}

export const accountService = createAccountService({ usersRepository });
