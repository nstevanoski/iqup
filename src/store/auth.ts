"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Account, Role } from "@/lib/rbac";

interface AuthState {
  user: User | null;
  selectedAccount: Account | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setSelectedAccount: (account: Account) => void;
}

// Mock accounts for different roles
const MOCK_ACCOUNTS: Record<Role, Account[]> = {
  HQ: [
    { id: "1", name: "Global Headquarters", type: "HQ" },
    { id: "2", name: "Regional Office North", type: "Regional" },
  ],
  MF: [
    { id: "3", name: "Master Franchise USA", type: "Master Franchise" },
    { id: "4", name: "Master Franchise Europe", type: "Master Franchise" },
  ],
  LC: [
    { id: "5", name: "Learning Center NYC", type: "Learning Center" },
    { id: "6", name: "Learning Center LA", type: "Learning Center" },
  ],
  TT: [
    { id: "7", name: "Teacher Training Center", type: "Training Center" },
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
export const mockLogin = (role: Role) => {
  const mockUsers: Record<Role, User> = {
    HQ: { id: "1", name: "John Smith", role: "HQ" },
    MF: { id: "2", name: "Sarah Johnson", role: "MF" },
    LC: { id: "3", name: "Mike Davis", role: "LC" },
    TT: { id: "4", name: "Emily Wilson", role: "TT" },
  };

  const user = mockUsers[role];
  useAuthStore.getState().login(user);
  return user;
};
