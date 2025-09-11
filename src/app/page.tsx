"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useIsHydrated } from "@/store/auth";

export default function HomePage() {
  const isAuthenticated = useIsAuthenticated();
  const isHydrated = useIsHydrated();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">iQuP</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
