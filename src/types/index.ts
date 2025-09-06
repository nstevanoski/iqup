import { Role } from "@/lib/rbac";

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User and Account types
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface Account extends BaseEntity {
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

// Program types
export interface Program extends BaseEntity {
  name: string;
  description: string;
  category: string;
  duration: number; // in months
  price: number;
  isActive: boolean;
  requirements?: string[];
}

export interface SubProgram extends BaseEntity {
  name: string;
  description: string;
  programId: string;
  level: number;
  duration: number; // in weeks
  price: number;
  isActive: boolean;
  prerequisites?: string[];
}

// Contact types
export interface Student extends BaseEntity {
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

export interface Teacher extends BaseEntity {
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

// Learning Group types
export interface LearningGroup extends BaseEntity {
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

export interface Schedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  room?: string;
}

// Product and Inventory types
export interface Product extends BaseEntity {
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

export interface InventoryItem extends BaseEntity {
  productId: string;
  quantity: number;
  location: string;
  lastRestocked: Date;
  expiryDate?: Date;
  batchNumber?: string;
  notes?: string;
}

// Order types
export interface Order extends BaseEntity {
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

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Training types
export interface Training extends BaseEntity {
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

export interface TrainingType extends BaseEntity {
  name: string;
  description: string;
  duration: number; // in hours
  category: string;
  isActive: boolean;
  prerequisites?: string[];
}

// Teacher Trainer types
export interface TeacherTrainerAccount extends BaseEntity {
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

export interface Availability {
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Report types
export interface RoyaltyReportRow extends BaseEntity {
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

export interface StudentReportRow extends BaseEntity {
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

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Form types
export interface CreateProgramRequest {
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  requirements?: string[];
}

export interface UpdateProgramRequest extends Partial<CreateProgramRequest> {
  id: string;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string; // ISO date string
  grade: string;
  school?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address?: string;
  programId?: string;
  subProgramId?: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  id: string;
}
