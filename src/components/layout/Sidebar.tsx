"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser, useSelectedScope, useAuthActions } from "@/store/auth";
import { getNavigationForRoleWithRules } from "@/lib/rbac";
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  GraduationCap,
  Users,
  Users2,
  ShoppingCart,
  Package,
  BookOpenCheck,
  UserCheck,
  Building2,
  TrendingUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const iconMap = {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  GraduationCap,
  Users,
  Users2,
  ShoppingCart,
  Package,
  BookOpenCheck,
  UserCheck,
  Building2,
  TrendingUp,
  BarChart3,
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const user = useUser();
  const selectedScope = useSelectedScope();
  const { logout } = useAuthActions();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!user) {
    return null;
  }

  const navigationItems = getNavigationForRoleWithRules(user.role);

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-gray-900">iqUP FMS</h1>
        )}
        {/* <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                isCollapsed && "justify-center"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {!isCollapsed && (
                <span className="ml-3 truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {!isCollapsed && (
        <div className="border-t p-4 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex w-full items-center space-x-3 rounded-md p-2 text-sm hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
              {selectedScope && (
                <p className="text-xs text-blue-600 truncate font-medium">
                  {selectedScope.name}
                </p>
              )}
            </div>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute bottom-0 left-full ml-2 mb-4 w-48 rounded-md border bg-white py-1 shadow-lg">
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
      )}
    </div>
  );
}
