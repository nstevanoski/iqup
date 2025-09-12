"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope, useToken } from "@/store/auth";
import { Program } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Edit, Trash2, Users, Clock, BookOpen } from "lucide-react";
import { getPrograms, deleteProgram, programsAPI } from "@/lib/api/programs";
import { getMFAccounts, MFAccount } from "@/lib/api/accounts";


// Helper function to get MF scope names
const getMFScopeNames = (scopeIds: string[], mfAccounts: MFAccount[]): string[] => {
  const mfMap: Record<string, string> = {};
  mfAccounts.forEach(mf => {
    mfMap[mf.id.toString()] = mf.name;
  });
  return scopeIds.map(id => mfMap[id] || `MF-${id}`);
};

// Column definitions
const getColumns = (userRole: string, canEdit: boolean, onNameClick: (row: Program) => void, mfAccounts: MFAccount[]): Column<Program>[] => {
  const baseColumns: Column<Program>[] = [
    {
      key: "name",
      label: "Program Name",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          <button
            onClick={() => onNameClick(row)}
            className="font-medium text-blue-600 hover:underline cursor-pointer"
          >
            {value}
          </button>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      ),
    },
    {
      key: "kind",
      label: "Type",
      sortable: true,
      filterable: true,
      render: (value) => {
        const kindColors: Record<string, string> = {
          academic: "bg-blue-100 text-blue-800",
          worksheet: "bg-gray-100 text-gray-800",
          birthday_party: "bg-pink-100 text-pink-800",
          stem_camp: "bg-indigo-100 text-indigo-800",
          vocational: "bg-green-100 text-green-800",
          certification: "bg-purple-100 text-purple-800",
          workshop: "bg-orange-100 text-orange-800",
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${kindColors[value as keyof typeof kindColors]}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      render: (value) => {
        const statusColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-yellow-100 text-yellow-800",
          draft: "bg-gray-100 text-gray-800",
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: "hours",
      label: "Hours",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          {value}h
        </div>
      ),
    },
    {
      key: "lessonLength",
      label: "Lesson Length",
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          {value} min
        </div>
      ),
    },
    {
      key: "currentStudents",
      label: "Students",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-1 text-gray-400" />
          {value}/{row.maxStudents}
        </div>
      ),
    },
  ];

  // Add visibility column for HQ users
  if (userRole === "HQ") {
    baseColumns.push({
      key: "visibility",
      label: "Visibility",
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "public" ? "bg-green-100 text-green-800" :
            value === "shared" ? "bg-blue-100 text-blue-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {value}
          </span>
          {value === "shared" && row.sharedWithMFs.length > 0 && (
            <div className="text-xs text-gray-500">
              Shared with: {getMFScopeNames(row.sharedWithMFs, mfAccounts).join(", ")}
            </div>
          )}
        </div>
      ),
    });
  }

  return baseColumns;
};

export default function ProgramsPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const token = useToken();
  const [data, setData] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mfAccounts, setMfAccounts] = useState<MFAccount[]>([]);

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!user || !selectedScope || !token) return;

      try {
        setLoading(true);
        setError(null);

        // Update API token
        programsAPI.updateToken(token);

        const response = await getPrograms({
          userRole: user.role as 'HQ' | 'MF' | 'LC' | 'TT',
          userScope: selectedScope.id,
          page: 1,
          limit: 100, // Get all programs for now
        });

        if (response.success) {
          setData(response.data.data);
        } else {
          setError("Failed to fetch programs");
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch programs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [user, selectedScope, token]);

  // Fetch MF accounts for HQ users
  useEffect(() => {
    const fetchMFAccounts = async () => {
      if (user?.role !== "HQ" || !token) return;
      
      try {
        const response = await getMFAccounts();
        if (response.success) {
          setMfAccounts(response.data);
        }
      } catch (error) {
        console.error('Error fetching MF accounts:', error);
      }
    };

    fetchMFAccounts();
  }, [user?.role, token]);

  const canEdit = user?.role === "HQ";
  const columns = getColumns(user?.role || "", canEdit, (row) => router.push(`/programs/${row.id}`), mfAccounts);

  const handleRowAction = async (action: string, row: Program) => {
    console.log(`${action} action for program:`, row);
    
    switch (action) {
      case "view":
        router.push(`/programs/${row.id}`);
        break;
      case "edit":
        if (canEdit) {
          router.push(`/programs/${row.id}/edit`);
        } else {
          alert("You don't have permission to edit programs");
        }
        break;
      case "delete":
        if (canEdit) {
          if (confirm(`Are you sure you want to delete ${row.name}?`)) {
            try {
              setLoading(true);
              const response = await deleteProgram(row.id);
              if (response.success) {
                setData(prev => prev.filter(item => item.id !== row.id));
              } else {
                alert("Failed to delete program. Please try again.");
              }
            } catch (err) {
              console.error("Error deleting program:", err);
              alert("Failed to delete program. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        } else {
          alert("You don't have permission to delete programs");
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: Program[]) => {
    if (!canEdit) {
      alert("You don't have permission to perform bulk actions");
      return;
    }
    
    console.log(`${action} action for ${rows.length} programs:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} programs?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
    }
  };

  const handleExport = (rows: Program[]) => {
    const exportColumns = [
      { key: "name", label: "Program Name" },
      { key: "description", label: "Description" },
      { key: "kind", label: "Type" },
      { key: "status", label: "Status" },
      { key: "category", label: "Category" },
      { key: "hours", label: "Total Hours" },
      { key: "lessonLength", label: "Lesson Length (min)" },
      { key: "duration", label: "Duration (weeks)" },
      { key: "price", label: "Price" },
      { key: "maxStudents", label: "Max Students" },
      { key: "currentStudents", label: "Current Students" },
      { key: "visibility", label: "Visibility" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("programs"),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
            <p className="text-gray-600">
              {user?.role === "HQ" 
                ? "Create, edit, and manage educational programs" 
                : "View available educational programs"}
            </p>
          </div>
          {canEdit && (
            <button 
              onClick={() => router.push("/programs/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Program
            </button>
          )}
        </div>

        {/* Role-based info */}
        {user?.role !== "HQ" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  {user?.role === "MF" || user?.role === "LC" 
                    ? "Shared Programs" 
                    : "Public Programs"}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {user?.role === "MF" || user?.role === "LC"
                    ? `You can view programs shared with ${selectedScope?.name || "your scope"}.`
                    : "You can view public programs only."}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Programs
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <DataTable
            data={data}
            columns={columns}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={10}
            bulkActions={canEdit}
            rowActions={true}
            onRowAction={handleRowAction}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            loading={loading}
            emptyMessage="No programs found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
