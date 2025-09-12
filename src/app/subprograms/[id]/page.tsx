"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SubProgramDetail } from "@/components/views/SubProgramDetail";
import { useUser, useSelectedScope } from "@/store/auth";
import { SubProgram, Program } from "@/types";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { getSubProgram, deleteSubProgram } from "@/lib/api/subprograms";
import { DeleteConfirmationModal } from "@/components/ui";

interface SubProgramDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}


export default function SubProgramDetailPage({ params }: SubProgramDetailPageProps) {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const resolvedParams = use(params);
  const [subProgram, setSubProgram] = useState<SubProgram | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSubProgram = async () => {
      if (!user || !selectedScope) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await getSubProgram(resolvedParams.id);
        
        if (response.success) {
          setSubProgram(response.data);
          // The program data is included in the response
          if ((response.data as any).program) {
            setProgram((response.data as any).program);
          }
        } else {
          setError("SubProgram not found");
        }
      } catch (err) {
        setError("Failed to load subprogram");
        console.error("Error fetching subprogram:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubProgram();
  }, [resolvedParams.id, user, selectedScope]);

  const handleEdit = () => {
    router.push(`/subprograms/${resolvedParams.id}/edit`);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subProgram) return;

    setIsDeleting(true);
    try {
      const response = await deleteSubProgram(subProgram.id);
      if (response.success) {
        router.push("/subprograms");
      } else {
        alert("Failed to delete subprogram. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting subprogram:", err);
      alert("Failed to delete subprogram. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
    }
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
            { label: subProgram.name }
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
              <h1 className="text-2xl font-bold text-gray-900">{subProgram.name}</h1>
              <p className="text-gray-600">{subProgram.description}</p>
            </div>
          </div>
          {user?.role === "MF" && (
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit SubProgram
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete SubProgram
              </button>
            </div>
          )}
        </div>

        {/* SubProgram Detail */}
        <SubProgramDetail subProgram={subProgram} program={program || undefined} onEdit={undefined} />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={subProgram?.name}
        isLoading={isDeleting}
        title="Delete SubProgram"
      />
    </DashboardLayout>
  );
}
