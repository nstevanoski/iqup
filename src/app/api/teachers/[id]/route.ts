import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireLCAccess } from '@/backend/middleware/auth'

// GET /api/teachers/[id] - Get single teacher by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const teacherId = parseInt(resolvedParams.id)
    
    if (isNaN(teacherId)) {
      return errorResponse('Invalid teacher ID', 400)
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
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

    if (!teacher) {
      return errorResponse('Teacher not found', 404)
    }

    // Check access permissions based on user role
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // HQ can see all teachers
    if (userRolePrefix === 'HQ') {
      // No additional filtering for HQ users
    }
    // MF users can see teachers from their LCs
    else if (userRolePrefix === 'MF') {
      if (teacher.mfId !== user.mfId) {
        return errorResponse('Access denied', 403)
      }
    }
    // LC users can only see teachers from their own LC
    else if (userRolePrefix === 'LC') {
      if (teacher.lcId !== user.lcId) {
        return errorResponse('Access denied', 403)
      }
    }

    return successResponse(teacher, 'Teacher retrieved successfully')
  } catch (error) {
    console.error('Error fetching teacher:', error)
    return errorResponse('Failed to fetch teacher', 500)
  }
}

// PUT /api/teachers/[id] - Update teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const teacherId = parseInt(resolvedParams.id)
    
    if (isNaN(teacherId)) {
      return errorResponse('Invalid teacher ID', 400)
    }

    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    })

    if (!existingTeacher) {
      return errorResponse('Teacher not found', 404)
    }

    // Check access permissions
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // Only LC users can update teachers
    if (userRolePrefix !== 'LC') {
      return errorResponse('Only LC users can update teachers', 403)
    }

    // LC users can only update teachers from their own LC
    if (existingTeacher.lcId !== user.lcId) {
      return errorResponse('Access denied', 403)
    }

    const body = await request.json()
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      title,
      email,
      phone,
      experience,
      status,
      bio,
      avatar,
      address,
      city,
      state,
      country,
      postalCode,
      availability,
      education,
      trainings,
      specialization,
      qualifications
    } = body

    // Validation
    if (!firstName || !lastName || !dateOfBirth || !gender || !email) {
      return errorResponse('First name, last name, date of birth, gender, and email are required', 400)
    }

    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender.toUpperCase(),
        title,
        email,
        phone,
        experience: experience || 0,
        status: status ? status.toUpperCase() : existingTeacher.status,
        bio,
        avatar,
        address,
        city,
        state,
        country,
        postalCode,
        availability: availability ? JSON.stringify(availability) : existingTeacher.availability,
        education: education ? JSON.stringify(education) : existingTeacher.education,
        trainings: trainings ? JSON.stringify(trainings) : existingTeacher.trainings,
        specialization: specialization ? JSON.stringify(specialization) : existingTeacher.specialization,
        qualifications: qualifications ? JSON.stringify(qualifications) : existingTeacher.qualifications
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

    return successResponse(teacher, 'Teacher updated successfully')
  } catch (error: any) {
    console.error('Error updating teacher:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('Teacher with this information already exists', 409)
    }
    
    return errorResponse('Failed to update teacher', 500)
  }
}

// DELETE /api/teachers/[id] - Delete teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const teacherId = parseInt(resolvedParams.id)
    
    if (isNaN(teacherId)) {
      return errorResponse('Invalid teacher ID', 400)
    }

    // Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: teacherId }
    })

    if (!existingTeacher) {
      return errorResponse('Teacher not found', 404)
    }

    // Check access permissions
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // Only LC users can delete teachers
    if (userRolePrefix !== 'LC') {
      return errorResponse('Only LC users can delete teachers', 403)
    }

    // LC users can only delete teachers from their own LC
    if (existingTeacher.lcId !== user.lcId) {
      return errorResponse('Access denied', 403)
    }

    await prisma.teacher.delete({
      where: { id: teacherId }
    })

    return successResponse(null, 'Teacher deleted successfully')
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return errorResponse('Failed to delete teacher', 500)
  }
}
