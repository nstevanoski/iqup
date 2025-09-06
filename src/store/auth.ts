"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Account, Role, Scope } from "@/lib/rbac";

interface AuthState {
  user: User | null;
  selectedAccount: Account | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setSelectedAccount: (account: Account) => void;
}

// Mock accounts for different roles and scopes
const MOCK_ACCOUNTS: Record<Role, Account[]> = {
  HQ: [
    { id: "1", name: "Global Headquarters", type: "HQ", scope: "global" },
    { id: "2", name: "Regional Office North", type: "Regional", scope: "global" },
  ],
  MF: [
    { id: "3", name: "Master Franchise USA", type: "Master Franchise", scope: "franchise" },
    { id: "4", name: "Master Franchise Europe", type: "Master Franchise", scope: "franchise" },
  ],
  LC: [
    { id: "5", name: "Learning Center NYC", type: "Learning Center", scope: "center", parentId: "3" },
    { id: "6", name: "Learning Center LA", type: "Learning Center", scope: "center", parentId: "3" },
    { id: "7", name: "Learning Center London", type: "Learning Center", scope: "center", parentId: "4" },
  ],
  TT: [
    { id: "8", name: "Teacher Training Center Chicago", type: "Training Center", scope: "training" },
    { id: "9", name: "Teacher Training Center Miami", type: "Training Center", scope: "training" },
  ],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      selectedAccount: null,
      isAuthenticated: false,

      login: (user: User) => {
        const accounts = MOCK_ACCOUNTS[user.role];
        set({
          user,
          selectedAccount: accounts[0] || null,
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

      setSelectedAccount: (account: Account) => {
        set({ selectedAccount: account });
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

// Mock login function for development
export const mockLogin = (role: Role, scope: Scope, scopeId?: string) => {
  const mockUsers: Record<Role, User> = {
    HQ: { id: "1", name: "John Smith", role: "HQ", scope: "global" },
    MF: { id: "2", name: "Sarah Johnson", role: "MF", scope: "franchise", scopeId: "3" },
    LC: { id: "3", name: "Mike Davis", role: "LC", scope: "center", scopeId: "5" },
    TT: { id: "4", name: "Emily Wilson", role: "TT", scope: "training", scopeId: "8" },
  };

  const user = {
    ...mockUsers[role],
    scope,
    scopeId: scopeId || mockUsers[role].scopeId,
  };
  
  useAuthStore.getState().login(user);
  return user;
};
