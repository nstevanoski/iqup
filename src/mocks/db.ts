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
  DashboardStats,
  RecentActivity,
} from "@/types";
import { Role } from "@/lib/rbac";

// Helper function to generate IDs
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to create dates
const createDate = (daysAgo: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Seed data for Programs
export const programs: Program[] = [
  {
    id: generateId("prog"),
    name: "English Language Program",
    description: "Comprehensive English language learning program for all levels",
    status: "active",
    category: "Language",
    duration: 24,
    price: 299.99,
    maxStudents: 100,
    currentStudents: 45,
    requirements: ["Basic reading skills", "Age 16+"],
    learningObjectives: ["Fluency in English", "Grammar mastery", "Conversational skills"],
    createdBy: "user_1",
    hours: 120,
    lessonLength: 60,
    kind: "academic",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    createdAt: createDate(90),
    updatedAt: createDate(5),
  },
  {
    id: generateId("prog"),
    name: "Mathematics Program",
    description: "Advanced mathematics curriculum covering algebra, calculus, and statistics",
    status: "active",
    category: "STEM",
    duration: 36,
    price: 399.99,
    maxStudents: 80,
    currentStudents: 32,
    requirements: ["High school diploma", "Basic math skills"],
    learningObjectives: ["Advanced problem solving", "Mathematical reasoning", "Statistical analysis"],
    createdBy: "user_1",
    hours: 180,
    lessonLength: 90,
    kind: "academic",
    sharedWithMFs: ["mf_region_1"],
    visibility: "shared",
    createdAt: createDate(75),
    updatedAt: createDate(3),
  },
  {
    id: generateId("prog"),
    name: "Science Program",
    description: "Comprehensive science education covering physics, chemistry, and biology",
    status: "active",
    category: "STEM",
    duration: 30,
    price: 349.99,
    maxStudents: 60,
    currentStudents: 28,
    requirements: ["High school diploma", "Basic science knowledge"],
    learningObjectives: ["Scientific method", "Laboratory skills", "Research techniques"],
    createdBy: "user_2",
    hours: 150,
    lessonLength: 75,
    kind: "academic",
    sharedWithMFs: ["mf_region_2"],
    visibility: "shared",
    createdAt: createDate(60),
    updatedAt: createDate(1),
  },
  {
    id: generateId("prog"),
    name: "Computer Science Program",
    description: "Modern computer science curriculum with programming and software development",
    status: "draft",
    category: "Technology",
    duration: 48,
    price: 499.99,
    maxStudents: 50,
    currentStudents: 0,
    requirements: ["Basic computer skills", "Logical thinking"],
    learningObjectives: ["Programming proficiency", "Software development", "System design"],
    createdBy: "user_1",
    hours: 240,
    lessonLength: 120,
    kind: "certification",
    sharedWithMFs: [],
    visibility: "private",
    createdAt: createDate(30),
    updatedAt: createDate(2),
  },
  {
    id: generateId("prog"),
    name: "Digital Marketing Workshop",
    description: "Intensive workshop on digital marketing strategies and tools",
    status: "active",
    category: "Business",
    duration: 8,
    price: 199.99,
    maxStudents: 30,
    currentStudents: 15,
    requirements: ["Basic computer skills", "Marketing interest"],
    learningObjectives: ["Social media marketing", "SEO basics", "Analytics"],
    createdBy: "user_1",
    hours: 40,
    lessonLength: 120,
    kind: "workshop",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    createdAt: createDate(20),
    updatedAt: createDate(1),
  },
  {
    id: generateId("prog"),
    name: "HVAC Technician Certification",
    description: "Professional certification program for HVAC technicians",
    status: "active",
    category: "Vocational",
    duration: 16,
    price: 899.99,
    maxStudents: 25,
    currentStudents: 12,
    requirements: ["High school diploma", "Physical fitness"],
    learningObjectives: ["HVAC systems", "Installation techniques", "Safety protocols"],
    createdBy: "user_1",
    hours: 160,
    lessonLength: 180,
    kind: "vocational",
    sharedWithMFs: ["mf_region_1"],
    visibility: "shared",
    createdAt: createDate(45),
    updatedAt: createDate(3),
  },
];

// Seed data for SubPrograms
export const subPrograms: SubProgram[] = [
  {
    id: generateId("sub"),
    programId: programs[0].id,
    name: "Beginner English",
    description: "Introduction to English language basics",
    status: "active",
    order: 1,
    duration: 8,
    price: 99.99,
    prerequisites: [],
    learningObjectives: ["Basic vocabulary", "Simple grammar", "Pronunciation"],
    createdBy: "user_1",
    pricingModel: "one-time",
    coursePrice: 99.99,
    sharedWithLCs: ["lc_region_1", "lc_region_2"],
    visibility: "shared",
    createdAt: createDate(85),
    updatedAt: createDate(10),
  },
  {
    id: generateId("sub"),
    programId: programs[0].id,
    name: "Intermediate English",
    description: "Intermediate English language skills",
    status: "active",
    order: 2,
    duration: 8,
    price: 99.99,
    prerequisites: ["Beginner English completion"],
    learningObjectives: ["Complex grammar", "Reading comprehension", "Writing skills"],
    createdBy: "user_1",
    pricingModel: "installments",
    coursePrice: 99.99,
    numberOfPayments: 3,
    gap: 30,
    sharedWithLCs: ["lc_region_1"],
    visibility: "shared",
    createdAt: createDate(80),
    updatedAt: createDate(8),
  },
  {
    id: generateId("sub"),
    programId: programs[1].id,
    name: "Algebra Fundamentals",
    description: "Core algebraic concepts and problem solving",
    status: "active",
    order: 1,
    duration: 12,
    price: 149.99,
    prerequisites: ["Basic arithmetic"],
    learningObjectives: ["Equation solving", "Graphing", "Word problems"],
    createdBy: "user_1",
    pricingModel: "subscription",
    coursePrice: 149.99,
    pricePerMonth: 49.99,
    sharedWithLCs: ["lc_region_2"],
    visibility: "shared",
    createdAt: createDate(70),
    updatedAt: createDate(5),
  },
  {
    id: generateId("sub"),
    programId: programs[1].id,
    name: "Calculus Advanced",
    description: "Advanced calculus concepts and applications",
    status: "draft",
    order: 2,
    duration: 16,
    price: 199.99,
    prerequisites: ["Algebra Fundamentals"],
    learningObjectives: ["Derivatives", "Integrals", "Applications"],
    createdBy: "user_1",
    pricingModel: "one-time",
    coursePrice: 199.99,
    sharedWithLCs: [],
    visibility: "private",
    createdAt: createDate(50),
    updatedAt: createDate(3),
  },
  {
    id: generateId("sub"),
    programId: programs[2].id,
    name: "Social Media Marketing",
    description: "Comprehensive social media marketing strategies",
    status: "active",
    order: 1,
    duration: 4,
    price: 79.99,
    prerequisites: ["Basic computer skills"],
    learningObjectives: ["Platform management", "Content creation", "Analytics"],
    createdBy: "user_1",
    pricingModel: "installments",
    coursePrice: 79.99,
    numberOfPayments: 2,
    gap: 14,
    sharedWithLCs: ["lc_region_1", "lc_region_2"],
    visibility: "shared",
    createdAt: createDate(25),
    updatedAt: createDate(2),
  },
  {
    id: generateId("sub"),
    programId: programs[3].id,
    name: "Python Programming",
    description: "Learn Python programming from scratch",
    status: "active",
    order: 1,
    duration: 12,
    price: 299.99,
    prerequisites: ["Basic computer skills"],
    learningObjectives: ["Python syntax", "Data structures", "Algorithms"],
    createdBy: "user_1",
    pricingModel: "subscription",
    coursePrice: 299.99,
    pricePerMonth: 99.99,
    sharedWithLCs: ["lc_region_1"],
    visibility: "shared",
    createdAt: createDate(35),
    updatedAt: createDate(4),
  },
];

// Seed data for Students
export const students: Student[] = [
  {
    id: generateId("stu"),
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0101",
    dateOfBirth: new Date("1995-03-15"),
    gender: "male",
    enrollmentDate: createDate(60),
    status: "active",
    programIds: [programs[0].id, programs[1].id],
    subProgramIds: [subPrograms[0].id, subPrograms[2].id],
    learningGroupIds: [],
    emergencyContact: {
      email: "jane.doe@example.com",
      phone: "+1-555-0102",
    },
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    notes: "Excellent student, very motivated",
    createdAt: createDate(60),
    updatedAt: createDate(5),
  },
  {
    id: generateId("stu"),
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0201",
    dateOfBirth: new Date("1998-07-22"),
    gender: "female",
    enrollmentDate: createDate(45),
    status: "active",
    programIds: [programs[0].id],
    subProgramIds: [subPrograms[1].id],
    learningGroupIds: [],
    emergencyContact: {
      email: "bob.smith@example.com",
      phone: "+1-555-0202",
    },
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    createdAt: createDate(45),
    updatedAt: createDate(3),
  },
  {
    id: generateId("stu"),
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    phone: "+1-555-0301",
    dateOfBirth: new Date("1993-11-08"),
    gender: "male",
    enrollmentDate: createDate(30),
    status: "active",
    programIds: [programs[2].id],
    subProgramIds: [],
    learningGroupIds: [],
    emergencyContact: {
      email: "mary.johnson@example.com",
      phone: "+1-555-0302",
    },
    address: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    createdAt: createDate(30),
    updatedAt: createDate(1),
  },
];

// Seed data for Teachers
export const teachers: Teacher[] = [
  {
    id: generateId("tea"),
    firstName: "Sarah",
    lastName: "Wilson",
    title: "Dr.",
    email: "sarah.wilson@example.com",
    phone: "+1-555-1001",
    specialization: ["English Literature", "Linguistics"],
    experience: 15,
    qualifications: ["PhD in English Literature", "TESOL Certification"],
    status: "active",
    hourlyRate: 75,
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
    ],
    bio: "Experienced English professor with 15 years of teaching experience",
    address: {
      street: "321 Elm St",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    createdAt: createDate(120),
    updatedAt: createDate(7),
  },
  {
    id: generateId("tea"),
    firstName: "Michael",
    lastName: "Brown",
    title: "Prof.",
    email: "michael.brown@example.com",
    phone: "+1-555-1002",
    specialization: ["Mathematics", "Statistics"],
    experience: 12,
    qualifications: ["PhD in Mathematics", "MSc in Statistics"],
    status: "active",
    hourlyRate: 80,
    availability: [
      { dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
    ],
    bio: "Mathematics professor specializing in applied mathematics and statistics",
    address: {
      street: "654 Maple Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    createdAt: createDate(100),
    updatedAt: createDate(4),
  },
  {
    id: generateId("tea"),
    firstName: "Emily",
    lastName: "Davis",
    title: "Dr.",
    email: "emily.davis@example.com",
    phone: "+1-555-1003",
    specialization: ["Physics", "Chemistry"],
    experience: 10,
    qualifications: ["PhD in Physics", "BSc in Chemistry"],
    status: "active",
    hourlyRate: 70,
    availability: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "16:00" },
    ],
    bio: "Physics professor with expertise in experimental physics and chemistry",
    address: {
      street: "987 Cedar St",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA",
    },
    createdAt: createDate(80),
    updatedAt: createDate(2),
  },
];

// Seed data for Learning Groups
export const learningGroups: LearningGroup[] = [
  {
    id: generateId("lg"),
    name: "Advanced English Group A",
    description: "Advanced English conversation and writing group",
    programId: programs[0].id,
    subProgramId: subPrograms[1].id,
    teacherId: teachers[0].id,
    studentIds: [students[0].id, students[1].id],
    maxStudents: 15,
    status: "active",
    startDate: createDate(30),
    endDate: createDate(-30),
    schedule: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00", room: "Room 101" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "12:00", room: "Room 101" },
    ],
    location: "Main Campus",
    notes: "Focus on advanced conversation skills",
    createdAt: createDate(35),
    updatedAt: createDate(5),
  },
  {
    id: generateId("lg"),
    name: "Calculus Study Group",
    description: "Advanced calculus problem solving group",
    programId: programs[1].id,
    teacherId: teachers[1].id,
    studentIds: [students[0].id],
    maxStudents: 20,
    status: "active",
    startDate: createDate(20),
    endDate: createDate(-40),
    schedule: [
      { dayOfWeek: 2, startTime: "14:00", endTime: "16:00", room: "Room 205" },
      { dayOfWeek: 4, startTime: "14:00", endTime: "16:00", room: "Room 205" },
    ],
    location: "Math Building",
    createdAt: createDate(25),
    updatedAt: createDate(3),
  },
];

// Seed data for Products
export const products: Product[] = [
  {
    id: generateId("prod"),
    name: "English Grammar Workbook",
    description: "Comprehensive grammar exercises for English learners",
    category: "Books",
    sku: "EGW-001",
    price: 29.99,
    cost: 15.00,
    status: "active",
    tags: ["grammar", "workbook", "english"],
    images: ["grammar-workbook.jpg"],
    specifications: {
      pages: 200,
      language: "English",
      level: "Intermediate",
    },
    createdAt: createDate(60),
    updatedAt: createDate(10),
  },
  {
    id: generateId("prod"),
    name: "Mathematics Calculator",
    description: "Scientific calculator for advanced mathematics",
    category: "Electronics",
    sku: "MC-001",
    price: 89.99,
    cost: 45.00,
    status: "active",
    tags: ["calculator", "scientific", "math"],
    images: ["calculator.jpg"],
    specifications: {
      functions: "Scientific",
      display: "LCD",
      battery: "Solar + Battery",
    },
    createdAt: createDate(45),
    updatedAt: createDate(5),
  },
];

// Seed data for Inventory Items
export const inventoryItems: InventoryItem[] = [
  {
    id: generateId("inv"),
    productId: products[0].id,
    quantity: 150,
    reservedQuantity: 25,
    location: "Warehouse A",
    lastRestocked: createDate(10),
    minStockLevel: 50,
    maxStockLevel: 200,
    unitCost: 15.00,
    createdAt: createDate(60),
    updatedAt: createDate(10),
  },
  {
    id: generateId("inv"),
    productId: products[1].id,
    quantity: 75,
    reservedQuantity: 10,
    location: "Warehouse B",
    lastRestocked: createDate(5),
    minStockLevel: 25,
    maxStockLevel: 100,
    unitCost: 45.00,
    createdAt: createDate(45),
    updatedAt: createDate(5),
  },
];

// Seed data for Orders
export const orders: Order[] = [
  {
    id: generateId("ord"),
    orderNumber: "ORD-2024-001",
    studentId: students[0].id,
    items: [
      {
        productId: products[0].id,
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98,
      },
    ],
    status: "delivered",
    subtotal: 59.98,
    tax: 4.80,
    discount: 0,
    total: 64.78,
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    shippingAddress: students[0].address!,
    billingAddress: students[0].address!,
    processedBy: "user_1",
    createdAt: createDate(20),
    updatedAt: createDate(15),
  },
  {
    id: generateId("ord"),
    orderNumber: "ORD-2024-002",
    studentId: students[1].id,
    items: [
      {
        productId: products[1].id,
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
      },
    ],
    status: "pending",
    subtotal: 89.99,
    tax: 7.20,
    discount: 0,
    total: 97.19,
    paymentStatus: "pending",
    shippingAddress: students[1].address!,
    billingAddress: students[1].address!,
    createdAt: createDate(5),
    updatedAt: createDate(5),
  },
];

// Seed data for Training Types
export const trainingTypes: TrainingType[] = [
  {
    id: generateId("tt"),
    name: "Teaching Methodology",
    description: "Modern teaching techniques and classroom management",
    category: "Pedagogy",
    duration: 8,
    prerequisites: ["Teaching experience", "Bachelor's degree"],
    objectives: ["Classroom management", "Student engagement", "Assessment techniques"],
    materials: ["Presentation slides", "Handouts", "Videos"],
    isRecurring: true,
    frequency: "monthly",
    createdAt: createDate(90),
    updatedAt: createDate(20),
  },
  {
    id: generateId("tt"),
    name: "Technology Integration",
    description: "Using technology effectively in education",
    category: "Technology",
    duration: 6,
    prerequisites: ["Basic computer skills"],
    objectives: ["Digital tools", "Online platforms", "Interactive content"],
    materials: ["Laptop", "Software licenses", "Tutorials"],
    isRecurring: false,
    createdAt: createDate(60),
    updatedAt: createDate(15),
  },
];

// Seed data for Trainings
export const trainings: Training[] = [
  {
    id: generateId("train"),
    title: "Teaching Methodology Workshop",
    description: "Comprehensive workshop on modern teaching techniques",
    typeId: trainingTypes[0].id,
    instructorId: teachers[0].id,
    participantIds: [teachers[1].id, teachers[2].id],
    maxParticipants: 20,
    status: "completed",
    startDate: createDate(30),
    endDate: createDate(30),
    duration: 8,
    location: "Conference Room A",
    materials: ["Presentation slides", "Workbooks"],
    objectives: ["Improve teaching skills", "Classroom management"],
    agenda: [
      { time: "09:00", title: "Introduction", description: "Welcome and overview", duration: 30 },
      { time: "09:30", title: "Teaching Methods", description: "Modern teaching techniques", duration: 120 },
      { time: "11:30", title: "Break", description: "Coffee break", duration: 15 },
      { time: "11:45", title: "Classroom Management", description: "Managing student behavior", duration: 90 },
    ],
    feedback: [
      {
        participantId: teachers[1].id,
        rating: 5,
        comments: "Excellent workshop, very informative",
        submittedAt: createDate(29),
      },
    ],
    createdAt: createDate(35),
    updatedAt: createDate(29),
  },
];

// Seed data for Teacher Trainer Accounts
export const teacherTrainerAccounts: TeacherTrainerAccount[] = [
  {
    id: "user_1",
    firstName: "HQ",
    lastName: "Admin",
    email: "hq@example.com",
    role: "HQ",
    status: "active",
    permissions: [
      { resource: "*", actions: ["*"] },
    ],
    lastLogin: createDate(1),
    profile: {
      bio: "System administrator with full access",
      specialization: ["System Administration", "User Management"],
      experience: 10,
      qualifications: ["IT Management", "System Administration"],
      certifications: ["PMP", "ITIL"],
      languages: ["English", "Spanish"],
      timezone: "UTC-5",
    },
    createdAt: createDate(365),
    updatedAt: createDate(1),
  },
  {
    id: "user_2",
    firstName: "MF",
    lastName: "Manager",
    email: "mf@example.com",
    role: "MF",
    status: "active",
    permissions: [
      { resource: "programs", actions: ["read", "write", "delete"] },
      { resource: "students", actions: ["read", "write"] },
      { resource: "teachers", actions: ["read", "write"] },
    ],
    lastLogin: createDate(2),
    profile: {
      bio: "Program manager with extensive experience",
      specialization: ["Program Management", "Education"],
      experience: 8,
      qualifications: ["MBA", "Education Management"],
      certifications: ["PMP"],
      languages: ["English", "French"],
      timezone: "UTC-5",
    },
    createdAt: createDate(300),
    updatedAt: createDate(2),
  },
];

// Seed data for Royalty Reports
export const royaltyReports: RoyaltyReportRow[] = [
  {
    id: generateId("rr"),
    period: "2024-01",
    programId: programs[0].id,
    programName: programs[0].name,
    totalRevenue: 13499.55,
    royaltyRate: 0.15,
    royaltyAmount: 2024.93,
    studentCount: 45,
    completionRate: 0.85,
    status: "paid",
    createdAt: createDate(10),
    updatedAt: createDate(5),
  },
  {
    id: generateId("rr"),
    period: "2024-01",
    programId: programs[1].id,
    programName: programs[1].name,
    totalRevenue: 12799.68,
    royaltyRate: 0.15,
    royaltyAmount: 1919.95,
    studentCount: 32,
    completionRate: 0.90,
    status: "paid",
    createdAt: createDate(10),
    updatedAt: createDate(5),
  },
];

// Seed data for Student Reports
export const studentReports: StudentReportRow[] = [
  {
    id: generateId("sr"),
    studentId: students[0].id,
    studentName: `${students[0].firstName} ${students[0].lastName}`,
    programId: programs[0].id,
    programName: programs[0].name,
    enrollmentDate: students[0].enrollmentDate,
    completionDate: undefined,
    status: "active",
    progress: 65,
    grades: [
      { subject: "Grammar", score: 85, maxScore: 100, date: createDate(10), type: "exam" },
      { subject: "Vocabulary", score: 78, maxScore: 100, date: createDate(15), type: "assignment" },
    ],
    attendance: [
      { date: createDate(5), status: "present" },
      { date: createDate(3), status: "present" },
      { date: createDate(1), status: "late" },
    ],
    payments: [
      { amount: 299.99, date: createDate(60), method: "Credit Card", status: "completed", reference: "PAY-001" },
    ],
    createdAt: createDate(60),
    updatedAt: createDate(1),
  },
];

// Dashboard statistics
export const dashboardStats: DashboardStats = {
  totalStudents: students.length,
  totalTeachers: teachers.length,
  activePrograms: programs.filter(p => p.status === "active").length,
  completedTrainings: trainings.filter(t => t.status === "completed").length,
  totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
  pendingOrders: orders.filter(o => o.status === "pending").length,
};

// Recent activities
export const recentActivities: RecentActivity[] = [
  {
    id: generateId("act"),
    type: "student_registration",
    message: "New student registered: John Doe",
    timestamp: createDate(1),
    userId: "user_1",
    metadata: { studentId: students[0].id },
  },
  {
    id: generateId("act"),
    type: "training_completed",
    message: "Training session completed: Teaching Methodology Workshop",
    timestamp: createDate(2),
    userId: "user_2",
    metadata: { trainingId: trainings[0].id },
  },
  {
    id: generateId("act"),
    type: "order_placed",
    message: "New order placed: ORD-2024-002",
    timestamp: createDate(3),
    userId: "user_1",
    metadata: { orderId: orders[1].id },
  },
];

// Database class for managing data
export class MockDatabase {
  // Programs
  getPrograms(): Program[] {
    return programs;
  }

  getProgramById(id: string): Program | undefined {
    return programs.find(p => p.id === id);
  }

  createProgram(program: Omit<Program, "id" | "createdAt" | "updatedAt">): Program {
    const newProgram: Program = {
      ...program,
      id: generateId("prog"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    programs.push(newProgram);
    return newProgram;
  }

  updateProgram(id: string, updates: Partial<Program>): Program | null {
    const index = programs.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    programs[index] = {
      ...programs[index],
      ...updates,
      updatedAt: new Date(),
    };
    return programs[index];
  }

  deleteProgram(id: string): boolean {
    const index = programs.findIndex(p => p.id === id);
    if (index === -1) return false;
    programs.splice(index, 1);
    return true;
  }

  // SubPrograms
  getSubPrograms(): SubProgram[] {
    return subPrograms;
  }

  getSubProgramById(id: string): SubProgram | undefined {
    return subPrograms.find(sp => sp.id === id);
  }

  createSubProgram(subProgram: Omit<SubProgram, "id" | "createdAt" | "updatedAt">): SubProgram {
    const newSubProgram: SubProgram = {
      ...subProgram,
      id: generateId("sub"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    subPrograms.push(newSubProgram);
    return newSubProgram;
  }

  updateSubProgram(id: string, updates: Partial<SubProgram>): SubProgram | null {
    const index = subPrograms.findIndex(sp => sp.id === id);
    if (index === -1) return null;
    
    subPrograms[index] = {
      ...subPrograms[index],
      ...updates,
      updatedAt: new Date(),
    };
    return subPrograms[index];
  }

  deleteSubProgram(id: string): boolean {
    const index = subPrograms.findIndex(sp => sp.id === id);
    if (index === -1) return false;
    subPrograms.splice(index, 1);
    return true;
  }

  // Students
  getStudents(): Student[] {
    return students;
  }

  getStudentById(id: string): Student | undefined {
    return students.find(s => s.id === id);
  }

  createStudent(student: Omit<Student, "id" | "createdAt" | "updatedAt">): Student {
    const newStudent: Student = {
      ...student,
      id: generateId("stu"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    students.push(newStudent);
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    students[index] = {
      ...students[index],
      ...updates,
      updatedAt: new Date(),
    };
    return students[index];
  }

  deleteStudent(id: string): boolean {
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return false;
    students.splice(index, 1);
    return true;
  }

  // Teachers
  getTeachers(): Teacher[] {
    return teachers;
  }

  getTeacherById(id: string): Teacher | undefined {
    return teachers.find(t => t.id === id);
  }

  // Orders
  getOrders(): Order[] {
    return orders;
  }

  getOrderById(id: string): Order | undefined {
    return orders.find(o => o.id === id);
  }

  createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
    const newOrder: Order = {
      ...order,
      id: generateId("ord"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    orders.push(newOrder);
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date(),
    };
    return orders[index];
  }

  // Reports
  getRoyaltyReports(): RoyaltyReportRow[] {
    return royaltyReports;
  }

  getStudentReports(): StudentReportRow[] {
    return studentReports;
  }

  // Dashboard
  getDashboardStats(): DashboardStats {
    return dashboardStats;
  }

  getRecentActivities(): RecentActivity[] {
    return recentActivities;
  }
}

// Export singleton instance
export const db = new MockDatabase();
