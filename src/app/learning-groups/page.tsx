"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { LearningGroup } from "@/types";
import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Users, Clock, BookOpen, Euro, MapPin, Calendar, User } from "lucide-react";
import { useUser } from "@/store/auth";

// Sample data - in a real app, this would come from an API
const sampleLearningGroups: LearningGroup[] = [
  {
    id: "1",
    name: "Advanced English Group A",
    description: "Advanced English conversation and writing group",
    programId: "prog_1",
    subProgramId: "sub_1",
    teacherId: "teacher_1",
    studentIds: ["student_1", "student_2"],
    maxStudents: 15,
    status: "active",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-31"),
    schedule: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "12:00" },
    ],
    location: "Main Campus",
    notes: "Focus on advanced conversation skills",
    dates: {
      startDate: "2024-02-01",
      endDate: "2024-05-31",
    },
    pricingSnapshot: {
      pricingModel: "installments",
      coursePrice: 399.98,
      numberOfPayments: 3,
      gap: 1,
      pricePerMonth: 133.33,
      pricePerSession: undefined,
    },
    owner: {
      id: "owner_1",
      name: "Sarah Wilson",
      role: "Program Director",
    },
    franchisee: {
      id: "franchisee_1",
      name: "Boston Learning Center",
      location: "Boston, MA",
    },
    students: [
      {
        studentId: "student_1",
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        productId: "product_1",
        paymentStatus: "paid",
        enrollmentDate: "2024-01-15",
      },
      {
        studentId: "student_2",
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        productId: "product_1",
        paymentStatus: "partial",
        enrollmentDate: "2024-01-20",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Calculus Study Group",
    description: "Advanced calculus problem solving group",
    programId: "prog_2",
    teacherId: "teacher_2",
    studentIds: ["student_3"],
    maxStudents: 20,
    status: "active",
    startDate: new Date("2024-02-15"),
    endDate: new Date("2024-06-15"),
    schedule: [
      { dayOfWeek: 2, startTime: "14:00", endTime: "16:00" },
      { dayOfWeek: 4, startTime: "14:00", endTime: "16:00" },
    ],
    location: "Math Building",
    dates: {
      startDate: "2024-02-15",
      endDate: "2024-06-15",
    },
    pricingSnapshot: {
      pricingModel: "one-time",
      coursePrice: 299.98,
      numberOfPayments: undefined,
      gap: undefined,
      pricePerMonth: undefined,
      pricePerSession: undefined,
    },
    owner: {
      id: "owner_2",
      name: "Michael Brown",
      role: "Mathematics Coordinator",
    },
    franchisee: {
      id: "franchisee_2",
      name: "Seattle Math Academy",
      location: "Seattle, WA",
    },
    students: [
      {
        studentId: "student_3",
        startDate: "2024-02-15",
        endDate: "2024-06-15",
        productId: "product_2",
        paymentStatus: "paid",
        enrollmentDate: "2024-02-01",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Physics Lab Group",
    description: "Hands-on physics experiments and theory",
    programId: "prog_3",
    subProgramId: "sub_3",
    teacherId: "teacher_3",
    studentIds: ["student_4"],
    maxStudents: 12,
    status: "completed",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2023-12-15"),
    schedule: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
      { dayOfWeek: 5, startTime: "10:00", endTime: "12:00" },
    ],
    location: "Physics Lab",
    notes: "Advanced physics concepts with practical experiments",
    dates: {
      startDate: "2023-09-01",
      endDate: "2023-12-15",
    },
    pricingSnapshot: {
      pricingModel: "installments",
      coursePrice: 499.98,
      numberOfPayments: 6,
      gap: 1,
      pricePerMonth: 83.33,
      pricePerSession: undefined,
    },
    owner: {
      id: "owner_3",
      name: "Emily Davis",
      role: "Physics Department Head",
    },
    franchisee: {
      id: "franchisee_3",
      name: "Austin Science Center",
      location: "Austin, TX",
    },
    students: [
      {
        studentId: "student_4",
        startDate: "2023-09-01",
        endDate: "2023-12-15",
        productId: "product_3",
        paymentStatus: "paid",
        enrollmentDate: "2023-08-20",
      },
    ],
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2023-12-15"),
  },
];

// Helper function to get program name
const getProgramName = (programId: string): string => {
  const programMap: Record<string, string> = {
    "prog_1": "English Language Program",
    "prog_2": "Mathematics Program",
    "prog_3": "Physics Program",
  };
  return programMap[programId] || programId;
};

// Helper function to get teacher name
const getTeacherName = (teacherId: string): string => {
  const teacherMap: Record<string, string> = {
    "teacher_1": "Sarah Wilson",
    "teacher_2": "Michael Brown",
    "teacher_3": "Emily Davis",
  };
  return teacherMap[teacherId] || teacherId;
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

// Column definitions
const columns: Column<LearningGroup>[] = [
  {
    key: "name",
    label: "Group Name",
    sortable: true,
    searchable: true,
    filterable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{row.description}</div>
        <div className="text-xs text-blue-600 mt-1">
          {getProgramName(row.programId)}
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
    render: (value) => (
      <div className="text-sm">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
          <span>{value.startDate} - {value.endDate}</span>
        </div>
      </div>
    ),
  },
  {
    key: "teacherId",
    label: "Teacher",
    sortable: true,
    render: (value) => (
      <div className="flex items-center text-sm">
        <User className="h-4 w-4 mr-1 text-gray-400" />
        <span>{getTeacherName(value)}</span>
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
    render: (value, row) => (
      <div className="space-y-1">
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-1 text-gray-400" />
          <span>{value.length}/{row.maxStudents}</span>
        </div>
        <div className="text-xs text-gray-500">
          {value.filter((s: any) => s.paymentStatus === "paid").length} paid
        </div>
      </div>
    ),
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
    render: (value) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{value.name}</div>
        <div className="text-xs text-gray-500">{value.location}</div>
      </div>
    ),
  },
];

export default function LearningGroupsPage() {
  const router = useRouter();
  const user = useUser();
  const [data, setData] = useState<LearningGroup[]>(sampleLearningGroups);
  const [loading, setLoading] = useState(false);

  // Only LC users can create learning groups
  const canCreateLearningGroup = user?.role === "LC";

  const handleRowAction = (action: string, row: LearningGroup) => {
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
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: LearningGroup[]) => {
    console.log(`${action} action for ${rows.length} learning groups:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} learning groups?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
    }
  };

  const handleExport = (rows: LearningGroup[]) => {
    const exportColumns = [
      { key: "name", label: "Group Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
      { key: "dates.startDate", label: "Start Date" },
      { key: "dates.endDate", label: "End Date" },
      { key: "teacherId", label: "Teacher" },
      { key: "location", label: "Location" },
      { key: "maxStudents", label: "Max Students" },
      { key: "pricingSnapshot.finalPrice", label: "Final Price" },
      { key: "franchisee.name", label: "Franchisee" },
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