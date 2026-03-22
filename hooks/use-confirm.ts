import { useCallback, useRef, useState } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "success";
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  onConfirm: () => void;
}

export function useConfirm() {
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    variant: "danger",
    onConfirm: () => {}
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setConfirmState({
        isOpen: true,
        ...options,
        onConfirm: () => {
          resolve(true);
          resolveRef.current = null;
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        }
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    resolveRef.current?.(false);
    resolveRef.current = null;
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirm,
    confirmState,
    handleClose
  };
}
