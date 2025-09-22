import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireAuth } from '@/backend/middleware/auth'

// GET /api/programs - Get all programs with filtering and pagination
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
    const category = searchParams.get('category') || ''
    const kind = searchParams.get('kind') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const userRole = searchParams.get('userRole') as 'HQ' | 'MF' | 'LC' | 'TT' | null
    const userScope = searchParams.get('userScope') || ''

    // Build where clause
    let whereClause: any = {}

    // Apply role-based filtering using authenticated user's role
    let roleFilter: any = {}
    const isMFUser = user.role === 'MF_ADMIN' || user.role === 'MF_STAFF'
    const isLCUser = user.role === 'LC_ADMIN' || user.role === 'LC_STAFF'
    const isTTUser = user.role === 'TT_ADMIN' || user.role === 'TT_STAFF'
    const isHQUser = user.role === 'HQ_ADMIN' || user.role === 'HQ_STAFF'
    
    if (isMFUser || isLCUser) {
      // MF can see shared programs for their MF scope
      // LC inherits visibility from its parent MF
      const allowedMfIds: number[] = []
      if (isMFUser && user.mfId) {
        // Use authenticated user's MF ID directly for security
        allowedMfIds.push(user.mfId)
      } else if (isLCUser && user.lcId) {
        // Get parent MF ID for LC scope using authenticated user's LC ID
        const lc = await prisma.learningCenter.findUnique({
          where: { id: user.lcId },
          select: { mfId: true }
        })
        if (lc) allowedMfIds.push(lc.mfId)
      }

      roleFilter.OR = [
        { visibility: 'PUBLIC' },
        {
          AND: [
            { visibility: 'SHARED' },
            {
              sharedWithMFs: {
                path: '$',
                array_contains: [user.mfId]
              }
            }
          ]
        }
      ]
    } else if (isTTUser) {
      // TT can only see public programs
      roleFilter.visibility = 'PUBLIC'
    }
    // HQ can see all programs (no filtering)

    // Apply search filter
    let searchFilter: any = {}
    if (search) {
      searchFilter.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } }
      ]
    }

    // Combine role and search filters
    if (Object.keys(roleFilter).length > 0 && Object.keys(searchFilter).length > 0) {
      whereClause.AND = [roleFilter, searchFilter]
    } else if (Object.keys(roleFilter).length > 0) {
      Object.assign(whereClause, roleFilter)
    } else if (Object.keys(searchFilter).length > 0) {
      Object.assign(whereClause, searchFilter)
    }

    // Apply status filter
    if (status && status.trim() !== '') {
      const validStatuses = ['ACTIVE', 'INACTIVE', 'DRAFT']
      const upperStatus = status.toUpperCase()
      if (validStatuses.includes(upperStatus)) {
        // Add status filter to existing where clause
        if (whereClause.AND) {
          whereClause.AND.push({ status: upperStatus });
        } else if (whereClause.OR) {
          // Create a new AND clause with the existing OR clause and status filter
          const existingOr = whereClause.OR;
          whereClause.AND = [{ OR: existingOr }, { status: upperStatus }];
          delete whereClause.OR;
        } else {
          whereClause.status = upperStatus;
        }
      }
    }

    // Apply category filter
    if (category && category.trim() !== '') {
      whereClause.category = category
    }

    // Apply kind filter
    if (kind && kind.trim() !== '') {
      const validKinds = ['ACADEMIC', 'WORKSHEET', 'BIRTHDAY_PARTY', 'STEM_CAMP', 'VOCATIONAL', 'CERTIFICATION', 'WORKSHOP']
      const upperKind = kind.toUpperCase()
      if (validKinds.includes(upperKind)) {
        whereClause.kind = upperKind
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build orderBy clause
    const orderBy: any = {}
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc'
    orderBy[sortBy] = validSortOrder

    // Get programs with pagination
    const [programs, total] = await Promise.all([
      prisma.program.findMany({
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
          subPrograms: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          _count: {
            select: {
              subPrograms: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.program.count({ where: whereClause })
    ])

    // Transform the data to match the expected format
    const transformedPrograms = programs.map((program: any) => ({
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
      sharedWithMFs: (program.sharedWithMFs as number[]).filter(id => id !== null).map(id => id.toString()),
      visibility: program.visibility.toLowerCase(),
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
      creator: program.creator,
      subPrograms: program.subPrograms,
      subProgramCount: program._count.subPrograms
    }))

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      data: transformedPrograms,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }, 'Programs retrieved successfully')

  } catch (error) {
    console.error('Error fetching programs:', error)
    return errorResponse('Failed to fetch programs', 500)
  }
}

// POST /api/programs - Create new program (HQ only)
export async function POST(request: NextRequest) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  // Check if user has HQ role
  if (!user || !user.role.startsWith('HQ_')) {
    return errorResponse('Access denied. Only HQ can create programs.', 403)
  }

  try {
    const body = await request.json()
    const {
      name,
      description,
      status = 'DRAFT',
      category,
      duration,
      price,
      maxStudents,
      currentStudents = 0,
      requirements = [],
      learningObjectives = [],
      hours,
      lessonLength,
      kind,
      sharedWithMFs = [],
      visibility = 'PRIVATE'
    } = body

    // Validation - only check fields that are actually provided by the frontend form
    if (!name || !description || !duration || !maxStudents || !hours || !lessonLength || !kind) {
      return errorResponse('Missing required fields', 400)
    }

    // Validate enum values
    const validStatuses = ['ACTIVE', 'INACTIVE', 'DRAFT']
    const validKinds = ['ACADEMIC', 'WORKSHEET', 'BIRTHDAY_PARTY', 'STEM_CAMP', 'VOCATIONAL', 'CERTIFICATION', 'WORKSHOP']
    const validVisibilities = ['PRIVATE', 'SHARED', 'PUBLIC']

    if (!validStatuses.includes(status.toUpperCase())) {
      return errorResponse('Invalid status value', 400)
    }

    if (!validKinds.includes(kind.toUpperCase())) {
      return errorResponse('Invalid kind value', 400)
    }

    if (!validVisibilities.includes(visibility.toUpperCase())) {
      return errorResponse('Invalid visibility value', 400)
    }

    // Create program
    const program = await prisma.program.create({
      data: {
        name,
        description,
        status: status.toUpperCase() as any,
        category: category || 'General', // Default category if not provided
        duration: parseInt(duration),
        price: parseFloat(price || '0'), // Default price if not provided
        maxStudents: parseInt(maxStudents),
        currentStudents: parseInt(currentStudents),
        requirements: requirements || [], // Default empty array if not provided
        learningObjectives: learningObjectives || [], // Default empty array if not provided
        createdBy: user.id,
        hours: parseInt(hours),
        lessonLength: parseInt(lessonLength),
        kind: kind.toUpperCase() as any,
        sharedWithMFs: sharedWithMFs.map((id: string) => parseInt(id)),
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
      sharedWithMFs: (program.sharedWithMFs as number[]).filter(id => id !== null).map(id => id.toString()),
      visibility: program.visibility.toLowerCase(),
      createdAt: program.createdAt,
      updatedAt: program.updatedAt,
      creator: program.creator
    }

    return successResponse(transformedProgram, 'Program created successfully', 201)

  } catch (error: any) {
    console.error('Error creating program:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('Program with this name already exists', 409)
    }
    
    return errorResponse('Failed to create program', 500)
  }
}
