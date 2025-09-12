"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubProgramForm } from "@/components/forms/SubProgramForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useUser, useSelectedScope } from "@/store/auth";
import { Program, SubProgram } from "@/types";
import { ArrowLeft } from "lucide-react";
import { createSubProgram } from "@/lib/api/subprograms";
import { getPrograms } from "@/lib/api/programs";


export default function NewSubProgramPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!user || !selectedScope) return;
      
      try {
        setProgramsLoading(true);
        const response = await getPrograms({ 
          limit: 100,
          userRole: user.role,
          userScope: selectedScope.id
        });
        if (response.success) {
          setPrograms(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setProgramsLoading(false);
      }
    };

    fetchPrograms();
  }, [user, selectedScope]);

  const handleSubmit = async (data: Partial<SubProgram>) => {
    setLoading(true);
    
    try {
      const response = await createSubProgram(data as any);
      
      if (response.success) {
        // Redirect back to subprograms list
        router.push("/subprograms");
      } else {
        alert("Failed to create subprogram. Please try again.");
      }
    } catch (error) {
      console.error("Error creating subprogram:", error);
      alert("Failed to create subprogram. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/subprograms");
  };

  // Check if user has permission to create subprograms (HQ and MF)
  if (user?.role !== "MF" && user?.role !== "HQ") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">Only Head Quarters and Master Franchisors can create subprograms.</p>
            <button
              onClick={() => router.push("/subprograms")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to SubPrograms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "SubPrograms", href: "/subprograms" },
            { label: "New SubProgram" }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New SubProgram</h1>
              <p className="text-gray-600">Set up a new subprogram with specific pricing and sharing options</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Creating a New SubProgram
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Select an existing program and configure pricing, billing options, and sharing settings. 
                  You can create multiple subprograms from the same base program for different regions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {programsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <SubProgramForm
            programs={programs}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
