"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { Teacher } from "@/types";
import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Users, Clock, BookOpen, DollarSign, GraduationCap, MapPin, Award } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleTeachers: Teacher[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Wilson",
    title: "Dr.",
    email: "sarah.wilson@example.com",
    phone: "+1-555-1001",
    specialization: ["English Literature", "Linguistics"],
    experience: 15,
    qualifications: ["PhD in English Literature", "TESOL Certification"],
    status: "active",
    hourlyRate: 75,
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
    ],
    bio: "Experienced English professor with 15 years of teaching experience",
    address: {
      street: "321 Elm St",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    education: [
      {
        degree: "PhD",
        institution: "Harvard University",
        graduationYear: 2008,
        fieldOfStudy: "English Literature",
      },
      {
        degree: "MA",
        institution: "Oxford University",
        graduationYear: 2005,
        fieldOfStudy: "Linguistics",
      },
    ],
    trainings: [
      {
        trainingId: "train_1",
        trainingName: "Advanced Teaching Methods",
        completedDate: "2024-01-15",
        status: "completed",
        certification: "Advanced Teaching Certificate",
      },
      {
        trainingId: "train_2",
        trainingName: "Digital Learning Tools",
        completedDate: "2024-02-20",
        status: "completed",
      },
      {
        trainingId: "train_3",
        trainingName: "Student Assessment Techniques",
        completedDate: "2024-03-10",
        status: "in_progress",
      },
    ],
    centers: [
      {
        centerId: "center_1",
        centerName: "Boston Learning Center",
        role: "Senior English Instructor",
        startDate: "2018-01-15",
        isActive: true,
      },
      {
        centerId: "center_2",
        centerName: "Cambridge Education Hub",
        role: "Literature Consultant",
        startDate: "2020-06-01",
        isActive: true,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Brown",
    title: "Prof.",
    email: "michael.brown@example.com",
    phone: "+1-555-1002",
    specialization: ["Mathematics", "Statistics"],
    experience: 12,
    qualifications: ["PhD in Mathematics", "MSc in Statistics"],
    status: "active",
    hourlyRate: 80,
    availability: [
      { dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
      { dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
    ],
    bio: "Mathematics professor specializing in applied mathematics and statistics",
    address: {
      street: "654 Maple Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    education: [
      {
        degree: "PhD",
        institution: "MIT",
        graduationYear: 2011,
        fieldOfStudy: "Mathematics",
      },
      {
        degree: "MSc",
        institution: "Stanford University",
        graduationYear: 2009,
        fieldOfStudy: "Statistics",
      },
    ],
    trainings: [
      {
        trainingId: "train_1",
        trainingName: "Advanced Teaching Methods",
        completedDate: "2024-01-15",
        status: "completed",
        certification: "Advanced Teaching Certificate",
      },
      {
        trainingId: "train_4",
        trainingName: "Data Analysis Tools",
        completedDate: "2024-02-28",
        status: "completed",
      },
    ],
    centers: [
      {
        centerId: "center_3",
        centerName: "Seattle Math Academy",
        role: "Head of Mathematics Department",
        startDate: "2019-09-01",
        isActive: true,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Davis",
    title: "Dr.",
    email: "emily.davis@example.com",
    phone: "+1-555-1003",
    specialization: ["Physics", "Chemistry"],
    experience: 10,
    qualifications: ["PhD in Physics", "BSc in Chemistry"],
    status: "active",
    hourlyRate: 70,
    availability: [
      { dayOfWeek: 1, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 3, startTime: "08:00", endTime: "16:00" },
      { dayOfWeek: 5, startTime: "08:00", endTime: "16:00" },
    ],
    bio: "Physics professor with expertise in experimental physics and chemistry",
    address: {
      street: "987 Cedar St",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA",
    },
    education: [
      {
        degree: "PhD",
        institution: "Caltech",
        graduationYear: 2013,
        fieldOfStudy: "Physics",
      },
      {
        degree: "BSc",
        institution: "UC Berkeley",
        graduationYear: 2009,
        fieldOfStudy: "Chemistry",
      },
    ],
    trainings: [
      {
        trainingId: "train_5",
        trainingName: "Laboratory Safety Protocols",
        completedDate: "2024-01-30",
        status: "completed",
      },
      {
        trainingId: "train_6",
        trainingName: "Modern Physics Teaching",
        completedDate: "2024-03-15",
        status: "scheduled",
      },
    ],
    centers: [
      {
        centerId: "center_4",
        centerName: "Austin Science Center",
        role: "Physics Instructor",
        startDate: "2020-08-15",
        isActive: true,
      },
      {
        centerId: "center_5",
        centerName: "Texas Learning Hub",
        role: "Chemistry Lab Coordinator",
        startDate: "2021-01-10",
        endDate: "2023-12-31",
        isActive: false,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Wilson",
    title: "Mr.",
    email: "david.wilson@example.com",
    phone: "+1-555-1004",
    specialization: ["Computer Science", "Programming"],
    experience: 8,
    qualifications: ["MS in Computer Science", "Software Engineering Certificate"],
    status: "on_leave",
    hourlyRate: 85,
    availability: [],
    bio: "Experienced software engineer turned educator, specializing in modern programming languages.",
    address: {
      street: "456 Tech Blvd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
    },
    education: [
      {
        degree: "MS",
        institution: "Stanford University",
        graduationYear: 2015,
        fieldOfStudy: "Computer Science",
      },
    ],
    trainings: [
      {
        trainingId: "train_7",
        trainingName: "Modern Programming Languages",
        completedDate: "2024-02-10",
        status: "completed",
      },
    ],
    centers: [
      {
        centerId: "center_6",
        centerName: "San Francisco Tech Academy",
        role: "Senior Programming Instructor",
        startDate: "2019-03-01",
        isActive: true,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  },
];

// Helper function to get training status color
const getTrainingStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "scheduled":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get active centers
const getActiveCenters = (centers: Teacher["centers"]) => {
  return centers.filter(center => center.isActive);
};

// Column definitions
const columns: Column<Teacher>[] = [
  {
    key: "name",
    label: "Teacher Name",
    sortable: true,
    searchable: true,
    filterable: true,
    render: (_, row) => (
      <div>
        <div className="font-medium text-gray-900">
          {row.title} {row.firstName} {row.lastName}
        </div>
        <div className="text-sm text-gray-500">{row.email}</div>
        <div className="text-xs text-gray-400">{row.specialization.join(", ")}</div>
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
        on_leave: "bg-red-100 text-red-800",
      };
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value as keyof typeof statusColors]}`}>
          {value}
        </span>
      );
    },
  },
  {
    key: "experience",
    label: "Experience",
    sortable: true,
    render: (value) => (
      <div className="flex items-center text-sm">
        <Clock className="h-4 w-4 mr-1 text-gray-400" />
        {value} years
      </div>
    ),
  },
  {
    key: "hourlyRate",
    label: "Hourly Rate",
    sortable: true,
    render: (value) => (
      <div className="flex items-center text-sm font-medium">
        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
        ${value}
      </div>
    ),
  },
  {
    key: "education",
    label: "Education",
    sortable: false,
    render: (value) => (
      <div className="space-y-1">
        {value.slice(0, 2).map((edu: any, index: number) => (
          <div key={index} className="flex items-center text-xs">
            <GraduationCap className="h-3 w-3 mr-1 text-gray-400" />
            <span className="truncate">{edu.degree} - {edu.institution}</span>
          </div>
        ))}
        {value.length > 2 && (
          <div className="text-xs text-gray-500">+{value.length - 2} more</div>
        )}
      </div>
    ),
  },
  {
    key: "trainings",
    label: "Trainings",
    sortable: false,
    render: (value) => (
      <div className="space-y-1">
        {value.slice(0, 2).map((training: any, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${getTrainingStatusColor(training.status)}`}>
              {training.status}
            </span>
            <span className="text-xs text-gray-600 truncate max-w-20">
              {training.trainingName}
            </span>
          </div>
        ))}
        {value.length > 2 && (
          <div className="text-xs text-gray-500">+{value.length - 2} more</div>
        )}
      </div>
    ),
  },
  {
    key: "centers",
    label: "Active Centers",
    sortable: false,
    render: (value) => {
      const activeCenters = getActiveCenters(value);
      return (
        <div className="space-y-1">
          {activeCenters.slice(0, 2).map((center, index) => (
            <div key={index} className="flex items-center text-xs">
              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
              <span className="truncate">{center.centerName}</span>
            </div>
          ))}
          {activeCenters.length > 2 && (
            <div className="text-xs text-gray-500">+{activeCenters.length - 2} more</div>
          )}
          {activeCenters.length === 0 && (
            <div className="text-xs text-gray-500">No active centers</div>
          )}
        </div>
      );
    },
  },
];

export default function TeachersPage() {
  const [data, setData] = useState<Teacher[]>(sampleTeachers);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>(undefined);

  const handleRowAction = (action: string, row: Teacher) => {
    console.log(`${action} action for teacher:`, row);
    
    switch (action) {
      case "view":
        alert(`Viewing teacher: ${row.title} ${row.firstName} ${row.lastName}`);
        break;
      case "edit":
        setEditingTeacher(row);
        setShowForm(true);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${row.title} ${row.firstName} ${row.lastName}?`)) {
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: Teacher[]) => {
    console.log(`${action} action for ${rows.length} teachers:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} teachers?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
    }
  };

  const handleExport = (rows: Teacher[]) => {
    const exportColumns = [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "title", label: "Title" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "specialization", label: "Specialization" },
      { key: "experience", label: "Experience (years)" },
      { key: "status", label: "Status" },
      { key: "hourlyRate", label: "Hourly Rate" },
      { key: "address.city", label: "City" },
      { key: "address.state", label: "State" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("teachers"),
    });
  };

  const handleAddTeacher = () => {
    setEditingTeacher(undefined);
    setShowForm(true);
  };

  const handleFormSubmit = (teacherData: Omit<Teacher, "id" | "createdAt" | "updatedAt">) => {
    if (editingTeacher) {
      // Update existing teacher
      setData(prev => prev.map(teacher => 
        teacher.id === editingTeacher.id 
          ? { ...teacher, ...teacherData, updatedAt: new Date() }
          : teacher
      ));
    } else {
      // Add new teacher
      const newTeacher: Teacher = {
        ...teacherData,
        id: `teacher_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setData(prev => [...prev, newTeacher]);
    }
    setShowForm(false);
    setEditingTeacher(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTeacher(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
            <p className="text-gray-600">Manage teacher contacts and information</p>
          </div>
          <button 
            onClick={handleAddTeacher}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Teacher
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
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
            emptyMessage="No teachers found"
          />
        </div>
      </div>

      {/* Teacher Form Modal */}
      {showForm && (
        <TeacherForm
          teacher={editingTeacher}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
        />
      )}
    </DashboardLayout>
  );
}
