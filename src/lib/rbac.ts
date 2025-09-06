export type Role = "HQ" | "MF" | "LC" | "TT";

export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  roles: Role[];
}

// Define navigation items with role-based access
export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["HQ", "MF", "LC", "TT"],
  },
  {
    label: "Programs",
    href: "/programs",
    icon: "BookOpen",
    roles: ["HQ", "MF", "LC"],
  },
  {
    label: "Subprograms",
    href: "/subprograms",
    icon: "BookMarked",
    roles: ["HQ", "MF", "LC"],
  },
  {
    label: "Students",
    href: "/contacts/students",
    icon: "GraduationCap",
    roles: ["HQ", "MF", "LC", "TT"],
  },
  {
    label: "Teachers",
    href: "/contacts/teachers",
    icon: "Users",
    roles: ["HQ", "MF", "LC"],
  },
  {
    label: "Learning Groups",
    href: "/learning-groups",
    icon: "Users2",
    roles: ["HQ", "MF", "LC", "TT"],
  },
  {
    label: "Orders",
    href: "/orders",
    icon: "ShoppingCart",
    roles: ["HQ", "MF", "LC"],
  },
  {
    label: "Trainings",
    href: "/trainings",
    icon: "BookOpenCheck",
    roles: ["HQ", "MF", "LC", "TT"],
  },
  {
    label: "Teacher Trainers",
    href: "/teacher-trainers",
    icon: "UserCheck",
    roles: ["HQ", "MF"],
  },
  {
    label: "Accounts",
    href: "/accounts",
    icon: "Building2",
    roles: ["HQ", "MF"],
  },
  {
    label: "Royalties Report",
    href: "/reports/royalties",
    icon: "TrendingUp",
    roles: ["HQ", "MF"],
  },
  {
    label: "Students Report",
    href: "/reports/students",
    icon: "BarChart3",
    roles: ["HQ", "MF", "LC"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "Settings",
    roles: ["HQ", "MF", "LC", "TT"],
  },
];

// Helper function to check if user has access to a route
export function hasAccess(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole);
}

// Helper function to get navigation items for a specific role
export function getNavigationForRole(role: Role): NavigationItem[] {
  return navigationItems.filter(item => hasAccess(role, item.roles));
}

// Role hierarchy for permissions
export const roleHierarchy: Record<Role, number> = {
  HQ: 4, // Highest level
  MF: 3,
  LC: 2,
  TT: 1, // Lowest level
};

// Check if user role has higher or equal level than required role
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
