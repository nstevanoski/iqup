"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope } from "@/store/auth";
import { SubProgram } from "@/types";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Edit, Trash2, Users, Clock, BookOpen, DollarSign, CreditCard, Calendar } from "lucide-react";
import { getSubPrograms, deleteSubProgram } from "@/lib/api/subprograms";
import { DeleteConfirmationModal } from "@/components/ui";


// Helper function to get LC scope names
const getLCScopeNames = (scopeIds: string[]): string[] => {
  const scopeMap: Record<string, string> = {
    "lc_region_1": "LC Region 1",
    "lc_region_2": "LC Region 2",
  };
  return scopeIds.map(id => scopeMap[id] || id);
};

// Helper function to get program name
const getProgramName = (programId: string): string => {
  const programMap: Record<string, string> = {
    "prog_1": "English Language Program",
    "prog_2": "Mathematics Program",
    "prog_3": "Digital Marketing Workshop",
    "prog_4": "Computer Science Program",
  };
  return programMap[programId] || programId;
};

// Helper function to format pricing
const formatPricing = (subProgram: SubProgram): string => {
  switch (subProgram.pricingModel) {
    case "one-time":
      return `$${subProgram.coursePrice}`;
    case "installments":
      const paymentAmount = subProgram.coursePrice / (subProgram.numberOfPayments || 1);
      return `$${paymentAmount.toFixed(2)} × ${subProgram.numberOfPayments} payments`;
    case "subscription":
      return `$${subProgram.pricePerMonth}/month`;
    default:
      return `$${subProgram.coursePrice}`;
  }
};

// Column definitions
const getColumns = (userRole: string, canEdit: boolean, onNameClick: (row: SubProgram) => void): Column<SubProgram>[] => {
  const baseColumns: Column<SubProgram>[] = [
    {
      key: "name",
      label: "SubProgram Name",
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
          <div className="text-xs text-blue-600 mt-1">
            {getProgramName(row.programId)}
          </div>
        </div>
      ),
    },
    {
      key: "pricingModel",
      label: "Pricing Model",
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "one-time" ? "bg-green-100 text-green-800" :
            value === "installments" ? "bg-blue-100 text-blue-800" :
            "bg-purple-100 text-purple-800"
          }`}>
            {value}
          </span>
          <div className="text-sm font-medium text-gray-900">
            {formatPricing(row)}
          </div>
        </div>
      ),
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
      key: "duration",
      label: "Duration",
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          {value} weeks
        </div>
      ),
    },
    {
      key: "coursePrice",
      label: "Course Price",
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-sm font-medium">
          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
          ${value}
        </div>
      ),
    },
  ];

  // Add visibility column for MF and HQ users
  if (userRole === "MF" || userRole === "HQ") {
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
          {value === "shared" && row.sharedWithLCs.length > 0 && (
            <div className="text-xs text-gray-500">
              Shared with: {getLCScopeNames(row.sharedWithLCs).join(", ")}
            </div>
          )}
        </div>
      ),
    });
  }

  return baseColumns;
};

export default function SubProgramsPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [data, setData] = useState<SubProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  const [subProgramToDelete, setSubProgramToDelete] = useState<SubProgram | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to fetch subprograms with current parameters
  const fetchSubPrograms = useCallback(async (params: {
    page?: number;
    search?: string;
    status?: string;
    programId?: string;
    pricingModel?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isSearch?: boolean;
  } = {}) => {
    if (!user || !selectedScope) return;

    try {
      if (params.isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await getSubPrograms({
        page: params.page || currentPage,
        limit: 10, // Use pageSize from DataTable
        search: params.search || searchTerm,
        status: params.status || filters.status || '',
        programId: params.programId || filters.programId || '',
        pricingModel: params.pricingModel || filters.pricingModel || '',
        sortBy: params.sortBy || sortBy,
        sortOrder: params.sortOrder || sortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError('Failed to fetch subprograms');
      }
    } catch (err) {
      console.error('Error fetching subprograms:', err);
      setError('Failed to fetch subprograms');
    } finally {
      if (params.isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [user, selectedScope]);

  // Initial fetch - only when user or selectedScope changes
  useEffect(() => {
    fetchSubPrograms();
  }, [user, selectedScope, fetchSubPrograms]);

  // Backend search handlers
  const handleSearch = useCallback(async (term: string) => {
    if (!user || !selectedScope) return;
    
    setSearchTerm(term);
    setCurrentPage(1);
    setSearchLoading(true);
    setError(null);

    try {
      const response = await getSubPrograms({
        page: 1,
        limit: 10,
        search: term,
        status: filters.status || '',
        programId: filters.programId || '',
        pricingModel: filters.pricingModel || '',
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError('Failed to fetch subprograms');
      }
    } catch (err) {
      console.error('Error fetching subprograms:', err);
      setError('Failed to fetch subprograms');
    } finally {
      setSearchLoading(false);
    }
  }, [user, selectedScope, filters, sortBy, sortOrder]);

  const handleFilter = useCallback(async (newFilters: Record<string, string>) => {
    if (!user || !selectedScope) return;
    
    setFilters(newFilters);
    setCurrentPage(1);
    setSearchLoading(true);
    setError(null);

    try {
      const response = await getSubPrograms({
        page: 1,
        limit: 10,
        search: searchTerm,
        status: newFilters.status || '',
        programId: newFilters.programId || '',
        pricingModel: newFilters.pricingModel || '',
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError('Failed to fetch subprograms');
      }
    } catch (err) {
      console.error('Error fetching subprograms:', err);
      setError('Failed to fetch subprograms');
    } finally {
      setSearchLoading(false);
    }
  }, [user, selectedScope, searchTerm, sortBy, sortOrder]);

  const handleSort = useCallback(async (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    if (!user || !selectedScope) return;
    
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    setSearchLoading(true);
    setError(null);

    try {
      const response = await getSubPrograms({
        page: 1,
        limit: 10,
        search: searchTerm,
        status: filters.status || '',
        programId: filters.programId || '',
        pricingModel: filters.pricingModel || '',
        sortBy: newSortBy,
        sortOrder: newSortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError('Failed to fetch subprograms');
      }
    } catch (err) {
      console.error('Error fetching subprograms:', err);
      setError('Failed to fetch subprograms');
    } finally {
      setSearchLoading(false);
    }
  }, [user, selectedScope, searchTerm, filters]);

  const handlePageChange = useCallback(async (page: number) => {
    if (!user || !selectedScope) return;
    
    setCurrentPage(page);
    setSearchLoading(true);
    setError(null);

    try {
      const response = await getSubPrograms({
        page,
        limit: 10,
        search: searchTerm,
        status: filters.status || '',
        programId: filters.programId || '',
        pricingModel: filters.pricingModel || '',
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError('Failed to fetch subprograms');
      }
    } catch (err) {
      console.error('Error fetching subprograms:', err);
      setError('Failed to fetch subprograms');
    } finally {
      setSearchLoading(false);
    }
  }, [user, selectedScope, searchTerm, filters, sortBy, sortOrder]);

  const canEdit = user?.role === "MF";
  const canView = user?.role === "MF" || user?.role === "LC" || user?.role === "HQ";
  const columns = getColumns(user?.role || "", canEdit, (row) => router.push(`/subprograms/${row.id}`));

  const handleRowAction = async (action: string, row: SubProgram) => {
    console.log(`${action} action for subprogram:`, row);
    
    switch (action) {
      case "view":
        router.push(`/subprograms/${row.id}`);
        break;
      case "edit":
        if (canEdit) {
          router.push(`/subprograms/${row.id}/edit`);
        } else {
          alert("You don't have permission to edit subprograms");
        }
        break;
      case "delete":
        if (canEdit) {
          setSubProgramToDelete(row);
          setDeleteModalOpen(true);
        } else {
          alert("You don't have permission to delete subprograms");
        }
        break;
    }
  };

  const handleBulkAction = async (action: string, rows: SubProgram[]) => {
    if (!canEdit) {
      alert("You don't have permission to perform bulk actions");
      return;
    }
    
    console.log(`${action} action for ${rows.length} subprograms:`, rows);
    
    switch (action) {
      case "delete":
        // For bulk delete, we'll use a single subprogram object to represent the bulk operation
        const bulkDeleteSubProgram: SubProgram = {
          id: 'bulk',
          name: `${rows.length} subprograms`,
          description: `This will delete ${rows.length} selected subprograms`,
        } as SubProgram;
        setSubProgramToDelete(bulkDeleteSubProgram);
        setDeleteModalOpen(true);
        break;
    }
  };

  const handleConfirmDelete = async () => {
    if (!subProgramToDelete) return;

    setIsDeleting(true);
    try {
      if (subProgramToDelete.id === 'bulk') {
        // Handle bulk delete - this is a simplified version
        // In a real implementation, you'd want to call a bulk delete API
        alert("Bulk delete functionality would be implemented here");
        setDeleteModalOpen(false);
        setSubProgramToDelete(null);
      } else {
        // Handle single subprogram delete
        const response = await deleteSubProgram(subProgramToDelete.id);
        if (response.success) {
          setData(prev => prev.filter(item => item.id !== subProgramToDelete.id));
          setDeleteModalOpen(false);
          setSubProgramToDelete(null);
        } else {
          alert('Failed to delete subprogram');
        }
      }
    } catch (err) {
      console.error('Error deleting subprogram:', err);
      alert('Failed to delete subprogram');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setSubProgramToDelete(null);
    }
  };

  const handleExport = (rows: SubProgram[]) => {
    const exportColumns = [
      { key: "name", label: "SubProgram Name" },
      { key: "description", label: "Description" },
      { key: "programId", label: "Program ID" },
      { key: "pricingModel", label: "Pricing Model" },
      { key: "coursePrice", label: "Course Price" },
      { key: "numberOfPayments", label: "Number of Payments" },
      { key: "gap", label: "Payment Gap (days)" },
      { key: "pricePerMonth", label: "Price Per Month" },
      { key: "status", label: "Status" },
      { key: "duration", label: "Duration (weeks)" },
      { key: "visibility", label: "Visibility" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("subprograms"),
    });
  };

  if (!canView) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to view subprograms.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SubPrograms</h1>
            <p className="text-gray-600">
              {user?.role === "MF" 
                ? "Create, edit, and manage subprograms and courses" 
                : user?.role === "LC"
                ? "View available subprograms and courses"
                : "View all subprograms and courses (read-only)"}
            </p>
          </div>
          {canEdit && (
            <button 
              onClick={() => router.push("/subprograms/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add SubProgram
            </button>
          )}
        </div>

        {/* Role-based info */}
        {user?.role !== "MF" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  {user?.role === "LC" 
                    ? "Shared SubPrograms" 
                    : "All SubPrograms"}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {user?.role === "LC"
                    ? `You can view subprograms shared with ${selectedScope?.name || "your scope"}.`
                    : "You have read-only access to all subprograms."}
                </p>
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
            emptyMessage="No subprograms found"
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
        itemName={subProgramToDelete?.name}
        isLoading={isDeleting}
        title="Delete SubProgram"
        description={
          subProgramToDelete?.id === 'bulk' 
            ? `Are you sure you want to delete ${subProgramToDelete.name}? This action cannot be undone.`
            : undefined
        }
      />
    </DashboardLayout>
  );
}