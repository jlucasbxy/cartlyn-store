'use client';

import Image from 'next/image';
import Loading from '@/components/loading';
import { PageLayout } from '@/components/page-layout';
import { Modal } from '@/components/modal';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { ConfirmModal } from '@/components/confirm-modal';
import { Pagination } from '@/components/pagination';
import { FileInput } from '@/components/file-input';
import { useSellerProductsPage } from '@/hooks/use-seller-products-page';

export default function SellerProductsPage() {
    const {
        showForm,
        showCSVUpload,
        editingProduct,
        products,
        loading,
        pagination,
        currentPage,
        status,
        productForm,
        csvUpload,
        confirmState,
        handleEdit,
        handleNewProduct,
        handleCloseForm,
        handleOpenCSVUpload,
        handleCloseCSVUpload,
        deleteProduct,
        goToPage,
        nextPage,
        previousPage,
        handleClose,
    } = useSellerProductsPage();

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
                        onClick={handleNewProduct}
                        size="sm"
                        className="flex-1 sm:flex-initial"
                    >
                        + Novo
                    </Button>
                    <Button
                        onClick={handleOpenCSVUpload}
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
                onClose={handleCloseForm}
                title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
                maxWidth="2xl"
            >
                <form ref={productForm.formRef} onSubmit={productForm.handleSubmit} className="space-y-4">
                    <FormInput
                        label="Nome *"
                        name="name"
                        type="text"
                        errorMsg={productForm.errors.name}
                    />
                    <FormInput
                        label="Preço *"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        errorMsg={productForm.errors.price}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Descrição *
                        </label>
                        <textarea
                            name="description"
                            rows={4}
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
                        name="imageUrl"
                        type="url"
                        errorMsg={productForm.errors.imageUrl}
                    />
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            onClick={handleCloseForm}
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
                onClose={handleCloseCSVUpload}
                title="Upload de Produtos via CSV"
            >
                <form onSubmit={csvUpload.handleUpload} className="space-y-6">
                    <div>
                        <FileInput
                            accept=".csv"
                            onChange={csvUpload.setCsvFile}
                            selectedFile={csvUpload.csvFile}
                            label="Selecionar arquivo CSV"
                            description="Formato: name,price,description,imageUrl"
                        />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Formato do arquivo CSV
                        </h4>
                        <p className="text-xs text-blue-800 dark:text-blue-200 mb-2">
                            O arquivo deve conter as seguintes colunas na primeira linha:
                        </p>
                        <code className="block bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 p-2 rounded border border-blue-200 dark:border-blue-700 font-mono">
                            name,price,description,imageUrl
                        </code>
                        <p className="text-xs text-blue-800 dark:text-blue-200 mt-2">
                            <strong>Exemplo:</strong>
                        </p>
                        <code className="block bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 p-2 rounded border border-blue-200 dark:border-blue-700 font-mono mt-1">
                            Produto 1,99.90,Descrição do produto,https://exemplo.com/imagem.jpg
                        </code>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            onClick={handleCloseCSVUpload}
                            variant="secondary"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={csvUpload.uploading || !csvUpload.csvFile}
                            variant="success"
                        >
                            {csvUpload.uploading ? 'Enviando...' : 'Enviar CSV'}
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
