import { Role } from "@/lib/rbac";

// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: Address;
}

// Program types
export interface Program extends BaseEntity {
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  category: string;
  duration: number; // in weeks
  price: number;
  maxStudents: number;
  currentStudents: number;
  requirements: string[];
  learningObjectives: string[];
  createdBy: string; // User ID
  // New fields for enhanced program management
  hours: number; // Total program hours
  lessonLength: number; // Length of each lesson in minutes
  kind: "academic" | "vocational" | "certification" | "workshop";
  sharedWithMFs: string[]; // Array of MF scope IDs that can see this program
  visibility: "private" | "shared" | "public";
}

export interface SubProgram extends BaseEntity {
  programId: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  order: number;
  duration: number; // in weeks
  price: number;
  prerequisites: string[];
  learningObjectives: string[];
  createdBy: string; // User ID
  // New fields for enhanced subprogram management
  pricingModel: "one-time" | "installments" | "subscription";
  coursePrice: number; // Base course price
  numberOfPayments?: number; // For installment model
  gap?: number; // Gap between payments in days
  pricePerMonth?: number; // For subscription model
  sharedWithLCs: string[]; // Array of LC scope IDs that can see this subprogram
  visibility: "private" | "shared" | "public";
}

// User types
export interface Student extends BaseEntity, ContactInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  enrollmentDate: Date;
  status: "active" | "inactive" | "graduated" | "suspended";
  programIds: string[];
  subProgramIds: string[];
  learningGroupIds: string[];
  emergencyContact: ContactInfo;
  notes?: string;
  avatar?: string;
}

export interface Teacher extends BaseEntity, ContactInfo {
  firstName: string;
  lastName: string;
  title: string; // Dr., Prof., etc.
  specialization: string[];
  experience: number; // years
  qualifications: string[];
  status: "active" | "inactive" | "on_leave";
  hourlyRate: number;
  availability: Availability[];
  bio?: string;
  avatar?: string;
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

// Learning Group types
export interface LearningGroup extends BaseEntity {
  name: string;
  description: string;
  programId: string;
  subProgramId?: string;
  teacherId: string;
  studentIds: string[];
  maxStudents: number;
  status: "active" | "inactive" | "completed";
  startDate: Date;
  endDate: Date;
  schedule: Schedule[];
  location: string;
  notes?: string;
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
  status: "active" | "inactive" | "discontinued";
  tags: string[];
  images: string[];
  specifications: Record<string, any>;
}

export interface InventoryItem extends BaseEntity {
  productId: string;
  quantity: number;
  reservedQuantity: number;
  location: string;
  lastRestocked: Date;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
}

// Order types
export interface Order extends BaseEntity {
  orderNumber: string;
  studentId: string;
  items: OrderItem[];
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  processedBy?: string; // User ID
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Training types
export interface Training extends BaseEntity {
  title: string;
  description: string;
  typeId: string;
  instructorId: string;
  participantIds: string[];
  maxParticipants: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  startDate: Date;
  endDate: Date;
  duration: number; // in hours
  location: string;
  materials: string[];
  objectives: string[];
  agenda: TrainingAgendaItem[];
  feedback?: TrainingFeedback[];
}

export interface TrainingType extends BaseEntity {
  name: string;
  description: string;
  category: string;
  duration: number; // in hours
  prerequisites: string[];
  objectives: string[];
  materials: string[];
  isRecurring: boolean;
  frequency?: "daily" | "weekly" | "monthly" | "quarterly";
}

export interface TrainingAgendaItem {
  time: string; // HH:MM format
  title: string;
  description: string;
  duration: number; // in minutes
}

export interface TrainingFeedback {
  participantId: string;
  rating: number; // 1-5
  comments?: string;
  submittedAt: Date;
}

// Teacher Trainer Account types
export interface TeacherTrainerAccount extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  status: "active" | "inactive" | "suspended";
  permissions: Permission[];
  lastLogin?: Date;
  profile: TeacherTrainerProfile;
}

export interface TeacherTrainerProfile {
  bio?: string;
  specialization: string[];
  experience: number; // years
  qualifications: string[];
  certifications: string[];
  languages: string[];
  timezone: string;
  avatar?: string;
}

export interface Permission {
  resource: string;
  actions: string[];
}

// Report types
export interface RoyaltyReportRow extends BaseEntity {
  period: string; // YYYY-MM format
  programId: string;
  programName: string;
  totalRevenue: number;
  royaltyRate: number;
  royaltyAmount: number;
  studentCount: number;
  completionRate: number;
  status: "pending" | "approved" | "paid";
}

export interface StudentReportRow extends BaseEntity {
  studentId: string;
  studentName: string;
  programId: string;
  programName: string;
  enrollmentDate: Date;
  completionDate?: Date;
  status: "active" | "completed" | "dropped";
  progress: number; // percentage
  grades: Grade[];
  attendance: AttendanceRecord[];
  payments: PaymentRecord[];
}

export interface Grade {
  subject: string;
  score: number;
  maxScore: number;
  date: Date;
  type: "assignment" | "exam" | "project" | "participation";
}

export interface AttendanceRecord {
  date: Date;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export interface PaymentRecord {
  amount: number;
  date: Date;
  method: string;
  status: "pending" | "completed" | "failed";
  reference?: string;
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

// Filter and Search types
export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Dashboard types
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activePrograms: number;
  completedTrainings: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}
