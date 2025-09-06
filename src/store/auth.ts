"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Role } from "@/lib/rbac";

interface AuthState {
  user: User | null;
  selectedAccount: string | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setSelectedAccount: (accountId: string) => void;
  mockLogin: (role: Role) => void;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      selectedAccount: null,
      isAuthenticated: false,

      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          selectedAccount: null,
          isAuthenticated: false,
        });
      },

      setSelectedAccount: (accountId: string) => {
        set({ selectedAccount: accountId });
      },

      mockLogin: (role: Role) => {
        const user = mockUsers[role];
        set({
          user,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        selectedAccount: state.selectedAccount,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for easier access
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useSelectedAccount = () => useAuthStore((state) => state.selectedAccount);

// Individual action selectors to avoid object recreation
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSetSelectedAccount = () => useAuthStore((state) => state.setSelectedAccount);
export const useMockLogin = () => useAuthStore((state) => state.mockLogin);

// Combined actions selector - use individual hooks to avoid object recreation
export const useAuthActions = () => {
  const login = useLogin();
  const logout = useLogout();
  const setSelectedAccount = useSetSelectedAccount();
  const mockLogin = useMockLogin();
  
  return {
    login,
    logout,
    setSelectedAccount,
    mockLogin,
  };
};
