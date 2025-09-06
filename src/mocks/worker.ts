import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";

// Mock API handlers
const handlers = [
  // Auth endpoints
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    // Mock authentication logic
    if (email === "hq@example.com" && password === "password") {
      return HttpResponse.json({
        user: {
          id: "1",
          name: "HQ Admin",
          role: "HQ",
          email: "hq@example.com",
        },
        token: "mock-jwt-token-hq",
      });
    }
    
    if (email === "mf@example.com" && password === "password") {
      return HttpResponse.json({
        user: {
          id: "2",
          name: "MF Manager",
          role: "MF",
          email: "mf@example.com",
        },
        token: "mock-jwt-token-mf",
      });
    }
    
    if (email === "lc@example.com" && password === "password") {
      return HttpResponse.json({
        user: {
          id: "3",
          name: "LC Coordinator",
          role: "LC",
          email: "lc@example.com",
        },
        token: "mock-jwt-token-lc",
      });
    }
    
    if (email === "tt@example.com" && password === "password") {
      return HttpResponse.json({
        user: {
          id: "4",
          name: "Teacher Trainer",
          role: "TT",
          email: "tt@example.com",
        },
        token: "mock-jwt-token-tt",
      });
    }
    
    return HttpResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }),

  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ success: true });
  }),

  // Dashboard data
  http.get("/api/dashboard", () => {
    return HttpResponse.json({
      stats: {
        totalStudents: 1250,
        totalTeachers: 85,
        activePrograms: 12,
        completedTrainings: 45,
      },
      recentActivity: [
        { id: 1, type: "student_registration", message: "New student registered", timestamp: "2024-01-15T10:30:00Z" },
        { id: 2, type: "training_completed", message: "Training session completed", timestamp: "2024-01-15T09:15:00Z" },
        { id: 3, type: "order_placed", message: "New order placed", timestamp: "2024-01-15T08:45:00Z" },
      ],
    });
  }),

  // Programs
  http.get("/api/programs", () => {
    return HttpResponse.json([
      { id: 1, name: "English Language Program", status: "active", students: 450 },
      { id: 2, name: "Mathematics Program", status: "active", students: 320 },
      { id: 3, name: "Science Program", status: "draft", students: 0 },
    ]);
  }),

  // Students
  http.get("/api/students", () => {
    return HttpResponse.json([
      { id: 1, name: "John Doe", email: "john@example.com", program: "English Language Program", status: "active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", program: "Mathematics Program", status: "active" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", program: "Science Program", status: "inactive" },
    ]);
  }),

  // Teachers
  http.get("/api/teachers", () => {
    return HttpResponse.json([
      { id: 1, name: "Dr. Sarah Wilson", email: "sarah@example.com", subjects: ["English", "Literature"], status: "active" },
      { id: 2, name: "Prof. Michael Brown", email: "michael@example.com", subjects: ["Mathematics", "Statistics"], status: "active" },
      { id: 3, name: "Dr. Emily Davis", email: "emily@example.com", subjects: ["Physics", "Chemistry"], status: "active" },
    ]);
  }),

  // Learning Groups
  http.get("/api/learning-groups", () => {
    return HttpResponse.json([
      { id: 1, name: "Advanced English", teacher: "Dr. Sarah Wilson", students: 25, schedule: "Mon, Wed, Fri 10:00 AM" },
      { id: 2, name: "Calculus I", teacher: "Prof. Michael Brown", students: 30, schedule: "Tue, Thu 2:00 PM" },
      { id: 3, name: "Physics Lab", teacher: "Dr. Emily Davis", students: 20, schedule: "Wed 3:00 PM" },
    ]);
  }),

  // Orders
  http.get("/api/orders", () => {
    return HttpResponse.json([
      { id: 1, student: "John Doe", program: "English Language Program", amount: 299.99, status: "completed", date: "2024-01-10" },
      { id: 2, student: "Jane Smith", program: "Mathematics Program", amount: 199.99, status: "pending", date: "2024-01-12" },
      { id: 3, student: "Bob Johnson", program: "Science Program", amount: 399.99, status: "cancelled", date: "2024-01-08" },
    ]);
  }),

  // Trainings
  http.get("/api/trainings", () => {
    return HttpResponse.json([
      { id: 1, title: "Teaching Methodology", instructor: "Dr. Sarah Wilson", participants: 15, date: "2024-01-20", status: "scheduled" },
      { id: 2, title: "Classroom Management", instructor: "Prof. Michael Brown", participants: 12, date: "2024-01-18", status: "completed" },
      { id: 3, title: "Assessment Techniques", instructor: "Dr. Emily Davis", participants: 18, date: "2024-01-25", status: "scheduled" },
    ]);
  }),

  // Reports
  http.get("/api/reports/royalties", () => {
    return HttpResponse.json({
      totalRoyalties: 12500.50,
      monthlyBreakdown: [
        { month: "Jan 2024", amount: 3200.25 },
        { month: "Dec 2023", amount: 2800.75 },
        { month: "Nov 2023", amount: 3100.00 },
      ],
    });
  }),

  http.get("/api/reports/students", () => {
    return HttpResponse.json({
      totalStudents: 1250,
      activeStudents: 1100,
      newRegistrations: 45,
      programBreakdown: [
        { program: "English Language Program", students: 450 },
        { program: "Mathematics Program", students: 320 },
        { program: "Science Program", students: 280 },
        { program: "Other Programs", students: 200 },
      ],
    });
  }),
];

// Setup the worker
export const worker = setupWorker(...handlers);

// Enable MSW in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  worker.start({
    onUnhandledRequest: "bypass",
  });
}
