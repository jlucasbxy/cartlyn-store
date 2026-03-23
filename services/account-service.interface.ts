export interface AccountService {
  deactivateOrDeleteAccount(
    userId: string,
    role: string
  ): Promise<{ message: string }>;
}
