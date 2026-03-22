"use client";

import {
  Button,
  ConfirmModal,
  EmptyState,
  Loading,
  PageLayout,
  Pagination
} from "@/components";
import { useSellerProductsPage } from "@/hooks";
import { CsvUploadModal } from "./csv-upload-modal";
import { ProductFormModal } from "./product-form-modal";
import { SellerProductCard } from "./seller-product-card";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  active: boolean;
  publishedAt: string;
}

interface PaginationData {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

interface Props {
  initialProducts: Product[];
  initialPagination: PaginationData;
}

export function SellerProductsClient({
  initialProducts,
  initialPagination
}: Props) {
  const {
    showForm,
    showCSVUpload,
    editingProduct,
    products,
    loading,
    pagination,
    hasPreviousPage,
    productForm,
    csvUpload,
    confirmState,
    handleEdit,
    handleNewProduct,
    handleCloseForm,
    handleOpenCSVUpload,
    handleCloseCSVUpload,
    deleteProduct,
    nextPage,
    previousPage,
    handleClose
  } = useSellerProductsPage(10, initialProducts, initialPagination);

  if (loading) {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          Meus Produtos
        </h1>
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

      <ProductFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        isEditing={!!editingProduct}
        formRef={productForm.formRef}
        onSubmit={productForm.handleSubmit}
        errors={productForm.errors}
        loading={productForm.loading}
      />

      <CsvUploadModal
        isOpen={showCSVUpload}
        onClose={handleCloseCSVUpload}
        onUpload={csvUpload.handleUpload}
        onFileChange={csvUpload.setCsvFile}
        selectedFile={csvUpload.csvFile}
        uploading={csvUpload.uploading}
      />

      {products.length === 0 && !loading ? (
        <EmptyState title="Você ainda não cadastrou nenhum produto" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <SellerProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={deleteProduct}
              />
            ))}
          </div>

          <Pagination
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={hasPreviousPage}
            onNext={nextPage}
            onPrevious={previousPage}
          />
        </>
      )}

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
