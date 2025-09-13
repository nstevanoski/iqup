import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import DeleteConfirmationModal from './DeleteConfirmationModal';

// Mock the Button component
vi.mock('@/components/buttons/Button', () => ({
  default: ({ children, onClick, disabled, isLoading, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      data-testid={props['data-testid'] || 'button'}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  ),
}));

describe('DeleteConfirmationModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this item/)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <DeleteConfirmationModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByText('Delete Confirmation')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when delete button is clicked', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button (X) is clicked', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays custom title and description', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Custom Title"
        description="Custom description text"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('displays item name in default description', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        itemName="Test Item"
      />
    );

    expect(screen.getByText(/Are you sure you want to delete "Test Item"/)).toBeInTheDocument();
  });

  it('shows loading state on confirm button', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isLoading={true}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isLoading={true}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    const deleteButton = screen.getByText('Loading...');
    
    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });

  it('calls onClose when escape key is pressed', async () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const modalContent = screen.getByText('Delete Confirmation').closest('div');
    fireEvent.click(modalContent!);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
