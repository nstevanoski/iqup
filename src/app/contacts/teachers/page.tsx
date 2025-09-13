"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { Teacher } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useSelectedScope, useToken } from "@/store/auth";
import { Plus, Eye, Edit, Trash2, Users, Clock } from "lucide-react";
import Link from "next/link";
import { teachersAPI } from "@/lib/api/teachers";

// Sample data - in a real app, this would come from an API
const sampleTeachers: Teacher[] = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Wilson",
    dateOfBirth: new Date("1980-05-15"),
    gender: "female",
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
    // centers data removed per requirements
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: new Date("1975-08-22"),
    gender: "male",
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
    // centers data removed per requirements
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Davis",
    dateOfBirth: new Date("1985-12-03"),
    gender: "female",
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
    // centers data removed per requirements
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Wilson",
    dateOfBirth: new Date("1988-03-18"),
    gender: "male",
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
    // centers data removed per requirements
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-02"),
  },
];

// Helper function removed per requirements

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
        <Link href={`/contacts/teachers/${row.id}`} className="font-medium text-blue-600 hover:underline cursor-pointer">
          {row.title} {row.firstName} {row.lastName}
        </Link>
        <div className="text-sm text-gray-500">{row.email}</div>
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
  // Removed Hourly Rate, Education, Trainings, and Centers columns per requirements
];

export default function TeachersPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const token = useToken();
  const [data, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!user || !selectedScope || !token) return;

      try {
        setLoading(true);
        
        // Update API token to match current user context
        teachersAPI.updateToken(token);
        
        const result = await teachersAPI.getTeachers();
        setData(result.data.teachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        // Show empty state instead of fallback data
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [user, selectedScope, token]);

  const handleRowAction = (action: string, row: Teacher) => {
    switch (action) {
      case "view":
        router.push(`/contacts/teachers/${row.id}`);
        break;
      case "edit":
        router.push(`/contacts/teachers/${row.id}/edit`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${row.title} ${row.firstName} ${row.lastName}?`)) {
          handleDeleteTeacher(row.id);
        }
        break;
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!token) return;
    
    try {
      // Ensure API has the latest token
      teachersAPI.updateToken(token);
      await teachersAPI.deleteTeacher(teacherId);
      // Remove from local state
      setData(data.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Failed to delete teacher. Please try again.");
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
      { key: "address.city", label: "City" },
      { key: "address.state", label: "State" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("teachers"),
    });
  };

  const handleAddTeacher = () => {
    router.push("/contacts/teachers/new");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
            <p className="text-gray-600">Manage teacher contacts and information</p>
          </div>
          {(user?.role === "LC" || user?.role === "MF") && (
            <button 
              onClick={handleAddTeacher}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Teacher
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
            emptyMessage="No teachers found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
