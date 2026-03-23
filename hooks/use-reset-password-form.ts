import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { resetPassword } from "@/app/actions/password-reset";
import { formatZodError } from "@/lib/format-zod-error";
import { resetPasswordSchema } from "@/schemas";

export function useResetPasswordForm(token: string) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{
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

    const formData = new FormData(formRef.current);
    const data = {
      token,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string
    };

    const validation = resetPasswordSchema.safeParse(data);
    if (!validation.success) {
      setErrors(formatZodError(validation.error));
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(data);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push("/login?reset=success");
      }
    } catch {
      setError("Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return { formRef, errors, error, loading, handleSubmit };
}
