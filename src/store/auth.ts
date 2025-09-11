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
  authenticate: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => void;
  setSelectedAccount: (accountId: string) => void;
  setSelectedScope: (scope: AuthScope) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Real scopes based on actual account data - these will be populated from the backend
const getAccountScopes = (backendUser: any): AuthScope | null => {
  if (backendUser.account.hq) {
    return {
      id: backendUser.account.hq.id.toString(),
      name: backendUser.account.hq.name,
      type: "HQ" as Role,
      description: `Headquarters: ${backendUser.account.hq.code}`,
    };
  } else if (backendUser.account.mf) {
    return {
      id: backendUser.account.mf.id.toString(),
      name: backendUser.account.mf.name,
      type: "MF" as Role,
      description: `Master Franchisee: ${backendUser.account.mf.code}`,
    };
  } else if (backendUser.account.lc) {
    return {
      id: backendUser.account.lc.id.toString(),
      name: backendUser.account.lc.name,
      type: "LC" as Role,
      description: `Learning Center: ${backendUser.account.lc.code}`,
    };
  } else if (backendUser.account.tt) {
    return {
      id: backendUser.account.tt.id.toString(),
      name: backendUser.account.tt.name,
      type: "TT" as Role,
      description: `Teacher Trainer: ${backendUser.account.tt.code}`,
    };
  }
  return null;
};

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
            const { user: backendUser, token } = data.data;
            
            // Convert backend user response to frontend AuthUser format
            const authUser: AuthUser = {
              id: backendUser.id.toString(),
              email: backendUser.email,
              name: `${backendUser.firstName} ${backendUser.lastName}`,
              role: backendUser.role.startsWith('HQ') ? 'HQ' : 
                    backendUser.role.startsWith('MF') ? 'MF' :
                    backendUser.role.startsWith('LC') ? 'LC' : 'TT',
              password: '', // Never store password
              isActive: backendUser.status === 'ACTIVE',
              lastLogin: new Date(backendUser.lastLoginAt),
              createdAt: new Date(),
              updatedAt: new Date(),
              scopeId: backendUser.account.hq?.id?.toString() || 
                       backendUser.account.mf?.id?.toString() ||
                       backendUser.account.lc?.id?.toString() ||
                       backendUser.account.tt?.id?.toString(),
            };

            // Convert to User for compatibility with existing components
            const user: User = {
              id: authUser.id,
              name: authUser.name,
              role: authUser.role,
              email: authUser.email,
            };

            // Get the appropriate scope based on actual account data
            const scope = getAccountScopes(backendUser);

            set({
              user,
              authUser,
              token,
              selectedScope: scope,
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
export const useAuthenticate = () => useAuthStore((state) => state.authenticate);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSetSelectedAccount = () => useAuthStore((state) => state.setSelectedAccount);
export const useSetSelectedScope = () => useAuthStore((state) => state.setSelectedScope);
export const useSetLoading = () => useAuthStore((state) => state.setLoading);
export const useSetError = () => useAuthStore((state) => state.setError);

// Combined actions selector - use individual hooks to avoid object recreation
export const useAuthActions = () => {
  const authenticate = useAuthenticate();
  const logout = useLogout();
  const setSelectedAccount = useSetSelectedAccount();
  const setSelectedScope = useSetSelectedScope();
  const setLoading = useSetLoading();
  const setError = useSetError();
  
  return {
    authenticate,
    logout,
    setSelectedAccount,
    setSelectedScope,
    setLoading,
    setError,
  };
};

