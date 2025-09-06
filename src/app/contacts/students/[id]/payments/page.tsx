"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DataTable, Column } from "@/components/ui/DataTable";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { Student, StudentPayment } from "@/types";
import { ArrowLeft, Plus, Edit, Trash2, DollarSign, Calendar, CreditCard, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface StudentPaymentsPageProps {
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
  notes: "Excellent student",
  parentInfo: {
    firstName: "Jane",
    lastName: "Doe",
    phone: "+1-555-1002",
    email: "jane.doe@example.com",
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

const mockPayments: StudentPayment[] = [
  {
    id: "payment_1",
    studentId: "student_1",
    learningGroupId: "lg_1",
    learningGroupName: "English Beginners Group A",
    month: "2024-01",
    amount: 99.99,
    dueDate: new Date("2024-01-31"),
    paymentDate: new Date("2024-01-25"),
    status: "paid",
    paymentMethod: "bank_transfer",
    reference: "TXN-001234",
    notes: "Payment received on time",
    createdBy: "user_1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "payment_2",
    studentId: "student_1",
    learningGroupId: "lg_1",
    learningGroupName: "English Beginners Group A",
    month: "2024-02",
    amount: 99.99,
    dueDate: new Date("2024-02-29"),
    paymentDate: new Date("2024-02-28"),
    status: "paid",
    paymentMethod: "cash",
    reference: "CASH-001",
    notes: "Cash payment at center",
    createdBy: "user_1",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-28"),
  },
  {
    id: "payment_3",
    studentId: "student_1",
    learningGroupId: "lg_1",
    learningGroupName: "English Beginners Group A",
    month: "2024-03",
    amount: 99.99,
    dueDate: new Date("2024-03-31"),
    status: "pending",
    createdBy: "user_1",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "payment_4",
    studentId: "student_1",
    learningGroupId: "lg_1",
    learningGroupName: "English Beginners Group A",
    month: "2024-04",
    amount: 99.99,
    dueDate: new Date("2024-04-30"),
    status: "overdue",
    createdBy: "user_1",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
  },
];

// Helper function to validate payment object
const validatePayment = (payment: any): StudentPayment => {
  return {
    id: payment.id || `payment_${Date.now()}`,
    studentId: payment.studentId || "",
    learningGroupId: payment.learningGroupId || "",
    learningGroupName: payment.learningGroupName || "",
    month: payment.month || "",
    amount: payment.amount || 0,
    dueDate: payment.dueDate || new Date(),
    paymentDate: payment.paymentDate || undefined,
    status: payment.status || "pending",
    paymentMethod: payment.paymentMethod || undefined,
    reference: payment.reference || "",
    notes: payment.notes || "",
    discount: payment.discount || undefined,
    createdBy: payment.createdBy || "",
    createdAt: payment.createdAt || new Date(),
    updatedAt: payment.updatedAt || new Date(),
  };
};

export default function StudentPaymentsPage({ params }: StudentPaymentsPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [payments, setPayments] = useState<StudentPayment[]>(
    mockPayments.map(payment => validatePayment(payment))
  );
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<StudentPayment | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchStudent = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        setStudent(mockStudent);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [resolvedParams.id]);

  const getStatusIcon = (status: string | undefined | null) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "partial":
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case "waived":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Helper function to safely format currency
  const formatCurrency = (amount: number | undefined | null): string => {
    return `$${(amount || 0).toFixed(2)}`;
  };

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
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-blue-100 text-blue-800";
      case "waived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case "bank_transfer":
        return <CreditCard className="h-4 w-4" />;
      case "cash":
        return <DollarSign className="h-4 w-4" />;
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const columns: Column<StudentPayment>[] = [
    {
      key: "month",
      label: "Month",
      render: (payment) => {
        try {
          return (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium">{payment?.month || "-"}</span>
            </div>
          );
        } catch (error) {
          console.warn("Error rendering payment month:", error, "Payment:", payment);
          return (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium">-</span>
            </div>
          );
        }
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (payment) => {
        try {
          return (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium">{formatCurrency(payment?.amount)}</span>
            </div>
          );
        } catch (error) {
          console.warn("Error rendering payment amount:", error, "Payment:", payment);
          return (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium">$0.00</span>
            </div>
          );
        }
      },
    },
    {
      key: "status",
      label: "Status",
      render: (payment) => {
        try {
          return (
            <div className="flex items-center">
              {getStatusIcon(payment?.status)}
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment?.status)}`}>
                {formatStatus(payment?.status)}
              </span>
            </div>
          );
        } catch (error) {
          console.warn("Error rendering payment status:", error, "Payment:", payment);
          return (
            <div className="flex items-center">
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Unknown
              </span>
            </div>
          );
        }
      },
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (payment) => {
        try {
          return (
            <span className="text-sm text-gray-900">
              {formatDate(payment?.dueDate)}
            </span>
          );
        } catch (error) {
          console.warn("Error rendering due date:", error, "Payment:", payment);
          return (
            <span className="text-sm text-gray-900">-</span>
          );
        }
      },
    },
    {
      key: "paymentDate",
      label: "Payment Date",
      render: (payment) => {
        try {
          return (
            <span className="text-sm text-gray-900">
              {formatDate(payment?.paymentDate)}
            </span>
          );
        } catch (error) {
          console.warn("Error rendering payment date:", error, "Payment:", payment);
          return (
            <span className="text-sm text-gray-900">-</span>
          );
        }
      },
    },
    {
      key: "paymentMethod",
      label: "Method",
      render: (payment) => {
        try {
          return (
            <div className="flex items-center">
              {getPaymentMethodIcon(payment?.paymentMethod)}
              <span className="ml-2 text-sm text-gray-900">
                {payment?.paymentMethod ? payment.paymentMethod.replace("_", " ").toUpperCase() : "-"}
              </span>
            </div>
          );
        } catch (error) {
          console.warn("Error rendering payment method:", error, "Payment:", payment);
          return (
            <div className="flex items-center">
              <span className="text-sm text-gray-900">-</span>
            </div>
          );
        }
      },
    },
    {
      key: "reference",
      label: "Reference",
      render: (payment) => {
        try {
          return (
            <span className="text-sm text-gray-900">
              {payment?.reference || "-"}
            </span>
          );
        } catch (error) {
          console.warn("Error rendering payment reference:", error, "Payment:", payment);
          return (
            <span className="text-sm text-gray-900">-</span>
          );
        }
      },
    },
  ];

  const handleRowAction = (action: string, payment: StudentPayment) => {
    switch (action) {
      case "edit":
        setEditingPayment(payment);
        setShowPaymentForm(true);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete payment for ${payment.month}?`)) {
          setPayments(prev => prev.filter(p => p.id !== payment.id));
        }
        break;
    }
  };

  const handlePaymentSubmit = async (data: Partial<StudentPayment>) => {
    try {
      if (editingPayment) {
        // Update existing payment
        setPayments(prev => prev.map(p => 
          p.id === editingPayment.id 
            ? { ...p, ...data, updatedAt: new Date() }
            : p
        ));
      } else {
        // Create new payment
        const newPayment: StudentPayment = {
          id: `payment_${Date.now()}`,
          studentId: resolvedParams.id,
          learningGroupId: "lg_1",
          learningGroupName: "English Beginners Group A",
          createdBy: "user_1",
          createdAt: new Date(),
          updatedAt: new Date(),
          amount: data.amount || 0,
          status: data.status || "pending",
          ...data,
        } as StudentPayment;
        
        setPayments(prev => [...prev, newPayment]);
      }
      
      setShowPaymentForm(false);
      setEditingPayment(null);
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment. Please try again.");
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setEditingPayment(null);
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

  if (showPaymentForm) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Students", href: "/contacts/students" },
              { label: `${student.firstName} ${student.lastName}`, href: `/contacts/students/${resolvedParams.id}` },
              { label: "Payments", href: `/contacts/students/${resolvedParams.id}/payments` },
              { label: editingPayment ? "Edit Payment" : "New Payment" }
            ]}
          />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePaymentCancel}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingPayment ? "Edit Payment" : "New Payment"}
                </h1>
                <p className="text-gray-600">
                  {editingPayment ? "Update payment information" : "Record a new payment"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <PaymentForm
            payment={editingPayment || undefined}
            onSubmit={handlePaymentSubmit}
            onCancel={handlePaymentCancel}
          />
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
            { label: "Payments" }
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
                Payments - {student.firstName} {student.lastName}
              </h1>
              <p className="text-gray-600">Manage student payment records</p>
            </div>
          </div>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Payment
          </button>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payments.filter(p => p.status === "paid").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payments.filter(p => p.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payments.filter(p => p.status === "overdue").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(payments.reduce((sum, p) => sum + (p.amount || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
          </div>
          <div className="p-6">
            <DataTable
              data={payments}
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
