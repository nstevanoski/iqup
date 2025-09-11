"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgramForm } from "@/components/forms/ProgramForm";
import { Program } from "@/types";
import { useUser, useToken } from "@/store/auth";
import { ArrowLeft } from "lucide-react";
import { createProgram, programsAPI, CreateProgramData } from "@/lib/api/programs";

export default function NewProgramPage() {
  const router = useRouter();
  const user = useUser();
  const token = useToken();
  const [saving, setSaving] = useState(false);
  // HQ-only guard
  if (user?.role !== "HQ") {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">Only Head Quarters can create programs.</p>
            <button
              onClick={() => router.push("/programs")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Programs
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (formData: Partial<Program>) => {
    if (!token) {
      alert("Authentication required. Please log in again.");
      return;
    }

    try {
      setSaving(true);
      
      // Update API token
      programsAPI.updateToken(token);

      // Convert form data to CreateProgramData format
      const createData: CreateProgramData = {
        name: formData.name || "",
        description: formData.description || "",
        status: formData.status || "draft",
        duration: formData.duration || 0,
        maxStudents: formData.maxStudents || 0,
        hours: formData.hours || 0,
        lessonLength: formData.lessonLength || 0,
        kind: formData.kind || "academic",
        sharedWithMFs: formData.sharedWithMFs || [],
        visibility: formData.visibility || "private",
      };
      
      const response = await createProgram(createData);
      
      if (response.success) {
        // Navigate to the new program's detail page
        router.push(`/programs/${response.data.id}`);
      } else {
        alert("Failed to create program. Please try again.");
      }
    } catch (err) {
      console.error("Error creating program:", err);
      alert(err instanceof Error ? err.message : "Failed to create program. Please try again.");
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
