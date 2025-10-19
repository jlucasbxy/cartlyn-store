'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';
import Loading from '@/components/loading';

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Entrar na sua conta
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
                            placeholder="Senha"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            Não tem uma conta? Registre-se
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
