import { setupWorker } from "msw/browser";
import { http, HttpResponse } from "msw";
import { handlers } from "./handlers";

// Auth endpoints (keeping existing auth logic)
const authHandlers = [
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
];

// Additional handlers for routes not covered by the main handlers
const additionalHandlers = [
  // Learning Groups
  http.get("/api/learning-groups", () => {
    return HttpResponse.json([
      { id: 1, name: "Advanced English", teacher: "Sarah Wilson", students: 25, schedule: "Mon, Wed, Fri 10:00 AM" },
      { id: 2, name: "Calculus I", teacher: "Michael Brown", students: 30, schedule: "Tue, Thu 2:00 PM" },
      { id: 3, name: "Physics Lab", teacher: "Emily Davis", students: 20, schedule: "Wed 3:00 PM" },
    ]);
  }),

  // Trainings
  http.get("/api/trainings", () => {
    return HttpResponse.json([
      { id: 1, title: "Teaching Methodology", instructor: "Sarah Wilson", participants: 15, date: "2024-01-20", status: "scheduled" },
      { id: 2, title: "Classroom Management", instructor: "Michael Brown", participants: 12, date: "2024-01-18", status: "completed" },
      { id: 3, title: "Assessment Techniques", instructor: "Emily Davis", participants: 18, date: "2024-01-25", status: "scheduled" },
    ]);
  }),

  // Subprograms
  http.get("/api/subprograms", () => {
    return HttpResponse.json([
      { id: 1, name: "Beginner English", program: "English Language Program", status: "active", students: 25 },
      { id: 2, name: "Intermediate English", program: "English Language Program", status: "active", students: 20 },
      { id: 3, name: "Algebra Fundamentals", program: "Mathematics Program", status: "active", students: 15 },
    ]);
  }),

  // Teacher Trainers
  http.get("/api/teacher-trainers", () => {
    return HttpResponse.json([
      { id: 1, name: "Sarah Wilson", email: "sarah@example.com", role: "TT", status: "active" },
      { id: 2, name: "Michael Brown", email: "michael@example.com", role: "TT", status: "active" },
      { id: 3, name: "Emily Davis", email: "emily@example.com", role: "TT", status: "active" },
    ]);
  }),

  // Accounts
  http.get("/api/accounts", () => {
    return HttpResponse.json([
      { id: 1, name: "Main Campus", type: "HQ", status: "active", students: 1250 },
      { id: 2, name: "Branch Office", type: "MF", status: "active", students: 850 },
      { id: 3, name: "Local Center", type: "LC", status: "active", students: 400 },
    ]);
  }),

  // Settings
  http.get("/api/settings", () => {
    return HttpResponse.json({
      system: {
        name: "iQuP",
        version: "1.0.0",
        timezone: "UTC-5",
      },
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      privacy: {
        dataRetention: 365,
        analytics: true,
      },
    });
  }),
];

// Combine all handlers
const allHandlers = [
  ...authHandlers,
  ...handlers,
  ...additionalHandlers,
];

// Setup the worker
export const worker = setupWorker(...allHandlers);

// Enable MSW in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  worker.start({
    onUnhandledRequest: "bypass",
  });
}
