import { Program } from "@/types";

export interface ProgramsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  kind?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  userRole?: 'HQ' | 'MF' | 'LC' | 'TT';
  userScope?: string;
}

export interface ProgramsListResponse {
  success: boolean;
  data: {
    data: Program[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message: string;
}

export interface ProgramResponse {
  success: boolean;
  data: Program;
  message: string;
}

export interface CreateProgramData {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  duration: number;
  maxStudents: number;
  hours: number;
  lessonLength: number;
  kind: 'academic' | 'worksheet' | 'birthday_party' | 'stem_camp' | 'vocational' | 'certification' | 'workshop';
  sharedWithMFs: string[];
  visibility: 'private' | 'shared' | 'public';
}

export interface UpdateProgramData extends Partial<CreateProgramData> {
  currentStudents?: number;
}

class ProgramsAPI {
  private baseUrl = '/api/programs';
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
        data.data = data.data.map(this.transformProgramFromAPI);
      } else if (data.data.id) {
        data.data = this.transformProgramFromAPI(data.data);
      }
    }

    return data;
  }

  private transformProgramFromAPI(program: any): any {
    return {
      ...program,
      status: program.status?.toLowerCase(),
      kind: program.kind?.toLowerCase(),
      visibility: program.visibility?.toLowerCase(),
      createdAt: program.createdAt ? new Date(program.createdAt) : undefined,
      updatedAt: program.updatedAt ? new Date(program.updatedAt) : undefined,
    };
  }

  async getPrograms(params: ProgramsListParams = {}): Promise<ProgramsListResponse> {
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

    return this.handleResponse<ProgramsListResponse>(response);
  }

  async getProgram(id: string, userRole?: string, userScope?: string): Promise<ProgramResponse> {
    const searchParams = new URLSearchParams();
    if (userRole) searchParams.append('userRole', userRole);
    if (userScope) searchParams.append('userScope', userScope);

    const url = `${this.baseUrl}/${id}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<ProgramResponse>(response);
  }

  async createProgram(data: CreateProgramData): Promise<ProgramResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ProgramResponse>(response);
  }

  async updateProgram(id: string, data: UpdateProgramData): Promise<ProgramResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ProgramResponse>(response);
  }

  async deleteProgram(id: string): Promise<{ success: boolean; message: string }> {
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
export const programsAPI = new ProgramsAPI();

// Export individual functions for convenience
export const getPrograms = (params?: ProgramsListParams) => programsAPI.getPrograms(params);
export const getProgram = (id: string, userRole?: string, userScope?: string) => programsAPI.getProgram(id, userRole, userScope);
export const createProgram = (data: CreateProgramData) => programsAPI.createProgram(data);
export const updateProgram = (id: string, data: UpdateProgramData) => programsAPI.updateProgram(id, data);
export const deleteProgram = (id: string) => programsAPI.deleteProgram(id);
