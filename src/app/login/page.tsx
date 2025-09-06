"use client";

import { useAuthActions, getScopesForRole, AuthScope } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Role } from "@/lib/rbac";

export default function LoginPage() {
  const { mockLogin } = useAuthActions();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("HQ");
  const [selectedScope, setSelectedScope] = useState<AuthScope | null>(null);
  const [availableScopes, setAvailableScopes] = useState<AuthScope[]>([]);

  // Update available scopes when role changes
  useEffect(() => {
    const scopes = getScopesForRole(selectedRole);
    setAvailableScopes(scopes);
    setSelectedScope(scopes[0] || null);
  }, [selectedRole]);

  const handleLogin = () => {
    if (selectedScope) {
      mockLogin(selectedRole, selectedScope.id);
      router.push("/dashboard");
    }
  };

  const roles: { value: Role; label: string; description: string; color: string }[] = [
    { value: "HQ", label: "HQ Admin", description: "Full system access across all regions", color: "bg-red-50 border-red-200 text-red-700" },
    { value: "MF", label: "MF Manager", description: "Management functions for assigned regions", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { value: "LC", label: "LC Coordinator", description: "Local learning center operations", color: "bg-green-50 border-green-200 text-green-700" },
    { value: "TT", label: "Teacher Trainer", description: "Training and development functions", color: "bg-purple-50 border-purple-200 text-purple-700" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to iQuP
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Select your role and organizational scope to access the system
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {/* Role Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-all duration-200 ${
                    selectedRole === role.value
                      ? `${role.color} border-current`
                      : "border-gray-200 hover:border-gray-300 bg-white"
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
                    <div className="font-medium">{role.label}</div>
                    <div className="text-sm opacity-75 mt-1">{role.description}</div>
                  </div>
                  {selectedRole === role.value && (
                    <div className="absolute top-4 right-4">
                      <div className="h-4 w-4 rounded-full bg-current"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Scope Selection */}
          {availableScopes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Scope</h3>
              <div className="space-y-3">
                {availableScopes.map((scope) => (
                  <label
                    key={scope.id}
                    className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-colors ${
                      selectedScope?.id === scope.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="scope"
                      value={scope.id}
                      checked={selectedScope?.id === scope.id}
                      onChange={() => setSelectedScope(scope)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{scope.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{scope.description}</div>
                    </div>
                    {selectedScope?.id === scope.id && (
                      <div className="absolute top-4 right-4">
                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Login Button */}
          <div className="pt-4">
            <button
              onClick={handleLogin}
              disabled={!selectedScope}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {selectedScope ? "Sign in" : "Select a scope to continue"}
            </button>
          </div>

          {/* Role Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Role Permissions</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {selectedRole === "HQ" && (
                <p>• Full system access across all regions and functions</p>
              )}
              {selectedRole === "MF" && (
                <p>• Management functions for assigned regions</p>
              )}
              {selectedRole === "LC" && (
                <p>• Learning center operations, student management, and local reporting</p>
              )}
              {selectedRole === "TT" && (
                <p>• Training sessions, teacher development, and training materials</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
