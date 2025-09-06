# Type System and API Documentation

This document describes the comprehensive type system and API structure implemented for the iQup dashboard application.

## 📁 Type System (`src/types/index.ts`)

### Core Entity Types

All entities extend the `BaseEntity` interface which provides:
- `id: string` - Unique identifier
- `createdAt: Date` - Creation timestamp
- `updatedAt: Date` - Last update timestamp

### Main Entity Types

#### **Program**
```typescript
interface Program extends BaseEntity {
  name: string;
  description: string;
  category: string;
  duration: number; // in months
  price: number;
  isActive: boolean;
  requirements?: string[];
}
```

#### **SubProgram**
```typescript
interface SubProgram extends BaseEntity {
  name: string;
  description: string;
  programId: string;
  level: number;
  duration: number; // in weeks
  price: number;
  isActive: boolean;
  prerequisites?: string[];
}
```

#### **Student**
```typescript
interface Student extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  grade: string;
  school?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  isActive: boolean;
  enrollmentDate?: Date;
  programId?: string;
  subProgramId?: string;
}
```

#### **Teacher**
```typescript
interface Teacher extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  subject: string;
  experience: number; // in years
  qualifications: string[];
  address?: string;
  isActive: boolean;
  hireDate: Date;
  salary?: number;
}
```

#### **LearningGroup**
```typescript
interface LearningGroup extends BaseEntity {
  name: string;
  description: string;
  programId: string;
  subProgramId?: string;
  teacherId: string;
  maxStudents: number;
  currentStudents: number;
  startDate: Date;
  endDate: Date;
  schedule: Schedule[];
  isActive: boolean;
  location?: string;
}
```

#### **Product**
```typescript
interface Product extends BaseEntity {
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  isActive: boolean;
  stockQuantity: number;
  minStockLevel: number;
  supplier?: string;
  imageUrl?: string;
}
```

#### **Order**
```typescript
interface Order extends BaseEntity {
  orderNumber: string;
  customerId: string;
  customerType: 'student' | 'teacher' | 'account';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress?: Address;
  notes?: string;
  orderDate: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
}
```

#### **Training**
```typescript
interface Training extends BaseEntity {
  name: string;
  description: string;
  typeId: string;
  trainerId: string;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  isActive: boolean;
  cost: number;
  requirements?: string[];
  materials?: string[];
}
```

#### **TeacherTrainerAccount**
```typescript
interface TeacherTrainerAccount extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization: string;
  experience: number; // in years
  qualifications: string[];
  certifications: string[];
  isActive: boolean;
  hireDate: Date;
  salary?: number;
  location?: string;
  availability: Availability[];
}
```

#### **RoyaltyReportRow**
```typescript
interface RoyaltyReportRow extends BaseEntity {
  month: string; // YYYY-MM format
  franchiseId: string;
  franchiseName: string;
  totalRevenue: number;
  royaltyRate: number;
  royaltyAmount: number;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  paymentDate?: Date;
  notes?: string;
}
```

#### **StudentReportRow**
```typescript
interface StudentReportRow extends BaseEntity {
  centerId: string;
  centerName: string;
  month: string; // YYYY-MM format
  totalStudents: number;
  newEnrollments: number;
  completedPrograms: number;
  averageGrade: number;
  retentionRate: number;
  revenue: number;
  growthRate: number; // percentage
}
```

### API Response Types

#### **ApiResponse**
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

#### **PaginatedResponse**
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### **QueryParams**
```typescript
interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}
```

## 🗄️ Mock Database (`src/mocks/db.ts`)

### Seed Data

The mock database includes comprehensive seed data for all entity types:

- **4 Users** with different roles (HQ, MF, LC, TT)
- **5 Accounts** representing different organizational levels
- **4 Programs** covering English, Math, Science, and Computer Programming
- **6 SubPrograms** with progressive difficulty levels
- **4 Teachers** with different specializations
- **4 Students** with enrollment data
- **2 Learning Groups** with schedules and capacity
- **4 Products** including books, kits, and electronics
- **4 Inventory Items** with stock levels and locations
- **2 Orders** with different statuses
- **2 Training Types** for professional development
- **2 Teacher Trainers** with availability schedules
- **2 Trainings** with participant data
- **3 Royalty Reports** with payment statuses
- **3 Student Reports** with performance metrics

### Database Helper Functions

```typescript
// Find entity by ID
findById<T>(items: T[], id: string): T | undefined

// Find entities by field value
findByField<T>(items: T[], field: keyof T, value: any): T[]

// Create new ID
createId(): string

// Add new item
addItem<T>(items: T[], newItem: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T

// Update existing item
updateItem<T>(items: T[], id: string, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): T | null

// Delete item
deleteItem<T>(items: T[], id: string): boolean
```

## 🌐 MSW API Handlers (`src/mocks/handlers.ts`)

### CRUD Operations

All entities support full CRUD operations:

#### **GET** - List with pagination and search
```
GET /api/{entity}?page=1&limit=10&search=term&sortBy=name&sortOrder=asc
```

#### **GET** - Get by ID
```
GET /api/{entity}/{id}
```

#### **POST** - Create new entity
```
POST /api/{entity}
Content-Type: application/json
{ ...entityData }
```

#### **PUT** - Update existing entity
```
PUT /api/{entity}/{id}
Content-Type: application/json
{ ...updatedFields }
```

#### **DELETE** - Delete entity
```
DELETE /api/{entity}/{id}
```

### Available Endpoints

- `/api/programs` - Program management
- `/api/subprograms` - SubProgram management
- `/api/students` - Student management
- `/api/teachers` - Teacher management
- `/api/learning-groups` - Learning group management
- `/api/orders` - Order management
- `/api/trainings` - Training management
- `/api/teacher-trainers` - Teacher trainer management
- `/api/products` - Product catalog
- `/api/inventory` - Inventory management
- `/api/training-types` - Training type management
- `/api/accounts` - Account management
- `/api/reports/royalties` - Royalty reports
- `/api/reports/students` - Student reports

## 🔧 Type-Safe API Client (`src/lib/api-client.ts`)

### Usage Example

```typescript
import { apiClient } from '@/lib/api-client';

// Get paginated list of programs
const programs = await apiClient.getPrograms({
  page: 1,
  limit: 10,
  search: 'English',
  sortBy: 'name',
  sortOrder: 'asc'
});

// Get specific program
const program = await apiClient.getProgram('1');

// Create new program
const newProgram = await apiClient.createProgram({
  name: 'New Program',
  description: 'Program description',
  category: 'Language',
  duration: 12,
  price: 1200,
  requirements: ['Basic skills']
});

// Update program
const updatedProgram = await apiClient.updateProgram('1', {
  name: 'Updated Program Name',
  price: 1500
});

// Delete program
await apiClient.deleteProgram('1');
```

### Features

- **Type Safety**: All methods are fully typed with TypeScript
- **Error Handling**: Proper error handling with meaningful messages
- **Query Parameters**: Support for pagination, search, sorting, and filtering
- **Consistent API**: All entities follow the same CRUD pattern
- **Response Types**: Properly typed responses with success/error states

## 🎯 Benefits

1. **Type Safety**: Compile-time type checking prevents runtime errors
2. **IntelliSense**: Full IDE support with autocomplete and documentation
3. **Consistency**: Standardized API patterns across all entities
4. **Scalability**: Easy to add new entities and endpoints
5. **Testing**: Mock data enables comprehensive testing
6. **Development**: Realistic data for development and demos

## 🚀 Getting Started

1. **Import types** in your components:
   ```typescript
   import { Program, Student, ApiResponse } from '@/types';
   ```

2. **Use the API client** for data operations:
   ```typescript
   import { apiClient } from '@/lib/api-client';
   ```

3. **Leverage mock data** for development:
   ```typescript
   import { db } from '@/mocks/db';
   ```

4. **Extend the system** by adding new types and handlers following the established patterns.

This type system provides a solid foundation for building a robust, type-safe dashboard application with comprehensive data management capabilities.
