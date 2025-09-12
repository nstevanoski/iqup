"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope } from "@/store/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Edit, Trash2, DollarSign, Award } from "lucide-react";
import { Student } from "@/types";
import { getStudents, deleteStudent, convertStudentToListItem, StudentListItem } from "@/lib/api/students";

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
    label: "Phone",
    sortable: true,
    filterable: true,
  },
  {
    key: "program",
    label: "Program",
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
  {
    key: "enrollmentDate",
    label: "Enrolled",
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: "progress",
    label: "Progress",
    sortable: true,
    render: (value) => (
      <div className="flex items-center">
        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">{value}%</span>
      </div>
    ),
  },
  {
    key: "lastActivity",
    label: "Last Activity",
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString(),
  },
];

export default function StudentsPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [data, setData] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchStudents = async (page = 1, search = '', status = '') => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (search) params.search = search;
      if (status) params.status = status;

      const response = await getStudents(params);
      setData(response.students.map(convertStudentToListItem));
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching students:", error);
      // No fallback - show empty state
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
            await deleteStudent(row.id);
            // Refresh the data
            fetchStudents(pagination.page);
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
            await Promise.all(rows.map(row => deleteStudent(row.id)));
            // Refresh the data
            fetchStudents(pagination.page);
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
      { key: "phone", label: "Phone" },
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
          <DataTable
            data={data}
            columns={columns}
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
            emptyMessage="No students found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
