"use client";

import { useState, useEffect } from "react";
import { Student, Product } from "@/types";
import { X, Plus, Save, Loader2, User, Calendar, Package, DollarSign, AlertTriangle } from "lucide-react";
import { 
  calculateStudentProductAssignment, 
  hasSufficientStock, 
  getStockStatus,
  validateInventoryOperation 
} from "@/lib/inventory";

interface AddStudentFormProps {
  learningGroupId: string;
  onAddStudent: (studentData: {
    studentId: string;
    startDate: string;
    endDate: string;
    productId: string;
    paymentStatus: "pending" | "paid" | "partial" | "overdue";
    enrollmentDate: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  studentId: string;
  startDate: string;
  endDate: string;
  productId: string;
  paymentStatus: "pending" | "paid" | "partial" | "overdue";
  enrollmentDate: string;
}

// Sample data - in a real app, this would come from an API
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
  {
    id: "student_3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    phone: "+1-555-1005",
    dateOfBirth: new Date("1993-12-10"),
    address: {
      street: "789 Pine St",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA",
    },
    emergencyContact: {
      email: "sarah.johnson@example.com",
      phone: "+1-555-1006",
    },
    status: "active",
    enrollmentDate: new Date("2024-02-01"),
    programIds: ["prog_3"],
    subProgramIds: [],
    learningGroupIds: [],
    gender: "male",
    notes: "Very motivated",
    parentInfo: {
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "+1-555-1006",
      email: "sarah.johnson@example.com",
    },
    lastCurrentLG: {
      id: "lg_3",
      name: "Science Group",
      programName: "Science Program",
      startDate: new Date("2024-02-01"),
    },
    product: {
      id: "prod_3",
      name: "Science Learning Kit",
      description: "Complete learning materials for Science program",
      materials: ["Textbook", "Lab Kit", "Microscope"],
      purchaseDate: new Date("2024-02-01"),
    },
    contactOwner: {
      id: "user_3",
      name: "David Wilson",
      role: "LC",
    },
    accountFranchise: {
      id: "franchise_3",
      name: "Austin Learning Center",
      type: "LC",
    },
    mfName: "Southwest Master Franchise",
    programHistory: [
      {
        id: "hist_3",
        programId: "prog_3",
        programName: "Science Program",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-08-01"),
        status: "completed",
        grade: 92,
      },
    ],
    payments: [],
    certificates: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

const sampleProducts: Product[] = [
  {
    id: "product_1",
    name: "English Grammar Workbook",
    description: "Comprehensive grammar exercises for English learners",
    category: "Books",
    price: 29.99,
    cost: 15.00,
    sku: "EGW-001",
    status: "active",
    tags: ["grammar", "workbook", "english"],
    images: ["grammar-workbook.jpg"],
    specifications: {
      pages: 200,
      language: "English",
      level: "Intermediate",
    },
    code: "EGW-001",
    qty: 100,
    minStock: 10,
    maxStock: 200,
    unit: "pieces",
    supplier: "Educational Books Inc.",
    markup: 100,
    sellingPrice: 29.99,
    productLists: ["list_1", "list_2"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "product_2",
    name: "Mathematics Study Guide",
    description: "Complete mathematics study guide with practice problems",
    category: "Books",
    price: 39.99,
    cost: 20.00,
    sku: "MSG-001",
    status: "active",
    tags: ["mathematics", "study", "guide"],
    images: ["math-guide.jpg"],
    specifications: {
      pages: 300,
      level: "Advanced",
    },
    code: "MSG-001",
    qty: 75,
    minStock: 15,
    maxStock: 150,
    unit: "pieces",
    supplier: "Math Publishers Ltd.",
    markup: 100,
    sellingPrice: 39.99,
    productLists: ["list_1", "list_3"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "product_3",
    name: "Physics Lab Kit",
    description: "Complete physics experiment kit for hands-on learning",
    category: "Equipment",
    price: 149.99,
    cost: 75.00,
    sku: "PLK-001",
    status: "active",
    tags: ["physics", "lab", "equipment"],
    images: ["physics-kit.jpg"],
    specifications: {
      weight: "2.5kg",
      experiments: 15,
      level: "Advanced",
    },
    code: "PLK-001",
    qty: 25,
    minStock: 5,
    maxStock: 50,
    unit: "kits",
    supplier: "Science Equipment Co.",
    markup: 100,
    sellingPrice: 149.99,
    productLists: ["list_2", "list_3"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

const initialFormData: FormData = {
  studentId: "",
  startDate: "",
  endDate: "",
  productId: "",
  paymentStatus: "pending",
  enrollmentDate: new Date().toISOString().split('T')[0],
};

export function AddStudentForm({ learningGroupId, onAddStudent, onCancel, loading = false }: AddStudentFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stockWarnings, setStockWarnings] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }

    // Check stock availability when product changes
    if (field === "productId" && value) {
      const product = sampleProducts.find(p => p.id === value);
      if (product) {
        setSelectedProduct(product);
        const stockStatus = getStockStatus(product);
        if (stockStatus.status === "out_of_stock") {
          setStockWarnings([`${product.name} is out of stock`]);
        } else if (stockStatus.status === "low_stock") {
          setStockWarnings([`${product.name} is low on stock (${product.qty} remaining)`]);
        } else {
          setStockWarnings([]);
        }
      }
    }
  };

  const handleStudentSelect = (studentId: string) => {
    const student = sampleStudents.find(s => s.id === studentId);
    setSelectedStudent(student || null);
    handleInputChange("studentId", studentId);
  };

  const handleProductSelect = (productId: string) => {
    const product = sampleProducts.find(p => p.id === productId);
    setSelectedProduct(product || null);
    handleInputChange("productId", productId);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) newErrors.studentId = "Student is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.productId) newErrors.productId = "Product is required";
    if (!formData.enrollmentDate) newErrors.enrollmentDate = "Enrollment date is required";

    // Validate date logic
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    // Check stock availability
    if (formData.productId) {
      const product = sampleProducts.find(p => p.id === formData.productId);
      if (product && !hasSufficientStock(product, 1)) {
        newErrors.productId = `${product.name} is out of stock`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onAddStudent(formData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Student to Learning Group
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Select Student *
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => handleStudentSelect(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.studentId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Choose a student...</option>
              {sampleStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - {student.email}
                </option>
              ))}
            </select>
            {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
            
            {selectedStudent && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <div className="text-sm">
                  <div className="font-medium text-blue-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </div>
                  <div className="text-blue-700">
                    {selectedStudent.email} • {selectedStudent.phone}
                  </div>
                  <div className="text-blue-600 text-xs mt-1">
                    Status: {selectedStudent.status} • Enrolled: {selectedStudent.enrollmentDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 inline mr-1" />
              Assign Product *
            </label>
            <select
              value={formData.productId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.productId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Choose a product...</option>
              {sampleProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price} (Stock: {product.qty})
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
            
            {selectedProduct && (
              <div className="mt-3 p-3 bg-green-50 rounded-md">
                <div className="text-sm">
                  <div className="font-medium text-green-900">
                    {selectedProduct.name}
                  </div>
                  <div className="text-green-700">
                    {selectedProduct.description}
                  </div>
                  <div className="text-green-600 text-xs mt-1">
                    Price: €{selectedProduct.price} • SKU: {selectedProduct.sku} • Stock: {selectedProduct.qty}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Date *
              </label>
              <input
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => handleInputChange("enrollmentDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.enrollmentDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.enrollmentDate && <p className="text-red-500 text-sm mt-1">{errors.enrollmentDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => handleInputChange("paymentStatus", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Inventory Impact Notice */}
          {selectedProduct && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Inventory Impact
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Assigning this product will decrement the LC inventory by 1 unit.
                      Current stock: {selectedProduct.qty} units.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stock Warnings */}
          {stockWarnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Stock Warning
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside">
                      {stockWarnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
