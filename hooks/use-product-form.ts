import { useState, useRef, FormEvent, useEffect } from 'react';
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
    const formRef = useRef<HTMLFormElement>(null);
    const [errors, setErrors] = useState<{
        name?: string;
        price?: string;
        description?: string;
        imageUrl?: string;
    }>({});
    const [loading, setLoading] = useState(false);

    // Reset form when editingProduct changes
    useEffect(() => {
        if (formRef.current) {
            if (editingProduct) {
                const form = formRef.current;
                (form.elements.namedItem('name') as HTMLInputElement).value = editingProduct.name;
                (form.elements.namedItem('price') as HTMLInputElement).value = editingProduct.price.toString();
                (form.elements.namedItem('description') as HTMLTextAreaElement).value = editingProduct.description;
                (form.elements.namedItem('imageUrl') as HTMLInputElement).value = editingProduct.imageUrl;
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

        // Transform form data (convert string price to number)
        const productData = {
            name: formData.get('name') as string,
            price: parseFloat(formData.get('price') as string),
            description: formData.get('description') as string,
            imageUrl: formData.get('imageUrl') as string,
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
        formRef,
        errors,
        loading,
        handleSubmit,
        resetForm,
    };
}
