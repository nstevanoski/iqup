"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TeacherContractForm } from "@/components/forms/TeacherContractForm";
import { Teacher } from "@/types";
import { ArrowLeft } from "lucide-react";
import { teachersAPI } from "@/lib/api/teachers";
import { useUser, useSelectedScope, useToken } from "@/store/auth";

interface TeacherContractPageProps {
  params: Promise<{ id: string }>;
}

export default function TeacherContractPage({ params }: TeacherContractPageProps) {
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

  const handleSubmit = async (data: { contractFile: string; contractDate: string }) => {
    if (!teacher || !token) return;
    
    try {
      setSubmitting(true);
      
      // Update API token to match current user context
      teachersAPI.updateToken(token);
      
      // Call the contract upload API
      const response = await fetch(`/api/teachers/${resolvedParams.id}/contract`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload contract');
      }

      const result = await response.json();
      
      // Update the teacher data
      setTeacher(result.data);
      
      // Redirect back to teacher detail page
      router.push(`/contacts/teachers/${resolvedParams.id}`);
    } catch (error) {
      console.error("Error uploading contract:", error);
      alert("Failed to upload contract. Please try again.");
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

  // Check if user has permission to upload contracts (MF users only)
  if (!user || (user.role !== 'MF_ADMIN' && user.role !== 'MF_STAFF' && user.role !== 'MF')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Access denied. Only MF users can upload contracts.</div>
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
            { label: "Upload Contract", href: `/contacts/teachers/${resolvedParams.id}/contract` },
          ]}
        />

        {/* Contract Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <TeacherContractForm
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
