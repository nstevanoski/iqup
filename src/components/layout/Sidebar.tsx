"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser, useSelectedScope } from "@/store/auth";
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
  Settings,
  ChevronLeft,
  ChevronRight,
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
  Settings,
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const user = useUser();
  const selectedScope = useSelectedScope();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    </div>
  );
}
