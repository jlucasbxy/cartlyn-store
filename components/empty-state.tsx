interface EmptyStateProps {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">{title}</p>
            {description && <p className="text-gray-600 mb-6">{description}</p>}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
