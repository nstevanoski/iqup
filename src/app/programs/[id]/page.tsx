"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProgramDetail } from "@/components/views/ProgramDetail";
import { useUser, useSelectedScope, useToken } from "@/store/auth";
import { Program } from "@/types";
import { ArrowLeft, Edit } from "lucide-react";
import { getProgram, programsAPI } from "@/lib/api/programs";

interface ProgramDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}


export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const token = useToken();
  const resolvedParams = use(params);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleEdit = () => {
    router.push(`/programs/${resolvedParams.id}/edit`);
  };

  const handleBack = () => {
    router.push("/programs");
  };

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
            { label: program.name }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
              <p className="text-gray-600">{program.description}</p>
            </div>
          </div>
          {user?.role === "HQ" && (
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Program
              </button>
            </div>
          )}
        </div>

        {/* Program Detail */}
        <ProgramDetail program={program} onEdit={undefined} />
      </div>
    </DashboardLayout>
  );
}
