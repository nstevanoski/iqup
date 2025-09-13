"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { Teacher } from "@/types";
import { ArrowLeft, Info } from "lucide-react";
import { teachersAPI } from "@/lib/api/teachers";
import { useUser, useSelectedScope, useToken } from "@/store/auth";

export default function NewTeacherPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const token = useToken();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (teacherData: Omit<Teacher, "id" | "createdAt" | "updatedAt">) => {
    if (!user || !selectedScope || !token) return;
    
    try {
      setLoading(true);
      
      // Update API token to match current user context
      teachersAPI.updateToken(token);
      
      const result = await teachersAPI.createTeacher(teacherData);
      router.push(`/contacts/teachers/${result.data.id}`);
    } catch (error) {
      console.error("Error creating teacher:", error);
      alert("Failed to create teacher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/contacts/teachers");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/contacts/teachers")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Teachers
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Contacts", href: "/contacts" },
            { label: "Teachers", href: "/contacts/teachers" },
            { label: "New Teacher", href: "/contacts/teachers/new" },
          ]}
        />

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Create New Teacher</h3>
              <p className="text-sm text-blue-700 mt-1">
                Fill in the teacher's information below. All fields marked with * are required.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <TeacherForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
