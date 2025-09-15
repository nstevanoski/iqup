# Learning Groups API

This API provides endpoints for managing learning groups with role-based access control (RBAC).

## Endpoints

### GET /api/learning-groups
Get all learning groups with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name, description, or location
- `status` (optional): Filter by status (ACTIVE, INACTIVE, COMPLETED, CANCELLED)
- `lcId` (optional): Filter by Learning Center ID
- `mfId` (optional): Filter by Master Franchisee ID
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc/desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "learningGroups": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Learning groups retrieved successfully"
}
```

### GET /api/learning-groups/[id]
Get a single learning group by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Advanced English Group A",
    "description": "Advanced English conversation and writing group",
    "status": "ACTIVE",
    "maxStudents": 15,
    "startDate": "2024-02-01T00:00:00.000Z",
    "endDate": "2024-05-31T00:00:00.000Z",
    "location": "Main Campus",
    "notes": "Focus on advanced conversation skills",
    "schedule": [...],
    "pricingSnapshot": {...},
    "programId": 1,
    "subProgramId": 2,
    "teacherId": 1,
    "students": [...],
    "lc": {...},
    "mf": {...},
    "hq": {...},
    "teacher": {...},
    "program": {...},
    "subProgram": {...}
  },
  "message": "Learning group retrieved successfully"
}
```

### POST /api/learning-groups
Create a new learning group.

**Request Body:**
```json
{
  "name": "Advanced English Group A",
  "description": "Advanced English conversation and writing group",
  "maxStudents": 15,
  "startDate": "2024-02-01",
  "endDate": "2024-05-31",
  "location": "Main Campus",
  "notes": "Focus on advanced conversation skills",
  "schedule": [
    {
      "dayOfWeek": 1,
      "startTime": "10:00",
      "endTime": "12:00"
    }
  ],
  "pricingSnapshot": {
    "pricingModel": "installments",
    "coursePrice": 399.98,
    "numberOfPayments": 3,
    "gap": 1,
    "pricePerMonth": 133.33
  },
  "programId": 1,
  "subProgramId": 2,
  "teacherId": 1,
  "students": [
    {
      "studentId": "student_1",
      "startDate": "2024-02-01",
      "endDate": "2024-05-31",
      "productId": "product_1",
      "paymentStatus": "paid",
      "enrollmentDate": "2024-01-15"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Learning group created successfully"
}
```

### PUT /api/learning-groups/[id]
Update an existing learning group.

**Request Body:** Same as POST, all fields optional except required ones.

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Learning group updated successfully"
}
```

### DELETE /api/learning-groups/[id]
Delete a learning group.

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Learning group deleted successfully"
}
```

## Role-Based Access Control (RBAC)

### HQ Users
- Can view all learning groups across all organizations
- Cannot create, update, or delete learning groups (read-only access)

### MF Users
- Can view learning groups from their Master Franchisee and all Learning Centers under it
- Cannot create, update, or delete learning groups (read-only access)

### LC Users
- Can view only learning groups from their own Learning Center
- Can create, update, and delete learning groups within their Learning Center
- Must provide valid program, teacher, and organizational relationships

## Data Model

### LearningGroup
- `id`: Unique identifier
- `name`: Learning group name
- `description`: Detailed description
- `status`: ACTIVE, INACTIVE, COMPLETED, CANCELLED
- `maxStudents`: Maximum number of students
- `startDate`: Group start date
- `endDate`: Group end date
- `location`: Physical location
- `notes`: Additional notes
- `schedule`: JSON array of schedule objects
- `pricingSnapshot`: JSON object with pricing information
- `programId`: Reference to Program
- `subProgramId`: Optional reference to SubProgram
- `teacherId`: Reference to Teacher
- `students`: JSON array of student enrollment objects
- `lcId`: Learning Center ID (for RBAC)
- `mfId`: Master Franchisee ID (for RBAC)
- `hqId`: Headquarters ID (for RBAC)

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

Example error response:
```json
{
  "success": false,
  "error": "Only LC users can create learning groups"
}
```
