"use client";

import { useAuthActions } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Role } from "@/lib/rbac";

export default function LoginPage() {
  const { mockLogin } = useAuthActions();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("HQ");

  const handleLogin = () => {
    mockLogin(selectedRole);
    router.push("/dashboard");
  };

  const roles: { value: Role; label: string; description: string }[] = [
    { value: "HQ", label: "HQ Admin", description: "Full system access" },
    { value: "MF", label: "MF Manager", description: "Management functions" },
    { value: "LC", label: "LC Coordinator", description: "Local coordination" },
    { value: "TT", label: "Teacher Trainer", description: "Training functions" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to iQuP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose a role to demo the application
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-colors ${
                  selectedRole === role.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={selectedRole === role.value}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{role.label}</div>
                  <div className="text-sm text-gray-500">{role.description}</div>
                </div>
                {selectedRole === role.value && (
                  <div className="absolute top-4 right-4">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </label>
            ))}
          </div>
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
