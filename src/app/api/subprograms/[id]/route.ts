import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireAuth } from '@/backend/middleware/auth'

// GET /api/subprograms/[id] - Get single subprogram by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  try {
    const resolvedParams = await params;
    const subProgramId = parseInt(resolvedParams.id)
    
    if (isNaN(subProgramId)) {
      return errorResponse('Invalid subprogram ID', 400)
    }

    const subProgram = await prisma.subProgram.findUnique({
      where: { id: subProgramId },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        program: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            category: true,
            duration: true,
            price: true,
            maxStudents: true,
            currentStudents: true,
            requirements: true,
            learningObjectives: true,
            hours: true,
            lessonLength: true,
            kind: true,
            visibility: true
          }
        }
      }
    })

    if (!subProgram) {
      return errorResponse('SubProgram not found', 404)
    }

    // Check access permissions based on authenticated user
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC, TT)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC' | 'TT'
    
    // HQ can view all subprograms
    if (userRolePrefix === 'HQ') {
      // No additional checks needed - HQ has full access
    }
    // MF users can view subprograms they created or that are shared with them
    else if (userRolePrefix === 'MF') {
      let allowed = false
      
      // Check if MF created this subprogram
      if (subProgram.createdBy === user.id) {
        allowed = true
      }
      // Check if subprogram is public
      else if (subProgram.visibility === 'PUBLIC') {
        allowed = true
      }
      // Check if subprogram is shared with this MF
      else if (subProgram.visibility === 'SHARED' && user.mfId) {
        const allowedMfIds = subProgram.sharedWithMFs as number[] || []
        allowed = allowedMfIds.includes(user.mfId)
      }
      
      if (!allowed) {
        return errorResponse('Access denied', 403)
      }
    }
    // LC users can view subprograms shared with their LC or their parent MF
    else if (userRolePrefix === 'LC') {
      let allowed = false
      
      // Check if subprogram is public
      if (subProgram.visibility === 'PUBLIC') {
        allowed = true
      }
      // Check if subprogram is shared with this LC or its parent MF
      else if (subProgram.visibility === 'SHARED') {
        const allowedMfIds = subProgram.sharedWithMFs as number[] || []
        const allowedLcIds = subProgram.sharedWithLCs as number[] || []
        
        // Check if LC is directly shared
        if (user.lcId && allowedLcIds.includes(user.lcId)) {
          allowed = true
        }
        // Check if parent MF is shared
        else if (user.mfId && allowedMfIds.includes(user.mfId)) {
          allowed = true
        }
      }
      
      if (!allowed) {
        return errorResponse('Access denied', 403)
      }
    }
    // TT users can only view public subprograms
    else if (userRolePrefix === 'TT') {
      if (subProgram.visibility !== 'PUBLIC') {
        return errorResponse('Access denied', 403)
      }
    }
    else {
      return errorResponse('Invalid user role', 403)
    }

    // Transform the response
    const transformedSubProgram = {
      id: subProgram.id.toString(),
      programId: subProgram.programId.toString(),
      name: subProgram.name,
      description: subProgram.description,
      status: subProgram.status.toLowerCase(),
      order: subProgram.order,
      duration: subProgram.duration,
      price: parseFloat(subProgram.price.toString()),
      prerequisites: subProgram.prerequisites as string[],
      learningObjectives: subProgram.learningObjectives as string[],
      createdBy: subProgram.createdBy.toString(),
      pricingModel: subProgram.pricingModel.toLowerCase(),
      coursePrice: parseFloat(subProgram.coursePrice.toString()),
      numberOfPayments: subProgram.numberOfPayments,
      gap: subProgram.gap,
      pricePerMonth: subProgram.pricePerMonth ? parseFloat(subProgram.pricePerMonth.toString()) : undefined,
      pricePerSession: subProgram.pricePerSession ? parseFloat(subProgram.pricePerSession.toString()) : undefined,
      sharedWithLCs: (subProgram.sharedWithLCs as number[]).filter(id => id !== null).map(id => id.toString()),
      sharedWithMFs: subProgram.sharedWithMFs ? (subProgram.sharedWithMFs as number[]).filter(id => id !== null).map(id => id.toString()) : undefined,
      visibility: subProgram.visibility.toLowerCase(),
      createdAt: subProgram.createdAt,
      updatedAt: subProgram.updatedAt,
      creator: subProgram.creator,
      program: {
        id: subProgram.program.id.toString(),
        name: subProgram.program.name,
        description: subProgram.program.description,
        status: subProgram.program.status.toLowerCase(),
        category: subProgram.program.category,
        duration: subProgram.program.duration,
        price: parseFloat(subProgram.program.price.toString()),
        maxStudents: subProgram.program.maxStudents,
        currentStudents: subProgram.program.currentStudents,
        requirements: subProgram.program.requirements as string[],
        learningObjectives: subProgram.program.learningObjectives as string[],
        hours: subProgram.program.hours,
        lessonLength: subProgram.program.lessonLength,
        kind: subProgram.program.kind.toLowerCase(),
        visibility: subProgram.program.visibility.toLowerCase()
      }
    }

    return successResponse(transformedSubProgram, 'SubProgram retrieved successfully')

  } catch (error) {
    console.error('Error fetching subprogram:', error)
    return errorResponse('Failed to fetch subprogram', 500)
  }
}

// PUT /api/subprograms/[id] - Update subprogram (MF and HQ only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  // Check if user has MF or HQ role
  if (!user || (!user.role.startsWith('MF_') && !user.role.startsWith('HQ_'))) {
    return errorResponse('Access denied. Only MF and HQ can update subprograms.', 403)
  }

  try {
    const resolvedParams = await params;
    const subProgramId = parseInt(resolvedParams.id)
    
    if (isNaN(subProgramId)) {
      return errorResponse('Invalid subprogram ID', 400)
    }

    const body = await request.json()
    const {
      name,
      description,
      status,
      order,
      duration,
      price,
      prerequisites,
      learningObjectives,
      pricingModel,
      coursePrice,
      numberOfPayments,
      gap,
      pricePerMonth,
      pricePerSession,
      sharedWithLCs,
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
    if (order !== undefined) updateData.order = parseInt(order)
    if (duration !== undefined) updateData.duration = parseInt(duration)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (prerequisites !== undefined) updateData.prerequisites = prerequisites
    if (learningObjectives !== undefined) updateData.learningObjectives = learningObjectives
    if (pricingModel !== undefined) {
      const validPricingModels = ['PER_COURSE', 'PER_MONTH', 'PER_SESSION', 'SUBSCRIPTION', 'PROGRAM_PRICE', 'ONE_TIME', 'INSTALLMENTS']
      if (!validPricingModels.includes(pricingModel.toUpperCase())) {
        return errorResponse('Invalid pricing model value', 400)
      }
      updateData.pricingModel = pricingModel.toUpperCase()
    }
    if (coursePrice !== undefined) updateData.coursePrice = parseFloat(coursePrice)
    if (numberOfPayments !== undefined) updateData.numberOfPayments = numberOfPayments ? parseInt(numberOfPayments) : null
    if (gap !== undefined) updateData.gap = gap ? parseInt(gap) : null
    if (pricePerMonth !== undefined) updateData.pricePerMonth = pricePerMonth ? parseFloat(pricePerMonth) : null
    if (pricePerSession !== undefined) updateData.pricePerSession = pricePerSession ? parseFloat(pricePerSession) : null
    if (sharedWithLCs !== undefined) updateData.sharedWithLCs = sharedWithLCs.map((id: string) => parseInt(id))
    if (sharedWithMFs !== undefined) updateData.sharedWithMFs = sharedWithMFs.length > 0 ? sharedWithMFs.map((id: string) => parseInt(id)) : null
    if (visibility !== undefined) {
      const validVisibilities = ['PRIVATE', 'SHARED', 'PUBLIC']
      if (!validVisibilities.includes(visibility.toUpperCase())) {
        return errorResponse('Invalid visibility value', 400)
      }
      updateData.visibility = visibility.toUpperCase()
    }

    const subProgram = await prisma.subProgram.update({
      where: { id: subProgramId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        program: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true
          }
        }
      }
    })

    // Transform the response
    const transformedSubProgram = {
      id: subProgram.id.toString(),
      programId: subProgram.programId.toString(),
      name: subProgram.name,
      description: subProgram.description,
      status: subProgram.status.toLowerCase(),
      order: subProgram.order,
      duration: subProgram.duration,
      price: parseFloat(subProgram.price.toString()),
      prerequisites: subProgram.prerequisites as string[],
      learningObjectives: subProgram.learningObjectives as string[],
      createdBy: subProgram.createdBy.toString(),
      pricingModel: subProgram.pricingModel.toLowerCase(),
      coursePrice: parseFloat(subProgram.coursePrice.toString()),
      numberOfPayments: subProgram.numberOfPayments,
      gap: subProgram.gap,
      pricePerMonth: subProgram.pricePerMonth ? parseFloat(subProgram.pricePerMonth.toString()) : undefined,
      pricePerSession: subProgram.pricePerSession ? parseFloat(subProgram.pricePerSession.toString()) : undefined,
      sharedWithLCs: (subProgram.sharedWithLCs as number[]).filter(id => id !== null).map(id => id.toString()),
      sharedWithMFs: subProgram.sharedWithMFs ? (subProgram.sharedWithMFs as number[]).filter(id => id !== null).map(id => id.toString()) : undefined,
      visibility: subProgram.visibility.toLowerCase(),
      createdAt: subProgram.createdAt,
      updatedAt: subProgram.updatedAt,
      creator: subProgram.creator,
      program: subProgram.program
    }

    return successResponse(transformedSubProgram, 'SubProgram updated successfully')

  } catch (error: any) {
    console.error('Error updating subprogram:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('SubProgram not found', 404)
    }
    
    if (error.code === 'P2002') {
      return errorResponse('SubProgram with this name already exists for this program', 409)
    }
    
    return errorResponse('Failed to update subprogram', 500)
  }
}

// DELETE /api/subprograms/[id] - Delete subprogram (MF and HQ only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  // Check if user has MF or HQ role
  if (!user || (!user.role.startsWith('MF_') && !user.role.startsWith('HQ_'))) {
    return errorResponse('Access denied. Only MF and HQ can delete subprograms.', 403)
  }

  try {
    const resolvedParams = await params;
    const subProgramId = parseInt(resolvedParams.id)
    
    if (isNaN(subProgramId)) {
      return errorResponse('Invalid subprogram ID', 400)
    }

    // Check if subprogram exists
    const existingSubProgram = await prisma.subProgram.findUnique({
      where: { id: subProgramId }
    })

    if (!existingSubProgram) {
      return errorResponse('SubProgram not found', 404)
    }

    // Check if subprogram has any dependencies that would prevent deletion
    // This would depend on your business logic - for example:
    // - Check if there are active learning groups using this subprogram
    // - Check if there are student enrollments
    // For now, we'll allow deletion

    // Delete the subprogram
    await prisma.subProgram.delete({
      where: { id: subProgramId }
    })

    return successResponse(null, 'SubProgram deleted successfully')

  } catch (error: any) {
    console.error('Error deleting subprogram:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('SubProgram not found', 404)
    }
    
    return errorResponse('Failed to delete subprogram', 500)
  }
}
