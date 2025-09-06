"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser } from "@/store/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Edit, Trash2, DollarSign, Award } from "lucide-react";
import { Student } from "@/types";

// Student list item type for display
interface StudentListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  program: string;
  status: "active" | "inactive" | "graduated" | "suspended";
  enrollmentDate: string;
  progress: number;
  lastActivity: string;
}

// Sample data - in a real app, this would come from an API
const sampleStudents: StudentListItem[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0101",
    program: "English Language Program",
    status: "active",
    enrollmentDate: "2024-01-15",
    progress: 75,
    lastActivity: "2024-01-20",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-0201",
    program: "Mathematics Program",
    status: "active",
    enrollmentDate: "2024-01-20",
    progress: 90,
    lastActivity: "2024-01-21",
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    phone: "+1-555-0301",
    program: "Science Program",
    status: "graduated",
    enrollmentDate: "2023-09-01",
    progress: 100,
    lastActivity: "2024-01-15",
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@example.com",
    phone: "+1-555-0401",
    program: "English Language Program",
    status: "inactive",
    enrollmentDate: "2024-02-01",
    progress: 45,
    lastActivity: "2024-01-10",
  },
  {
    id: "5",
    firstName: "Charlie",
    lastName: "Wilson",
    email: "charlie.wilson@example.com",
    phone: "+1-555-0501",
    program: "Mathematics Program",
    status: "active",
    enrollmentDate: "2024-01-10",
    progress: 60,
    lastActivity: "2024-01-19",
  },
];

// Helper function to convert Student to StudentListItem
const convertStudentToListItem = (student: Student): StudentListItem => {
  return {
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    phone: student.phone || "N/A",
    program: (student.programIds && student.programIds.length > 0) ? student.programIds[0] : "N/A", // Simplified - just show first program
    status: student.status as "active" | "inactive" | "graduated" | "suspended",
    enrollmentDate: student.enrollmentDate?.toLocaleDateString() || "N/A",
    progress: Math.floor(Math.random() * 100), // Placeholder - would come from API
    lastActivity: student.updatedAt?.toLocaleDateString() || "N/A",
  };
};

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
        <div className="font-medium text-gray-900">
          {row.firstName} {row.lastName}
        </div>
        <div className="text-sm text-gray-500">{row.email}</div>
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
  const [data, setData] = useState<StudentListItem[]>(sampleStudents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/students");
        if (response.ok) {
          const result = await response.json();
          const students: Student[] = result.data || [];
          setData(students.map(convertStudentToListItem));
        } else {
          // Fallback to sample data
          setData(sampleStudents);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        // Fallback to sample data
        setData(sampleStudents);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleRowAction = (action: string, row: StudentListItem) => {
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
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: StudentListItem[]) => {
    console.log(`${action} action for ${rows.length} students:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} students?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
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
          {(user?.role === "LC" || user?.role === "MF") && (
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
