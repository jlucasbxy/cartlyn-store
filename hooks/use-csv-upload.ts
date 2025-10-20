import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';

interface UseCSVUploadProps {
    onSuccess: () => void;
}

export function useCSVUpload({ onSuccess }: UseCSVUploadProps) {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();

        if (!csvFile) {
            toast.warning('Selecione um arquivo CSV');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const response = await fetch('/api/products/bulk', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setCsvFile(null);
                onSuccess();
            } else {
                toast.error(data.error || 'Erro ao fazer upload');
            }
        } catch {
            toast.error('Erro ao fazer upload');
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
        resetFile,
    };
}
