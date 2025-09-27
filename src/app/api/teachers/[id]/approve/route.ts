import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireLCAccess } from '@/backend/middleware/auth'

// PUT /api/teachers/[id]/approve - Approve teacher
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

    // Only HQ users can approve teachers
    if (user?.role !== 'HQ_ADMIN' && user?.role !== 'HQ_STAFF' && user?.role !== 'HQ') {
      return errorResponse('Only HQ users can approve teachers', 403)
    }

    // Teacher must have a contract uploaded to be approved
    if (!existingTeacher.contractFile || !existingTeacher.contractDate) {
      return errorResponse('Teacher must have a contract uploaded before approval', 400)
    }

    // Teacher must be in PROCESS status to be approved
    if (existingTeacher.status !== 'PROCESS') {
      return errorResponse('Only teachers in PROCESS status can be approved', 400)
    }

    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        status: 'ACTIVE',
        approvedBy: user.id,
        approvedAt: new Date()
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

    return successResponse(teacher, 'Teacher approved successfully')
  } catch (error: any) {
    console.error('Error approving teacher:', error)
    return errorResponse('Failed to approve teacher', 500)
  }
}
