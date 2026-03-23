import type { RegisterDTO } from "@/dtos";

export interface RegisterService {
  registerUser(
    data: RegisterDTO
  ): Promise<{ id: string; email: string; name: string; role: string }>;
}
