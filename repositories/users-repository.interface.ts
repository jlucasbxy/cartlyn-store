import type { User } from "@prisma/client";

export interface UsersRepository {
  checkEmailExists(email: string): Promise<boolean>;
  findActiveByEmail(email: string): Promise<User | null>;
  createUser(data: {
    email: string;
    password: string;
    name: string;
    role: "CLIENT" | "SELLER";
  }): Promise<Pick<User, "id" | "email" | "name" | "role">>;
  deactivateUser(userId: string): Promise<User>;
  updatePassword(userId: string, password: string): Promise<User>;
}
