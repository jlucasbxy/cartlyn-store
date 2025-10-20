import { useRef, useState } from 'react';

interface FileInputProps {
    accept?: string;
    onChange: (file: File | null) => void;
    selectedFile?: File | null;
    label?: string;
    description?: string;
}

export function FileInput({
    accept,
    onChange,
    selectedFile,
    label = 'Escolher arquivo',
    description,
}: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];

            // Check if file matches accept attribute
            if (accept) {
                const acceptedTypes = accept.split(',').map(type => type.trim());
                const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
                const mimeType = file.type;

                const isAccepted = acceptedTypes.some(type => {
                    if (type.startsWith('.')) {
                        return fileExtension === type.toLowerCase();
                    }
                    return mimeType.match(type.replace('*', '.*'));
                });

                if (!isAccepted) {
                    return;
                }
            }

            onChange(file);
        }
    };

    return (
        <div className="w-full">
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />

            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 p-8 text-center ${
                    isDragging
                        ? 'border-primary bg-primary/10 dark:bg-primary/20 scale-105'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary'
                }`}
            >
                {selectedFile ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                        <button
                            type="button"
                            className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                            Alterar arquivo
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                <span className="text-primary hover:text-primary-dark cursor-pointer">
                                    {label}
                                </span>
                                {' '}ou arraste e solte
                            </p>
                            {description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
