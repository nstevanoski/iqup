import { NextResponse } from 'next/server'
import type { ApiResponse, ApiError } from '../types'

// Success response helper
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  )
}

// Error response helper
export function errorResponse(
  error: string | ApiError,
  status: number = 500
): NextResponse<ApiResponse> {
  const errorMessage = typeof error === 'string' ? error : error.message
  
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status }
  )
}

// Validation error response
export function validationErrorResponse(
  errors: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      data: errors,
    },
    { status: 400 }
  )
}
