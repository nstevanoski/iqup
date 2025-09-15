import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireLCAccess } from '@/backend/middleware/auth'

// GET /api/learning-groups/[id] - Get single learning group by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const learningGroupId = parseInt(resolvedParams.id)
    
    if (isNaN(learningGroupId)) {
      return errorResponse('Invalid learning group ID', 400)
    }

    const learningGroup = await (prisma as any).learningGroup.findUnique({
      where: { id: learningGroupId },
      include: {
        lc: {
          select: { id: true, name: true, code: true }
        },
        mf: {
          select: { id: true, name: true, code: true }
        },
        hq: {
          select: { id: true, name: true, code: true }
        },
        teacher: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        program: {
          select: { id: true, name: true, code: true }
        },
        subProgram: {
          select: { id: true, name: true }
        }
      }
    })

    if (!learningGroup) {
      return errorResponse('Learning group not found', 404)
    }

    // Check access permissions based on user role
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // HQ can see all learning groups
    if (userRolePrefix === 'HQ') {
      // No additional filtering for HQ users
    }
    // MF users can see learning groups from their LCs
    else if (userRolePrefix === 'MF') {
      if (learningGroup.mfId !== user.mfId) {
        return errorResponse('Access denied', 403)
      }
    }
    // LC users can only see learning groups from their own LC
    else if (userRolePrefix === 'LC') {
      if (learningGroup.lcId !== user.lcId) {
        return errorResponse('Access denied', 403)
      }
    }

    return successResponse(learningGroup, 'Learning group retrieved successfully')
  } catch (error) {
    console.error('Error fetching learning group:', error)
    return errorResponse('Failed to fetch learning group', 500)
  }
}

// PUT /api/learning-groups/[id] - Update learning group
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const learningGroupId = parseInt(resolvedParams.id)
    
    if (isNaN(learningGroupId)) {
      return errorResponse('Invalid learning group ID', 400)
    }

    // Check if learning group exists
    const existingLearningGroup = await (prisma as any).learningGroup.findUnique({
      where: { id: learningGroupId }
    })

    if (!existingLearningGroup) {
      return errorResponse('Learning group not found', 404)
    }

    // Check access permissions
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Only LC users can update learning groups
    if (user?.role !== 'LC_ADMIN' && user?.role !== 'LC_STAFF') {
      return errorResponse('Only LC users can update learning groups', 403)
    }

    // LC users can only update learning groups from their own LC
    if (existingLearningGroup.lcId !== user.lcId) {
      return errorResponse('Access denied', 403)
    }

    const body = await request.json()
    const {
      name,
      description,
      status,
      maxStudents,
      startDate,
      endDate,
      location,
      notes,
      schedule,
      pricingSnapshot,
      programId,
      subProgramId,
      teacherId,
      students
    } = body

    // Validation
    if (!name || !description || !maxStudents || !startDate || !endDate || !location || !programId || !teacherId) {
      return errorResponse('Name, description, max students, start date, end date, location, program, and teacher are required', 400)
    }

    // Verify program exists
    const program = await prisma.program.findFirst({
      where: { id: programId, status: 'ACTIVE' }
    })

    if (!program) {
      return errorResponse('Invalid or inactive Program', 400)
    }

    // Verify subprogram exists if provided
    if (subProgramId) {
      const subProgram = await prisma.subProgram.findFirst({
        where: { id: subProgramId, status: 'ACTIVE' }
      })

      if (!subProgram) {
        return errorResponse('Invalid or inactive SubProgram', 400)
      }
    }

    // Verify teacher exists and belongs to the same LC
    const teacher = await prisma.teacher.findFirst({
      where: { 
        id: teacherId, 
        status: 'ACTIVE',
        lcId: existingLearningGroup.lcId
      }
    })

    if (!teacher) {
      return errorResponse('Invalid teacher or teacher does not belong to this Learning Center', 400)
    }

    const learningGroup = await (prisma as any).learningGroup.update({
      where: { id: learningGroupId },
      data: {
        name,
        description,
        status: status ? status.toUpperCase() : existingLearningGroup.status,
        maxStudents,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        notes,
        schedule: schedule ? JSON.stringify(schedule) : undefined,
        pricingSnapshot: pricingSnapshot ? JSON.stringify(pricingSnapshot) : undefined,
        programId: parseInt(programId),
        subProgramId: subProgramId ? parseInt(subProgramId) : undefined,
        teacherId: parseInt(teacherId),
        students: students ? JSON.stringify(students) : undefined
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
        },
        teacher: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        program: {
          select: { id: true, name: true, code: true }
        },
        subProgram: {
          select: { id: true, name: true }
        }
      }
    })

    return successResponse(learningGroup, 'Learning group updated successfully')
  } catch (error: any) {
    console.error('Error updating learning group:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('Learning group with this information already exists', 409)
    }
    
    return errorResponse('Failed to update learning group', 500)
  }
}

// DELETE /api/learning-groups/[id] - Delete learning group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const learningGroupId = parseInt(resolvedParams.id)
    
    if (isNaN(learningGroupId)) {
      return errorResponse('Invalid learning group ID', 400)
    }

    // Check if learning group exists
    const existingLearningGroup = await (prisma as any).learningGroup.findUnique({
      where: { id: learningGroupId }
    })

    if (!existingLearningGroup) {
      return errorResponse('Learning group not found', 404)
    }

    // Check access permissions
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Only LC users can delete learning groups
    if (user?.role !== 'LC_ADMIN' && user?.role !== 'LC_STAFF') {
      return errorResponse('Only LC users can delete learning groups', 403)
    }

    // LC users can only delete learning groups from their own LC
    if (existingLearningGroup.lcId !== user.lcId) {
      return errorResponse('Access denied', 403)
    }

    await (prisma as any).learningGroup.delete({
      where: { id: learningGroupId }
    })

    return successResponse(null, 'Learning group deleted successfully')
  } catch (error) {
    console.error('Error deleting learning group:', error)
    return errorResponse('Failed to delete learning group', 500)
  }
}
