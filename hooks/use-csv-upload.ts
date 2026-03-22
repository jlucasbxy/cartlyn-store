import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { createBulkProducts } from "@/app/actions";

interface UseCSVUploadProps {
  onSuccess: () => void;
}

export function useCSVUpload({ onSuccess }: UseCSVUploadProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!csvFile) {
      toast.warning("Selecione um arquivo CSV");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const result = await createBulkProducts(formData);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success(result.message ?? "Produtos criados com sucesso");
        setCsvFile(null);
        onSuccess();
      }
    } catch {
      toast.error("Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  const resetFile = () => {
    setCsvFile(null);
  };

  return {
    csvFile,
    setCsvFile,
    uploading,
    handleUpload,
    resetFile
  };
}
