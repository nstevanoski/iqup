import { Account } from "@/types";

export interface MFAccount {
  id: number;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  hqId: number;
  hq: {
    id: number;
    name: string;
    code: string;
  };
  _count: {
    users: number;
    learningCenters: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MFAccountsResponse {
  success: boolean;
  data: MFAccount[];
  message: string;
}

class AccountsAPI {
  private baseUrl = '/api/accounts';
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
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  updateToken(token: string) {
    this.token = token;
  }

  async getMFAccounts(hqId?: number): Promise<MFAccountsResponse> {
    const url = new URL(`${this.baseUrl}/mf`, window.location.origin);
    if (hqId) {
      url.searchParams.set('hqId', hqId.toString());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Create a singleton instance
export const accountsAPI = new AccountsAPI();

// Export individual functions for convenience
export const getMFAccounts = (hqId?: number) => accountsAPI.getMFAccounts(hqId);
