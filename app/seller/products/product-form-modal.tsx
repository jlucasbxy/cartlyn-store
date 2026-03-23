import type { RefObject, SubmitEventHandler } from "react";
import { Button, FormInput, Modal } from "@/components";

interface ProductFormErrors {
  name?: string;
  price?: string;
  description?: string;
  imageUrl?: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formRef: RefObject<HTMLFormElement | null>;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  errors: ProductFormErrors;
  loading: boolean;
}

export function ProductFormModal({
  isOpen,
  onClose,
  isEditing,
  formRef,
  onSubmit,
  errors,
  loading
}: ProductFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Produto" : "Novo Produto"}
      maxWidth="2xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Nome *"
          name="name"
          type="text"
          errorMsg={errors.name}
        />
        <FormInput
          label="Preço *"
          name="price"
          type="number"
          step="0.01"
          min="0"
          errorMsg={errors.price}
        />
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className={`appearance-none rounded-lg block w-full px-4 py-2.5 border placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800/80 focus:outline-none focus-ring text-sm transition-all duration-200 ${
              errors.description
                ? "border-red-400 dark:border-red-500"
                : "border-gray-200 dark:border-gray-600/80 hover:border-gray-300 dark:hover:border-gray-500"
            }`}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
              {errors.description}
            </p>
          )}
        </div>
        <FormInput
          label="URL da Imagem *"
          name="imageUrl"
          type="url"
          errorMsg={errors.imageUrl}
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
