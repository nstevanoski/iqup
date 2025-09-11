import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireAuth } from '@/backend/middleware/auth'

// GET /api/programs/[id] - Get single program by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const programId = parseInt(resolvedParams.id)
    
    if (isNaN(programId)) {
      return errorResponse('Invalid program ID', 400)
    }

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        subPrograms: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            order: true,
            duration: true,
            price: true,
            pricingModel: true,
            coursePrice: true,
            visibility: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            subPrograms: true
          }
        }
      }
    })

    if (!program) {
      return errorResponse('Program not found', 404)
    }

    // Check access permissions based on user role
    const userRole = request.nextUrl.searchParams.get('userRole') as 'HQ' | 'MF' | 'LC' | 'TT' | null
    const userScope = request.nextUrl.searchParams.get('userScope') || ''

    if (userRole === 'MF' || userRole === 'LC') {
      let allowed = program.visibility === 'PUBLIC'
      if (!allowed && program.visibility === 'SHARED') {
        const allowedMfIds = program.sharedWithMFs as number[]
        if (userRole === 'MF' && userScope) {
          allowed = allowedMfIds.includes(parseInt(userScope))
        } else if (userRole === 'LC' && userScope) {
          // Get parent MF ID for LC scope
          const lc = await prisma.learningCenter.findUnique({
            where: { id: parseInt(userScope) },
            select: { mfId: true }
          })
          if (lc) {
            allowed = allowedMfIds.includes(lc.mfId)
          }
        }
      }
      if (!allowed) {
        return errorResponse('Access denied', 403)
      }
    } else if (userRole === 'TT') {
      if (program.visibility !== 'PUBLIC') {
        return errorResponse('Access denied', 403)
      }
    }

    // Transform the response
    const transformedProgram = {
      id: program.id.toString(),
      name: program.name,
      description: program.description,
      status: program.status.toLowerCase(),
      category: program.category,
      duration: program.duration,
      price: parseFloat(program.price.toString()),
      maxStudents: program.maxStudents,
      currentStudents: program.currentStudents,
      requirements: program.requirements as string[],
      learningObjectives: program.learningObjectives as string[],
      createdBy: program.createdBy.toString(),
      hours: program.hours,
      lessonLength: program.lessonLength,
      kind: program.kind.toLowerCase(),
      sharedWithMFs: (program.sharedWithMFs as number[]).map(id => id.toString()),
      visibility: program.visibility.toLowerCase(),
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
      creator: program.creator,
      subPrograms: program.subPrograms.map((sub: any) => ({
        id: sub.id.toString(),
        name: sub.name,
        description: sub.description,
        status: sub.status.toLowerCase(),
        order: sub.order,
        duration: sub.duration,
        price: parseFloat(sub.price.toString()),
        pricingModel: sub.pricingModel.toLowerCase(),
        coursePrice: parseFloat(sub.coursePrice.toString()),
        visibility: sub.visibility.toLowerCase(),
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt
      })),
      subProgramCount: program._count.subPrograms
    }

    return successResponse(transformedProgram, 'Program retrieved successfully')

  } catch (error) {
    console.error('Error fetching program:', error)
    return errorResponse('Failed to fetch program', 500)
  }
}

// PUT /api/programs/[id] - Update program (HQ only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  // Check if user has HQ role
  if (!user || !user.role.startsWith('HQ_')) {
    return errorResponse('Access denied. Only HQ can update programs.', 403)
  }

  try {
    const resolvedParams = await params;
    const programId = parseInt(resolvedParams.id)
    
    if (isNaN(programId)) {
      return errorResponse('Invalid program ID', 400)
    }

    const body = await request.json()
    const {
      name,
      description,
      status,
      category,
      duration,
      price,
      maxStudents,
      currentStudents,
      requirements,
      learningObjectives,
      hours,
      lessonLength,
      kind,
      sharedWithMFs,
      visibility
    } = body

    // Build update data object
    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status !== undefined) {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'DRAFT']
      if (!validStatuses.includes(status.toUpperCase())) {
        return errorResponse('Invalid status value', 400)
      }
      updateData.status = status.toUpperCase()
    }
    if (category !== undefined) updateData.category = category
    if (duration !== undefined) updateData.duration = parseInt(duration)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (maxStudents !== undefined) updateData.maxStudents = parseInt(maxStudents)
    if (currentStudents !== undefined) updateData.currentStudents = parseInt(currentStudents)
    if (requirements !== undefined) updateData.requirements = requirements
    if (learningObjectives !== undefined) updateData.learningObjectives = learningObjectives
    if (hours !== undefined) updateData.hours = parseInt(hours)
    if (lessonLength !== undefined) updateData.lessonLength = parseInt(lessonLength)
    if (kind !== undefined) {
      const validKinds = ['ACADEMIC', 'WORKSHEET', 'BIRTHDAY_PARTY', 'STEM_CAMP', 'VOCATIONAL', 'CERTIFICATION', 'WORKSHOP']
      if (!validKinds.includes(kind.toUpperCase())) {
        return errorResponse('Invalid kind value', 400)
      }
      updateData.kind = kind.toUpperCase()
    }
    if (sharedWithMFs !== undefined) updateData.sharedWithMFs = sharedWithMFs.map((id: string) => parseInt(id))
    if (visibility !== undefined) {
      const validVisibilities = ['PRIVATE', 'SHARED', 'PUBLIC']
      if (!validVisibilities.includes(visibility.toUpperCase())) {
        return errorResponse('Invalid visibility value', 400)
      }
      updateData.visibility = visibility.toUpperCase()
    }

    const program = await prisma.program.update({
      where: { id: programId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Transform the response
    const transformedProgram = {
      id: program.id.toString(),
      name: program.name,
      description: program.description,
      status: program.status.toLowerCase(),
      category: program.category,
      duration: program.duration,
      price: parseFloat(program.price.toString()),
      maxStudents: program.maxStudents,
      currentStudents: program.currentStudents,
      requirements: program.requirements as string[],
      learningObjectives: program.learningObjectives as string[],
      createdBy: program.createdBy.toString(),
      hours: program.hours,
      lessonLength: program.lessonLength,
      kind: program.kind.toLowerCase(),
      sharedWithMFs: (program.sharedWithMFs as number[]).map(id => id.toString()),
      visibility: program.visibility.toLowerCase(),
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
      creator: program.creator
    }

    return successResponse(transformedProgram, 'Program updated successfully')

  } catch (error: any) {
    console.error('Error updating program:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('Program not found', 404)
    }
    
    if (error.code === 'P2002') {
      return errorResponse('Program with this name already exists', 409)
    }
    
    return errorResponse('Failed to update program', 500)
  }
}

// DELETE /api/programs/[id] - Delete program (HQ only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  // Check if user has HQ role
  if (!user || !user.role.startsWith('HQ_')) {
    return errorResponse('Access denied. Only HQ can delete programs.', 403)
  }

  try {
    const resolvedParams = await params;
    const programId = parseInt(resolvedParams.id)
    
    if (isNaN(programId)) {
      return errorResponse('Invalid program ID', 400)
    }

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        _count: {
          select: {
            subPrograms: true
          }
        }
      }
    })

    if (!existingProgram) {
      return errorResponse('Program not found', 404)
    }

    // Check if program has subprograms
    if (existingProgram._count.subPrograms > 0) {
      return errorResponse('Cannot delete program with existing subprograms. Please delete subprograms first.', 409)
    }

    // Delete the program
    await prisma.program.delete({
      where: { id: programId }
    })

    return successResponse(null, 'Program deleted successfully')

  } catch (error: any) {
    console.error('Error deleting program:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('Program not found', 404)
    }
    
    return errorResponse('Failed to delete program', 500)
  }
}
