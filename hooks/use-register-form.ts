import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { registerUser } from "@/app/actions";
import { formatZodError } from "@/lib/format-zod-error";
import { registerWithConfirmSchema } from "@/schemas";

export function useRegisterForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({});

    if (!formRef.current) return;

    const formDataObj = new FormData(formRef.current);
    const formData = {
      name: formDataObj.get("name") as string,
      email: formDataObj.get("email") as string,
      password: formDataObj.get("password") as string,
      confirmPassword: formDataObj.get("confirmPassword") as string,
      role: formDataObj.get("role") as "CLIENT" | "SELLER"
    };

    const validation = registerWithConfirmSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(formatZodError(validation.error));
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword: _, ...registerData } = formData;
      const result = await registerUser(registerData);

      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return {
    formRef,
    errors,
    error,
    loading,
    handleSubmit
  };
}
