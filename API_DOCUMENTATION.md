# iQuP API Documentation

This document describes the mock API endpoints available in the iQuP dashboard application. All endpoints are mocked using MSW (Mock Service Worker) and return realistic data for development and testing.

## Base URL
All API endpoints are prefixed with `/api`

## Authentication

### POST /api/auth/login
Authenticate a user with email and password.

**Request Body:**
```json
{
  "email": "hq@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "name": "HQ Admin",
    "role": "HQ",
    "email": "hq@example.com"
  },
  "token": "mock-jwt-token-hq"
}
```

**Available Test Accounts:**
- `hq@example.com` / `password` - HQ Admin (Full access)
- `mf@example.com` / `password` - MF Manager (Management functions)
- `lc@example.com` / `password` - LC Coordinator (Local coordination)
- `tt@example.com` / `password` - Teacher Trainer (Training functions)

### POST /api/auth/logout
Logout the current user.

**Response:**
```json
{
  "success": true
}
```

## Programs

### GET /api/programs
Get all programs with optional filtering and pagination.

**Query Parameters:**
- `search` - Search by name or description
- `status` - Filter by status (active, inactive, draft)
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Sort field
- `sortOrder` - Sort order (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": "prog_abc123",
      "name": "English Language Program",
      "description": "Comprehensive English language learning program",
      "status": "active",
      "category": "Language",
      "duration": 24,
      "price": 299.99,
      "maxStudents": 100,
      "currentStudents": 45,
      "requirements": ["Basic reading skills", "Age 16+"],
      "learningObjectives": ["Fluency in English", "Grammar mastery"],
      "createdBy": "user_1",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1
  }
}
```

### GET /api/programs/:id
Get a specific program by ID.

### POST /api/programs
Create a new program.

**Request Body:**
```json
{
  "name": "New Program",
  "description": "Program description",
  "status": "draft",
  "category": "STEM",
  "duration": 12,
  "price": 199.99,
  "maxStudents": 50,
  "currentStudents": 0,
  "requirements": ["Basic knowledge"],
  "learningObjectives": ["Learn new skills"],
  "createdBy": "user_1"
}
```

### PUT /api/programs/:id
Update an existing program.

### DELETE /api/programs/:id
Delete a program.

## Students

### GET /api/students
Get all students with optional filtering and pagination.

**Query Parameters:**
- `search` - Search by name or email
- `status` - Filter by status (active, inactive, graduated, suspended)
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "data": [
    {
      "id": "stu_abc123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0101",
      "dateOfBirth": "1995-03-15T00:00:00Z",
      "gender": "male",
      "enrollmentDate": "2024-01-01T00:00:00Z",
      "status": "active",
      "programIds": ["prog_abc123"],
      "subProgramIds": ["sub_abc123"],
      "learningGroupIds": [],
      "emergencyContact": {
        "email": "jane.doe@example.com",
        "phone": "+1-555-0102"
      },
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "notes": "Excellent student",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

### GET /api/students/:id
Get a specific student by ID.

### POST /api/students
Create a new student.

### PUT /api/students/:id
Update an existing student.

### DELETE /api/students/:id
Delete a student.

## Teachers

### GET /api/teachers
Get all teachers with optional filtering and pagination.

**Response:**
```json
{
  "data": [
    {
      "id": "tea_abc123",
      "firstName": "Sarah",
      "lastName": "Wilson",
      "title": "Dr.",
      "email": "sarah.wilson@example.com",
      "phone": "+1-555-1001",
      "specialization": ["English Literature", "Linguistics"],
      "experience": 15,
      "qualifications": ["PhD in English Literature", "TESOL Certification"],
      "status": "active",
      "hourlyRate": 75,
      "availability": [
        {
          "dayOfWeek": 1,
          "startTime": "09:00",
          "endTime": "17:00"
        }
      ],
      "bio": "Experienced English professor",
      "address": {
        "street": "321 Elm St",
        "city": "Boston",
        "state": "MA",
        "zipCode": "02101",
        "country": "USA"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

### GET /api/teachers/:id
Get a specific teacher by ID.

## Orders

### GET /api/orders
Get all orders with optional filtering and pagination.

**Response:**
```json
{
  "data": [
    {
      "id": "ord_abc123",
      "orderNumber": "ORD-2024-001",
      "studentId": "stu_abc123",
      "items": [
        {
          "productId": "prod_abc123",
          "quantity": 2,
          "unitPrice": 29.99,
          "totalPrice": 59.98
        }
      ],
      "status": "completed",
      "subtotal": 59.98,
      "tax": 4.80,
      "discount": 0,
      "total": 64.78,
      "paymentStatus": "paid",
      "paymentMethod": "Credit Card",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "billingAddress": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "processedBy": "user_1",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

### GET /api/orders/:id
Get a specific order by ID.

### POST /api/orders
Create a new order.

### PUT /api/orders/:id
Update an existing order.

## Dashboard

### GET /api/dashboard
Get dashboard statistics and recent activities.

**Response:**
```json
{
  "data": {
    "stats": {
      "totalStudents": 3,
      "totalTeachers": 3,
      "activePrograms": 3,
      "completedTrainings": 1,
      "totalRevenue": 161.97,
      "pendingOrders": 1
    },
    "recentActivity": [
      {
        "id": "act_abc123",
        "type": "student_registration",
        "message": "New student registered: John Doe",
        "timestamp": "2024-01-15T00:00:00Z",
        "userId": "user_1",
        "metadata": {
          "studentId": "stu_abc123"
        }
      }
    ]
  }
}
```

## Reports

### GET /api/reports/royalties
Get royalties report data.

**Query Parameters:**
- `period` - Filter by period (YYYY-MM format)

**Response:**
```json
{
  "data": {
    "totalRoyalties": 3944.88,
    "monthlyBreakdown": [
      {
        "month": "2024-01",
        "amount": 2024.93
      }
    ],
    "reports": [
      {
        "id": "rr_abc123",
        "period": "2024-01",
        "programId": "prog_abc123",
        "programName": "English Language Program",
        "totalRevenue": 13499.55,
        "royaltyRate": 0.15,
        "royaltyAmount": 2024.93,
        "studentCount": 45,
        "completionRate": 0.85,
        "status": "paid",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ]
  }
}
```

### GET /api/reports/students
Get students report data.

**Query Parameters:**
- `programId` - Filter by program ID

**Response:**
```json
{
  "data": {
    "totalStudents": 1,
    "activeStudents": 1,
    "newRegistrations": 1,
    "programBreakdown": [
      {
        "program": "English Language Program",
        "students": 1
      }
    ],
    "reports": [
      {
        "id": "sr_abc123",
        "studentId": "stu_abc123",
        "studentName": "John Doe",
        "programId": "prog_abc123",
        "programName": "English Language Program",
        "enrollmentDate": "2024-01-01T00:00:00Z",
        "completionDate": null,
        "status": "active",
        "progress": 65,
        "grades": [
          {
            "subject": "Grammar",
            "score": 85,
            "maxScore": 100,
            "date": "2024-01-15T00:00:00Z",
            "type": "exam"
          }
        ],
        "attendance": [
          {
            "date": "2024-01-15T00:00:00Z",
            "status": "present"
          }
        ],
        "payments": [
          {
            "amount": 299.99,
            "date": "2024-01-01T00:00:00Z",
            "method": "Credit Card",
            "status": "completed",
            "reference": "PAY-001"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T00:00:00Z"
      }
    ]
  }
}
```

## Additional Endpoints

### GET /api/learning-groups
Get all learning groups.

### GET /api/trainings
Get all training sessions.

### GET /api/subprograms
Get all subprograms.

### GET /api/teacher-trainers
Get all teacher trainer accounts.

### GET /api/accounts
Get all organizational accounts.

### GET /api/settings
Get system settings.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid data)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Type Safety

All API responses are fully typed using TypeScript interfaces defined in `/src/types/index.ts`. The mock handlers ensure type safety across all endpoints.

## Development Notes

- All data is stored in memory and will reset on page refresh
- MSW is only enabled in development mode
- All timestamps are in ISO 8601 format
- IDs are generated using a consistent pattern for easy identification
- The mock database includes realistic relationships between entities
