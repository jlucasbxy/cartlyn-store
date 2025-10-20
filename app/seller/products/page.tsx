'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/loading';
import { PageLayout } from '@/components/page-layout';
import { Modal } from '@/components/modal';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { toast } from 'react-toastify';
import { useProductForm } from '@/hooks/use-product-form';
import { useSellerProducts } from '@/hooks/use-seller-products';
import { useProductDelete } from '@/hooks/use-product-delete';
import { useCSVUpload } from '@/hooks/use-csv-upload';
import { useConfirm } from '@/hooks/use-confirm';
import { ConfirmModal } from '@/components/confirm-modal';
import { Pagination } from '@/components/pagination';

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
    const [showForm, setShowForm] = useState(false);
    const [showCSVUpload, setShowCSVUpload] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Custom hooks
    const { products, loading, pagination, currentPage, goToPage, nextPage, previousPage, refetch } = useSellerProducts(10);

    const { confirm, confirmState, handleClose } = useConfirm();

    const productForm = useProductForm({
        onSuccess: () => {
            toast.success(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
            setShowForm(false);
            setEditingProduct(null);
            refetch();
        },
        editingProduct,
    });

    const { deleteProduct } = useProductDelete({
        onSuccess: refetch,
        onConfirm: confirm,
    });

    const csvUpload = useCSVUpload({
        onSuccess: () => {
            setShowCSVUpload(false);
            refetch();
        },
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated' && session?.user.role !== 'SELLER') {
            toast.error('Acesso negado. Apenas vendedores podem acessar esta página.');
            router.push('/');
        }
    }, [status, session, router]);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        productForm.setEditData(product);
        setShowForm(true);
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Meus Produtos</h1>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                        onClick={() => {
                            setShowForm(true);
                            setEditingProduct(null);
                            productForm.resetForm();
                        }}
                        size="sm"
                        className="flex-1 sm:flex-initial"
                    >
                        + Novo
                    </Button>
                    <Button
                        onClick={() => setShowCSVUpload(true)}
                        variant="success"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                    >
                        📄 CSV
                    </Button>
                </div>
            </div>

            {/* Product Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    productForm.resetForm();
                }}
                title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
                maxWidth="2xl"
            >
                <form onSubmit={productForm.handleSubmit} className="space-y-4">
                    <FormInput
                        label="Nome *"
                        type="text"
                        value={productForm.formData.name}
                        onChange={(e) => productForm.setFormData({ ...productForm.formData, name: e.target.value })}
                        errorMsg={productForm.errors.name}
                    />
                    <FormInput
                        label="Preço *"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productForm.formData.price}
                        onChange={(e) => productForm.setFormData({ ...productForm.formData, price: e.target.value })}
                        errorMsg={productForm.errors.price}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Descrição *
                        </label>
                        <textarea
                            rows={4}
                            value={productForm.formData.description}
                            onChange={(e) => productForm.setFormData({ ...productForm.formData, description: e.target.value })}
                            className={`appearance-none rounded relative block w-full px-3 py-2 border placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors ${
                                productForm.errors.description
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {productForm.errors.description && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{productForm.errors.description}</p>
                        )}
                    </div>
                    <FormInput
                        label="URL da Imagem *"
                        type="url"
                        value={productForm.formData.imageUrl}
                        onChange={(e) => productForm.setFormData({ ...productForm.formData, imageUrl: e.target.value })}
                        errorMsg={productForm.errors.imageUrl}
                    />
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingProduct(null);
                                productForm.resetForm();
                            }}
                            variant="secondary"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={productForm.loading}
                        >
                            {productForm.loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* CSV Upload Modal */}
            <Modal
                isOpen={showCSVUpload}
                onClose={() => {
                    setShowCSVUpload(false);
                    csvUpload.resetFile();
                }}
                title="Upload CSV"
            >
                <form onSubmit={csvUpload.handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Arquivo CSV
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => csvUpload.setCsvFile(e.target.files?.[0] || null)}
                            className="w-full text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Formato: name,price,description,imageUrl
                        </p>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            onClick={() => {
                                setShowCSVUpload(false);
                                csvUpload.resetFile();
                            }}
                            variant="secondary"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={csvUpload.uploading || !csvUpload.csvFile}
                            variant="success"
                        >
                            {csvUpload.uploading ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Products List */}
            {products.length === 0 && !loading ? (
                <EmptyState title="Você ainda não cadastrou nenhum produto" />
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        {products.map((product) => (
                            <Card key={product.id} className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative h-40 sm:h-24 w-full sm:w-24 flex-shrink-0">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover rounded"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                                {product.description}
                                            </p>
                                            <p className="text-base sm:text-lg font-bold text-primary mt-2">
                                                R$ {product.price.toFixed(2)}
                                            </p>
                                </div>
                                <div className="flex sm:flex-col gap-2 justify-end sm:justify-center">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors flex-1 sm:flex-initial whitespace-nowrap"
                                        title="Editar produto"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className="hidden sm:inline">Editar</span>
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex-1 sm:flex-initial whitespace-nowrap"
                                        title="Excluir produto"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span className="hidden sm:inline">Excluir</span>
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={goToPage}
                        onNext={nextPage}
                        onPrevious={previousPage}
                    />
                </>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={handleClose}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
                confirmText={confirmState.confirmText}
                cancelText={confirmState.cancelText}
                variant={confirmState.variant}
            />
        </PageLayout>
    );
}
