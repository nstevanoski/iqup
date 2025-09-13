"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useUser } from "@/store/auth";
import { Student } from "@/types";
import { ArrowLeft, Edit, DollarSign, Award, User, Phone, Mail, MapPin, Calendar, GraduationCap } from "lucide-react";
import { getStudent } from "@/lib/api/students";

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// No more mock data - using real API only

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
  const router = useRouter();
  const user = useUser();
  const resolvedParams = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch student data from API
        const response = await getStudent(resolvedParams.id);
        if (response.success) {
          setStudent(response.data);
        } else {
          setError("Student not found");
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

  const handleEdit = () => {
    router.push(`/contacts/students/${resolvedParams.id}/edit`);
  };

  const handleBack = () => {
    router.push("/contacts/students");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "graduated":
        return "bg-blue-100 text-blue-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
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
            { label: `${student.firstName} ${student.lastName}` }
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-gray-600">Student Profile</p>
            </div>
          </div>
          {user?.role === "LC" && (
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Student
              </button>
            </div>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {student.enrollmentDate && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Enrolled</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(student.enrollmentDate)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Programs</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(student.programHistory?.length || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(student.certificates?.length || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{student.firstName} {student.lastName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(student.dateOfBirth)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{student.gender}</p>
                </div>

              </div>
            </div>

            {/* Address Information */}
            {student.address && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">{student.address}</p>
                    <p className="text-sm text-gray-900">
                      {student.city}, {student.state} {student.postalCode}
                    </p>
                    <p className="text-sm text-gray-900">{student.country}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Parent Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.parentFirstName || ''} {student.parentLastName || ''}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                  <div className="mt-1 flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{student.parentPhone || ''}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                  <div className="mt-1 flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{student.parentEmail || ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Program History */}
            {student.programHistory && student.programHistory.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Program History</h3>
                <div className="space-y-4">
                  {student.programHistory.map((program) => (
                    <div key={program.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{program.programName}</h4>
                          {program.subProgramName && (
                            <p className="text-sm text-gray-600">{program.subProgramName}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            {formatDate(program.startDate)} - {program.endDate ? formatDate(program.endDate) : "Ongoing"}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          program.status === "completed" ? "bg-green-100 text-green-800" :
                          program.status === "dropped" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                        </span>
                      </div>
                      {program.grade && (
                        <p className="text-sm text-gray-600 mt-1">Grade: {program.grade}%</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/contacts/students/${student.id}/payments`)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Payments
                </button>
                <button
                  onClick={() => router.push(`/contacts/students/${student.id}/certificates`)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Award className="h-4 w-4 mr-2" />
                  View Certificates
                </button>
              </div>
            </div>

            {/* Organizational Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Organizational Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Learning Center</label>
                  <p className="mt-1 text-sm text-gray-900">{student.lc?.name || 'N/A'} ({student.lc?.code || 'N/A'})</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Master Franchisee</label>
                  <p className="mt-1 text-sm text-gray-900">{student.mf?.name || 'N/A'} ({student.mf?.code || 'N/A'})</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Headquarters</label>
                  <p className="mt-1 text-sm text-gray-900">{student.hq?.name || 'N/A'} ({student.hq?.code || 'N/A'})</p>
                </div>
              </div>
            </div>

            {/* Current Learning Group */}
            {student.lastCurrentLG && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Learning Group</h3>
                <div>
                  <h4 className="font-medium text-gray-900">{student.lastCurrentLG.name}</h4>
                  <p className="text-sm text-gray-600">{student.lastCurrentLG.programName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Started: {formatDate(student.lastCurrentLG.startDate)}
                  </p>
                  {student.lastCurrentLG.endDate && (
                    <p className="text-sm text-gray-500">
                      Ends: {formatDate(student.lastCurrentLG.endDate)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Product Information */}
            {student.product && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product</h3>
                <div>
                  <h4 className="font-medium text-gray-900">{student.product.name}</h4>
                  <p className="text-sm text-gray-600">{student.product.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Purchased: {formatDate(student.product.purchaseDate)}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Materials:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {student.product.materials.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {student.notes && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                <p className="text-sm text-gray-900">{student.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
