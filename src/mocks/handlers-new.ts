import { http, HttpResponse } from "msw";
import { 
  db, 
  findById, 
  findByField, 
  addItem, 
  updateItem, 
  deleteItem,
  createId 
} from "./db";
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
  CreateProgramRequest,
  UpdateProgramRequest,
  CreateStudentRequest,
  UpdateStudentRequest,
  ApiResponse,
  PaginatedResponse,
  QueryParams
} from "@/types";

// Helper function to create API response
const createResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
  data,
  message,
  success: true,
});

// Helper function to create paginated response
const createPaginatedResponse = <T>(
  data: T[], 
  page: number = 1, 
  limit: number = 10
): PaginatedResponse<T> => {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

// Helper function to parse query parameters
const parseQueryParams = (url: URL): QueryParams => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || undefined;
  const sortBy = url.searchParams.get('sortBy') || undefined;
  const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';

  return { page, limit, search, sortBy, sortOrder };
};

export const handlers = [
  // Programs CRUD
  http.get("/api/programs", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredPrograms = db.programs;
    
    if (search) {
      filteredPrograms = db.programs.filter(program => 
        program.name.toLowerCase().includes(search.toLowerCase()) ||
        program.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredPrograms, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/programs/:id", ({ params }) => {
    const program = findById(db.programs, params.id as string);
    if (!program) {
      return HttpResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(program));
  }),

  http.post("/api/programs", async ({ request }) => {
    const body = await request.json() as CreateProgramRequest;
    const newProgram = addItem(db.programs, body);
    return HttpResponse.json(createResponse(newProgram, "Program created successfully"), { status: 201 });
  }),

  http.put("/api/programs/:id", async ({ params, request }) => {
    const body = await request.json() as UpdateProgramRequest;
    const updatedProgram = updateItem(db.programs, params.id as string, body);
    if (!updatedProgram) {
      return HttpResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(updatedProgram, "Program updated successfully"));
  }),

  http.delete("/api/programs/:id", ({ params }) => {
    const success = deleteItem(db.programs, params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Program deleted successfully"));
  }),

  // SubPrograms CRUD
  http.get("/api/subprograms", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredSubPrograms = db.subPrograms;
    
    if (search) {
      filteredSubPrograms = db.subPrograms.filter(subProgram => 
        subProgram.name.toLowerCase().includes(search.toLowerCase()) ||
        subProgram.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredSubPrograms, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/subprograms/:id", ({ params }) => {
    const subProgram = findById(db.subPrograms, params.id as string);
    if (!subProgram) {
      return HttpResponse.json(
        { success: false, message: "SubProgram not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(subProgram));
  }),

  http.post("/api/subprograms", async ({ request }) => {
    const body = await request.json() as Omit<SubProgram, 'id' | 'createdAt' | 'updatedAt'>;
    const newSubProgram = addItem(db.subPrograms, body);
    return HttpResponse.json(createResponse(newSubProgram, "SubProgram created successfully"), { status: 201 });
  }),

  http.put("/api/subprograms/:id", async ({ params, request }) => {
    const body = await request.json() as Partial<Omit<SubProgram, 'id' | 'createdAt' | 'updatedAt'>>;
    const updatedSubProgram = updateItem(db.subPrograms, params.id as string, body);
    if (!updatedSubProgram) {
      return HttpResponse.json(
        { success: false, message: "SubProgram not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(updatedSubProgram, "SubProgram updated successfully"));
  }),

  http.delete("/api/subprograms/:id", ({ params }) => {
    const success = deleteItem(db.subPrograms, params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "SubProgram not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "SubProgram deleted successfully"));
  }),

  // Students CRUD
  http.get("/api/students", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredStudents = db.students;
    
    if (search) {
      filteredStudents = db.students.filter(student => 
        student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        student.lastName.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredStudents, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/students/:id", ({ params }) => {
    const student = findById(db.students, params.id as string);
    if (!student) {
      return HttpResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(student));
  }),

  http.post("/api/students", async ({ request }) => {
    const body = await request.json() as CreateStudentRequest;
    const newStudent = addItem(db.students, {
      ...body,
      dateOfBirth: new Date(body.dateOfBirth),
      isActive: true,
    });
    return HttpResponse.json(createResponse(newStudent, "Student created successfully"), { status: 201 });
  }),

  http.put("/api/students/:id", async ({ params, request }) => {
    const body = await request.json() as UpdateStudentRequest;
    const updatedStudent = updateItem(db.students, params.id as string, {
      ...body,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
    });
    if (!updatedStudent) {
      return HttpResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(updatedStudent, "Student updated successfully"));
  }),

  http.delete("/api/students/:id", ({ params }) => {
    const success = deleteItem(db.students, params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Student deleted successfully"));
  }),

  // Teachers CRUD
  http.get("/api/teachers", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredTeachers = db.teachers;
    
    if (search) {
      filteredTeachers = db.teachers.filter(teacher => 
        teacher.firstName.toLowerCase().includes(search.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(search.toLowerCase()) ||
        teacher.email.toLowerCase().includes(search.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredTeachers, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/teachers/:id", ({ params }) => {
    const teacher = findById(db.teachers, params.id as string);
    if (!teacher) {
      return HttpResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(teacher));
  }),

  http.post("/api/teachers", async ({ request }) => {
    const body = await request.json() as Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>;
    const newTeacher = addItem(db.teachers, body);
    return HttpResponse.json(createResponse(newTeacher, "Teacher created successfully"), { status: 201 });
  }),

  http.put("/api/teachers/:id", async ({ params, request }) => {
    const body = await request.json() as Partial<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>>;
    const updatedTeacher = updateItem(db.teachers, params.id as string, body);
    if (!updatedTeacher) {
      return HttpResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(updatedTeacher, "Teacher updated successfully"));
  }),

  http.delete("/api/teachers/:id", ({ params }) => {
    const success = deleteItem(db.teachers, params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Teacher deleted successfully"));
  }),

  // Learning Groups CRUD
  http.get("/api/learning-groups", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredGroups = db.learningGroups;
    
    if (search) {
      filteredGroups = db.learningGroups.filter(group => 
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredGroups, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/learning-groups/:id", ({ params }) => {
    const group = findById(db.learningGroups, params.id as string);
    if (!group) {
      return HttpResponse.json(
        { success: false, message: "Learning Group not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(group));
  }),

  http.post("/api/learning-groups", async ({ request }) => {
    const body = await request.json() as Omit<LearningGroup, 'id' | 'createdAt' | 'updatedAt'>;
    const newGroup = addItem(db.learningGroups, body);
    return HttpResponse.json(createResponse(newGroup, "Learning Group created successfully"), { status: 201 });
  }),

  http.put("/api/learning-groups/:id", async ({ params, request }) => {
    const body = await request.json() as Partial<Omit<LearningGroup, 'id' | 'createdAt' | 'updatedAt'>>;
    const updatedGroup = updateItem(db.learningGroups, params.id as string, body);
    if (!updatedGroup) {
      return HttpResponse.json(
        { success: false, message: "Learning Group not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(updatedGroup, "Learning Group updated successfully"));
  }),

  http.delete("/api/learning-groups/:id", ({ params }) => {
    const success = deleteItem(db.learningGroups, params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Learning Group not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Learning Group deleted successfully"));
  }),

  // Orders CRUD
  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredOrders = db.orders;
    
    if (search) {
      filteredOrders = db.orders.filter(order => 
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerId.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredOrders, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/orders/:id", ({ params }) => {
    const order = findById(db.orders, params.id as string);
    if (!order) {
      return HttpResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(order));
  }),

  http.post("/api/orders", async ({ request }) => {
    const body = await request.json() as Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
    const newOrder = addItem(db.orders, body);
    return HttpResponse.json(createResponse(newOrder, "Order created successfully"), { status: 201 });
  }),

  http.put("/api/orders/:id", async ({ params, request }) => {
    const body = await request.json() as Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>;
    const updatedOrder = updateItem(db.orders, params.id as string, body);
    if (!updatedOrder) {
      return HttpResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(updatedOrder, "Order updated successfully"));
  }),

  http.delete("/api/orders/:id", ({ params }) => {
    const success = deleteItem(db.orders, params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Order deleted successfully"));
  }),

  // Trainings CRUD
  http.get("/api/trainings", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredTrainings = db.trainings;
    
    if (search) {
      filteredTrainings = db.trainings.filter(training => 
        training.name.toLowerCase().includes(search.toLowerCase()) ||
        training.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredTrainings, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/trainings/:id", ({ params }) => {
    const training = findById(db.trainings, params.id as string);
    if (!training) {
      return HttpResponse.json(
        { success: false, message: "Training not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(training));
  }),

  http.post("/api/trainings", async ({ request }) => {
    const body = await request.json() as Omit<Training, 'id' | 'createdAt' | 'updatedAt'>;
    const newTraining = addItem(db.trainings, body);
    return HttpResponse.json(createResponse(newTraining, "Training created successfully"), { status: 201 });
  }),

  http.put("/api/trainings/:id", async ({ params, request }) => {
    const body = await request.json() as Partial<Omit<Training, 'id' | 'createdAt' | 'updatedAt'>>;
    const updatedTraining = updateItem(db.trainings, params.id as string, body);
    if (!updatedTraining) {
      return HttpResponse.json(
        { success: false, message: "Training not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(updatedTraining, "Training updated successfully"));
  }),

  http.delete("/api/trainings/:id", ({ params }) => {
    const success = deleteItem(db.trainings, params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Training not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Training deleted successfully"));
  }),

  // Teacher Trainers CRUD
  http.get("/api/teacher-trainers", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredTrainers = db.teacherTrainers;
    
    if (search) {
      filteredTrainers = db.teacherTrainers.filter(trainer => 
        trainer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        trainer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        trainer.email.toLowerCase().includes(search.toLowerCase()) ||
        trainer.specialization.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredTrainers, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/teacher-trainers/:id", ({ params }) => {
    const trainer = findById(db.teacherTrainers, params.id as string);
    if (!trainer) {
      return HttpResponse.json(
        { success: false, message: "Teacher Trainer not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(trainer));
  }),

  http.post("/api/teacher-trainers", async ({ request }) => {
    const body = await request.json() as Omit<TeacherTrainerAccount, 'id' | 'createdAt' | 'updatedAt'>;
    const newTrainer = addItem(db.teacherTrainers, body);
    return HttpResponse.json(createResponse(newTrainer, "Teacher Trainer created successfully"), { status: 201 });
  }),

  http.put("/api/teacher-trainers/:id", async ({ params, request }) => {
    const body = await request.json() as Partial<Omit<TeacherTrainerAccount, 'id' | 'createdAt' | 'updatedAt'>>;
    const updatedTrainer = updateItem(db.teacherTrainers, params.id as string, body);
    if (!updatedTrainer) {
      return HttpResponse.json(
        { success: false, message: "Teacher Trainer not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(updatedTrainer, "Teacher Trainer updated successfully"));
  }),

  http.delete("/api/teacher-trainers/:id", ({ params }) => {
    const success = deleteItem(db.teacherTrainers, params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Teacher Trainer not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Teacher Trainer deleted successfully"));
  }),

  // Accounts CRUD
  http.get("/api/accounts", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredAccounts = db.accounts;
    
    if (search) {
      filteredAccounts = db.accounts.filter(account => 
        account.name.toLowerCase().includes(search.toLowerCase()) ||
        account.type.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredAccounts, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/accounts/:id", ({ params }) => {
    const account = findById(db.accounts, params.id as string);
    if (!account) {
      return HttpResponse.json(
        { success: false, message: "Account not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(account));
  }),

  // Products CRUD
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredProducts = db.products;
    
    if (search) {
      filteredProducts = db.products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredProducts, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/products/:id", ({ params }) => {
    const product = findById(db.products, params.id as string);
    if (!product) {
      return HttpResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(product));
  }),

  // Reports
  http.get("/api/reports/royalties", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit } = parseQueryParams(url);
    
    const response = createPaginatedResponse(db.royaltyReports, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/reports/students", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit } = parseQueryParams(url);
    
    const response = createPaginatedResponse(db.studentReports, page, limit);
    return HttpResponse.json(response);
  }),

  // Training Types CRUD
  http.get("/api/training-types", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredTypes = db.trainingTypes;
    
    if (search) {
      filteredTypes = db.trainingTypes.filter(type => 
        type.name.toLowerCase().includes(search.toLowerCase()) ||
        type.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredTypes, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/training-types/:id", ({ params }) => {
    const type = findById(db.trainingTypes, params.id as string);
    if (!type) {
      return HttpResponse.json(
        { success: false, message: "Training Type not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(type));
  }),

  // Inventory Items CRUD
  http.get("/api/inventory", ({ request }) => {
    const url = new URL(request.url);
    const { page, limit, search } = parseQueryParams(url);
    
    let filteredItems = db.inventoryItems;
    
    if (search) {
      filteredItems = db.inventoryItems.filter(item => 
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.batchNumber?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const response = createPaginatedResponse(filteredItems, page, limit);
    return HttpResponse.json(response);
  }),

  http.get("/api/inventory/:id", ({ params }) => {
    const item = findById(db.inventoryItems, params.id as string);
    if (!item) {
      return HttpResponse.json(
        { success: false, message: "Inventory Item not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(item));
  }),
];
