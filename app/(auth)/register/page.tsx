'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/store');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Criar nova conta
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <FormInput
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Nome completo"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                        <FormInput
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                        <FormInput
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Senha (mínimo 6 caracteres)"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Tipo de conta
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Já tem uma conta? Entre aqui
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
