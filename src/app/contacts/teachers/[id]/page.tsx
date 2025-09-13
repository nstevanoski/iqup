"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TeacherDetail } from "@/components/views/TeacherDetail";
import { Teacher } from "@/types";
import { ArrowLeft } from "lucide-react";
import { teachersAPI } from "@/lib/api/teachers";


interface TeacherDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TeacherDetailPage({ params }: TeacherDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
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
  }, [resolvedParams.id]);

  const handleEdit = () => {
    router.push(`/contacts/teachers/${resolvedParams.id}/edit`);
  };

  const handleDelete = async () => {
    if (!teacher) return;
    
    if (confirm(`Are you sure you want to delete ${teacher.title} ${teacher.firstName} ${teacher.lastName}?`)) {
      try {
        await teachersAPI.deleteTeacher(resolvedParams.id);
        router.push("/contacts/teachers");
      } catch (error) {
        console.error("Error deleting teacher:", error);
        alert("Failed to delete teacher. Please try again.");
      }
    }
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
            { label: `${teacher.title} ${teacher.firstName} ${teacher.lastName}`, href: `/contacts/teachers/${resolvedParams.id}` },
          ]}
        />

        {/* Teacher Detail */}
        <TeacherDetail
          teacher={teacher}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
