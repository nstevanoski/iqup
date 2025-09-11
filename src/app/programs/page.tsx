"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope } from "@/store/auth";
import { Program } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Edit, Trash2, Users, Clock, BookOpen } from "lucide-react";

// Sample data - in a real app, this would come from an API
const samplePrograms: Program[] = [
  {
    id: "1",
    name: "English Language Program",
    description: "Comprehensive English language learning program for all levels",
    status: "active",
    category: "Language",
    duration: 24,
    price: 299.99,
    maxStudents: 100,
    currentStudents: 45,
    requirements: ["Basic reading skills", "Age 16+"],
    learningObjectives: ["Fluency in English", "Grammar mastery", "Conversational skills"],
    createdBy: "user_1",
    hours: 120,
    lessonLength: 60,
    kind: "academic",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Mathematics Program",
    description: "Advanced mathematics curriculum covering algebra, calculus, and statistics",
    status: "active",
    category: "STEM",
    duration: 36,
    price: 399.99,
    maxStudents: 80,
    currentStudents: 32,
    requirements: ["High school diploma", "Basic math skills"],
    learningObjectives: ["Advanced problem solving", "Mathematical reasoning", "Statistical analysis"],
    createdBy: "user_1",
    hours: 180,
    lessonLength: 90,
    kind: "academic",
    sharedWithMFs: ["mf_region_1"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Digital Marketing Workshop",
    description: "Intensive workshop on digital marketing strategies and tools",
    status: "active",
    category: "Business",
    duration: 8,
    price: 199.99,
    maxStudents: 30,
    currentStudents: 15,
    requirements: ["Basic computer skills", "Marketing interest"],
    learningObjectives: ["Social media marketing", "SEO basics", "Analytics"],
    createdBy: "user_1",
    hours: 40,
    lessonLength: 120,
    kind: "workshop",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "4",
    name: "Computer Science Program",
    description: "Modern computer science curriculum with programming and software development",
    status: "draft",
    category: "Technology",
    duration: 48,
    price: 499.99,
    maxStudents: 50,
    currentStudents: 0,
    requirements: ["Basic computer skills", "Logical thinking"],
    learningObjectives: ["Programming proficiency", "Software development", "System design"],
    createdBy: "user_1",
    hours: 240,
    lessonLength: 120,
    kind: "certification",
    sharedWithMFs: [],
    visibility: "private",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-25"),
  },
];

// Helper function to get MF scope names
const getMFScopeNames = (scopeIds: string[]): string[] => {
  const scopeMap: Record<string, string> = {
    "mf_region_1": "Region 1",
    "mf_region_2": "Region 2",
  };
  return scopeIds.map(id => scopeMap[id] || id);
};

// Column definitions
const getColumns = (userRole: string, canEdit: boolean, onNameClick: (row: Program) => void): Column<Program>[] => {
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
              Shared with: {getMFScopeNames(row.sharedWithMFs).join(", ")}
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
  const [data, setData] = useState<Program[]>(samplePrograms);
  const [loading, setLoading] = useState(false);

  // Filter data based on user role and scope
  useEffect(() => {
    if (!user || !selectedScope) return;

    let filteredPrograms = samplePrograms;

    if (user.role === "MF" || user.role === "LC") {
      // MF can see programs shared with their own MF scope
      // LC inherits visibility from its parent MF
      const allowedMfIds = new Set<string>();
      if (user.role === "MF") {
        allowedMfIds.add(selectedScope.id);
      } else {
        // LC users can see programs - in a real app, this would get the parent MF from the backend
        // For now, we'll allow LC users to see public and their own shared programs
        allowedMfIds.add(selectedScope.id);
      }

      filteredPrograms = samplePrograms.filter(p =>
        p.visibility === "public" ||
        (p.visibility === "shared" && p.sharedWithMFs.some((mfId) => allowedMfIds.has(mfId)))
      );
    } else if (user.role === "TT") {
      // TT can only see public programs
      filteredPrograms = samplePrograms.filter(p => p.visibility === "public");
    }
    // HQ can see all programs (no filtering)

    setData(filteredPrograms);
  }, [user, selectedScope]);

  const canEdit = user?.role === "HQ";
  const columns = getColumns(user?.role || "", canEdit, (row) => router.push(`/programs/${row.id}`));

  const handleRowAction = (action: string, row: Program) => {
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
            setData(prev => prev.filter(item => item.id !== row.id));
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
