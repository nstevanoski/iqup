"use client";

import { useState } from "react";
import { LearningGroup, Student } from "@/types";
import { 
  X, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Euro, 
  User, 
  Building, 
  Plus, 
  Trash2, 
  Eye,
  CreditCard,
  Package
} from "lucide-react";
import { AddStudentForm } from "@/components/forms/AddStudentForm";

interface LearningGroupDetailProps {
  learningGroup: LearningGroup;
  onClose: () => void;
  onUpdateStudent: (studentId: string, updates: any) => void;
  onRemoveStudent: (studentId: string) => void;
}

// Sample student data - in a real app, this would come from an API
const sampleStudents: Student[] = [
  {
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
    notes: "Excellent student",
    parentInfo: {
      firstName: "Jane",
      lastName: "Doe",
      phone: "+1-555-1002",
      email: "jane.doe@example.com",
    },
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
    contactOwner: {
      id: "user_1",
      name: "Sarah Wilson",
      role: "LC",
    },
    accountFranchise: {
      id: "franchise_1",
      name: "Boston Learning Center",
      type: "LC",
    },
    mfName: "Northeast Master Franchise",
    programHistory: [
      {
        id: "hist_1",
        programId: "prog_1",
        programName: "English Language Program",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-15"),
        status: "completed",
        grade: 95,
      },
    ],
    payments: [],
    certificates: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "student_2",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice.smith@example.com",
    phone: "+1-555-1003",
    dateOfBirth: new Date("1998-08-22"),
    address: {
      street: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    emergencyContact: {
      email: "bob.smith@example.com",
      phone: "+1-555-1004",
    },
    status: "active",
    enrollmentDate: new Date("2024-01-20"),
    programIds: ["prog_2"],
    subProgramIds: [],
    learningGroupIds: [],
    gender: "female",
    notes: "Quick learner",
    parentInfo: {
      firstName: "Bob",
      lastName: "Smith",
      phone: "+1-555-1004",
      email: "bob.smith@example.com",
    },
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
    contactOwner: {
      id: "user_2",
      name: "Michael Brown",
      role: "LC",
    },
    accountFranchise: {
      id: "franchise_2",
      name: "Seattle Learning Center",
      type: "LC",
    },
    mfName: "Northwest Master Franchise",
    programHistory: [
      {
        id: "hist_2",
        programId: "prog_2",
        programName: "Mathematics Program",
        startDate: new Date("2024-01-20"),
        endDate: new Date("2024-07-20"),
        status: "completed",
        grade: 88,
      },
    ],
    payments: [],
    certificates: [],
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
  return schedule.map(s => `${dayNames[s.dayOfWeek]} ${s.startTime}-${s.endTime}`).join(", ");
};

export function LearningGroupDetail({ learningGroup, onClose, onUpdateStudent, onRemoveStudent }: LearningGroupDetailProps) {
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"students" | "payments">("students");

  const handleAddStudent = (studentData: any) => {
    console.log("Adding student:", studentData);
    // In a real app, this would make an API call
    setShowAddStudentForm(false);
  };

  const handleRemoveStudent = (studentId: string) => {
    if (confirm("Are you sure you want to remove this student from the group?")) {
      onRemoveStudent(studentId);
    }
  };

  const totalRevenue = learningGroup.students.reduce((sum, student) => {
    // In a real app, you'd calculate this based on actual payments
    return sum + learningGroup.pricingSnapshot.finalPrice;
  }, 0);

  const paidStudents = learningGroup.students.filter(s => s.paymentStatus === "paid").length;
  const pendingPayments = learningGroup.students.filter(s => s.paymentStatus === "pending").length;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{learningGroup.name}</h2>
            <p className="text-gray-600 mt-1">{learningGroup.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Group Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Students</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {learningGroup.students.length}/{learningGroup.maxStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Revenue</p>
                  <p className="text-2xl font-bold text-green-900">
                    €{totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Duration</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.ceil((new Date(learningGroup.dates.endDate).getTime() - new Date(learningGroup.dates.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Group Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Start Date:</span>
                  <span className="ml-2 text-sm font-medium">{learningGroup.dates.startDate}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">End Date:</span>
                  <span className="ml-2 text-sm font-medium">{learningGroup.dates.endDate}</span>
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
                  <span className="ml-2 text-sm font-medium">Dr. Sarah Wilson</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ownership & Pricing</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Owner:</span>
                  <span className="ml-2 text-sm font-medium">{learningGroup.owner.name}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Franchisee:</span>
                  <span className="ml-2 text-sm font-medium">{learningGroup.franchisee.name}</span>
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Final Price:</span>
                  <span className="ml-2 text-sm font-medium">€{learningGroup.pricingSnapshot.finalPrice}</span>
                </div>
                <div className="flex items-center">
                  <Euro className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Course Price:</span>
                  <span className="ml-2 text-sm font-medium">€{learningGroup.pricingSnapshot.coursePrice}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="ml-2 text-sm font-medium capitalize">{learningGroup.pricingSnapshot.paymentMethod?.replace('-', ' ')}</span>
                </div>
                {learningGroup.pricingSnapshot.numberOfPayments && learningGroup.pricingSnapshot.numberOfPayments > 1 && (
                  <>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Number of Payments:</span>
                      <span className="ml-2 text-sm font-medium">{learningGroup.pricingSnapshot.numberOfPayments}</span>
                    </div>
                    <div className="flex items-center">
                      <Euro className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Price per Payment:</span>
                      <span className="ml-2 text-sm font-medium">€{learningGroup.pricingSnapshot.pricePerMonth?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Gap Between Payments:</span>
                      <span className="ml-2 text-sm font-medium">{learningGroup.pricingSnapshot.gapBetweenPayments} days</span>
                    </div>
                  </>
                )}
                {learningGroup.pricingSnapshot.discount && (
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Discount:</span>
                    <span className="ml-2 text-sm font-medium text-green-600">-€{learningGroup.pricingSnapshot.discount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("students")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "students"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Students ({learningGroup.students.length})
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

          {/* Students Tab */}
          {activeTab === "students" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
                <button
                  onClick={() => setShowAddStudentForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                    {learningGroup.students.map((studentEnrollment) => {
                      const student = getStudentById(studentEnrollment.studentId);
                      if (!student) return null;

                      return (
                        <tr key={studentEnrollment.studentId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{student.email}</div>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              
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
                  {learningGroup.students.map((studentEnrollment) => {
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
                            ${learningGroup.pricingSnapshot.finalPrice}
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
    </div>
  );
}
