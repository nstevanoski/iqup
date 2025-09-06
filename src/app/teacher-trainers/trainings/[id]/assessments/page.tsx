"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { useUser } from "@/store/auth";
import { Training, TrainingRegistration, Teacher } from "@/types";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, User, Calendar, Award, Clock, AlertCircle, BookOpen, MessageSquare, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

// Sample data - in a real app, this would come from an API
const sampleTeachers: Teacher[] = [
  {
    id: "teacher_1",
    firstName: "John",
    lastName: "Smith",
    title: "Mr.",
    email: "john.smith@example.com",
    phone: "+1-555-0123",
    dateOfBirth: new Date("1985-03-15"),
    gender: "male",
    status: "active",
    centers: [{
      centerId: "center_1",
      centerName: "Boston Learning Center",
      role: "Teacher",
      startDate: "2023-01-01",
      isActive: true,
    }],
    education: [{
      degree: "Bachelor of Education",
      institution: "University of Education",
      graduationYear: 2020,
      fieldOfStudy: "Education",
    }],
    trainings: [{
      trainingId: "train_1",
      trainingName: "Teaching Methodology",
      completedDate: "2024-01-15",
      status: "completed",
      certification: "Teaching Certificate",
    }],
    qualifications: ["Teaching Certificate"],
    specialization: ["Mathematics", "Science"],
    experience: 5,
    availability: [{
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
    }],
    hourlyRate: 25,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "teacher_2",
    firstName: "Sarah",
    lastName: "Johnson",
    title: "Ms.",
    email: "sarah.johnson@example.com",
    phone: "+1-555-0124",
    dateOfBirth: new Date("1988-07-22"),
    gender: "female",
    status: "active",
    centers: [{
      centerId: "center_1",
      centerName: "Boston Learning Center",
      role: "Teacher",
      startDate: "2023-01-01",
      isActive: true,
    }],
    education: [{
      degree: "Master of Education",
      institution: "Education University",
      graduationYear: 2018,
      fieldOfStudy: "Education",
    }],
    trainings: [{
      trainingId: "train_2",
      trainingName: "Advanced Teaching Methods",
      completedDate: "2024-02-10",
      status: "completed",
      certification: "Advanced Teaching Certificate",
    }],
    qualifications: ["Advanced Teaching Certificate"],
    specialization: ["English", "Literature"],
    experience: 7,
    availability: [{
      dayOfWeek: 2,
      startTime: "10:00",
      endTime: "15:00",
    }],
    hourlyRate: 30,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const sampleTraining: Training = {
  id: "train_1",
  title: "Teaching Methodology Workshop",
  description: "Comprehensive workshop on modern teaching techniques",
  typeId: "tt_1",
  instructorId: "teacher_1",
  participantIds: ["teacher_1", "teacher_2"],
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
      teacherId: "teacher_1",
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
  ],
  createdAt: new Date("2024-03-10"),
  updatedAt: new Date("2024-03-15"),
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "attended":
      return "bg-blue-100 text-blue-800";
    case "registered":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Column definitions
const getColumns = (): Column<TrainingRegistration>[] => [
  {
    key: "teacherId",
    label: "Teacher",
    sortable: false,
    render: (value, row) => {
      const teacher = sampleTeachers.find(t => t.id === value);
      return (
        <div>
          <div className="font-medium text-gray-900">
            {teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown Teacher"}
          </div>
          <div className="text-sm text-gray-500">{teacher?.email}</div>
          <div className="text-xs text-gray-500">
            {teacher?.experience} years experience
          </div>
        </div>
      );
    },
  },
  {
    key: "attendance",
    label: "Attendance",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        {value.present ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Present</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Absent</span>
          </div>
        )}
        {value.checkInTime && (
          <div className="text-xs text-gray-500">
            Check-in: {new Date(value.checkInTime).toLocaleTimeString()}
          </div>
        )}
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
    key: "assessment.status",
    label: "Assessment",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        {value.passed ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Passed</span>
          </div>
        ) : value.gradedBy ? (
          <div className="flex items-center text-red-600">
            <XCircle className="h-4 w-4 mr-1" />
            <span>Failed</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Pending</span>
          </div>
        )}
        {value.score && (
          <div className="text-xs text-gray-500">
            Score: {value.score}/{value.maxScore}
          </div>
        )}
      </div>
    ),
  },
  {
    key: "assessment.feedback",
    label: "Feedback",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        {value.feedback ? (
          <div className="max-w-48 truncate" title={value.feedback}>
            {value.feedback}
          </div>
        ) : (
          <span className="text-gray-400">No feedback</span>
        )}
      </div>
    ),
  },
  {
    key: "assessment.graded",
    label: "Graded",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        {value.gradedBy ? (
          <div>
            <div className="text-gray-900">By TT</div>
            {value.gradedAt && (
              <div className="text-xs text-gray-500">
                {new Date(value.gradedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">Not graded</span>
        )}
      </div>
    ),
  },
];

export default function TrainingAssessmentsPage() {
  const router = useRouter();
  const params = useParams();
  const user = useUser();
  const [data, setData] = useState<TrainingRegistration[]>(sampleTraining.registrations);
  const [training, setTraining] = useState<Training>(sampleTraining);
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
                <p>Only Teacher Trainers can access assessment pages.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const columns = getColumns();

  const handleRowAction = (action: string, row: TrainingRegistration) => {
    console.log(`${action} action for registration:`, row);
    
    switch (action) {
      case "mark-pass":
        if (confirm(`Mark teacher as passed for this training?`)) {
          setData(prev => prev.map(reg => 
            reg.id === row.id 
              ? { 
                  ...reg, 
                  status: "completed",
                  assessment: {
                    ...reg.assessment,
                    passed: true,
                    gradedBy: user?.id,
                    gradedAt: new Date(),
                  },
                  updatedAt: new Date(),
                }
              : reg
          ));
        }
        break;
      case "mark-fail":
        if (confirm(`Mark teacher as failed for this training?`)) {
          setData(prev => prev.map(reg => 
            reg.id === row.id 
              ? { 
                  ...reg, 
                  status: "failed",
                  assessment: {
                    ...reg.assessment,
                    passed: false,
                    gradedBy: user?.id,
                    gradedAt: new Date(),
                  },
                  updatedAt: new Date(),
                }
              : reg
          ));
        }
        break;
      case "add-feedback":
        const feedback = prompt("Enter feedback for this teacher:");
        if (feedback) {
          setData(prev => prev.map(reg => 
            reg.id === row.id 
              ? { 
                  ...reg, 
                  assessment: {
                    ...reg.assessment,
                    feedback,
                    gradedBy: user?.id,
                    gradedAt: new Date(),
                  },
                  updatedAt: new Date(),
                }
              : reg
          ));
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: TrainingRegistration[]) => {
    console.log(`${action} action for ${rows.length} registrations:`, rows);
    
    switch (action) {
      case "mark-all-pass":
        if (confirm(`Mark all ${rows.length} teachers as passed?`)) {
          setData(prev => prev.map(reg => 
            rows.some(row => row.id === reg.id)
              ? { 
                  ...reg, 
                  status: "completed",
                  assessment: {
                    ...reg.assessment,
                    passed: true,
                    gradedBy: user?.id,
                    gradedAt: new Date(),
                  },
                  updatedAt: new Date(),
                }
              : reg
          ));
        }
        break;
    }
  };

  const breadcrumbItems = [
    { label: "TT Dashboard", href: "/teacher-trainers/dashboard" },
    { label: training.name, href: `/trainings/${training.id}` },
    { label: "Assessments", href: `/teacher-trainers/trainings/${training.id}/assessments` },
  ];

  const passedCount = data.filter(reg => reg.assessment.passed).length;
  const failedCount = data.filter(reg => reg.assessment.gradedBy && !reg.assessment.passed).length;
  const pendingCount = data.filter(reg => !reg.assessment.gradedBy).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Training Assessments</h1>
            <p className="text-gray-600">{training.name}</p>
          </div>
        </div>

        {/* Training Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(training.start).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Duration</p>
                <p className="text-sm text-gray-600">{training.duration} hours</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Participants</p>
                <p className="text-sm text-gray-600">
                  {training.participantIds.length}/{training.max}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Assessment</p>
                <p className="text-sm text-gray-600">{training.details.assessment}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Passed</p>
                <p className="text-2xl font-semibold text-gray-900">{passedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Failed</p>
                <p className="text-2xl font-semibold text-gray-900">{failedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
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
            emptyMessage="No registrations found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
