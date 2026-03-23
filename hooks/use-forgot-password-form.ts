import { type FormEvent, useRef, useState } from "react";
import { requestPasswordReset } from "@/app/actions/password-reset";
import { formatZodError } from "@/lib/format-zod-error";
import { forgotPasswordSchema } from "@/schemas";

export function useForgotPasswordForm() {
  const requestErrorMessage =
    "Não foi possível enviar o e-mail de recuperação. Tente novamente.";
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrors({});

    if (!formRef.current) {
      setLoading(false);
      return;
    }

    const formData = new FormData(formRef.current);
    const data = { email: formData.get("email") as string };

    const validation = forgotPasswordSchema.safeParse(data);
    if (!validation.success) {
      setErrors(formatZodError(validation.error));
      setLoading(false);
      return;
    }

    try {
      const result = await requestPasswordReset(data);
      if ("error" in result) {
        setError(requestErrorMessage);
      } else {
        setSuccess(true);
      }
    } catch {
      setError(requestErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { formRef, errors, error, success, loading, handleSubmit };
}
