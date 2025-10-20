'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLoginForm } from '@/hooks/use-login-form';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';
import Loading from '@/components/loading';

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession();
    const { formRef, errors, error, loading, handleSubmit } = useLoginForm();

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 dark:text-white">
                        Entrar na sua conta
                    </h2>
                </div>
                <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <FormInput
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            errorMsg={errors.email}
                        />
                        <FormInput
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Senha"
                            errorMsg={errors.password}
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
