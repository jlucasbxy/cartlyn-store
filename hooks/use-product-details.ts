import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    publishedAt: string;
    seller: {
        id: string;
        name: string;
    };
}

interface UseProductDetailsProps {
    productId: string;
    session: any;
}

export function useProductDetails({ productId, session }: UseProductDetailsProps) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    toast.error('Produto não encontrado');
                    router.push('/store');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Erro ao carregar produto');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, router]);

    const handleAddToCart = async () => {
        if (!session) {
            toast.warning('Por favor, faça login para adicionar ao carrinho');
            router.push('/login');
            return;
        }

        setActionLoading(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });

            if (response.ok) {
                toast.success('Produto adicionado ao carrinho!');
                router.push('/cart');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Erro ao adicionar ao carrinho');
            }
        } catch {
            toast.error('Erro ao adicionar ao carrinho');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddToFavorites = async () => {
        if (!session) {
            toast.warning('Por favor, faça login para favoritar');
            router.push('/login');
            return;
        }

        setActionLoading(true);
        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });

            if (response.ok) {
                toast.success('Produto adicionado aos favoritos!');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Erro ao adicionar aos favoritos');
            }
        } catch {
            toast.error('Erro ao adicionar aos favoritos');
        } finally {
            setActionLoading(false);
        }
    };

    return {
        product,
        loading,
        quantity,
        setQuantity,
        actionLoading,
        handleAddToCart,
        handleAddToFavorites,
    };
}
