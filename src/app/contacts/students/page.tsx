"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope } from "@/store/auth";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Edit, Trash2, DollarSign, Award } from "lucide-react";
import { Student } from "@/types";
import { getStudents, deleteStudent, convertStudentToListItem, StudentListItem, studentsAPI } from "@/lib/api/students";
import { useToken } from "@/store/auth";

// Remove duplicate interface - now imported from API client

// No more mock data - using real API only

// Helper function now imported from API client

// Column definitions
const columns: Column<StudentListItem>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    searchable: true,
    filterable: true,
    render: (_, row) => (
      <div>
        <Link href={`/contacts/students/${row.id}`} className="font-medium text-blue-600 hover:underline">
          {row.firstName} {row.lastName}
        </Link>
      </div>
    ),
  },
  {
    key: "phone",
    label: "Parent Phone",
    sortable: true,
    filterable: true,
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
        graduated: "bg-blue-100 text-blue-800",
        suspended: "bg-red-100 text-red-800",
      };
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {value}
        </span>
      );
    },
  },
];

export default function StudentsPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const token = useToken();
  const [data, setData] = useState<StudentListItem[]>([]);
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

  // Function to fetch students with current parameters
  const fetchStudents = useCallback(async (params: {
    page?: number;
    search?: string;
    status?: string;
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
      studentsAPI.updateToken(token);

      const response = await getStudents({
        page: params.page || currentPage,
        limit: 10, // Use pageSize from DataTable
        search: params.search || searchTerm,
        status: params.status || filters.status || '',
        sortBy: params.sortBy || sortBy,
        sortOrder: params.sortOrder || sortOrder,
      });

      if (response.success) {
        setData(response.data.students.map(convertStudentToListItem));
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        setError("Failed to fetch students");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch students");
    } finally {
      if (params.isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [user, selectedScope, token, currentPage, searchTerm, filters, sortBy, sortOrder]);

  // Initial fetch - only when user, selectedScope, or token changes
  useEffect(() => {
    fetchStudents();
  }, [user, selectedScope, token, fetchStudents]);

  // Backend search handlers
  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchStudents({ search, page: 1, isSearch: true });
  }, [fetchStudents]);

  const handleFilter = useCallback((newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchStudents({ 
      ...newFilters,
      page: 1, 
      isSearch: true 
    });
  }, [fetchStudents]);

  const handleSort = useCallback((sortKey: string, sortDirection: 'asc' | 'desc') => {
    setSortBy(sortKey);
    setSortOrder(sortDirection);
    setCurrentPage(1);
    fetchStudents({ 
      sortBy: sortKey, 
      sortOrder: sortDirection, 
      page: 1, 
      isSearch: true 
    });
  }, [fetchStudents]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchStudents({ page, isSearch: true });
  }, [fetchStudents]);

  const handleRowAction = async (action: string, row: StudentListItem) => {
    console.log(`${action} action for student:`, row);
    
    switch (action) {
      case "view":
        router.push(`/contacts/students/${row.id}`);
        break;
      case "edit":
        router.push(`/contacts/students/${row.id}/edit`);
        break;
      case "payments":
        router.push(`/contacts/students/${row.id}/payments`);
        break;
      case "certificates":
        router.push(`/contacts/students/${row.id}/certificates`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${row.firstName} ${row.lastName}?`)) {
          try {
            const response = await deleteStudent(row.id);
            if (response.success) {
              // Refresh the data
              fetchStudents({ page: currentPage, isSearch: true });
            } else {
              alert("Failed to delete student. Please try again.");
            }
          } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student. Please try again.");
          }
        }
        break;
    }
  };

  const handleBulkAction = async (action: string, rows: StudentListItem[]) => {
    console.log(`${action} action for ${rows.length} students:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} students?`)) {
          try {
            // Delete all selected students
            const responses = await Promise.all(rows.map(row => deleteStudent(row.id)));
            const allSuccessful = responses.every(response => response.success);
            
            if (allSuccessful) {
              // Refresh the data
              fetchStudents({ page: currentPage, isSearch: true });
            } else {
              alert("Failed to delete some students. Please try again.");
            }
          } catch (error) {
            console.error("Error deleting students:", error);
            alert("Failed to delete some students. Please try again.");
          }
        }
        break;
    }
  };

  const handleExport = (rows: StudentListItem[]) => {
    const exportColumns = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Parent Phone" },
      { key: "program", label: "Program" },
      { key: "status", label: "Status" },
      { key: "enrollmentDate", label: "Enrollment Date" },
      { key: "progress", label: "Progress (%)" },
      { key: "lastActivity", label: "Last Activity" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("students"),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">Manage student contacts and information</p>
          </div>
          {user?.role === "LC" && (
            <button 
              onClick={() => router.push("/contacts/students/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Student
            </button>
          )}
        </div>
        
        <div>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          <DataTable
            data={data}
            columns={columns}
            loading={loading && !searchLoading}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={10}
            bulkActions={true}
            rowActions={true}
            onRowAction={handleRowAction}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            backendSearch={true}
            // onSearch={handleSearch}
            // onFilter={handleFilter}
            // onSort={handleSort}
            // onPageChange={handlePageChange}
            searchLoading={searchLoading}
            emptyMessage="No students found"
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
