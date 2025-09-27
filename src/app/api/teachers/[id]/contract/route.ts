import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireLCAccess } from '@/backend/middleware/auth'

// PUT /api/teachers/[id]/contract - Upload contract for teacher
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

    // Only MF users can upload contracts
    if (user?.role !== 'MF_ADMIN' && user?.role !== 'MF_STAFF' && user?.role !== 'MF') {
      return errorResponse('Only MF users can upload contracts', 403)
    }

    // MF users can only upload contracts for teachers from their LCs
    if (existingTeacher.mfId !== user.mfId) {
      return errorResponse('Access denied', 403)
    }

    // Teacher must be in PROCESS status to upload contract
    if (existingTeacher.status !== 'PROCESS') {
      return errorResponse('Contract can only be uploaded for teachers in PROCESS status', 400)
    }

    const body = await request.json()
    const { contractFile, contractDate } = body

    // Validation
    if (!contractFile || !contractDate) {
      return errorResponse('Contract file and contract date are required', 400)
    }

    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        contractFile,
        contractDate: new Date(contractDate),
        contractUploadedBy: user.id,
        contractUploadedAt: new Date()
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

    return successResponse(teacher, 'Contract uploaded successfully')
  } catch (error: any) {
    console.error('Error uploading contract:', error)
    return errorResponse('Failed to upload contract', 500)
  }
}
