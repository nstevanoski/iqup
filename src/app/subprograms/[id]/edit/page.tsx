"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SubProgramForm } from "@/components/forms/SubProgramForm";
import { SubProgram, Program } from "@/types";
import { ArrowLeft } from "lucide-react";

interface SubProgramEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Sample data - in a real app, this would come from an API
const sampleSubPrograms: SubProgram[] = [
  {
    id: "1",
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
  {
    id: "2",
    programId: "prog_1",
    name: "Intermediate English",
    description: "Intermediate English language skills",
    status: "active",
    order: 2,
    duration: 8,
    price: 99.99,
    prerequisites: ["Beginner English completion"],
    learningObjectives: ["Complex grammar", "Reading comprehension", "Writing skills"],
    createdBy: "user_1",
    pricingModel: "installments",
    coursePrice: 99.99,
    numberOfPayments: 3,
    gap: 30,
    sharedWithLCs: ["lc_center_nyc"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    programId: "prog_2",
    name: "Algebra Fundamentals",
    description: "Core algebraic concepts and problem solving",
    status: "active",
    order: 1,
    duration: 12,
    price: 149.99,
    prerequisites: ["Basic arithmetic"],
    learningObjectives: ["Equation solving", "Graphing", "Word problems"],
    createdBy: "user_1",
    pricingModel: "subscription",
    coursePrice: 149.99,
    pricePerMonth: 49.99,
    sharedWithLCs: ["lc_center_la"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    programId: "prog_2",
    name: "Calculus Advanced",
    description: "Advanced calculus concepts and applications",
    status: "draft",
    order: 2,
    duration: 16,
    price: 199.99,
    prerequisites: ["Algebra Fundamentals"],
    learningObjectives: ["Derivatives", "Integrals", "Applications"],
    createdBy: "user_1",
    pricingModel: "program_price",
    coursePrice: 199.99,
    sharedWithLCs: [],
    visibility: "private",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-25"),
  },
];

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
  {
    id: "prog_3",
    name: "STEM Camp",
    description: "Science, Technology, Engineering, and Mathematics camp",
    status: "active",
    category: "STEM",
    duration: 8,
    price: 199.99,
    maxStudents: 30,
    currentStudents: 25,
    requirements: ["Age 8-14"],
    learningObjectives: ["STEM exploration", "Hands-on learning"],
    createdBy: "user_1",
    hours: 80,
    lessonLength: 120,
    kind: "stem_camp",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "prog_4",
    name: "Birthday Party Program",
    description: "Educational birthday party activities",
    status: "active",
    category: "Entertainment",
    duration: 2,
    price: 99.99,
    maxStudents: 15,
    currentStudents: 8,
    requirements: ["Age 5-12"],
    learningObjectives: ["Fun learning", "Social interaction"],
    createdBy: "user_1",
    hours: 4,
    lessonLength: 120,
    kind: "birthday_party",
    sharedWithMFs: ["mf_region_1"],
    visibility: "shared",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
  },
];

export default function SubProgramEditPage({ params }: SubProgramEditPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [subProgram, setSubProgram] = useState<SubProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch subprogram
    const fetchSubProgram = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        const foundSubProgram = sampleSubPrograms.find(sp => sp.id === resolvedParams.id);
        
        if (!foundSubProgram) {
          setError("SubProgram not found");
          return;
        }
        
        setSubProgram(foundSubProgram);
      } catch (err) {
        setError("Failed to load subprogram");
        console.error("Error fetching subprogram:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubProgram();
  }, [resolvedParams.id]);

  const handleSubmit = async (formData: Partial<SubProgram>) => {
    try {
      setSaving(true);
      
      // In a real app, this would be an API call
      console.log("Updating subprogram:", { id: resolvedParams.id, ...formData });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to subprogram detail
      router.push(`/subprograms/${resolvedParams.id}`);
    } catch (err) {
      console.error("Error updating subprogram:", err);
      alert("Failed to update subprogram. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/subprograms/${resolvedParams.id}`);
  };

  const handleBack = () => {
    router.push("/subprograms");
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

  if (error || !subProgram) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">SubProgram Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "The subprogram you're looking for doesn't exist."}
            </p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to SubPrograms
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
            { label: "SubPrograms", href: "/subprograms" },
            { label: subProgram.name, href: `/subprograms/${resolvedParams.id}` },
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
              <h1 className="text-2xl font-bold text-gray-900">Edit SubProgram</h1>
              <p className="text-gray-600">Modify subprogram details and settings</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <SubProgramForm
          subProgram={subProgram}
          programs={mockPrograms}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>
    </DashboardLayout>
  );
}
