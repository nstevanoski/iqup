import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { successResponse, errorResponse } from '@/backend/utils'

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return successResponse(users, 'Users retrieved successfully')
  } catch (error) {
    console.error('Error fetching users:', error)
    return errorResponse('Failed to fetch users', 500)
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Basic validation
    if (!email) {
      return errorResponse('Email is required', 400)
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    })

    return successResponse(user, 'User created successfully', 201)
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return errorResponse('Email already exists', 409)
    }
    
    return errorResponse('Failed to create user', 500)
  }
}
