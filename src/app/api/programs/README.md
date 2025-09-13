# Programs API Documentation

This API provides CRUD operations for managing educational programs in the iqup system.

## Base URL
```
/api/programs
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. List Programs
**GET** `/api/programs`

Retrieves a paginated list of programs with filtering and sorting options.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in name, description, or kind
- `status` (optional): Filter by status (active, inactive, draft)
- `category` (optional): Filter by category
- `kind` (optional): Filter by kind (academic, worksheet, birthday_party, stem_camp, vocational, certification, workshop)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort order (asc, desc) (default: desc)
- `userRole` (optional): User role for access control (HQ, MF, LC, TT) - **Note: This parameter is deprecated and ignored. The API now uses the authenticated user's role from the JWT token for security.**
- `userScope` (optional): User scope ID for role-based filtering - **Note: This parameter is deprecated and ignored. The API now uses the authenticated user's MF/LC ID from the JWT token for security.**

#### Response
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "1",
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
        "createdBy": "1",
        "hours": 120,
        "lessonLength": 60,
        "kind": "academic",
        "sharedWithMFs": ["1", "2"],
        "visibility": "shared",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "creator": {
          "id": 1,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com"
        },
        "subPrograms": [],
        "subProgramCount": 0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  },
  "message": "Programs retrieved successfully"
}
```

### 2. Get Single Program
**GET** `/api/programs/{id}`

Retrieves a single program by ID.

#### Path Parameters
- `id`: Program ID

#### Query Parameters
- `userRole` (optional): User role for access control - **Note: This parameter is deprecated and ignored. The API now uses the authenticated user's role from the JWT token for security.**
- `userScope` (optional): User scope ID for role-based filtering - **Note: This parameter is deprecated and ignored. The API now uses the authenticated user's MF/LC ID from the JWT token for security.**

#### Response
```json
{
  "success": true,
  "data": {
    "id": "1",
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
    "createdBy": "1",
    "hours": 120,
    "lessonLength": 60,
    "kind": "academic",
    "sharedWithMFs": ["1", "2"],
    "visibility": "shared",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creator": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "subPrograms": [
      {
        "id": "1",
        "name": "Beginner English",
        "description": "Introduction to English language basics",
        "status": "active",
        "order": 1,
        "duration": 8,
        "price": 99.99,
        "pricingModel": "one-time",
        "coursePrice": 99.99,
        "visibility": "shared",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "subProgramCount": 1
  },
  "message": "Program retrieved successfully"
}
```

### 3. Create Program
**POST** `/api/programs`

Creates a new program. **HQ users only**.

#### Request Body
```json
{
  "name": "English Language Program",
  "description": "Comprehensive English language learning program for all levels",
  "status": "draft",
  "category": "Language",
  "duration": 24,
  "price": 299.99,
  "maxStudents": 100,
  "currentStudents": 0,
  "requirements": ["Basic reading skills", "Age 16+"],
  "learningObjectives": ["Fluency in English", "Grammar mastery", "Conversational skills"],
  "hours": 120,
  "lessonLength": 60,
  "kind": "academic",
  "sharedWithMFs": ["1", "2"],
  "visibility": "private"
}
```

#### Required Fields
- `name`: Program name
- `description`: Program description
- `category`: Program category
- `duration`: Duration in weeks
- `price`: Program price
- `maxStudents`: Maximum number of students
- `hours`: Total program hours
- `lessonLength`: Length of each lesson in minutes
- `kind`: Program kind

#### Response
```json
{
  "success": true,
  "data": {
    "id": "2",
    "name": "English Language Program",
    "description": "Comprehensive English language learning program for all levels",
    "status": "draft",
    "category": "Language",
    "duration": 24,
    "price": 299.99,
    "maxStudents": 100,
    "currentStudents": 0,
    "requirements": ["Basic reading skills", "Age 16+"],
    "learningObjectives": ["Fluency in English", "Grammar mastery", "Conversational skills"],
    "createdBy": "1",
    "hours": 120,
    "lessonLength": 60,
    "kind": "academic",
    "sharedWithMFs": ["1", "2"],
    "visibility": "private",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creator": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  },
  "message": "Program created successfully"
}
```

### 4. Update Program
**PUT** `/api/programs/{id}`

Updates an existing program. **HQ users only**.

#### Path Parameters
- `id`: Program ID

#### Request Body
```json
{
  "name": "Updated English Language Program",
  "currentStudents": 50,
  "status": "active"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Updated English Language Program",
    "description": "Comprehensive English language learning program for all levels",
    "status": "active",
    "category": "Language",
    "duration": 24,
    "price": 299.99,
    "maxStudents": 100,
    "currentStudents": 50,
    "requirements": ["Basic reading skills", "Age 16+"],
    "learningObjectives": ["Fluency in English", "Grammar mastery", "Conversational skills"],
    "createdBy": "1",
    "hours": 120,
    "lessonLength": 60,
    "kind": "academic",
    "sharedWithMFs": ["1", "2"],
    "visibility": "shared",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creator": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  },
  "message": "Program updated successfully"
}
```

### 5. Delete Program
**DELETE** `/api/programs/{id}`

Deletes a program. **HQ users only**. Cannot delete programs with existing subprograms.

#### Path Parameters
- `id`: Program ID

#### Response
```json
{
  "success": true,
  "data": null,
  "message": "Program deleted successfully"
}
```

## Role-Based Access Control

### HQ Users
- **Can see**: All programs regardless of visibility
- **Can create**: Yes
- **Can update**: Yes
- **Can delete**: Yes

### MF Users
- **Can see**: Public programs + Shared programs where `sharedWithMFs` includes their MF ID
- **Can create**: No
- **Can update**: No
- **Can delete**: No

### LC Users
- **Can see**: Public programs + Shared programs where `sharedWithMFs` includes their parent MF ID
- **Can create**: No
- **Can update**: No
- **Can delete**: No

### TT Users
- **Can see**: Only public programs
- **Can create**: No
- **Can update**: No
- **Can delete**: No

## Data Types

### Program Status
- `active`: Program is currently active
- `inactive`: Program is inactive
- `draft`: Program is in draft state

### Program Kind
- `academic`: Academic program
- `worksheet`: Worksheet-based program
- `birthday_party`: Birthday party program
- `stem_camp`: STEM camp program
- `vocational`: Vocational program
- `certification`: Certification program
- `workshop`: Workshop program

### Program Visibility
- `private`: Only visible to creator
- `shared`: Visible to specified MF users
- `public`: Visible to all users

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Only HQ can create programs."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Program not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Program with this name already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch programs"
}
```

## Database Schema

The API uses the following Prisma models:

```prisma
model Program {
  id                Int      @id @default(autoincrement())
  name              String
  description       String   @db.Text
  status            ProgramStatus @default(DRAFT)
  category          String
  duration          Int      // in weeks
  price             Decimal  @db.Decimal(10, 2)
  maxStudents       Int
  currentStudents   Int      @default(0)
  requirements      Json     // Array of strings
  learningObjectives Json    // Array of strings
  createdBy         Int      // User ID
  hours             Int      // Total program hours
  lessonLength      Int      // Length of each lesson in minutes
  kind              ProgramKind
  sharedWithMFs     Json     // Array of MF IDs
  visibility        ProgramVisibility @default(PRIVATE)
  
  // Relationships
  creator           User     @relation(fields: [createdBy], references: [id])
  subPrograms       SubProgram[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("programs")
}
```

## Migration Required

To use this API, you need to run the following Prisma commands:

```bash
# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma db push
```

## Testing

See `test-example.ts` for example API calls and expected responses that match the mock data structure.
