// Example usage of Learning Groups API
// This file demonstrates how to use the Learning Groups API endpoints

// Example: Create a new learning group
const createLearningGroupExample = {
  name: "Advanced English Group A",
  description: "Advanced English conversation and writing group",
  maxStudents: 15,
  startDate: "2024-02-01",
  endDate: "2024-05-31",
  location: "Main Campus",
  notes: "Focus on advanced conversation skills",
  schedule: [
    {
      dayOfWeek: 1, // Monday
      startTime: "10:00",
      endTime: "12:00"
    },
    {
      dayOfWeek: 3, // Wednesday
      startTime: "10:00",
      endTime: "12:00"
    }
  ],
  pricingSnapshot: {
    pricingModel: "installments",
    coursePrice: 399.98,
    numberOfPayments: 3,
    gap: 1, // Monthly payments
    pricePerMonth: 133.33
  },
  programId: 1,
  subProgramId: 2,
  teacherId: 1,
  students: [
    {
      studentId: "student_1",
      startDate: "2024-02-01",
      endDate: "2024-05-31",
      productId: "product_1",
      paymentStatus: "paid",
      enrollmentDate: "2024-01-15"
    }
  ]
};

// Example: Update a learning group
const updateLearningGroupExample = {
  name: "Advanced English Group A - Updated",
  maxStudents: 20,
  notes: "Updated focus on advanced conversation and writing skills"
};

// Example API calls (for reference)
/*
// GET all learning groups
fetch('/api/learning-groups?page=1&limit=10&search=english&status=ACTIVE')

// GET specific learning group
fetch('/api/learning-groups/1')

// POST create learning group
fetch('/api/learning-groups', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(createLearningGroupExample)
})

// PUT update learning group
fetch('/api/learning-groups/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updateLearningGroupExample)
})

// DELETE learning group
fetch('/api/learning-groups/1', { method: 'DELETE' })
*/

// Role-based access examples:
/*
HQ User:
- Can see all learning groups across all organizations
- Cannot create/update/delete (read-only)

MF User:
- Can see learning groups from their MF and all LCs under it
- Cannot create/update/delete (read-only)

LC User:
- Can see only learning groups from their own LC
- Can create/update/delete learning groups within their LC
- Must provide valid program, teacher, and organizational relationships
*/

export { createLearningGroupExample, updateLearningGroupExample };
