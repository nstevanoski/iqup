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
}

// Export singleton instance
export const db = new MockDatabase();
