import { type FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { createProduct, updateProduct } from "@/app/actions";
import { formatZodError } from "@/lib/format-zod-error";
import { productSchema } from "@/schemas";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  active: boolean;
  publishedAt: string;
}

interface UseProductFormProps {
  onSuccess: () => void;
  editingProduct: Product | null;
}

export function useProductForm({
  onSuccess,
  editingProduct
}: UseProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    description?: string;
    imageUrl?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formRef.current) {
      if (editingProduct) {
        const form = formRef.current;
        (form.elements.namedItem("name") as HTMLInputElement).value =
          editingProduct.name;
        (form.elements.namedItem("price") as HTMLInputElement).value =
          editingProduct.price.toString();
        (form.elements.namedItem("description") as HTMLTextAreaElement).value =
          editingProduct.description;
        (form.elements.namedItem("imageUrl") as HTMLInputElement).value =
          editingProduct.imageUrl;
      }
    }
  }, [editingProduct]);

  const resetForm = () => {
    formRef.current?.reset();
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    const productData = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string
    };

    const validation = productSchema.safeParse(productData);

    if (!validation.success) {
      setErrors(formatZodError(validation.error));
      setLoading(false);
      return;
    }

    try {
      const result = editingProduct
        ? await updateProduct(editingProduct.id, productData)
        : await createProduct(productData);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        resetForm();
        onSuccess();
      }
    } catch {
      toast.error("Erro ao salvar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formRef,
    errors,
    loading,
    handleSubmit,
    resetForm
  };
}
