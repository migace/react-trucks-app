import { useEffect } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border border-gray-200 dark:border-gray-700"
      >
        <h3
          id="dialog-title"
          className="text-base font-semibold text-gray-900 dark:text-white"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
