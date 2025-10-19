'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/loading';
import { ProductWithSeller } from '@/types';
import { PageLayout } from '@/components/page-layout';
import { Modal } from '@/components/modal';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { toast } from 'react-toastify';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    active: boolean;
    publishedAt: string;
}

export default function SellerProductsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showCSVUpload, setShowCSVUpload] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
    });
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                // Filter only seller's products
                setProducts(data.products.filter((p: ProductWithSeller) => p.seller.id === session?.user.id));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [session?.user.id]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            if (session?.user.role !== 'SELLER') {
                toast.error('Acesso negado. Apenas vendedores podem acessar esta página.');
                router.push('/');
                return;
            }
            fetchProducts();
        }
    }, [status, session, router, fetchProducts]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadLoading(true);

        try {
            const url = editingProduct
                ? `/api/products/${editingProduct.id}`
                : '/api/products';
            const method = editingProduct ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                }),
            });

            if (response.ok) {
                toast.success(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
                setShowForm(false);
                setEditingProduct(null);
                setFormData({ name: '', price: '', description: '', imageUrl: '' });
                fetchProducts();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Erro ao salvar produto');
            }
        } catch {
            toast.error('Erro ao salvar produto');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleCSVUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!csvFile) {
            toast.warning('Selecione um arquivo CSV');
            return;
        }

        setUploadLoading(true);
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
                setShowCSVUpload(false);
                setCsvFile(null);
                fetchProducts();
            } else {
                toast.error(data.error || 'Erro ao fazer upload');
            }
        } catch {
            toast.error('Erro ao fazer upload');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            imageUrl: product.imageUrl,
        });
        setShowForm(true);
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Deseja realmente excluir este produto?')) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Produto excluído!');
                fetchProducts();
            } else {
                toast.error('Erro ao excluir produto');
            }
        } catch {
            toast.error('Erro ao excluir produto');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <PageLayout>
                <Loading />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Meus Produtos</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={() => {
                            setShowForm(true);
                            setEditingProduct(null);
                            setFormData({ name: '', price: '', description: '', imageUrl: '' });
                        }}
                    >
                        + Novo Produto
                    </Button>
                    <Button
                        onClick={() => setShowCSVUpload(true)}
                        variant="success"
                    >
                        📄 Upload CSV
                    </Button>
                </div>
            </div>

            {/* Product Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                }}
                title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
                maxWidth="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Nome *"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <FormInput
                        label="Preço *"
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                        />
                    </div>
                    <FormInput
                        label="URL da Imagem *"
                        type="url"
                        required
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingProduct(null);
                            }}
                            variant="secondary"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={uploadLoading}
                        >
                            {uploadLoading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* CSV Upload Modal */}
            <Modal
                isOpen={showCSVUpload}
                onClose={() => {
                    setShowCSVUpload(false);
                    setCsvFile(null);
                }}
                title="Upload CSV"
            >
                <form onSubmit={handleCSVUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Arquivo CSV
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                            className="w-full"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                            Formato: name,price,description,imageUrl
                        </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            onClick={() => {
                                setShowCSVUpload(false);
                                setCsvFile(null);
                            }}
                            variant="secondary"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={uploadLoading || !csvFile}
                            variant="success"
                        >
                            {uploadLoading ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Products List */}
            {products.length === 0 ? (
                <EmptyState title="Você ainda não cadastrou nenhum produto" />
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                        <Card key={product.id} className="flex gap-4">
                                    <div className="relative h-24 w-24 flex-shrink-0">
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                            {product.description}
                                        </p>
                                        <p className="text-lg font-bold text-primary mt-2">
                                            R$ {product.price.toFixed(2)}
                                        </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={() => handleEdit(product)}
                                    variant="primary"
                                    size="sm"
                                >
                                    Editar
                                </Button>
                                <Button
                                    onClick={() => handleDelete(product.id)}
                                    variant="danger"
                                    size="sm"
                                >
                                    Excluir
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </PageLayout>
    );
}
