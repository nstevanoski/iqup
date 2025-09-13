"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StudentForm } from "@/components/forms/StudentForm";
import { Student, Program, SubProgram, LearningGroup } from "@/types";
import { ArrowLeft } from "lucide-react";
import { getStudent, updateStudent, UpdateStudentData } from "@/lib/api/students";

interface StudentEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// No more mock data - using real API only

export default function StudentEditPage({ params }: StudentEditPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch student from API
    const fetchStudent = async () => {
      try {
        setLoading(true);
        
        const response = await getStudent(resolvedParams.id);
        if (response.success) {
          setStudent(response.data);
        } else {
          setError("Student not found");
          return;
        }
      } catch (err) {
        setError("Failed to load student");
        console.error("Error fetching student:", err);
        // No fallback - show error state
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [resolvedParams.id]);

  const handleSubmit = async (formData: any) => {
    try {
      setSaving(true);
      
      // Convert the form data to API format
      // Note: Form uses nested structure internally, so we access it that way
      const updateData: UpdateStudentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth, // Already in string format from form
        gender: formData.gender?.toUpperCase() as "MALE" | "FEMALE" | "OTHER",
        enrollmentDate: formData.enrollmentDate,
        status: formData.status?.toUpperCase() as "ACTIVE" | "INACTIVE" | "GRADUATED" | "SUSPENDED",
        address: formData.address?.street,
        city: formData.address?.city,
        state: formData.address?.state,
        country: formData.address?.country,
        postalCode: formData.address?.zipCode,
        parentFirstName: formData.parentInfo?.firstName,
        parentLastName: formData.parentInfo?.lastName,
        parentPhone: formData.parentInfo?.phone,
        parentEmail: formData.parentInfo?.email,
        emergencyContactEmail: undefined, // Form doesn't have emergency contact anymore
        emergencyContactPhone: undefined,
        notes: formData.notes,
        avatar: formData.avatar,
      };

      const response = await updateStudent(resolvedParams.id, updateData);
      
      if (response.success) {
        // Navigate back to student detail
        router.push(`/contacts/students/${resolvedParams.id}`);
      } else {
        alert("Failed to update student. Please try again.");
      }
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/contacts/students/${resolvedParams.id}`);
  };

  const handleBack = () => {
    router.push("/contacts/students");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !student) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "The student you're looking for doesn't exist."}
            </p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Students", href: "/contacts/students" },
            { label: `${student.firstName} ${student.lastName}`, href: `/contacts/students/${resolvedParams.id}` },
            { label: "Edit" }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
              <p className="text-gray-600">Modify student information and details</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <StudentForm
          student={student}
          programs={[]}
          subPrograms={[]}
          learningGroups={[]}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </DashboardLayout>
  );
}
