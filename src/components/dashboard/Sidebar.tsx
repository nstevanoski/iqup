"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  GraduationCap, 
  ShoppingCart, 
  BookMarked, 
  UserCheck, 
  Building2, 
  BarChart3, 
  Settings,
  User,
  UserPlus
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { hasPermission, getRoleDisplayName, Permission } from "@/lib/rbac";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: Permission;
}

const sidebarLinks: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: "canViewDashboard",
  },
  {
    href: "/programs",
    label: "Programs",
    icon: BookOpen,
    permission: "canViewPrograms",
  },
  {
    href: "/subprograms",
    label: "Subprograms",
    icon: BookMarked,
    permission: "canViewSubprograms",
  },
  {
    href: "/contacts/students",
    label: "Students",
    icon: User,
    permission: "canViewStudents",
  },
  {
    href: "/contacts/teachers",
    label: "Teachers",
    icon: UserPlus,
    permission: "canViewTeachers",
  },
  {
    href: "/learning-groups",
    label: "Learning Groups",
    icon: GraduationCap,
    permission: "canViewLearningGroups",
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    permission: "canViewOrders",
  },
  {
    href: "/trainings",
    label: "Trainings",
    icon: BookMarked,
    permission: "canViewTrainings",
  },
  {
    href: "/teacher-trainers",
    label: "Teacher Trainers",
    icon: UserCheck,
    permission: "canViewTeacherTrainers",
  },
  {
    href: "/accounts",
    label: "Accounts",
    icon: Building2,
    permission: "canViewAccounts",
  },
  {
    href: "/reports/royalties",
    label: "Royalty Reports",
    icon: BarChart3,
    permission: "canViewRoyaltyReports",
  },
  {
    href: "/reports/students",
    label: "Student Reports",
    icon: BarChart3,
    permission: "canViewStudentReports",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    permission: "canViewSettings",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const visibleLinks = sidebarLinks.filter(link => 
    hasPermission(user.role, link.permission)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">iQup</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-4">
          <div className="text-sm text-gray-400 mb-1">Logged in as</div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-gray-400">{getRoleDisplayName(user.role)}</div>
        </div>
        
        <nav className="space-y-1 px-2">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
