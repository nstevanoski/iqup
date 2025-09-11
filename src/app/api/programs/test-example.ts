// Example test data that matches the mock structure
// This file demonstrates how the API would work with the mock data

export const exampleProgramData = {
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
  hours: 120,
  lessonLength: 60,
  kind: "academic",
  sharedWithMFs: ["1", "2"], // MF IDs as strings
  visibility: "shared"
}

export const exampleApiCalls = {
  // GET /api/programs - List all programs with filtering
  listPrograms: {
    url: "/api/programs?page=1&limit=10&search=english&status=active&category=Language&kind=academic&sortBy=name&sortOrder=asc",
    method: "GET",
    headers: {
      "Authorization": "Bearer your-jwt-token"
    }
  },

  // GET /api/programs/1 - Get single program
  getProgram: {
    url: "/api/programs/1",
    method: "GET",
    headers: {
      "Authorization": "Bearer your-jwt-token"
    }
  },

  // POST /api/programs - Create new program (HQ only)
  createProgram: {
    url: "/api/programs",
    method: "POST",
    headers: {
      "Authorization": "Bearer your-jwt-token",
      "Content-Type": "application/json"
    },
    body: exampleProgramData
  },

  // PUT /api/programs/1 - Update program (HQ only)
  updateProgram: {
    url: "/api/programs/1",
    method: "PUT",
    headers: {
      "Authorization": "Bearer your-jwt-token",
      "Content-Type": "application/json"
    },
    body: {
      name: "Updated English Language Program",
      currentStudents: 50,
      status: "active"
    }
  },

  // DELETE /api/programs/1 - Delete program (HQ only)
  deleteProgram: {
    url: "/api/programs/1",
    method: "DELETE",
    headers: {
      "Authorization": "Bearer your-jwt-token"
    }
  }
}

export const expectedResponses = {
  // GET /api/programs response
  listResponse: {
    success: true,
    data: {
      data: [
        {
          id: "1",
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
          createdBy: "1",
          hours: 120,
          lessonLength: 60,
          kind: "academic",
          sharedWithMFs: ["1", "2"],
          visibility: "shared",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          creator: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com"
          },
          subPrograms: [],
          subProgramCount: 0
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1
      }
    },
    message: "Programs retrieved successfully"
  },

  // GET /api/programs/1 response
  getResponse: {
    success: true,
    data: {
      id: "1",
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
      createdBy: "1",
      hours: 120,
      lessonLength: 60,
      kind: "academic",
      sharedWithMFs: ["1", "2"],
      visibility: "shared",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      creator: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com"
      },
      subPrograms: [
        {
          id: "1",
          name: "Beginner English",
          description: "Introduction to English language basics",
          status: "active",
          order: 1,
          duration: 8,
          price: 99.99,
          pricingModel: "one-time",
          coursePrice: 99.99,
          visibility: "shared",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ],
      subProgramCount: 1
    },
    message: "Program retrieved successfully"
  },

  // POST /api/programs response
  createResponse: {
    success: true,
    data: {
      id: "2",
      name: "English Language Program",
      description: "Comprehensive English language learning program for all levels",
      status: "draft",
      category: "Language",
      duration: 24,
      price: 299.99,
      maxStudents: 100,
      currentStudents: 0,
      requirements: ["Basic reading skills", "Age 16+"],
      learningObjectives: ["Fluency in English", "Grammar mastery", "Conversational skills"],
      createdBy: "1",
      hours: 120,
      lessonLength: 60,
      kind: "academic",
      sharedWithMFs: ["1", "2"],
      visibility: "private",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      creator: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com"
      }
    },
    message: "Program created successfully"
  }
}

// Role-based access examples
export const roleBasedAccess = {
  // HQ users can see all programs
  hqAccess: {
    userRole: "HQ",
    canSee: "All programs regardless of visibility",
    canCreate: true,
    canUpdate: true,
    canDelete: true
  },

  // MF users can see public and shared programs for their MF
  mfAccess: {
    userRole: "MF",
    userScope: "1", // MF ID
    canSee: "Public programs + Shared programs where sharedWithMFs includes their MF ID",
    canCreate: false,
    canUpdate: false,
    canDelete: false
  },

  // LC users can see public and shared programs for their parent MF
  lcAccess: {
    userRole: "LC",
    userScope: "1", // LC ID
    canSee: "Public programs + Shared programs where sharedWithMFs includes their parent MF ID",
    canCreate: false,
    canUpdate: false,
    canDelete: false
  },

  // TT users can only see public programs
  ttAccess: {
    userRole: "TT",
    canSee: "Only public programs",
    canCreate: false,
    canUpdate: false,
    canDelete: false
  }
}
