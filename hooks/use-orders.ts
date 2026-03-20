import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router, fetchOrders]);

  return {
    orders,
    loading
  };
}
