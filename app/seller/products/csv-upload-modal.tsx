import type { FormEvent } from "react";
import { Button, FileInput, Modal } from "@/components";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (e: FormEvent<HTMLFormElement>) => void;
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
  uploading: boolean;
}

export function CsvUploadModal({
  isOpen,
  onClose,
  onUpload,
  onFileChange,
  selectedFile,
  uploading
}: CsvUploadModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload de Produtos via CSV"
    >
      <form onSubmit={onUpload} className="space-y-6">
        <div>
          <FileInput
            accept=".csv"
            onChange={onFileChange}
            selectedFile={selectedFile}
            label="Selecionar arquivo CSV"
            description="Formato: name,price,description,imageUrl"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={uploading || !selectedFile}
            variant="success"
          >
            {uploading ? "Enviando..." : "Enviar CSV"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
