import { http, HttpResponse } from "msw";
import { db } from "./db";
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
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
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
  limit: number = 10,
  total?: number
): PaginatedResponse<T> => {
  const totalItems = total ?? data.length;
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    data: data.slice((page - 1) * limit, page * limit),
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages,
    },
  };
};

// Helper function to parse query parameters
const parseQueryParams = (url: URL): FilterOptions & { kind?: string } => {
  const search = url.searchParams.get("search") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const category = url.searchParams.get("category") || undefined;
  const kind = url.searchParams.get("kind") || undefined;
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const sortBy = url.searchParams.get("sortBy") || undefined;
  const sortOrder = (url.searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  
  return {
    search,
    status,
    category,
    kind,
    page,
    limit,
    sortBy,
    sortOrder,
  };
};

// Programs handlers
export const programHandlers = [
  // Get all programs
  http.get("/api/programs", ({ request }) => {
    const url = new URL(request.url);
    const filters = parseQueryParams(url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    const userScope = url.searchParams.get("userScope");
    
    let programs = db.getPrograms();
    
    // Apply role-based filtering
    if (userRole === "MF" || userRole === "LC") {
      // MF and LC can only see programs shared with their scope
      programs = programs.filter(p => 
        p.visibility === "public" || 
        (p.visibility === "shared" && p.sharedWithMFs.includes(userScope || ""))
      );
    } else if (userRole === "TT") {
      // TT can only see public programs
      programs = programs.filter(p => p.visibility === "public");
    }
    // HQ can see all programs (no filtering)
    
    // Apply filters
    if (filters.search) {
      programs = programs.filter(p => 
        p.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.kind.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (filters.status) {
      programs = programs.filter(p => p.status === filters.status);
    }
    
    if (filters.category) {
      programs = programs.filter(p => p.category === filters.category);
    }
    
    if (filters.kind) {
      programs = programs.filter(p => p.kind === filters.kind);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      programs.sort((a, b) => {
        const aVal = (a as any)[filters.sortBy!];
        const bVal = (b as any)[filters.sortBy!];
        const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filters.sortOrder === "desc" ? -result : result;
      });
    }
    
    const response = createPaginatedResponse(programs, filters.page, filters.limit);
    return HttpResponse.json(response);
  }),

  // Get program by ID
  http.get("/api/programs/:id", ({ params, request }) => {
    const url = new URL(request.url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    const userScope = url.searchParams.get("userScope");
    
    const program = db.getProgramById(params.id as string);
    if (!program) {
      return HttpResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }
    
    // Check access permissions
    if (userRole === "MF" || userRole === "LC") {
      if (program.visibility !== "public" && 
          !(program.visibility === "shared" && program.sharedWithMFs.includes(userScope || ""))) {
        return HttpResponse.json(
          { success: false, message: "Access denied" },
          { status: 403 }
        );
      }
    } else if (userRole === "TT") {
      if (program.visibility !== "public") {
        return HttpResponse.json(
          { success: false, message: "Access denied" },
          { status: 403 }
        );
      }
    }
    
    return HttpResponse.json(createResponse(program));
  }),

  // Create program (HQ only)
  http.post("/api/programs", async ({ request }) => {
    const url = new URL(request.url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    
    if (userRole !== "HQ") {
      return HttpResponse.json(
        { success: false, message: "Access denied. Only HQ can create programs." },
        { status: 403 }
      );
    }
    
    try {
      const programData = await request.json() as Omit<Program, "id" | "createdAt" | "updatedAt">;
      const program = db.createProgram(programData);
      return HttpResponse.json(createResponse(program, "Program created successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Update program (HQ only)
  http.put("/api/programs/:id", async ({ params, request }) => {
    const url = new URL(request.url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    
    if (userRole !== "HQ") {
      return HttpResponse.json(
        { success: false, message: "Access denied. Only HQ can update programs." },
        { status: 403 }
      );
    }
    
    try {
      const updates = await request.json() as Partial<Program>;
      const program = db.updateProgram(params.id as string, updates);
      if (!program) {
        return HttpResponse.json(
          { success: false, message: "Program not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(createResponse(program, "Program updated successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Delete program (HQ only)
  http.delete("/api/programs/:id", ({ params, request }) => {
    const url = new URL(request.url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    
    if (userRole !== "HQ") {
      return HttpResponse.json(
        { success: false, message: "Access denied. Only HQ can delete programs." },
        { status: 403 }
      );
    }
    
    const success = db.deleteProgram(params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Program not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Program deleted successfully"));
  }),
];

// SubPrograms handlers
export const subProgramHandlers = [
  // Get all subprograms
  http.get("/api/subprograms", ({ request }) => {
    const url = new URL(request.url);
    const filters = parseQueryParams(url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    const userScope = url.searchParams.get("userScope");
    
    let subPrograms = db.getSubPrograms();
    
    // Apply role-based filtering
    if (userRole === "LC") {
      // LC can only see subprograms shared with their scope
      subPrograms = subPrograms.filter((sp: SubProgram) => 
        sp.visibility === "public" || 
        (sp.visibility === "shared" && sp.sharedWithLCs.includes(userScope || ""))
      );
    } else if (userRole === "HQ") {
      // HQ can see all subprograms (read-only)
      // No filtering needed
    } else if (userRole === "MF") {
      // MF can see all subprograms (CRUD access)
      // No filtering needed
    } else if (userRole === "TT") {
      // TT can only see public subprograms
      subPrograms = subPrograms.filter((sp: SubProgram) => sp.visibility === "public");
    }
    
    // Apply filters
    if (filters.search) {
      subPrograms = subPrograms.filter((sp: SubProgram) => 
        sp.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
        sp.description.toLowerCase().includes(filters.search!.toLowerCase()) ||
        sp.pricingModel.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (filters.status) {
      subPrograms = subPrograms.filter((sp: SubProgram) => sp.status === filters.status);
    }
    
    if (filters.category) {
      subPrograms = subPrograms.filter((sp: SubProgram) => sp.programId === filters.category);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      subPrograms.sort((a: SubProgram, b: SubProgram) => {
        const aVal = (a as any)[filters.sortBy!];
        const bVal = (b as any)[filters.sortBy!];
        const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filters.sortOrder === "desc" ? -result : result;
      });
    }
    
    const response = createPaginatedResponse(subPrograms, filters.page, filters.limit);
    return HttpResponse.json(response);
  }),

  // Get subprogram by ID
  http.get("/api/subprograms/:id", ({ params, request }) => {
    const url = new URL(request.url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    const userScope = url.searchParams.get("userScope");
    
    const subProgram = db.getSubProgramById(params.id as string);
    if (!subProgram) {
      return HttpResponse.json(
        { success: false, message: "SubProgram not found" },
        { status: 404 }
      );
    }
    
    // Check access permissions
    if (userRole === "LC") {
      if (subProgram.visibility !== "public" && 
          !(subProgram.visibility === "shared" && subProgram.sharedWithLCs.includes(userScope || ""))) {
        return HttpResponse.json(
          { success: false, message: "Access denied" },
          { status: 403 }
        );
      }
    } else if (userRole === "TT") {
      if (subProgram.visibility !== "public") {
        return HttpResponse.json(
          { success: false, message: "Access denied" },
          { status: 403 }
        );
      }
    }
    
    return HttpResponse.json(createResponse(subProgram));
  }),

  // Create subprogram (MF only)
  http.post("/api/subprograms", async ({ request }) => {
    const url = new URL(request.url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    
    if (userRole !== "MF") {
      return HttpResponse.json(
        { success: false, message: "Access denied. Only MF can create subprograms." },
        { status: 403 }
      );
    }
    
    try {
      const subProgramData = await request.json() as Omit<SubProgram, "id" | "createdAt" | "updatedAt">;
      const subProgram = db.createSubProgram(subProgramData);
      return HttpResponse.json(createResponse(subProgram, "SubProgram created successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Update subprogram (MF only)
  http.put("/api/subprograms/:id", async ({ params, request }) => {
    const url = new URL(request.url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    
    if (userRole !== "MF") {
      return HttpResponse.json(
        { success: false, message: "Access denied. Only MF can update subprograms." },
        { status: 403 }
      );
    }
    
    try {
      const updates = await request.json() as Partial<SubProgram>;
      const subProgram = db.updateSubProgram(params.id as string, updates);
      if (!subProgram) {
        return HttpResponse.json(
          { success: false, message: "SubProgram not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(createResponse(subProgram, "SubProgram updated successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Delete subprogram (MF only)
  http.delete("/api/subprograms/:id", ({ params, request }) => {
    const url = new URL(request.url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    
    if (userRole !== "MF") {
      return HttpResponse.json(
        { success: false, message: "Access denied. Only MF can delete subprograms." },
        { status: 403 }
      );
    }
    
    const success = db.deleteSubProgram(params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "SubProgram not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "SubProgram deleted successfully"));
  }),
];

// Teachers handlers
export const teacherHandlers = [
  // Get all teachers
  http.get("/api/teachers", ({ request }) => {
    const url = new URL(request.url);
    const filters = parseQueryParams(url);
    
    let teachers = db.getTeachers();
    
    // Apply filters
    if (filters.search) {
      teachers = teachers.filter(t => 
        t.firstName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        t.lastName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        t.email.toLowerCase().includes(filters.search!.toLowerCase()) ||
        t.specialization.some(s => s.toLowerCase().includes(filters.search!.toLowerCase()))
      );
    }
    
    if (filters.status) {
      teachers = teachers.filter(t => t.status === filters.status);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      teachers.sort((a, b) => {
        const aVal = (a as any)[filters.sortBy!];
        const bVal = (b as any)[filters.sortBy!];
        const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filters.sortOrder === "desc" ? -result : result;
      });
    }
    
    const response = createPaginatedResponse(teachers, filters.page, filters.limit);
    return HttpResponse.json(response);
  }),

  // Get teacher by ID
  http.get("/api/teachers/:id", ({ params }) => {
    const teacher = db.getTeacherById(params.id as string);
    if (!teacher) {
      return HttpResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(teacher));
  }),

  // Create teacher
  http.post("/api/teachers", async ({ request }) => {
    try {
      const teacherData = await request.json() as Omit<Teacher, "id" | "createdAt" | "updatedAt">;
      const teacher = db.createTeacher(teacherData);
      return HttpResponse.json(createResponse(teacher, "Teacher created successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Update teacher
  http.put("/api/teachers/:id", async ({ params, request }) => {
    try {
      const updates = await request.json() as Partial<Teacher>;
      const teacher = db.updateTeacher(params.id as string, updates);
      if (!teacher) {
        return HttpResponse.json(
          { success: false, message: "Teacher not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(createResponse(teacher, "Teacher updated successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Delete teacher
  http.delete("/api/teachers/:id", ({ params }) => {
    const success = db.deleteTeacher(params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Teacher deleted successfully"));
  }),
];

// Students handlers
export const studentHandlers = [
  // Get all students
  http.get("/api/students", ({ request }) => {
    const url = new URL(request.url);
    const filters = parseQueryParams(url);
    
    let students = db.getStudents();
    
    // Apply filters
    if (filters.search) {
      students = students.filter(s => 
        s.firstName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        s.lastName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        s.email.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (filters.status) {
      students = students.filter(s => s.status === filters.status);
    }
    
    const response = createPaginatedResponse(students, filters.page, filters.limit);
    return HttpResponse.json(response);
  }),

  // Get student by ID
  http.get("/api/students/:id", ({ params }) => {
    const student = db.getStudentById(params.id as string);
    if (!student) {
      return HttpResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(student));
  }),

  // Create student
  http.post("/api/students", async ({ request }) => {
    try {
      const studentData = await request.json() as Omit<Student, "id" | "createdAt" | "updatedAt">;
      const student = db.createStudent(studentData);
      return HttpResponse.json(createResponse(student, "Student created successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Update student
  http.put("/api/students/:id", async ({ params, request }) => {
    try {
      const updates = await request.json() as Partial<Student>;
      const student = db.updateStudent(params.id as string, updates);
      if (!student) {
        return HttpResponse.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(createResponse(student, "Student updated successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Delete student
  http.delete("/api/students/:id", ({ params }) => {
    const success = db.deleteStudent(params.id as string);
    if (!success) {
      return HttpResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(null, "Student deleted successfully"));
  }),
];

// Orders handlers
export const orderHandlers = [
  // Get all orders
  http.get("/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const filters = parseQueryParams(url);
    
    let orders = db.getOrders();
    
    // Apply filters
    if (filters.search) {
      orders = orders.filter(o => 
        o.orderNumber.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (filters.status) {
      orders = orders.filter(o => o.status === filters.status);
    }
    
    const response = createPaginatedResponse(orders, filters.page, filters.limit);
    return HttpResponse.json(response);
  }),

  // Get order by ID
  http.get("/api/orders/:id", ({ params }) => {
    const order = db.getOrderById(params.id as string);
    if (!order) {
      return HttpResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(createResponse(order));
  }),

  // Create order
  http.post("/api/orders", async ({ request }) => {
    try {
      const orderData = await request.json() as Omit<Order, "id" | "createdAt" | "updatedAt">;
      const order = db.createOrder(orderData);
      return HttpResponse.json(createResponse(order, "Order created successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),

  // Update order
  http.put("/api/orders/:id", async ({ params, request }) => {
    try {
      const updates = await request.json() as Partial<Order>;
      const order = db.updateOrder(params.id as string, updates);
      if (!order) {
        return HttpResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(createResponse(order, "Order updated successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
  }),
];

// Dashboard handlers
export const dashboardHandlers = [
  // Get dashboard stats
  http.get("/api/dashboard", () => {
    const stats = db.getDashboardStats();
    const activities = db.getRecentActivities();
    
    return HttpResponse.json(createResponse({
      stats,
      recentActivity: activities,
    }));
  }),
];

// Reports handlers
export const reportHandlers = [
  // Get royalties report
  http.get("/api/reports/royalties", ({ request }) => {
    const url = new URL(request.url);
    const period = url.searchParams.get("period");
    
    // Filter by period if provided
    let reports = db.getRoyaltyReports();
    if (period) {
      reports = reports.filter((r: RoyaltyReportRow) => r.period === period);
    }
    
    const totalRoyalties = reports.reduce((sum: number, r: RoyaltyReportRow) => sum + r.royaltyAmount, 0);
    const monthlyBreakdown = reports.map((r: RoyaltyReportRow) => ({
      month: r.period,
      amount: r.royaltyAmount,
    }));
    
    return HttpResponse.json(createResponse({
      totalRoyalties,
      monthlyBreakdown,
      reports,
    }));
  }),

  // Get students report
  http.get("/api/reports/students", ({ request }) => {
    const url = new URL(request.url);
    const programId = url.searchParams.get("programId");
    
    // Filter by program if provided
    let reports = db.getStudentReports();
    if (programId) {
      reports = reports.filter((r: StudentReportRow) => r.programId === programId);
    }
    
    const totalStudents = reports.length;
    const activeStudents = reports.filter((r: StudentReportRow) => r.status === "active").length;
    const newRegistrations = reports.filter((r: StudentReportRow) => {
      const enrollmentDate = new Date(r.enrollmentDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return enrollmentDate >= thirtyDaysAgo;
    }).length;
    
    // Program breakdown
    const programBreakdown = reports.reduce((acc: Record<string, number>, report: StudentReportRow) => {
      const programName = report.programName;
      acc[programName] = (acc[programName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return HttpResponse.json(createResponse({
      totalStudents,
      activeStudents,
      newRegistrations,
      programBreakdown: Object.entries(programBreakdown).map(([program, students]) => ({
        program,
        students,
      })),
      reports,
    }));
  }),
];

// Combine all handlers
// Learning Group handlers
export const learningGroupHandlers = [
  http.get("/api/learning-groups", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const sortBy = url.searchParams.get("sortBy") || "name";
    const sortOrder = url.searchParams.get("sortOrder") || "asc";
    
    let groups = db.getLearningGroups();
    
    // Apply search filter
    if (search) {
      groups = groups.filter(group => 
        group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.description.toLowerCase().includes(search.toLowerCase()) ||
        group.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (status) {
      groups = groups.filter(group => group.status === status);
    }
    
    // Apply sorting
    groups.sort((a, b) => {
      let aValue: any = a[sortBy as keyof LearningGroup];
      let bValue: any = b[sortBy as keyof LearningGroup];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });
    
    return HttpResponse.json(groups);
  }),

  http.get("/api/learning-groups/:id", ({ params }) => {
    const group = db.getLearningGroupById(params.id as string);
    if (!group) {
      return HttpResponse.json({ error: "Learning group not found" }, { status: 404 });
    }
    return HttpResponse.json(group);
  }),

  http.post("/api/learning-groups", async ({ request }) => {
    const groupData = await request.json() as Omit<LearningGroup, "id" | "createdAt" | "updatedAt">;
    const newGroup = db.createLearningGroup(groupData);
    return HttpResponse.json(newGroup, { status: 201 });
  }),

  http.put("/api/learning-groups/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<LearningGroup>;
    const updatedGroup = db.updateLearningGroup(params.id as string, updates);
    if (!updatedGroup) {
      return HttpResponse.json({ error: "Learning group not found" }, { status: 404 });
    }
    return HttpResponse.json(updatedGroup);
  }),

  http.delete("/api/learning-groups/:id", ({ params }) => {
    const success = db.deleteLearningGroup(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Learning group not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Learning group deleted successfully" });
  }),

  // Add student to learning group
  http.post("/api/learning-groups/:id/students", async ({ params, request }) => {
    const studentData = await request.json() as {
      studentId: string;
      startDate: string;
      endDate: string;
      productId: string;
      paymentStatus: "pending" | "paid" | "partial" | "overdue";
      enrollmentDate: string;
    };
    const group = db.getLearningGroupById(params.id as string);
    if (!group) {
      return HttpResponse.json({ error: "Learning group not found" }, { status: 404 });
    }
    
    // Add student to group
    const updatedGroup = db.updateLearningGroup(params.id as string, {
      students: [...group.students, studentData],
      studentIds: [...group.studentIds, studentData.studentId],
    });
    
    return HttpResponse.json(updatedGroup);
  }),

  // Remove student from learning group
  http.delete("/api/learning-groups/:id/students/:studentId", ({ params }) => {
    const group = db.getLearningGroupById(params.id as string);
    if (!group) {
      return HttpResponse.json({ error: "Learning group not found" }, { status: 404 });
    }
    
    const updatedGroup = db.updateLearningGroup(params.id as string, {
      students: group.students.filter(s => s.studentId !== params.studentId),
      studentIds: group.studentIds.filter(id => id !== params.studentId),
    });
    
    return HttpResponse.json(updatedGroup);
  }),
];

export const handlers = [
  ...programHandlers,
  ...subProgramHandlers,
  ...studentHandlers,
  ...teacherHandlers,
  ...learningGroupHandlers,
  ...orderHandlers,
  ...dashboardHandlers,
  ...reportHandlers,
];
