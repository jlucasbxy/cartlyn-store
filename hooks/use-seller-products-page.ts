import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useConfirm } from "@/hooks/use-confirm";
import { useCSVUpload } from "@/hooks/use-csv-upload";
import { useProductDelete } from "@/hooks/use-product-delete";
import { useProductForm } from "@/hooks/use-product-form";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  active: boolean;
  publishedAt: string;
}

export function useSellerProductsPage(editingProductProp?: Product | null) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(
    editingProductProp ?? null
  );

  const { confirm, confirmState, handleClose } = useConfirm();

  const productForm = useProductForm({
    onSuccess: () => {
      toast.success(editingProduct ? "Produto atualizado!" : "Produto criado!");
      setShowForm(false);
      setEditingProduct(null);
      router.refresh();
    },
    editingProduct
  });

  const { handleDelete } = useProductDelete({
    onSuccess: () => router.refresh(),
    onConfirm: confirm
  });

  const csvUpload = useCSVUpload({
    onSuccess: () => {
      setShowCSVUpload(false);
      router.refresh();
    }
  });

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
    handleDelete,
    handleClose
  };
}
