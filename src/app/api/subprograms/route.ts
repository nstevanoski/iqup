import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireAuth } from '@/backend/middleware/auth'

// GET /api/subprograms - Get all subprograms with filtering and pagination
export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const programId = searchParams.get('programId') || ''
    const pricingModel = searchParams.get('pricingModel') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    // Build where clause
    let whereClause: any = {}

    // Apply role-based filtering based on authenticated user
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC, TT)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC' | 'TT'
    
    // HQ can see all subprograms (no filtering)
    if (userRolePrefix === 'HQ') {
      // No additional filtering needed - HQ has full access
    }
    // MF users can see subprograms they created or that are shared with them
    else if (userRolePrefix === 'MF') {
      const allowedMfIds: number[] = []
      const allowedLcIds: number[] = []
      
      if (user.mfId) {
        allowedMfIds.push(user.mfId)
        // Get all LCs under this MF
        const lcs = await prisma.learningCenter.findMany({
          where: { mfId: user.mfId },
          select: { id: true }
        })
        allowedLcIds.push(...lcs.map((lc: any) => lc.id))
      }

      whereClause.OR = [
        // Subprograms created by this user
        { createdBy: user.id },
        // Public subprograms
        { visibility: 'PUBLIC' },
        // Shared subprograms
        {
          AND: [
            { visibility: 'SHARED' },
            {
              OR: [
                {
                  sharedWithMFs: {
                    path: '$',
                    array_contains: allowedMfIds
                  }
                },
                {
                  sharedWithLCs: {
                    path: '$',
                    array_contains: allowedLcIds
                  }
                }
              ]
            }
          ]
        }
      ]
    }
    // LC users can see subprograms shared with their LC or their parent MF
    else if (userRolePrefix === 'LC') {
      const allowedMfIds: number[] = []
      const allowedLcIds: number[] = []
      
      if (user.mfId) {
        allowedMfIds.push(user.mfId)
      }
      if (user.lcId) {
        allowedLcIds.push(user.lcId)
      }

      whereClause.OR = [
        // Public subprograms
        { visibility: 'PUBLIC' },
        // Shared subprograms
        {
          AND: [
            { visibility: 'SHARED' },
            {
              OR: [
                {
                  sharedWithMFs: {
                    path: '$',
                    array_contains: allowedMfIds
                  }
                },
                {
                  sharedWithLCs: {
                    path: '$',
                    array_contains: allowedLcIds
                  }
                }
              ]
            }
          ]
        }
      ]
    }
    // TT users can only see public subprograms
    else if (userRolePrefix === 'TT') {
      whereClause.visibility = 'PUBLIC'
    }
    else {
      return errorResponse('Invalid user role', 403)
    }

    // Apply search filter
    if (search && search.trim() !== '') {
      const searchFilter = {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      };
      
      if (whereClause.AND) {
        whereClause.AND.push(searchFilter);
      } else if (whereClause.OR) {
        whereClause.AND = [whereClause, searchFilter];
        delete whereClause.OR;
      } else {
        Object.assign(whereClause, searchFilter);
      }
    }

    // Apply status filter
    if (status && status.trim() !== '') {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'DRAFT']
      const upperStatus = status.toUpperCase()
      if (validStatuses.includes(upperStatus)) {
        if (whereClause.AND) {
          whereClause.AND.push({ status: upperStatus });
        } else if (whereClause.OR) {
          whereClause.AND = [whereClause, { status: upperStatus }];
          delete whereClause.OR;
        } else {
          whereClause.status = upperStatus;
        }
      }
    }

    // Apply program filter
    if (programId && programId.trim() !== '') {
      if (whereClause.AND) {
        whereClause.AND.push({ programId: parseInt(programId) });
      } else if (whereClause.OR) {
        whereClause.AND = [whereClause, { programId: parseInt(programId) }];
        delete whereClause.OR;
      } else {
        whereClause.programId = parseInt(programId);
      }
    }

    // Apply pricing model filter
    if (pricingModel && pricingModel.trim() !== '') {
      const validPricingModels = ['PER_COURSE', 'PER_MONTH', 'PER_SESSION', 'SUBSCRIPTION', 'PROGRAM_PRICE', 'ONE_TIME', 'INSTALLMENTS']
      const upperPricingModel = pricingModel.toUpperCase()
      if (validPricingModels.includes(upperPricingModel)) {
        if (whereClause.AND) {
          whereClause.AND.push({ pricingModel: upperPricingModel });
        } else if (whereClause.OR) {
          whereClause.AND = [whereClause, { pricingModel: upperPricingModel }];
          delete whereClause.OR;
        } else {
          whereClause.pricingModel = upperPricingModel;
        }
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Get subprograms with pagination
    const [subPrograms, total] = await Promise.all([
      prisma.subProgram.findMany({
        where: whereClause,
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
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.subProgram.count({ where: whereClause })
    ])

    // Transform the data to match the expected format
    const transformedSubPrograms = subPrograms.map((subProgram: any) => ({
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
    }))

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      data: transformedSubPrograms,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }, 'SubPrograms retrieved successfully')

  } catch (error) {
    console.error('Error fetching subprograms:', error)
    return errorResponse('Failed to fetch subprograms', 500)
  }
}

// POST /api/subprograms - Create new subprogram (MF and HQ only)
export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  // Check if user has MF or HQ role
  if (!user || (!user.role.startsWith('MF_') && !user.role.startsWith('HQ_'))) {
    return errorResponse('Access denied. Only MF and HQ can create subprograms.', 403)
  }

  try {
    const body = await request.json()
    const {
      programId,
      name,
      description,
      status = 'DRAFT',
      order = 1,
      duration,
      price,
      prerequisites = [],
      learningObjectives = [],
      pricingModel,
      coursePrice,
      numberOfPayments,
      gap,
      pricePerMonth,
      pricePerSession,
      sharedWithLCs = [],
      sharedWithMFs = [],
      visibility = 'PRIVATE'
    } = body

    // Validation - check required fields
    if (!programId || !name || !description || !duration || !pricingModel || !coursePrice) {
      return errorResponse('Missing required fields: programId, name, description, duration, pricingModel, coursePrice', 400)
    }

    // Validate enum values
    const validStatuses = ['ACTIVE', 'INACTIVE', 'DRAFT']
    const validPricingModels = ['PER_COURSE', 'PER_MONTH', 'PER_SESSION', 'SUBSCRIPTION', 'PROGRAM_PRICE', 'ONE_TIME', 'INSTALLMENTS']
    const validVisibilities = ['PRIVATE', 'SHARED', 'PUBLIC']

    if (!validStatuses.includes(status.toUpperCase())) {
      return errorResponse('Invalid status value', 400)
    }

    if (!validPricingModels.includes(pricingModel.toUpperCase())) {
      return errorResponse('Invalid pricing model value', 400)
    }

    if (!validVisibilities.includes(visibility.toUpperCase())) {
      return errorResponse('Invalid visibility value', 400)
    }

    // Verify program exists
    const program = await prisma.program.findUnique({
      where: { id: parseInt(programId) }
    })

    if (!program) {
      return errorResponse('Program not found', 404)
    }

    // Create subprogram
    const subProgram = await prisma.subProgram.create({
      data: {
        programId: parseInt(programId),
        name,
        description,
        status: status.toUpperCase() as any,
        order: parseInt(order),
        duration: parseInt(duration),
        price: parseFloat(price || '0'),
        prerequisites: prerequisites || [],
        learningObjectives: learningObjectives || [],
        createdBy: user.id,
        pricingModel: pricingModel.toUpperCase() as any,
        coursePrice: parseFloat(coursePrice),
        numberOfPayments: numberOfPayments ? parseInt(numberOfPayments) : null,
        gap: gap ? parseInt(gap) : null,
        pricePerMonth: pricePerMonth ? parseFloat(pricePerMonth) : null,
        pricePerSession: pricePerSession ? parseFloat(pricePerSession) : null,
        sharedWithLCs: sharedWithLCs.map((id: string) => parseInt(id)),
        sharedWithMFs: sharedWithMFs.length > 0 ? sharedWithMFs.map((id: string) => parseInt(id)) : null,
        visibility: visibility.toUpperCase() as any
      },
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

    return successResponse(transformedSubProgram, 'SubProgram created successfully', 201)

  } catch (error: any) {
    console.error('Error creating subprogram:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('SubProgram with this name already exists for this program', 409)
    }
    
    if (error.code === 'P2003') {
      return errorResponse('Invalid program reference', 400)
    }
    
    return errorResponse('Failed to create subprogram', 500)
  }
}
