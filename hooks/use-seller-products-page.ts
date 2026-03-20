import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useConfirm } from "@/hooks/use-confirm";
import { useCSVUpload } from "@/hooks/use-csv-upload";
import { useProductDelete } from "@/hooks/use-product-delete";
import { useProductForm } from "@/hooks/use-product-form";
import { useSellerProducts } from "@/hooks/use-seller-products";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  active: boolean;
  publishedAt: string;
}

interface Pagination {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export function useSellerProductsPage(
  itemsPerPage: number = 10,
  initialProducts?: Product[],
  initialPagination?: Pagination
) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Custom hooks
  const {
    products,
    loading,
    pagination,
    hasPreviousPage,
    nextPage,
    previousPage,
    refetch
  } = useSellerProducts(itemsPerPage, initialProducts, initialPagination);
  const { confirm, confirmState, handleClose } = useConfirm();

  const productForm = useProductForm({
    onSuccess: () => {
      toast.success(editingProduct ? "Produto atualizado!" : "Produto criado!");
      setShowForm(false);
      setEditingProduct(null);
      refetch();
    },
    editingProduct
  });

  const { deleteProduct } = useProductDelete({
    onSuccess: refetch,
    onConfirm: confirm
  });

  const csvUpload = useCSVUpload({
    onSuccess: () => {
      setShowCSVUpload(false);
      refetch();
    }
  });

  // Authentication check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user.role !== "SELLER") {
      toast.error(
        "Acesso negado. Apenas vendedores podem acessar esta página."
      );
      router.push("/");
    }
  }, [status, session, router]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleNewProduct = () => {
    setShowForm(true);
    setEditingProduct(null);
    productForm.resetForm();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    productForm.resetForm();
  };

  const handleOpenCSVUpload = () => {
    setShowCSVUpload(true);
  };

  const handleCloseCSVUpload = () => {
    setShowCSVUpload(false);
    csvUpload.resetFile();
  };

  return {
    // State
    showForm,
    showCSVUpload,
    editingProduct,
    products,
    loading,
    pagination,
    hasPreviousPage,
    status,

    // Hooks
    productForm,
    csvUpload,
    confirmState,

    // Functions
    handleEdit,
    handleNewProduct,
    handleCloseForm,
    handleOpenCSVUpload,
    handleCloseCSVUpload,
    deleteProduct,
    nextPage,
    previousPage,
    handleClose
  };
}
