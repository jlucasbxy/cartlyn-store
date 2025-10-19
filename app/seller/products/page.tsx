'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import Loading from '@/components/loading';
import { ProductWithSeller } from '@/types';

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
                alert('Acesso negado. Apenas vendedores podem acessar esta página.');
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
                alert(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
                setShowForm(false);
                setEditingProduct(null);
                setFormData({ name: '', price: '', description: '', imageUrl: '' });
                fetchProducts();
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao salvar produto');
            }
        } catch {
            alert('Erro ao salvar produto');
        } finally {
            setUploadLoading(false);
        }
    };

    const handleCSVUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!csvFile) {
            alert('Selecione um arquivo CSV');
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
                alert(data.message);
                setShowCSVUpload(false);
                setCsvFile(null);
                fetchProducts();
            } else {
                alert(data.error || 'Erro ao fazer upload');
            }
        } catch {
            alert('Erro ao fazer upload');
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
                alert('Produto excluído!');
                fetchProducts();
            } else {
                alert('Erro ao excluir produto');
            }
        } catch {
            alert('Erro ao excluir produto');
        }
    };

    if (status === 'loading' || loading) {
        return (
            <>
                <Navbar />
                <Loading />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Meus Produtos</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingProduct(null);
                                    setFormData({ name: '', price: '', description: '', imageUrl: '' });
                                }}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                + Novo Produto
                            </button>
                            <button
                                onClick={() => setShowCSVUpload(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                📄 Upload CSV
                            </button>
                        </div>
                    </div>

                    {/* Product Form Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold mb-4">
                                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nome *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Preço *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            step="0.01"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descrição *
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            URL da Imagem *
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingProduct(null);
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={uploadLoading}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {uploadLoading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* CSV Upload Modal */}
                    {showCSVUpload && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <h2 className="text-2xl font-bold mb-4">Upload CSV</h2>
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
                                        <p className="text-xs text-gray-500 mt-1">
                                            Formato: name,price,description,imageUrl
                                        </p>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCSVUpload(false);
                                                setCsvFile(null);
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={uploadLoading || !csvFile}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {uploadLoading ? 'Enviando...' : 'Enviar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Products List */}
                    {products.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500 text-lg mb-4">
                                Você ainda não cadastrou nenhum produto
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg shadow-md p-4 flex gap-4"
                                >
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
                                        <p className="text-lg font-bold text-indigo-600 mt-2">
                                            R$ {product.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
