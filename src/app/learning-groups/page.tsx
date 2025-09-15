"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { LearningGroup } from "@/types";
import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, Users, Clock, BookOpen, Euro, MapPin, Calendar, User } from "lucide-react";
import { useUser } from "@/store/auth";
import { getLearningGroups, deleteLearningGroup, LearningGroupsFilters } from "@/lib/api/learning-groups";

// Helper function to get program name from program object
const getProgramName = (program: any): string => {
  return program?.name || 'Unknown Program';
};

// Helper function to get teacher name from teacher object
const getTeacherName = (teacher: any): string => {
  if (!teacher) return 'Unknown Teacher';
  return `${teacher.firstName} ${teacher.lastName}`;
};


// Helper function to format schedule
const formatSchedule = (schedule: LearningGroup["schedule"]): string => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return schedule.map(s => `${dayNames[s.dayOfWeek]} ${s.startTime}-${s.endTime}`).join(", ");
};

// Helper function to get payment status color
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "partial":
      return "bg-yellow-100 text-yellow-800";
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function LearningGroupsPage() {
  const router = useRouter();
  const user = useUser();
  const [data, setData] = useState<LearningGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Only LC users can create learning groups
  const canCreateLearningGroup = user?.role === "LC";

  // Fetch learning groups from API
  const fetchLearningGroups = async (filters: LearningGroupsFilters = {}) => {
    try {
      setLoading(true);
      const response = await getLearningGroups({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      setData(response.learningGroups);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching learning groups:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningGroups();
  }, []);

  // Column definitions with access to router
  const columns: Column<LearningGroup>[] = [
    {
      key: "name",
      label: "Group Name",
      sortable: true,
      searchable: true,
      filterable: true,
      render: (value, row) => (
        <div>
          <button
            onClick={() => router.push(`/learning-groups/${row.id}`)}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
          >
            {value}
          </button>
          <div className="text-sm text-gray-500">{row.description}</div>
          <div className="text-xs text-blue-600 mt-1">
            {getProgramName((row as any).program)}
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
        completed: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800",
      };
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {value}
        </span>
      );
    },
  },
  {
    key: "dates",
    label: "Dates",
    sortable: false,
    render: (value, row) => (
      <div className="text-sm">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
          <span>{new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}</span>
        </div>
      </div>
    ),
  },
  {
    key: "teacherId",
    label: "Teacher",
    sortable: true,
    render: (value, row) => (
      <div className="flex items-center text-sm">
        <User className="h-4 w-4 mr-1 text-gray-400" />
        <span>{getTeacherName((row as any).teacher)}</span>
      </div>
    ),
  },
  {
    key: "schedule",
    label: "Schedule",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1 text-gray-400" />
          <span className="truncate max-w-32">{formatSchedule(value)}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <MapPin className="h-3 w-3 mr-1 inline" />
          Location
        </div>
      </div>
    ),
  },
  {
    key: "students",
    label: "Students",
    sortable: false,
    render: (value, row) => {
      const students = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1 text-gray-400" />
            <span>{students.length}/{row.maxStudents}</span>
          </div>
          <div className="text-xs text-gray-500">
            {students.filter((s: any) => s.paymentStatus === "paid").length} paid
          </div>
        </div>
      );
    },
  },
  {
    key: "pricingSnapshot",
    label: "Pricing",
    sortable: true,
    render: (value) => (
      <div className="text-sm">
        <div className="flex items-center font-medium">
          <Euro className="h-4 w-4 mr-1 text-gray-400" />
          <span>€{value.coursePrice}</span>
        </div>
        {value.pricingModel === "installments" && value.numberOfPayments && (
          <div className="text-xs text-blue-600">
            {value.numberOfPayments} payments
          </div>
        )}
        {value.pricingModel === "per_month" && value.pricePerMonth && (
          <div className="text-xs text-green-600">
            €{value.pricePerMonth}/month
          </div>
        )}
      </div>
    ),
  },
  {
    key: "franchisee",
    label: "Franchisee",
    sortable: false,
    render: (value, row) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{(row as any).lc?.name || 'Unknown LC'}</div>
        <div className="text-xs text-gray-500">{(row as any).lc?.code || ''}</div>
      </div>
    ),
  },
];

  const handleRowAction = async (action: string, row: LearningGroup) => {
    console.log(`${action} action for learning group:`, row);
    
    switch (action) {
      case "view":
        router.push(`/learning-groups/${row.id}`);
        break;
      case "edit":
        router.push(`/learning-groups/${row.id}/edit`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${row.name}?`)) {
          try {
            await deleteLearningGroup(row.id.toString());
            // Refresh the data
            fetchLearningGroups();
          } catch (error) {
            console.error('Error deleting learning group:', error);
            // You might want to show a toast notification here
          }
        }
        break;
    }
  };

  const handleBulkAction = async (action: string, rows: LearningGroup[]) => {
    console.log(`${action} action for ${rows.length} learning groups:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} learning groups?`)) {
          try {
            // Delete all selected learning groups
            await Promise.all(rows.map(row => deleteLearningGroup(row.id.toString())));
            // Refresh the data
            fetchLearningGroups();
          } catch (error) {
            console.error('Error deleting learning groups:', error);
            // You might want to show a toast notification here
          }
        }
        break;
    }
  };

  const handleExport = (rows: LearningGroup[]) => {
    const exportColumns = [
      { key: "name", label: "Group Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" },
      { key: "teacher", label: "Teacher" },
      { key: "location", label: "Location" },
      { key: "maxStudents", label: "Max Students" },
      { key: "pricingSnapshot.coursePrice", label: "Course Price" },
      { key: "lc.name", label: "Learning Center" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("learning-groups"),
    });
  };

  const handleAddGroup = () => {
    router.push("/learning-groups/new");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Groups</h1>
            <p className="text-gray-600">Manage learning groups and student enrollments</p>
          </div>
          {canCreateLearningGroup && (
            <button 
              onClick={handleAddGroup}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Learning Group
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
            loading={loading}
            emptyMessage="No learning groups found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}