export interface AuthService {
  validateCredentials(
    email: string,
    password: string
  ): Promise<{ id: string; email: string; name: string; role: string } | null>;
}
