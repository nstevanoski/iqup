# Authentication System Documentation

This document describes the enhanced authentication system with role-based access control (RBAC) and scope-based permissions implemented for the iQup dashboard.

## 🔐 **Authentication Overview**

The authentication system provides:
- **Role-based Access Control (RBAC)** with 4 user roles
- **Scope-based Permissions** for hierarchical data access
- **Persistent Authentication** using Zustand + localStorage
- **Protected Routes** with automatic redirects
- **Dynamic Navigation** based on user permissions

## 👥 **User Roles**

### **HQ (Headquarters)**
- **Scope**: Global
- **Access**: Full access to all features and data across the organization
- **Permissions**: All features enabled
- **Use Case**: System administrators, corporate management

### **MF (Master Franchise)**
- **Scope**: Franchise
- **Access**: Access to franchise management features and data
- **Permissions**: All features except HQ-only settings
- **Use Case**: Franchise owners, regional managers

### **LC (Learning Center)**
- **Scope**: Center
- **Access**: Access to student and teacher management within center
- **Permissions**: Contacts, Learning Groups, Orders to MF, Reports, Trainings (view only)
- **Use Case**: Center managers, administrative staff

### **TT (Teacher Trainer)**
- **Scope**: Training
- **Access**: Access to training and learning group features
- **Permissions**: Trainings only
- **Use Case**: Training coordinators, teacher trainers

## 🌐 **Scope Hierarchy**

The system implements a hierarchical scope model:

```
Global (HQ)
├── Franchise (MF)
│   ├── Center (LC)
│   └── Training (TT)
```

### **Scope Types**
- **Global**: Access to all data across the organization
- **Franchise**: Access to franchise-specific data
- **Center**: Access to learning center-specific data
- **Training**: Access to training center-specific data

## 🔑 **Login Process**

### **Step 1: Role Selection**
Users select their role from:
- Headquarters (HQ)
- Master Franchise (MF)
- Learning Center (LC)
- Teacher Trainer (TT)

### **Step 2: Scope Selection**
Based on the selected role, users choose their scope:
- **HQ**: Global scope only
- **MF**: Franchise scope only
- **LC**: Center scope only
- **TT**: Training scope only

### **Step 3: Authentication**
The system creates a user session with:
- Role information
- Scope information
- Scope ID (if applicable)
- Persistent storage in localStorage

## 🛡️ **Permission System**

### **Role Permissions Matrix**

| Feature | HQ | MF | LC | TT |
|---------|----|----|----|----| 
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Programs | ✅ | ✅ | ❌ | ❌ |
| SubPrograms | ✅ | ✅ | ❌ | ❌ |
| Students | ✅ | ✅ | ✅ | ❌ |
| Teachers | ✅ | ✅ | ✅ | ❌ |
| Learning Groups | ✅ | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ✅ | ❌ |
| Trainings | ✅ | ✅ | ✅ | ✅ |
| Teacher Trainers | ✅ | ✅ | ❌ | ❌ |
| Accounts | ✅ | ✅ | ❌ | ❌ |
| Royalty Reports | ✅ | ✅ | ❌ | ❌ |
| Student Reports | ✅ | ✅ | ✅ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ |

### **Scope-based Access Control**

Users can only access resources within their scope hierarchy:
- **HQ (Global)**: Can access all resources
- **MF (Franchise)**: Can access franchise and below
- **LC (Center)**: Can access center and below
- **TT (Training)**: Can access training only

## 🔧 **Implementation Details**

### **RBAC Configuration (`src/lib/rbac.ts`)**

```typescript
export const ROLE_PERMISSIONS = {
  HQ: {
    canViewDashboard: true,
    canViewPrograms: true,
    // ... all permissions
    scope: "global" as Scope,
  },
  MF: {
    canViewDashboard: true,
    canViewPrograms: true,
    canViewSettings: false, // HQ-only
    scope: "franchise" as Scope,
  },
  // ... other roles
};
```

### **Authentication Store (`src/store/auth.ts`)**

```typescript
interface AuthState {
  user: User | null;
  selectedAccount: Account | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setSelectedAccount: (account: Account) => void;
}
```

### **User Interface**

```typescript
interface User {
  id: string;
  name: string;
  role: Role;
  scope: Scope;
  scopeId?: string; // ID of the specific franchise/center/training
}
```

## 🚀 **Usage Examples**

### **Login with Role and Scope**

```typescript
import { mockLogin } from "@/store/auth";

// Login as HQ with global scope
mockLogin("HQ", "global");

// Login as MF with franchise scope
mockLogin("MF", "franchise", "franchise-id");

// Login as LC with center scope
mockLogin("LC", "center", "center-id");
```

### **Check Permissions**

```typescript
import { hasPermission } from "@/lib/rbac";

const canViewPrograms = hasPermission(user.role, "canViewPrograms");
const canViewSettings = hasPermission(user.role, "canViewSettings");
```

### **Check Scope Access**

```typescript
import { canAccessResource } from "@/lib/rbac";

const canAccess = canAccessResource(user, "franchise", "franchise-id");
```

### **Protected Routes**

```typescript
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function ProtectedPage() {
  return (
    <AuthWrapper requiredPermissions={["canViewPrograms"]}>
      <DashboardLayout>
        {/* Page content */}
      </DashboardLayout>
    </AuthWrapper>
  );
}
```

## 🎯 **Navigation Behavior**

### **Sidebar Links by Role**

#### **HQ (Headquarters)**
- All navigation links visible
- Full access to all features

#### **MF (Master Franchise)**
- All links except HQ-only features
- Scoped to franchise data

#### **LC (Learning Center)**
- Contacts (Students, Teachers)
- Learning Groups
- Orders (to MF)
- Reports (Student Reports)
- Trainings (view only)

#### **TT (Teacher Trainer)**
- Trainings only
- Learning Groups (if applicable)

## 🔄 **State Management**

### **Persistent Storage**
- User authentication state persisted in localStorage
- Automatic restoration on page refresh
- Secure logout clears all stored data

### **Real-time Updates**
- Zustand store provides reactive updates
- UI automatically reflects permission changes
- Navigation updates based on current user context

## 🛠️ **Development Features**

### **Mock Authentication**
- Easy role switching for development
- Predefined user accounts for each role
- Scope selection for testing different access levels

### **Type Safety**
- Full TypeScript support
- Compile-time permission checking
- IntelliSense for all authentication features

## 🔒 **Security Considerations**

### **Client-side Protection**
- Route protection with automatic redirects
- UI elements hidden based on permissions
- Navigation restricted by role

### **Data Access Control**
- Scope-based data filtering
- Hierarchical access control
- Resource-level permissions

## 📱 **User Experience**

### **Login Flow**
1. **Role Selection**: Clear role descriptions and use cases
2. **Scope Selection**: Contextual scope options based on role
3. **Confirmation**: Clear display of selected role and scope
4. **Dashboard**: Immediate access to permitted features

### **Navigation**
- **Dynamic Sidebar**: Only shows accessible features
- **Contextual Information**: Role and scope displayed in UI
- **Clear Hierarchy**: Visual indication of access level

### **Error Handling**
- **Graceful Redirects**: Automatic redirect to login when unauthenticated
- **Permission Denied**: Clear messaging for restricted access
- **Loading States**: Smooth transitions during authentication checks

## 🚀 **Getting Started**

1. **Access Login**: Navigate to `/login`
2. **Select Role**: Choose your organizational role
3. **Select Scope**: Choose your access scope
4. **Login**: Confirm and access the dashboard
5. **Navigate**: Use the sidebar to access permitted features

The authentication system provides a robust, scalable foundation for role-based access control with clear separation of concerns and excellent developer experience.
