import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireMFAccess } from '@/backend/middleware/auth'

// GET /api/accounts/mf - Get Master Franchisee accounts
export async function GET(request: NextRequest) {
  const { error, user } = await requireMFAccess(request)
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const hqId = searchParams.get('hqId')

    let whereClause: any = {}
    
    // If user is MF level, they can only see their own MF
    if (user?.role === 'MF_ADMIN' || user?.role === 'MF_STAFF') {
      whereClause.id = user.mfId
    } else if (hqId) {
      // HQ users can filter by HQ
      whereClause.hqId = parseInt(hqId)
    }

    const mfs = await prisma.masterFranchisee.findMany({
      where: whereClause,
      include: {
        hq: {
          select: { id: true, name: true, code: true }
        },
        _count: {
          select: {
            users: true,
            learningCenters: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return successResponse(mfs, 'Master Franchisee accounts retrieved successfully')
  } catch (error) {
    console.error('Error fetching MF accounts:', error)
    return errorResponse('Failed to fetch MF accounts', 500)
  }
}

// POST /api/accounts/mf - Create new Master Franchisee account
export async function POST(request: NextRequest) {
  const { error, user } = await requireMFAccess(request)
  if (error) return error

  try {
    const body = await request.json()
    const {
      name,
      code,
      hqId,
      email,
      phone,
      address,
      city,
      state,
      country,
      postalCode
    } = body

    // Validation
    if (!name || !code || !hqId) {
      return errorResponse('Name, code, and HQ ID are required', 400)
    }

    // Only HQ users can create MF accounts
    if (user?.role !== 'HQ_ADMIN' && user?.role !== 'HQ_STAFF') {
      return errorResponse('Only HQ users can create Master Franchisee accounts', 403)
    }

    // Verify HQ exists and is active
    const hq = await prisma.hQ.findFirst({
      where: { id: hqId, status: 'ACTIVE' }
    })

    if (!hq) {
      return errorResponse('Invalid or inactive HQ', 400)
    }

    // Check if code already exists
    const existingMF = await prisma.masterFranchisee.findUnique({
      where: { code }
    })

    if (existingMF) {
      return errorResponse('MF code already exists', 409)
    }

    const mf = await prisma.masterFranchisee.create({
      data: {
        name,
        code: code.toUpperCase(),
        hqId,
        email,
        phone,
        address,
        city,
        state,
        country,
        postalCode,
        status: 'ACTIVE'
      },
      include: {
        hq: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    return successResponse(mf, 'Master Franchisee account created successfully', 201)
  } catch (error: any) {
    console.error('Error creating MF account:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('MF code already exists', 409)
    }
    
    return errorResponse('Failed to create MF account', 500)
  }
}
