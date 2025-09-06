"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockLogin } from "@/store/auth";
import { Role, Scope, getRoleDisplayName, getScopeDisplayName, getAvailableScopes } from "@/lib/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const roles: { role: Role; name: string; description: string }[] = [
  {
    role: "HQ",
    name: "Headquarters",
    description: "Full access to all features and data across the organization"
  },
  {
    role: "MF", 
    name: "Master Franchise",
    description: "Access to franchise management features and data"
  },
  {
    role: "LC",
    name: "Learning Center", 
    description: "Access to student and teacher management within center"
  },
  {
    role: "TT",
    name: "Teacher Trainer",
    description: "Access to training and learning group features"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedScope, setSelectedScope] = useState<Scope | null>(null);
  const [selectedScopeId, setSelectedScopeId] = useState<string | null>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setSelectedScope(null);
    setSelectedScopeId(null);
  };

  const handleScopeSelect = (scope: Scope, scopeId?: string) => {
    setSelectedScope(scope);
    setSelectedScopeId(scopeId || null);
  };

  const handleLogin = () => {
    if (selectedRole && selectedScope) {
      mockLogin(selectedRole, selectedScope, selectedScopeId || undefined);
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setSelectedScope(null);
    setSelectedScopeId(null);
  };

  const availableScopes = selectedRole ? getAvailableScopes(selectedRole) : [];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">iQup</h1>
          <p className="mt-2 text-sm text-gray-600">
            {selectedRole ? "Select your scope" : "Choose your role"}
          </p>
        </div>

        {!selectedRole ? (
          <div className="space-y-4">
            {roles.map(({ role, name, description }) => (
              <Card 
                key={role} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleRoleSelect(role)}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {name}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={handleBack}
                className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <span>•</span>
              <span>Role: {getRoleDisplayName(selectedRole)}</span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Scope</CardTitle>
                <CardDescription>
                  Choose the scope of access for your {getRoleDisplayName(selectedRole)} role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableScopes.map(({ scope, label, description }) => (
                  <div
                    key={scope}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedScope === scope
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleScopeSelect(scope)}
                  >
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-gray-600 mt-1">{description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedScope && (
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Login as {getRoleDisplayName(selectedRole)} - {getScopeDisplayName(selectedScope)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
