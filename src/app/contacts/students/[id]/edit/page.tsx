"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StudentForm } from "@/components/forms/StudentForm";
import { Student, Program, SubProgram, LearningGroup } from "@/types";
import { ArrowLeft } from "lucide-react";

interface StudentEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock data - in a real app, this would come from an API
const mockStudent: Student = {
  id: "student_1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1-555-1001",
  dateOfBirth: new Date("1995-05-15"),
  address: {
    street: "123 Main St",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    country: "USA",
  },
  emergencyContact: {
    email: "jane.doe@example.com",
    phone: "+1-555-1002",
  },
  status: "active",
  enrollmentDate: new Date("2024-01-15"),
  programIds: ["prog_1"],
  subProgramIds: [],
  learningGroupIds: [],
  gender: "male",
  notes: "Excellent student, very motivated",
  parentInfo: {
    firstName: "Jane",
    lastName: "Doe",
    phone: "+1-555-1002",
    email: "jane.doe@example.com",
  },
  lastCurrentLG: {
    id: "lg_1",
    name: "English Beginners Group A",
    programName: "English Language Program",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-31"),
  },
  product: {
    id: "prod_1",
    name: "English Learning Kit",
    description: "Complete learning materials for English program",
    materials: ["Textbook", "Workbook", "Audio CD", "Online Access"],
    purchaseDate: new Date("2024-01-15"),
  },
  contactOwner: {
    id: "user_1",
    name: "LC Manager",
    role: "LC",
  },
  accountFranchise: {
    id: "lc_1",
    name: "Boston Learning Center",
    type: "LC",
  },
  mfName: "North America MF",
  programHistory: [],
  payments: [],
  certificates: [],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15"),
};

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
      coursePrice: 399.98,
      numberOfPayments: 3,
      gapBetweenPayments: 30,
      pricePerMonth: 133.33,
      paymentMethod: "installments",
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

export default function StudentEditPage({ params }: StudentEditPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch student
    const fetchStudent = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        setStudent(mockStudent);
      } catch (err) {
        setError("Failed to load student");
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [resolvedParams.id]);

  const handleSubmit = async (formData: Partial<Student>) => {
    try {
      setSaving(true);
      
      // In a real app, this would be an API call
      console.log("Updating student:", { id: resolvedParams.id, ...formData });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to student detail
      router.push(`/contacts/students/${resolvedParams.id}`);
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
          programs={mockPrograms}
          subPrograms={mockSubPrograms}
          learningGroups={mockLearningGroups}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </DashboardLayout>
  );
}
