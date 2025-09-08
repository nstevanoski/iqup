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
    label: "Products",
    href: "/orders/products",
    icon: "Package",
    roles: ["HQ"],
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
];

// Role-based navigation rules with scoping
export interface NavigationRule {
  role: Role;
  allowedRoutes: string[];
  scopedRoutes?: {
    [route: string]: {
      scope: Role[];
      description: string;
    };
  };
}

export const navigationRules: NavigationRule[] = [
  {
    role: "HQ",
    allowedRoutes: [
      "/dashboard",
      "/programs",
      "/subprograms",
      "/contacts/students",
      "/contacts/teachers",
      "/learning-groups",
      "/orders",
      "/orders/products",
      "/trainings",
      "/teacher-trainers",
      "/accounts",
      "/reports/royalties",
      "/reports/students",
    ],
  },
  {
    role: "MF",
    allowedRoutes: [
      "/dashboard",
      "/programs",
      "/subprograms",
      "/contacts/students",
      "/contacts/teachers",
      "/learning-groups",
      "/orders",
      "/trainings",
      "/teacher-trainers",
      "/accounts",
      "/reports/royalties",
      "/reports/students",
    ],
    scopedRoutes: {
      "/programs": {
        scope: ["MF"],
        description: "Scoped to MF regions",
      },
      "/contacts/students": {
        scope: ["MF"],
        description: "Scoped to MF regions",
      },
      "/contacts/teachers": {
        scope: ["MF"],
        description: "Scoped to MF regions",
      },
      "/learning-groups": {
        scope: ["MF"],
        description: "Scoped to MF regions",
      },
      "/orders": {
        scope: ["MF"],
        description: "Scoped to MF regions",
      },
      "/trainings": {
        scope: ["MF"],
        description: "Scoped to MF regions",
      },
      "/reports/students": {
        scope: ["MF"],
        description: "Scoped to MF regions",
      },
    },
  },
  {
    role: "LC",
    allowedRoutes: [
      "/dashboard",
      "/programs",
      "/contacts/students",
      "/contacts/teachers",
      "/learning-groups",
      "/orders",
      "/reports/students",
      "/trainings",
    ],
    scopedRoutes: {
      "/programs": {
        scope: ["MF"],
        description: "Programs visible based on parent MF sharing",
      },
      "/orders": {
        scope: ["MF"],
        description: "Orders routed to MF for processing",
      },
      "/trainings": {
        scope: ["LC"],
        description: "View-only access to trainings",
      },
    },
  },
  {
    role: "TT",
    allowedRoutes: [
      "/dashboard",
      "/trainings",
    ],
    scopedRoutes: {
      "/trainings": {
        scope: ["TT"],
        description: "Training management only",
      },
    },
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

// Helper function to get navigation items based on new role-based rules
export function getNavigationForRoleWithRules(role: Role): NavigationItem[] {
  const rule = navigationRules.find(r => r.role === role);
  if (!rule) return [];
  
  return navigationItems.filter(item => 
    rule.allowedRoutes.includes(item.href)
  );
}

// Helper function to check if a route is scoped for a role
export function isRouteScoped(role: Role, route: string): boolean {
  const rule = navigationRules.find(r => r.role === role);
  if (!rule || !rule.scopedRoutes) return false;
  
  return route in rule.scopedRoutes;
}

// Helper function to get scope information for a route
export function getRouteScope(role: Role, route: string) {
  const rule = navigationRules.find(r => r.role === role);
  if (!rule || !rule.scopedRoutes) return null;
  
  return rule.scopedRoutes[route] || null;
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
