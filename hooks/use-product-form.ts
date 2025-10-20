import { useState, FormEvent } from 'react';
import { productSchema } from '@/lib/validations';
import { formatZodError } from '@/lib/format-zod-error';

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

export function useProductForm({ onSuccess, editingProduct }: UseProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
    });
    const [errors, setErrors] = useState<{
        name?: string;
        price?: string;
        description?: string;
        imageUrl?: string;
    }>({});
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setFormData({ name: '', price: '', description: '', imageUrl: '' });
        setErrors({});
    };

    const setEditData = (product: Product) => {
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            imageUrl: product.imageUrl,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Transform form data (convert string price to number)
        const productData = {
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            imageUrl: formData.imageUrl,
        };

        // Validate with Zod
        const validation = productSchema.safeParse(productData);

        if (!validation.success) {
            setErrors(formatZodError(validation.error));
            setLoading(false);
            return;
        }

        try {
            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : '/api/products';
            const method = editingProduct ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                resetForm();
                onSuccess();
            } else {
                const data = await response.json();
                if (data.error) {
                    // If API returns field-specific errors, set them
                    if (typeof data.error === 'object') {
                        setErrors(data.error);
                    }
                }
            }
        } catch (error) {
            console.error('Error submitting product:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        errors,
        loading,
        handleSubmit,
        resetForm,
        setEditData,
    };
}
