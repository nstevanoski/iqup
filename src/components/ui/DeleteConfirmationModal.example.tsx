import { useState } from 'react';

import Button from '@/components/buttons/Button';
import DeleteConfirmationModal from './DeleteConfirmationModal';

/**
 * Example usage of DeleteConfirmationModal component
 * This file demonstrates different ways to use the modal
 */
export default function DeleteConfirmationModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleDeleteClick = (itemName: string) => {
    setItemToDelete(itemName);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Deleting item: ${itemToDelete}`);
    
    setIsLoading(false);
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Delete Confirmation Modal Examples</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
          <Button 
            variant="outline" 
            onClick={() => handleDeleteClick('User Account')}
          >
            Delete User Account
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">With Custom Text</h3>
          <Button 
            variant="outline" 
            onClick={() => {
              setItemToDelete('Important Document');
              setIsModalOpen(true);
            }}
          >
            Delete Document
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Warning Variant</h3>
          <Button 
            variant="outline" 
            onClick={() => {
              setItemToDelete('Training Session');
              setIsModalOpen(true);
            }}
          >
            Cancel Training
          </Button>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete || undefined}
        isLoading={isLoading}
        variant={itemToDelete === 'Training Session' ? 'warning' : 'danger'}
        title={itemToDelete === 'Training Session' ? 'Cancel Training' : 'Delete Confirmation'}
        confirmText={itemToDelete === 'Training Session' ? 'Cancel Training' : 'Delete'}
        description={
          itemToDelete === 'Training Session' 
            ? 'Are you sure you want to cancel this training session? Participants will be notified.'
            : undefined
        }
      />
    </div>
  );
}

/**
 * Hook for managing delete confirmation modal state
 * This can be reused across different components
 */
export function useDeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = (itemName: string) => {
    setItemToDelete(itemName);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (!isLoading) {
      setIsOpen(false);
      setItemToDelete(null);
    }
  };

  const confirmDelete = async (deleteFn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await deleteFn();
      closeModal();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    itemToDelete,
    isLoading,
    openModal,
    closeModal,
    confirmDelete,
  };
}
