"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  ConfirmModal,
  EmptyState,
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
  products: Product[];
  pagination: PaginationData;
}

export function SellerProductsClient({ products, pagination }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasPreviousPage = !!searchParams.get("cursor");

  const {
    showForm,
    showCSVUpload,
    editingProduct,
    productForm,
    csvUpload,
    confirmState,
    handleEdit,
    handleNewProduct,
    handleCloseForm,
    handleOpenCSVUpload,
    handleCloseCSVUpload,
    deleteProduct,
    handleClose
  } = useSellerProductsPage();

  const nextPage = () => {
    if (!pagination.hasNextPage || !pagination.nextCursor) return;
    router.push(`?cursor=${pagination.nextCursor}`);
  };

  const previousPage = () => {
    router.back();
  };

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Meus Produtos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gerencie seu catálogo
          </p>
        </div>
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
            variant="secondary"
            size="sm"
            className="flex-1 sm:flex-initial"
          >
            Importar CSV
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

      {products.length === 0 ? (
        <EmptyState title="Você ainda não cadastrou nenhum produto" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 stagger-children">
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
