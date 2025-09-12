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
          include: {
            mf: {
              select: { id: true, name: true, code: true }
            }
          }
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

    // For LC users, ensure they have the correct organizational IDs
    let finalHqId = user.hqId
    let finalMfId = user.mfId
    let finalLcId = user.lcId

    if (user.lcId && (!user.mfId || !user.hqId)) {
      const lcWithRelations = await prisma.learningCenter.findUnique({
        where: { id: user.lcId },
        include: {
          mf: {
            include: {
              hq: true
            }
          }
        }
      })

      if (lcWithRelations) {
        finalMfId = user.mfId || lcWithRelations.mfId
        finalHqId = user.hqId || lcWithRelations.mf.hqId
      }
    }

    // For MF users, ensure they have the correct HQ ID
    if (user.mfId && !user.hqId) {
      const mfWithRelations = await prisma.masterFranchisee.findUnique({
        where: { id: user.mfId },
        include: {
          hq: true
        }
      })

      if (mfWithRelations) {
        finalHqId = user.hqId || mfWithRelations.hqId
      }
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      hqId: finalHqId,
      mfId: finalMfId,
      lcId: finalLcId,
      ttId: user.ttId,
    })

    // Update last login and organizational IDs if they were derived
    const updateData: any = { lastLoginAt: new Date() }
    
    if (finalHqId !== user.hqId || finalMfId !== user.mfId || finalLcId !== user.lcId) {
      updateData.hqId = finalHqId
      updateData.mfId = finalMfId
      updateData.lcId = finalLcId
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData
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
