import type { SubmitEventHandler } from "react";
import { Button, FileInput, Modal } from "@/components";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: SubmitEventHandler<HTMLFormElement>;
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
    <Modal isOpen={isOpen} onClose={onClose} title="Importar via CSV">
      <form onSubmit={onUpload} className="space-y-5">
        <FileInput
          accept=".csv"
          onChange={onFileChange}
          selectedFile={selectedFile}
          label="Selecionar arquivo CSV"
          description="Formato: name,price,description,imageUrl"
        />

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
            <svg
              aria-hidden="true"
              className="w-4 h-4"
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
            Formato do CSV
          </h4>
          <code className="block bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 p-2.5 rounded border border-blue-100 dark:border-blue-800/30 font-mono mb-2">
            name,price,description,imageUrl
          </code>
          <p className="text-xs text-blue-700 dark:text-blue-400">Exemplo:</p>
          <code className="block bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 p-2.5 rounded border border-blue-100 dark:border-blue-800/30 font-mono mt-1">
            Produto 1,99.90,Descrição,https://exemplo.com/img.jpg
          </code>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" disabled={uploading || !selectedFile}>
            {uploading ? "Enviando..." : "Enviar CSV"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
