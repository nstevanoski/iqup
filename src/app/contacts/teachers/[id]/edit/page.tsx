"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { Teacher } from "@/types";
import { ArrowLeft, Info } from "lucide-react";
import { teachersAPI } from "@/lib/api/teachers";
import { useUser, useSelectedScope, useToken } from "@/store/auth";


interface EditTeacherPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTeacherPage({ params }: EditTeacherPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const user = useUser();
  const selectedScope = useSelectedScope();
  const token = useToken();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!user || !selectedScope || !token) return;
      
      try {
        setLoading(true);
        
        // Update API token to match current user context
        teachersAPI.updateToken(token);
        
        const result = await teachersAPI.getTeacher(resolvedParams.id);
        setTeacher(result.data);
      } catch (error) {
        console.error("Error fetching teacher:", error);
        setTeacher(null);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchTeacher();
    }
  }, [resolvedParams.id, user, selectedScope, token]);

  const handleSubmit = async (teacherData: Omit<Teacher, "id" | "createdAt" | "updatedAt">) => {
    if (!token) return;
    
    try {
      setSubmitting(true);
      
      // Ensure API has the latest token
      teachersAPI.updateToken(token);
      
      await teachersAPI.updateTeacher(resolvedParams.id, teacherData);
      router.push(`/contacts/teachers/${resolvedParams.id}`);
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Failed to update teacher. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/contacts/teachers/${resolvedParams.id}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading teacher details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!teacher) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Teacher not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/contacts/teachers/${resolvedParams.id}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Teacher
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Contacts", href: "/contacts" },
            { label: "Teachers", href: "/contacts/teachers" },
            { label: `${teacher.firstName} ${teacher.lastName}`, href: `/contacts/teachers/${resolvedParams.id}` },
            { label: "Edit", href: `/contacts/teachers/${resolvedParams.id}/edit` },
          ]}
        />

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Edit Teacher</h3>
              <p className="text-sm text-blue-700 mt-1">
                Update the teacher's information below. All fields marked with * are required.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <TeacherForm
            teacher={teacher}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
