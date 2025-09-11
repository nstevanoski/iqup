"use client";

import { useIsAuthenticated, useIsHydrated } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface WithAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function withAuth<T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function AuthenticatedComponent(props: T) {
    const isAuthenticated = useIsAuthenticated();
    const isHydrated = useIsHydrated();
    const router = useRouter();

    useEffect(() => {
      if (isHydrated && !isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, isHydrated, router]);

    // Show loading while hydrating
    if (!isHydrated) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            {/* <h1 className="text-2xl font-bold text-gray-900">iqUP FMS</h1>
            <p className="text-gray-600">Loading...</p> */}
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            {/* <h1 className="text-2xl font-bold text-gray-900">iqUP FMS</h1>
            <p className="text-gray-600">Redirecting to login...</p> */}
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Alternative HOC for pages that need authentication
export function AuthGuard({ children, fallback }: WithAuthProps) {
  const isAuthenticated = useIsAuthenticated();
  const isHydrated = useIsHydrated();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            {/* <h1 className="text-2xl font-bold text-gray-900">iqUP FMS</h1>
            <p className="text-gray-600">Loading...</p> */}
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            {/* <h1 className="text-2xl font-bold text-gray-900">iqUP FMS</h1>
            <p className="text-gray-600">Redirecting to login...</p> */}
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
