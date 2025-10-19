'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Loading from '@/components/loading';

export default function HomePage() {
    const router = useRouter();
    const { status } = useSession();

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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <main className="text-center max-w-2xl">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Caplink Store
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Sua plataforma de e-commerce completa
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/register"
                        className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                    >
                        Criar Conta
                    </Link>
                    <Link
                        href="/store"
                        className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Ver Loja
                    </Link>
                </div>
            </main>
        </div>
    );
}
