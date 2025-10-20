import { useState, useRef, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginSchema } from '@/lib/validations';
import { formatZodError } from '@/lib/format-zod-error';

export function useLoginForm() {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setErrors({});

        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        };

        // Validate with Zod
        const validation = loginSchema.safeParse(data);

        if (!validation.success) {
            setErrors(formatZodError(validation.error));
            setLoading(false);
            return;
        }

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Email ou senha inválidos');
            } else {
                router.push('/store');
                router.refresh();
            }
        } catch {
            setError('Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return {
        formRef,
        errors,
        error,
        loading,
        handleSubmit,
    };
}
