import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { comparePassword, generateToken } from '@/backend/utils/auth'
import { successResponse, errorResponse } from '@/backend/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return errorResponse('Email and password are required', 400)
    }

    // Find user with related account information
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        hq: {
          select: { id: true, name: true, code: true }
        },
        mf: {
          select: { id: true, name: true, code: true, hqId: true }
        },
        lc: {
          select: { id: true, name: true, code: true, mfId: true }
        },
        tt: {
          select: { id: true, name: true, code: true, hqId: true }
        }
      }
    })

    if (!user) {
      return errorResponse('Invalid email or password', 401)
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      return errorResponse('Account is inactive or suspended', 401)
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401)
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      hqId: user.hqId,
      mfId: user.mfId,
      lcId: user.lcId,
      ttId: user.ttId,
    })

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Prepare response data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      account: {
        hq: user.hq,
        mf: user.mf,
        lc: user.lc,
        tt: user.tt,
      },
      lastLoginAt: new Date(),
      emailVerified: user.emailVerified,
    }

    return successResponse(
      {
        user: userData,
        token,
        expiresIn: '7d'
      },
      'Login successful'
    )

  } catch (error: any) {
    console.error('Login error:', error)
    return errorResponse('Login failed', 500)
  }
}
