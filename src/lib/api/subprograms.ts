import { SubProgram } from "@/types";

export interface SubProgramsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  programId?: string;
  pricingModel?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SubProgramsListResponse {
  success: boolean;
  data: {
    data: SubProgram[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface SubProgramResponse {
  success: boolean;
  data: SubProgram;
  message: string;
}

export interface CreateSubProgramData {
  programId: string;
  name: string;
  description: string;
  status?: 'active' | 'inactive' | 'draft';
  order?: number;
  duration: number;
  price?: number;
  prerequisites?: string[];
  learningObjectives?: string[];
  pricingModel: 'per_course' | 'per_month' | 'per_session' | 'subscription' | 'program_price' | 'one-time' | 'installments';
  coursePrice: number;
  numberOfPayments?: number;
  gap?: number;
  pricePerMonth?: number;
  pricePerSession?: number;
  sharedWithLCs?: string[];
  sharedWithMFs?: string[];
  visibility?: 'private' | 'shared' | 'public';
}

export interface UpdateSubProgramData extends Partial<CreateSubProgramData> {}

class SubProgramsAPI {
  private baseUrl = '/api/subprograms';
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

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform enum values from uppercase to lowercase and convert date strings to Date objects
    if (data.data) {
      if (Array.isArray(data.data)) {
        data.data = data.data.map(this.transformSubProgramFromAPI);
      } else if (data.data.id) {
        data.data = this.transformSubProgramFromAPI(data.data);
      }
    }

    return data;
  }

  private transformSubProgramFromAPI(subProgram: any): any {
    return {
      ...subProgram,
      status: subProgram.status?.toLowerCase(),
      pricingModel: subProgram.pricingModel?.toLowerCase(),
      visibility: subProgram.visibility?.toLowerCase(),
      createdAt: subProgram.createdAt ? new Date(subProgram.createdAt) : undefined,
      updatedAt: subProgram.updatedAt ? new Date(subProgram.updatedAt) : undefined,
    };
  }

  async getSubPrograms(params: SubProgramsListParams = {}): Promise<SubProgramsListResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<SubProgramsListResponse>(response);
  }

  async getSubProgram(id: string): Promise<SubProgramResponse> {
    const url = `${this.baseUrl}/${id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<SubProgramResponse>(response);
  }

  async createSubProgram(data: CreateSubProgramData): Promise<SubProgramResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<SubProgramResponse>(response);
  }

  async updateSubProgram(id: string, data: UpdateSubProgramData): Promise<SubProgramResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<SubProgramResponse>(response);
  }

  async deleteSubProgram(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ success: boolean; message: string }>(response);
  }

  // Update token when auth state changes
  updateToken(token: string | null) {
    this.token = token;
  }
}

// Create a singleton instance
export const subProgramsAPI = new SubProgramsAPI();

// Export individual functions for convenience
export const getSubPrograms = (params?: SubProgramsListParams) => subProgramsAPI.getSubPrograms(params);
export const getSubProgram = (id: string) => subProgramsAPI.getSubProgram(id);
export const createSubProgram = (data: CreateSubProgramData) => subProgramsAPI.createSubProgram(data);
export const updateSubProgram = (id: string, data: UpdateSubProgramData) => subProgramsAPI.updateSubProgram(id, data);
export const deleteSubProgram = (id: string) => subProgramsAPI.deleteSubProgram(id);
