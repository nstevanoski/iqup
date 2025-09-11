"use client";

import { useAuthActions, useIsLoading, useAuthError } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { authenticate } = useAuthActions();
  const router = useRouter();
  const isLoading = useIsLoading();
  const error = useAuthError();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    const response = await authenticate({ email, password });
    
    if (response.success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border border-black p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-sm text-gray-600 font-mono">
            Sign in to your IQUP account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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

            {/* Demo Credentials Info */}
            <div className="rounded-md bg-blue-50 p-3">
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p className="font-mono text-xs">Email: admin@iqup.com</p>
                <p className="font-mono text-xs">Password: admin123456</p>
                <p className="mt-2 text-xs">
                  This is the main HQ admin account that can manage all MF/LC/TT accounts.
                </p>
              </div>
            </div>

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
                "Sign In"
              )}
            </button>
          </form>
      </div>
    </div>
  );
}
