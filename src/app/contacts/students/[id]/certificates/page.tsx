"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Student, StudentCertificate } from "@/types";
import { ArrowLeft, Plus, Download, Award, Calendar, CheckCircle } from "lucide-react";

interface StudentCertificatesPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock data - in a real app, this would come from an API
const mockStudent: Student = {
  id: "student_1",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: new Date("1995-05-15"),
  address: "123 Main St",
  city: "Boston",
  state: "MA",
  postalCode: "02101",
  country: "USA",
  emergencyContactEmail: "jane.doe@example.com",
  emergencyContactPhone: "+1-555-1002",
  status: "ACTIVE",
  enrollmentDate: new Date("2024-01-15"),
  gender: "MALE",
  parentFirstName: "Jane",
  parentLastName: "Doe",
  parentPhone: "+1-555-1002",
  parentEmail: "jane.doe@example.com",
  lcId: 1,
  mfId: 1,
  hqId: 1,
  lc: {
    id: 1,
    name: "Boston Learning Center",
    code: "BLC001",
  },
  mf: {
    id: 1,
    name: "Northeast MF",
    code: "NEMF001",
  },
  hq: {
    id: 1,
    name: "IQ UP HQ",
    code: "IQHQ001",
  },
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15"),
};

const mockCertificates: StudentCertificate[] = [
  {
    id: "cert_1",
    studentId: "student_1",
    programId: "prog_1",
    programName: "English Language Program",
    subProgramId: "sub_1",
    subProgramName: "Beginner English",
    certificateCode: "CERT-2024-001234",
    issuedDate: new Date("2024-06-01"),
    validUntil: new Date("2026-06-01"),
    status: "active",
    downloadUrl: "/certificates/cert_1.pdf",
    issuedBy: "LC Manager",
    createdAt: new Date("2024-06-01"),
  },
  {
    id: "cert_2",
    studentId: "student_1",
    programId: "prog_2",
    programName: "Mathematics Program",
    certificateCode: "CERT-2024-001235",
    issuedDate: new Date("2024-08-15"),
    validUntil: new Date("2026-08-15"),
    status: "active",
    downloadUrl: "/certificates/cert_2.pdf",
    issuedBy: "LC Manager",
    createdAt: new Date("2024-08-15"),
  },
];

export default function StudentCertificatesPage({ params }: StudentCertificatesPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [certificates, setCertificates] = useState<StudentCertificate[]>(mockCertificates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentAndCertificates = async () => {
      try {
        setLoading(true);
        
        // Fetch student data
        const studentResponse = await fetch(`/api/students/${resolvedParams.id}`);
        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          setStudent(studentData.data);
          
          // Set certificates from student data if available
          if (studentData.data?.certificates) {
            setCertificates(studentData.data.certificates);
          }
        } else {
          // Fallback to mock data
          setStudent(mockStudent);
          setCertificates(mockCertificates);
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        // Fallback to mock data
        setStudent(mockStudent);
        setCertificates(mockCertificates);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndCertificates();
  }, [resolvedParams.id]);

  // Helper function to safely format status
  const formatStatus = (status: string | undefined | null): string => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper function to safely format dates
  const formatDate = (date: Date | undefined | null): string => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "-";
      return date.toLocaleDateString();
    } catch (error) {
      console.warn("Error formatting date:", error, "Date value:", date);
      return "-";
    }
  };

  const getStatusColor = (status: string | undefined | null) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: Column<StudentCertificate>[] = [
    {
      key: "programName",
      label: "Program",
      render: (certificate) => {
        try {
          return (
            <div>
              <div className="font-medium text-gray-900">{certificate?.programName || "-"}</div>
              {certificate?.subProgramName && (
                <div className="text-sm text-gray-500">{certificate.subProgramName}</div>
              )}
            </div>
          );
        } catch (error) {
          console.warn("Error rendering certificate program name:", error, "Certificate:", certificate);
          return (
            <div>
              <div className="font-medium text-gray-900">-</div>
            </div>
          );
        }
      },
    },
    {
      key: "certificateCode",
      label: "Certificate Code",
      render: (certificate) => {
        try {
          return (
            <div className="flex items-center">
              <Award className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-mono text-sm">{certificate?.certificateCode || "-"}</span>
            </div>
          );
        } catch (error) {
          console.warn("Error rendering certificate code:", error, "Certificate:", certificate);
          return (
            <div className="flex items-center">
              <Award className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-mono text-sm">-</span>
            </div>
          );
        }
      },
    },
    {
      key: "status",
      label: "Status",
      render: (certificate) => {
        try {
          return (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(certificate?.status)}`}>
                {formatStatus(certificate?.status)}
              </span>
            </div>
          );
        } catch (error) {
          console.warn("Error rendering certificate status:", error, "Certificate:", certificate);
          return (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-gray-500 mr-2" />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Unknown
              </span>
            </div>
          );
        }
      },
    },
    {
      key: "issuedDate",
      label: "Issued Date",
      render: (certificate) => {
        try {
          return (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">
                {formatDate(certificate?.issuedDate)}
              </span>
            </div>
          );
        } catch (error) {
          console.warn("Error rendering certificate issued date:", error, "Certificate:", certificate);
          return (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">-</span>
            </div>
          );
        }
      },
    },
    {
      key: "validUntil",
      label: "Valid Until",
      render: (certificate) => {
        try {
          return (
            <span className="text-sm text-gray-900">
              {formatDate(certificate?.validUntil)}
            </span>
          );
        } catch (error) {
          console.warn("Error rendering certificate valid until date:", error, "Certificate:", certificate);
          return (
            <span className="text-sm text-gray-900">-</span>
          );
        }
      },
    },
    {
      key: "issuedBy",
      label: "Issued By",
      render: (certificate) => {
        try {
          return (
            <span className="text-sm text-gray-900">{certificate?.issuedBy || "-"}</span>
          );
        } catch (error) {
          console.warn("Error rendering certificate issued by:", error, "Certificate:", certificate);
          return (
            <span className="text-sm text-gray-900">-</span>
          );
        }
      },
    },
  ];

  const handleRowAction = (action: string, certificate: StudentCertificate) => {
    switch (action) {
      case "download":
        if (certificate.downloadUrl) {
          // In a real app, this would trigger a download
          window.open(certificate.downloadUrl, '_blank');
        } else {
          alert("Download URL not available");
        }
        break;
    }
  };

  const handleBack = () => {
    router.push(`/contacts/students/${resolvedParams.id}`);
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

  if (!student) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center">
            <div className="text-6xl text-gray-400 mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Not Found</h1>
            <p className="text-gray-600 mb-6">
              The student you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/contacts/students")}
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
            { label: "Certificates" }
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
                Certificates - {student.firstName} {student.lastName}
              </h1>
              <p className="text-gray-600">View and manage student certificates</p>
            </div>
          </div>
        </div>

        {/* Certificate Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-lg font-semibold text-gray-900">
                  {certificates.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Certificates</p>
                <p className="text-lg font-semibold text-gray-900">
                  {certificates.filter(c => c.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Latest Certificate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {certificates.length > 0 ? certificates[0].issuedDate.toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Certificate History</h3>
          </div>
          <div className="p-6">
            <DataTable
              data={certificates}
              columns={columns}
              onRowAction={handleRowAction}
              rowActions={true}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
