# DeleteConfirmationModal

A reusable delete confirmation modal component that provides a consistent user experience for delete operations across the application.

## Features

- ✅ Customizable title, description, and button text
- ✅ Support for loading states during async operations
- ✅ Keyboard navigation (Escape key to close)
- ✅ Backdrop click to close
- ✅ Two visual variants: `danger` (red) and `warning` (yellow)
- ✅ Accessible with proper ARIA labels
- ✅ TypeScript support with full type definitions
- ✅ Responsive design that works on all screen sizes

## Basic Usage

```tsx
import { useState } from 'react';
import { DeleteConfirmationModal } from '@/components/ui';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Delete Item
      </button>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        itemName="My Item"
        isLoading={isDeleting}
      />
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls whether the modal is visible |
| `onClose` | `() => void` | - | Called when the modal should be closed |
| `onConfirm` | `() => void` | - | Called when the user confirms the deletion |
| `title` | `string` | `"Delete Confirmation"` | The modal title |
| `description` | `string` | Auto-generated | Custom description text |
| `itemName` | `string` | - | Name of the item being deleted (used in default description) |
| `isLoading` | `boolean` | `false` | Shows loading state on the confirm button |
| `confirmText` | `string` | `"Delete"` | Text for the confirm button |
| `cancelText` | `string` | `"Cancel"` | Text for the cancel button |
| `variant` | `'danger' \| 'warning'` | `'danger'` | Visual variant of the modal |
| `className` | `string` | - | Additional CSS classes |

## Variants

### Danger (Default)
Used for destructive actions like deleting data:
```tsx
<DeleteConfirmationModal
  variant="danger"
  title="Delete User"
  itemName="John Doe"
  // ... other props
/>
```

### Warning
Used for actions that are reversible but have consequences:
```tsx
<DeleteConfirmationModal
  variant="warning"
  title="Cancel Training"
  confirmText="Cancel Training"
  description="Are you sure you want to cancel this training session? Participants will be notified."
  // ... other props
/>
```

## Using the Custom Hook

For components that frequently use delete confirmations, you can use the provided hook:

```tsx
import { useDeleteConfirmation } from '@/components/ui/DeleteConfirmationModal.example';

function UserList() {
  const { isOpen, itemToDelete, isLoading, openModal, closeModal, confirmDelete } = useDeleteConfirmation();

  const handleDeleteUser = (userId: string) => {
    openModal(`User ${userId}`);
  };

  const handleConfirmDelete = () => {
    confirmDelete(async () => {
      await deleteUser(itemToDelete);
    });
  };

  return (
    <>
      {/* Your user list UI */}
      
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete}
        isLoading={isLoading}
      />
    </>
  );
}
```

## Accessibility

The modal includes proper accessibility features:

- Focus management (focuses the modal when opened)
- Keyboard navigation (Escape to close)
- ARIA labels for screen readers
- Proper semantic HTML structure
- High contrast colors for better visibility

## Styling

The component uses Tailwind CSS classes and follows the existing design system. You can customize the appearance by:

1. Passing custom `className` prop
2. Modifying the component's internal styles
3. Using CSS custom properties for colors

## Testing

The component includes comprehensive tests covering:
- Rendering states
- User interactions
- Keyboard navigation
- Loading states
- Accessibility features

Run tests with:
```bash
npm test DeleteConfirmationModal
```
