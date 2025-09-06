export type Role = "HQ" | "MF" | "LC" | "TT";
export type Scope = "global" | "franchise" | "center" | "training";

export interface User {
  id: string;
  name: string;
  role: Role;
  scope: Scope;
  scopeId?: string; // ID of the specific franchise/center/training
}

export interface Account {
  id: string;
  name: string;
  type: string;
  scope: Scope;
  parentId?: string; // For hierarchical relationships
}

// Role-based access control permissions with scope considerations
export const ROLE_PERMISSIONS = {
  HQ: {
    canViewDashboard: true,
    canViewPrograms: true,
    canViewSubprograms: true,
    canViewStudents: true,
    canViewTeachers: true,
    canViewLearningGroups: true,
    canViewOrders: true,
    canViewTrainings: true,
    canViewTeacherTrainers: true,
    canViewAccounts: true,
    canViewRoyaltyReports: true,
    canViewStudentReports: true,
    canViewSettings: true,
    scope: "global" as Scope,
  },
  MF: {
    canViewDashboard: true,
    canViewPrograms: true,
    canViewSubprograms: true,
    canViewStudents: true,
    canViewTeachers: true,
    canViewLearningGroups: true,
    canViewOrders: true,
    canViewTrainings: true,
    canViewTeacherTrainers: true,
    canViewAccounts: true,
    canViewRoyaltyReports: true,
    canViewStudentReports: true,
    canViewSettings: false,
    scope: "franchise" as Scope,
  },
  LC: {
    canViewDashboard: true,
    canViewPrograms: false,
    canViewSubprograms: false,
    canViewStudents: true,
    canViewTeachers: true,
    canViewLearningGroups: true,
    canViewOrders: true, // Can view orders to MF
    canViewTrainings: true, // Can view trainings
    canViewTeacherTrainers: false,
    canViewAccounts: false,
    canViewRoyaltyReports: false,
    canViewStudentReports: true,
    canViewSettings: false,
    scope: "center" as Scope,
  },
  TT: {
    canViewDashboard: true,
    canViewPrograms: false,
    canViewSubprograms: false,
    canViewStudents: false,
    canViewTeachers: false,
    canViewLearningGroups: true,
    canViewOrders: false,
    canViewTrainings: true, // Only trainings
    canViewTeacherTrainers: false,
    canViewAccounts: false,
    canViewRoyaltyReports: false,
    canViewStudentReports: false,
    canViewSettings: false,
    scope: "training" as Scope,
  },
} as const;

export type Permission = keyof typeof ROLE_PERMISSIONS.HQ;

export function hasPermission(role: Role, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return Boolean(rolePermissions[permission as keyof typeof rolePermissions]);
}

export function getRoleDisplayName(role: Role): string {
  const displayNames = {
    HQ: "Headquarters",
    MF: "Master Franchise",
    LC: "Learning Center",
    TT: "Teacher Trainer",
  };
  return displayNames[role];
}

export function getScopeDisplayName(scope: Scope): string {
  const displayNames = {
    global: "Global",
    franchise: "Franchise",
    center: "Learning Center",
    training: "Training Center",
  };
  return displayNames[scope];
}

export function canAccessResource(user: User, resourceScope: Scope, resourceScopeId?: string): boolean {
  // HQ can access everything
  if (user.role === "HQ") return true;
  
  // Check if user's scope matches or is higher in hierarchy
  const scopeHierarchy: Record<Scope, number> = {
    global: 4,
    franchise: 3,
    center: 2,
    training: 1,
  };
  
  const userScopeLevel = scopeHierarchy[user.scope];
  const resourceScopeLevel = scopeHierarchy[resourceScope];
  
  // User can access resources at their level or below
  if (userScopeLevel >= resourceScopeLevel) {
    // If both have scope IDs, they must match
    if (user.scopeId && resourceScopeId) {
      return user.scopeId === resourceScopeId;
    }
    return true;
  }
  
  return false;
}

export function getAvailableScopes(role: Role): { scope: Scope; label: string; description: string }[] {
  const scopeOptions = {
    HQ: [
      { scope: "global" as Scope, label: "Global", description: "Access to all data across the organization" },
    ],
    MF: [
      { scope: "franchise" as Scope, label: "Franchise", description: "Access to franchise-specific data" },
    ],
    LC: [
      { scope: "center" as Scope, label: "Learning Center", description: "Access to center-specific data" },
    ],
    TT: [
      { scope: "training" as Scope, label: "Training Center", description: "Access to training-specific data" },
    ],
  };
  
  return scopeOptions[role] || [];
}
