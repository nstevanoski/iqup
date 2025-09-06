"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser } from "@/store/auth";
import { TeacherTrainerAccount } from "@/types";
import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, UserCheck, Users, Calendar, Award, CheckCircle, XCircle, Clock, AlertCircle, BookOpen } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleTeacherTrainers: TeacherTrainerAccount[] = [
  {
    id: "tt_1",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1-555-0101",
    role: "TT",
    status: "active",
    permissions: [
      { resource: "trainings", actions: ["read", "update"] },
      { resource: "assessments", actions: ["create", "read", "update"] },
    ],
    lastLogin: new Date("2024-01-15"),
    profile: {
      bio: "Experienced teacher trainer with 10+ years in education",
      specialization: ["Teaching Methodology", "Classroom Management", "Assessment Design"],
      experience: 10,
      qualifications: ["PhD in Education", "Master's in Curriculum Design"],
      certifications: ["Certified Teacher Trainer", "Assessment Specialist"],
      languages: ["English", "Spanish"],
      timezone: "EST",
      avatar: "/avatars/sarah-wilson.jpg",
    },
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "tt_2",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    phone: "+1-555-0102",
    role: "TT",
    status: "active",
    permissions: [
      { resource: "trainings", actions: ["read", "update"] },
      { resource: "assessments", actions: ["create", "read", "update"] },
    ],
    lastLogin: new Date("2024-01-14"),
    profile: {
      bio: "Technology integration specialist and teacher trainer",
      specialization: ["Technology Integration", "Digital Learning", "Online Teaching"],
      experience: 8,
      qualifications: ["Master's in Educational Technology", "Bachelor's in Computer Science"],
      certifications: ["Google Certified Educator", "Microsoft Innovative Educator"],
      languages: ["English", "French"],
      timezone: "PST",
    },
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "tt_3",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    phone: "+1-555-0103",
    role: "TT",
    status: "inactive",
    permissions: [
      { resource: "trainings", actions: ["read"] },
    ],
    lastLogin: new Date("2023-12-01"),
    profile: {
      bio: "Special education teacher trainer",
      specialization: ["Special Education", "Inclusive Teaching", "Behavioral Management"],
      experience: 12,
      qualifications: ["Master's in Special Education", "PhD in Educational Psychology"],
      certifications: ["Special Education Specialist", "Behavioral Analyst"],
      languages: ["English", "ASL"],
      timezone: "CST",
    },
    createdAt: new Date("2022-06-01"),
    updatedAt: new Date("2023-12-01"),
  },
];

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "suspended":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Column definitions
const getColumns = (userRole: string): Column<TeacherTrainerAccount>[] => [
  {
    key: "firstName",
    label: "Teacher Trainer",
    sortable: true,
    searchable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium text-gray-900">{value} {row.lastName}</div>
        <div className="text-sm text-gray-500">{row.email}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
            {row.status}
          </span>
          {row.lastLogin && (
            <span className="text-xs text-gray-500">
              Last login: {new Date(row.lastLogin).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "profile.specialization",
    label: "Specialization",
    sortable: false,
    render: (value, row) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">
          {row.profile?.specialization?.slice(0, 2).join(", ") || "None"}
        </div>
        {row.profile?.specialization && row.profile.specialization.length > 2 && (
          <div className="text-xs text-gray-500">+{row.profile.specialization.length - 2} more</div>
        )}
      </div>
    ),
  },
  {
    key: "profile.experience",
    label: "Experience",
    sortable: true,
    render: (value, row) => (
      <div className="text-sm">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          <span>{row.profile?.experience || 0} years</span>
        </div>
        <div className="text-xs text-gray-500">
          {row.profile?.qualifications?.length || 0} qualifications
        </div>
      </div>
    ),
  },
  {
    key: "profile.certifications",
    label: "Certifications",
    sortable: false,
    render: (value, row) => (
      <div className="text-sm">
        {row.profile?.certifications && row.profile.certifications.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.profile.certifications.slice(0, 2).map((cert: string, index: number) => (
              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {cert}
              </span>
            ))}
            {row.profile.certifications.length > 2 && (
              <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{row.profile.certifications.length - 2}
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
    key: "profile.languages",
    label: "Languages",
    sortable: false,
    render: (value, row) => (
      <div className="text-sm">
        <div className="flex flex-wrap gap-1">
          {row.profile?.languages?.map((lang: string, index: number) => (
            <span key={index} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
              {lang}
            </span>
          )) || <span className="text-gray-400">None</span>}
        </div>
      </div>
    ),
  },
  {
    key: "permissions",
    label: "Permissions",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        <div className="text-gray-900">{value.length} permission(s)</div>
        <div className="text-xs text-gray-500">
          {value.map((p: any) => p.resource).join(", ")}
        </div>
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

export default function TeacherTrainersPage() {
  const router = useRouter();
  const user = useUser();
  const [data, setData] = useState<TeacherTrainerAccount[]>(sampleTeacherTrainers);
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
                <p>Only HQ users can manage teacher trainer accounts.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const columns = getColumns(user?.role || "");

  const handleRowAction = (action: string, row: TeacherTrainerAccount) => {
    console.log(`${action} action for teacher trainer:`, row);
    
    switch (action) {
      case "view":
        router.push(`/teacher-trainers/${row.id}`);
        break;
      case "edit":
        router.push(`/teacher-trainers/${row.id}/edit`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete teacher trainer ${row.firstName} ${row.lastName}?`)) {
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
      case "toggle-status":
        const newStatus = row.status === "active" ? "inactive" : "active";
        setData(prev => prev.map(tt => 
          tt.id === row.id 
            ? { ...tt, status: newStatus, updatedAt: new Date() }
            : tt
        ));
        break;
      case "view-trainings":
        router.push(`/teacher-trainers/${row.id}/trainings`);
        break;
    }
  };

  const handleBulkAction = (action: string, rows: TeacherTrainerAccount[]) => {
    console.log(`${action} action for ${rows.length} teacher trainers:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} teacher trainers?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
      case "activate":
        setData(prev => prev.map(tt => 
          rows.some(row => row.id === tt.id)
            ? { ...tt, status: "active", updatedAt: new Date() }
            : tt
        ));
        break;
      case "deactivate":
        setData(prev => prev.map(tt => 
          rows.some(row => row.id === tt.id)
            ? { ...tt, status: "inactive", updatedAt: new Date() }
            : tt
        ));
        break;
    }
  };

  const handleExport = (rows: TeacherTrainerAccount[]) => {
    const exportColumns = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "status", label: "Status" },
      { key: "profile.experience", label: "Experience (years)" },
      { key: "profile.specialization", label: "Specialization" },
      { key: "profile.certifications", label: "Certifications" },
      { key: "profile.languages", label: "Languages" },
      { key: "lastLogin", label: "Last Login" },
      { key: "createdAt", label: "Created At" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("teacher-trainers"),
    });
  };

  const handleCreateTT = () => {
    router.push("/teacher-trainers/new");
  };

  const activeCount = data.filter(tt => tt.status === "active").length;
  const inactiveCount = data.filter(tt => tt.status === "inactive").length;
  const suspendedCount = data.filter(tt => tt.status === "suspended").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Trainers</h1>
            <p className="text-gray-600">Manage teacher trainer accounts and their training assignments.</p>
          </div>
          <button 
            onClick={handleCreateTT}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create TT Account
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total TTs</p>
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
                <XCircle className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inactive</p>
                <p className="text-2xl font-semibold text-gray-900">{inactiveCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Suspended</p>
                <p className="text-2xl font-semibold text-gray-900">{suspendedCount}</p>
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
            emptyMessage="No teacher trainers found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}