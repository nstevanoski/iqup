"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentForm } from "@/components/forms/StudentForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useUser } from "@/store/auth";
import { Student, Program, SubProgram, LearningGroup } from "@/types";
import { ArrowLeft } from "lucide-react";
import { createStudent, CreateStudentData } from "@/lib/api/students";

// No more mock data - using real API only

export default function NewStudentPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Partial<Student>) => {
    setLoading(true);
    
    try {
      // Convert the form data to API format
      const studentData: CreateStudentData = {
        firstName: data.firstName!,
        lastName: data.lastName!,
        dateOfBirth: data.dateOfBirth!.toISOString().split('T')[0],
        gender: data.gender!.toUpperCase() as "MALE" | "FEMALE" | "OTHER",
        enrollmentDate: data.enrollmentDate?.toISOString().split('T')[0],
        status: data.status?.toUpperCase() as "ACTIVE" | "INACTIVE" | "GRADUATED" | "SUSPENDED",
        address: data.address?.street,
        city: data.address?.city,
        state: data.address?.state,
        country: data.address?.country,
        postalCode: data.address?.zipCode,
        parentFirstName: data.parentInfo!.firstName,
        parentLastName: data.parentInfo!.lastName,
        parentPhone: data.parentInfo!.phone,
        parentEmail: data.parentInfo!.email,
        emergencyContactEmail: data.emergencyContact?.email,
        emergencyContactPhone: data.emergencyContact?.phone,
        notes: data.notes,
        avatar: data.avatar,
        // The API will use the user's LC, MF, and HQ IDs automatically
      };

      await createStudent(studentData);
      
      // Redirect back to students list
      router.push("/contacts/students");
    } catch (error) {
      console.error("Error creating student:", error);
      alert("Failed to create student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/contacts/students");
  };

  // Check if user has permission to create students (LC only)
  if (user?.role !== "LC") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              Only Learning Centers (LC) can create students.
            </p>
            <button
              onClick={() => router.push("/contacts/students")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Students", href: "/contacts/students" },
            { label: "New Student" }
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
              <h1 className="text-2xl font-bold text-gray-900">Create New Student</h1>
              <p className="text-gray-600">Register a new student with complete information</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Student Registration
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Fill out all the required information to register a new student. 
                  This includes personal details, parent information, and organizational data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <StudentForm
          programs={[]}
          subPrograms={[]}
          learningGroups={[]}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
