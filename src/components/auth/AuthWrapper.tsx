"use client";

import { WithAuth } from "./withAuth";

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export function AuthWrapper({ children, requiredPermissions }: AuthWrapperProps) {
  return (
    <WithAuth requiredPermissions={requiredPermissions}>
      {children}
    </WithAuth>
  );
}
