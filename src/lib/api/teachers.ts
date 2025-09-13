import { Teacher } from '@/types';

export interface TeachersResponse {
  success: boolean;
  message: string;
  data: {
    teachers: Teacher[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface TeacherResponse {
  success: boolean;
  message: string;
  data: Teacher;
}

export interface CreateTeacherData {
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  gender: string;
  title?: string;
  email: string;
  phone?: string;
  experience?: number;
  status?: string;
  bio?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  availability?: any[];
  education?: any[];
  trainings?: any[];
  specialization?: string[];
  qualifications?: string[];
  lcId?: number;
  mfId?: number;
  hqId?: number;
}

export interface UpdateTeacherData extends Partial<CreateTeacherData> {}

class TeachersAPI {
  private baseUrl = '/api/teachers';
  private token: string | null = null;

  constructor() {
    // Get token from localStorage or auth store - same pattern as other APIs
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
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  updateToken(token: string) {
    this.token = token;
  }

  async getTeachers(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    lcId?: number;
    mfId?: number;
    sortBy?: string;
    sortOrder?: string;
  } = {}): Promise<TeachersResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.status) searchParams.append('status', params.status);
      if (params.lcId) searchParams.append('lcId', params.lcId.toString());
      if (params.mfId) searchParams.append('mfId', params.mfId.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const url = `${this.baseUrl}?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<TeachersResponse>(response);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw new Error('Failed to fetch teachers');
    }
  }

  async getTeacher(id: string | number): Promise<TeacherResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<TeacherResponse>(response);
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw new Error('Failed to fetch teacher');
    }
  }

  async createTeacher(teacherData: CreateTeacherData): Promise<TeacherResponse> {
    try {
      // Destructure to separate address object from other fields
      const { address: addressObj, ...otherFields } = teacherData;
      
      // Convert Date objects to ISO strings and flatten address for API
      const apiData = {
        ...otherFields,
        dateOfBirth: teacherData.dateOfBirth instanceof Date 
          ? teacherData.dateOfBirth.toISOString() 
          : teacherData.dateOfBirth,
        // Flatten address object to individual fields for backend
        address: addressObj?.street || '',
        city: addressObj?.city || '',
        state: addressObj?.state || '',
        country: addressObj?.country || '',
        postalCode: addressObj?.zipCode || '',
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(apiData),
      });

      return this.handleResponse<TeacherResponse>(response);
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw new Error('Failed to create teacher');
    }
  }

  async updateTeacher(id: string | number, teacherData: UpdateTeacherData): Promise<TeacherResponse> {
    try {
      // Destructure to separate address object from other fields
      const { address: addressObj, ...otherFields } = teacherData;
      
      // Convert Date objects to ISO strings and flatten address for API
      const apiData = {
        ...otherFields,
        dateOfBirth: teacherData.dateOfBirth instanceof Date 
          ? teacherData.dateOfBirth.toISOString() 
          : teacherData.dateOfBirth,
        // Flatten address object to individual fields for backend
        address: addressObj?.street || '',
        city: addressObj?.city || '',
        state: addressObj?.state || '',
        country: addressObj?.country || '',
        postalCode: addressObj?.zipCode || '',
      };

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(apiData),
      });

      return this.handleResponse<TeacherResponse>(response);
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw new Error('Failed to update teacher');
    }
  }

  async deleteTeacher(id: string | number): Promise<{ success: boolean; message: string; data: null }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<{ success: boolean; message: string; data: null }>(response);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw new Error('Failed to delete teacher');
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: response.url
      });
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform enum values from uppercase to lowercase and convert date strings to Date objects
    if (data.data) {
      if (Array.isArray(data.data.teachers)) {
        data.data.teachers = data.data.teachers.map(this.transformTeacherFromAPI);
      } else if (data.data.id) {
        data.data = this.transformTeacherFromAPI(data.data);
      }
    }

    return data;
  }

  private transformTeacherFromAPI(teacher: any): any {
    return {
      ...teacher,
      gender: teacher.gender?.toLowerCase(),
      status: teacher.status?.toLowerCase(),
      dateOfBirth: teacher.dateOfBirth ? new Date(teacher.dateOfBirth) : null,
      createdAt: teacher.createdAt ? new Date(teacher.createdAt) : null,
      updatedAt: teacher.updatedAt ? new Date(teacher.updatedAt) : null,
      // Convert flattened address fields back to Address object
      address: teacher.address || teacher.city || teacher.state || teacher.country || teacher.postalCode ? {
        street: teacher.address || '',
        city: teacher.city || '',
        state: teacher.state || '',
        zipCode: teacher.postalCode || '',
        country: teacher.country || '',
      } : undefined,
      // Parse JSON fields if they exist
      availability: teacher.availability ? (typeof teacher.availability === 'string' ? JSON.parse(teacher.availability) : teacher.availability) : [],
      education: teacher.education ? (typeof teacher.education === 'string' ? JSON.parse(teacher.education) : teacher.education) : [],
      trainings: teacher.trainings ? (typeof teacher.trainings === 'string' ? JSON.parse(teacher.trainings) : teacher.trainings) : [],
      specialization: teacher.specialization ? (typeof teacher.specialization === 'string' ? JSON.parse(teacher.specialization) : teacher.specialization) : [],
      qualifications: teacher.qualifications ? (typeof teacher.qualifications === 'string' ? JSON.parse(teacher.qualifications) : teacher.qualifications) : [],
    };
  }
}

// Create a singleton instance
export const teachersAPI = new TeachersAPI();
