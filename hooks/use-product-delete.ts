import { useState } from 'react';
import { toast } from 'react-toastify';

interface UseProductDeleteProps {
    onSuccess: () => void;
}

export function useProductDelete({ onSuccess }: UseProductDeleteProps) {
    const [deleting, setDeleting] = useState(false);

    const deleteProduct = async (productId: string) => {
        if (!confirm('Deseja realmente excluir este produto?')) return;

        setDeleting(true);
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Produto excluído!');
                onSuccess();
            } else {
                toast.error('Erro ao excluir produto');
            }
        } catch {
            toast.error('Erro ao excluir produto');
        } finally {
            setDeleting(false);
        }
    };

    return {
        deleteProduct,
        deleting,
    };
}
