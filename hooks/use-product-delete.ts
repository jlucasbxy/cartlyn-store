import { useState } from "react";
import { toast } from "react-toastify";

interface UseProductDeleteProps {
  onSuccess: () => void;
  onConfirm: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "primary" | "success";
  }) => Promise<boolean>;
}

export function useProductDelete({
  onSuccess,
  onConfirm
}: UseProductDeleteProps) {
  const [deleting, setDeleting] = useState(false);

  const deleteProduct = async (productId: string) => {
    const confirmed = await onConfirm({
      title: "Excluir Produto",
      message: "Deseja realmente excluir este produto?",
      confirmText: "Excluir",
      variant: "danger"
    });

    if (!confirmed) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast.success("Produto excluído!");
        onSuccess();
      } else {
        toast.error("Erro ao excluir produto");
      }
    } catch {
      toast.error("Erro ao excluir produto");
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteProduct,
    deleting
  };
}
