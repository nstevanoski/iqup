import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// import type { User, UserRole } from '@prisma/client'

// Define UserRole type locally
type UserRole = 'HQ_ADMIN' | 'HQ_STAFF' | 'MF_ADMIN' | 'MF_STAFF' | 'LC_ADMIN' | 'LC_STAFF' | 'TT_ADMIN' | 'TT_STAFF'

// JWT secret - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Compare password
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// Generate JWT token
export function generateToken(user: {
  id: number
  email: string
  role: UserRole
  hqId?: number | null
  mfId?: number | null
  lcId?: number | null
  ttId?: number | null
}): string {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    hqId: user.hqId,
    mfId: user.mfId,
    lcId: user.lcId,
    ttId: user.ttId,
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

// Generate random token for password reset
export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Role hierarchy checker
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    HQ_ADMIN: 8,
    HQ_STAFF: 7,
    MF_ADMIN: 6,
    MF_STAFF: 5,
    LC_ADMIN: 4,
    LC_STAFF: 3,
    TT_ADMIN: 2,
    TT_STAFF: 1,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Check if user can access specific account
export function canAccessAccount(
  user: {
    role: UserRole
    hqId?: number | null
    mfId?: number | null
    lcId?: number | null
    ttId?: number | null
  },
  targetAccount: {
    type: 'HQ' | 'MF' | 'LC' | 'TT'
    id: number
    parentId?: number
  }
): boolean {
  // HQ users can access everything
  if (user.role === 'HQ_ADMIN' || user.role === 'HQ_STAFF') {
    return true
  }

  // MF users can access their MF and its LCs
  if ((user.role === 'MF_ADMIN' || user.role === 'MF_STAFF') && user.mfId) {
    if (targetAccount.type === 'MF' && targetAccount.id === user.mfId) {
      return true
    }
    if (targetAccount.type === 'LC' && targetAccount.parentId === user.mfId) {
      return true
    }
  }

  // LC users can only access their LC
  if ((user.role === 'LC_ADMIN' || user.role === 'LC_STAFF') && user.lcId) {
    return targetAccount.type === 'LC' && targetAccount.id === user.lcId
  }

  // TT users can only access their TT
  if ((user.role === 'TT_ADMIN' || user.role === 'TT_STAFF') && user.ttId) {
    return targetAccount.type === 'TT' && targetAccount.id === user.ttId
  }

  return false
}
