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

    // Apply role-based filtering
    if (userRole === 'MF' || userRole === 'LC') {
      // MF can see shared programs for their MF scope
      // LC inherits visibility from its parent MF
      const allowedMfIds: number[] = []
      if (userRole === 'MF' && userScope) {
        allowedMfIds.push(parseInt(userScope))
      } else if (userRole === 'LC' && userScope) {
        // Get parent MF ID for LC scope
        const lc = await prisma.learningCenter.findUnique({
          where: { id: parseInt(userScope) },
          select: { mfId: true }
        })
        if (lc) allowedMfIds.push(lc.mfId)
      }

      whereClause.OR = [
        { visibility: 'PUBLIC' },
        {
          AND: [
            { visibility: 'SHARED' },
            {
              sharedWithMFs: {
                path: '$',
                array_contains: allowedMfIds
              }
            }
          ]
        }
      ]
    } else if (userRole === 'TT') {
      // TT can only see public programs
      whereClause.visibility = 'PUBLIC'
    }
    // HQ can see all programs (no filtering)

    // Apply search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { kind: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Apply status filter
    if (status) {
      whereClause.status = status.toUpperCase()
    }

    // Apply category filter
    if (category) {
      whereClause.category = { contains: category, mode: 'insensitive' }
    }

    // Apply kind filter
    if (kind) {
      whereClause.kind = kind.toUpperCase()
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

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
      sharedWithMFs: (program.sharedWithMFs as number[]).map(id => id.toString()),
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
      sharedWithMFs: (program.sharedWithMFs as number[]).map(id => id.toString()),
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
