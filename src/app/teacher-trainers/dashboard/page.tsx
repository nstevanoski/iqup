"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { useUser } from "@/store/auth";
import { Training, TrainingRegistration } from "@/types";
import { useState, useEffect } from "react";
import { BookOpen, Users, CheckCircle, XCircle, Clock, Calendar, MapPin, Award, AlertCircle, UserCheck } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleAssignedTrainings: Training[] = [
  {
    id: "train_1",
    title: "Teaching Methodology Workshop",
    description: "Comprehensive workshop on modern teaching techniques",
    typeId: "tt_1",
    instructorId: "teacher_1",
    participantIds: ["teacher_2", "teacher_3"],
    maxParticipants: 20,
    status: "in_progress",
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
      name: "Dr. Sarah Wilson",
      role: "primary",
    },
    assistant: {
      id: "tt_2",
      name: "Prof. Michael Brown",
    },
    ttStatus: "in_progress",
    ttComments: "Training is progressing well. All participants are engaged.",
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
    registrations: [
      {
        id: "reg_1",
        trainingId: "train_1",
        teacherId: "teacher_2",
        registeredBy: "mf_region_1",
        registrationDate: new Date("2024-03-12"),
        status: "attended",
        attendance: {
          present: true,
          checkInTime: new Date("2024-03-15T09:00:00"),
          checkOutTime: new Date("2024-03-15T17:00:00"),
        },
        assessment: {
          passed: false,
        },
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: "reg_2",
        trainingId: "train_1",
        teacherId: "teacher_3",
        registeredBy: "mf_region_1",
        registrationDate: new Date("2024-03-12"),
        status: "attended",
        attendance: {
          present: true,
          checkInTime: new Date("2024-03-15T09:00:00"),
          checkOutTime: new Date("2024-03-15T17:00:00"),
        },
        assessment: {
          passed: false,
        },
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-03-15"),
      },
    ],
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
      id: "tt_1",
      name: "Dr. Sarah Wilson",
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
    approvalStatus: "approved",
    submittedBy: "mf_region_1",
    approvedBy: "user_1",
    submittedAt: new Date("2024-04-15"),
    approvedAt: new Date("2024-04-16"),
    registrations: [
      {
        id: "reg_3",
        trainingId: "train_2",
        teacherId: "teacher_1",
        registeredBy: "mf_region_1",
        registrationDate: new Date("2024-04-17"),
        status: "registered",
        attendance: {
          present: false,
        },
        assessment: {
          passed: false,
        },
        createdAt: new Date("2024-04-17"),
        updatedAt: new Date("2024-04-17"),
      },
    ],
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-04-17"),
  },
];

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

// Helper function to get TT status color
const getTTStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Column definitions
const getColumns = (): Column<Training>[] => [
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
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
            {row.status}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTTStatusColor(row.ttStatus)}`}>
            TT: {row.ttStatus}
          </span>
        </div>
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
        <div className="text-xs text-gray-500">
          {row.registrations.filter((r: any) => r.status === "attended" || r.status === "completed").length} attended
        </div>
      </div>
    ),
  },
  {
    key: "registrations",
    label: "Assessments",
    sortable: false,
    render: (value) => {
      const completed = value.filter((r: any) => r.assessment.passed).length;
      const total = value.filter((r: any) => r.status === "attended" || r.status === "completed").length;
      return (
        <div className="text-sm">
          <div className="flex items-center">
            <Award className="h-3 w-3 mr-1 text-gray-400" />
            <span>{completed}/{total} passed</span>
          </div>
          {total > 0 && (
            <div className="text-xs text-gray-500">
              {Math.round((completed / total) * 100)}% pass rate
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: "ttComments",
    label: "TT Comments",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        {value ? (
          <div className="max-w-48 truncate" title={value}>
            {value}
          </div>
        ) : (
          <span className="text-gray-400">No comments</span>
        )}
      </div>
    ),
  },
];

export default function TTDashboardPage() {
  const router = useRouter();
  const user = useUser();
  const [data, setData] = useState<Training[]>(sampleAssignedTrainings);
  const [loading, setLoading] = useState(false);

  // Only TT users can access this page
  if (user?.role !== "TT") {
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
                <p>Only Teacher Trainers can access this dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Filter trainings assigned to this TT
  useEffect(() => {
    const assignedTrainings = sampleAssignedTrainings.filter(training => 
      training.teacherTrainer.id === user.id || 
      training.assistant?.id === user.id
    );
    setData(assignedTrainings);
  }, [user]);

  const columns = getColumns();

  const handleRowAction = (action: string, row: Training) => {
    console.log(`${action} action for training:`, row);
    
    switch (action) {
      case "view":
        router.push(`/trainings/${row.id}`);
        break;
      case "mark-progress":
        router.push(`/teacher-trainers/trainings/${row.id}/progress`);
        break;
      case "assess-participants":
        router.push(`/teacher-trainers/trainings/${row.id}/assessments`);
        break;
      case "generate-certificates":
        router.push(`/teacher-trainers/trainings/${row.id}/certificates`);
        break;
    }
  };

  const handleBulkAction = (action: string, rows: Training[]) => {
    console.log(`${action} action for ${rows.length} trainings:`, rows);
    
    switch (action) {
      case "mark-complete":
        setData(prev => prev.map(training => 
          rows.some(row => row.id === training.id)
            ? { ...training, ttStatus: "completed", updatedAt: new Date() }
            : training
        ));
        break;
    }
  };

  const totalTrainings = data.length;
  const inProgressTrainings = data.filter(t => t.ttStatus === "in_progress").length;
  const completedTrainings = data.filter(t => t.ttStatus === "completed").length;
  const pendingTrainings = data.filter(t => t.ttStatus === "pending").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TT Dashboard</h1>
            <p className="text-gray-600">Manage your assigned trainings and track participant progress.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Trainings</p>
                <p className="text-2xl font-semibold text-gray-900">{totalTrainings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{inProgressTrainings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedTrainings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingTrainings}</p>
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
            loading={loading}
            emptyMessage="No assigned trainings found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
