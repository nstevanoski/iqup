"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { Teacher } from "@/types";
import { ArrowLeft, Info } from "lucide-react";

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

interface EditTeacherPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTeacherPage({ params }: EditTeacherPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (teacherData: Omit<Teacher, "id" | "createdAt" | "updatedAt">) => {
    try {
      setSubmitting(true);
      const response = await fetch(`/api/teachers/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/contacts/teachers/${resolvedParams.id}`);
      } else {
        const error = await response.json();
        alert(`Error updating teacher: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
      alert("Failed to update teacher. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/contacts/teachers/${resolvedParams.id}`);
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
              onClick={() => router.push(`/contacts/teachers/${resolvedParams.id}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Teacher
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Contacts", href: "/contacts" },
            { label: "Teachers", href: "/contacts/teachers" },
            { label: `${teacher.title} ${teacher.firstName} ${teacher.lastName}`, href: `/contacts/teachers/${resolvedParams.id}` },
            { label: "Edit", href: `/contacts/teachers/${resolvedParams.id}/edit` },
          ]}
        />

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Edit Teacher</h3>
              <p className="text-sm text-blue-700 mt-1">
                Update the teacher's information below. All fields marked with * are required.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <TeacherForm
            teacher={teacher}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
