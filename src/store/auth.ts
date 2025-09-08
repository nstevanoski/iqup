"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Role } from "@/lib/rbac";
import { AuthUser, LoginCredentials, LoginResponse } from "@/types";

export interface AuthScope {
  id: string;
  name: string;
  type: Role;
  description: string;
}

interface AuthState {
  user: User | null;
  authUser: AuthUser | null;
  token: string | null;
  selectedAccount: string | null;
  selectedScope: AuthScope | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, scope?: AuthScope) => void;
  authenticate: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => void;
  setSelectedAccount: (accountId: string) => void;
  setSelectedScope: (scope: AuthScope) => void;
  mockLogin: (role: Role, scopeId?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Mock users for different roles
const mockUsers: Record<Role, User> = {
  HQ: {
    id: "1",
    name: "HQ Admin",
    role: "HQ",
    email: "hq@example.com",
  },
  MF: {
    id: "2",
    name: "MF Manager",
    role: "MF",
    email: "mf@example.com",
  },
  LC: {
    id: "3",
    name: "LC Coordinator",
    role: "LC",
    email: "lc@example.com",
  },
  TT: {
    id: "4",
    name: "Teacher Trainer",
    role: "TT",
    email: "tt@example.com",
  },
};

// Mock scopes for different organizational units
const mockScopes: AuthScope[] = [
  // HQ Scopes
  {
    id: "hq_global",
    name: "Global Headquarters",
    type: "HQ",
    description: "Full system access across all regions",
  },
  {
    id: "hq_north_america",
    name: "North America HQ",
    type: "HQ",
    description: "Headquarters for North American operations",
  },
  
  // MF Scopes
  {
    id: "mf_region_1",
    name: "Region 1 Management",
    type: "MF",
    description: "Management functions for Region 1",
  },
  {
    id: "mf_region_2",
    name: "Region 2 Management",
    type: "MF",
    description: "Management functions for Region 2",
  },
  
  // LC Scopes
  {
    id: "lc_center_nyc",
    name: "New York Learning Center",
    type: "LC",
    description: "Learning center operations in New York",
  },
  {
    id: "lc_center_la",
    name: "Los Angeles Learning Center",
    type: "LC",
    description: "Learning center operations in Los Angeles",
  },
  {
    id: "lc_center_chicago",
    name: "Chicago Learning Center",
    type: "LC",
    description: "Learning center operations in Chicago",
  },
  
  // TT Scopes
  {
    id: "tt_training_center",
    name: "Training Center",
    type: "TT",
    description: "Teacher training and development center",
  },
  {
    id: "tt_online_platform",
    name: "Online Training Platform",
    type: "TT",
    description: "Online teacher training platform",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      authUser: null,
      token: null,
      selectedAccount: null,
      selectedScope: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (user: User, scope?: AuthScope) => {
        set({
          user,
          selectedScope: scope || null,
          isAuthenticated: true,
          error: null,
        });
      },

      authenticate: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (data.success && data.data) {
            const { user: authUser, token } = data.data;
            
            // Convert AuthUser to User for compatibility
            const user: User = {
              id: authUser.id,
              name: authUser.name,
              role: authUser.role,
              email: authUser.email,
            };

            // Find the appropriate scope
            const scope = authUser.scopeId 
              ? mockScopes.find(s => s.id === authUser.scopeId)
              : mockScopes.find(s => s.type === authUser.role);

            set({
              user,
              authUser,
              token,
              selectedScope: scope || null,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return {
              success: true,
              user: authUser,
              token,
              message: data.message,
            };
          } else {
            set({
              isLoading: false,
              error: data.error || "Login failed",
            });
            return {
              success: false,
              error: data.error || "Login failed",
            };
          }
        } catch (error) {
          const errorMessage = "Network error. Please try again.";
          set({
            isLoading: false,
            error: errorMessage,
          });
          return {
            success: false,
            error: errorMessage,
          };
        }
      },

      logout: () => {
        set({
          user: null,
          authUser: null,
          token: null,
          selectedAccount: null,
          selectedScope: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setSelectedAccount: (accountId: string) => {
        set({ selectedAccount: accountId });
      },

      setSelectedScope: (scope: AuthScope) => {
        set({ selectedScope: scope });
      },

      mockLogin: (role: Role, scopeId?: string) => {
        const user = mockUsers[role];
        const scope = scopeId ? mockScopes.find(s => s.id === scopeId) : mockScopes.find(s => s.type === role);
        
        set({
          user,
          selectedScope: scope || null,
          isAuthenticated: true,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        authUser: state.authUser,
        token: state.token,
        selectedAccount: state.selectedAccount,
        selectedScope: state.selectedScope,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for easier access
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthUser = () => useAuthStore((state) => state.authUser);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useSelectedAccount = () => useAuthStore((state) => state.selectedAccount);
export const useSelectedScope = () => useAuthStore((state) => state.selectedScope);

// Individual action selectors to avoid object recreation
export const useLogin = () => useAuthStore((state) => state.login);
export const useAuthenticate = () => useAuthStore((state) => state.authenticate);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSetSelectedAccount = () => useAuthStore((state) => state.setSelectedAccount);
export const useSetSelectedScope = () => useAuthStore((state) => state.setSelectedScope);
export const useMockLogin = () => useAuthStore((state) => state.mockLogin);
export const useSetLoading = () => useAuthStore((state) => state.setLoading);
export const useSetError = () => useAuthStore((state) => state.setError);

// Combined actions selector - use individual hooks to avoid object recreation
export const useAuthActions = () => {
  const login = useLogin();
  const authenticate = useAuthenticate();
  const logout = useLogout();
  const setSelectedAccount = useSetSelectedAccount();
  const setSelectedScope = useSetSelectedScope();
  const mockLogin = useMockLogin();
  const setLoading = useSetLoading();
  const setError = useSetError();
  
  return {
    login,
    authenticate,
    logout,
    setSelectedAccount,
    setSelectedScope,
    mockLogin,
    setLoading,
    setError,
  };
};

// Temporary helper mapping LC scopes to their parent MF scope IDs
// In a real application, this would come from the accounts hierarchy.
const lcToMfParentMap: Record<string, string> = {
  lc_center_nyc: "mf_region_1",
  lc_center_la: "mf_region_2",
  lc_center_chicago: "mf_region_1",
};

export function getParentMfIdForLcScope(scopeId: string | undefined | null): string | null {
  if (!scopeId) return null;
  return lcToMfParentMap[scopeId] || null;
}

// Helper function to get available scopes for a role
export const getScopesForRole = (role: Role): AuthScope[] => {
  return mockScopes.filter(scope => scope.type === role);
};
