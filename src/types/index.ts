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
  kind: "academic" | "vocational" | "certification" | "workshop" | "birthday_party" | "stem_camp";
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
  pricingModel: "one-time" | "installments" | "subscription" | "program_price";
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
  
  // New required fields
  parentInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  lastCurrentLG?: {
    id: string;
    name: string;
    programName: string;
    startDate: Date;
    endDate?: Date;
  };
  product?: {
    id: string;
    name: string;
    description: string;
    materials: string[];
    purchaseDate: Date;
  };
  contactOwner: {
    id: string;
    name: string;
    role: "HQ" | "MF" | "LC";
  };
  accountFranchise: {
    id: string;
    name: string;
    type: "MF" | "LC";
  };
  mfName: string;
  programHistory: ProgramHistoryEntry[];
  payments: StudentPayment[];
  certificates: StudentCertificate[];
}

export interface ProgramHistoryEntry {
  id: string;
  programId: string;
  programName: string;
  subProgramId?: string;
  subProgramName?: string;
  learningGroupId?: string;
  learningGroupName?: string;
  startDate: Date;
  endDate?: Date;
  status: "completed" | "dropped" | "transferred";
  completionDate?: Date;
  grade?: number;
  certificateId?: string;
}

export interface StudentPayment {
  id: string;
  studentId: string;
  learningGroupId: string;
  learningGroupName: string;
  month: string; // YYYY-MM format
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  status: "pending" | "paid" | "partial" | "overdue" | "waived";
  paymentMethod?: "bank_transfer" | "cash" | "credit_card";
  reference?: string;
  notes?: string;
  discount?: {
    amount: number;
    reason: string;
    appliedBy: string;
    appliedAt: Date;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentCertificate {
  id: string;
  studentId: string;
  programId: string;
  programName: string;
  subProgramId?: string;
  subProgramName?: string;
  certificateCode: string; // Unique certificate code
  issuedDate: Date;
  validUntil?: Date;
  status: "active" | "revoked";
  downloadUrl?: string;
  issuedBy: string;
  createdAt: Date;
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

// Account Management Types
export interface Account extends BaseEntity {
  name: string;
  type: "MF" | "LC";
  status: "active" | "inactive" | "suspended";
  contactInfo: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  businessInfo: {
    businessName: string;
    taxId: string;
    registrationNumber: string;
    establishedDate: Date;
  };
  owner: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    title: string;
  };
  permissions: Permission[];
  lastLogin?: Date;
  createdBy: string; // User ID who created this account
  parentAccountId?: string; // For LC accounts, link to parent MF
}

export interface Application extends BaseEntity {
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    title: string;
    company: string;
    website: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  businessInfo: {
    businessName: string;
    taxId: string;
    registrationNumber: string;
    establishedDate: Date;
    businessType: string;
    numberOfEmployees: number;
    annualRevenue: number;
  };
  applicationType: "MF" | "LC";
  status: "new" | "under_review" | "approved" | "rejected";
  studentGoals: {
    year1: {
      targetStudents: number;
      programs: string[];
      revenue: number;
      milestones: string[];
    };
    year2: {
      targetStudents: number;
      programs: string[];
      revenue: number;
      milestones: string[];
    };
    year3: {
      targetStudents: number;
      programs: string[];
      revenue: number;
      milestones: string[];
    };
    year4: {
      targetStudents: number;
      programs: string[];
      revenue: number;
      milestones: string[];
    };
  };
  documents: {
    businessLicense: string;
    taxCertificate: string;
    financialStatements: string[];
    marketingPlan: string;
    otherDocuments: string[];
  };
  reviewInfo?: {
    reviewedBy: string;
    reviewedAt: Date;
    comments: string;
    decision: "approved" | "rejected";
    conditions?: string[];
  };
  parentAccountId?: string; // For LC applications, link to parent MF
}

// Royalty Management Types
export interface RoyaltyCommissionCalculation {
  id: string;
  period: {
    startDate: Date;
    endDate: Date;
    type: "monthly" | "quarterly" | "yearly" | "custom";
  };
  lcId: string;
  lcName: string;
  mfId: string;
  mfName: string;
  studentCount: number;
  revenue: number;
  lcToMfCommission: {
    first100Students: {
      count: number;
      rate: number; // 14%
      amount: number;
    };
    beyond100Students: {
      count: number;
      rate: number; // 12%
      amount: number;
    };
    total: number;
  };
  mfToHqCommission: {
    collectedFromLc: number;
    rate: number; // 50%
    amount: number;
  };
  status: "pending" | "calculated" | "paid" | "disputed";
  calculatedAt: Date;
  paidAt?: Date;
  notes?: string;
}

export interface RoyaltyCommissionSummary {
  id: string;
  period: {
    startDate: Date;
    endDate: Date;
    type: "monthly" | "quarterly" | "yearly" | "custom";
  };
  mfId: string;
  mfName: string;
  totalLcCount: number;
  totalStudentCount: number;
  totalRevenue: number;
  totalLcToMfCommission: number;
  totalMfToHqCommission: number;
  lcBreakdown: {
    lcId: string;
    lcName: string;
    studentCount: number;
    revenue: number;
    lcToMfCommission: number;
  }[];
  status: "pending" | "calculated" | "paid" | "disputed";
  calculatedAt: Date;
  paidAt?: Date;
}

export interface RoyaltyCommissionReport {
  id: string;
  period: {
    startDate: Date;
    endDate: Date;
    type: "monthly" | "quarterly" | "yearly" | "custom";
  };
  generatedAt: Date;
  generatedBy: string;
  totalMfCount: number;
  totalLcCount: number;
  totalStudentCount: number;
  totalRevenue: number;
  totalLcToMfCommission: number;
  totalMfToHqCommission: number;
  mfSummaries: RoyaltyCommissionSummary[];
  lcCalculations: RoyaltyCommissionCalculation[];
}

// Student Report Types
export interface StudentReportFilter {
  lcId?: string;
  programId?: string;
  ageRange?: {
    min: number;
    max: number;
  };
  country?: string;
  city?: string;
  status?: "active" | "inactive" | "graduated" | "dropped";
  enrollmentDate?: {
    start: Date;
    end: Date;
  };
  graduationDate?: {
    start: Date;
    end: Date;
  };
}

export interface StudentReportData {
  id: string;
  studentId: string;
  studentName: string;
  age: number;
  country: string;
  city: string;
  lcId: string;
  lcName: string;
  programId: string;
  programName: string;
  subProgramId?: string;
  subProgramName?: string;
  enrollmentDate: Date;
  graduationDate?: Date;
  status: "active" | "inactive" | "graduated" | "dropped";
  totalHours: number;
  completedHours: number;
  progress: number; // percentage
  currentGroupId?: string;
  currentGroupName?: string;
  teacherId?: string;
  teacherName?: string;
  totalPaid: number;
  totalDue: number;
  lastPaymentDate?: Date;
  notes?: string;
}

export interface GenericReportConfig {
  id: string;
  name: string;
  description: string;
  entityType: "students" | "trainings" | "programs" | "products" | "teachers";
  filters: Record<string, any>;
  columns: {
    key: string;
    label: string;
    visible: boolean;
    sortable: boolean;
    filterable: boolean;
  }[];
  sorting: {
    column: string;
    direction: "asc" | "desc";
  };
  grouping?: {
    column: string;
    enabled: boolean;
  };
  aggregation?: {
    column: string;
    function: "sum" | "count" | "avg" | "min" | "max";
  }[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportBuilderState {
  selectedEntityType: "students" | "trainings" | "programs" | "products" | "teachers";
  availableColumns: {
    key: string;
    label: string;
    type: "string" | "number" | "date" | "boolean";
    filterable: boolean;
    sortable: boolean;
  }[];
  selectedColumns: string[];
  filters: Record<string, any>;
  sorting: {
    column: string;
    direction: "asc" | "desc";
  };
  grouping?: {
    column: string;
    enabled: boolean;
  };
  aggregation?: {
    column: string;
    function: "sum" | "count" | "avg" | "min" | "max";
  }[];
}

// Dashboard Types
export interface DashboardMetrics {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  activeTeachers: number;
  totalPrograms: number;
  totalRevenue: number;
  monthlyRevenue: number;
  completionRate: number;
  averageProgress: number;
  totalLearningGroups: number;
  activeLearningGroups: number;
  totalTrainings: number;
  upcomingTrainings: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
}

export interface DashboardChartData {
  revenue: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
  studentProgress: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
  enrollmentTrends: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
  programDistribution: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

export interface DashboardActivity {
  id: string;
  type: "enrollment" | "graduation" | "payment" | "training" | "order" | "system";
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  amount?: number;
  status?: "success" | "warning" | "error" | "info";
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: "metric" | "chart" | "table" | "list";
  size: "small" | "medium" | "large";
  position: { x: number; y: number };
  data: any;
  visible: boolean;
}

export interface RoleBasedDashboard {
  role: "HQ" | "MF" | "LC" | "TT";
  metrics: DashboardMetrics;
  charts: DashboardChartData;
  activities: DashboardActivity[];
  widgets: DashboardWidget[];
  quickActions: {
    id: string;
    title: string;
    description: string;
    icon: string;
    href: string;
    color: string;
  }[];
}

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "HQ" | "MF" | "LC" | "TT";
  password: string; // In real app, this would be hashed
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  scopeId?: string; // Associated scope/center ID
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  message?: string;
  error?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: Date;
  scopeId?: string;
}
