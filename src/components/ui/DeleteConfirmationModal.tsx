import { AlertTriangle, X } from 'lucide-react';
import * as React from 'react';

import Button from '@/components/buttons/Button';
import { cn } from '@/lib/utils';

/**
 * Props for the DeleteConfirmationModal component
 */
export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  className?: string;
}

/**
 * A reusable delete confirmation modal component
 * 
 * Features:
 * - Customizable title, description, and button text
 * - Support for loading states
 * - Keyboard navigation (Escape to close)
 * - Backdrop click to close
 * - Two variants: danger (red) and warning (yellow)
 * - Accessible with proper ARIA labels
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <DeleteConfirmationModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleDelete}
 *   itemName="User Account"
 *   isLoading={isDeleting}
 * />
 * ```
 */
const DeleteConfirmationModal = React.forwardRef<
  HTMLDivElement,
  DeleteConfirmationModalProps
>(
  (
    {
      isOpen,
      onClose,
      onConfirm,
      title = 'Delete Confirmation',
      description,
      itemName,
      isLoading = false,
      confirmText = 'Delete',
      cancelText = 'Cancel',
      variant = 'danger',
      className,
    },
    ref
  ) => {
    // Handle escape key press
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose]);

    // Handle backdrop click
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    const defaultDescription = itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : 'Are you sure you want to delete this item? This action cannot be undone.';

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          'bg-black/50 backdrop-blur-sm',
          'transition-opacity duration-200',
          className
        )}
        onClick={handleBackdropClick}
      >
        <div
          className={cn(
            'relative w-full max-w-md mx-4',
            'bg-white rounded-lg shadow-xl',
            'transform transition-all duration-200',
            'animate-in fade-in-0 zoom-in-95'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              'absolute top-4 right-4',
              'p-1 rounded-full',
              'text-gray-400 hover:text-gray-600',
              'hover:bg-gray-100',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Modal content */}
          <div className="p-6">
            {/* Icon and title */}
            <div className="flex items-start space-x-3 mb-4">
              <div
                className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  variant === 'danger' && 'bg-red-100 text-red-600',
                  variant === 'warning' && 'bg-yellow-100 text-yellow-600'
                )}
              >
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">
                  {description || defaultDescription}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="min-w-[80px]"
              >
                {cancelText}
              </Button>
              <Button
                variant="primary"
                onClick={onConfirm}
                isLoading={isLoading}
                className={cn(
                  'min-w-[80px]',
                  variant === 'danger' && 'bg-red-600 hover:bg-red-700 border-red-600',
                  variant === 'warning' && 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600'
                )}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';

export default DeleteConfirmationModal;
