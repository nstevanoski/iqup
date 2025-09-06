# DataTable and Forms Documentation

This document describes the comprehensive DataTable and Form components built with TanStack Table, react-hook-form, and zod validation.

## 📊 **DataTable Component**

### **Features**
- **Pagination**: Built-in pagination with customizable page sizes
- **Search**: Global search across all columns
- **Column Visibility**: Toggle column visibility with dropdown
- **Row Selection**: Single and bulk row selection with checkboxes
- **Row Actions**: View, Edit, Delete actions per row
- **Bulk Actions**: Bulk delete and export CSV functionality
- **Sorting**: Click column headers to sort data
- **Filtering**: Advanced filtering capabilities
- **Responsive**: Mobile-friendly design

### **Usage**

```typescript
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<YourDataType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  // ... more columns
];

function YourTable() {
  const [data, setData] = useState<YourDataType[]>([]);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search by name..."
      onRowView={(row) => console.log("View", row)}
      onRowEdit={(row) => console.log("Edit", row)}
      onRowDelete={(row) => console.log("Delete", row)}
      onBulkDelete={(rows) => console.log("Bulk delete", rows)}
      onBulkExport={(rows) => console.log("Export", rows)}
      title="Your Data"
      description="Manage your data records"
    />
  );
}
```

### **Props**

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | Table column definitions |
| `data` | `TData[]` | Array of data to display |
| `searchKey` | `string` | Key to search by (optional) |
| `searchPlaceholder` | `string` | Placeholder text for search input |
| `enableRowSelection` | `boolean` | Enable row selection checkboxes |
| `enableBulkActions` | `boolean` | Enable bulk action buttons |
| `onBulkDelete` | `(rows: TData[]) => void` | Bulk delete handler |
| `onBulkExport` | `(rows: TData[]) => void` | Bulk export handler |
| `onRowView` | `(row: TData) => void` | Row view action handler |
| `onRowEdit` | `(row: TData) => void` | Row edit action handler |
| `onRowDelete` | `(row: TData) => void` | Row delete action handler |
| `title` | `string` | Table title |
| `description` | `string` | Table description |
| `className` | `string` | Additional CSS classes |

## 📝 **Form Components**

### **FormDrawer**
A slide-out drawer form component for creating and editing records.

```typescript
import { FormDrawer } from "@/components/ui/form-drawer";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

function YourForm() {
  const [open, setOpen] = useState(false);

  return (
    <FormDrawer
      open={open}
      onOpenChange={setOpen}
      title="Add New Record"
      description="Enter the information below"
      schema={schema}
      onSubmit={async (data) => {
        // Handle form submission
        console.log(data);
      }}
    >
      {(form) => (
        <div className="space-y-4">
          <FormInput name="name" label="Name" />
          <FormInput name="email" label="Email" type="email" />
        </div>
      )}
    </FormDrawer>
  );
}
```

### **FormDialog**
A modal dialog form component for quick forms and confirmations.

```typescript
import { FormDialog } from "@/components/ui/form-dialog";

function YourDialog() {
  const [open, setOpen] = useState(false);

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title="Edit Record"
      description="Update the information below"
      schema={schema}
      onSubmit={async (data) => {
        // Handle form submission
        console.log(data);
      }}
    >
      {(form) => (
        <div className="space-y-4">
          <FormInput name="name" label="Name" />
          <FormInput name="email" label="Email" type="email" />
        </div>
      )}
    </FormDialog>
  );
}
```

### **Form Props**

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Whether the form is open |
| `onOpenChange` | `(open: boolean) => void` | Open/close handler |
| `title` | `string` | Form title |
| `description` | `string` | Form description (optional) |
| `schema` | `z.ZodSchema<T>` | Zod validation schema |
| `defaultValues` | `Partial<T>` | Default form values |
| `onSubmit` | `(data: T) => void \| Promise<void>` | Form submission handler |
| `children` | `(form: UseFormReturn<T>) => ReactNode` | Form content render function |
| `submitLabel` | `string` | Submit button text |
| `cancelLabel` | `string` | Cancel button text |
| `isLoading` | `boolean` | Loading state |
| `className` | `string` | Additional CSS classes |

## 🔧 **Form Field Components**

### **FormInput**
Text input field with validation.

```typescript
<FormInput
  name="email"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
/>
```

### **FormSelect**
Select dropdown with validation.

```typescript
<FormSelect
  name="category"
  label="Category"
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ]}
/>
```

### **FormCheckbox**
Checkbox input with validation.

```typescript
<FormCheckbox
  name="isActive"
  label="Active"
/>
```

### **Custom Form Fields**
Use the `FormField` component for custom form fields.

```typescript
<FormField name="customField">
  {({ value, onChange, onBlur, error }) => (
    <FormItem>
      <FormLabel>Custom Field</FormLabel>
      <FormControl>
        <YourCustomInput
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormControl>
      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  )}
</FormField>
```

## 🎯 **Complete Example**

Here's a complete example showing how to use all components together:

```typescript
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DataTable } from "@/components/ui/data-table";
import { FormDrawer } from "@/components/ui/form-drawer";
import { FormInput, FormSelect } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Define your data type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

// Define validation schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
});

type UserFormData = z.infer<typeof userSchema>;

export function UsersTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  // Define table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <span className={row.getValue("isActive") ? "text-green-600" : "text-red-600"}>
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  // Handlers
  const handleCreate = async (data: UserFormData) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      isActive: true,
    };
    setUsers(prev => [...prev, newUser]);
    setIsCreateOpen(false);
  };

  const handleEdit = async (data: UserFormData) => {
    if (!selectedUser) return;
    
    setUsers(prev => 
      prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...data }
          : user
      )
    );
    setIsEditOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (user: User) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const handleBulkDelete = async (selectedUsers: User[]) => {
    const ids = selectedUsers.map(u => u.id);
    setUsers(prev => prev.filter(u => !ids.includes(u.id)));
  };

  const handleBulkExport = (selectedUsers: User[]) => {
    const csv = [
      ["Name", "Email", "Role", "Status"],
      ...selectedUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.isActive ? "Active" : "Inactive"
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
        onRowEdit={(user) => {
          setSelectedUser(user);
          setIsEditOpen(true);
        }}
        onRowDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
      />

      {/* Create User Drawer */}
      <FormDrawer
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add New User"
        description="Enter user information"
        schema={userSchema}
        onSubmit={handleCreate}
      >
        {(form) => (
          <div className="space-y-4">
            <FormInput name="name" label="Name" />
            <FormInput name="email" label="Email" type="email" />
            <FormSelect
              name="role"
              label="Role"
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
                { value: "guest", label: "Guest" },
              ]}
            />
          </div>
        )}
      </FormDrawer>

      {/* Edit User Drawer */}
      <FormDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit User"
        description="Update user information"
        schema={userSchema}
        defaultValues={selectedUser ? {
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role,
        } : undefined}
        onSubmit={handleEdit}
      >
        {(form) => (
          <div className="space-y-4">
            <FormInput name="name" label="Name" />
            <FormInput name="email" label="Email" type="email" />
            <FormSelect
              name="role"
              label="Role"
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
                { value: "guest", label: "Guest" },
              ]}
            />
          </div>
        )}
      </FormDrawer>
    </div>
  );
}
```

## 🚀 **Key Features**

### **DataTable Features**
- ✅ **Pagination**: Built-in pagination with customizable page sizes
- ✅ **Search**: Global search across all columns
- ✅ **Column Visibility**: Toggle column visibility
- ✅ **Row Selection**: Single and bulk selection
- ✅ **Row Actions**: View, Edit, Delete per row
- ✅ **Bulk Actions**: Bulk delete and CSV export
- ✅ **Sorting**: Click headers to sort
- ✅ **Responsive**: Mobile-friendly design

### **Form Features**
- ✅ **Validation**: Zod schema validation
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Automatic error display
- ✅ **Loading States**: Built-in loading indicators
- ✅ **Auto-reset**: Forms reset on open/close
- ✅ **Flexible**: Support for any form structure

### **Integration**
- ✅ **TanStack Table**: Powerful table functionality
- ✅ **React Hook Form**: Efficient form handling
- ✅ **Zod**: Runtime type validation
- ✅ **Tailwind CSS**: Beautiful, responsive design
- ✅ **TypeScript**: Full type safety

## 🎯 **Best Practices**

1. **Define Clear Schemas**: Use Zod schemas for validation
2. **Handle Loading States**: Show loading indicators during operations
3. **Error Handling**: Provide meaningful error messages
4. **Accessibility**: Use proper ARIA labels and keyboard navigation
5. **Performance**: Use React.memo for expensive components
6. **Responsive Design**: Test on different screen sizes
7. **Data Validation**: Validate data on both client and server

This comprehensive system provides everything needed for building data-rich applications with excellent user experience and developer productivity.
