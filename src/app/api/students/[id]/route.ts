import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireLCAccess } from '@/backend/middleware/auth'

// GET /api/students/[id] - Get single student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const studentId = parseInt(resolvedParams.id)
    
    if (isNaN(studentId)) {
      return errorResponse('Invalid student ID', 400)
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        lc: {
          select: { id: true, name: true, code: true }
        },
        mf: {
          select: { id: true, name: true, code: true }
        },
        hq: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    if (!student) {
      return errorResponse('Student not found', 404)
    }

    // Check access permissions based on user role
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // HQ can see all students
    if (userRolePrefix === 'HQ') {
      // No additional filtering for HQ users
    }
    // MF users can see students from their LCs
    else if (userRolePrefix === 'MF') {
      if (student.mfId !== user.mfId) {
        return errorResponse('Access denied', 403)
      }
    }
    // LC users can only see students from their own LC
    else if (userRolePrefix === 'LC') {
      if (student.lcId !== user.lcId) {
        return errorResponse('Access denied', 403)
      }
    }

    return successResponse(student, 'Student retrieved successfully')
  } catch (error) {
    console.error('Error fetching student:', error)
    return errorResponse('Failed to fetch student', 500)
  }
}

// PUT /api/students/[id] - Update student
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const studentId = parseInt(resolvedParams.id)
    
    if (isNaN(studentId)) {
      return errorResponse('Invalid student ID', 400)
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!existingStudent) {
      return errorResponse('Student not found', 404)
    }

    // Check access permissions
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // Only LC users can update students
    if (userRolePrefix !== 'LC') {
      return errorResponse('Only LC users can update students', 403)
    }

    // LC users can only update students from their own LC
    if (existingStudent.lcId !== user.lcId) {
      return errorResponse('Access denied', 403)
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      enrollmentDate,
      status,
      address,
      city,
      state,
      country,
      postalCode,
      parentFirstName,
      parentLastName,
      parentPhone,
      parentEmail,
      emergencyContactEmail,
      emergencyContactPhone,
      notes,
      avatar
    } = body

    // Validation
    if (!firstName || !lastName || !dateOfBirth || !gender) {
      return errorResponse('First name, last name, date of birth, and gender are required', 400)
    }

    if (!parentFirstName || !parentLastName || !parentPhone || !parentEmail) {
      return errorResponse('Parent information is required', 400)
    }

    const student = await prisma.student.update({
      where: { id: studentId },
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender.toUpperCase(),
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : null,
        status: status ? status.toUpperCase() : existingStudent.status,
        address,
        city,
        state,
        country,
        postalCode,
        parentFirstName,
        parentLastName,
        parentPhone,
        parentEmail,
        emergencyContactEmail,
        emergencyContactPhone,
        notes,
        avatar
      },
      include: {
        lc: {
          select: { id: true, name: true, code: true }
        },
        mf: {
          select: { id: true, name: true, code: true }
        },
        hq: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    return successResponse(student, 'Student updated successfully')
  } catch (error: any) {
    console.error('Error updating student:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('Student with this information already exists', 409)
    }
    
    return errorResponse('Failed to update student', 500)
  }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const studentId = parseInt(resolvedParams.id)
    
    if (isNaN(studentId)) {
      return errorResponse('Invalid student ID', 400)
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId }
    })

    if (!existingStudent) {
      return errorResponse('Student not found', 404)
    }

    // Check access permissions
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // Only LC users can delete students
    if (userRolePrefix !== 'LC') {
      return errorResponse('Only LC users can delete students', 403)
    }

    // LC users can only delete students from their own LC
    if (existingStudent.lcId !== user.lcId) {
      return errorResponse('Access denied', 403)
    }

    await prisma.student.delete({
      where: { id: studentId }
    })

    return successResponse(null, 'Student deleted successfully')
  } catch (error) {
    console.error('Error deleting student:', error)
    return errorResponse('Failed to delete student', 500)
  }
}
