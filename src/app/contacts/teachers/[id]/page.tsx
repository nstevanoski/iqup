"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TeacherDetail } from "@/components/views/TeacherDetail";
import { Teacher } from "@/types";
import { ArrowLeft } from "lucide-react";

// Mock teacher data for fallback
const mockTeacher: Teacher = {
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
  ],
  centers: [
    {
      centerId: "center_1",
      centerName: "Boston Learning Center",
      role: "Senior English Instructor",
      startDate: "2018-01-15",
      isActive: true,
    },
  ],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15"),
};

interface TeacherDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TeacherDetailPage({ params }: TeacherDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/teachers/${resolvedParams.id}`);
        if (response.ok) {
          const result = await response.json();
          setTeacher(result.data);
        } else {
          // Fallback to mock data
          setTeacher(mockTeacher);
        }
      } catch (error) {
        console.error("Error fetching teacher:", error);
        // Fallback to mock data
        setTeacher(mockTeacher);
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id) {
      fetchTeacher();
    }
  }, [resolvedParams.id]);

  const handleEdit = () => {
    router.push(`/contacts/teachers/${resolvedParams.id}/edit`);
  };

  const handleDelete = async () => {
    if (!teacher) return;
    
    if (confirm(`Are you sure you want to delete ${teacher.title} ${teacher.firstName} ${teacher.lastName}?`)) {
      try {
        const response = await fetch(`/api/teachers/${resolvedParams.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.push("/contacts/teachers");
        } else {
          const error = await response.json();
          alert(`Error deleting teacher: ${error.message}`);
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
        alert("Failed to delete teacher. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading teacher details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!teacher) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Teacher not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/contacts/teachers")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Teachers
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Contacts", href: "/contacts" },
            { label: "Teachers", href: "/contacts/teachers" },
            { label: `${teacher.title} ${teacher.firstName} ${teacher.lastName}`, href: `/contacts/teachers/${resolvedParams.id}` },
          ]}
        />

        {/* Teacher Detail */}
        <TeacherDetail
          teacher={teacher}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}
