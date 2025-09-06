"use client";

import { useRouter } from "next/navigation";
import { mockLogin } from "@/store/auth";
import { Role } from "@/lib/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const roles: { role: Role; name: string; description: string }[] = [
  {
    role: "HQ",
    name: "Headquarters",
    description: "Full access to all features and data"
  },
  {
    role: "MF", 
    name: "Master Franchise",
    description: "Access to franchise management features"
  },
  {
    role: "LC",
    name: "Learning Center", 
    description: "Access to student and teacher management"
  },
  {
    role: "TT",
    name: "Teacher Trainer",
    description: "Access to training and learning group features"
  }
];

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (role: Role) => {
    mockLogin(role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">iQup</h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose a role to login with
          </p>
        </div>

        <div className="space-y-4">
          {roles.map(({ role, name, description }) => (
            <Card key={role} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <button
                  onClick={() => handleLogin(role)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login as {name}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
