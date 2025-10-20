import { useState, useCallback } from 'react';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary' | 'success';
}

interface ConfirmState extends ConfirmOptions {
    isOpen: boolean;
    onConfirm: () => void;
}

export function useConfirm() {
    const [confirmState, setConfirmState] = useState<ConfirmState>({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        variant: 'danger',
        onConfirm: () => {},
    });

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                ...options,
                onConfirm: () => {
                    resolve(true);
                    setConfirmState((prev) => ({ ...prev, isOpen: false }));
                },
            });
        });
    }, []);

    const handleClose = useCallback(() => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
    }, []);

    return {
        confirm,
        confirmState,
        handleClose,
    };
}
