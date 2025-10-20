import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    active: boolean;
    publishedAt: string;
}

interface ProductWithSeller extends Product {
    seller: {
        id: string;
        name: string;
    };
}

export function useSellerProducts() {
    const { data: session } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        if (!session?.user.id) return;

        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                // Filter only seller's products
                setProducts(data.products.filter((p: ProductWithSeller) => p.seller.id === session?.user.id));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [session?.user.id]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        refetch: fetchProducts,
    };
}
