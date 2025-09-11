import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'
import { requireHQAccess } from '@/backend/middleware/auth'

// GET /api/accounts/hq - Get all HQ accounts
export async function GET(request: NextRequest) {
  const { error, user } = await requireHQAccess(request)
  if (error) return error

  try {
    const hqs = await prisma.hQ.findMany({
      include: {
        _count: {
          select: {
            users: true,
            masterFranchisees: true,
            teacherTrainers: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return successResponse(hqs, 'HQ accounts retrieved successfully')
  } catch (error) {
    console.error('Error fetching HQ accounts:', error)
    return errorResponse('Failed to fetch HQ accounts', 500)
  }
}

// POST /api/accounts/hq - Create new HQ account
export async function POST(request: NextRequest) {
  const { error, user } = await requireHQAccess(request)
  if (error) return error

  try {
    const body = await request.json()
    const {
      name,
      code,
      email,
      phone,
      address,
      city,
      state,
      country,
      postalCode
    } = body

    // Validation
    if (!name || !code) {
      return errorResponse('Name and code are required', 400)
    }

    // Check if code already exists
    const existingHQ = await prisma.hQ.findUnique({
      where: { code }
    })

    if (existingHQ) {
      return errorResponse('HQ code already exists', 409)
    }

    const hq = await prisma.hQ.create({
      data: {
        name,
        code: code.toUpperCase(),
        email,
        phone,
        address,
        city,
        state,
        country,
        postalCode,
        status: 'ACTIVE'
      }
    })

    return successResponse(hq, 'HQ account created successfully', 201)
  } catch (error: any) {
    console.error('Error creating HQ account:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('HQ code already exists', 409)
    }
    
    return errorResponse('Failed to create HQ account', 500)
  }
}
