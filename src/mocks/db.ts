import { 
  Program, 
  SubProgram, 
  Student, 
  Teacher, 
  LearningGroup, 
  Product, 
  InventoryItem, 
  Order, 
  Training, 
  TrainingType, 
  TeacherTrainerAccount, 
  RoyaltyReportRow, 
  StudentReportRow,
  User,
  Account
} from "@/types";
import { Role } from "@/lib/rbac";

// Helper function to create base entity
const createBaseEntity = (id: string): { id: string; createdAt: Date; updatedAt: Date } => ({
  id,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
});

// Users and Accounts
export const users: User[] = [
  {
    ...createBaseEntity('1'),
    name: 'John Smith',
    email: 'john.smith@iqup.com',
    role: 'HQ',
    isActive: true,
  },
  {
    ...createBaseEntity('2'),
    name: 'Sarah Johnson',
    email: 'sarah.johnson@iqup.com',
    role: 'MF',
    isActive: true,
  },
  {
    ...createBaseEntity('3'),
    name: 'Mike Davis',
    email: 'mike.davis@iqup.com',
    role: 'LC',
    isActive: true,
  },
  {
    ...createBaseEntity('4'),
    name: 'Emily Wilson',
    email: 'emily.wilson@iqup.com',
    role: 'TT',
    isActive: true,
  },
];

export const accounts: Account[] = [
  {
    ...createBaseEntity('1'),
    name: 'Global Headquarters',
    type: 'HQ',
    address: '123 Corporate Blvd, New York, NY 10001',
    phone: '+1-555-0100',
    email: 'hq@iqup.com',
    isActive: true,
  },
  {
    ...createBaseEntity('2'),
    name: 'Master Franchise USA',
    type: 'MF',
    address: '456 Business Ave, Los Angeles, CA 90210',
    phone: '+1-555-0200',
    email: 'usa@iqup.com',
    isActive: true,
  },
  {
    ...createBaseEntity('3'),
    name: 'Learning Center NYC',
    type: 'LC',
    address: '789 Education St, New York, NY 10002',
    phone: '+1-555-0300',
    email: 'nyc@iqup.com',
    isActive: true,
  },
  {
    ...createBaseEntity('4'),
    name: 'Learning Center LA',
    type: 'LC',
    address: '321 Learning Dr, Los Angeles, CA 90211',
    phone: '+1-555-0400',
    email: 'la@iqup.com',
    isActive: true,
  },
  {
    ...createBaseEntity('5'),
    name: 'Teacher Training Center',
    type: 'TT',
    address: '654 Training Way, Chicago, IL 60601',
    phone: '+1-555-0500',
    email: 'training@iqup.com',
    isActive: true,
  },
];

// Programs
export const programs: Program[] = [
  {
    ...createBaseEntity('1'),
    name: 'English Language Program',
    description: 'Comprehensive English learning program for all levels',
    category: 'Language',
    duration: 12,
    price: 1200,
    isActive: true,
    requirements: ['Basic reading skills', 'Age 6+'],
  },
  {
    ...createBaseEntity('2'),
    name: 'Mathematics Excellence',
    description: 'Advanced mathematics curriculum from basic to advanced levels',
    category: 'Mathematics',
    duration: 10,
    price: 1000,
    isActive: true,
    requirements: ['Basic arithmetic', 'Age 7+'],
  },
  {
    ...createBaseEntity('3'),
    name: 'Science Discovery',
    description: 'Interactive science program covering physics, chemistry, and biology',
    category: 'Science',
    duration: 8,
    price: 800,
    isActive: true,
    requirements: ['Basic reading', 'Age 8+'],
  },
  {
    ...createBaseEntity('4'),
    name: 'Computer Programming',
    description: 'Introduction to programming and computer science concepts',
    category: 'Technology',
    duration: 6,
    price: 900,
    isActive: true,
    requirements: ['Basic computer skills', 'Age 10+'],
  },
];

// SubPrograms
export const subPrograms: SubProgram[] = [
  {
    ...createBaseEntity('1'),
    name: 'Basic English',
    description: 'Introduction to English language fundamentals',
    programId: '1',
    level: 1,
    duration: 4,
    price: 400,
    isActive: true,
    prerequisites: [],
  },
  {
    ...createBaseEntity('2'),
    name: 'Intermediate English',
    description: 'Intermediate level English language skills',
    programId: '1',
    level: 2,
    duration: 4,
    price: 400,
    isActive: true,
    prerequisites: ['Basic English'],
  },
  {
    ...createBaseEntity('3'),
    name: 'Advanced English',
    description: 'Advanced English language proficiency',
    programId: '1',
    level: 3,
    duration: 4,
    price: 400,
    isActive: true,
    prerequisites: ['Intermediate English'],
  },
  {
    ...createBaseEntity('4'),
    name: 'Basic Math',
    description: 'Fundamental mathematics concepts',
    programId: '2',
    level: 1,
    duration: 3,
    price: 300,
    isActive: true,
    prerequisites: [],
  },
  {
    ...createBaseEntity('5'),
    name: 'Algebra',
    description: 'Introduction to algebraic concepts and problem solving',
    programId: '2',
    level: 2,
    duration: 4,
    price: 400,
    isActive: true,
    prerequisites: ['Basic Math'],
  },
  {
    ...createBaseEntity('6'),
    name: 'Geometry',
    description: 'Geometric shapes, angles, and spatial reasoning',
    programId: '2',
    level: 3,
    duration: 3,
    price: 300,
    isActive: true,
    prerequisites: ['Algebra'],
  },
];

// Teachers
export const teachers: Teacher[] = [
  {
    ...createBaseEntity('1'),
    firstName: 'Dr. Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@iqup.com',
    phone: '+1-555-1001',
    dateOfBirth: new Date('1985-03-15'),
    subject: 'English',
    experience: 10,
    qualifications: ['PhD in English Literature', 'TESOL Certification'],
    address: '100 Teacher Lane, New York, NY 10003',
    isActive: true,
    hireDate: new Date('2020-01-15'),
    salary: 65000,
  },
  {
    ...createBaseEntity('2'),
    firstName: 'Prof. Mike',
    lastName: 'Brown',
    email: 'mike.brown@iqup.com',
    phone: '+1-555-1002',
    dateOfBirth: new Date('1982-07-22'),
    subject: 'Mathematics',
    experience: 8,
    qualifications: ['MSc in Mathematics', 'Teaching Certification'],
    address: '200 Math Street, Los Angeles, CA 90212',
    isActive: true,
    hireDate: new Date('2019-08-01'),
    salary: 62000,
  },
  {
    ...createBaseEntity('3'),
    firstName: 'Dr. Lisa',
    lastName: 'Garcia',
    email: 'lisa.garcia@iqup.com',
    phone: '+1-555-1003',
    dateOfBirth: new Date('1988-11-10'),
    subject: 'Science',
    experience: 6,
    qualifications: ['PhD in Physics', 'Science Education Certification'],
    address: '300 Science Ave, Chicago, IL 60602',
    isActive: true,
    hireDate: new Date('2021-02-01'),
    salary: 68000,
  },
  {
    ...createBaseEntity('4'),
    firstName: 'Mr. David',
    lastName: 'Chen',
    email: 'david.chen@iqup.com',
    phone: '+1-555-1004',
    dateOfBirth: new Date('1990-05-18'),
    subject: 'Computer Science',
    experience: 4,
    qualifications: ['MSc in Computer Science', 'Software Development Experience'],
    address: '400 Tech Blvd, Seattle, WA 98101',
    isActive: true,
    hireDate: new Date('2022-06-01'),
    salary: 70000,
  },
];

// Students
export const students: Student[] = [
  {
    ...createBaseEntity('1'),
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1-555-2001',
    dateOfBirth: new Date('2010-04-12'),
    grade: '5th',
    school: 'Elementary School NYC',
    parentName: 'Robert Johnson',
    parentPhone: '+1-555-2002',
    parentEmail: 'robert.johnson@email.com',
    address: '500 Student St, New York, NY 10004',
    isActive: true,
    enrollmentDate: new Date('2024-01-15'),
    programId: '1',
    subProgramId: '1',
  },
  {
    ...createBaseEntity('2'),
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@email.com',
    phone: '+1-555-2003',
    dateOfBirth: new Date('2009-08-25'),
    grade: '6th',
    school: 'Middle School LA',
    parentName: 'Mary Smith',
    parentPhone: '+1-555-2004',
    parentEmail: 'mary.smith@email.com',
    address: '600 Learning Ave, Los Angeles, CA 90213',
    isActive: true,
    enrollmentDate: new Date('2024-01-20'),
    programId: '2',
    subProgramId: '4',
  },
  {
    ...createBaseEntity('3'),
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@email.com',
    phone: '+1-555-2005',
    dateOfBirth: new Date('2011-12-03'),
    grade: '4th',
    school: 'Elementary School Chicago',
    parentName: 'James Davis',
    parentPhone: '+1-555-2006',
    parentEmail: 'james.davis@email.com',
    address: '700 Education Dr, Chicago, IL 60603',
    isActive: true,
    enrollmentDate: new Date('2024-02-01'),
    programId: '3',
    subProgramId: '1',
  },
  {
    ...createBaseEntity('4'),
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    phone: '+1-555-2007',
    dateOfBirth: new Date('2008-06-14'),
    grade: '7th',
    school: 'Middle School Seattle',
    parentName: 'Jennifer Wilson',
    parentPhone: '+1-555-2008',
    parentEmail: 'jennifer.wilson@email.com',
    address: '800 Tech Way, Seattle, WA 98102',
    isActive: true,
    enrollmentDate: new Date('2024-01-10'),
    programId: '4',
    subProgramId: '1',
  },
];

// Learning Groups
export const learningGroups: LearningGroup[] = [
  {
    ...createBaseEntity('1'),
    name: 'Grade 5 English A',
    description: 'Basic English for 5th grade students',
    programId: '1',
    subProgramId: '1',
    teacherId: '1',
    maxStudents: 15,
    currentStudents: 12,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-05-15'),
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: 'Room 101' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '10:30', room: 'Room 101' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '10:30', room: 'Room 101' },
    ],
    isActive: true,
    location: 'Learning Center NYC',
  },
  {
    ...createBaseEntity('2'),
    name: 'Grade 6 Math B',
    description: 'Basic Mathematics for 6th grade students',
    programId: '2',
    subProgramId: '4',
    teacherId: '2',
    maxStudents: 12,
    currentStudents: 10,
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-04-20'),
    schedule: [
      { dayOfWeek: 2, startTime: '10:00', endTime: '11:30', room: 'Room 102' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '11:30', room: 'Room 102' },
    ],
    isActive: true,
    location: 'Learning Center LA',
  },
];

// Products
export const products: Product[] = [
  {
    ...createBaseEntity('1'),
    name: 'English Textbook - Level 1',
    description: 'Comprehensive English textbook for beginners',
    category: 'Books',
    sku: 'ENG-TXT-001',
    price: 25.99,
    cost: 15.00,
    isActive: true,
    stockQuantity: 150,
    minStockLevel: 20,
    supplier: 'Educational Publishers Inc.',
    imageUrl: '/images/english-textbook-1.jpg',
  },
  {
    ...createBaseEntity('2'),
    name: 'Math Workbook - Grade 5',
    description: 'Interactive mathematics workbook for 5th grade',
    category: 'Books',
    sku: 'MATH-WB-005',
    price: 18.99,
    cost: 12.00,
    isActive: true,
    stockQuantity: 200,
    minStockLevel: 25,
    supplier: 'Math Education Co.',
    imageUrl: '/images/math-workbook-5.jpg',
  },
  {
    ...createBaseEntity('3'),
    name: 'Science Kit - Chemistry',
    description: 'Complete chemistry experiment kit for students',
    category: 'Kits',
    sku: 'SCI-KIT-CHEM',
    price: 45.99,
    cost: 30.00,
    isActive: true,
    stockQuantity: 75,
    minStockLevel: 10,
    supplier: 'Science Supplies Ltd.',
    imageUrl: '/images/chemistry-kit.jpg',
  },
  {
    ...createBaseEntity('4'),
    name: 'Programming Laptop',
    description: 'Student laptop for programming courses',
    category: 'Electronics',
    sku: 'LAPTOP-PROG',
    price: 599.99,
    cost: 450.00,
    isActive: true,
    stockQuantity: 30,
    minStockLevel: 5,
    supplier: 'Tech Solutions Inc.',
    imageUrl: '/images/programming-laptop.jpg',
  },
];

// Inventory Items
export const inventoryItems: InventoryItem[] = [
  {
    ...createBaseEntity('1'),
    productId: '1',
    quantity: 150,
    location: 'Warehouse A - Shelf 1',
    lastRestocked: new Date('2024-01-10'),
    expiryDate: new Date('2026-01-10'),
    batchNumber: 'BATCH-001',
    notes: 'New edition with updated content',
  },
  {
    ...createBaseEntity('2'),
    productId: '2',
    quantity: 200,
    location: 'Warehouse A - Shelf 2',
    lastRestocked: new Date('2024-01-12'),
    expiryDate: new Date('2025-12-31'),
    batchNumber: 'BATCH-002',
    notes: 'Standard edition',
  },
  {
    ...createBaseEntity('3'),
    productId: '3',
    quantity: 75,
    location: 'Warehouse B - Section 1',
    lastRestocked: new Date('2024-01-08'),
    expiryDate: new Date('2025-06-30'),
    batchNumber: 'BATCH-003',
    notes: 'Safety certified kit',
  },
  {
    ...createBaseEntity('4'),
    productId: '4',
    quantity: 30,
    location: 'Warehouse C - Electronics',
    lastRestocked: new Date('2024-01-05'),
    batchNumber: 'BATCH-004',
    notes: 'Latest model with warranty',
  },
];

// Training Types
export const trainingTypes: TrainingType[] = [
  {
    ...createBaseEntity('1'),
    name: 'New Teacher Orientation',
    description: 'Comprehensive orientation program for new teachers',
    duration: 16,
    category: 'Orientation',
    isActive: true,
    prerequisites: ['Teaching Certification'],
  },
  {
    ...createBaseEntity('2'),
    name: 'Advanced Teaching Methods',
    description: 'Advanced techniques for experienced teachers',
    duration: 24,
    category: 'Professional Development',
    isActive: true,
    prerequisites: ['2+ years teaching experience'],
  },
  {
    ...createBaseEntity('3'),
    name: 'Technology Integration',
    description: 'Training on integrating technology in the classroom',
    duration: 12,
    category: 'Technology',
    isActive: true,
    prerequisites: ['Basic computer skills'],
  },
];

// Teacher Trainers
export const teacherTrainers: TeacherTrainerAccount[] = [
  {
    ...createBaseEntity('1'),
    firstName: 'Master',
    lastName: 'Trainer John',
    email: 'john.trainer@iqup.com',
    phone: '+1-555-3001',
    specialization: 'English',
    experience: 15,
    qualifications: ['PhD in Education', 'TESOL Master Trainer'],
    certifications: ['Advanced TESOL', 'Curriculum Development'],
    isActive: true,
    hireDate: new Date('2018-01-01'),
    salary: 75000,
    location: 'Training Center Chicago',
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isAvailable: true },
    ],
  },
  {
    ...createBaseEntity('2'),
    firstName: 'Master',
    lastName: 'Trainer Lisa',
    email: 'lisa.trainer@iqup.com',
    phone: '+1-555-3002',
    specialization: 'Mathematics',
    experience: 12,
    qualifications: ['MSc in Mathematics Education', 'Teaching Excellence Award'],
    certifications: ['Math Education Specialist', 'Assessment Design'],
    isActive: true,
    hireDate: new Date('2019-03-01'),
    salary: 72000,
    location: 'Training Center Chicago',
    availability: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '16:00', isAvailable: true },
    ],
  },
];

// Trainings
export const trainings: Training[] = [
  {
    ...createBaseEntity('1'),
    name: 'Teacher Training Workshop - January 2024',
    description: 'Comprehensive training for new teachers',
    typeId: '1',
    trainerId: '1',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-19'),
    maxParticipants: 25,
    currentParticipants: 22,
    location: 'Training Center Chicago',
    isActive: true,
    cost: 500,
    requirements: ['Teaching Certification', 'Background Check'],
    materials: ['Training Manual', 'Laptop', 'Notebook'],
  },
  {
    ...createBaseEntity('2'),
    name: 'Advanced Teaching Methods - February 2024',
    description: 'Advanced techniques for experienced educators',
    typeId: '2',
    trainerId: '2',
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-02-09'),
    maxParticipants: 20,
    currentParticipants: 18,
    location: 'Training Center Chicago',
    isActive: true,
    cost: 750,
    requirements: ['2+ years experience', 'Current teaching position'],
    materials: ['Advanced Manual', 'Case Studies', 'Assessment Tools'],
  },
];

// Orders
export const orders: Order[] = [
  {
    ...createBaseEntity('1'),
    orderNumber: 'ORD-2024-001',
    customerId: '3', // Learning Center NYC
    customerType: 'account',
    items: [
      {
        productId: '1',
        quantity: 50,
        unitPrice: 25.99,
        totalPrice: 1299.50,
      },
      {
        productId: '2',
        quantity: 30,
        unitPrice: 18.99,
        totalPrice: 569.70,
      },
    ],
    subtotal: 1869.20,
    tax: 149.54,
    total: 2018.74,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '789 Education St',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA',
    },
    notes: 'Urgent delivery for new semester',
    orderDate: new Date('2024-01-10'),
    expectedDelivery: new Date('2024-01-15'),
    actualDelivery: new Date('2024-01-14'),
  },
  {
    ...createBaseEntity('2'),
    orderNumber: 'ORD-2024-002',
    customerId: '4', // Learning Center LA
    customerType: 'account',
    items: [
      {
        productId: '3',
        quantity: 20,
        unitPrice: 45.99,
        totalPrice: 919.80,
      },
      {
        productId: '4',
        quantity: 5,
        unitPrice: 599.99,
        totalPrice: 2999.95,
      },
    ],
    subtotal: 3919.75,
    tax: 313.58,
    total: 4233.33,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '321 Learning Dr',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90211',
      country: 'USA',
    },
    notes: 'Science equipment for new lab',
    orderDate: new Date('2024-01-20'),
    expectedDelivery: new Date('2024-01-25'),
  },
];

// Royalty Reports
export const royaltyReports: RoyaltyReportRow[] = [
  {
    ...createBaseEntity('1'),
    month: '2024-01',
    franchiseId: '2',
    franchiseName: 'Master Franchise USA',
    totalRevenue: 50000,
    royaltyRate: 0.15,
    royaltyAmount: 7500,
    paymentStatus: 'paid',
    paymentDate: new Date('2024-02-15'),
    notes: 'Q1 2024 royalty payment',
  },
  {
    ...createBaseEntity('2'),
    month: '2024-01',
    franchiseId: '3',
    franchiseName: 'Learning Center NYC',
    totalRevenue: 25000,
    royaltyRate: 0.10,
    royaltyAmount: 2500,
    paymentStatus: 'paid',
    paymentDate: new Date('2024-02-10'),
    notes: 'Monthly royalty payment',
  },
  {
    ...createBaseEntity('3'),
    month: '2024-01',
    franchiseId: '4',
    franchiseName: 'Learning Center LA',
    totalRevenue: 30000,
    royaltyRate: 0.10,
    royaltyAmount: 3000,
    paymentStatus: 'pending',
    notes: 'Payment due by end of month',
  },
];

// Student Reports
export const studentReports: StudentReportRow[] = [
  {
    ...createBaseEntity('1'),
    centerId: '3',
    centerName: 'Learning Center NYC',
    month: '2024-01',
    totalStudents: 150,
    newEnrollments: 25,
    completedPrograms: 18,
    averageGrade: 85.5,
    retentionRate: 0.92,
    revenue: 45000,
    growthRate: 0.12,
  },
  {
    ...createBaseEntity('2'),
    centerId: '4',
    centerName: 'Learning Center LA',
    month: '2024-01',
    totalStudents: 120,
    newEnrollments: 20,
    completedPrograms: 15,
    averageGrade: 87.2,
    retentionRate: 0.89,
    revenue: 36000,
    growthRate: 0.08,
  },
  {
    ...createBaseEntity('3'),
    centerId: '3',
    centerName: 'Learning Center NYC',
    month: '2024-02',
    totalStudents: 165,
    newEnrollments: 30,
    completedPrograms: 22,
    averageGrade: 86.8,
    retentionRate: 0.94,
    revenue: 49500,
    growthRate: 0.15,
  },
];

// Database object for easy access
export const db = {
  users,
  accounts,
  programs,
  subPrograms,
  students,
  teachers,
  learningGroups,
  products,
  inventoryItems,
  orders,
  trainings,
  trainingTypes,
  teacherTrainers,
  royaltyReports,
  studentReports,
};

// Helper functions for database operations
export const findById = <T extends { id: string }>(items: T[], id: string): T | undefined => {
  return items.find(item => item.id === id);
};

export const findByField = <T extends Record<string, any>>(
  items: T[], 
  field: keyof T, 
  value: any
): T[] => {
  return items.filter(item => item[field] === value);
};

export const createId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const addItem = <T extends { id: string; createdAt: Date; updatedAt: Date }>(
  items: T[], 
  newItem: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): T => {
  const item: T = {
    ...newItem,
    id: createId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as T;
  
  items.push(item);
  return item;
};

export const updateItem = <T extends { id: string; updatedAt: Date }>(
  items: T[], 
  id: string, 
  updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
): T | null => {
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  return items[index];
};

export const deleteItem = <T extends { id: string }>(items: T[], id: string): boolean => {
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  items.splice(index, 1);
  return true;
};
