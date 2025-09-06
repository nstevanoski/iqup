"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface WithAuthProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Check permissions if required
      if (requiredPermissions && user) {
        const hasRequiredPermissions = requiredPermissions.every(permission => {
          // This would need to be implemented based on your permission system
          // For now, we'll just check if user exists
          return user.role === "HQ" || permission in user;
        });

        if (!hasRequiredPermissions) {
          router.push("/dashboard"); // Redirect to dashboard if no permission
          return;
        }
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Higher-order component for pages that require authentication
export function WithAuth({ children, requiredPermissions }: WithAuthProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check permissions if required
    if (requiredPermissions && user) {
      const hasRequiredPermissions = requiredPermissions.every(permission => {
        // This would need to be implemented based on your permission system
        // For now, we'll just check if user exists
        return user.role === "HQ" || permission in user;
      });

      if (!hasRequiredPermissions) {
        router.push("/dashboard"); // Redirect to dashboard if no permission
        return;
      }
    }
  }, [isAuthenticated, user, router, requiredPermissions]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
