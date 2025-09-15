import { LearningGroup } from '@/types'

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.token || null;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return null;
};

// Helper function to create headers with auth token
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export interface LearningGroupsResponse {
  learningGroups: LearningGroup[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface LearningGroupsFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
  lcId?: string
  mfId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateLearningGroupData {
  name: string
  description: string
  status?: string
  maxStudents: number
  startDate: string
  endDate: string
  location: string
  notes?: string
  schedule?: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
  }>
  pricingSnapshot?: {
    pricingModel: string
    coursePrice: number
    numberOfPayments?: number
    gap?: number
    pricePerMonth?: number
    pricePerSession?: number
  }
  programId: string
  subProgramId?: string
  teacherId: string
  students?: Array<{
    studentId: string
    startDate: string
    endDate: string
    productId: string
    paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue'
    enrollmentDate: string
  }>
}

export interface UpdateLearningGroupData extends Partial<CreateLearningGroupData> {}

// Get all learning groups with filtering and pagination
export async function getLearningGroups(filters: LearningGroupsFilters = {}): Promise<LearningGroupsResponse> {
  const params = new URLSearchParams()
  
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.limit) params.append('limit', filters.limit.toString())
  if (filters.search) params.append('search', filters.search)
  if (filters.status) params.append('status', filters.status)
  if (filters.lcId) params.append('lcId', filters.lcId)
  if (filters.mfId) params.append('mfId', filters.mfId)
  if (filters.sortBy) params.append('sortBy', filters.sortBy)
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

  const response = await fetch(`/api/learning-groups?${params.toString()}`, {
    method: 'GET',
    headers: createAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch learning groups')
  }

  const result = await response.json()
  return result.data
}

// Get a single learning group by ID
export async function getLearningGroup(id: string): Promise<LearningGroup> {
  const response = await fetch(`/api/learning-groups/${id}`, {
    method: 'GET',
    headers: createAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch learning group')
  }

  const result = await response.json()
  return result.data
}

// Create a new learning group
export async function createLearningGroup(data: CreateLearningGroupData): Promise<LearningGroup> {
  const response = await fetch('/api/learning-groups', {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create learning group')
  }

  const result = await response.json()
  return result.data
}

// Update an existing learning group
export async function updateLearningGroup(id: string, data: UpdateLearningGroupData): Promise<LearningGroup> {
  const response = await fetch(`/api/learning-groups/${id}`, {
    method: 'PUT',
    headers: createAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update learning group')
  }

  const result = await response.json()
  return result.data
}

// Delete a learning group
export async function deleteLearningGroup(id: string): Promise<void> {
  const response = await fetch(`/api/learning-groups/${id}`, {
    method: 'DELETE',
    headers: createAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete learning group')
  }
}

// Add student to learning group
export async function addStudentToLearningGroup(
  learningGroupId: string,
  studentData: {
    studentId: string
    startDate: string
    endDate: string
    productId: string
    paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue'
    enrollmentDate: string
  }
): Promise<LearningGroup> {
  const response = await fetch(`/api/learning-groups/${learningGroupId}/students`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify(studentData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to add student to learning group')
  }

  const result = await response.json()
  return result.data
}

// Remove student from learning group
export async function removeStudentFromLearningGroup(
  learningGroupId: string,
  studentId: string
): Promise<LearningGroup> {
  const response = await fetch(`/api/learning-groups/${learningGroupId}/students/${studentId}`, {
    method: 'DELETE',
    headers: createAuthHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to remove student from learning group')
  }

  const result = await response.json()
  return result.data
}
