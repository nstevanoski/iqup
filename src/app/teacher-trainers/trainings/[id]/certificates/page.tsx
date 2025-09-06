"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/store/auth";
import { Training, TrainingRegistration, Teacher } from "@/types";
import { useState, useEffect } from "react";
import { Award, Download, CheckCircle, XCircle, User, Calendar, AlertCircle, FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

// Sample data - in a real app, this would come from an API
const sampleTeachers: Teacher[] = [
  {
    id: "teacher_1",
    firstName: "John",
    lastName: "Smith",
    title: "Mr.",
    email: "john.smith@example.com",
    phone: "+1-555-0123",
    dateOfBirth: new Date("1985-03-15"),
    gender: "male",
    status: "active",
    centers: [{
      centerId: "center_1",
      centerName: "Boston Learning Center",
      role: "Teacher",
      startDate: "2023-01-01",
      isActive: true,
    }],
    education: [{
      degree: "Bachelor of Education",
      institution: "University of Education",
      graduationYear: 2020,
      fieldOfStudy: "Education",
    }],
    trainings: [{
      trainingId: "train_1",
      trainingName: "Teaching Methodology",
      completedDate: "2024-01-15",
      status: "completed",
      certification: "Teaching Certificate",
    }],
    qualifications: ["Teaching Certificate"],
    specialization: ["Mathematics", "Science"],
    experience: 5,
    availability: [{
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
    }],
    hourlyRate: 25,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "teacher_2",
    firstName: "Sarah",
    lastName: "Johnson",
    title: "Ms.",
    email: "sarah.johnson@example.com",
    phone: "+1-555-0124",
    dateOfBirth: new Date("1988-07-22"),
    gender: "female",
    status: "active",
    centers: [{
      centerId: "center_1",
      centerName: "Boston Learning Center",
      role: "Teacher",
      startDate: "2023-01-01",
      isActive: true,
    }],
    education: [{
      degree: "Master of Education",
      institution: "Education University",
      graduationYear: 2018,
      fieldOfStudy: "Education",
    }],
    trainings: [{
      trainingId: "train_2",
      trainingName: "Advanced Teaching Methods",
      completedDate: "2024-02-10",
      status: "completed",
      certification: "Advanced Teaching Certificate",
    }],
    qualifications: ["Advanced Teaching Certificate"],
    specialization: ["English", "Literature"],
    experience: 7,
    availability: [{
      dayOfWeek: 2,
      startTime: "10:00",
      endTime: "15:00",
    }],
    hourlyRate: 30,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const sampleTraining: Training = {
  id: "train_1",
  title: "Teaching Methodology Workshop",
  description: "Comprehensive workshop on modern teaching techniques",
  typeId: "tt_1",
  instructorId: "teacher_1",
  participantIds: ["teacher_1", "teacher_2"],
  maxParticipants: 20,
  status: "completed",
  startDate: new Date("2024-03-15"),
  endDate: new Date("2024-03-15"),
  duration: 8,
  location: "Conference Room A",
  materials: ["Presentation slides", "Workbooks"],
  objectives: ["Improve teaching skills", "Classroom management"],
  agenda: [
    { time: "09:00", title: "Introduction", description: "Welcome and overview", duration: 30 },
    { time: "09:30", title: "Teaching Methods", description: "Modern teaching techniques", duration: 120 },
    { time: "11:30", title: "Break", description: "Coffee break", duration: 15 },
    { time: "11:45", title: "Classroom Management", description: "Managing student behavior", duration: 90 },
  ],
  recordType: "mandatory",
  seminarType: "in_person",
  name: "Teaching Methodology Workshop - March 2024",
  owner: {
    id: "user_1",
    name: "HQ Admin",
    role: "HQ",
  },
  hostingFranchisee: {
    id: "mf_region_1",
    name: "Boston MF Region",
    location: "Boston, MA",
  },
  start: new Date("2024-03-15T09:00:00"),
  end: new Date("2024-03-15T17:00:00"),
  max: 20,
  venue: {
    name: "Boston Learning Center",
    address: "123 Education St, Boston, MA 02101",
    capacity: 25,
    facilities: ["Projector", "Whiteboard", "WiFi", "Parking"],
  },
  price: {
    amount: 150,
    currency: "USD",
    includes: ["Materials", "Lunch", "Certificate"],
  },
  teacherTrainer: {
    id: "tt_1",
    name: "Dr. Sarah Wilson",
    role: "primary",
  },
  ttStatus: "completed",
  ttComments: "All participants successfully completed the training with excellent performance.",
  details: {
    agenda: "Comprehensive 8-hour workshop covering modern teaching methodologies, classroom management, and student engagement techniques.",
    materials: ["Presentation slides", "Workbooks", "Assessment forms", "Certificate templates"],
    prerequisites: ["Teaching experience", "Bachelor's degree"],
    objectives: ["Improve teaching skills", "Classroom management", "Student engagement"],
    assessment: "Written test and practical demonstration of teaching techniques.",
  },
  approvalStatus: "approved",
  submittedBy: "user_1",
  approvedBy: "user_1",
  submittedAt: new Date("2024-03-10"),
  approvedAt: new Date("2024-03-11"),
  registrations: [
    {
      id: "reg_1",
      trainingId: "train_1",
      teacherId: "teacher_1",
      registeredBy: "mf_region_1",
      registrationDate: new Date("2024-03-12"),
      status: "completed",
      attendance: {
        present: true,
        checkInTime: new Date("2024-03-15T09:00:00"),
        checkOutTime: new Date("2024-03-15T17:00:00"),
      },
      assessment: {
        passed: true,
        score: 85,
        maxScore: 100,
        feedback: "Excellent performance in both written and practical assessments.",
        gradedBy: "tt_1",
        gradedAt: new Date("2024-03-15"),
      },
      certificate: {
        issued: true,
        certificateId: "CERT-TM-2024-001",
        issuedAt: new Date("2024-03-16"),
        validUntil: new Date("2026-03-16"),
      },
      createdAt: new Date("2024-03-12"),
      updatedAt: new Date("2024-03-16"),
    },
    {
      id: "reg_2",
      trainingId: "train_1",
      teacherId: "teacher_2",
      registeredBy: "mf_region_1",
      registrationDate: new Date("2024-03-12"),
      status: "completed",
      attendance: {
        present: true,
        checkInTime: new Date("2024-03-15T09:00:00"),
        checkOutTime: new Date("2024-03-15T17:00:00"),
      },
      assessment: {
        passed: true,
        score: 92,
        maxScore: 100,
        feedback: "Outstanding performance with excellent practical demonstration skills.",
        gradedBy: "tt_1",
        gradedAt: new Date("2024-03-15"),
      },
      certificate: {
        issued: false,
      },
      createdAt: new Date("2024-03-12"),
      updatedAt: new Date("2024-03-15"),
    },
  ],
  createdAt: new Date("2024-03-10"),
  updatedAt: new Date("2024-03-16"),
};

export default function CertificateGenerationPage() {
  const router = useRouter();
  const params = useParams();
  const user = useUser();
  const [training, setTraining] = useState<Training>(sampleTraining);
  const [loading, setLoading] = useState(false);

  // Only TT users can access this page
  if (user?.role !== "TT") {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Access Denied
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Only Teacher Trainers can access certificate generation.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleGenerateCertificate = async (registration: TrainingRegistration) => {
    setLoading(true);
    try {
      // In a real app, this would generate and download a PDF certificate
      console.log("Generating certificate for:", registration);
      
      // Simulate certificate generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the registration with certificate info
      setTraining(prev => ({
        ...prev,
        registrations: prev.registrations.map(reg => 
          reg.id === registration.id 
            ? {
                ...reg,
                certificate: {
                  issued: true,
                  certificateId: `CERT-${training.id.toUpperCase()}-${Date.now()}`,
                  issuedAt: new Date(),
                  validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 years
                },
                updatedAt: new Date(),
              }
            : reg
        ),
      }));
      
      alert("Certificate generated successfully!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error generating certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenerateCertificates = async () => {
    const eligibleRegistrations = training.registrations.filter(reg => 
      reg.assessment.passed && !reg.certificate?.issued
    );
    
    if (eligibleRegistrations.length === 0) {
      alert("No eligible participants for certificate generation.");
      return;
    }
    
    if (confirm(`Generate certificates for ${eligibleRegistrations.length} participants?`)) {
      setLoading(true);
      try {
        // Simulate bulk certificate generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setTraining(prev => ({
          ...prev,
          registrations: prev.registrations.map(reg => 
            eligibleRegistrations.some(eligible => eligible.id === reg.id)
              ? {
                  ...reg,
                  certificate: {
                    issued: true,
                    certificateId: `CERT-${training.id.toUpperCase()}-${Date.now()}-${reg.id}`,
                    issuedAt: new Date(),
                    validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 years
                  },
                  updatedAt: new Date(),
                }
              : reg
          ),
        }));
        
        alert(`Successfully generated ${eligibleRegistrations.length} certificates!`);
      } catch (error) {
        console.error("Error generating certificates:", error);
        alert("Error generating certificates. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const breadcrumbItems = [
    { label: "TT Dashboard", href: "/teacher-trainers/dashboard" },
    { label: training.name, href: `/trainings/${training.id}` },
    { label: "Certificates", href: `/teacher-trainers/trainings/${training.id}/certificates` },
  ];

  const eligibleForCertificates = training.registrations.filter(reg => 
    reg.assessment.passed && !reg.certificate?.issued
  );
  const certificatesIssued = training.registrations.filter(reg => 
    reg.certificate?.issued
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certificate Generation</h1>
            <p className="text-gray-600">{training.name}</p>
          </div>
          {eligibleForCertificates.length > 0 && (
            <button 
              onClick={handleBulkGenerateCertificates}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Award className="h-4 w-4" />
              Generate All Certificates ({eligibleForCertificates.length})
            </button>
          )}
        </div>

        {/* Training Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Training Date</p>
                <p className="text-sm text-gray-600">
                  {new Date(training.start).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Trainer</p>
                <p className="text-sm text-gray-600">{training.teacherTrainer.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Certificates Issued</p>
                <p className="text-sm text-gray-600">{certificatesIssued.length}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pending</p>
                <p className="text-sm text-gray-600">{eligibleForCertificates.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Certificates Issued</p>
                <p className="text-2xl font-semibold text-gray-900">{certificatesIssued.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ready for Generation</p>
                <p className="text-2xl font-semibold text-gray-900">{eligibleForCertificates.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Training Participants</h3>
            <div className="space-y-4">
              {training.registrations.map((registration) => {
                const teacher = sampleTeachers.find(t => t.id === registration.teacherId);
                const canGenerate = registration.assessment.passed && !registration.certificate?.issued;
                const hasCertificate = registration.certificate?.issued;
                
                return (
                  <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {hasCertificate ? (
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          ) : canGenerate ? (
                            <Award className="h-8 w-8 text-yellow-600" />
                          ) : (
                            <XCircle className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown Teacher"}
                          </h4>
                          <p className="text-sm text-gray-500">{teacher?.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              registration.assessment.passed 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {registration.assessment.passed ? "Passed" : "Failed"}
                            </span>
                            {registration.assessment.score && (
                              <span className="text-xs text-gray-500">
                                Score: {registration.assessment.score}/{registration.assessment.maxScore}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasCertificate ? (
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">Certificate Issued</p>
                            <p className="text-xs text-gray-500">
                              ID: {registration.certificate?.certificateId}
                            </p>
                            <p className="text-xs text-gray-500">
                              Issued: {registration.certificate?.issuedAt ? new Date(registration.certificate.issuedAt).toLocaleDateString() : "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Valid until: {registration.certificate?.validUntil ? new Date(registration.certificate.validUntil).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        ) : canGenerate ? (
                          <button
                            onClick={() => handleGenerateCertificate(registration)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            <Award className="h-4 w-4" />
                            Generate Certificate
                          </button>
                        ) : (
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Not eligible</p>
                            <p className="text-xs text-gray-400">
                              {!registration.assessment.passed ? "Did not pass assessment" : "Certificate already issued"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
