import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    productName: string;
    product: {
        id: string;
        name: string;
        imageUrl: string;
    };
}

interface Order {
    id: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
}

export function useOrders(status: string) {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        orders,
        loading,
    };
}
