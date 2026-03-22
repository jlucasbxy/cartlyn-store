import { useState } from "react";
import { toast } from "react-toastify";
import { deleteProduct } from "@/app/actions";

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

  const handleDelete = async (productId: string) => {
    const confirmed = await onConfirm({
      title: "Excluir Produto",
      message: "Deseja realmente excluir este produto?",
      confirmText: "Excluir",
      variant: "danger"
    });

    if (!confirmed) return;

    setDeleting(true);
    try {
      const result = await deleteProduct(productId);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Produto excluído!");
        onSuccess();
      }
    } catch {
      toast.error("Erro ao excluir produto");
    } finally {
      setDeleting(false);
    }
  };

  return {
    handleDelete,
    deleting
  };
}
