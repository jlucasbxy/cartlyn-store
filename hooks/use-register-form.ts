import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
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

    // Validate with Zod
    const validation = registerWithConfirmSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(formatZodError(validation.error));
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = formData;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao criar conta");
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
