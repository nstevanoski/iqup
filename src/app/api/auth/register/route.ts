import { NextRequest } from 'next/server'
import prisma from '@/backend/config/database'
import { hashPassword } from '@/backend/utils/auth'
import { successResponse, errorResponse } from '@/backend/utils'
import type { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      accountType, // 'HQ', 'MF', 'LC', 'TT'
      accountId,   // ID of the account (hqId, mfId, lcId, ttId)
    } = body

    // Validation
    if (!email || !password || !firstName || !lastName || !role) {
      return errorResponse('Required fields missing', 400)
    }

    if (!accountType || !accountId) {
      return errorResponse('Account type and account ID are required', 400)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return errorResponse('Invalid email format', 400)
    }

    // Validate password strength
    if (password.length < 8) {
      return errorResponse('Password must be at least 8 characters long', 400)
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return errorResponse('Email already exists', 409)
    }

    // Verify that the account exists and is active
    let accountExists = false
    let accountData = null

    switch (accountType) {
      case 'HQ':
        accountData = await prisma.hQ.findFirst({
          where: { id: accountId, status: 'ACTIVE' }
        })
        accountExists = !!accountData
        break
      case 'MF':
        accountData = await prisma.masterFranchisee.findFirst({
          where: { id: accountId, status: 'ACTIVE' }
        })
        accountExists = !!accountData
        break
      case 'LC':
        accountData = await prisma.learningCenter.findFirst({
          where: { id: accountId, status: 'ACTIVE' }
        })
        accountExists = !!accountData
        break
      case 'TT':
        accountData = await prisma.teacherTrainer.findFirst({
          where: { id: accountId, status: 'ACTIVE' }
        })
        accountExists = !!accountData
        break
    }

    if (!accountExists) {
      return errorResponse('Invalid or inactive account', 400)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Prepare user data based on account type
    const userData: any = {
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: role as UserRole,
      status: 'ACTIVE',
    }

    // Set the appropriate account relationship
    switch (accountType) {
      case 'HQ':
        userData.hqId = accountId
        break
      case 'MF':
        userData.mfId = accountId
        break
      case 'LC':
        userData.lcId = accountId
        break
      case 'TT':
        userData.ttId = accountId
        break
    }

    // Create user
    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        hq: {
          select: { id: true, name: true, code: true }
        },
        mf: {
          select: { id: true, name: true, code: true }
        },
        lc: {
          select: { id: true, name: true, code: true }
        },
        tt: {
          select: { id: true, name: true, code: true }
        }
      }
    })

    return successResponse(
      {
        user,
        message: 'User created successfully. Please verify your email.'
      },
      'Registration successful',
      201
    )

  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return errorResponse('Email already exists', 409)
    }
    
    return errorResponse('Registration failed', 500)
  }
}
