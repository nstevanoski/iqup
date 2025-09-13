"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SubProgramForm } from "@/components/forms/SubProgramForm";
import { SubProgram, Program } from "@/types";
import { ArrowLeft } from "lucide-react";
import { getSubProgram, updateSubProgram, subProgramsAPI } from "@/lib/api/subprograms";
import { getPrograms, programsAPI } from "@/lib/api/programs";
import { useUser, useSelectedScope, useToken } from "@/store/auth";

interface SubProgramEditPageProps {
  params: Promise<{
    id: string;
  }>;
}


export default function SubProgramEditPage({ params }: SubProgramEditPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const user = useUser();
  const selectedScope = useSelectedScope();
  const token = useToken();
  const [subProgram, setSubProgram] = useState<SubProgram | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !selectedScope || !token) return;

      try {
        setLoading(true);
        setError(null);

        // Update API tokens
        subProgramsAPI.updateToken(token);
        programsAPI.updateToken(token);
        
        // Fetch subprogram and programs in parallel
        const [subProgramResponse, programsResponse] = await Promise.all([
          getSubProgram(resolvedParams.id),
          getPrograms({ 
            limit: 100
            // userRole and userScope parameters are deprecated - API now uses authenticated user's role and scope
          }) // Get filtered programs for the dropdown
        ]);
        
        if (subProgramResponse.success) {
          setSubProgram(subProgramResponse.data);
        } else {
          setError("SubProgram not found");
          return;
        }
        
        if (programsResponse.success) {
          setPrograms(programsResponse.data.data);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id, user, selectedScope, token]);

  const handleSubmit = async (formData: Partial<SubProgram>) => {
    try {
      setSaving(true);
      
      const response = await updateSubProgram(resolvedParams.id, formData);
      
      if (response.success) {
        // Navigate back to subprogram detail
        router.push(`/subprograms/${resolvedParams.id}`);
      } else {
        alert("Failed to update subprogram. Please try again.");
      }
    } catch (err) {
      console.error("Error updating subprogram:", err);
      alert("Failed to update subprogram. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/subprograms/${resolvedParams.id}`);
  };

  const handleBack = () => {
    router.push("/subprograms");
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

  if (error || !subProgram) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">SubProgram Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "The subprogram you're looking for doesn't exist."}
            </p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to SubPrograms
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
            { label: "SubPrograms", href: "/subprograms" },
            { label: subProgram.name, href: `/subprograms/${resolvedParams.id}` },
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
              <h1 className="text-2xl font-bold text-gray-900">Edit SubProgram</h1>
              <p className="text-gray-600">Modify subprogram details and settings</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <SubProgramForm
          subProgram={subProgram}
          programs={programs}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </DashboardLayout>
  );
}
