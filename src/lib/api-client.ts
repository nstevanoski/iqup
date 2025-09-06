import { 
  Program, 
  SubProgram, 
  Student, 
  Teacher, 
  LearningGroup, 
  Product, 
  InventoryItem, 
  Order, 
  Training, 
  TrainingType, 
  TeacherTrainerAccount, 
  RoyaltyReportRow, 
  StudentReportRow,
  CreateProgramRequest,
  UpdateProgramRequest,
  CreateStudentRequest,
  UpdateStudentRequest,
  ApiResponse,
  PaginatedResponse,
  QueryParams
} from "@/types";

// Base API client class with type-safe methods
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private buildQueryString(params: QueryParams): string {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        searchParams.set(`filters[${key}]`, value.toString());
      });
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // Programs API
  async getPrograms(params?: QueryParams): Promise<PaginatedResponse<Program>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<Program>>(`/programs${queryString}`);
    return response.data;
  }

  async getProgram(id: string): Promise<Program> {
    const response = await this.request<Program>(`/programs/${id}`);
    return response.data;
  }

  async createProgram(program: CreateProgramRequest): Promise<Program> {
    const response = await this.request<Program>('/programs', {
      method: 'POST',
      body: JSON.stringify(program),
    });
    return response.data;
  }

  async updateProgram(id: string, program: UpdateProgramRequest): Promise<Program> {
    const response = await this.request<Program>(`/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(program),
    });
    return response.data;
  }

  async deleteProgram(id: string): Promise<void> {
    await this.request<void>(`/programs/${id}`, {
      method: 'DELETE',
    });
  }

  // SubPrograms API
  async getSubPrograms(params?: QueryParams): Promise<PaginatedResponse<SubProgram>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<SubProgram>>(`/subprograms${queryString}`);
    return response.data;
  }

  async getSubProgram(id: string): Promise<SubProgram> {
    const response = await this.request<SubProgram>(`/subprograms/${id}`);
    return response.data;
  }

  async createSubProgram(subProgram: Omit<SubProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<SubProgram> {
    const response = await this.request<SubProgram>('/subprograms', {
      method: 'POST',
      body: JSON.stringify(subProgram),
    });
    return response.data;
  }

  async updateSubProgram(id: string, subProgram: Partial<Omit<SubProgram, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SubProgram> {
    const response = await this.request<SubProgram>(`/subprograms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subProgram),
    });
    return response.data;
  }

  async deleteSubProgram(id: string): Promise<void> {
    await this.request<void>(`/subprograms/${id}`, {
      method: 'DELETE',
    });
  }

  // Students API
  async getStudents(params?: QueryParams): Promise<PaginatedResponse<Student>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<Student>>(`/students${queryString}`);
    return response.data;
  }

  async getStudent(id: string): Promise<Student> {
    const response = await this.request<Student>(`/students/${id}`);
    return response.data;
  }

  async createStudent(student: CreateStudentRequest): Promise<Student> {
    const response = await this.request<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
    return response.data;
  }

  async updateStudent(id: string, student: UpdateStudentRequest): Promise<Student> {
    const response = await this.request<Student>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    });
    return response.data;
  }

  async deleteStudent(id: string): Promise<void> {
    await this.request<void>(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Teachers API
  async getTeachers(params?: QueryParams): Promise<PaginatedResponse<Teacher>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<Teacher>>(`/teachers${queryString}`);
    return response.data;
  }

  async getTeacher(id: string): Promise<Teacher> {
    const response = await this.request<Teacher>(`/teachers/${id}`);
    return response.data;
  }

  async createTeacher(teacher: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teacher> {
    const response = await this.request<Teacher>('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacher),
    });
    return response.data;
  }

  async updateTeacher(id: string, teacher: Partial<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Teacher> {
    const response = await this.request<Teacher>(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacher),
    });
    return response.data;
  }

  async deleteTeacher(id: string): Promise<void> {
    await this.request<void>(`/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  // Learning Groups API
  async getLearningGroups(params?: QueryParams): Promise<PaginatedResponse<LearningGroup>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<LearningGroup>>(`/learning-groups${queryString}`);
    return response.data;
  }

  async getLearningGroup(id: string): Promise<LearningGroup> {
    const response = await this.request<LearningGroup>(`/learning-groups/${id}`);
    return response.data;
  }

  async createLearningGroup(group: Omit<LearningGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningGroup> {
    const response = await this.request<LearningGroup>('/learning-groups', {
      method: 'POST',
      body: JSON.stringify(group),
    });
    return response.data;
  }

  async updateLearningGroup(id: string, group: Partial<Omit<LearningGroup, 'id' | 'createdAt' | 'updatedAt'>>): Promise<LearningGroup> {
    const response = await this.request<LearningGroup>(`/learning-groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    });
    return response.data;
  }

  async deleteLearningGroup(id: string): Promise<void> {
    await this.request<void>(`/learning-groups/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders API
  async getOrders(params?: QueryParams): Promise<PaginatedResponse<Order>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<Order>>(`/orders${queryString}`);
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.request<Order>(`/orders/${id}`);
    return response.data;
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const response = await this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
    return response.data;
  }

  async updateOrder(id: string, order: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Order> {
    const response = await this.request<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.request<void>(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Trainings API
  async getTrainings(params?: QueryParams): Promise<PaginatedResponse<Training>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<Training>>(`/trainings${queryString}`);
    return response.data;
  }

  async getTraining(id: string): Promise<Training> {
    const response = await this.request<Training>(`/trainings/${id}`);
    return response.data;
  }

  async createTraining(training: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>): Promise<Training> {
    const response = await this.request<Training>('/trainings', {
      method: 'POST',
      body: JSON.stringify(training),
    });
    return response.data;
  }

  async updateTraining(id: string, training: Partial<Omit<Training, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Training> {
    const response = await this.request<Training>(`/trainings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(training),
    });
    return response.data;
  }

  async deleteTraining(id: string): Promise<void> {
    await this.request<void>(`/trainings/${id}`, {
      method: 'DELETE',
    });
  }

  // Teacher Trainers API
  async getTeacherTrainers(params?: QueryParams): Promise<PaginatedResponse<TeacherTrainerAccount>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<TeacherTrainerAccount>>(`/teacher-trainers${queryString}`);
    return response.data;
  }

  async getTeacherTrainer(id: string): Promise<TeacherTrainerAccount> {
    const response = await this.request<TeacherTrainerAccount>(`/teacher-trainers/${id}`);
    return response.data;
  }

  async createTeacherTrainer(trainer: Omit<TeacherTrainerAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeacherTrainerAccount> {
    const response = await this.request<TeacherTrainerAccount>('/teacher-trainers', {
      method: 'POST',
      body: JSON.stringify(trainer),
    });
    return response.data;
  }

  async updateTeacherTrainer(id: string, trainer: Partial<Omit<TeacherTrainerAccount, 'id' | 'createdAt' | 'updatedAt'>>): Promise<TeacherTrainerAccount> {
    const response = await this.request<TeacherTrainerAccount>(`/teacher-trainers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(trainer),
    });
    return response.data;
  }

  async deleteTeacherTrainer(id: string): Promise<void> {
    await this.request<void>(`/teacher-trainers/${id}`, {
      method: 'DELETE',
    });
  }

  // Products API
  async getProducts(params?: QueryParams): Promise<PaginatedResponse<Product>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<Product>>(`/products${queryString}`);
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request<Product>(`/products/${id}`);
    return response.data;
  }

  // Reports API
  async getRoyaltyReports(params?: QueryParams): Promise<PaginatedResponse<RoyaltyReportRow>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<RoyaltyReportRow>>(`/reports/royalties${queryString}`);
    return response.data;
  }

  async getStudentReports(params?: QueryParams): Promise<PaginatedResponse<StudentReportRow>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<StudentReportRow>>(`/reports/students${queryString}`);
    return response.data;
  }

  // Training Types API
  async getTrainingTypes(params?: QueryParams): Promise<PaginatedResponse<TrainingType>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<TrainingType>>(`/training-types${queryString}`);
    return response.data;
  }

  async getTrainingType(id: string): Promise<TrainingType> {
    const response = await this.request<TrainingType>(`/training-types/${id}`);
    return response.data;
  }

  // Inventory API
  async getInventoryItems(params?: QueryParams): Promise<PaginatedResponse<InventoryItem>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const response = await this.request<PaginatedResponse<InventoryItem>>(`/inventory${queryString}`);
    return response.data;
  }

  async getInventoryItem(id: string): Promise<InventoryItem> {
    const response = await this.request<InventoryItem>(`/inventory/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };
