export type Role = "HQ" | "MF" | "LC" | "TT";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Account {
  id: string;
  name: string;
  type: string;
}

// Role-based access control permissions
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
  },
  LC: {
    canViewDashboard: true,
    canViewPrograms: false,
    canViewSubprograms: false,
    canViewStudents: true,
    canViewTeachers: true,
    canViewLearningGroups: true,
    canViewOrders: false,
    canViewTrainings: false,
    canViewTeacherTrainers: false,
    canViewAccounts: false,
    canViewRoyaltyReports: false,
    canViewStudentReports: true,
    canViewSettings: false,
  },
  TT: {
    canViewDashboard: true,
    canViewPrograms: false,
    canViewSubprograms: false,
    canViewStudents: false,
    canViewTeachers: false,
    canViewLearningGroups: true,
    canViewOrders: false,
    canViewTrainings: true,
    canViewTeacherTrainers: false,
    canViewAccounts: false,
    canViewRoyaltyReports: false,
    canViewStudentReports: false,
    canViewSettings: false,
  },
} as const;

export type Permission = keyof typeof ROLE_PERMISSIONS.HQ;

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role][permission];
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
