"use client";

import { useUser, useSelectedScope, useAuthActions } from "@/store/auth";
import { LogOut, Settings } from "lucide-react";
import { useState } from "react";

interface TopbarProps {
  className?: string;
}

export function Topbar({ className }: TopbarProps) {
  const user = useUser();
  const selectedScope = useSelectedScope();
  const { logout } = useAuthActions();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <header className={`flex h-16 items-center justify-end border-b bg-white px-6 ${className}`}>
      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-3 rounded-b-md p-2 text-sm hover:bg-gray-100 border border-black bg-white"
        >
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
            <div className="hidden md:block text-left">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
              {selectedScope && (
                <p className="text-xs text-blue-600 font-medium">{selectedScope.name}</p>
              )}
            </div>
        </button>

        {/* Dropdown menu */}
        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
            <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
