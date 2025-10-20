'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { registerSchema } from '@/lib/validations';
import { formatZodError } from '@/lib/format-zod-error';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';
import Loading from '@/components/loading';

export default function RegisterPage() {
    const router = useRouter();
    const { status } = useSession();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CLIENT' as 'CLIENT' | 'SELLER',
    });
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/store');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <Loading />
            </div>
        );
    }

    if (status === 'authenticated') {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setErrors({});

        // Validate with Zod
        const validation = registerSchema.safeParse(formData);

        if (!validation.success) {
            setErrors(formatZodError(validation.error));
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Criar nova conta
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <FormInput
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nome completo"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            errorMsg={errors.name}
                        />
                        <FormInput
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            errorMsg={errors.email}
                        />
                        <FormInput
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Senha (mínimo 6 caracteres)"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            errorMsg={errors.password}
                        />
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Tipo de conta
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value as 'CLIENT' | 'SELLER',
                                    })
                                }
                            >
                                <option value="CLIENT">Cliente</option>
                                <option value="SELLER">Vendedor</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'Criando conta...' : 'Criar conta'}
                        </Button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            Já tem uma conta? Entre aqui
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
