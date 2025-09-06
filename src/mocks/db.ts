import {
  Program,
  SubProgram,
  Student,
  Teacher,
  LearningGroup,
  Product,
  ProductList,
  ProductPrice,
  InventoryItem,
  Order,
  Training,
  TrainingType,
  TrainingRegistration,
  TeacherTrainerAccount,
  RoyaltyReportRow,
  StudentReportRow,
  DashboardStats,
  RecentActivity,
  Account,
  Application,
  RoyaltyCommissionCalculation,
  RoyaltyCommissionSummary,
  RoyaltyCommissionReport,
  StudentReportData,
  StudentReportFilter,
  GenericReportConfig,
  RoleBasedDashboard,
  DashboardMetrics,
  DashboardActivity,
  AuthUser,
  LoginCredentials,
  LoginResponse,
  AuthSession,
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
    education: [
      {
        degree: "PhD",
        institution: "Harvard University",
        graduationYear: 2008,
        fieldOfStudy: "English Literature",
      },
      {
        degree: "MA",
        institution: "Oxford University",
        graduationYear: 2005,
        fieldOfStudy: "Linguistics",
      },
    ],
    trainings: [
      {
        trainingId: "train_1",
        trainingName: "Advanced Teaching Methods",
        completedDate: "2024-01-15",
        status: "completed",
        certification: "Advanced Teaching Certificate",
      },
      {
        trainingId: "train_2",
        trainingName: "Digital Learning Tools",
        completedDate: "2024-02-20",
        status: "completed",
      },
      {
        trainingId: "train_3",
        trainingName: "Student Assessment Techniques",
        completedDate: "2024-03-10",
        status: "in_progress",
      },
    ],
    centers: [
      {
        centerId: "center_1",
        centerName: "Boston Learning Center",
        role: "Senior English Instructor",
        startDate: "2018-01-15",
        isActive: true,
      },
      {
        centerId: "center_2",
        centerName: "Cambridge Education Hub",
        role: "Literature Consultant",
        startDate: "2020-06-01",
        isActive: true,
      },
    ],
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
    education: [
      {
        degree: "PhD",
        institution: "MIT",
        graduationYear: 2011,
        fieldOfStudy: "Mathematics",
      },
      {
        degree: "MSc",
        institution: "Stanford University",
        graduationYear: 2009,
        fieldOfStudy: "Statistics",
      },
    ],
    trainings: [
      {
        trainingId: "train_1",
        trainingName: "Advanced Teaching Methods",
        completedDate: "2024-01-15",
        status: "completed",
        certification: "Advanced Teaching Certificate",
      },
      {
        trainingId: "train_4",
        trainingName: "Data Analysis Tools",
        completedDate: "2024-02-28",
        status: "completed",
      },
    ],
    centers: [
      {
        centerId: "center_3",
        centerName: "Seattle Math Academy",
        role: "Head of Mathematics Department",
        startDate: "2019-09-01",
        isActive: true,
      },
    ],
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
    education: [
      {
        degree: "PhD",
        institution: "Caltech",
        graduationYear: 2013,
        fieldOfStudy: "Physics",
      },
      {
        degree: "BSc",
        institution: "UC Berkeley",
        graduationYear: 2009,
        fieldOfStudy: "Chemistry",
      },
    ],
    trainings: [
      {
        trainingId: "train_5",
        trainingName: "Laboratory Safety Protocols",
        completedDate: "2024-01-30",
        status: "completed",
      },
      {
        trainingId: "train_6",
        trainingName: "Modern Physics Teaching",
        completedDate: "2024-03-15",
        status: "scheduled",
      },
    ],
    centers: [
      {
        centerId: "center_4",
        centerName: "Austin Science Center",
        role: "Physics Instructor",
        startDate: "2020-08-15",
        isActive: true,
      },
      {
        centerId: "center_5",
        centerName: "Texas Learning Hub",
        role: "Chemistry Lab Coordinator",
        startDate: "2021-01-10",
        endDate: "2023-12-31",
        isActive: false,
      },
    ],
    createdAt: createDate(80),
    updatedAt: createDate(2),
  },
  {
    id: generateId("tea"),
    firstName: "David",
    lastName: "Wilson",
    title: "Mr.",
    email: "david.wilson@example.com",
    phone: "+1-555-1004",
    specialization: ["Computer Science", "Programming"],
    experience: 8,
    qualifications: ["MS in Computer Science", "Software Engineering Certificate"],
    status: "on_leave",
    hourlyRate: 85,
    availability: [],
    bio: "Experienced software engineer turned educator, specializing in modern programming languages.",
    address: {
      street: "456 Tech Blvd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
    },
    education: [
      {
        degree: "MS",
        institution: "Stanford University",
        graduationYear: 2015,
        fieldOfStudy: "Computer Science",
      },
    ],
    trainings: [
      {
        trainingId: "train_7",
        trainingName: "Modern Programming Languages",
        completedDate: "2024-02-10",
        status: "completed",
      },
    ],
    centers: [
      {
        centerId: "center_6",
        centerName: "San Francisco Tech Academy",
        role: "Senior Programming Instructor",
        startDate: "2019-03-01",
        isActive: true,
      },
    ],
    createdAt: createDate(60),
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
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "12:00" },
    ],
    location: "Main Campus",
    notes: "Focus on advanced conversation skills",
    dates: {
      startDate: "2024-02-01",
      endDate: "2024-05-31",
      registrationDeadline: "2024-01-25",
      lastClassDate: "2024-05-29",
    },
    pricingSnapshot: {
      programPrice: 299.99,
      subProgramPrice: 149.99,
      totalPrice: 449.98,
      discount: 50.00,
      finalPrice: 399.98,
      currency: "USD",
    },
    owner: {
      id: "owner_1",
      name: "Dr. Sarah Wilson",
      role: "Program Director",
    },
    franchisee: {
      id: "franchisee_1",
      name: "Boston Learning Center",
      location: "Boston, MA",
    },
    students: [
      {
        studentId: students[0].id,
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        productId: "product_1",
        paymentStatus: "paid",
        enrollmentDate: "2024-01-15",
      },
      {
        studentId: students[1].id,
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        productId: "product_1",
        paymentStatus: "partial",
        enrollmentDate: "2024-01-20",
      },
    ],
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
      { dayOfWeek: 2, startTime: "14:00", endTime: "16:00" },
      { dayOfWeek: 4, startTime: "14:00", endTime: "16:00" },
    ],
    location: "Math Building",
    dates: {
      startDate: "2024-02-15",
      endDate: "2024-06-15",
      registrationDeadline: "2024-02-10",
      lastClassDate: "2024-06-13",
    },
    pricingSnapshot: {
      programPrice: 199.99,
      subProgramPrice: 99.99,
      totalPrice: 299.98,
      finalPrice: 299.98,
      currency: "USD",
    },
    owner: {
      id: "owner_2",
      name: "Prof. Michael Brown",
      role: "Mathematics Coordinator",
    },
    franchisee: {
      id: "franchisee_2",
      name: "Seattle Math Academy",
      location: "Seattle, WA",
    },
    students: [
      {
        studentId: students[0].id,
        startDate: "2024-02-15",
        endDate: "2024-06-15",
        productId: "product_2",
        paymentStatus: "paid",
        enrollmentDate: "2024-02-01",
      },
    ],
    createdAt: createDate(25),
    updatedAt: createDate(3),
  },
  {
    id: generateId("lg"),
    name: "Physics Lab Group",
    description: "Hands-on physics experiments and theory",
    programId: programs[2].id,
    subProgramId: subPrograms[3].id,
    teacherId: teachers[2].id,
    studentIds: [students[4].id],
    maxStudents: 12,
    status: "completed",
    startDate: createDate(90),
    endDate: createDate(30),
    schedule: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
      { dayOfWeek: 5, startTime: "10:00", endTime: "12:00" },
    ],
    location: "Physics Lab",
    notes: "Advanced physics concepts with practical experiments",
    dates: {
      startDate: "2023-09-01",
      endDate: "2023-12-15",
      registrationDeadline: "2023-08-25",
      lastClassDate: "2023-12-13",
    },
    pricingSnapshot: {
      programPrice: 399.99,
      subProgramPrice: 199.99,
      totalPrice: 599.98,
      discount: 100.00,
      finalPrice: 499.98,
      currency: "USD",
    },
    owner: {
      id: "owner_3",
      name: "Dr. Emily Davis",
      role: "Physics Department Head",
    },
    franchisee: {
      id: "franchisee_3",
      name: "Austin Science Center",
      location: "Austin, TX",
    },
    students: [
      {
        studentId: students[4].id,
        startDate: "2023-09-01",
        endDate: "2023-12-15",
        productId: "product_3",
        paymentStatus: "paid",
        enrollmentDate: "2023-08-20",
      },
    ],
    createdAt: createDate(90),
    updatedAt: createDate(30),
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
    code: "EGW-001",
    qty: 150,
    minStock: 10,
    maxStock: 200,
    unit: "pieces",
    supplier: "Educational Books Inc.",
    markup: 100,
    sellingPrice: 29.99,
    productLists: ["list_1", "list_2"],
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
    code: "MC-001",
    qty: 75,
    minStock: 15,
    maxStock: 150,
    unit: "pieces",
    supplier: "Tech Supplies Ltd.",
    markup: 100,
    sellingPrice: 89.99,
    productLists: ["list_1", "list_3"],
    createdAt: createDate(45),
    updatedAt: createDate(5),
  },
  {
    id: generateId("prod"),
    name: "Physics Lab Kit",
    description: "Complete physics experiment kit for hands-on learning",
    category: "Equipment",
    sku: "PLK-001",
    price: 149.99,
    cost: 75.00,
    status: "active",
    tags: ["physics", "lab", "equipment"],
    images: ["physics-kit.jpg"],
    specifications: {
      weight: "2.5kg",
      experiments: 15,
      level: "Advanced",
    },
    code: "PLK-001",
    qty: 25,
    minStock: 5,
    maxStock: 50,
    unit: "kits",
    supplier: "Science Equipment Co.",
    markup: 100,
    sellingPrice: 149.99,
    productLists: ["list_2", "list_3"],
    createdAt: createDate(30),
    updatedAt: createDate(2),
  },
  {
    id: generateId("prod"),
    name: "Chemistry Test Tubes Set",
    description: "Set of 12 glass test tubes with rack",
    category: "Equipment",
    sku: "CTT-001",
    price: 24.99,
    cost: 12.00,
    status: "active",
    tags: ["chemistry", "test-tubes", "glassware"],
    images: ["test-tubes.jpg"],
    specifications: {
      count: 12,
      material: "borosilicate glass",
      capacity: "15ml each",
    },
    code: "CTT-001",
    qty: 50,
    minStock: 10,
    maxStock: 100,
    unit: "sets",
    supplier: "Lab Supplies Inc.",
    markup: 108,
    sellingPrice: 24.99,
    productLists: ["list_2"],
    createdAt: createDate(20),
    updatedAt: createDate(1),
  },
];

// Seed data for Product Lists
export const productLists: ProductList[] = [
  {
    id: "list_1",
    name: "Essential Learning Materials",
    description: "Core educational materials for all programs",
    status: "active",
    createdBy: "user_1",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    products: [
      {
        productId: products[0].id,
        sellingPrice: 29.99,
        finalPrice: 29.99,
      },
      {
        productId: products[1].id,
        sellingPrice: 89.99,
        finalPrice: 89.99,
      },
    ],
    createdAt: createDate(50),
    updatedAt: createDate(10),
  },
  {
    id: "list_2",
    name: "Science Equipment Bundle",
    description: "Complete science laboratory equipment",
    status: "active",
    createdBy: "user_1",
    sharedWithMFs: ["mf_region_1", "mf_region_3"],
    visibility: "shared",
    products: [
      {
        productId: products[0].id,
        sellingPrice: 29.99,
        finalPrice: 29.99,
      },
      {
        productId: products[2].id,
        sellingPrice: 149.99,
        finalPrice: 149.99,
      },
      {
        productId: products[3].id,
        sellingPrice: 24.99,
        finalPrice: 24.99,
      },
    ],
    createdAt: createDate(40),
    updatedAt: createDate(8),
  },
  {
    id: "list_3",
    name: "Advanced Study Materials",
    description: "Advanced materials for specialized programs",
    status: "active",
    createdBy: "user_1",
    sharedWithMFs: ["mf_region_2", "mf_region_3"],
    visibility: "shared",
    products: [
      {
        productId: products[1].id,
        sellingPrice: 89.99,
        finalPrice: 89.99,
      },
      {
        productId: products[2].id,
        sellingPrice: 149.99,
        finalPrice: 149.99,
      },
    ],
    createdAt: createDate(35),
    updatedAt: createDate(6),
  },
];

// Seed data for Product Prices
export const productPrices: ProductPrice[] = [
  {
    id: generateId("price"),
    productId: products[0].id,
    productListId: "list_1",
    mfId: "mf_region_1",
    lcId: "lc_region_1",
    basePrice: 29.99,
    markup: 15,
    finalPrice: 34.49,
    status: "active",
    createdAt: createDate(30),
    updatedAt: createDate(5),
  },
  {
    id: generateId("price"),
    productId: products[1].id,
    productListId: "list_1",
    mfId: "mf_region_1",
    lcId: "lc_region_1",
    basePrice: 89.99,
    markup: 20,
    finalPrice: 107.99,
    status: "active",
    createdAt: createDate(25),
    updatedAt: createDate(4),
  },
  {
    id: generateId("price"),
    productId: products[0].id,
    productListId: "list_1",
    mfId: "mf_region_2",
    lcId: "lc_region_2",
    basePrice: 29.99,
    markup: 10,
    finalPrice: 32.99,
    status: "active",
    createdAt: createDate(20),
    updatedAt: createDate(3),
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
    orderType: "lc_to_student",
    fromEntity: {
      id: "lc_region_1",
      name: "Boston Learning Center",
      type: "LC",
    },
    toEntity: {
      id: students[0].id,
      name: `${students[0].firstName} ${students[0].lastName}`,
      type: "LC",
    },
    isConsolidated: false,
    priority: "medium",
    expectedDeliveryDate: createDate(18),
    actualDeliveryDate: createDate(15),
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
    orderType: "lc_to_student",
    fromEntity: {
      id: "lc_region_2",
      name: "Seattle Learning Center",
      type: "LC",
    },
    toEntity: {
      id: students[1].id,
      name: `${students[1].firstName} ${students[1].lastName}`,
      type: "LC",
    },
    isConsolidated: false,
    priority: "low",
    expectedDeliveryDate: createDate(10),
    createdAt: createDate(5),
    updatedAt: createDate(5),
  },
  {
    id: generateId("ord"),
    orderNumber: "ORD-2024-003",
    studentId: "mf_region_1",
    items: [
      {
        productId: products[0].id,
        quantity: 50,
        unitPrice: 29.99,
        totalPrice: 1499.50,
      },
      {
        productId: products[1].id,
        quantity: 25,
        unitPrice: 89.99,
        totalPrice: 2249.75,
      },
    ],
    status: "processing",
    subtotal: 3749.25,
    tax: 299.94,
    discount: 0,
    total: 4049.19,
    paymentStatus: "paid",
    paymentMethod: "Bank Transfer",
    shippingAddress: {
      street: "123 Business Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    billingAddress: {
      street: "123 Business Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    processedBy: "user_1",
    orderType: "hq_to_mf",
    fromEntity: {
      id: "hq_main",
      name: "Headquarters",
      type: "HQ",
    },
    toEntity: {
      id: "mf_region_1",
      name: "Boston MF Region",
      type: "MF",
    },
    isConsolidated: false,
    priority: "high",
    expectedDeliveryDate: createDate(12),
    createdAt: createDate(8),
    updatedAt: createDate(6),
  },
  {
    id: generateId("ord"),
    orderNumber: "ORD-2024-004",
    studentId: "lc_region_1",
    items: [
      {
        productId: products[0].id,
        quantity: 20,
        unitPrice: 34.49,
        totalPrice: 689.80,
      },
    ],
    status: "confirmed",
    subtotal: 689.80,
    tax: 55.18,
    discount: 0,
    total: 744.98,
    paymentStatus: "pending",
    shippingAddress: {
      street: "456 Learning St",
      city: "Boston",
      state: "MA",
      zipCode: "02102",
      country: "USA",
    },
    billingAddress: {
      street: "456 Learning St",
      city: "Boston",
      state: "MA",
      zipCode: "02102",
      country: "USA",
    },
    orderType: "mf_to_lc",
    fromEntity: {
      id: "mf_region_1",
      name: "Boston MF Region",
      type: "MF",
    },
    toEntity: {
      id: "lc_region_1",
      name: "Boston Learning Center",
      type: "LC",
    },
    isConsolidated: false,
    priority: "medium",
    expectedDeliveryDate: createDate(7),
    createdAt: createDate(3),
    updatedAt: createDate(2),
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
    recordType: "mandatory",
    seminarType: "in_person",
    createdBy: "user_1",
    isActive: true,
    requirements: ["Teaching experience", "Bachelor's degree"],
    certification: {
      required: true,
      validityPeriod: 24,
      renewalRequired: true,
    },
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
    recordType: "optional",
    seminarType: "virtual",
    createdBy: "user_1",
    isActive: true,
    requirements: ["Basic computer skills"],
    certification: {
      required: false,
      validityPeriod: 12,
      renewalRequired: false,
    },
    createdAt: createDate(60),
    updatedAt: createDate(15),
  },
  {
    id: generateId("tt"),
    name: "Advanced Assessment Techniques",
    description: "Comprehensive training on modern assessment methods",
    category: "Assessment",
    duration: 4,
    prerequisites: ["Teaching Methodology certification"],
    objectives: ["Formative assessment", "Summative assessment", "Rubric design"],
    materials: ["Assessment templates", "Sample rubrics", "Case studies"],
    isRecurring: true,
    frequency: "quarterly",
    recordType: "certification",
    seminarType: "hybrid",
    createdBy: "user_1",
    isActive: true,
    requirements: ["Teaching Methodology certification"],
    certification: {
      required: true,
      validityPeriod: 36,
      renewalRequired: true,
    },
    createdAt: createDate(45),
    updatedAt: createDate(10),
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
    recordType: "mandatory",
    seminarType: "in_person",
    name: "Teaching Methodology Workshop - March 2024",
    owner: {
      id: "user_1",
      name: "HQ Admin",
      role: "HQ",
    },
    hostingFranchisee: {
      id: "mf_region_1",
      name: "Boston MF Region",
      location: "Boston, MA",
    },
    start: createDate(30),
    end: createDate(30),
    max: 20,
    venue: {
      name: "Boston Learning Center",
      address: "123 Education St, Boston, MA 02101",
      capacity: 25,
      facilities: ["Projector", "Whiteboard", "WiFi", "Parking"],
    },
    price: {
      amount: 150,
      currency: "USD",
      includes: ["Materials", "Lunch", "Certificate"],
    },
    teacherTrainer: {
      id: "tt_1",
      name: "Dr. Sarah Wilson",
      role: "primary",
    },
    assistant: {
      id: "tt_2",
      name: "Prof. Michael Brown",
    },
    ttStatus: "completed",
    ttComments: "All participants successfully completed the training with excellent performance.",
    details: {
      agenda: "Comprehensive 8-hour workshop covering modern teaching methodologies, classroom management, and student engagement techniques.",
      materials: ["Presentation slides", "Workbooks", "Assessment forms", "Certificate templates"],
      prerequisites: ["Teaching experience", "Bachelor's degree"],
      objectives: ["Improve teaching skills", "Classroom management", "Student engagement"],
      assessment: "Written test and practical demonstration of teaching techniques.",
    },
    approvalStatus: "approved",
    submittedBy: "user_1",
    approvedBy: "user_1",
    submittedAt: createDate(35),
    approvedAt: createDate(34),
    registrations: [
      {
        id: generateId("reg"),
        trainingId: "train_1",
        teacherId: teachers[1].id,
        registeredBy: "mf_region_1",
        registrationDate: createDate(32),
        status: "completed",
        attendance: {
          present: true,
          checkInTime: createDate(30),
          checkOutTime: createDate(30),
        },
        assessment: {
          score: 85,
          maxScore: 100,
          passed: true,
          feedback: "Excellent performance in both written and practical assessments.",
          gradedBy: "tt_1",
          gradedAt: createDate(29),
        },
        certificate: {
          issued: true,
          certificateId: "CERT-TM-2024-001",
          issuedAt: createDate(29),
          validUntil: createDate(26),
        },
        createdAt: createDate(32),
        updatedAt: createDate(29),
      },
    ],
    createdAt: createDate(35),
    updatedAt: createDate(29),
  },
  {
    id: generateId("train"),
    title: "Technology Integration Training",
    description: "Virtual training on using technology in education",
    typeId: trainingTypes[1].id,
    instructorId: teachers[2].id,
    participantIds: [teachers[0].id],
    maxParticipants: 15,
    status: "scheduled",
    startDate: createDate(10),
    endDate: createDate(10),
    duration: 6,
    location: "Virtual - Zoom",
    materials: ["Software licenses", "Tutorials"],
    objectives: ["Digital tools", "Online platforms"],
    agenda: [
      { time: "10:00", title: "Introduction", description: "Welcome and setup", duration: 30 },
      { time: "10:30", title: "Digital Tools", description: "Overview of educational software", duration: 120 },
      { time: "12:30", title: "Break", description: "Lunch break", duration: 60 },
      { time: "13:30", title: "Online Platforms", description: "Learning management systems", duration: 120 },
    ],
    recordType: "optional",
    seminarType: "virtual",
    name: "Technology Integration - April 2024",
    owner: {
      id: "mf_region_1",
      name: "Boston MF Region",
      role: "MF",
    },
    hostingFranchisee: {
      id: "mf_region_1",
      name: "Boston MF Region",
      location: "Boston, MA",
    },
    start: createDate(10),
    end: createDate(10),
    max: 15,
    venue: {
      name: "Virtual Training Room",
      address: "Online - Zoom Meeting",
      capacity: 50,
      facilities: ["Screen sharing", "Breakout rooms", "Recording"],
    },
    price: {
      amount: 75,
      currency: "USD",
      includes: ["Software access", "Digital materials"],
    },
    teacherTrainer: {
      id: "tt_3",
      name: "Dr. Emily Davis",
      role: "primary",
    },
    ttStatus: "pending",
    details: {
      agenda: "6-hour virtual training covering digital tools and online platforms for education.",
      materials: ["Software licenses", "Tutorials", "Digital handouts"],
      prerequisites: ["Basic computer skills"],
      objectives: ["Digital tools", "Online platforms", "Interactive content"],
      assessment: "Practical demonstration of using educational technology tools.",
    },
    approvalStatus: "submitted",
    submittedBy: "mf_region_1",
    submittedAt: createDate(15),
    registrations: [
      {
        id: generateId("reg"),
        trainingId: "train_2",
        teacherId: teachers[0].id,
        registeredBy: "mf_region_1",
        registrationDate: createDate(12),
        status: "registered",
        attendance: {
          present: false,
        },
        assessment: {
          passed: false,
        },
        createdAt: createDate(12),
        updatedAt: createDate(12),
      },
    ],
    createdAt: createDate(15),
    updatedAt: createDate(12),
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
  {
    id: "tt_1",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1-555-0101",
    role: "TT",
    status: "active",
    permissions: [
      { resource: "trainings", actions: ["read", "update"] },
      { resource: "assessments", actions: ["create", "read", "update"] },
    ],
    lastLogin: createDate(15),
    profile: {
      bio: "Experienced teacher trainer with 10+ years in education",
      specialization: ["Teaching Methodology", "Classroom Management", "Assessment Design"],
      experience: 10,
      qualifications: ["PhD in Education", "Master's in Curriculum Design"],
      certifications: ["Certified Teacher Trainer", "Assessment Specialist"],
      languages: ["English", "Spanish"],
      timezone: "EST",
      avatar: "/avatars/sarah-wilson.jpg",
    },
    createdAt: createDate(365),
    updatedAt: createDate(15),
  },
  {
    id: "tt_2",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    phone: "+1-555-0102",
    role: "TT",
    status: "active",
    permissions: [
      { resource: "trainings", actions: ["read", "update"] },
      { resource: "assessments", actions: ["create", "read", "update"] },
    ],
    lastLogin: createDate(14),
    profile: {
      bio: "Technology integration specialist and teacher trainer",
      specialization: ["Technology Integration", "Digital Learning", "Online Teaching"],
      experience: 8,
      qualifications: ["Master's in Educational Technology", "Bachelor's in Computer Science"],
      certifications: ["Google Certified Educator", "Microsoft Innovative Educator"],
      languages: ["English", "French"],
      timezone: "PST",
    },
    createdAt: createDate(300),
    updatedAt: createDate(14),
  },
  {
    id: "tt_3",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    phone: "+1-555-0103",
    role: "TT",
    status: "inactive",
    permissions: [
      { resource: "trainings", actions: ["read"] },
    ],
    lastLogin: createDate(90),
    profile: {
      bio: "Special education teacher trainer",
      specialization: ["Special Education", "Inclusive Teaching", "Behavioral Management"],
      experience: 12,
      qualifications: ["Master's in Special Education", "PhD in Educational Psychology"],
      certifications: ["Special Education Specialist", "Behavioral Analyst"],
      languages: ["English", "ASL"],
      timezone: "CST",
    },
    createdAt: createDate(180),
    updatedAt: createDate(90),
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
// Seed data for Accounts
export const accounts: Account[] = [
  {
    id: "acc_1",
    name: "Boston MF Region",
    type: "MF",
    status: "active",
    contactInfo: {
      email: "contact@bostonmf.com",
      phone: "+1-555-0100",
      address: {
        street: "123 Education St",
        city: "Boston",
        state: "MA",
        zipCode: "02101",
        country: "USA",
      },
    },
    businessInfo: {
      businessName: "Boston Educational Services LLC",
      taxId: "12-3456789",
      registrationNumber: "REG-2023-001",
      establishedDate: new Date("2023-01-15"),
    },
    owner: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@bostonmf.com",
      phone: "+1-555-0101",
      title: "Regional Manager",
    },
    permissions: [
      { resource: "programs", actions: ["read", "write"] },
      { resource: "students", actions: ["read", "write"] },
      { resource: "teachers", actions: ["read", "write"] },
    ],
    lastLogin: new Date("2024-01-15"),
    createdBy: "user_1",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "acc_2",
    name: "Boston Learning Center",
    type: "LC",
    status: "active",
    contactInfo: {
      email: "contact@bostonlc.com",
      phone: "+1-555-0200",
      address: {
        street: "456 Learning Ave",
        city: "Boston",
        state: "MA",
        zipCode: "02102",
        country: "USA",
      },
    },
    businessInfo: {
      businessName: "Boston Learning Center Inc",
      taxId: "98-7654321",
      registrationNumber: "REG-2023-002",
      establishedDate: new Date("2023-02-01"),
    },
    owner: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@bostonlc.com",
      phone: "+1-555-0201",
      title: "Center Director",
    },
    permissions: [
      { resource: "students", actions: ["read", "write"] },
      { resource: "teachers", actions: ["read", "write"] },
      { resource: "orders", actions: ["read", "write"] },
    ],
    lastLogin: new Date("2024-01-14"),
    createdBy: "user_1",
    parentAccountId: "acc_1",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2024-01-14"),
  },
];

// Seed data for Applications
export const applications: Application[] = [
  {
    id: "app_1",
    applicantInfo: {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@newcenter.com",
      phone: "+1-555-0300",
      title: "Owner",
      company: "New Learning Center",
      website: "https://newcenter.com",
      address: {
        street: "789 Education Blvd",
        city: "Cambridge",
        state: "MA",
        zipCode: "02139",
        country: "USA",
      },
    },
    businessInfo: {
      businessName: "New Learning Center LLC",
      taxId: "11-2233445",
      registrationNumber: "REG-2024-001",
      establishedDate: new Date("2024-01-01"),
      businessType: "Educational Services",
      numberOfEmployees: 5,
      annualRevenue: 500000,
    },
    applicationType: "LC",
    status: "new",
    studentGoals: {
      year1: {
        targetStudents: 50,
        programs: ["English Grammar", "Mathematics"],
        revenue: 75000,
        milestones: ["Complete setup", "Hire 2 teachers", "Launch marketing"],
      },
      year2: {
        targetStudents: 100,
        programs: ["English Grammar", "Mathematics", "Science"],
        revenue: 150000,
        milestones: ["Expand to 2 locations", "Add science program"],
      },
      year3: {
        targetStudents: 150,
        programs: ["English Grammar", "Mathematics", "Science", "Computer Skills"],
        revenue: 225000,
        milestones: ["Add computer skills program", "Hire 5 more teachers"],
      },
      year4: {
        targetStudents: 200,
        programs: ["English Grammar", "Mathematics", "Science", "Computer Skills", "Business English"],
        revenue: 300000,
        milestones: ["Add business English", "Expand to 3 locations"],
      },
    },
    documents: {
      businessLicense: "license_2024_001.pdf",
      taxCertificate: "tax_cert_2024_001.pdf",
      financialStatements: ["financial_2023.pdf", "financial_2024_q1.pdf"],
      marketingPlan: "marketing_plan_2024.pdf",
      otherDocuments: ["insurance_cert.pdf", "facility_lease.pdf"],
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "app_2",
    applicantInfo: {
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@regionmf.com",
      phone: "+1-555-0400",
      title: "CEO",
      company: "Regional MF Services",
      website: "https://regionmf.com",
      address: {
        street: "321 Business Park",
        city: "Worcester",
        state: "MA",
        zipCode: "01608",
        country: "USA",
      },
    },
    businessInfo: {
      businessName: "Regional MF Services Inc",
      taxId: "22-3344556",
      registrationNumber: "REG-2024-002",
      establishedDate: new Date("2023-12-01"),
      businessType: "Educational Franchise",
      numberOfEmployees: 15,
      annualRevenue: 2000000,
    },
    applicationType: "MF",
    status: "under_review",
    studentGoals: {
      year1: {
        targetStudents: 500,
        programs: ["All Programs"],
        revenue: 750000,
        milestones: ["Setup 5 learning centers", "Hire regional team"],
      },
      year2: {
        targetStudents: 1000,
        programs: ["All Programs"],
        revenue: 1500000,
        milestones: ["Expand to 10 centers", "Add specialized programs"],
      },
      year3: {
        targetStudents: 1500,
        programs: ["All Programs"],
        revenue: 2250000,
        milestones: ["Expand to 15 centers", "Launch online programs"],
      },
      year4: {
        targetStudents: 2000,
        programs: ["All Programs"],
        revenue: 3000000,
        milestones: ["Expand to 20 centers", "Launch corporate training"],
      },
    },
    documents: {
      businessLicense: "license_2024_002.pdf",
      taxCertificate: "tax_cert_2024_002.pdf",
      financialStatements: ["financial_2023.pdf", "financial_2024_q1.pdf"],
      marketingPlan: "marketing_plan_2024_mf.pdf",
      otherDocuments: ["insurance_cert.pdf", "facility_plans.pdf", "team_resumes.pdf"],
    },
    reviewInfo: {
      reviewedBy: "user_1",
      reviewedAt: new Date("2024-01-12"),
      comments: "Application looks strong. Need to verify financial statements and facility plans.",
      decision: "approved",
      conditions: ["Verify financial statements", "Confirm facility locations"],
    },
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-12"),
  },
];

// Seed data for Royalty Calculations
export const royaltyCalculations: RoyaltyCommissionCalculation[] = [
  {
    id: "lc_calc_1",
    period: {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      type: "monthly",
    },
    lcId: "acc_2",
    lcName: "Boston Learning Center",
    mfId: "acc_1",
    mfName: "Boston MF Region",
    studentCount: 120,
    revenue: 180000,
    lcToMfCommission: {
      first100Students: {
        count: 100,
        rate: 0.14,
        amount: 14000,
      },
      beyond100Students: {
        count: 20,
        rate: 0.12,
        amount: 2400,
      },
      total: 16400,
    },
    mfToHqCommission: {
      collectedFromLc: 16400,
      rate: 0.5,
      amount: 8200,
    },
    status: "calculated",
    calculatedAt: new Date("2024-02-01"),
  },
  {
    id: "lc_calc_2",
    period: {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      type: "monthly",
    },
    lcId: "acc_3",
    lcName: "Cambridge Learning Center",
    mfId: "acc_1",
    mfName: "Boston MF Region",
    studentCount: 100,
    revenue: 150000,
    lcToMfCommission: {
      first100Students: {
        count: 100,
        rate: 0.14,
        amount: 14000,
      },
      beyond100Students: {
        count: 0,
        rate: 0.12,
        amount: 0,
      },
      total: 14000,
    },
    mfToHqCommission: {
      collectedFromLc: 14000,
      rate: 0.5,
      amount: 7000,
    },
    status: "calculated",
    calculatedAt: new Date("2024-02-01"),
  },
];

// Seed data for Royalty Summaries
export const royaltySummaries: RoyaltyCommissionSummary[] = [
  {
    id: "mf_summary_1",
    period: {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      type: "monthly",
    },
    mfId: "acc_1",
    mfName: "Boston MF Region",
    totalLcCount: 3,
    totalStudentCount: 280,
    totalRevenue: 420000,
    totalLcToMfCommission: 50400,
    totalMfToHqCommission: 25200,
    lcBreakdown: [
      {
        lcId: "acc_2",
        lcName: "Boston Learning Center",
        studentCount: 120,
        revenue: 180000,
        lcToMfCommission: 21600,
      },
      {
        lcId: "acc_3",
        lcName: "Cambridge Learning Center",
        studentCount: 100,
        revenue: 150000,
        lcToMfCommission: 18000,
      },
      {
        lcId: "acc_4",
        lcName: "Somerville Learning Center",
        studentCount: 60,
        revenue: 90000,
        lcToMfCommission: 10800,
      },
    ],
    status: "calculated",
    calculatedAt: new Date("2024-02-01"),
  },
  {
    id: "mf_summary_2",
    period: {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      type: "monthly",
    },
    mfId: "acc_5",
    mfName: "Worcester MF Region",
    totalLcCount: 2,
    totalStudentCount: 170,
    totalRevenue: 255000,
    totalLcToMfCommission: 30600,
    totalMfToHqCommission: 15300,
    lcBreakdown: [
      {
        lcId: "acc_6",
        lcName: "Worcester Learning Center",
        studentCount: 100,
        revenue: 150000,
        lcToMfCommission: 18000,
      },
      {
        lcId: "acc_7",
        lcName: "Springfield Learning Center",
        studentCount: 70,
        revenue: 105000,
        lcToMfCommission: 12600,
      },
    ],
    status: "calculated",
    calculatedAt: new Date("2024-02-01"),
  },
];

// Seed data for Royalty Reports
export const royaltyCommissionReports: RoyaltyCommissionReport[] = [
  {
    id: "royalty_2024_01",
    period: {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      type: "monthly",
    },
    generatedAt: new Date("2024-02-01"),
    generatedBy: "user_1",
    totalMfCount: 2,
    totalLcCount: 5,
    totalStudentCount: 450,
    totalRevenue: 675000,
    totalLcToMfCommission: 81000,
    totalMfToHqCommission: 40500,
    mfSummaries: royaltySummaries,
    lcCalculations: royaltyCalculations,
  },
];

// Seed data for Student Reports
export const studentReportData: StudentReportData[] = [
  {
    id: "sr_1",
    studentId: "STU001",
    studentName: "Alice Johnson",
    age: 25,
    country: "USA",
    city: "Boston",
    lcId: "acc_2",
    lcName: "Boston Learning Center",
    programId: "prog_1",
    programName: "English Language Program",
    subProgramId: "sub_1",
    subProgramName: "Business English",
    enrollmentDate: new Date("2024-01-15"),
    graduationDate: undefined,
    status: "active",
    totalHours: 120,
    completedHours: 45,
    progress: 37.5,
    currentGroupId: "lg_1",
    currentGroupName: "Business English Group A",
    teacherId: "teach_1",
    teacherName: "Sarah Wilson",
    totalPaid: 1200,
    totalDue: 800,
    lastPaymentDate: new Date("2024-01-20"),
    notes: "Excellent progress, very motivated",
  },
  {
    id: "sr_2",
    studentId: "STU002",
    studentName: "Bob Smith",
    age: 32,
    country: "USA",
    city: "Cambridge",
    lcId: "acc_3",
    lcName: "Cambridge Learning Center",
    programId: "prog_2",
    programName: "Spanish Language Program",
    subProgramId: "sub_2",
    subProgramName: "Conversational Spanish",
    enrollmentDate: new Date("2023-11-10"),
    graduationDate: new Date("2024-02-15"),
    status: "graduated",
    totalHours: 80,
    completedHours: 80,
    progress: 100,
    currentGroupId: undefined,
    currentGroupName: undefined,
    teacherId: "teach_2",
    teacherName: "Maria Garcia",
    totalPaid: 1600,
    totalDue: 0,
    lastPaymentDate: new Date("2024-01-15"),
    notes: "Completed with distinction",
  },
  {
    id: "sr_3",
    studentId: "STU003",
    studentName: "Carol Davis",
    age: 28,
    country: "Canada",
    city: "Toronto",
    lcId: "acc_4",
    lcName: "Somerville Learning Center",
    programId: "prog_1",
    programName: "English Language Program",
    subProgramId: "sub_3",
    subProgramName: "Academic English",
    enrollmentDate: new Date("2024-02-01"),
    graduationDate: undefined,
    status: "active",
    totalHours: 100,
    completedHours: 20,
    progress: 20,
    currentGroupId: "lg_2",
    currentGroupName: "Academic English Group B",
    teacherId: "teach_3",
    teacherName: "John Brown",
    totalPaid: 600,
    totalDue: 1400,
    lastPaymentDate: new Date("2024-02-05"),
    notes: "New student, adjusting well",
  },
  {
    id: "sr_4",
    studentId: "STU004",
    studentName: "David Wilson",
    age: 35,
    country: "USA",
    city: "Boston",
    lcId: "acc_2",
    lcName: "Boston Learning Center",
    programId: "prog_3",
    programName: "French Language Program",
    subProgramId: "sub_4",
    subProgramName: "French for Travel",
    enrollmentDate: new Date("2023-09-15"),
    graduationDate: undefined,
    status: "inactive",
    totalHours: 60,
    completedHours: 30,
    progress: 50,
    currentGroupId: undefined,
    currentGroupName: undefined,
    teacherId: "teach_4",
    teacherName: "Pierre Dubois",
    totalPaid: 900,
    totalDue: 300,
    lastPaymentDate: new Date("2023-12-10"),
    notes: "On hold due to work commitments",
  },
];

// Seed data for Generic Report Configs
export const genericReportConfigs: GenericReportConfig[] = [
  {
    id: "config_1",
    name: "Active Students Report",
    description: "Report showing all active students with their progress and payment status",
    entityType: "students",
    filters: {
      status: "active",
    },
    columns: [
      { key: "studentName", label: "Student Name", visible: true, sortable: true, filterable: true },
      { key: "studentId", label: "Student ID", visible: true, sortable: true, filterable: true },
      { key: "programName", label: "Program", visible: true, sortable: true, filterable: true },
      { key: "progress", label: "Progress", visible: true, sortable: true, filterable: true },
      { key: "totalPaid", label: "Total Paid", visible: true, sortable: true, filterable: true },
    ],
    sorting: {
      column: "studentName",
      direction: "asc",
    },
    createdBy: "user_1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "config_2",
    name: "Training Completion Report",
    description: "Report showing training completion rates and participant details",
    entityType: "trainings",
    filters: {
      status: "completed",
    },
    columns: [
      { key: "name", label: "Training Name", visible: true, sortable: true, filterable: true },
      { key: "type", label: "Type", visible: true, sortable: true, filterable: true },
      { key: "startDate", label: "Start Date", visible: true, sortable: true, filterable: true },
      { key: "endDate", label: "End Date", visible: true, sortable: true, filterable: true },
      { key: "maxParticipants", label: "Max Participants", visible: true, sortable: true, filterable: true },
    ],
    sorting: {
      column: "startDate",
      direction: "desc",
    },
    createdBy: "user_1",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
];

// Authentication Data
export const authUsers: AuthUser[] = [
  // HQ Users
  {
    id: "user_hq_1",
    email: "admin@iqup.com",
    name: "HQ Administrator",
    role: "HQ",
    password: "admin123", // In real app, this would be hashed
    isActive: true,
    lastLogin: new Date("2024-01-20T08:00:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
    scopeId: "hq_global",
    permissions: ["*"], // All permissions
  },
  {
    id: "user_hq_2",
    email: "hq.manager@iqup.com",
    name: "HQ Manager",
    role: "HQ",
    password: "hq123",
    isActive: true,
    lastLogin: new Date("2024-01-19T16:30:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-19"),
    scopeId: "hq_north_america",
    permissions: ["programs:read", "programs:write", "reports:read", "accounts:read"],
  },

  // MF Users
  {
    id: "user_mf_1",
    email: "mf.region1@iqup.com",
    name: "Region 1 Manager",
    role: "MF",
    password: "mf123",
    isActive: true,
    lastLogin: new Date("2024-01-20T09:15:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
    scopeId: "mf_region_1",
    permissions: ["subprograms:read", "subprograms:write", "orders:read", "orders:write", "trainings:read", "trainings:write"],
  },
  {
    id: "user_mf_2",
    email: "mf.region2@iqup.com",
    name: "Region 2 Manager",
    role: "MF",
    password: "mf123",
    isActive: true,
    lastLogin: new Date("2024-01-19T14:20:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-19"),
    scopeId: "mf_region_2",
    permissions: ["subprograms:read", "subprograms:write", "orders:read", "orders:write", "trainings:read", "trainings:write"],
  },

  // LC Users
  {
    id: "user_lc_1",
    email: "lc.nyc@iqup.com",
    name: "NYC Learning Center Coordinator",
    role: "LC",
    password: "lc123",
    isActive: true,
    lastLogin: new Date("2024-01-20T10:45:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
    scopeId: "lc_center_nyc",
    permissions: ["students:read", "students:write", "learning-groups:read", "learning-groups:write", "orders:read"],
  },
  {
    id: "user_lc_2",
    email: "lc.la@iqup.com",
    name: "LA Learning Center Coordinator",
    role: "LC",
    password: "lc123",
    isActive: true,
    lastLogin: new Date("2024-01-19T15:30:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-19"),
    scopeId: "lc_center_la",
    permissions: ["students:read", "students:write", "learning-groups:read", "learning-groups:write", "orders:read"],
  },
  {
    id: "user_lc_3",
    email: "lc.chicago@iqup.com",
    name: "Chicago Learning Center Coordinator",
    role: "LC",
    password: "lc123",
    isActive: true,
    lastLogin: new Date("2024-01-18T11:20:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-18"),
    scopeId: "lc_center_chicago",
    permissions: ["students:read", "students:write", "learning-groups:read", "learning-groups:write", "orders:read"],
  },

  // TT Users
  {
    id: "user_tt_1",
    email: "tt.trainer1@iqup.com",
    name: "Senior Teacher Trainer",
    role: "TT",
    password: "tt123",
    isActive: true,
    lastLogin: new Date("2024-01-20T13:15:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
    scopeId: "tt_training_center",
    permissions: ["trainings:read", "trainings:write", "teachers:read", "certificates:write"],
  },
  {
    id: "user_tt_2",
    email: "tt.online@iqup.com",
    name: "Online Training Specialist",
    role: "TT",
    password: "tt123",
    isActive: true,
    lastLogin: new Date("2024-01-19T16:45:00"),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-19"),
    scopeId: "tt_online_platform",
    permissions: ["trainings:read", "trainings:write", "teachers:read", "certificates:write"],
  },

  // Inactive user for testing
  {
    id: "user_inactive",
    email: "inactive@iqup.com",
    name: "Inactive User",
    role: "LC",
    password: "inactive123",
    isActive: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    scopeId: "lc_center_nyc",
    permissions: [],
  },
];

// Dashboard Data
export const dashboardData: Record<string, RoleBasedDashboard> = {
  HQ: {
    role: "HQ",
    metrics: {
      totalStudents: 1250,
      activeStudents: 980,
      totalTeachers: 85,
      activeTeachers: 72,
      totalPrograms: 12,
      totalRevenue: 1250000,
      monthlyRevenue: 125000,
      completionRate: 78.5,
      averageProgress: 65.2,
      totalLearningGroups: 45,
      activeLearningGroups: 38,
      totalTrainings: 24,
      upcomingTrainings: 6,
      totalOrders: 156,
      pendingOrders: 12,
      totalProducts: 48,
      lowStockProducts: 3,
    },
    charts: {
      revenue: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Revenue",
          data: [95000, 110000, 105000, 125000, 130000, 125000],
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "rgba(59, 130, 246, 1)",
        }],
      },
      studentProgress: {
        labels: ["0-25%", "26-50%", "51-75%", "76-100%"],
        datasets: [{
          label: "Students",
          data: [120, 280, 350, 230],
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          borderColor: "rgba(34, 197, 94, 1)",
        }],
      },
      enrollmentTrends: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "New Enrollments",
          data: [45, 52, 48, 61, 58, 55],
          backgroundColor: "rgba(168, 85, 247, 0.1)",
          borderColor: "rgba(168, 85, 247, 1)",
        }],
      },
      programDistribution: {
        labels: ["English", "Spanish", "French", "German", "Other"],
        datasets: [{
          label: "Students",
          data: [450, 320, 180, 95, 105],
          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
        }],
      },
    },
    activities: [
      {
        id: "act_1",
        type: "enrollment",
        title: "New Student Enrollment",
        description: "Alice Johnson enrolled in Business English program",
        timestamp: new Date("2024-01-20T10:30:00"),
        user: "Boston Learning Center",
        status: "success",
      },
      {
        id: "act_2",
        type: "payment",
        title: "Payment Received",
        description: "Payment of $1,200 received from Bob Smith",
        timestamp: new Date("2024-01-20T09:15:00"),
        amount: 1200,
        status: "success",
      },
      {
        id: "act_3",
        type: "training",
        title: "Training Completed",
        description: "Teacher Training: Advanced Teaching Methods completed",
        timestamp: new Date("2024-01-19T16:45:00"),
        user: "Sarah Wilson",
        status: "success",
      },
    ],
    widgets: [],
    quickActions: [
      {
        id: "qa_1",
        title: "Create Program",
        description: "Add a new educational program",
        icon: "BookOpen",
        href: "/programs/new",
        color: "blue",
      },
      {
        id: "qa_2",
        title: "View Reports",
        description: "Access comprehensive reports",
        icon: "BarChart3",
        href: "/reports/royalties",
        color: "green",
      },
      {
        id: "qa_3",
        title: "Manage Accounts",
        description: "Create and manage MF/LC accounts",
        icon: "Building",
        href: "/accounts",
        color: "purple",
      },
      {
        id: "qa_4",
        title: "System Settings",
        description: "Configure system preferences",
        icon: "Zap",
        href: "/settings",
        color: "orange",
      },
    ],
  },
  MF: {
    role: "MF",
    metrics: {
      totalStudents: 450,
      activeStudents: 380,
      totalTeachers: 25,
      activeTeachers: 22,
      totalPrograms: 8,
      totalRevenue: 450000,
      monthlyRevenue: 45000,
      completionRate: 82.3,
      averageProgress: 68.7,
      totalLearningGroups: 18,
      activeLearningGroups: 15,
      totalTrainings: 8,
      upcomingTrainings: 2,
      totalOrders: 45,
      pendingOrders: 3,
      totalProducts: 24,
      lowStockProducts: 1,
    },
    charts: {
      revenue: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Revenue",
          data: [35000, 42000, 38000, 45000, 48000, 45000],
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 1)",
        }],
      },
      studentProgress: {
        labels: ["0-25%", "26-50%", "51-75%", "76-100%"],
        datasets: [{
          label: "Students",
          data: [45, 120, 150, 65],
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 1)",
        }],
      },
      enrollmentTrends: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "New Enrollments",
          data: [18, 22, 19, 25, 23, 21],
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderColor: "rgba(16, 185, 129, 1)",
        }],
      },
      programDistribution: {
        labels: ["English", "Spanish", "French", "Other"],
        datasets: [{
          label: "Students",
          data: [180, 120, 60, 90],
          backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
        }],
      },
    },
    activities: [
      {
        id: "act_1",
        type: "enrollment",
        title: "New Student Enrollment",
        description: "Carol Davis enrolled in Academic English program",
        timestamp: new Date("2024-01-20T11:15:00"),
        user: "Somerville Learning Center",
        status: "success",
      },
      {
        id: "act_2",
        type: "payment",
        title: "Payment Received",
        description: "Payment of $800 received from David Wilson",
        timestamp: new Date("2024-01-20T08:30:00"),
        amount: 800,
        status: "success",
      },
    ],
    widgets: [],
    quickActions: [
      {
        id: "qa_1",
        title: "Create SubProgram",
        description: "Add a new subprogram",
        icon: "BookOpen",
        href: "/subprograms/new",
        color: "blue",
      },
      {
        id: "qa_2",
        title: "View Orders",
        description: "Manage product orders",
        icon: "ShoppingCart",
        href: "/orders",
        color: "green",
      },
      {
        id: "qa_3",
        title: "Create Training",
        description: "Schedule new training session",
        icon: "GraduationCap",
        href: "/trainings/new",
        color: "purple",
      },
      {
        id: "qa_4",
        title: "View Reports",
        description: "Access regional reports",
        icon: "BarChart3",
        href: "/reports/students",
        color: "orange",
      },
    ],
  },
  LC: {
    role: "LC",
    metrics: {
      totalStudents: 120,
      activeStudents: 95,
      totalTeachers: 8,
      activeTeachers: 7,
      totalPrograms: 4,
      totalRevenue: 120000,
      monthlyRevenue: 12000,
      completionRate: 85.2,
      averageProgress: 72.1,
      totalLearningGroups: 6,
      activeLearningGroups: 5,
      totalTrainings: 3,
      upcomingTrainings: 1,
      totalOrders: 12,
      pendingOrders: 1,
      totalProducts: 15,
      lowStockProducts: 2,
    },
    charts: {
      revenue: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Revenue",
          data: [9000, 11000, 10500, 12000, 12500, 12000],
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderColor: "rgba(245, 158, 11, 1)",
        }],
      },
      studentProgress: {
        labels: ["0-25%", "26-50%", "51-75%", "76-100%"],
        datasets: [{
          label: "Students",
          data: [12, 28, 35, 20],
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderColor: "rgba(245, 158, 11, 1)",
        }],
      },
      enrollmentTrends: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "New Enrollments",
          data: [5, 8, 6, 10, 9, 7],
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderColor: "rgba(245, 158, 11, 1)",
        }],
      },
      programDistribution: {
        labels: ["English", "Spanish", "French"],
        datasets: [{
          label: "Students",
          data: [60, 35, 25],
          backgroundColor: ["#F59E0B", "#3B82F6", "#10B981"],
        }],
      },
    },
    activities: [
      {
        id: "act_1",
        type: "enrollment",
        title: "New Student Enrollment",
        description: "Emma Thompson enrolled in Business English program",
        timestamp: new Date("2024-01-20T13:20:00"),
        user: "Boston Learning Center",
        status: "success",
      },
      {
        id: "act_2",
        type: "graduation",
        title: "Student Graduated",
        description: "Michael Brown completed Spanish Language program",
        timestamp: new Date("2024-01-19T16:00:00"),
        user: "Boston Learning Center",
        status: "success",
      },
    ],
    widgets: [],
    quickActions: [
      {
        id: "qa_1",
        title: "Add Student",
        description: "Enroll a new student",
        icon: "Users",
        href: "/contacts/students/new",
        color: "blue",
      },
      {
        id: "qa_2",
        title: "Create Learning Group",
        description: "Start a new learning group",
        icon: "BookOpen",
        href: "/learning-groups/new",
        color: "green",
      },
      {
        id: "qa_3",
        title: "Place Order",
        description: "Order products and materials",
        icon: "ShoppingCart",
        href: "/orders/new",
        color: "purple",
      },
      {
        id: "qa_4",
        title: "View Progress",
        description: "Check student progress",
        icon: "TrendingUp",
        href: "/reports/students",
        color: "orange",
      },
    ],
  },
  TT: {
    role: "TT",
    metrics: {
      totalStudents: 0,
      activeStudents: 0,
      totalTeachers: 45,
      activeTeachers: 42,
      totalPrograms: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      completionRate: 88.9,
      averageProgress: 0,
      totalLearningGroups: 0,
      activeLearningGroups: 0,
      totalTrainings: 12,
      upcomingTrainings: 3,
      totalOrders: 0,
      pendingOrders: 0,
      totalProducts: 0,
      lowStockProducts: 0,
    },
    charts: {
      revenue: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Training Sessions",
          data: [8, 10, 9, 12, 11, 10],
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderColor: "rgba(139, 92, 246, 1)",
        }],
      },
      studentProgress: {
        labels: ["Passed", "Failed", "In Progress"],
        datasets: [{
          label: "Teachers",
          data: [35, 5, 2],
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderColor: "rgba(139, 92, 246, 1)",
        }],
      },
      enrollmentTrends: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Training Completions",
          data: [6, 8, 7, 10, 9, 8],
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderColor: "rgba(139, 92, 246, 1)",
        }],
      },
      programDistribution: {
        labels: ["Advanced Teaching", "Classroom Management", "Assessment", "Technology"],
        datasets: [{
          label: "Trainings",
          data: [15, 12, 10, 8],
          backgroundColor: ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"],
        }],
      },
    },
    activities: [
      {
        id: "act_1",
        type: "training",
        title: "Training Completed",
        description: "Sarah Wilson completed Advanced Teaching Methods training",
        timestamp: new Date("2024-01-20T15:30:00"),
        user: "Sarah Wilson",
        status: "success",
      },
      {
        id: "act_2",
        type: "training",
        title: "Training Scheduled",
        description: "Classroom Management training scheduled for next week",
        timestamp: new Date("2024-01-19T10:00:00"),
        user: "John Brown",
        status: "info",
      },
    ],
    widgets: [],
    quickActions: [
      {
        id: "qa_1",
        title: "View Trainings",
        description: "See assigned training sessions",
        icon: "GraduationCap",
        href: "/trainings",
        color: "blue",
      },
      {
        id: "qa_2",
        title: "Mark Progress",
        description: "Update teacher training progress",
        icon: "UserCheck",
        href: "/teacher-trainers",
        color: "green",
      },
      {
        id: "qa_3",
        title: "Generate Certificates",
        description: "Create completion certificates",
        icon: "Award",
        href: "/trainings/certificates",
        color: "purple",
      },
      {
        id: "qa_4",
        title: "View Reports",
        description: "Access training reports",
        icon: "BarChart3",
        href: "/reports/trainings",
        color: "orange",
      },
    ],
  },
};

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

  createTeacher(teacher: Omit<Teacher, "id" | "createdAt" | "updatedAt">): Teacher {
    const newTeacher: Teacher = {
      ...teacher,
      id: generateId("tea"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    teachers.push(newTeacher);
    return newTeacher;
  }

  updateTeacher(id: string, updates: Partial<Teacher>): Teacher | null {
    const index = teachers.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    teachers[index] = {
      ...teachers[index],
      ...updates,
      updatedAt: new Date(),
    };
    return teachers[index];
  }

  deleteTeacher(id: string): boolean {
    const index = teachers.findIndex(t => t.id === id);
    if (index === -1) return false;
    teachers.splice(index, 1);
    return true;
  }

  // Learning Groups
  getLearningGroups(): LearningGroup[] {
    return learningGroups;
  }

  getLearningGroupById(id: string): LearningGroup | undefined {
    return learningGroups.find(g => g.id === id);
  }

  createLearningGroup(group: Omit<LearningGroup, "id" | "createdAt" | "updatedAt">): LearningGroup {
    const newGroup: LearningGroup = {
      ...group,
      id: generateId("lg"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    learningGroups.push(newGroup);
    return newGroup;
  }

  updateLearningGroup(id: string, updates: Partial<LearningGroup>): LearningGroup | null {
    const index = learningGroups.findIndex(g => g.id === id);
    if (index === -1) return null;
    
    learningGroups[index] = {
      ...learningGroups[index],
      ...updates,
      updatedAt: new Date(),
    };
    return learningGroups[index];
  }

  deleteLearningGroup(id: string): boolean {
    const index = learningGroups.findIndex(g => g.id === id);
    if (index === -1) return false;
    learningGroups.splice(index, 1);
    return true;
  }

  // Product Lists
  getProductLists(): ProductList[] {
    return productLists;
  }

  getProductListById(id: string): ProductList | undefined {
    return productLists.find(pl => pl.id === id);
  }

  createProductList(list: Omit<ProductList, "id" | "createdAt" | "updatedAt">): ProductList {
    const newList: ProductList = {
      ...list,
      id: generateId("pl"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productLists.push(newList);
    return newList;
  }

  updateProductList(id: string, updates: Partial<ProductList>): ProductList | null {
    const index = productLists.findIndex(pl => pl.id === id);
    if (index === -1) return null;
    
    productLists[index] = {
      ...productLists[index],
      ...updates,
      updatedAt: new Date(),
    };
    return productLists[index];
  }

  deleteProductList(id: string): boolean {
    const index = productLists.findIndex(pl => pl.id === id);
    if (index === -1) return false;
    productLists.splice(index, 1);
    return true;
  }

  // Product Prices
  getProductPrices(): ProductPrice[] {
    return productPrices;
  }

  getProductPriceById(id: string): ProductPrice | undefined {
    return productPrices.find(pp => pp.id === id);
  }

  createProductPrice(price: Omit<ProductPrice, "id" | "createdAt" | "updatedAt">): ProductPrice {
    const newPrice: ProductPrice = {
      ...price,
      id: generateId("pp"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    productPrices.push(newPrice);
    return newPrice;
  }

  updateProductPrice(id: string, updates: Partial<ProductPrice>): ProductPrice | null {
    const index = productPrices.findIndex(pp => pp.id === id);
    if (index === -1) return null;
    
    productPrices[index] = {
      ...productPrices[index],
      ...updates,
      updatedAt: new Date(),
    };
    return productPrices[index];
  }

  deleteProductPrice(id: string): boolean {
    const index = productPrices.findIndex(pp => pp.id === id);
    if (index === -1) return false;
    productPrices.splice(index, 1);
    return true;
  }

  // Training Registrations
  getTrainingRegistrations(): TrainingRegistration[] {
    const registrations: TrainingRegistration[] = [];
    trainings.forEach(training => {
      registrations.push(...training.registrations);
    });
    return registrations;
  }

  getTrainingRegistrationById(id: string): TrainingRegistration | undefined {
    for (const training of trainings) {
      const registration = training.registrations.find(reg => reg.id === id);
      if (registration) return registration;
    }
    return undefined;
  }

  createTrainingRegistration(registration: Omit<TrainingRegistration, "id" | "createdAt" | "updatedAt">): TrainingRegistration {
    const newRegistration: TrainingRegistration = {
      ...registration,
      id: generateId("reg"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Add to the training's registrations
    const training = trainings.find(t => t.id === registration.trainingId);
    if (training) {
      training.registrations.push(newRegistration);
    }
    
    return newRegistration;
  }

  updateTrainingRegistration(id: string, updates: Partial<TrainingRegistration>): TrainingRegistration | null {
    for (const training of trainings) {
      const index = training.registrations.findIndex(reg => reg.id === id);
      if (index !== -1) {
        training.registrations[index] = {
          ...training.registrations[index],
          ...updates,
          updatedAt: new Date(),
        };
        return training.registrations[index];
      }
    }
    return null;
  }

  deleteTrainingRegistration(id: string): boolean {
    for (const training of trainings) {
      const index = training.registrations.findIndex(reg => reg.id === id);
      if (index !== -1) {
        training.registrations.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  // Training Types
  getTrainingTypes(): TrainingType[] {
    return trainingTypes;
  }

  getTrainingTypeById(id: string): TrainingType | undefined {
    return trainingTypes.find(tt => tt.id === id);
  }

  createTrainingType(trainingType: Omit<TrainingType, "id" | "createdAt" | "updatedAt">): TrainingType {
    const newTrainingType: TrainingType = {
      ...trainingType,
      id: generateId("tt"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    trainingTypes.push(newTrainingType);
    return newTrainingType;
  }

  updateTrainingType(id: string, updates: Partial<TrainingType>): TrainingType | null {
    const index = trainingTypes.findIndex(tt => tt.id === id);
    if (index === -1) return null;
    
    trainingTypes[index] = {
      ...trainingTypes[index],
      ...updates,
      updatedAt: new Date(),
    };
    return trainingTypes[index];
  }

  deleteTrainingType(id: string): boolean {
    const index = trainingTypes.findIndex(tt => tt.id === id);
    if (index === -1) return false;
    trainingTypes.splice(index, 1);
    return true;
  }

  // Trainings
  getTrainings(): Training[] {
    return trainings;
  }

  getTrainingById(id: string): Training | undefined {
    return trainings.find(t => t.id === id);
  }

  createTraining(training: Omit<Training, "id" | "createdAt" | "updatedAt">): Training {
    const newTraining: Training = {
      ...training,
      id: generateId("train"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    trainings.push(newTraining);
    return newTraining;
  }

  updateTraining(id: string, updates: Partial<Training>): Training | null {
    const index = trainings.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    trainings[index] = {
      ...trainings[index],
      ...updates,
      updatedAt: new Date(),
    };
    return trainings[index];
  }

  deleteTraining(id: string): boolean {
    const index = trainings.findIndex(t => t.id === id);
    if (index === -1) return false;
    trainings.splice(index, 1);
    return true;
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

  // Teacher Trainer Account methods
  getTeacherTrainerAccounts(): TeacherTrainerAccount[] {
    return teacherTrainerAccounts;
  }

  getTeacherTrainerAccountById(id: string): TeacherTrainerAccount | undefined {
    return teacherTrainerAccounts.find(tt => tt.id === id);
  }

  createTeacherTrainerAccount(ttAccount: Omit<TeacherTrainerAccount, "id" | "createdAt" | "updatedAt">): TeacherTrainerAccount {
    const newTTAccount: TeacherTrainerAccount = {
      ...ttAccount,
      id: generateId("tt"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    teacherTrainerAccounts.push(newTTAccount);
    return newTTAccount;
  }

  updateTeacherTrainerAccount(id: string, updates: Partial<TeacherTrainerAccount>): TeacherTrainerAccount | null {
    const index = teacherTrainerAccounts.findIndex(tt => tt.id === id);
    if (index === -1) return null;

    teacherTrainerAccounts[index] = {
      ...teacherTrainerAccounts[index],
      ...updates,
      updatedAt: new Date(),
    };
    return teacherTrainerAccounts[index];
  }

  deleteTeacherTrainerAccount(id: string): boolean {
    const index = teacherTrainerAccounts.findIndex(tt => tt.id === id);
    if (index === -1) return false;

    teacherTrainerAccounts.splice(index, 1);
    return true;
  }

  // Accounts
  getAccounts(): Account[] {
    return accounts;
  }

  getAccountById(id: string): Account | undefined {
    return accounts.find(acc => acc.id === id);
  }

  createAccount(account: Omit<Account, "id" | "createdAt" | "updatedAt">): Account {
    const newAccount: Account = {
      ...account,
      id: `acc_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    accounts.push(newAccount);
    return newAccount;
  }

  updateAccount(id: string, updates: Partial<Account>): Account | null {
    const index = accounts.findIndex(acc => acc.id === id);
    if (index === -1) return null;
    
    accounts[index] = {
      ...accounts[index],
      ...updates,
      updatedAt: new Date(),
    };
    return accounts[index];
  }

  deleteAccount(id: string): boolean {
    const index = accounts.findIndex(acc => acc.id === id);
    if (index === -1) return false;
    accounts.splice(index, 1);
    return true;
  }

  // Applications
  getApplications(): Application[] {
    return applications;
  }

  getApplicationById(id: string): Application | undefined {
    return applications.find(app => app.id === id);
  }

  createApplication(application: Omit<Application, "id" | "createdAt" | "updatedAt">): Application {
    const newApplication: Application = {
      ...application,
      id: `app_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    applications.push(newApplication);
    return newApplication;
  }

  updateApplication(id: string, updates: Partial<Application>): Application | null {
    const index = applications.findIndex(app => app.id === id);
    if (index === -1) return null;
    
    applications[index] = {
      ...applications[index],
      ...updates,
      updatedAt: new Date(),
    };
    return applications[index];
  }

  deleteApplication(id: string): boolean {
    const index = applications.findIndex(app => app.id === id);
    if (index === -1) return false;
    applications.splice(index, 1);
    return true;
  }

  // Application approval workflow
  approveApplication(id: string, reviewInfo: Application["reviewInfo"]): Application | null {
    const application = this.getApplicationById(id);
    if (!application) return null;
    
    return this.updateApplication(id, {
      status: "approved",
      reviewInfo,
    });
  }

  rejectApplication(id: string, reviewInfo: Application["reviewInfo"]): Application | null {
    const application = this.getApplicationById(id);
    if (!application) return null;
    
    return this.updateApplication(id, {
      status: "rejected",
      reviewInfo,
    });
  }

  // Royalty Calculations
  getRoyaltyCalculations(): RoyaltyCommissionCalculation[] {
    return royaltyCalculations;
  }

  getRoyaltyCalculationById(id: string): RoyaltyCommissionCalculation | undefined {
    return royaltyCalculations.find(calc => calc.id === id);
  }

  createRoyaltyCalculation(calculation: Omit<RoyaltyCommissionCalculation, "id" | "calculatedAt">): RoyaltyCommissionCalculation {
    const newCalculation: RoyaltyCommissionCalculation = {
      ...calculation,
      id: `lc_calc_${Date.now()}`,
      calculatedAt: new Date(),
    };
    royaltyCalculations.push(newCalculation);
    return newCalculation;
  }

  updateRoyaltyCalculation(id: string, updates: Partial<RoyaltyCommissionCalculation>): RoyaltyCommissionCalculation | null {
    const index = royaltyCalculations.findIndex(calc => calc.id === id);
    if (index === -1) return null;
    
    royaltyCalculations[index] = {
      ...royaltyCalculations[index],
      ...updates,
    };
    return royaltyCalculations[index];
  }

  deleteRoyaltyCalculation(id: string): boolean {
    const index = royaltyCalculations.findIndex(calc => calc.id === id);
    if (index === -1) return false;
    royaltyCalculations.splice(index, 1);
    return true;
  }

  // Royalty Summaries
  getRoyaltySummaries(): RoyaltyCommissionSummary[] {
    return royaltySummaries;
  }

  getRoyaltySummaryById(id: string): RoyaltyCommissionSummary | undefined {
    return royaltySummaries.find(summary => summary.id === id);
  }

  createRoyaltySummary(summary: Omit<RoyaltyCommissionSummary, "id" | "calculatedAt">): RoyaltyCommissionSummary {
    const newSummary: RoyaltyCommissionSummary = {
      ...summary,
      id: `mf_summary_${Date.now()}`,
      calculatedAt: new Date(),
    };
    royaltySummaries.push(newSummary);
    return newSummary;
  }

  updateRoyaltySummary(id: string, updates: Partial<RoyaltyCommissionSummary>): RoyaltyCommissionSummary | null {
    const index = royaltySummaries.findIndex(summary => summary.id === id);
    if (index === -1) return null;
    
    royaltySummaries[index] = {
      ...royaltySummaries[index],
      ...updates,
    };
    return royaltySummaries[index];
  }

  deleteRoyaltySummary(id: string): boolean {
    const index = royaltySummaries.findIndex(summary => summary.id === id);
    if (index === -1) return false;
    royaltySummaries.splice(index, 1);
    return true;
  }

  // Royalty Reports
  getRoyaltyCommissionReports(): RoyaltyCommissionReport[] {
    return royaltyCommissionReports;
  }

  getRoyaltyCommissionReportById(id: string): RoyaltyCommissionReport | undefined {
    return royaltyCommissionReports.find(report => report.id === id);
  }

  createRoyaltyCommissionReport(report: Omit<RoyaltyCommissionReport, "id" | "generatedAt">): RoyaltyCommissionReport {
    const newReport: RoyaltyCommissionReport = {
      ...report,
      id: `royalty_${Date.now()}`,
      generatedAt: new Date(),
    };
    royaltyCommissionReports.push(newReport);
    return newReport;
  }

  updateRoyaltyCommissionReport(id: string, updates: Partial<RoyaltyCommissionReport>): RoyaltyCommissionReport | null {
    const index = royaltyCommissionReports.findIndex(report => report.id === id);
    if (index === -1) return null;
    
    royaltyCommissionReports[index] = {
      ...royaltyCommissionReports[index],
      ...updates,
    };
    return royaltyCommissionReports[index];
  }

  deleteRoyaltyCommissionReport(id: string): boolean {
    const index = royaltyCommissionReports.findIndex(report => report.id === id);
    if (index === -1) return false;
    royaltyCommissionReports.splice(index, 1);
    return true;
  }

  // Commission calculation helper
  calculateLcToMfCommission(studentCount: number, revenue: number): RoyaltyCommissionCalculation["lcToMfCommission"] {
    const first100Count = Math.min(studentCount, 100);
    const beyond100Count = Math.max(0, studentCount - 100);
    
    const first100Amount = (revenue * first100Count / studentCount) * 0.14;
    const beyond100Amount = (revenue * beyond100Count / studentCount) * 0.12;
    
    return {
      first100Students: {
        count: first100Count,
        rate: 0.14,
        amount: first100Amount,
      },
      beyond100Students: {
        count: beyond100Count,
        rate: 0.12,
        amount: beyond100Amount,
      },
      total: first100Amount + beyond100Amount,
    };
  }

  calculateMfToHqCommission(lcToMfAmount: number): RoyaltyCommissionCalculation["mfToHqCommission"] {
    return {
      collectedFromLc: lcToMfAmount,
      rate: 0.5,
      amount: lcToMfAmount * 0.5,
    };
  }

  // Student Reports
  getStudentReportData(): StudentReportData[] {
    return studentReportData;
  }

  getStudentReportDataById(id: string): StudentReportData | undefined {
    return studentReportData.find(data => data.id === id);
  }

  getStudentReportDataByFilters(filters: StudentReportFilter): StudentReportData[] {
    let filtered = [...studentReportData];

    if (filters.lcId) {
      filtered = filtered.filter(data => data.lcId === filters.lcId);
    }
    
    if (filters.programId) {
      filtered = filtered.filter(data => data.programId === filters.programId);
    }
    
    if (filters.ageRange) {
      filtered = filtered.filter(data => 
        data.age >= filters.ageRange!.min && data.age <= filters.ageRange!.max
      );
    }
    
    if (filters.country) {
      filtered = filtered.filter(data => data.country === filters.country);
    }
    
    if (filters.city) {
      filtered = filtered.filter(data => data.city === filters.city);
    }
    
    if (filters.status) {
      filtered = filtered.filter(data => data.status === filters.status);
    }
    
    if (filters.enrollmentDate) {
      filtered = filtered.filter(data => 
        data.enrollmentDate >= filters.enrollmentDate!.start &&
        data.enrollmentDate <= filters.enrollmentDate!.end
      );
    }

    return filtered;
  }

  // Generic Report Configs
  getGenericReportConfigs(): GenericReportConfig[] {
    return genericReportConfigs;
  }

  getGenericReportConfigById(id: string): GenericReportConfig | undefined {
    return genericReportConfigs.find(config => config.id === id);
  }

  createGenericReportConfig(config: Omit<GenericReportConfig, "id" | "createdAt" | "updatedAt">): GenericReportConfig {
    const newConfig: GenericReportConfig = {
      ...config,
      id: `config_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    genericReportConfigs.push(newConfig);
    return newConfig;
  }

  updateGenericReportConfig(id: string, updates: Partial<GenericReportConfig>): GenericReportConfig | null {
    const index = genericReportConfigs.findIndex(config => config.id === id);
    if (index === -1) return null;
    
    genericReportConfigs[index] = {
      ...genericReportConfigs[index],
      ...updates,
      updatedAt: new Date(),
    };
    return genericReportConfigs[index];
  }

  deleteGenericReportConfig(id: string): boolean {
    const index = genericReportConfigs.findIndex(config => config.id === id);
    if (index === -1) return false;
    genericReportConfigs.splice(index, 1);
    return true;
  }

  // Dashboard Data
  getDashboardData(role: "HQ" | "MF" | "LC" | "TT"): RoleBasedDashboard {
    return dashboardData[role] || dashboardData.HQ;
  }

  updateDashboardMetrics(role: "HQ" | "MF" | "LC" | "TT", metrics: Partial<DashboardMetrics>): DashboardMetrics {
    const dashboard = dashboardData[role];
    if (dashboard) {
      dashboard.metrics = { ...dashboard.metrics, ...metrics };
      return dashboard.metrics;
    }
    return dashboardData.HQ.metrics;
  }

  addDashboardActivity(role: "HQ" | "MF" | "LC" | "TT", activity: Omit<DashboardActivity, "id">): DashboardActivity {
    const dashboard = dashboardData[role];
    if (dashboard) {
      const newActivity: DashboardActivity = {
        ...activity,
        id: `act_${Date.now()}`,
      };
      dashboard.activities.unshift(newActivity);
      // Keep only last 10 activities
      if (dashboard.activities.length > 10) {
        dashboard.activities = dashboard.activities.slice(0, 10);
      }
      return newActivity;
    }
    return {
      ...activity,
      id: `act_${Date.now()}`,
    };
  }

  // Authentication Methods
  authenticateUser(credentials: LoginCredentials): LoginResponse {
    const user = authUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: "Account is deactivated. Please contact support.",
      };
    }

    if (user.password !== credentials.password) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Update last login
    user.lastLogin = new Date();
    user.updatedAt = new Date();

    // Generate a mock token (in real app, this would be a JWT)
    const token = `mock_token_${user.id}_${Date.now()}`;

    return {
      success: true,
      user: {
        ...user,
        password: "", // Don't return password in response
      },
      token,
      message: "Login successful",
    };
  }

  getUserByEmail(email: string): AuthUser | null {
    const user = authUsers.find(u => u.email === email);
    return user ? { ...user, password: "" } : null;
  }

  getUserById(id: string): AuthUser | null {
    const user = authUsers.find(u => u.id === id);
    return user ? { ...user, password: "" } : null;
  }

  updateUserLastLogin(userId: string): boolean {
    const user = authUsers.find(u => u.id === userId);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      return true;
    }
    return false;
  }

  getAllUsers(): AuthUser[] {
    return authUsers.map(user => ({ ...user, password: "" }));
  }

  getUsersByRole(role: "HQ" | "MF" | "LC" | "TT"): AuthUser[] {
    return authUsers
      .filter(user => user.role === role)
      .map(user => ({ ...user, password: "" }));
  }

  createUser(userData: Omit<AuthUser, "id" | "createdAt" | "updatedAt">): AuthUser {
    const newUser: AuthUser = {
      ...userData,
      id: generateId("user"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    authUsers.push(newUser);
    return { ...newUser, password: "" };
  }

  updateUser(id: string, updates: Partial<Omit<AuthUser, "id" | "createdAt">>): AuthUser | null {
    const userIndex = authUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    authUsers[userIndex] = {
      ...authUsers[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return { ...authUsers[userIndex], password: "" };
  }

  deleteUser(id: string): boolean {
    const userIndex = authUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return false;
    authUsers.splice(userIndex, 1);
    return true;
  }
}

// Export singleton instance
export const db = new MockDatabase();
