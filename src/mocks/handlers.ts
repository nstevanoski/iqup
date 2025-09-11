import { http, HttpResponse } from "msw";
import { db } from "./db";
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
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
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

// Programs handlers - REMOVED: Now using real API
// export const programHandlers = [];

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

      // Enforce pricing model restrictions: only program_price or subscription
      const allowedModels = new Set(["program_price", "subscription"]);
      if (!allowedModels.has(subProgramData.pricingModel as string)) {
        return HttpResponse.json(
          { success: false, message: "Invalid pricing model. Use 'program_price' or 'subscription'." },
          { status: 400 }
        );
      }

      // Validate required fields based on pricing model
      if (subProgramData.pricingModel === "program_price") {
        if (!subProgramData.coursePrice || subProgramData.coursePrice <= 0) {
          return HttpResponse.json(
            { success: false, message: "Course price is required and must be > 0 for Program Price." },
            { status: 400 }
          );
        }
        // Clear non-applicable fields
        (subProgramData as any).pricePerMonth = undefined;
        (subProgramData as any).numberOfPayments = undefined;
        (subProgramData as any).gap = undefined;
      } else if (subProgramData.pricingModel === "subscription") {
        if (!subProgramData.pricePerMonth || subProgramData.pricePerMonth <= 0) {
          return HttpResponse.json(
            { success: false, message: "Price per month is required and must be > 0 for Subscription." },
            { status: 400 }
          );
        }
        // Clear non-applicable fields
        (subProgramData as any).coursePrice = 0;
        (subProgramData as any).numberOfPayments = undefined;
        (subProgramData as any).gap = undefined;
      }

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

      if (updates.pricingModel) {
        const allowedModels = new Set(["program_price", "subscription"]);
        if (!allowedModels.has(updates.pricingModel as string)) {
          return HttpResponse.json(
            { success: false, message: "Invalid pricing model. Use 'program_price' or 'subscription'." },
            { status: 400 }
          );
        }
      }

      if (updates.pricingModel === "program_price") {
        if (updates.coursePrice !== undefined && updates.coursePrice <= 0) {
          return HttpResponse.json(
            { success: false, message: "Course price must be > 0 for Program Price." },
            { status: 400 }
          );
        }
        updates.pricePerMonth = undefined;
        updates.numberOfPayments = undefined;
        updates.gap = undefined;
      } else if (updates.pricingModel === "subscription") {
        if (updates.pricePerMonth !== undefined && updates.pricePerMonth <= 0) {
          return HttpResponse.json(
            { success: false, message: "Price per month must be > 0 for Subscription." },
            { status: 400 }
          );
        }
        updates.coursePrice = 0;
        updates.numberOfPayments = undefined;
        updates.gap = undefined;
      }

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
        t.email.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    if (filters.status) {
      teachers = teachers.filter(t => t.status === filters.status);
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
      const teacherData = await request.json() as any;
      const newTeacher = db.createTeacher(teacherData);
      return HttpResponse.json(createResponse(newTeacher, "Teacher created successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Failed to create teacher" },
        { status: 400 }
      );
    }
  }),

  // Update teacher
  http.put("/api/teachers/:id", async ({ params, request }) => {
    try {
      const { id } = params;
      const updates = await request.json() as any;
      const updatedTeacher = db.updateTeacher(id as string, updates);
      
      if (!updatedTeacher) {
        return HttpResponse.json(
          { success: false, message: "Teacher not found" },
          { status: 404 }
        );
      }
      
      return HttpResponse.json(createResponse(updatedTeacher, "Teacher updated successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Failed to update teacher" },
        { status: 400 }
      );
    }
  }),

  // Delete teacher
  http.delete("/api/teachers/:id", ({ params }) => {
    const { id } = params;
    const deleted = db.deleteTeacher(id as string);
    
    if (!deleted) {
      return HttpResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(createResponse(null, "Teacher deleted successfully"));
  }),
];

// Student Payments handlers
export const paymentHandlers = [
  // Get student payments
  http.get("/api/students/:studentId/payments", ({ params }) => {
    const { studentId } = params;
    const payments = db.getStudentPayments(studentId as string);
    return HttpResponse.json(createResponse(payments));
  }),

  // Get all payments
  http.get("/api/payments", ({ request }) => {
    const url = new URL(request.url);
    const filters = parseQueryParams(url);
    
    let payments = db.getStudentPayments();
    
    // Apply filters
    if (filters.status) {
      payments = payments.filter(p => p.status === filters.status);
    }
    
    const month = url.searchParams.get("month");
    if (month) {
      payments = payments.filter(p => p.month === month);
    }
    
    if (filters.search) {
      payments = payments.filter(p => 
        p.learningGroupName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.reference?.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    return HttpResponse.json(createPaginatedResponse(
      payments,
      page,
      limit
    ));
  }),

  // Get payment by ID
  http.get("/api/payments/:id", ({ params }) => {
    const { id } = params;
    const payment = db.getPaymentById(id as string);
    
    if (!payment) {
      return HttpResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(createResponse(payment));
  }),

  // Create payment
  http.post("/api/payments", async ({ request }) => {
    try {
      const paymentData = await request.json() as any;
      const newPayment = db.createPayment(paymentData);
      return HttpResponse.json(createResponse(newPayment, "Payment created successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Failed to create payment" },
        { status: 400 }
      );
    }
  }),

  // Update payment
  http.put("/api/payments/:id", async ({ params, request }) => {
    try {
      const { id } = params;
      const updates = await request.json() as any;
      const updatedPayment = db.updatePayment(id as string, updates);
      
      if (!updatedPayment) {
        return HttpResponse.json(
          { success: false, message: "Payment not found" },
          { status: 404 }
        );
      }
      
      return HttpResponse.json(createResponse(updatedPayment, "Payment updated successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Failed to update payment" },
        { status: 400 }
      );
    }
  }),

  // Delete payment
  http.delete("/api/payments/:id", ({ params }) => {
    const { id } = params;
    const deleted = db.deletePayment(id as string);
    
    if (!deleted) {
      return HttpResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(createResponse(null, "Payment deleted successfully"));
  }),
];

// Student Certificates handlers
export const certificateHandlers = [
  // Get student certificates
  http.get("/api/students/:studentId/certificates", ({ params }) => {
    const { studentId } = params;
    const certificates = db.getStudentCertificates(studentId as string);
    return HttpResponse.json(createResponse(certificates));
  }),

  // Get all certificates
  http.get("/api/certificates", ({ request }) => {
    const url = new URL(request.url);
    const filters = parseQueryParams(url);
    
    let certificates = db.getStudentCertificates();
    
    // Apply filters
    if (filters.status) {
      certificates = certificates.filter(c => c.status === filters.status);
    }
    
    const programId = url.searchParams.get("programId");
    if (programId) {
      certificates = certificates.filter(c => c.programId === programId);
    }
    
    if (filters.search) {
      certificates = certificates.filter(c => 
        c.programName.toLowerCase().includes(filters.search!.toLowerCase()) ||
        c.certificateCode.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    return HttpResponse.json(createPaginatedResponse(
      certificates,
      page,
      limit
    ));
  }),

  // Get certificate by ID
  http.get("/api/certificates/:id", ({ params }) => {
    const { id } = params;
    const certificate = db.getCertificateById(id as string);
    
    if (!certificate) {
      return HttpResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(createResponse(certificate));
  }),

  // Create certificate
  http.post("/api/certificates", async ({ request }) => {
    try {
      const certData = await request.json() as any;
      const newCertificate = db.createCertificate(certData);
      return HttpResponse.json(createResponse(newCertificate, "Certificate created successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Failed to create certificate" },
        { status: 400 }
      );
    }
  }),

  // Update certificate
  http.put("/api/certificates/:id", async ({ params, request }) => {
    try {
      const { id } = params;
      const updates = await request.json() as any;
      const updatedCertificate = db.updateCertificate(id as string, updates);
      
      if (!updatedCertificate) {
        return HttpResponse.json(
          { success: false, message: "Certificate not found" },
          { status: 404 }
        );
      }
      
      return HttpResponse.json(createResponse(updatedCertificate, "Certificate updated successfully"));
    } catch (error) {
      return HttpResponse.json(
        { success: false, message: "Failed to update certificate" },
        { status: 400 }
      );
    }
  }),

  // Delete certificate
  http.delete("/api/certificates/:id", ({ params }) => {
    const { id } = params;
    const deleted = db.deleteCertificate(id as string);
    
    if (!deleted) {
      return HttpResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(createResponse(null, "Certificate deleted successfully"));
  }),
];

// Students handlers
export const studentHandlers = [
  // Get all students
  http.get("/api/students", ({ request }) => {
    const url = new URL(request.url);
    const filters = parseQueryParams(url);
    const userRole = url.searchParams.get("userRole") as "HQ" | "MF" | "LC" | "TT" | null;
    const userScope = url.searchParams.get("userScope");
    
    let students = db.getStudents();
    
    // Apply role-based filtering
    if (userRole === "MF" && userScope) {
      students = students.filter((s: Student) => {
        const franchise: any = (s as any).accountFranchise;
        const studentMfId: string | undefined = (s as any).mfId || (s as any).parentMfId;
        const studentMfName: string | undefined = (s as any).mfName;

        // Prefer ID-based checks when available
        const byId = Boolean(
          (studentMfId && studentMfId === userScope) ||
          (franchise && franchise.type === "MF" && franchise.id === userScope) ||
          (franchise && franchise.type === "LC" && franchise.parentMfId === userScope)
        );
        
        // Fallback to name-based checks
        const byName = Boolean(
          (studentMfName && studentMfName === userScope) ||
          (franchise && franchise.type === "MF" && franchise.name === userScope) ||
          (franchise && franchise.type === "LC" && studentMfName === userScope)
        );

        return byId || byName;
      });
    } else if (userRole === "LC" && userScope) {
      // LC sees only students under the LC scope
      students = students.filter((s: Student) => {
        const franchise: any = (s as any).accountFranchise;
        return Boolean(franchise && franchise.type === "LC" && (franchise.id === userScope || franchise.name === userScope));
      });
    }
    
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

// Product List handlers
export const productListHandlers = [
  http.get("/api/product-lists", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    let filteredLists = db.getProductLists();

    // Apply search filter
    if (search) {
      filteredLists = filteredLists.filter(list =>
        list.name.toLowerCase().includes(search.toLowerCase()) ||
        list.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      filteredLists = filteredLists.filter(list => list.status === status);
    }

    // Apply sorting
    filteredLists.sort((a, b) => {
      const aValue: any = a[sortBy as keyof typeof a];
      const bValue: any = b[sortBy as keyof typeof b];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return HttpResponse.json({
      data: filteredLists,
      total: filteredLists.length,
    });
  }),

  http.get("/api/product-lists/:id", ({ params }) => {
    const list = db.getProductListById(params.id as string);
    if (!list) {
      return HttpResponse.json({ error: "Product list not found" }, { status: 404 });
    }
    return HttpResponse.json(list);
  }),

  http.post("/api/product-lists", async ({ request }) => {
    const listData = await request.json() as Omit<ProductList, "id" | "createdAt" | "updatedAt">;
    const newList = db.createProductList(listData);
    return HttpResponse.json(newList, { status: 201 });
  }),

  http.put("/api/product-lists/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<ProductList>;
    const updatedList = db.updateProductList(params.id as string, updates);
    if (!updatedList) {
      return HttpResponse.json({ error: "Product list not found" }, { status: 404 });
    }
    return HttpResponse.json(updatedList);
  }),

  http.delete("/api/product-lists/:id", ({ params }) => {
    const success = db.deleteProductList(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Product list not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),
];

// Product Price handlers
export const productPriceHandlers = [
  http.get("/api/product-prices", ({ request }) => {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId") || "";
    const mfId = url.searchParams.get("mfId") || "";
    const lcId = url.searchParams.get("lcId") || "";
    const status = url.searchParams.get("status") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    let filteredPrices = db.getProductPrices();

    // Apply filters
    if (productId) {
      filteredPrices = filteredPrices.filter(price => price.productId === productId);
    }
    if (mfId) {
      filteredPrices = filteredPrices.filter(price => price.mfId === mfId);
    }
    if (lcId) {
      filteredPrices = filteredPrices.filter(price => price.lcId === lcId);
    }
    if (status) {
      filteredPrices = filteredPrices.filter(price => price.status === status);
    }

    // Apply sorting
    filteredPrices.sort((a, b) => {
      const aValue: any = a[sortBy as keyof typeof a];
      const bValue: any = b[sortBy as keyof typeof b];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return HttpResponse.json({
      data: filteredPrices,
      total: filteredPrices.length,
    });
  }),

  http.get("/api/product-prices/:id", ({ params }) => {
    const price = db.getProductPriceById(params.id as string);
    if (!price) {
      return HttpResponse.json({ error: "Product price not found" }, { status: 404 });
    }
    return HttpResponse.json(price);
  }),

  http.post("/api/product-prices", async ({ request }) => {
    const priceData = await request.json() as Omit<ProductPrice, "id" | "createdAt" | "updatedAt">;
    const newPrice = db.createProductPrice(priceData);
    return HttpResponse.json(newPrice, { status: 201 });
  }),

  http.put("/api/product-prices/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<ProductPrice>;
    const updatedPrice = db.updateProductPrice(params.id as string, updates);
    if (!updatedPrice) {
      return HttpResponse.json({ error: "Product price not found" }, { status: 404 });
    }
    return HttpResponse.json(updatedPrice);
  }),

  http.delete("/api/product-prices/:id", ({ params }) => {
    const success = db.deleteProductPrice(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Product price not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),
];

// Training Type Handlers
const trainingTypeHandlers = [
  http.get("/api/training-types", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "name";
    const sortOrder = url.searchParams.get("sortOrder") || "asc";
    const recordType = url.searchParams.get("recordType");
    const isActive = url.searchParams.get("isActive");

    let trainingTypes = db.getTrainingTypes();

    // Apply filters
    if (search) {
      trainingTypes = trainingTypes.filter((tt: TrainingType) => 
        tt.name.toLowerCase().includes(search.toLowerCase()) ||
        tt.description.toLowerCase().includes(search.toLowerCase()) ||
        tt.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (recordType) {
      trainingTypes = trainingTypes.filter((tt: TrainingType) => tt.recordType === recordType);
    }

    if (isActive !== null) {
      const activeFilter = isActive === "true";
      trainingTypes = trainingTypes.filter((tt: TrainingType) => tt.isActive === activeFilter);
    }

    // Apply sorting
    trainingTypes.sort((a: TrainingType, b: TrainingType) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = trainingTypes.slice(startIndex, endIndex);

    const response: PaginatedResponse<TrainingType> = {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: trainingTypes.length,
        totalPages: Math.ceil(trainingTypes.length / limit),
      },
    };

    return HttpResponse.json(response);
  }),

  http.get("/api/training-types/:id", ({ params }) => {
    const trainingType = db.getTrainingTypeById(params.id as string);
    if (!trainingType) {
      return HttpResponse.json({ error: "Training type not found" }, { status: 404 });
    }
    return HttpResponse.json(trainingType);
  }),

  http.post("/api/training-types", async ({ request }) => {
    const trainingTypeData = await request.json() as Omit<TrainingType, "id" | "createdAt" | "updatedAt">;
    const newTrainingType = db.createTrainingType(trainingTypeData);
    return HttpResponse.json(newTrainingType, { status: 201 });
  }),

  http.put("/api/training-types/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<TrainingType>;
    const updatedTrainingType = db.updateTrainingType(params.id as string, updates);
    if (!updatedTrainingType) {
      return HttpResponse.json({ error: "Training type not found" }, { status: 404 });
    }
    return HttpResponse.json(updatedTrainingType);
  }),

  http.delete("/api/training-types/:id", ({ params }) => {
    const success = db.deleteTrainingType(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Training type not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),
];

// Training Handlers
const trainingHandlers = [
  http.get("/api/trainings", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const sortBy = url.searchParams.get("sortBy") || "start";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const status = url.searchParams.get("status");
    const approvalStatus = url.searchParams.get("approvalStatus");
    const recordType = url.searchParams.get("recordType");
    const ownerId = url.searchParams.get("ownerId");

    let trainings = db.getTrainings();

    // Apply filters
    if (search) {
      trainings = trainings.filter((t: Training) => 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      trainings = trainings.filter((t: Training) => t.status === status);
    }

    if (approvalStatus) {
      trainings = trainings.filter((t: Training) => t.approvalStatus === approvalStatus);
    }

    if (recordType) {
      trainings = trainings.filter((t: Training) => t.recordType === recordType);
    }

    if (ownerId) {
      trainings = trainings.filter((t: Training) => t.owner.id === ownerId);
    }

    // Apply sorting
    trainings.sort((a: Training, b: Training) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === "asc" 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = trainings.slice(startIndex, endIndex);

    const response: PaginatedResponse<Training> = {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: trainings.length,
        totalPages: Math.ceil(trainings.length / limit),
      },
    };

    return HttpResponse.json(response);
  }),

  http.get("/api/trainings/:id", ({ params }) => {
    const training = db.getTrainingById(params.id as string);
    if (!training) {
      return HttpResponse.json({ error: "Training not found" }, { status: 404 });
    }
    return HttpResponse.json(training);
  }),

  http.post("/api/trainings", async ({ request }) => {
    const trainingData = await request.json() as Omit<Training, "id" | "createdAt" | "updatedAt">;
    const newTraining = db.createTraining(trainingData);
    return HttpResponse.json(newTraining, { status: 201 });
  }),

  http.put("/api/trainings/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<Training>;
    const updatedTraining = db.updateTraining(params.id as string, updates);
    if (!updatedTraining) {
      return HttpResponse.json({ error: "Training not found" }, { status: 404 });
    }
    return HttpResponse.json(updatedTraining);
  }),

  http.delete("/api/trainings/:id", ({ params }) => {
    const success = db.deleteTraining(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Training not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),

  // Training approval endpoints
  http.post("/api/trainings/:id/submit", ({ params }) => {
    const training = db.getTrainingById(params.id as string);
    if (!training) {
      return HttpResponse.json({ error: "Training not found" }, { status: 404 });
    }
    
    const updatedTraining = db.updateTraining(params.id as string, {
      approvalStatus: "submitted",
      submittedAt: new Date(),
    });
    
    return HttpResponse.json(updatedTraining);
  }),

  http.post("/api/trainings/:id/approve", async ({ params, request }) => {
    const training = db.getTrainingById(params.id as string);
    if (!training) {
      return HttpResponse.json({ error: "Training not found" }, { status: 404 });
    }
    
    const { approvedBy } = await request.json() as { approvedBy: string };
    const updatedTraining = db.updateTraining(params.id as string, {
      approvalStatus: "approved",
      approvedBy,
      approvedAt: new Date(),
    });
    
    return HttpResponse.json(updatedTraining);
  }),

  http.post("/api/trainings/:id/reject", async ({ params, request }) => {
    const training = db.getTrainingById(params.id as string);
    if (!training) {
      return HttpResponse.json({ error: "Training not found" }, { status: 404 });
    }
    
    const { approvedBy } = await request.json() as { approvedBy: string };
    const updatedTraining = db.updateTraining(params.id as string, {
      approvalStatus: "rejected",
      approvedBy,
      approvedAt: new Date(),
    });
    
    return HttpResponse.json(updatedTraining);
  }),
];

// Training Registration Handlers
const trainingRegistrationHandlers = [
  http.get("/api/training-registrations", ({ request }) => {
    const url = new URL(request.url);
    const trainingId = url.searchParams.get("trainingId");
    const teacherId = url.searchParams.get("teacherId");
    const status = url.searchParams.get("status");

    let registrations = db.getTrainingRegistrations();

    if (trainingId) {
      registrations = registrations.filter(reg => reg.trainingId === trainingId);
    }

    if (teacherId) {
      registrations = registrations.filter(reg => reg.teacherId === teacherId);
    }

    if (status) {
      registrations = registrations.filter(reg => reg.status === status);
    }

    return HttpResponse.json(registrations);
  }),

  http.get("/api/training-registrations/:id", ({ params }) => {
    const registration = db.getTrainingRegistrationById(params.id as string);
    if (!registration) {
      return HttpResponse.json({ error: "Training registration not found" }, { status: 404 });
    }
    return HttpResponse.json(registration);
  }),

  http.post("/api/training-registrations", async ({ request }) => {
    const registrationData = await request.json() as Omit<TrainingRegistration, "id" | "createdAt" | "updatedAt">;
    const newRegistration = db.createTrainingRegistration(registrationData);
    return HttpResponse.json(newRegistration, { status: 201 });
  }),

  http.put("/api/training-registrations/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<TrainingRegistration>;
    const updatedRegistration = db.updateTrainingRegistration(params.id as string, updates);
    if (!updatedRegistration) {
      return HttpResponse.json({ error: "Training registration not found" }, { status: 404 });
    }
    return HttpResponse.json(updatedRegistration);
  }),

  http.delete("/api/training-registrations/:id", ({ params }) => {
    const success = db.deleteTrainingRegistration(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Training registration not found" }, { status: 404 });
    }
    return HttpResponse.json({ success: true });
  }),

  // TT marking endpoints
  http.post("/api/training-registrations/:id/mark-pass", async ({ params, request }) => {
    const { gradedBy, feedback } = await request.json() as { gradedBy: string; feedback?: string };
    
    const updatedRegistration = db.updateTrainingRegistration(params.id as string, {
      status: "completed",
      assessment: {
        passed: true,
        feedback,
        gradedBy,
        gradedAt: new Date(),
      },
    });
    
    if (!updatedRegistration) {
      return HttpResponse.json({ error: "Training registration not found" }, { status: 404 });
    }
    
    return HttpResponse.json(updatedRegistration);
  }),

  http.post("/api/training-registrations/:id/mark-fail", async ({ params, request }) => {
    const { gradedBy, feedback } = await request.json() as { gradedBy: string; feedback?: string };
    
    const updatedRegistration = db.updateTrainingRegistration(params.id as string, {
      status: "failed",
      assessment: {
        passed: false,
        feedback,
        gradedBy,
        gradedAt: new Date(),
      },
    });
    
    if (!updatedRegistration) {
      return HttpResponse.json({ error: "Training registration not found" }, { status: 404 });
    }
    
    return HttpResponse.json(updatedRegistration);
  }),
];

// Teacher Trainer Account Handlers
const teacherTrainerHandlers = [
  http.get("/api/teacher-trainers", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let teacherTrainers = db.getTeacherTrainerAccounts();

    // Filter by search
    if (search) {
      teacherTrainers = teacherTrainers.filter((tt) =>
        tt.firstName.toLowerCase().includes(search.toLowerCase()) ||
        tt.lastName.toLowerCase().includes(search.toLowerCase()) ||
        tt.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (status) {
      teacherTrainers = teacherTrainers.filter((tt) => tt.status === status);
    }

    // Sort
    teacherTrainers.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (sortOrder === "asc") {
        return (aValue || "") > (bValue || "") ? 1 : -1;
      } else {
        return (aValue || "") < (bValue || "") ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = teacherTrainers.slice(startIndex, endIndex);

    const response = {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: teacherTrainers.length,
        totalPages: Math.ceil(teacherTrainers.length / limit),
      },
    };

    return HttpResponse.json(response);
  }),

  http.get("/api/teacher-trainers/:id", ({ params }) => {
    const teacherTrainer = db.getTeacherTrainerAccountById(params.id as string);
    
    if (!teacherTrainer) {
      return HttpResponse.json(
        { error: "Teacher trainer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: teacherTrainer });
  }),

  http.post("/api/teacher-trainers", async ({ request }) => {
    const data = await request.json() as Partial<TeacherTrainerAccount>;
    
    const teacherTrainer = db.createTeacherTrainerAccount({
      ...data,
      role: "TT",
    } as Omit<TeacherTrainerAccount, "id" | "createdAt" | "updatedAt">);

    return HttpResponse.json({ data: teacherTrainer }, { status: 201 });
  }),

  http.put("/api/teacher-trainers/:id", async ({ params, request }) => {
    const data = await request.json() as Partial<TeacherTrainerAccount>;
    
    const teacherTrainer = db.updateTeacherTrainerAccount(params.id as string, data);
    
    if (!teacherTrainer) {
      return HttpResponse.json(
        { error: "Teacher trainer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: teacherTrainer });
  }),

  http.delete("/api/teacher-trainers/:id", ({ params }) => {
    const success = db.deleteTeacherTrainerAccount(params.id as string);
    
    if (!success) {
      return HttpResponse.json(
        { error: "Teacher trainer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ message: "Teacher trainer deleted successfully" });
  }),

  // Get assigned trainings for a TT
  http.get("/api/teacher-trainers/:id/trainings", ({ params }) => {
    const ttId = params.id as string;
    const trainings = db.getTrainings().filter(training => 
      training.teacherTrainer.id === ttId || training.assistant?.id === ttId
    );

    return HttpResponse.json({ data: trainings });
  }),

  // Update TT status for a training
  http.put("/api/teacher-trainers/:id/trainings/:trainingId/status", async ({ params, request }) => {
    const { trainingId } = params;
    const { ttStatus, ttComments } = await request.json() as { ttStatus: string; ttComments: string };
    
    const training = db.updateTraining(trainingId as string, {
      ttStatus: ttStatus as "pending" | "in_progress" | "completed" | "failed",
      ttComments,
    });
    
    if (!training) {
      return HttpResponse.json(
        { error: "Training not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: training });
  }),
];

// Account Handlers
const accountHandlers = [
  http.get("/api/accounts", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const type = url.searchParams.get("type") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let filteredAccounts = db.getAccounts();

    // Filter by search
    if (search) {
      filteredAccounts = filteredAccounts.filter((acc: Account) =>
        acc.name.toLowerCase().includes(search.toLowerCase()) ||
        acc.contactInfo.email.toLowerCase().includes(search.toLowerCase()) ||
        acc.owner.firstName.toLowerCase().includes(search.toLowerCase()) ||
        acc.owner.lastName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (status) {
      filteredAccounts = filteredAccounts.filter((acc: Account) => acc.status === status);
    }

    // Filter by type
    if (type) {
      filteredAccounts = filteredAccounts.filter((acc: Account) => acc.type === type);
    }

    // Sort
    filteredAccounts.sort((a: Account, b: Account) => {
      const aValue = (a[sortBy as keyof Account] as any) || "";
      const bValue = (b[sortBy as keyof Account] as any) || "";
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedAccounts,
      total: filteredAccounts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredAccounts.length / limit),
    });
  }),

  http.get("/api/accounts/:id", ({ params }) => {
    const account = db.getAccountById(params.id as string);
    if (!account) {
      return HttpResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: account });
  }),

  http.post("/api/accounts", async ({ request }) => {
    const accountData = await request.json() as Omit<Account, "id" | "createdAt" | "updatedAt">;
    const newAccount = db.createAccount(accountData);
    return HttpResponse.json({ data: newAccount }, { status: 201 });
  }),

  http.put("/api/accounts/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<Account>;
    const updatedAccount = db.updateAccount(params.id as string, updates);
    if (!updatedAccount) {
      return HttpResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: updatedAccount });
  }),

  http.delete("/api/accounts/:id", ({ params }) => {
    const success = db.deleteAccount(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Account deleted successfully" });
  }),
];

// Application Handlers
const applicationHandlers = [
  http.get("/api/applications", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const type = url.searchParams.get("type") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let filteredApplications = db.getApplications();

    // Filter by search
    if (search) {
      filteredApplications = filteredApplications.filter((app: Application) =>
        app.applicantInfo.firstName.toLowerCase().includes(search.toLowerCase()) ||
        app.applicantInfo.lastName.toLowerCase().includes(search.toLowerCase()) ||
        app.applicantInfo.email.toLowerCase().includes(search.toLowerCase()) ||
        app.businessInfo.businessName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (status) {
      filteredApplications = filteredApplications.filter((app: Application) => app.status === status);
    }

    // Filter by type
    if (type) {
      filteredApplications = filteredApplications.filter((app: Application) => app.applicationType === type);
    }

    // Sort
    filteredApplications.sort((a: Application, b: Application) => {
      const aValue = (a[sortBy as keyof Application] as any) || "";
      const bValue = (b[sortBy as keyof Application] as any) || "";
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedApplications,
      total: filteredApplications.length,
      page,
      limit,
      totalPages: Math.ceil(filteredApplications.length / limit),
    });
  }),

  http.get("/api/applications/:id", ({ params }) => {
    const application = db.getApplicationById(params.id as string);
    if (!application) {
      return HttpResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: application });
  }),

  http.post("/api/applications", async ({ request }) => {
    const applicationData = await request.json() as Omit<Application, "id" | "createdAt" | "updatedAt">;
    const newApplication = db.createApplication(applicationData);
    return HttpResponse.json({ data: newApplication }, { status: 201 });
  }),

  http.put("/api/applications/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<Application>;
    const updatedApplication = db.updateApplication(params.id as string, updates);
    if (!updatedApplication) {
      return HttpResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: updatedApplication });
  }),

  http.delete("/api/applications/:id", ({ params }) => {
    const success = db.deleteApplication(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Application deleted successfully" });
  }),

  // Application approval workflow
  http.post("/api/applications/:id/approve", async ({ params, request }) => {
    const reviewInfo = await request.json() as Application["reviewInfo"];
    const approvedApplication = db.approveApplication(params.id as string, reviewInfo);
    if (!approvedApplication) {
      return HttpResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: approvedApplication });
  }),

  http.post("/api/applications/:id/reject", async ({ params, request }) => {
    const reviewInfo = await request.json() as Application["reviewInfo"];
    const rejectedApplication = db.rejectApplication(params.id as string, reviewInfo);
    if (!rejectedApplication) {
      return HttpResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: rejectedApplication });
  }),
];

// Royalty Report Handlers
const royaltyHandlers = [
  http.get("/api/royalty-reports", ({ request }) => {
    const url = new URL(request.url);
    const periodType = url.searchParams.get("periodType") || "";
    const startDate = url.searchParams.get("startDate") || "";
    const endDate = url.searchParams.get("endDate") || "";
    const sortBy = url.searchParams.get("sortBy") || "generatedAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let filteredReports = db.getRoyaltyCommissionReports();

    // Filter by period type
    if (periodType) {
      filteredReports = filteredReports.filter((report: RoyaltyCommissionReport) => report.period.type === periodType);
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredReports = filteredReports.filter((report: RoyaltyCommissionReport) => 
        report.period.startDate >= start && report.period.endDate <= end
      );
    }

    // Sort
    filteredReports.sort((a: RoyaltyCommissionReport, b: RoyaltyCommissionReport) => {
      const aValue = (a[sortBy as keyof RoyaltyCommissionReport] as any) || "";
      const bValue = (b[sortBy as keyof RoyaltyCommissionReport] as any) || "";
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReports = filteredReports.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedReports,
      total: filteredReports.length,
      page,
      limit,
      totalPages: Math.ceil(filteredReports.length / limit),
    });
  }),

  http.get("/api/royalty-reports/:id", ({ params }) => {
    const report = db.getRoyaltyCommissionReportById(params.id as string);
    if (!report) {
      return HttpResponse.json({ error: "Royalty report not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: report });
  }),

  http.post("/api/royalty-reports", async ({ request }) => {
    const reportData = await request.json() as Omit<RoyaltyCommissionReport, "id" | "generatedAt">;
    const newReport = db.createRoyaltyCommissionReport(reportData);
    return HttpResponse.json({ data: newReport }, { status: 201 });
  }),

  http.put("/api/royalty-reports/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<RoyaltyCommissionReport>;
    const updatedReport = db.updateRoyaltyCommissionReport(params.id as string, updates);
    if (!updatedReport) {
      return HttpResponse.json({ error: "Royalty report not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: updatedReport });
  }),

  http.delete("/api/royalty-reports/:id", ({ params }) => {
    const success = db.deleteRoyaltyCommissionReport(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Royalty report not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Royalty report deleted successfully" });
  }),

  // Royalty Calculations
  http.get("/api/royalty-calculations", ({ request }) => {
    const url = new URL(request.url);
    const lcId = url.searchParams.get("lcId") || "";
    const mfId = url.searchParams.get("mfId") || "";
    const status = url.searchParams.get("status") || "";
    const sortBy = url.searchParams.get("sortBy") || "calculatedAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let filteredCalculations = db.getRoyaltyCalculations();

    // Filter by LC ID
    if (lcId) {
      filteredCalculations = filteredCalculations.filter((calc: RoyaltyCommissionCalculation) => calc.lcId === lcId);
    }

    // Filter by MF ID
    if (mfId) {
      filteredCalculations = filteredCalculations.filter((calc: RoyaltyCommissionCalculation) => calc.mfId === mfId);
    }

    // Filter by status
    if (status) {
      filteredCalculations = filteredCalculations.filter((calc: RoyaltyCommissionCalculation) => calc.status === status);
    }

    // Sort
    filteredCalculations.sort((a: RoyaltyCommissionCalculation, b: RoyaltyCommissionCalculation) => {
      const aValue = (a[sortBy as keyof RoyaltyCommissionCalculation] as any) || "";
      const bValue = (b[sortBy as keyof RoyaltyCommissionCalculation] as any) || "";
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCalculations = filteredCalculations.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedCalculations,
      total: filteredCalculations.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCalculations.length / limit),
    });
  }),

  http.get("/api/royalty-calculations/:id", ({ params }) => {
    const calculation = db.getRoyaltyCalculationById(params.id as string);
    if (!calculation) {
      return HttpResponse.json({ error: "Royalty calculation not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: calculation });
  }),

  http.post("/api/royalty-calculations", async ({ request }) => {
    const calculationData = await request.json() as Omit<RoyaltyCommissionCalculation, "id" | "calculatedAt">;
    const newCalculation = db.createRoyaltyCalculation(calculationData);
    return HttpResponse.json({ data: newCalculation }, { status: 201 });
  }),

  http.put("/api/royalty-calculations/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<RoyaltyCommissionCalculation>;
    const updatedCalculation = db.updateRoyaltyCalculation(params.id as string, updates);
    if (!updatedCalculation) {
      return HttpResponse.json({ error: "Royalty calculation not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: updatedCalculation });
  }),

  http.delete("/api/royalty-calculations/:id", ({ params }) => {
    const success = db.deleteRoyaltyCalculation(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Royalty calculation not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Royalty calculation deleted successfully" });
  }),

  // Royalty Summaries
  http.get("/api/royalty-summaries", ({ request }) => {
    const url = new URL(request.url);
    const mfId = url.searchParams.get("mfId") || "";
    const status = url.searchParams.get("status") || "";
    const sortBy = url.searchParams.get("sortBy") || "calculatedAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let filteredSummaries = db.getRoyaltySummaries();

    // Filter by MF ID
    if (mfId) {
      filteredSummaries = filteredSummaries.filter((summary: RoyaltyCommissionSummary) => summary.mfId === mfId);
    }

    // Filter by status
    if (status) {
      filteredSummaries = filteredSummaries.filter((summary: RoyaltyCommissionSummary) => summary.status === status);
    }

    // Sort
    filteredSummaries.sort((a: RoyaltyCommissionSummary, b: RoyaltyCommissionSummary) => {
      const aValue = (a[sortBy as keyof RoyaltyCommissionSummary] as any) || "";
      const bValue = (b[sortBy as keyof RoyaltyCommissionSummary] as any) || "";
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSummaries = filteredSummaries.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedSummaries,
      total: filteredSummaries.length,
      page,
      limit,
      totalPages: Math.ceil(filteredSummaries.length / limit),
    });
  }),

  http.get("/api/royalty-summaries/:id", ({ params }) => {
    const summary = db.getRoyaltySummaryById(params.id as string);
    if (!summary) {
      return HttpResponse.json({ error: "Royalty summary not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: summary });
  }),

  http.post("/api/royalty-summaries", async ({ request }) => {
    const summaryData = await request.json() as Omit<RoyaltyCommissionSummary, "id" | "calculatedAt">;
    const newSummary = db.createRoyaltySummary(summaryData);
    return HttpResponse.json({ data: newSummary }, { status: 201 });
  }),

  http.put("/api/royalty-summaries/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<RoyaltyCommissionSummary>;
    const updatedSummary = db.updateRoyaltySummary(params.id as string, updates);
    if (!updatedSummary) {
      return HttpResponse.json({ error: "Royalty summary not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: updatedSummary });
  }),

  http.delete("/api/royalty-summaries/:id", ({ params }) => {
    const success = db.deleteRoyaltySummary(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Royalty summary not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Royalty summary deleted successfully" });
  }),

  // Commission calculation endpoint
  http.post("/api/royalty-calculations/calculate", async ({ request }) => {
    const { studentCount, revenue } = await request.json() as { studentCount: number; revenue: number };
    
    const lcToMfCommission = db.calculateLcToMfCommission(studentCount, revenue);
    const mfToHqCommission = db.calculateMfToHqCommission(lcToMfCommission.total);
    
    return HttpResponse.json({
      data: {
        lcToMfCommission,
        mfToHqCommission,
      },
    });
  }),
];

// Student Report Handlers
const studentReportHandlers = [
  http.get("/api/student-reports", ({ request }) => {
    const url = new URL(request.url);
    const lcId = url.searchParams.get("lcId") || "";
    const programId = url.searchParams.get("programId") || "";
    const country = url.searchParams.get("country") || "";
    const city = url.searchParams.get("city") || "";
    const status = url.searchParams.get("status") || "";
    const ageMin = url.searchParams.get("ageMin") || "";
    const ageMax = url.searchParams.get("ageMax") || "";
    const enrollmentStart = url.searchParams.get("enrollmentStart") || "";
    const enrollmentEnd = url.searchParams.get("enrollmentEnd") || "";
    const sortBy = url.searchParams.get("sortBy") || "studentName";
    const sortOrder = url.searchParams.get("sortOrder") || "asc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Build filters object
    const filters: StudentReportFilter = {};
    if (lcId) filters.lcId = lcId;
    if (programId) filters.programId = programId;
    if (country) filters.country = country;
    if (city) filters.city = city;
    if (status) filters.status = status as any;
    if (ageMin || ageMax) {
      filters.ageRange = {
        min: parseInt(ageMin) || 0,
        max: parseInt(ageMax) || 100,
      };
    }
    if (enrollmentStart && enrollmentEnd) {
      filters.enrollmentDate = {
        start: new Date(enrollmentStart),
        end: new Date(enrollmentEnd),
      };
    }

    let filteredData = db.getStudentReportDataByFilters(filters);

    // Sort
    filteredData.sort((a: StudentReportData, b: StudentReportData) => {
      const aValue = (a[sortBy as keyof StudentReportData] as any) || "";
      const bValue = (b[sortBy as keyof StudentReportData] as any) || "";
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedData,
      total: filteredData.length,
      page,
      limit,
      totalPages: Math.ceil(filteredData.length / limit),
    });
  }),

  http.get("/api/student-reports/:id", ({ params }) => {
    const data = db.getStudentReportDataById(params.id as string);
    if (!data) {
      return HttpResponse.json({ error: "Student report data not found" }, { status: 404 });
    }
    return HttpResponse.json({ data });
  }),

  // Generic Report Config Handlers
  http.get("/api/report-configs", ({ request }) => {
    const url = new URL(request.url);
    const entityType = url.searchParams.get("entityType") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let filteredConfigs = db.getGenericReportConfigs();

    // Filter by entity type
    if (entityType) {
      filteredConfigs = filteredConfigs.filter((config: GenericReportConfig) => config.entityType === entityType);
    }

    // Sort
    filteredConfigs.sort((a: GenericReportConfig, b: GenericReportConfig) => {
      const aValue = (a[sortBy as keyof GenericReportConfig] as any) || "";
      const bValue = (b[sortBy as keyof GenericReportConfig] as any) || "";
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedConfigs = filteredConfigs.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedConfigs,
      total: filteredConfigs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredConfigs.length / limit),
    });
  }),

  http.get("/api/report-configs/:id", ({ params }) => {
    const config = db.getGenericReportConfigById(params.id as string);
    if (!config) {
      return HttpResponse.json({ error: "Report config not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: config });
  }),

  http.post("/api/report-configs", async ({ request }) => {
    const configData = await request.json() as Omit<GenericReportConfig, "id" | "createdAt" | "updatedAt">;
    const newConfig = db.createGenericReportConfig(configData);
    return HttpResponse.json({ data: newConfig }, { status: 201 });
  }),

  http.put("/api/report-configs/:id", async ({ params, request }) => {
    const updates = await request.json() as Partial<GenericReportConfig>;
    const updatedConfig = db.updateGenericReportConfig(params.id as string, updates);
    if (!updatedConfig) {
      return HttpResponse.json({ error: "Report config not found" }, { status: 404 });
    }
    return HttpResponse.json({ data: updatedConfig });
  }),

  http.delete("/api/report-configs/:id", ({ params }) => {
    const success = db.deleteGenericReportConfig(params.id as string);
    if (!success) {
      return HttpResponse.json({ error: "Report config not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Report config deleted successfully" });
  }),

  // CSV Export endpoint
  http.post("/api/student-reports/export", async ({ request }) => {
    const { filters, format = "csv" } = await request.json() as { 
      filters: StudentReportFilter; 
      format: "csv" | "excel" 
    };
    
    const data = db.getStudentReportDataByFilters(filters);
    
    // In a real app, this would generate and return the actual CSV/Excel file
    return HttpResponse.json({
      data: {
        downloadUrl: `/api/downloads/student-report-${Date.now()}.${format}`,
        recordCount: data.length,
        generatedAt: new Date(),
      },
    });
  }),
];

// Authentication Handlers
const authHandlers = [
  // Login endpoint
  http.post("/api/auth/login", async ({ request }) => {
    try {
      const credentials = await request.json() as LoginCredentials;
      const response = db.authenticateUser(credentials);
      
      if (response.success && response.user && response.token) {
        return HttpResponse.json({
          success: true,
          data: {
            user: response.user,
            token: response.token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
          message: response.message,
        });
      } else {
        return HttpResponse.json({
          success: false,
          error: response.error,
        }, { status: 401 });
      }
    } catch (error) {
      return HttpResponse.json({
        success: false,
        error: "Invalid request format",
      }, { status: 400 });
    }
  }),

  // Get current user
  http.get("/api/auth/me", ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        error: "No authentication token provided",
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    // In a real app, you'd validate the JWT token here
    // For now, we'll extract user ID from the mock token
    const userId = token.split("_")[2]; // mock_token_userId_timestamp
    const user = db.getUserById(userId);
    
    if (!user) {
      return HttpResponse.json({
        success: false,
        error: "Invalid token",
      }, { status: 401 });
    }

    return HttpResponse.json({
      success: true,
      data: user,
    });
  }),

  // Logout endpoint
  http.post("/api/auth/logout", () => {
    return HttpResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }),

  // Get all users (HQ only)
  http.get("/api/auth/users", ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        error: "No authentication token provided",
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const userId = token.split("_")[2];
    const user = db.getUserById(userId);
    
    if (!user || user.role !== "HQ") {
      return HttpResponse.json({
        success: false,
        error: "Insufficient permissions",
      }, { status: 403 });
    }

    const users = db.getAllUsers();
    return HttpResponse.json({
      success: true,
      data: users,
    });
  }),

  // Get users by role
  http.get("/api/auth/users/role/:role", ({ params, request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        error: "No authentication token provided",
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const userId = token.split("_")[2];
    const user = db.getUserById(userId);
    
    if (!user || (user.role !== "HQ" && user.role !== "MF")) {
      return HttpResponse.json({
        success: false,
        error: "Insufficient permissions",
      }, { status: 403 });
    }

    const role = params.role as "HQ" | "MF" | "LC" | "TT";
    const users = db.getUsersByRole(role);
    return HttpResponse.json({
      success: true,
      data: users,
    });
  }),

  // Create new user (HQ only)
  http.post("/api/auth/users", async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        error: "No authentication token provided",
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const userId = token.split("_")[2];
    const user = db.getUserById(userId);
    
    if (!user || user.role !== "HQ") {
      return HttpResponse.json({
        success: false,
        error: "Insufficient permissions",
      }, { status: 403 });
    }

    try {
      const userData = await request.json() as Omit<AuthUser, "id" | "createdAt" | "updatedAt">;
      const newUser = db.createUser(userData);
      return HttpResponse.json({
        success: true,
        data: newUser,
        message: "User created successfully",
      }, { status: 201 });
    } catch (error) {
      return HttpResponse.json({
        success: false,
        error: "Invalid user data",
      }, { status: 400 });
    }
  }),

  // Update user
  http.put("/api/auth/users/:id", async ({ params, request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        error: "No authentication token provided",
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const userId = token.split("_")[2];
    const user = db.getUserById(userId);
    
    if (!user || (user.role !== "HQ" && user.id !== params.id)) {
      return HttpResponse.json({
        success: false,
        error: "Insufficient permissions",
      }, { status: 403 });
    }

    try {
      const updates = await request.json() as Partial<Omit<AuthUser, "id" | "createdAt">>;
      const updatedUser = db.updateUser(params.id as string, updates);
      
      if (!updatedUser) {
        return HttpResponse.json({
          success: false,
          error: "User not found",
        }, { status: 404 });
      }

      return HttpResponse.json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      return HttpResponse.json({
        success: false,
        error: "Invalid user data",
      }, { status: 400 });
    }
  }),

  // Delete user (HQ only)
  http.delete("/api/auth/users/:id", ({ params, request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({
        success: false,
        error: "No authentication token provided",
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const userId = token.split("_")[2];
    const user = db.getUserById(userId);
    
    if (!user || user.role !== "HQ") {
      return HttpResponse.json({
        success: false,
        error: "Insufficient permissions",
      }, { status: 403 });
    }

    const success = db.deleteUser(params.id as string);
    if (!success) {
      return HttpResponse.json({
        success: false,
        error: "User not found",
      }, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  }),
];

// Dashboard Handlers
const dashboardHandlers = [
  http.get("/api/dashboard/:role", ({ params }) => {
    const role = params.role as "HQ" | "MF" | "LC" | "TT";
    const dashboardData = db.getDashboardData(role);
    return HttpResponse.json({ data: dashboardData });
  }),

  http.get("/api/dashboard/:role/metrics", ({ params }) => {
    const role = params.role as "HQ" | "MF" | "LC" | "TT";
    const dashboardData = db.getDashboardData(role);
    return HttpResponse.json({ data: dashboardData.metrics });
  }),

  http.put("/api/dashboard/:role/metrics", async ({ params, request }) => {
    const role = params.role as "HQ" | "MF" | "LC" | "TT";
    const updates = await request.json() as Partial<DashboardMetrics>;
    const updatedMetrics = db.updateDashboardMetrics(role, updates);
    return HttpResponse.json({ data: updatedMetrics });
  }),

  http.get("/api/dashboard/:role/activities", ({ params }) => {
    const role = params.role as "HQ" | "MF" | "LC" | "TT";
    const dashboardData = db.getDashboardData(role);
    return HttpResponse.json({ data: dashboardData.activities });
  }),

  http.post("/api/dashboard/:role/activities", async ({ params, request }) => {
    const role = params.role as "HQ" | "MF" | "LC" | "TT";
    const activityData = await request.json() as Omit<DashboardActivity, "id">;
    const newActivity = db.addDashboardActivity(role, activityData);
    return HttpResponse.json({ data: newActivity }, { status: 201 });
  }),

  http.get("/api/dashboard/:role/charts", ({ params }) => {
    const role = params.role as "HQ" | "MF" | "LC" | "TT";
    const dashboardData = db.getDashboardData(role);
    return HttpResponse.json({ data: dashboardData.charts });
  }),

  http.get("/api/dashboard/:role/quick-actions", ({ params }) => {
    const role = params.role as "HQ" | "MF" | "LC" | "TT";
    const dashboardData = db.getDashboardData(role);
    return HttpResponse.json({ data: dashboardData.quickActions });
  }),
];

export const handlers = [
  ...authHandlers,
  // ...programHandlers, // REMOVED: Now using real API
  ...subProgramHandlers,
  ...studentHandlers,
  ...paymentHandlers,
  ...certificateHandlers,
  ...teacherHandlers,
  ...learningGroupHandlers,
  ...productListHandlers,
  ...productPriceHandlers,
  ...orderHandlers,
  ...dashboardHandlers,
  ...reportHandlers,
  ...trainingTypeHandlers,
  ...trainingHandlers,
  ...trainingRegistrationHandlers,
  ...teacherTrainerHandlers,
  ...accountHandlers,
  ...applicationHandlers,
  ...royaltyHandlers,
  ...studentReportHandlers,
];
