"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope } from "@/store/auth";
import { Training, TrainingType } from "@/types";
import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, BookOpenCheck, Users, Calendar, MapPin, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, UserCheck } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleTrainings: Training[] = [
  {
    id: "train_1",
    title: "Teaching Methodology Workshop",
    description: "Comprehensive workshop on modern teaching techniques",
    typeId: "tt_1",
    instructorId: "teacher_1",
    participantIds: ["teacher_2", "teacher_3"],
    maxParticipants: 20,
    status: "completed",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-15"),
    duration: 8,
    location: "Conference Room A",
    materials: ["Presentation slides", "Workbooks"],
    objectives: ["Improve teaching skills", "Classroom management"],
    agenda: [
      { time: "09:00", title: "Introduction", description: "Welcome and overview", duration: 30 },
      { time: "09:30", title: "Teaching Methods", description: "Modern teaching techniques", duration: 120 },
      { time: "11:30", title: "Break", description: "Coffee break", duration: 15 },
      { time: "11:45", title: "Classroom Management", description: "Managing student behavior", duration: 90 },
    ],
    recordType: "mandatory",
    seminarType: "in_person",
    name: "Teaching Methodology Workshop - March 2024",
    owner: {
      id: "user_1",
      name: "HQ Admin",
      role: "HQ",
    },
    hostingFranchisee: {
      id: "mf_region_1",
      name: "Boston MF Region",
      location: "Boston, MA",
    },
    start: new Date("2024-03-15T09:00:00"),
    end: new Date("2024-03-15T17:00:00"),
    max: 20,
    venue: {
      name: "Boston Learning Center",
      address: "123 Education St, Boston, MA 02101",
      capacity: 25,
      facilities: ["Projector", "Whiteboard", "WiFi", "Parking"],
    },
    price: {
      amount: 150,
      currency: "USD",
      includes: ["Materials", "Lunch", "Certificate"],
    },
    teacherTrainer: {
      id: "tt_1",
      name: "Sarah Wilson",
      role: "primary",
    },
    assistant: {
      id: "tt_2",
      name: "Michael Brown",
    },
    ttStatus: "completed",
    ttComments: "All participants successfully completed the training with excellent performance.",
    details: {
      agenda: "Comprehensive 8-hour workshop covering modern teaching methodologies, classroom management, and student engagement techniques.",
      materials: ["Presentation slides", "Workbooks", "Assessment forms", "Certificate templates"],
      prerequisites: ["Teaching experience", "Bachelor's degree"],
      objectives: ["Improve teaching skills", "Classroom management", "Student engagement"],
      assessment: "Written test and practical demonstration of teaching techniques.",
    },
    approvalStatus: "approved",
    submittedBy: "user_1",
    approvedBy: "user_1",
    submittedAt: new Date("2024-03-10"),
    approvedAt: new Date("2024-03-11"),
    registrations: [],
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "train_2",
    title: "Technology Integration Training",
    description: "Virtual training on using technology in education",
    typeId: "tt_2",
    instructorId: "teacher_3",
    participantIds: ["teacher_1"],
    maxParticipants: 15,
    status: "scheduled",
    startDate: new Date("2024-04-20"),
    endDate: new Date("2024-04-20"),
    duration: 6,
    location: "Virtual - Zoom",
    materials: ["Software licenses", "Tutorials"],
    objectives: ["Digital tools", "Online platforms"],
    agenda: [
      { time: "10:00", title: "Introduction", description: "Welcome and setup", duration: 30 },
      { time: "10:30", title: "Digital Tools", description: "Overview of educational software", duration: 120 },
      { time: "12:30", title: "Break", description: "Lunch break", duration: 60 },
      { time: "13:30", title: "Online Platforms", description: "Learning management systems", duration: 120 },
    ],
    recordType: "optional",
    seminarType: "virtual",
    name: "Technology Integration - April 2024",
    owner: {
      id: "mf_region_1",
      name: "Boston MF Region",
      role: "MF",
    },
    hostingFranchisee: {
      id: "mf_region_1",
      name: "Boston MF Region",
      location: "Boston, MA",
    },
    start: new Date("2024-04-20T10:00:00"),
    end: new Date("2024-04-20T16:00:00"),
    max: 15,
    venue: {
      name: "Virtual Training Room",
      address: "Online - Zoom Meeting",
      capacity: 50,
      facilities: ["Screen sharing", "Breakout rooms", "Recording"],
    },
    price: {
      amount: 75,
      currency: "USD",
      includes: ["Software access", "Digital materials"],
    },
    teacherTrainer: {
      id: "tt_3",
      name: "Emily Davis",
      role: "primary",
    },
    ttStatus: "pending",
    details: {
      agenda: "6-hour virtual training covering digital tools and online platforms for education.",
      materials: ["Software licenses", "Tutorials", "Digital handouts"],
      prerequisites: ["Basic computer skills"],
      objectives: ["Digital tools", "Online platforms", "Interactive content"],
      assessment: "Practical demonstration of using educational technology tools.",
    },
    approvalStatus: "submitted",
    submittedBy: "mf_region_1",
    submittedAt: new Date("2024-04-15"),
    registrations: [],
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-04-15"),
  },
];

export default function TrainingsPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [data, setData] = useState<Training[]>(sampleTrainings);
  const [loading, setLoading] = useState(false);

  // Filter trainings based on user role and scope
  useEffect(() => {
    let filteredTrainings = sampleTrainings;

    if (user?.role === "MF") {
      // MF users can see trainings they own or are hosting
      filteredTrainings = sampleTrainings.filter(training => 
        training.owner.id === selectedScope?.id || 
        training.hostingFranchisee.id === selectedScope?.id
      );
    } else if (user?.role === "LC") {
      // LC users can see trainings in their region
      filteredTrainings = sampleTrainings.filter(training => 
        training.hostingFranchisee.id === selectedScope?.id
      );
    } else if (user?.role === "TT") {
      // TT users can see trainings they're assigned to
      filteredTrainings = sampleTrainings.filter(training => 
        training.teacherTrainer.id === user.id || 
        training.assistant?.id === user.id
      );
    }
    // HQ users can see all trainings

    setData(filteredTrainings);
  }, [user, selectedScope]);

  const canEdit = user?.role === "HQ" || user?.role === "MF";
  const canCreate = user?.role === "HQ" || user?.role === "MF";
  const canApprove = user?.role === "HQ";

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get approval status color
  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  // Column definitions
  const columns: Column<Training>[] = [
    {
      key: "name",
      label: "Training",
      sortable: true,
      searchable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecordTypeColor(row.recordType)}`}>
              {row.recordType}
            </span>
            <span className="text-xs text-gray-500 capitalize">{row.seminarType.replace(/_/g, " ")}</span>
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      sortable: false,
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{value.name}</div>
          <div className="text-xs text-gray-500">{value.role}</div>
        </div>
      ),
    },
    {
      key: "hostingFranchisee",
      label: "Hosting",
      sortable: false,
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{value.name}</div>
          <div className="text-xs text-gray-500">{value.location}</div>
        </div>
      ),
    },
    {
      key: "start",
      label: "Date & Time",
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
            <span>{new Date(value).toLocaleDateString()}</span>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {new Date(row.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      key: "venue",
      label: "Venue",
      sortable: false,
      render: (value) => (
        <div className="text-sm">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-gray-400" />
            <span className="font-medium text-gray-900">{value.name}</span>
          </div>
          <div className="text-xs text-gray-500 truncate max-w-32">{value.address}</div>
        </div>
      ),
    },
    {
      key: "participantIds",
      label: "Participants",
      sortable: false,
      render: (value, row) => (
        <div className="text-sm">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-gray-400" />
            <span>{value.length}/{row.max}</span>
          </div>
          <div className="text-xs text-gray-500">Capacity: {row.venue.capacity}</div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-sm font-medium">
          <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
          <span>${value.amount}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: "approvalStatus",
      label: "Approval",
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApprovalStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: "teacherTrainer",
      label: "Teacher Trainer",
      sortable: false,
      render: (value, row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{value.name}</div>
          <div className="text-xs text-gray-500 capitalize">{value.role}</div>
          {row.assistant && (
            <div className="text-xs text-gray-400">+ {row.assistant.name}</div>
          )}
        </div>
      ),
    },
  ];

  const handleRowAction = (action: string, row: Training) => {
    console.log(`${action} action for training:`, row);
    
    switch (action) {
      case "view":
        router.push(`/trainings/${row.id}`);
        break;
      case "edit":
        if (canEdit) {
          router.push(`/trainings/${row.id}/edit`);
        }
        break;
      case "delete":
        if (canEdit && confirm(`Are you sure you want to delete training ${row.name}?`)) {
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
      case "approve":
        if (canApprove && row.approvalStatus === "submitted") {
          if (confirm(`Approve training ${row.name}?`)) {
            setData(prev => prev.map(training => 
              training.id === row.id 
                ? { ...training, approvalStatus: "approved", approvedBy: user?.id, approvedAt: new Date() }
                : training
            ));
          }
        }
        break;
      case "reject":
        if (canApprove && row.approvalStatus === "submitted") {
          if (confirm(`Reject training ${row.name}?`)) {
            setData(prev => prev.map(training => 
              training.id === row.id 
                ? { ...training, approvalStatus: "rejected", approvedBy: user?.id, approvedAt: new Date() }
                : training
            ));
          }
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: Training[]) => {
    console.log(`${action} action for ${rows.length} trainings:`, rows);
    
    switch (action) {
      case "delete":
        if (canEdit && confirm(`Are you sure you want to delete ${rows.length} trainings?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
      case "approve":
        if (canApprove && confirm(`Approve ${rows.length} trainings?`)) {
          const submittedTrainings = rows.filter(row => row.approvalStatus === "submitted");
          setData(prev => prev.map(training => 
            submittedTrainings.some(st => st.id === training.id)
              ? { ...training, approvalStatus: "approved", approvedBy: user?.id, approvedAt: new Date() }
              : training
          ));
        }
        break;
    }
  };

  const handleExport = (rows: Training[]) => {
    const exportColumns = [
      { key: "name", label: "Training Name" },
      { key: "title", label: "Title" },
      { key: "owner.name", label: "Owner" },
      { key: "hostingFranchisee.name", label: "Hosting Franchisee" },
      { key: "start", label: "Start Date" },
      { key: "venue.name", label: "Venue" },
      { key: "price.amount", label: "Price" },
      { key: "status", label: "Status" },
      { key: "approvalStatus", label: "Approval Status" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("trainings"),
    });
  };

  const handleCreateTraining = () => {
    router.push("/trainings/new");
  };

  const getRoleBasedMessage = () => {
    switch (user?.role) {
      case "HQ":
        return "Create Training Types and manage all trainings. Approve MF submissions.";
      case "MF":
        return "Create trainings and submit for HQ approval. Register teachers for trainings.";
      case "LC":
        return "Register teachers for trainings in your region.";
      case "TT":
        return "Mark teacher training completion and provide feedback.";
      default:
        return "Manage training programs and teacher development.";
    }
  };

  // Get pending approvals for HQ
  const pendingApprovals = user?.role === "HQ" ? data.filter(t => t.approvalStatus === "submitted") : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trainings</h1>
            <p className="text-gray-600">{getRoleBasedMessage()}</p>
          </div>
          <div className="flex space-x-3">
            {user?.role === "HQ" && (
              <button 
                onClick={() => router.push("/trainings/types")}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <BookOpenCheck className="h-4 w-4" />
                Training Types
              </button>
            )}
            {canCreate && (
              <button 
                onClick={handleCreateTraining}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Training
              </button>
            )}
          </div>
        </div>

        {/* Pending Approvals Alert for HQ */}
        {pendingApprovals.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Pending Approvals
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{pendingApprovals.length} training(s) waiting for your approval.</p>
                </div>
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
            emptyMessage="No trainings found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}