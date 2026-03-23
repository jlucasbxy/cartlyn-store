export interface PasswordResetService {
  requestReset(email: string): Promise<void>;
  resetPassword(rawToken: string, newPassword: string): Promise<boolean>;
}
