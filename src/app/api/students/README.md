# Students API Documentation

This API provides CRUD operations for managing students in the iqup system.

## Base URL
```
/api/students
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Access Control
- **LC Users**: Can create, read, update, and delete students from their own Learning Center
- **MF Users**: Can read all students from Learning Centers under their Master Franchisee
- **HQ Users**: Can read all students across all Learning Centers

## Endpoints

### 1. List Students
**GET** `/api/students`

Retrieves a paginated list of students with filtering and sorting options.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in first name, last name, email, phone, or parent information
- `status` (optional): Filter by status (ACTIVE, INACTIVE, GRADUATED, SUSPENDED)
- `lcId` (optional): Filter by Learning Center ID
- `mfId` (optional): Filter by Master Franchisee ID
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)

#### Response
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "students": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-0101",
        "dateOfBirth": "2010-03-15T00:00:00.000Z",
        "gender": "MALE",
        "enrollmentDate": "2024-01-15T00:00:00.000Z",
        "status": "ACTIVE",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "postalCode": "10001",
        "parentFirstName": "Jane",
        "parentLastName": "Doe",
        "parentPhone": "+1-555-0102",
        "parentEmail": "jane.doe@example.com",
        "emergencyContactEmail": "emergency@example.com",
        "emergencyContactPhone": "+1-555-0103",
        "notes": "Excellent student",
        "avatar": null,
        "lcId": 1,
        "mfId": 1,
        "hqId": 1,
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z",
        "lc": {
          "id": 1,
          "name": "New York Learning Center",
          "code": "NYLC01"
        },
        "mf": {
          "id": 1,
          "name": "North America Master Franchise",
          "code": "NAMF01"
        },
        "hq": {
          "id": 1,
          "name": "iQup Headquarters",
          "code": "HQ01"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 2. Create Student
**POST** `/api/students`

Creates a new student. Only LC users can create students.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0101",
  "dateOfBirth": "2010-03-15",
  "gender": "MALE",
  "enrollmentDate": "2024-01-15",
  "status": "ACTIVE",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postalCode": "10001",
  "parentFirstName": "Jane",
  "parentLastName": "Doe",
  "parentPhone": "+1-555-0102",
  "parentEmail": "jane.doe@example.com",
  "emergencyContactEmail": "emergency@example.com",
  "emergencyContactPhone": "+1-555-0103",
  "notes": "Excellent student",
  "avatar": null,
  "lcId": 1,
  "mfId": 1,
  "hqId": 1
}
```

#### Required Fields
- `firstName`: Student's first name
- `lastName`: Student's last name
- `dateOfBirth`: Student's date of birth (ISO date string)
- `gender`: Student's gender (MALE, FEMALE, OTHER)
- `parentFirstName`: Parent's first name
- `parentLastName`: Parent's last name
- `parentPhone`: Parent's phone number
- `parentEmail`: Parent's email address

#### Response
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    // ... other student fields
  }
}
```

### 3. Get Student by ID
**GET** `/api/students/[id]`

Retrieves a single student by ID.

#### Path Parameters
- `id`: Student ID (integer)

#### Response
```json
{
  "success": true,
  "message": "Student retrieved successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    // ... other student fields
  }
}
```

### 4. Update Student
**PUT** `/api/students/[id]`

Updates an existing student. Only LC users can update students from their own Learning Center.

#### Path Parameters
- `id`: Student ID (integer)

#### Request Body
Same as create student, but all fields are optional except required ones.

#### Response
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    // ... updated student fields
  }
}
```

### 5. Delete Student
**DELETE** `/api/students/[id]`

Deletes a student. Only LC users can delete students from their own Learning Center.

#### Path Parameters
- `id`: Student ID (integer)

#### Response
```json
{
  "success": true,
  "message": "Student deleted successfully",
  "data": null
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "First name, last name, date of birth, and gender are required",
  "data": null
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only LC users can create students",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Student not found",
  "data": null
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Student with this information already exists",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create student",
  "data": null
}
```

## Data Model

### Student Status
- `ACTIVE`: Student is currently enrolled and active
- `INACTIVE`: Student is not currently active
- `GRADUATED`: Student has completed their program
- `SUSPENDED`: Student is temporarily suspended

### Gender
- `MALE`: Male
- `FEMALE`: Female
- `OTHER`: Other/Non-binary

## Examples

### Get all active students from a specific Learning Center
```
GET /api/students?status=ACTIVE&lcId=1&page=1&limit=20
```

### Search for students by name
```
GET /api/students?search=John&page=1&limit=10
```

### Get students from a specific Master Franchisee
```
GET /api/students?mfId=1&sortBy=firstName&sortOrder=asc
```
