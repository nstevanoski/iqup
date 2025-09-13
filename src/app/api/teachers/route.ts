import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireLCAccess } from '@/backend/middleware/auth'

// GET /api/teachers - Get all teachers with filtering and pagination
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

    // Debug logging
    console.log('Teacher listing request:', {
      userRole: user.role,
      userHqId: user.hqId,
      userMfId: user.mfId,
      userLcId: user.lcId,
      requestedLcId: lcId,
      requestedMfId: mfId
    })

    // Extract role prefix (HQ, MF, LC)
    const userRolePrefix = user.role.split('_')[0] as 'HQ' | 'MF' | 'LC'
    
    // HQ can see all teachers (no filtering)
    if (userRolePrefix === 'HQ') {
      // No additional filtering for HQ users
    }
    // MF users can see teachers from their LCs
    else if (userRolePrefix === 'MF') {
      if (user.mfId) {
        whereClause.mfId = user.mfId
      } else {
        return errorResponse('MF user missing organizational information', 400)
      }
    }
    // LC users can only see teachers from their own LC
    else if (userRolePrefix === 'LC') {
      if (user.lcId) {
        whereClause.lcId = user.lcId
      } else {
        return errorResponse('LC user missing organizational information', 400)
      }
    }

    // Apply additional filters (but respect organizational hierarchy)
    if (lcId) {
      const requestedLcId = parseInt(lcId)
      // Only allow if user has access to this LC
      if (userRolePrefix === 'HQ') {
        // HQ can access any LC
        whereClause.lcId = requestedLcId
      } else if (userRolePrefix === 'MF') {
        // MF can only access LCs under their MF
        if (!user.mfId) {
          return errorResponse('MF user missing mfId', 403)
        }
        const lc = await prisma.learningCenter.findFirst({
          where: { id: requestedLcId, mfId: user.mfId }
        })
        if (lc) {
          whereClause.lcId = requestedLcId
        } else {
          return errorResponse('Access denied to requested LC', 403)
        }
      } else if (userRolePrefix === 'LC') {
        // LC can only access their own LC
        if (requestedLcId === user.lcId) {
          whereClause.lcId = requestedLcId
        } else {
          return errorResponse('Access denied to requested LC', 403)
        }
      }
    }
    
    if (mfId) {
      const requestedMfId = parseInt(mfId)
      // Only allow if user has access to this MF
      if (userRolePrefix === 'HQ') {
        // HQ can access any MF
        whereClause.mfId = requestedMfId
      } else if (userRolePrefix === 'MF') {
        // MF can only access their own MF
        if (requestedMfId === user.mfId) {
          whereClause.mfId = requestedMfId
        } else {
          return errorResponse('Access denied to requested MF', 403)
        }
      } else if (userRolePrefix === 'LC') {
        // LC can only access their parent MF
        if (requestedMfId === user.mfId) {
          whereClause.mfId = requestedMfId
        } else {
          return errorResponse('Access denied to requested MF', 403)
        }
      }
    }

    if (status) {
      whereClause.status = status.toUpperCase()
    }

    // Add search functionality
    if (search && search.trim() !== '') {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ]
    }

    // Debug logging for final where clause
    console.log('Final where clause:', whereClause)

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get teachers with pagination
    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
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
      prisma.teacher.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      teachers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, 'Teachers retrieved successfully')
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return errorResponse('Failed to fetch teachers', 500)
  }
}

// POST /api/teachers - Create new teacher
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
      qualifications,
      lcId,
      mfId,
      hqId
    } = body

    // Validation
    if (!firstName || !lastName || !dateOfBirth || !gender || !email) {
      return errorResponse('First name, last name, date of birth, gender, and email are required', 400)
    }

    // Only LC users can create teachers
    if (user?.role !== 'LC_ADMIN' && user?.role !== 'LC_STAFF') {
      return errorResponse('Only LC users can create teachers', 403)
    }

    // Use user's LC, MF, and HQ IDs if not provided
    let finalLcId = lcId || user.lcId
    let finalMfId = mfId || user.mfId
    let finalHqId = hqId || user.hqId

    // For LC users, derive MF and HQ from LC relationship if not already set
    if (finalLcId && (!finalMfId || !finalHqId)) {
      const lcWithRelations = await prisma.learningCenter.findUnique({
        where: { id: finalLcId },
        include: {
          mf: {
            include: {
              hq: true
            }
          }
        }
      })

      if (lcWithRelations) {
        finalMfId = finalMfId || lcWithRelations.mfId
        finalHqId = finalHqId || lcWithRelations.mf.hqId
      }
    }

    // For MF users, derive HQ from MF relationship if not already set
    if (finalMfId && !finalHqId) {
      const mfWithRelations = await prisma.masterFranchisee.findUnique({
        where: { id: finalMfId },
        include: {
          hq: true
        }
      })

      if (mfWithRelations) {
        finalHqId = finalHqId || mfWithRelations.hqId
      }
    }

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

    const teacher = await prisma.teacher.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender: gender.toUpperCase(),
        email,
        phone,
        experience: experience || 0,
        status: status ? status.toUpperCase() : 'ACTIVE',
        bio,
        avatar,
        address,
        city,
        state,
        country,
        postalCode,
        availability: availability ? JSON.stringify(availability) : undefined,
        education: education ? JSON.stringify(education) : undefined,
        trainings: trainings ? JSON.stringify(trainings) : undefined,
        specialization: specialization ? JSON.stringify(specialization) : undefined,
        qualifications: qualifications ? JSON.stringify(qualifications) : undefined,
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

    return successResponse(teacher, 'Teacher created successfully', 201)
  } catch (error: any) {
    console.error('Error creating teacher:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('Teacher with this information already exists', 409)
    }
    
    return errorResponse('Failed to create teacher', 500)
  }
}
