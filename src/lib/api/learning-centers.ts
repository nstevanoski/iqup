import { successResponse, errorResponse } from '@/backend/utils'

export interface LearningCenter {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  status: string;
  mfId: string;
  mf?: {
    id: string;
    name: string;
    code: string;
  };
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningCentersResponse {
  success: boolean;
  data: {
    data: LearningCenter[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

interface GetLearningCentersParams {
  mfId?: string;
  search?: string;
  limit?: number;
  userRole?: string;
  userScope?: string;
}

class LearningCentersAPI {
  private baseUrl = '/api/learning-centers';
  private token: string | null = null;

  constructor() {
    // Get token from localStorage or auth store
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          this.token = parsed.state?.token || null;
        } catch (error) {
          console.error('Error parsing auth data:', error);
        }
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async getLearningCenters(params: GetLearningCentersParams = {}): Promise<LearningCentersResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.mfId) searchParams.append('mfId', params.mfId);
      if (params.search) searchParams.append('search', params.search);
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.userRole) searchParams.append('userRole', params.userRole);
      if (params.userScope) searchParams.append('userScope', params.userScope);

      const url = `${this.baseUrl}?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        return errorResponse(data.message || 'Failed to fetch learning centers', response.status) as unknown as LearningCentersResponse;
      }

      return data as LearningCentersResponse;
    } catch (error) {
      console.error('Error fetching learning centers:', error);
      return errorResponse('Failed to fetch learning centers', 500) as unknown as LearningCentersResponse;
    }
  }
}

export const learningCentersAPI = new LearningCentersAPI();
export const getLearningCenters = learningCentersAPI.getLearningCenters.bind(learningCentersAPI);
