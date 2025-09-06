"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Role } from "@/lib/rbac";

export interface AuthScope {
  id: string;
  name: string;
  type: Role;
  description: string;
}

interface AuthState {
  user: User | null;
  selectedAccount: string | null;
  selectedScope: AuthScope | null;
  isAuthenticated: boolean;
  login: (user: User, scope?: AuthScope) => void;
  logout: () => void;
  setSelectedAccount: (accountId: string) => void;
  setSelectedScope: (scope: AuthScope) => void;
  mockLogin: (role: Role, scopeId?: string) => void;
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
      selectedAccount: null,
      selectedScope: null,
      isAuthenticated: false,

      login: (user: User, scope?: AuthScope) => {
        set({
          user,
          selectedScope: scope || null,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          selectedAccount: null,
          selectedScope: null,
          isAuthenticated: false,
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
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        selectedAccount: state.selectedAccount,
        selectedScope: state.selectedScope,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for easier access
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useSelectedAccount = () => useAuthStore((state) => state.selectedAccount);
export const useSelectedScope = () => useAuthStore((state) => state.selectedScope);

// Individual action selectors to avoid object recreation
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSetSelectedAccount = () => useAuthStore((state) => state.setSelectedAccount);
export const useSetSelectedScope = () => useAuthStore((state) => state.setSelectedScope);
export const useMockLogin = () => useAuthStore((state) => state.mockLogin);

// Combined actions selector - use individual hooks to avoid object recreation
export const useAuthActions = () => {
  const login = useLogin();
  const logout = useLogout();
  const setSelectedAccount = useSetSelectedAccount();
  const setSelectedScope = useSetSelectedScope();
  const mockLogin = useMockLogin();
  
  return {
    login,
    logout,
    setSelectedAccount,
    setSelectedScope,
    mockLogin,
  };
};

// Helper function to get available scopes for a role
export const getScopesForRole = (role: Role): AuthScope[] => {
  return mockScopes.filter(scope => scope.type === role);
};
