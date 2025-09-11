import { NextRequest } from 'next/server'
import { verifyToken } from '@/backend/utils/auth'
import { errorResponse } from '@/backend/utils'
import prisma from '@/backend/config/database'
import type { UserRole } from '@prisma/client'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number
    email: string
    role: UserRole
    hqId?: number | null
    mfId?: number | null
    lcId?: number | null
    ttId?: number | null
  }
}

export async function authenticateToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return { error: errorResponse('Access token required', 401), user: null }
    }

    const decoded = verifyToken(token)
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        hqId: true,
        mfId: true,
        lcId: true,
        ttId: true,
      }
    })

    if (!user || user.status !== 'ACTIVE') {
      return { error: errorResponse('Invalid or inactive user', 401), user: null }
    }

    return {
      error: null,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hqId: user.hqId,
        mfId: user.mfId,
        lcId: user.lcId,
        ttId: user.ttId,
      }
    }
  } catch (error) {
    return { error: errorResponse('Invalid token', 401), user: null }
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return async (request: NextRequest) => {
    const { error, user } = await authenticateToken(request)
    
    if (error || !user) {
      return { error: error || errorResponse('Authentication failed', 401), user: null }
    }

    if (!allowedRoles.includes(user.role)) {
      return { error: errorResponse('Insufficient permissions', 403), user: null }
    }

    return { error: null, user }
  }
}

// Middleware for HQ access only
export const requireHQAccess = requireRole(['HQ_ADMIN', 'HQ_STAFF'])

// Middleware for MF and above access
export const requireMFAccess = requireRole(['HQ_ADMIN', 'HQ_STAFF', 'MF_ADMIN', 'MF_STAFF'])

// Middleware for LC and above access
export const requireLCAccess = requireRole([
  'HQ_ADMIN', 'HQ_STAFF', 
  'MF_ADMIN', 'MF_STAFF', 
  'LC_ADMIN', 'LC_STAFF'
])

// Middleware for TT access
export const requireTTAccess = requireRole([
  'HQ_ADMIN', 'HQ_STAFF',
  'TT_ADMIN', 'TT_STAFF'
])
