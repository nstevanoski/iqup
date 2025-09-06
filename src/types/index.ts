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
  // New fields for enhanced teacher management
  education: {
    degree: string;
    institution: string;
    graduationYear: number;
    fieldOfStudy: string;
  }[];
  trainings: {
    trainingId: string;
    trainingName: string;
    completedDate: string;
    status: "completed" | "in_progress" | "scheduled";
    certification?: string;
  }[];
  centers: {
    centerId: string;
    centerName: string;
    role: string;
    startDate: string;
    endDate?: string;
    isActive: boolean;
  }[];
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
  status: "active" | "inactive" | "completed" | "cancelled";
  startDate: Date;
  endDate: Date;
  schedule: Schedule[];
  location: string;
  notes?: string;
  // New fields for enhanced learning group management
  dates: {
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    lastClassDate: string;
  };
  pricingSnapshot: {
    programPrice: number;
    subProgramPrice: number;
    totalPrice: number;
    discount?: number;
    finalPrice: number;
    currency: string;
  };
  owner: {
    id: string;
    name: string;
    role: string;
  };
  franchisee: {
    id: string;
    name: string;
    location: string;
  };
  students: {
    studentId: string;
    startDate: string;
    endDate: string;
    productId: string;
    paymentStatus: "pending" | "paid" | "partial" | "overdue";
    enrollmentDate: string;
  }[];
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
  // New fields for enhanced product management
  code: string; // Product code for easy identification
  qty: number; // Available quantity
  minStock: number; // Minimum stock level for alerts
  maxStock: number; // Maximum stock level
  unit: string; // Unit of measurement (pieces, kg, etc.)
  supplier: string; // Supplier information
  markup: number; // Markup percentage
  sellingPrice: number; // Final selling price
  productLists: string[]; // Array of product list IDs this product belongs to
}

export interface ProductList extends BaseEntity {
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  createdBy: string; // User ID
  sharedWithMFs: string[]; // Array of MF scope IDs that can see this list
  visibility: "private" | "shared" | "public";
  products: {
    productId: string;
    sellingPrice: number;
    discount?: number;
    finalPrice: number;
  }[];
}

export interface ProductPrice extends BaseEntity {
  productId: string;
  productListId: string;
  mfId: string; // MF that set this price
  lcId: string; // LC this price is for
  basePrice: number;
  markup: number;
  finalPrice: number;
  status: "active" | "inactive";
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
  // New fields for enhanced order management
  orderType: "hq_to_mf" | "mf_to_lc" | "lc_to_student";
  fromEntity: {
    id: string;
    name: string;
    type: "HQ" | "MF" | "LC";
  };
  toEntity: {
    id: string;
    name: string;
    type: "HQ" | "MF" | "LC";
  };
  consolidationId?: string; // For consolidated orders
  isConsolidated: boolean;
  consolidatedOrders?: string[]; // Array of order IDs that were consolidated
  priority: "low" | "medium" | "high" | "urgent";
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
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
  // New fields for enhanced training management
  recordType: "mandatory" | "optional" | "certification" | "workshop";
  seminarType: "in_person" | "virtual" | "hybrid";
  name: string; // Training name (separate from title)
  owner: {
    id: string;
    name: string;
    role: "HQ" | "MF";
  };
  hostingFranchisee: {
    id: string;
    name: string;
    location: string;
  };
  start: Date; // Start date/time
  end: Date; // End date/time
  max: number; // Maximum participants
  venue: {
    name: string;
    address: string;
    capacity: number;
    facilities: string[];
  };
  price: {
    amount: number;
    currency: string;
    includes: string[];
  };
  teacherTrainer: {
    id: string;
    name: string;
    role: "primary" | "assistant";
  };
  assistant?: {
    id: string;
    name: string;
  };
  ttStatus: "pending" | "in_progress" | "completed" | "failed";
  ttComments?: string;
  details: {
    agenda: string;
    materials: string[];
    prerequisites: string[];
    objectives: string[];
    assessment: string;
  };
  approvalStatus: "draft" | "submitted" | "approved" | "rejected";
  submittedBy?: string; // User ID who submitted
  approvedBy?: string; // User ID who approved
  submittedAt?: Date;
  approvedAt?: Date;
  registrations: TrainingRegistration[];
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
  // New fields for enhanced training type management
  recordType: "mandatory" | "optional" | "certification" | "workshop";
  seminarType: "in_person" | "virtual" | "hybrid";
  createdBy: string; // User ID
  isActive: boolean;
  requirements: string[];
  certification: {
    required: boolean;
    validityPeriod: number; // in months
    renewalRequired: boolean;
  };
}

export interface TrainingRegistration extends BaseEntity {
  trainingId: string;
  teacherId: string;
  registeredBy: string; // User ID (MF/LC who registered the teacher)
  registrationDate: Date;
  status: "registered" | "attended" | "completed" | "failed" | "cancelled";
  attendance: {
    present: boolean;
    checkInTime?: Date;
    checkOutTime?: Date;
  };
  assessment: {
    score?: number;
    maxScore?: number;
    passed: boolean;
    feedback?: string;
    gradedBy?: string; // TT ID
    gradedAt?: Date;
  };
  certificate?: {
    issued: boolean;
    certificateId?: string;
    issuedAt?: Date;
    validUntil?: Date;
  };
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
