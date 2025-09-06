"use client";

import { useAuthStore } from "@/store/auth";
import { getRoleDisplayName, getScopeDisplayName } from "@/lib/rbac";
import { LogOut, User, Building2, Globe } from "lucide-react";

export function Topbar() {
  const { user, selectedAccount, logout } = useAuthStore();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome back, {user.name}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{getRoleDisplayName(user.role)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Globe className="h-4 w-4" />
            <span>{getScopeDisplayName(user.scope)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {selectedAccount && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{selectedAccount.name}</span>
            </div>
          )}
          
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
