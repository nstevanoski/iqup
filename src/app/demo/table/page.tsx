"use client";

import { DataTable, Column } from "@/components/ui/DataTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useState } from "react";

// Sample data type
interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  status: "active" | "inactive" | "graduated";
  enrollmentDate: string;
  progress: number;
  grade: string;
}

// Sample data
const sampleData: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    program: "English Language Program",
    status: "active",
    enrollmentDate: "2024-01-15",
    progress: 75,
    grade: "A",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    program: "Mathematics Program",
    status: "active",
    enrollmentDate: "2024-01-20",
    progress: 90,
    grade: "A+",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    program: "Science Program",
    status: "graduated",
    enrollmentDate: "2023-09-01",
    progress: 100,
    grade: "A",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    program: "English Language Program",
    status: "inactive",
    enrollmentDate: "2024-02-01",
    progress: 45,
    grade: "B",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    program: "Mathematics Program",
    status: "active",
    enrollmentDate: "2024-01-10",
    progress: 60,
    grade: "B+",
  },
  {
    id: "6",
    name: "Diana Davis",
    email: "diana.davis@example.com",
    program: "Science Program",
    status: "active",
    enrollmentDate: "2024-02-15",
    progress: 80,
    grade: "A-",
  },
  {
    id: "7",
    name: "Eve Miller",
    email: "eve.miller@example.com",
    program: "English Language Program",
    status: "graduated",
    enrollmentDate: "2023-08-15",
    progress: 100,
    grade: "A+",
  },
  {
    id: "8",
    name: "Frank Garcia",
    email: "frank.garcia@example.com",
    program: "Mathematics Program",
    status: "inactive",
    enrollmentDate: "2024-01-05",
    progress: 30,
    grade: "C",
  },
  {
    id: "9",
    name: "Grace Lee",
    email: "grace.lee@example.com",
    program: "Science Program",
    status: "active",
    enrollmentDate: "2024-02-20",
    progress: 70,
    grade: "B+",
  },
  {
    id: "10",
    name: "Henry Taylor",
    email: "henry.taylor@example.com",
    program: "English Language Program",
    status: "active",
    enrollmentDate: "2024-01-25",
    progress: 85,
    grade: "A",
  },
];

// Column definitions
const columns: Column<Student>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    searchable: true,
    filterable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{row.email}</div>
      </div>
    ),
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
    label: "Enrollment Date",
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
    key: "grade",
    label: "Grade",
    sortable: true,
    render: (value) => (
      <span className="font-medium text-gray-900">{value}</span>
    ),
  },
];

export default function TableDemoPage() {
  const [data, setData] = useState<Student[]>(sampleData);

  const handleRowAction = (action: string, row: Student) => {
    console.log(`${action} action for row:`, row);
    
    switch (action) {
      case "view":
        alert(`Viewing student: ${row.name}`);
        break;
      case "edit":
        alert(`Editing student: ${row.name}`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${row.name}?`)) {
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: Student[]) => {
    console.log(`${action} action for ${rows.length} rows:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} students?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
    }
  };

  const handleExport = (rows: Student[]) => {
    const exportColumns = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "program", label: "Program" },
      { key: "status", label: "Status" },
      { key: "enrollmentDate", label: "Enrollment Date" },
      { key: "progress", label: "Progress (%)" },
      { key: "grade", label: "Grade" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("students"),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DataTable Demo</h1>
          <p className="text-gray-600">
            A comprehensive data table with pagination, filtering, search, and bulk actions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <DataTable
            data={data}
            columns={columns}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={5}
            bulkActions={true}
            rowActions={true}
            onRowAction={handleRowAction}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            emptyMessage="No students found"
          />
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Core Features</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Pagination with customizable page size</li>
                <li>• Global search across all columns</li>
                <li>• Column-specific filtering</li>
                <li>• Sortable columns</li>
                <li>• Column visibility toggle</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Actions</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Row actions (view, edit, delete)</li>
                <li>• Bulk selection and actions</li>
                <li>• CSV export functionality</li>
                <li>• Responsive design</li>
                <li>• Loading states</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
