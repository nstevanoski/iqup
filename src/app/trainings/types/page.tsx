"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser } from "@/store/auth";
import { TrainingType } from "@/types";
import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, BookOpenCheck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleTrainingTypes: TrainingType[] = [
  {
    id: "tt_1",
    name: "Teaching Methodology",
    description: "Modern teaching techniques and classroom management",
    category: "Pedagogy",
    duration: 8,
    prerequisites: ["Teaching experience", "Bachelor's degree"],
    objectives: ["Classroom management", "Student engagement", "Assessment techniques"],
    materials: ["Presentation slides", "Handouts", "Videos"],
    isRecurring: true,
    frequency: "monthly",
    recordType: "mandatory",
    seminarType: "in_person",
    createdBy: "user_1",
    isActive: true,
    requirements: ["Teaching experience", "Bachelor's degree"],
    certification: {
      required: true,
      validityPeriod: 24,
      renewalRequired: true,
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "tt_2",
    name: "Technology Integration",
    description: "Using technology effectively in education",
    category: "Technology",
    duration: 6,
    prerequisites: ["Basic computer skills"],
    objectives: ["Digital tools", "Online platforms", "Interactive content"],
    materials: ["Laptop", "Software licenses", "Tutorials"],
    isRecurring: false,
    recordType: "optional",
    seminarType: "virtual",
    createdBy: "user_1",
    isActive: true,
    requirements: ["Basic computer skills"],
    certification: {
      required: false,
      validityPeriod: 12,
      renewalRequired: false,
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "tt_3",
    name: "Advanced Assessment Techniques",
    description: "Comprehensive training on modern assessment methods",
    category: "Assessment",
    duration: 4,
    prerequisites: ["Teaching Methodology certification"],
    objectives: ["Formative assessment", "Summative assessment", "Rubric design"],
    materials: ["Assessment templates", "Sample rubrics", "Case studies"],
    isRecurring: true,
    frequency: "quarterly",
    recordType: "certification",
    seminarType: "hybrid",
    createdBy: "user_1",
    isActive: true,
    requirements: ["Teaching Methodology certification"],
    certification: {
      required: true,
      validityPeriod: 36,
      renewalRequired: true,
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// Helper function to get record type color
const getRecordTypeColor = (type: string) => {
  switch (type) {
    case "mandatory":
      return "bg-red-100 text-red-800";
    case "optional":
      return "bg-blue-100 text-blue-800";
    case "certification":
      return "bg-purple-100 text-purple-800";
    case "workshop":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get seminar type color
const getSeminarTypeColor = (type: string) => {
  switch (type) {
    case "in_person":
      return "bg-blue-100 text-blue-800";
    case "virtual":
      return "bg-green-100 text-green-800";
    case "hybrid":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Column definitions
const getColumns = (): Column<TrainingType>[] => [
  {
    key: "name",
    label: "Training Type",
    sortable: true,
    searchable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{row.description}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecordTypeColor(row.recordType)}`}>
            {row.recordType}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeminarTypeColor(row.seminarType)}`}>
            {row.seminarType.replace(/_/g, " ")}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "category",
    label: "Category",
    sortable: true,
    filterable: true,
    render: (value) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {value}
      </span>
    ),
  },
  {
    key: "duration",
    label: "Duration",
    sortable: true,
    render: (value) => (
      <div className="flex items-center text-sm">
        <Clock className="h-4 w-4 mr-1 text-gray-400" />
        <span>{value} hours</span>
      </div>
    ),
  },
  {
    key: "prerequisites",
    label: "Prerequisites",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((prereq: string, index: number) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {prereq}
              </span>
            ))}
            {value.length > 2 && (
              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{value.length - 2} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">None</span>
        )}
      </div>
    ),
  },
  {
    key: "certification",
    label: "Certification",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        {value.required ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Required</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Optional</span>
          </div>
        )}
        {value.required && (
          <div className="text-xs text-gray-500 mt-1">
            Valid for {value.validityPeriod} months
          </div>
        )}
      </div>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (value) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    key: "isRecurring",
    label: "Recurring",
    sortable: true,
    render: (value, row) => (
      <div className="text-sm">
        {value ? (
          <div>
            <span className="text-green-600">Yes</span>
            {row.frequency && (
              <div className="text-xs text-gray-500 capitalize">{row.frequency}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-500">No</span>
        )}
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (value) => (
      <span className="text-sm text-gray-500">
        {new Date(value).toLocaleDateString()}
      </span>
    ),
  },
];

export default function TrainingTypesPage() {
  const router = useRouter();
  const user = useUser();
  const [data, setData] = useState<TrainingType[]>(sampleTrainingTypes);
  const [loading, setLoading] = useState(false);

  // Only HQ users can access this page
  if (user?.role !== "HQ") {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Access Denied
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Only HQ users can manage training types.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const columns = getColumns();

  const handleRowAction = (action: string, row: TrainingType) => {
    console.log(`${action} action for training type:`, row);
    
    switch (action) {
      case "view":
        router.push(`/trainings/types/${row.id}`);
        break;
      case "edit":
        router.push(`/trainings/types/${row.id}/edit`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete training type ${row.name}?`)) {
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
      case "toggle-status":
        setData(prev => prev.map(type => 
          type.id === row.id 
            ? { ...type, isActive: !type.isActive, updatedAt: new Date() }
            : type
        ));
        break;
    }
  };

  const handleBulkAction = (action: string, rows: TrainingType[]) => {
    console.log(`${action} action for ${rows.length} training types:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} training types?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
      case "activate":
        setData(prev => prev.map(type => 
          rows.some(row => row.id === type.id)
            ? { ...type, isActive: true, updatedAt: new Date() }
            : type
        ));
        break;
      case "deactivate":
        setData(prev => prev.map(type => 
          rows.some(row => row.id === type.id)
            ? { ...type, isActive: false, updatedAt: new Date() }
            : type
        ));
        break;
    }
  };

  const handleExport = (rows: TrainingType[]) => {
    const exportColumns = [
      { key: "name", label: "Name" },
      { key: "description", label: "Description" },
      { key: "category", label: "Category" },
      { key: "duration", label: "Duration (hours)" },
      { key: "recordType", label: "Record Type" },
      { key: "seminarType", label: "Seminar Type" },
      { key: "isActive", label: "Status" },
      { key: "isRecurring", label: "Recurring" },
      { key: "frequency", label: "Frequency" },
      { key: "certification.required", label: "Certification Required" },
      { key: "certification.validityPeriod", label: "Validity Period (months)" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("training-types"),
    });
  };

  const handleCreateTrainingType = () => {
    router.push("/trainings/types/new");
  };

  const activeCount = data.filter(type => type.isActive).length;
  const inactiveCount = data.filter(type => !type.isActive).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training Types</h1>
            <p className="text-gray-600">Manage training type templates and configurations.</p>
          </div>
          <button 
            onClick={handleCreateTrainingType}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Training Type
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenCheck className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Types</p>
                <p className="text-2xl font-semibold text-gray-900">{data.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inactive</p>
                <p className="text-2xl font-semibold text-gray-900">{inactiveCount}</p>
              </div>
            </div>
          </div>
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
            loading={loading}
            emptyMessage="No training types found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
