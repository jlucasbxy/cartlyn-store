import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { registerWithConfirmSchema } from '@/lib/validations';
import { formatZodError } from '@/lib/format-zod-error';

export function useRegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CLIENT' as 'CLIENT' | 'SELLER',
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string
    }>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setErrors({});

        // Validate with Zod
        const validation = registerWithConfirmSchema.safeParse(formData);

        if (!validation.success) {
            setErrors(formatZodError(validation.error));
            setLoading(false);
            return;
        }

        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = formData;

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erro ao criar conta');
            } else {
                router.push('/login?registered=true');
            }
        } catch {
            setError('Erro ao criar conta');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        errors,
        error,
        loading,
        handleSubmit,
    };
}
