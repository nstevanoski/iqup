import { Student } from '@/types'

export interface StudentListItem {
  id: string
  firstName: string
  lastName: string
  phone: string // Parent phone
  status: "active" | "inactive" | "graduated" | "suspended"
}

export interface StudentsListResponse {
  success: boolean;
  data: {
    students: Student[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message: string;
}

export interface StudentResponse {
  success: boolean;
  data: Student;
  message: string;
}

export interface CreateStudentData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "MALE" | "FEMALE" | "OTHER"
  enrollmentDate?: string
  status?: "ACTIVE" | "INACTIVE" | "GRADUATED" | "SUSPENDED"
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  parentFirstName: string
  parentLastName: string
  parentPhone: string
  parentEmail: string
  emergencyContactEmail?: string
  emergencyContactPhone?: string
  notes?: string
  avatar?: string
  lcId?: number
  mfId?: number
  hqId?: number
}

export interface UpdateStudentData extends Partial<CreateStudentData> {}

// Helper function to convert API Student to StudentListItem
export const convertStudentToListItem = (student: Student): StudentListItem => {
  return {
    id: student.id.toString(),
    firstName: student.firstName,
    lastName: student.lastName,
    phone: student.parentPhone, // Use parent phone instead of student phone
    status: student.status.toLowerCase() as "active" | "inactive" | "graduated" | "suspended",
  }
}

class StudentsAPI {
  private baseUrl = '/api/students';
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

  updateToken(token: string | null) {
    this.token = token;
  }

  // Method to refresh token from localStorage (useful after login)
  refreshToken() {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          this.token = parsed.state?.token || null;
        } catch (error) {
          console.error('Error parsing auth data:', error);
          this.token = null;
        }
      }
    }
  }

  // Debug method to check authentication status
  debugAuth() {
    console.log('StudentsAPI Debug:', {
      hasToken: !!this.token,
      tokenPreview: this.token ? `${this.token.substring(0, 20)}...` : 'No token',
      localStorageData: typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : 'Not available'
    });
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
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform enum values from uppercase to lowercase and convert date strings to Date objects
    if (data.data) {
      if (Array.isArray(data.data)) {
        data.data = data.data.map(this.transformStudentFromAPI);
      } else if (data.data.id) {
        data.data = this.transformStudentFromAPI(data.data);
      }
    }

    return data;
  }

  private transformStudentFromAPI(student: any): any {
    return {
      ...student,
      status: student.status?.toLowerCase(),
      gender: student.gender?.toLowerCase(),
      createdAt: student.createdAt ? new Date(student.createdAt) : undefined,
      updatedAt: student.updatedAt ? new Date(student.updatedAt) : undefined,
      enrollmentDate: student.enrollmentDate ? new Date(student.enrollmentDate) : undefined,
    };
  }

  async getStudents(params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    lcId?: string
    mfId?: string
    sortBy?: string
    sortOrder?: string
  } = {}): Promise<StudentsListResponse> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<StudentsListResponse>(response);
  }

  async getStudent(id: string): Promise<StudentResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<StudentResponse>(response);
  }

  async createStudent(data: CreateStudentData): Promise<StudentResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<StudentResponse>(response);
  }

  async updateStudent(id: string, data: UpdateStudentData): Promise<StudentResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<StudentResponse>(response);
  }

  async deleteStudent(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ success: boolean; message: string }>(response);
  }
}

// Create a singleton instance
export const studentsAPI = new StudentsAPI();

// Export individual functions for backward compatibility
export const getStudents = (params?: any) => studentsAPI.getStudents(params);
export const getStudent = (id: string) => studentsAPI.getStudent(id);
export const createStudent = (data: CreateStudentData) => studentsAPI.createStudent(data);
export const updateStudent = (id: string, data: UpdateStudentData) => studentsAPI.updateStudent(id, data);
export const deleteStudent = (id: string) => studentsAPI.deleteStudent(id);
