import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireAuth } from '@/backend/middleware/auth'

// GET /api/learning-centers - Get Learning Centers
export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth(request)
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const mfId = searchParams.get('mfId')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const userRole = searchParams.get('userRole') as 'HQ' | 'MF' | 'LC' | 'TT' | null
    const userScope = searchParams.get('userScope') || ''

    // Build where clause
    let whereClause: any = {}

    // Apply role-based filtering using authenticated user's role
    const isMFUser = user.role === 'MF_ADMIN' || user.role === 'MF_STAFF'
    const isLCUser = user.role === 'LC_ADMIN' || user.role === 'LC_STAFF'
    const isTTUser = user.role === 'TT_ADMIN' || user.role === 'TT_STAFF'
    const isHQUser = user.role === 'HQ_ADMIN' || user.role === 'HQ_STAFF'
    
    if (isMFUser && user.mfId) {
      // MF can only see LCs under their account
      whereClause.mfId = user.mfId
    } else if (isLCUser && user.lcId) {
      // LC can only see their own center
      whereClause.id = user.lcId
    } else if (isHQUser) {
      // HQ can see all LCs, optionally filtered by MF
      if (mfId) {
        whereClause.mfId = parseInt(mfId)
      }
    } else if (isTTUser) {
      // TT cannot see LCs (return empty)
      return successResponse({ data: [], total: 0 }, 'Learning Centers retrieved successfully')
    }

    // Apply search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
        { state: { contains: search } },
        { code: { contains: search } }
      ]
    }

    // Get learning centers
    const learningCenters = await prisma.learningCenter.findMany({
      where: whereClause,
      include: {
        mf: {
          select: { id: true, name: true, code: true }
        },
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: { name: 'asc' },
      take: limit
    })

    // Get total count for pagination
    const total = await prisma.learningCenter.count({
      where: whereClause
    })

    // Transform the response
    const transformedLCs = learningCenters.map((lc: any) => ({
      id: lc.id.toString(),
      name: lc.name,
      code: lc.code,
      address: lc.address,
      city: lc.city,
      state: lc.state,
      zipCode: lc.zipCode,
      phone: lc.phone,
      email: lc.email,
      status: lc.status,
      mfId: lc.mfId.toString(),
      mf: lc.mf ? {
        id: lc.mf.id.toString(),
        name: lc.mf.name,
        code: lc.mf.code
      } : null,
      userCount: lc._count.users,
      createdAt: lc.createdAt.toISOString(),
      updatedAt: lc.updatedAt.toISOString()
    }))

    return successResponse({
      data: transformedLCs,
      total,
      page: 1,
      limit,
      totalPages: Math.ceil(total / limit)
    }, 'Learning Centers retrieved successfully')

  } catch (error) {
    console.error('Error fetching learning centers:', error)
    return errorResponse('Failed to fetch learning centers', 500)
  }
}
