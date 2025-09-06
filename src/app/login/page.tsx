"use client";

import { useAuthActions, useIsLoading, useAuthError } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, User, Building, GraduationCap, Users } from "lucide-react";

export default function LoginPage() {
  const { authenticate, mockLogin } = useAuthActions();
  const router = useRouter();
  const isLoading = useIsLoading();
  const error = useAuthError();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"email" | "demo">("email");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    const response = await authenticate({ email, password });
    
    if (response.success) {
      router.push("/dashboard");
    }
  };

  const handleDemoLogin = (role: "HQ" | "MF" | "LC" | "TT") => {
    mockLogin(role);
    router.push("/dashboard");
  };

  const demoUsers = [
    {
      role: "HQ" as const,
      email: "admin@iqup.com",
      password: "admin123",
      name: "HQ Administrator",
      description: "Full system access across all regions",
      icon: Building,
      color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
    },
    {
      role: "MF" as const,
      email: "mf.region1@iqup.com",
      password: "mf123",
      name: "Region 1 Manager",
      description: "Management functions for assigned regions",
      icon: Building,
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
    },
    {
      role: "LC" as const,
      email: "lc.nyc@iqup.com",
      password: "lc123",
      name: "NYC Learning Center Coordinator",
      description: "Local learning center operations",
      icon: Users,
      color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
    },
    {
      role: "TT" as const,
      email: "tt.trainer1@iqup.com",
      password: "tt123",
      name: "Senior Teacher Trainer",
      description: "Training and development functions",
      icon: GraduationCap,
      color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-sm text-gray-600 font-mono">
            Login to your account or try a demo
          </p>
        </div>

        {/* Login Mode Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLoginMode("email")}
            className={`flex-1 py-2 px-4 text-sm font-mono rounded-md transition-colors ${
              loginMode === "email"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setLoginMode("demo")}
            className={`flex-1 py-2 px-4 text-sm font-mono rounded-md transition-colors ${
              loginMode === "demo"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Demo
          </button>
        </div>

        {loginMode === "email" ? (
          /* Email/Password Login Form */
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-mono text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="m@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-mono text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm font-mono text-blue-600 hover:text-blue-800"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-mono hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        ) : (
          /* Demo Accounts */
          <div className="space-y-3">
            {demoUsers.map((user) => {
              const IconComponent = user.icon;
              return (
                <button
                  key={user.role}
                  onClick={() => handleDemoLogin(user.role)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-mono hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors flex items-center justify-center"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {user.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
