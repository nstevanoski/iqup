"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope, useToken } from "@/store/auth";
import { Program } from "@/types";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Edit, Trash2, Users, Clock, BookOpen } from "lucide-react";
import { getPrograms, deleteProgram, programsAPI } from "@/lib/api/programs";
import { getMFAccounts, MFAccount } from "@/lib/api/accounts";
import { DeleteConfirmationModal } from "@/components/ui";


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
  
  // Backend search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to fetch programs with current parameters
  const fetchPrograms = useCallback(async (params: {
    page?: number;
    search?: string;
    status?: string;
    category?: string;
    kind?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isSearch?: boolean;
  } = {}) => {
    if (!user || !selectedScope || !token) return;

    try {
      if (params.isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Update API token
      programsAPI.updateToken(token);

      const response = await getPrograms({
        userRole: user.role as 'HQ' | 'MF' | 'LC' | 'TT',
        userScope: selectedScope.id,
        page: params.page || currentPage,
        limit: 10, // Use pageSize from DataTable
        search: params.search || searchTerm,
        status: params.status || filters.status || '',
        category: params.category || filters.category || '',
        kind: params.kind || filters.kind || '',
        sortBy: params.sortBy || sortBy,
        sortOrder: params.sortOrder || sortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError("Failed to fetch programs");
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch programs");
    } finally {
      if (params.isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [user, selectedScope, token]);

  // Initial fetch - only when user, selectedScope, or token changes
  useEffect(() => {
    fetchPrograms();
  }, [user, selectedScope, token, fetchPrograms]);

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

  // Backend search handlers
  const handleSearch = useCallback(async (term: string) => {
    if (!user || !selectedScope || !token) return;
    
    setSearchTerm(term);
    setCurrentPage(1);
    setSearchLoading(true);
    setError(null);

    try {
      programsAPI.updateToken(token);
      const response = await getPrograms({
        userRole: user.role as 'HQ' | 'MF' | 'LC' | 'TT',
        userScope: selectedScope.id,
        page: 1,
        limit: 10,
        search: term,
        status: filters.status || '',
        category: filters.category || '',
        kind: filters.kind || '',
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError("Failed to fetch programs");
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch programs");
    } finally {
      setSearchLoading(false);
    }
  }, [user, selectedScope, token]);

  const handleFilter = useCallback(async (newFilters: Record<string, string>) => {
    if (!user || !selectedScope || !token) return;
    
    setFilters(newFilters);
    setCurrentPage(1);
    setSearchLoading(true);
    setError(null);

    try {
      programsAPI.updateToken(token);
      const response = await getPrograms({
        userRole: user.role as 'HQ' | 'MF' | 'LC' | 'TT',
        userScope: selectedScope.id,
        page: 1,
        limit: 10,
        search: searchTerm,
        status: newFilters.status || '',
        category: newFilters.category || '',
        kind: newFilters.kind || '',
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError("Failed to fetch programs");
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch programs");
    } finally {
      setSearchLoading(false);
    }
  }, [user, selectedScope, token]);

  const handleSort = useCallback(async (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    if (!user || !selectedScope || !token) return;
    
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    setSearchLoading(true);
    setError(null);

    try {
      programsAPI.updateToken(token);
      const response = await getPrograms({
        userRole: user.role as 'HQ' | 'MF' | 'LC' | 'TT',
        userScope: selectedScope.id,
        page: 1,
        limit: 10,
        search: searchTerm,
        status: filters.status || '',
        category: filters.category || '',
        kind: filters.kind || '',
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError("Failed to fetch programs");
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch programs");
    } finally {
      setSearchLoading(false);
    }
  }, [user, selectedScope, token]);

  const handlePageChange = useCallback(async (page: number) => {
    if (!user || !selectedScope || !token) return;
    
    setCurrentPage(page);
    setSearchLoading(true);
    setError(null);

    try {
      programsAPI.updateToken(token);
      const response = await getPrograms({
        userRole: user.role as 'HQ' | 'MF' | 'LC' | 'TT',
        userScope: selectedScope.id,
        page,
        limit: 10,
        search: searchTerm,
        status: filters.status || '',
        category: filters.category || '',
        kind: filters.kind || '',
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError("Failed to fetch programs");
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch programs");
    } finally {
      setSearchLoading(false);
    }
  }, [user, selectedScope, token]);

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
          setProgramToDelete(row);
          setDeleteModalOpen(true);
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
        // For bulk delete, we'll use a single program object to represent the bulk operation
        const bulkDeleteProgram: Program = {
          id: 'bulk',
          name: `${rows.length} programs`,
          description: `This will delete ${rows.length} selected programs`,
        } as Program;
        setProgramToDelete(bulkDeleteProgram);
        setDeleteModalOpen(true);
        break;
    }
  };

  const handleConfirmDelete = async () => {
    if (!programToDelete) return;

    setIsDeleting(true);
    try {
      if (programToDelete.id === 'bulk') {
        // Handle bulk delete - this is a simplified version
        // In a real implementation, you'd want to call a bulk delete API
        alert("Bulk delete functionality would be implemented here");
        setDeleteModalOpen(false);
        setProgramToDelete(null);
      } else {
        // Handle single program delete
        const response = await deleteProgram(programToDelete.id);
        if (response.success) {
          setData(prev => prev.filter(item => item.id !== programToDelete.id));
          setDeleteModalOpen(false);
          setProgramToDelete(null);
        } else {
          alert("Failed to delete program. Please try again.");
        }
      }
    } catch (err) {
      console.error("Error deleting program:", err);
      alert("Failed to delete program. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setProgramToDelete(null);
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
            rowActions={canEdit}
            onRowAction={handleRowAction}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            loading={loading}
            emptyMessage="No programs found"
            // Backend search props
            backendSearch={true}
            // onSearch={handleSearch}
            // onFilter={handleFilter}
            // onSort={handleSort}
            // onPageChange={handlePageChange}
            searchLoading={searchLoading}
            // Backend pagination info
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={programToDelete?.name}
        isLoading={isDeleting}
        title="Delete Program"
        description={
          programToDelete?.id === 'bulk' 
            ? `Are you sure you want to delete ${programToDelete.name}? This action cannot be undone.`
            : undefined
        }
      />
    </DashboardLayout>
  );
}
