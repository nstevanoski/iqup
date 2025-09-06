"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubProgramForm } from "@/components/forms/SubProgramForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useUser } from "@/store/auth";
import { Program, SubProgram } from "@/types";
import { ArrowLeft } from "lucide-react";

// Mock programs data - in a real app, this would come from an API
const mockPrograms: Program[] = [
  {
    id: "prog_1",
    name: "English Language Program",
    description: "Comprehensive English language learning program",
    status: "active",
    category: "Language",
    duration: 12,
    price: 299.99,
    maxStudents: 20,
    currentStudents: 15,
    requirements: ["Basic reading skills"],
    learningObjectives: ["Fluency in English", "Grammar mastery"],
    createdBy: "user_1",
    hours: 120,
    lessonLength: 60,
    kind: "academic",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "prog_2",
    name: "Mathematics Program",
    description: "Advanced mathematics curriculum",
    status: "active",
    category: "Mathematics",
    duration: 16,
    price: 399.99,
    maxStudents: 25,
    currentStudents: 20,
    requirements: ["Basic arithmetic"],
    learningObjectives: ["Problem solving", "Mathematical reasoning"],
    createdBy: "user_1",
    hours: 160,
    lessonLength: 90,
    kind: "academic",
    sharedWithMFs: ["mf_region_1"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "prog_3",
    name: "STEM Camp",
    description: "Science, Technology, Engineering, and Mathematics camp",
    status: "active",
    category: "STEM",
    duration: 8,
    price: 199.99,
    maxStudents: 30,
    currentStudents: 25,
    requirements: ["Age 8-14"],
    learningObjectives: ["STEM exploration", "Hands-on learning"],
    createdBy: "user_1",
    hours: 80,
    lessonLength: 120,
    kind: "stem_camp",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "prog_4",
    name: "Birthday Party Program",
    description: "Educational birthday party activities",
    status: "active",
    category: "Entertainment",
    duration: 2,
    price: 99.99,
    maxStudents: 15,
    currentStudents: 8,
    requirements: ["Age 5-12"],
    learningObjectives: ["Fun learning", "Social interaction"],
    createdBy: "user_1",
    hours: 4,
    lessonLength: 120,
    kind: "birthday_party",
    sharedWithMFs: ["mf_region_1"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
  },
];

export default function NewSubProgramPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Partial<SubProgram>) => {
    setLoading(true);
    
    try {
      // In a real app, this would make an API call
      console.log("Creating subprogram:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to subprograms list
      router.push("/subprograms");
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

  // Check if user has permission to create subprograms
  if (user?.role !== "MF") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              Only Master Franchisors (MF) can create subprograms.
            </p>
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
        <SubProgramForm
          programs={mockPrograms}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
