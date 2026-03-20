import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface DashboardData {
  totalProducts: number;
  totalProductsSold: number;
  totalRevenue: number;
  bestSellingProduct: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantitySold: number;
  } | null;
}

export function useSellerDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      if (session?.user.role !== "SELLER") {
        toast.error(
          "Acesso negado. Apenas vendedores podem acessar esta página."
        );
        router.push("/");
        return;
      }
      fetchDashboard();
    }
  }, [status, session, router, fetchDashboard]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch("/api/seller/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboardData,
    loading,
    status,
    router
  };
}
