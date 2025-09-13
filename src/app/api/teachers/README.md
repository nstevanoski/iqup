# Teachers API Documentation

This API provides CRUD operations for managing teachers in the iqup system.

## Base URL
```
/api/teachers
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Access Control
- **LC Users**: Can create, read, update, and delete teachers from their own Learning Center
- **MF Users**: Can read all teachers from Learning Centers under their Master Franchisee
- **HQ Users**: Can read all teachers across all Learning Centers

## Endpoints

### 1. List Teachers
**GET** `/api/teachers`

Retrieves a paginated list of teachers with filtering and sorting options.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in first name, last name, email, or title
- `status` (optional): Filter by status (ACTIVE, INACTIVE, ON_LEAVE)
- `lcId` (optional): Filter by Learning Center ID
- `mfId` (optional): Filter by Master Franchisee ID
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)

#### Response
```json
{
  "success": true,
  "message": "Teachers retrieved successfully",
  "data": {
    "teachers": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "dateOfBirth": "1985-03-15T00:00:00.000Z",
        "gender": "MALE",
        "title": "Dr.",
        "email": "john.smith@example.com",
        "phone": "+1-555-0101",
        "experience": 5,
        "status": "ACTIVE",
        "bio": "Experienced mathematics teacher",
        "avatar": null,
        "address": "123 Teacher St",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "postalCode": "10001",
        "availability": [
          {
            "dayOfWeek": 1,
            "startTime": "09:00",
            "endTime": "17:00"
          }
        ],
        "education": [
          {
            "degree": "Master of Education",
            "institution": "University of Education",
            "graduationYear": 2010,
            "fieldOfStudy": "Mathematics"
          }
        ],
        "trainings": [],
        "specialization": ["Mathematics", "Algebra"],
        "qualifications": ["Teaching Certificate", "Math Specialist"],
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

### 2. Create Teacher
**POST** `/api/teachers`

Creates a new teacher. Only LC users can create teachers.

#### Request Body
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "dateOfBirth": "1985-03-15",
  "gender": "MALE",
  "title": "Dr.",
  "email": "john.smith@example.com",
  "phone": "+1-555-0101",
  "experience": 5,
  "status": "ACTIVE",
  "bio": "Experienced mathematics teacher",
  "avatar": null,
  "address": "123 Teacher St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postalCode": "10001",
  "availability": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "education": [
    {
      "degree": "Master of Education",
      "institution": "University of Education",
      "graduationYear": 2010,
      "fieldOfStudy": "Mathematics"
    }
  ],
  "trainings": [],
  "specialization": ["Mathematics", "Algebra"],
  "qualifications": ["Teaching Certificate", "Math Specialist"],
  "lcId": 1,
  "mfId": 1,
  "hqId": 1
}
```

#### Required Fields
- `firstName`: Teacher's first name
- `lastName`: Teacher's last name
- `dateOfBirth`: Teacher's date of birth (ISO date string)
- `gender`: Teacher's gender (MALE, FEMALE, OTHER)
- `email`: Teacher's email address

#### Response
```json
{
  "success": true,
  "message": "Teacher created successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    // ... other teacher fields
  }
}
```

### 3. Get Teacher by ID
**GET** `/api/teachers/[id]`

Retrieves a single teacher by ID.

#### Path Parameters
- `id`: Teacher ID (integer)

#### Response
```json
{
  "success": true,
  "message": "Teacher retrieved successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    // ... other teacher fields
  }
}
```

### 4. Update Teacher
**PUT** `/api/teachers/[id]`

Updates an existing teacher. Only LC users can update teachers from their own Learning Center.

#### Path Parameters
- `id`: Teacher ID (integer)

#### Request Body
Same as create teacher, but all fields are optional except required ones.

#### Response
```json
{
  "success": true,
  "message": "Teacher updated successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    // ... updated teacher fields
  }
}
```

### 5. Delete Teacher
**DELETE** `/api/teachers/[id]`

Deletes a teacher. Only LC users can delete teachers from their own Learning Center.

#### Path Parameters
- `id`: Teacher ID (integer)

#### Response
```json
{
  "success": true,
  "message": "Teacher deleted successfully",
  "data": null
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "First name, last name, date of birth, gender, and email are required",
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
  "message": "Only LC users can create teachers",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Teacher not found",
  "data": null
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Teacher with this information already exists",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create teacher",
  "data": null
}
```

## Data Model

### Teacher Status
- `ACTIVE`: Teacher is currently active and available
- `INACTIVE`: Teacher is not currently active
- `ON_LEAVE`: Teacher is temporarily on leave

### Gender
- `MALE`: Male
- `FEMALE`: Female
- `OTHER`: Other/Non-binary

### Availability
Array of availability objects with:
- `dayOfWeek`: Day of week (0-6, Sunday-Saturday)
- `startTime`: Start time in HH:MM format
- `endTime`: End time in HH:MM format

### Education
Array of education objects with:
- `degree`: Degree name
- `institution`: Institution name
- `graduationYear`: Year of graduation
- `fieldOfStudy`: Field of study

### Trainings
Array of training objects with:
- `trainingId`: Training ID
- `trainingName`: Training name
- `completedDate`: Completion date
- `status`: Training status (completed, in_progress, scheduled)
- `certification`: Optional certification

## Examples

### Get all active teachers from a specific Learning Center
```
GET /api/teachers?status=ACTIVE&lcId=1&page=1&limit=20
```

### Search for teachers by name
```
GET /api/teachers?search=John&page=1&limit=10
```

### Get teachers from a specific Master Franchisee
```
GET /api/teachers?mfId=1&sortBy=firstName&sortOrder=asc
```
