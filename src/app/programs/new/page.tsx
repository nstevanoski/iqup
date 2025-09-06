"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgramForm } from "@/components/forms/ProgramForm";
import { Program } from "@/types";
import { ArrowLeft } from "lucide-react";

export default function NewProgramPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData: Partial<Program>) => {
    try {
      setSaving(true);
      
      // In a real app, this would be an API call to create the program
      const newProgram = {
        ...formData,
        id: `new_${Date.now()}`, // Generate a temporary ID
        currentStudents: 0,
        createdBy: "current_user", // Would be set from auth context
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      console.log("Creating new program:", newProgram);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the new program's detail page
      // In a real app, you'd use the actual ID returned from the API
      router.push(`/programs/${newProgram.id}`);
    } catch (err) {
      console.error("Error creating program:", err);
      alert("Failed to create program. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/programs");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Programs", href: "/programs" },
            { label: "New Program" }
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
              <h1 className="text-2xl font-bold text-gray-900">Create New Program</h1>
              <p className="text-gray-600">Set up a new educational program</p>
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
                Creating a New Program
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Fill out all the required information to create a new educational program. 
                  You can save as a draft and publish when ready, or make it active immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <ProgramForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </DashboardLayout>
  );
}
