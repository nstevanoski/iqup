"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AddStudentForm } from "@/components/forms/AddStudentForm";
import { LearningGroup, Student } from "@/types";
import { getLearningGroup } from "@/lib/api/learning-groups";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  Building, 
  Plus, 
  Trash2, 
  Eye,
  CreditCard,
  Package,
  Edit,
  Settings
} from "lucide-react";

// Sample student data - in a real app, this would come from an API
const sampleStudents: Student[] = [
  {
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
    lastCurrentLG: {
      id: "lg_1",
      name: "Advanced English Group",
      programName: "English Language Program",
      startDate: new Date("2024-01-15"),
    },
    product: {
      id: "prod_1",
      name: "English Learning Kit",
      description: "Complete learning materials for English program",
      materials: ["Textbook", "Workbook", "Audio CD"],
      purchaseDate: new Date("2024-01-15"),
    },
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
  },
  {
    id: "student_2",
    firstName: "Alice",
    lastName: "Smith",
    dateOfBirth: new Date("1998-08-22"),
    address: "456 Oak Ave",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "USA",
    emergencyContactEmail: "bob.smith@example.com",
    emergencyContactPhone: "+1-555-1004",
    status: "ACTIVE",
    enrollmentDate: new Date("2024-01-20"),
    gender: "FEMALE",
    parentFirstName: "Bob",
    parentLastName: "Smith",
    parentPhone: "+1-555-1004",
    parentEmail: "bob.smith@example.com",
    lastCurrentLG: {
      id: "lg_2",
      name: "Mathematics Group",
      programName: "Mathematics Program",
      startDate: new Date("2024-01-20"),
    },
    product: {
      id: "prod_2",
      name: "Math Learning Kit",
      description: "Complete learning materials for Mathematics program",
      materials: ["Textbook", "Calculator", "Graph Paper"],
      purchaseDate: new Date("2024-01-20"),
    },
    lcId: 2,
    mfId: 2,
    hqId: 1,
    lc: {
      id: 2,
      name: "Seattle Learning Center",
      code: "SLC001",
    },
    mf: {
      id: 2,
      name: "Northwest MF",
      code: "NWMF001",
    },
    hq: {
      id: 1,
      name: "IQ UP HQ",
      code: "IQHQ001",
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
  },
];

const getStudentById = (studentId: string): Student | undefined => {
  return sampleStudents.find(s => s.id === studentId);
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "partial":
      return "bg-yellow-100 text-yellow-800";
    case "pending":
      return "bg-blue-100 text-blue-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatSchedule = (schedule: LearningGroup["schedule"]): string => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Handle case where schedule might be a JSON string from the database
  let scheduleArray: Array<{dayOfWeek: number, startTime: string, endTime: string}>;
  
  if (typeof schedule === 'string') {
    try {
      scheduleArray = JSON.parse(schedule);
    } catch (error) {
      console.error('Error parsing schedule:', error);
      return 'Invalid schedule';
    }
  } else if (Array.isArray(schedule)) {
    scheduleArray = schedule;
  } else {
    return 'No schedule';
  }
  
  if (!scheduleArray || scheduleArray.length === 0) {
    return 'No schedule';
  }
  
  return scheduleArray.map(s => `${dayNames[s.dayOfWeek]} ${s.startTime}-${s.endTime}`).join(", ");
};

export default function LearningGroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  
  const [learningGroup, setLearningGroup] = useState<LearningGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"students" | "payments">("students");

  // Sample learning group data - in a real app, this would come from an API
  const sampleLearningGroup: LearningGroup = {
    id: groupId,
    name: "Advanced English Group A",
    description: "Advanced English conversation and writing group",
    programId: "prog_1",
    subProgramId: "sub_1",
    teacherId: "teacher_1",
    studentIds: ["student_1", "student_2"],
    maxStudents: 15,
    status: "active",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-31"),
    schedule: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "12:00" },
    ],
    location: "Main Campus",
    notes: "Focus on advanced conversation skills",
    dates: {
      startDate: "2024-02-01",
      endDate: "2024-05-31",
    },
    pricingSnapshot: {
      pricingModel: "installments",
      coursePrice: 399.98,
      numberOfPayments: 3,
      gap: 1,
      pricePerMonth: 133.33,
      pricePerSession: undefined,
    },
    owner: {
      id: "owner_1",
      name: "Sarah Wilson",
      role: "Program Director",
    },
    franchisee: {
      id: "franchisee_1",
      name: "Boston Learning Center",
      location: "Boston, MA",
    },
    students: [
      {
        studentId: "student_1",
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        productId: "product_1",
        paymentStatus: "paid",
        enrollmentDate: "2024-01-15",
      },
      {
        studentId: "student_2",
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        productId: "product_1",
        paymentStatus: "partial",
        enrollmentDate: "2024-01-20",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  };

  useEffect(() => {
    // Fetch learning group from API
    const fetchLearningGroupData = async () => {
      setLoading(true);
      try {
        const data = await getLearningGroup(groupId);
        setLearningGroup(data);
      } catch (error) {
        console.error("Error fetching learning group:", error);
        // You might want to show a toast notification here
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchLearningGroupData();
    }
  }, [groupId]);

  const handleAddStudent = (studentData: any) => {
    console.log("Adding student:", studentData);
    // In a real app, this would make an API call
    setShowAddStudentForm(false);
  };

  const handleRemoveStudent = (studentId: string) => {
    if (confirm("Are you sure you want to remove this student from the group?")) {
      // In a real app, this would make an API call
      console.log("Removing student:", studentId);
    }
  };

  const handleEditGroup = () => {
    router.push(`/learning-groups/${groupId}/edit`);
  };

  const handleBack = () => {
    router.push("/learning-groups");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading learning group...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!learningGroup) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Learning Group Not Found</h1>
          <p className="text-gray-600 mb-6">The learning group you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Learning Groups
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Parse students data if it's a string
  interface StudentEnrollment {
    studentId: string;
    enrollmentDate: string;
    paymentStatus: string;
    paymentHistory?: any[];
    productId?: string;
  }
  
  let studentsArray: StudentEnrollment[] = [];
  if (typeof learningGroup.students === 'string') {
    try {
      studentsArray = JSON.parse(learningGroup.students);
    } catch (error) {
      console.error('Error parsing students data:', error);
      studentsArray = [];
    }
  } else if (Array.isArray(learningGroup.students)) {
    studentsArray = learningGroup.students;
  }

  // Parse pricing snapshot if it's a string
  interface PricingSnapshot {
    coursePrice: number;
    pricingModel?: string;
    numberOfPayments?: number;
    gap?: number;
    pricePerMonth?: number;
    pricePerSession?: number;
  }
  
  let pricingSnapshot: PricingSnapshot = { coursePrice: 0 };
  if (typeof learningGroup.pricingSnapshot === 'string') {
    try {
      pricingSnapshot = JSON.parse(learningGroup.pricingSnapshot);
    } catch (error) {
      console.error('Error parsing pricing snapshot:', error);
    }
  } else if (learningGroup.pricingSnapshot && typeof learningGroup.pricingSnapshot === 'object') {
    pricingSnapshot = learningGroup.pricingSnapshot as PricingSnapshot;
  }

  const totalRevenue = studentsArray.reduce((sum: number, student: StudentEnrollment) => {
    return sum + (pricingSnapshot.coursePrice || 0);
  }, 0);

  const paidStudents = studentsArray.filter((s: StudentEnrollment) => s.paymentStatus === "paid").length;
  const pendingPayments = studentsArray.filter((s: StudentEnrollment) => s.paymentStatus === "pending").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Learning Groups", href: "/learning-groups" },
            { label: learningGroup.name }
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
              <h1 className="text-2xl font-bold text-gray-900">{learningGroup.name}</h1>
              <p className="text-gray-600">{learningGroup.description}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEditGroup}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Group
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Group Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Students</p>
                <p className="text-2xl font-bold text-blue-900">
                  {studentsArray.length}/{learningGroup.maxStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Revenue</p>
                <p className="text-2xl font-bold text-green-900">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Duration</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.ceil((new Date(learningGroup.endDate).getTime() - new Date(learningGroup.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Group Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Start Date:</span>
                <span className="ml-2 text-sm font-medium">{new Date(learningGroup.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">End Date:</span>
                <span className="ml-2 text-sm font-medium">{new Date(learningGroup.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Schedule:</span>
                <span className="ml-2 text-sm font-medium">{formatSchedule(learningGroup.schedule)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Location:</span>
                <span className="ml-2 text-sm font-medium">{learningGroup.location}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Teacher:</span>
                <span className="ml-2 text-sm font-medium">Sarah Wilson</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ownership & Pricing</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Owner:</span>
                <span className="ml-2 text-sm font-medium">
                  {learningGroup.owner ? learningGroup.owner.name : 'Not assigned'}
                </span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Franchisee:</span>
                <span className="ml-2 text-sm font-medium">
                  {learningGroup.franchisee ? learningGroup.franchisee.name : 'Not assigned'}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Course Price:</span>
                <span className="ml-2 text-sm font-medium">${pricingSnapshot.coursePrice}</span>
              </div>
              {pricingSnapshot.pricingModel === "installments" && pricingSnapshot.numberOfPayments && (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Payments:</span>
                  <span className="ml-2 text-sm font-medium text-blue-600">{pricingSnapshot.numberOfPayments} installments</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("students")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "students"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Students ({studentsArray.length})
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "payments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <CreditCard className="h-4 w-4 inline mr-2" />
                Payments
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Students Tab */}
            {activeTab === "students" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
                  <button
                    onClick={() => setShowAddStudentForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Student
                  </button>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrollment Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentsArray.map((studentEnrollment: StudentEnrollment) => {
                        const student = getStudentById(studentEnrollment.studentId);
                        if (!student) return null;

                        return (
                          <tr key={studentEnrollment.studentId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {studentEnrollment.enrollmentDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Package className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">Product #{studentEnrollment.productId}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(studentEnrollment.paymentStatus)}`}>
                                {studentEnrollment.paymentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleRemoveStudent(studentEnrollment.studentId)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Paid Students</div>
                    <div className="text-2xl font-bold text-green-900">{paidStudents}</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-yellow-600">Pending Payments</div>
                    <div className="text-2xl font-bold text-yellow-900">{pendingPayments}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Total Revenue</div>
                    <div className="text-2xl font-bold text-blue-900">${totalRevenue.toFixed(2)}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Payment Details</h4>
                  <div className="space-y-3">
                    {studentsArray.map((studentEnrollment: StudentEnrollment) => {
                      const student = getStudentById(studentEnrollment.studentId);
                      if (!student) return null;

                      return (
                        <div key={studentEnrollment.studentId} className="flex justify-between items-center p-3 bg-white rounded border">
                          <div>
                            <div className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">Enrolled: {studentEnrollment.enrollmentDate}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              ${pricingSnapshot.coursePrice}
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(studentEnrollment.paymentStatus)}`}>
                              {studentEnrollment.paymentStatus}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Student Form Modal */}
        {showAddStudentForm && (
          <AddStudentForm
            learningGroupId={learningGroup.id}
            onAddStudent={handleAddStudent}
            onCancel={() => setShowAddStudentForm(false)}
            loading={false}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
