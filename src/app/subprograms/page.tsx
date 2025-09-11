"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope } from "@/store/auth";
import { SubProgram } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Edit, Trash2, Users, Clock, BookOpen, DollarSign, CreditCard, Calendar } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleSubPrograms: SubProgram[] = [
  {
    id: "1",
    programId: "prog_1",
    name: "Beginner English",
    description: "Introduction to English language basics",
    status: "active",
    order: 1,
    duration: 8,
    price: 99.99,
    prerequisites: [],
    learningObjectives: ["Basic vocabulary", "Simple grammar", "Pronunciation"],
    createdBy: "user_1",
    pricingModel: "one-time",
    coursePrice: 99.99,
    sharedWithLCs: ["lc_region_1", "lc_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    programId: "prog_1",
    name: "Intermediate English",
    description: "Intermediate English language skills",
    status: "active",
    order: 2,
    duration: 8,
    price: 99.99,
    prerequisites: ["Beginner English completion"],
    learningObjectives: ["Complex grammar", "Reading comprehension", "Writing skills"],
    createdBy: "user_1",
    pricingModel: "installments",
    coursePrice: 99.99,
    numberOfPayments: 3,
    gap: 30,
    sharedWithLCs: ["lc_region_1"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    programId: "prog_2",
    name: "Algebra Fundamentals",
    description: "Core algebraic concepts and problem solving",
    status: "active",
    order: 1,
    duration: 12,
    price: 149.99,
    prerequisites: ["Basic arithmetic"],
    learningObjectives: ["Equation solving", "Graphing", "Word problems"],
    createdBy: "user_1",
    pricingModel: "subscription",
    coursePrice: 149.99,
    pricePerMonth: 49.99,
    sharedWithLCs: ["lc_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    programId: "prog_2",
    name: "Calculus Advanced",
    description: "Advanced calculus concepts and applications",
    status: "draft",
    order: 2,
    duration: 16,
    price: 199.99,
    prerequisites: ["Algebra Fundamentals"],
    learningObjectives: ["Derivatives", "Integrals", "Applications"],
    createdBy: "user_1",
    pricingModel: "one-time",
    coursePrice: 199.99,
    sharedWithLCs: [],
    visibility: "private",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "5",
    programId: "prog_3",
    name: "Social Media Marketing",
    description: "Comprehensive social media marketing strategies",
    status: "active",
    order: 1,
    duration: 4,
    price: 79.99,
    prerequisites: ["Basic computer skills"],
    learningObjectives: ["Platform management", "Content creation", "Analytics"],
    createdBy: "user_1",
    pricingModel: "installments",
    coursePrice: 79.99,
    numberOfPayments: 2,
    gap: 14,
    sharedWithLCs: ["lc_region_1", "lc_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "6",
    programId: "prog_4",
    name: "Python Programming",
    description: "Learn Python programming from scratch",
    status: "active",
    order: 1,
    duration: 12,
    price: 299.99,
    prerequisites: ["Basic computer skills"],
    learningObjectives: ["Python syntax", "Data structures", "Algorithms"],
    createdBy: "user_1",
    pricingModel: "subscription",
    coursePrice: 299.99,
    pricePerMonth: 99.99,
    sharedWithLCs: ["lc_region_1"],
    visibility: "shared",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
  },
];

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
            className="font-medium text-blue-600 hover:underline"
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
  const [data, setData] = useState<SubProgram[]>(sampleSubPrograms);
  const [loading, setLoading] = useState(false);

  // Filter data based on user role and scope
  useEffect(() => {
    if (!user || !selectedScope) return;

    let filteredSubPrograms = sampleSubPrograms;

    if (user.role === "LC") {
      // LC can only see subprograms shared with their scope
      filteredSubPrograms = sampleSubPrograms.filter(sp => 
        sp.visibility === "public" || 
        (sp.visibility === "shared" && sp.sharedWithLCs.includes(selectedScope.id))
      );
    } else if (user.role === "TT") {
      // TT can only see public subprograms
      filteredSubPrograms = sampleSubPrograms.filter(sp => sp.visibility === "public");
    }
    // MF and HQ can see all subprograms (no filtering)

    setData(filteredSubPrograms);
  }, [user, selectedScope]);

  const canEdit = user?.role === "MF";
  const canView = user?.role === "MF" || user?.role === "LC" || user?.role === "HQ";
  const columns = getColumns(user?.role || "", canEdit, (row) => router.push(`/subprograms/${row.id}`));

  const handleRowAction = (action: string, row: SubProgram) => {
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
          if (confirm(`Are you sure you want to delete ${row.name}?`)) {
            setData(prev => prev.filter(item => item.id !== row.id));
          }
        } else {
          alert("You don't have permission to delete subprograms");
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: SubProgram[]) => {
    if (!canEdit) {
      alert("You don't have permission to perform bulk actions");
      return;
    }
    
    console.log(`${action} action for ${rows.length} subprograms:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} subprograms?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
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
            rowActions={true}
            onRowAction={handleRowAction}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            loading={loading}
            emptyMessage="No subprograms found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}