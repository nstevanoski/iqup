"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentForm } from "@/components/forms/StudentForm";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useUser } from "@/store/auth";
import { Student, Program, SubProgram, LearningGroup } from "@/types";
import { ArrowLeft } from "lucide-react";

// Mock data - in a real app, this would come from an API
const mockPrograms: Program[] = [
  {
    id: "prog_1",
    name: "English Language Program",
    description: "Comprehensive English language learning program for all levels",
    status: "active",
    category: "Language",
    duration: 24,
    price: 299.99,
    maxStudents: 100,
    currentStudents: 45,
    requirements: ["Basic reading skills", "Age 16+"],
    learningObjectives: ["Fluency in English", "Grammar mastery", "Conversational skills"],
    createdBy: "user_1",
    hours: 120,
    lessonLength: 60,
    kind: "academic",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "prog_2",
    name: "Mathematics Program",
    description: "Advanced mathematics curriculum covering algebra, calculus, and statistics",
    status: "active",
    category: "STEM",
    duration: 36,
    price: 399.99,
    maxStudents: 80,
    currentStudents: 32,
    requirements: ["High school diploma", "Basic math skills"],
    learningObjectives: ["Advanced problem solving", "Mathematical reasoning", "Statistical analysis"],
    createdBy: "user_1",
    hours: 180,
    lessonLength: 90,
    kind: "academic",
    sharedWithMFs: ["mf_region_1"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
];

const mockSubPrograms: SubProgram[] = [
  {
    id: "sub_1",
    programId: "prog_1",
    name: "Beginner English",
    description: "Introduction to English language basics",
    status: "active",
    order: 1,
    duration: 8,
    price: 99.99,
    prerequisites: [],
    learningObjectives: ["Basic vocabulary", "Simple grammar", "Pronunciation"],
    createdBy: "user_1",
    pricingModel: "one-time",
    coursePrice: 99.99,
    sharedWithLCs: ["lc_center_nyc", "lc_center_la"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

const mockLearningGroups: LearningGroup[] = [
  {
    id: "lg_1",
    name: "English Beginners Group A",
    description: "Beginner English learning group",
    programId: "prog_1",
    subProgramId: "sub_1",
    teacherId: "teacher_1",
    studentIds: [],
    maxStudents: 20,
    status: "active",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-31"),
    schedule: [],
    location: "Main Campus",
    notes: "Morning session",
    dates: {
      startDate: "2024-02-01",
      endDate: "2024-05-31",
      registrationDeadline: "2024-01-25",
      lastClassDate: "2024-05-31",
    },
    pricingSnapshot: {
      programPrice: 299.99,
      subProgramPrice: 99.99,
      totalPrice: 399.98,
      finalPrice: 399.98,
      currency: "USD",
    },
    owner: {
      id: "user_1",
      name: "LC Manager",
      role: "LC",
    },
    franchisee: {
      id: "lc_1",
      name: "New York Learning Center",
      location: "New York",
    },
    students: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

export default function NewStudentPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Partial<Student>) => {
    setLoading(true);
    
    try {
      // In a real app, this would make an API call
      console.log("Creating student:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  // Check if user has permission to create students
  if (user?.role !== "LC" && user?.role !== "MF") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              Only Learning Centers (LC) and Master Franchisors (MF) can create students.
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
          programs={mockPrograms}
          subPrograms={mockSubPrograms}
          learningGroups={mockLearningGroups}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
