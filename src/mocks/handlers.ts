import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock API endpoints
  http.get("/api/programs", () => {
    return HttpResponse.json([
      { id: "1", name: "English Program", description: "Comprehensive English learning program" },
      { id: "2", name: "Math Program", description: "Advanced mathematics curriculum" },
    ]);
  }),

  http.get("/api/subprograms", () => {
    return HttpResponse.json([
      { id: "1", name: "Basic English", programId: "1" },
      { id: "2", name: "Advanced English", programId: "1" },
      { id: "3", name: "Algebra", programId: "2" },
    ]);
  }),

  http.get("/api/students", () => {
    return HttpResponse.json([
      { id: "1", name: "Alice Johnson", email: "alice@example.com", grade: "5th" },
      { id: "2", name: "Bob Smith", email: "bob@example.com", grade: "6th" },
    ]);
  }),

  http.get("/api/teachers", () => {
    return HttpResponse.json([
      { id: "1", name: "Dr. Sarah Wilson", email: "sarah@example.com", subject: "English" },
      { id: "2", name: "Prof. Mike Brown", email: "mike@example.com", subject: "Math" },
    ]);
  }),

  http.get("/api/learning-groups", () => {
    return HttpResponse.json([
      { id: "1", name: "Grade 5 English", students: 15, teacher: "Dr. Sarah Wilson" },
      { id: "2", name: "Grade 6 Math", students: 12, teacher: "Prof. Mike Brown" },
    ]);
  }),

  http.get("/api/orders", () => {
    return HttpResponse.json([
      { id: "1", customer: "Learning Center NYC", amount: 2500, status: "completed" },
      { id: "2", customer: "Learning Center LA", amount: 1800, status: "pending" },
    ]);
  }),

  http.get("/api/trainings", () => {
    return HttpResponse.json([
      { id: "1", name: "Teacher Training Workshop", date: "2024-01-15", participants: 25 },
      { id: "2", name: "Curriculum Update Session", date: "2024-01-20", participants: 18 },
    ]);
  }),

  http.get("/api/teacher-trainers", () => {
    return HttpResponse.json([
      { id: "1", name: "Master Trainer John", specialization: "English", experience: "10 years" },
      { id: "2", name: "Master Trainer Lisa", specialization: "Math", experience: "8 years" },
    ]);
  }),

  http.get("/api/accounts", () => {
    return HttpResponse.json([
      { id: "1", name: "Global Headquarters", type: "HQ", balance: 50000 },
      { id: "2", name: "Master Franchise USA", type: "MF", balance: 25000 },
    ]);
  }),

  http.get("/api/reports/royalties", () => {
    return HttpResponse.json([
      { month: "January 2024", amount: 15000, franchise: "USA" },
      { month: "February 2024", amount: 18000, franchise: "Europe" },
    ]);
  }),

  http.get("/api/reports/students", () => {
    return HttpResponse.json([
      { center: "Learning Center NYC", students: 150, growth: "+12%" },
      { center: "Learning Center LA", students: 120, growth: "+8%" },
    ]);
  }),
];
