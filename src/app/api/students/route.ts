import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireLCAccess } from '@/backend/middleware/auth'

// GET /api/students - Get all students with filtering and pagination
export async function GET(request: NextRequest) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const lcId = searchParams.get('lcId') || ''
    const mfId = searchParams.get('mfId') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    let whereClause: any = {}

    // Apply role-based filtering based on authenticated user
    if (!user) {
      return errorResponse('Authentication required', 401)
    }

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // HQ can see all students (no filtering)
    if (userRolePrefix === 'HQ') {
      // No additional filtering for HQ users
    }
    // MF users can see students from their LCs
    else if (userRolePrefix === 'MF') {
      whereClause.mfId = user.mfId
    }
    // LC users can only see students from their own LC
    else if (userRolePrefix === 'LC') {
      whereClause.lcId = user.lcId
    }

    // Apply additional filters
    if (lcId) {
      whereClause.lcId = parseInt(lcId)
    }
    
    if (mfId) {
      whereClause.mfId = parseInt(mfId)
    }

    if (status) {
      whereClause.status = status.toUpperCase()
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { parentFirstName: { contains: search } },
        { parentLastName: { contains: search } },
        { parentEmail: { contains: search } }
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get students with pagination
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: whereClause,
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
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      }),
      prisma.student.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, 'Students retrieved successfully')
  } catch (error) {
    console.error('Error fetching students:', error)
    return errorResponse('Failed to fetch students', 500)
  }
}

// POST /api/students - Create new student
export async function POST(request: NextRequest) {
  const { error, user } = await requireLCAccess(request)
  if (error) return error

  try {
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
      avatar,
      lcId,
      mfId,
      hqId
    } = body

    // Validation
    if (!firstName || !lastName || !dateOfBirth || !gender) {
      return errorResponse('First name, last name, date of birth, and gender are required', 400)
    }

    if (!parentFirstName || !parentLastName || !parentPhone || !parentEmail) {
      return errorResponse('Parent information is required', 400)
    }

    // Only LC users can create students
    if (user?.role !== 'LC_ADMIN' && user?.role !== 'LC_STAFF') {
      return errorResponse('Only LC users can create students', 403)
    }

    // Use user's LC, MF, and HQ IDs if not provided
    const finalLcId = lcId || user.lcId
    const finalMfId = mfId || user.mfId
    const finalHqId = hqId || user.hqId

    if (!finalLcId || !finalMfId || !finalHqId) {
      return errorResponse('Learning Center, Master Franchisee, and HQ information is required', 400)
    }

    // Verify LC exists and is active
    const lc = await prisma.learningCenter.findFirst({
      where: { id: finalLcId, status: 'ACTIVE' }
    })

    if (!lc) {
      return errorResponse('Invalid or inactive Learning Center', 400)
    }

    // Verify MF exists and is active
    const mf = await prisma.masterFranchisee.findFirst({
      where: { id: finalMfId, status: 'ACTIVE' }
    })

    if (!mf) {
      return errorResponse('Invalid or inactive Master Franchisee', 400)
    }

    // Verify HQ exists and is active
    const hq = await prisma.hQ.findFirst({
      where: { id: finalHqId, status: 'ACTIVE' }
    })

    if (!hq) {
      return errorResponse('Invalid or inactive HQ', 400)
    }

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender.toUpperCase(),
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : null,
        status: status ? status.toUpperCase() : 'ACTIVE',
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
        avatar,
        lcId: finalLcId,
        mfId: finalMfId,
        hqId: finalHqId
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

    return successResponse(student, 'Student created successfully', 201)
  } catch (error: any) {
    console.error('Error creating student:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('Student with this information already exists', 409)
    }
    
    return errorResponse('Failed to create student', 500)
  }
}
