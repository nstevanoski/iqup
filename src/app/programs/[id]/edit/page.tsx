"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgramForm } from "@/components/forms/ProgramForm";
import { Program } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useUser, useSelectedScope, useToken } from "@/store/auth";
import { getProgram, updateProgram, programsAPI } from "@/lib/api/programs";

interface ProgramEditPageProps {
  params: Promise<{
    id: string;
  }>;
}


export default function ProgramEditPage({ params }: ProgramEditPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const user = useUser();
  const selectedScope = useSelectedScope();
  const token = useToken();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!user || !selectedScope || !token) return;

      try {
        setLoading(true);
        setError(null);

        // Update API token
        programsAPI.updateToken(token);

        const response = await getProgram(
          resolvedParams.id,
          user.role as 'HQ' | 'MF' | 'LC' | 'TT',
          selectedScope.id
        );

        if (response.success) {
          setProgram(response.data);
        } else {
          setError("Program not found");
        }
      } catch (err) {
        console.error("Error fetching program:", err);
        setError(err instanceof Error ? err.message : "Failed to load program");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [resolvedParams.id, user, selectedScope, token]);

  const handleSubmit = async (formData: Partial<Program>) => {
    try {
      setSaving(true);
      
      const response = await updateProgram(resolvedParams.id, formData);
      
      if (response.success) {
        // Navigate back to program detail
        router.push(`/programs/${resolvedParams.id}`);
      } else {
        alert("Failed to update program. Please try again.");
      }
    } catch (err) {
      console.error("Error updating program:", err);
      alert(err instanceof Error ? err.message : "Failed to update program. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/programs/${resolvedParams.id}`);
  };

  const handleBack = () => {
    router.push("/programs");
  };

  // HQ-only guard
  if (user?.role !== "HQ") {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">Only Head Quarters can edit programs.</p>
            <button
              onClick={() => router.push(`/programs/${resolvedParams.id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Program
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !program) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "The program you're looking for doesn't exist."}
            </p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Programs
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Programs", href: "/programs" },
            { label: program.name, href: `/programs/${resolvedParams.id}` },
            { label: "Edit" }
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Program</h1>
              <p className="text-gray-600">Modify program details and settings</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <ProgramForm
          program={program}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </DashboardLayout>
  );
}
