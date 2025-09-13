"use client";

import { useState } from "react";
import { Student, Program, SubProgram, LearningGroup } from "@/types";
import { useUser, useSelectedScope } from "@/store/auth";

interface StudentFormProps {
  student?: Student;
  programs: Program[];
  subPrograms: SubProgram[];
  learningGroups: LearningGroup[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  parentInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  // emergencyContact removed per requirements
  status: "active" | "inactive" | "graduated" | "suspended";
  enrollmentDate?: string;
  lastCurrentLG?: {
    id: string;
    name: string;
    programName: string;
    startDate: string;
    endDate?: string;
  };
  product?: {
    id: string;
    name: string;
    description: string;
    materials: string[];
    purchaseDate: string;
  };
  contactOwner: {
    id: string;
    name: string;
    role: "HQ" | "MF" | "LC";
  };
  accountFranchise: {
    id: string;
    name: string;
    type: "MF" | "LC";
  };
  mfName: string;
  notes: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "male",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  parentInfo: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  },
  // emergencyContact removed per requirements
  status: "active",
  enrollmentDate: undefined,
  lastCurrentLG: undefined,
  product: undefined,
  contactOwner: {
    id: "",
    name: "",
    role: "LC",
  },
  accountFranchise: {
    id: "",
    name: "",
    type: "LC",
  },
  mfName: "",
  notes: "",
};

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "graduated", label: "Graduated" },
  { value: "suspended", label: "Suspended" },
];

const paymentMethods = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
];

export function StudentForm({ 
  student, 
  programs, 
  subPrograms, 
  learningGroups, 
  onSubmit, 
  onCancel, 
  loading = false 
}: StudentFormProps) {
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [formData, setFormData] = useState<FormData>(
    student ? {
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: typeof student.dateOfBirth === 'string' ? student.dateOfBirth.split('T')[0] : student.dateOfBirth.toISOString().split('T')[0],
      gender: student.gender.toLowerCase() as "male" | "female" | "other",
      address: {
        street: student.address || '',
        city: student.city || '',
        state: student.state || '',
        zipCode: student.postalCode || '',
        country: student.country || '',
      },
      parentInfo: {
        firstName: student.parentFirstName,
        lastName: student.parentLastName,
        phone: student.parentPhone,
        email: student.parentEmail,
      },
      // emergencyContact removed per requirements
      status: student.status.toLowerCase() as "active" | "inactive" | "graduated" | "suspended",
      enrollmentDate: student.enrollmentDate ? (typeof student.enrollmentDate === 'string' ? student.enrollmentDate.split('T')[0] : student.enrollmentDate.toISOString().split('T')[0]) : undefined,
      lastCurrentLG: student.lastCurrentLG ? {
        ...student.lastCurrentLG,
        startDate: new Date(student.lastCurrentLG.startDate as any).toISOString().split('T')[0],
        endDate: student.lastCurrentLG.endDate ? new Date(student.lastCurrentLG.endDate as any).toISOString().split('T')[0] : undefined,
      } : undefined,
      product: student.product ? {
        ...student.product,
        purchaseDate: new Date(student.product.purchaseDate as any).toISOString().split('T')[0],
      } : undefined,
      contactOwner: {
        id: user?.id || '',
        name: user?.name || '',
        role: (user?.role === "HQ" || user?.role === "MF" || user?.role === "LC") ? user.role : "LC"
      },
      accountFranchise: {
        id: student.lc.id.toString(),
        name: student.lc.name,
        type: "LC" as const
      },
      mfName: student.mf.name,
      notes: student.notes || "",
    } : {
      ...initialFormData,
      // Auto-fill organizational info for LC users based on current session
      contactOwner: user ? { id: user.id, name: user.name, role: (user.role === "HQ" || user.role === "MF" || user.role === "LC") ? user.role : "LC" } : initialFormData.contactOwner,
      accountFranchise: selectedScope ? { id: selectedScope.id, name: selectedScope.name, type: selectedScope.type === "MF" ? "MF" : "LC" } : initialFormData.accountFranchise,
      mfName: selectedScope?.type === "LC" && selectedScope.parentMF ? selectedScope.parentMF.name : initialFormData.mfName,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.parentInfo.firstName.trim()) {
      newErrors.parentFirstName = "Parent first name is required";
    }
    if (!formData.parentInfo.lastName.trim()) {
      newErrors.parentLastName = "Parent last name is required";
    }
    if (!formData.parentInfo.phone.trim()) {
      newErrors.parentPhone = "Parent phone is required";
    }
    if (!formData.parentInfo.email.trim()) {
      newErrors.parentEmail = "Parent email is required";
    }
    if (!formData.contactOwner.id) {
      newErrors.contactOwner = "Contact owner is required";
    }
    if (!formData.accountFranchise.id) {
      newErrors.accountFranchise = "Account/Franchise is required";
    }
    if (!formData.mfName.trim()) {
      newErrors.mfName = "MF Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as any || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
      enrollmentDate: formData.enrollmentDate ? new Date(formData.enrollmentDate) : undefined,
      lastCurrentLG: formData.lastCurrentLG ? {
        ...formData.lastCurrentLG,
        startDate: new Date(formData.lastCurrentLG.startDate),
        endDate: formData.lastCurrentLG.endDate ? new Date(formData.lastCurrentLG.endDate) : undefined,
      } : undefined,
      product: formData.product ? {
        ...formData.product,
        purchaseDate: new Date(formData.product.purchaseDate),
      } : undefined,
      programIds: [],
      subProgramIds: [],
      learningGroupIds: [],
      programHistory: [],
      payments: [],
      certificates: [],
    };

    onSubmit(submitData);
  };

  const canEdit = user?.role === "LC";

  if (!canEdit) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          You don't have permission to create or edit students.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {genderOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Enrollment Date removed per requirements */}
        </div>
      </div>

      {/* Parent Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Parent Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent First Name *
            </label>
            <input
              type="text"
              value={formData.parentInfo.firstName}
              onChange={(e) => handleInputChange("parentInfo.firstName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.parentFirstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter parent first name"
            />
            {errors.parentFirstName && <p className="text-red-500 text-sm mt-1">{errors.parentFirstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Last Name *
            </label>
            <input
              type="text"
              value={formData.parentInfo.lastName}
              onChange={(e) => handleInputChange("parentInfo.lastName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.parentLastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter parent last name"
            />
            {errors.parentLastName && <p className="text-red-500 text-sm mt-1">{errors.parentLastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Phone *
            </label>
            <input
              type="tel"
              value={formData.parentInfo.phone}
              onChange={(e) => handleInputChange("parentInfo.phone", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.parentPhone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter parent phone number"
            />
            {errors.parentPhone && <p className="text-red-500 text-sm mt-1">{errors.parentPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Email *
            </label>
            <input
              type="email"
              value={formData.parentInfo.email}
              onChange={(e) => handleInputChange("parentInfo.email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.parentEmail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter parent email"
            />
            {errors.parentEmail && <p className="text-red-500 text-sm mt-1">{errors.parentEmail}</p>}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => handleInputChange("address.street", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter street address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => handleInputChange("address.city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => handleInputChange("address.state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.address.zipCode}
              onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter ZIP code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.address.country}
              onChange={(e) => handleInputChange("address.country", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter country"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact removed per requirements */}

      {/* Organizational Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Organizational Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Owner *
            </label>
            <input
              type="text"
              value={formData.contactOwner.name || ""}
              disabled
              className={`w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700 ${
                errors.contactOwner ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.contactOwner && <p className="text-red-500 text-sm mt-1">{errors.contactOwner}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account/Franchise Name *
            </label>
            <input
              type="text"
              value={formData.accountFranchise.name || ""}
              disabled
              className={`w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700 ${
                errors.accountFranchise ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.accountFranchise && <p className="text-red-500 text-sm mt-1">{errors.accountFranchise}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MF Name *
            </label>
            <input
              type="text"
              value={formData.mfName}
              onChange={(e) => handleInputChange("mfName", e.target.value)}
              disabled={user?.role === "LC"}
              className={`w-full px-3 py-2 border rounded-md ${user?.role === "LC" ? "bg-gray-50 text-gray-700" : "focus:outline-none focus:ring-2 focus:ring-blue-500"} ${
                errors.mfName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={user?.role === "LC" ? "Auto-filled from your parent MF" : "Enter Master Franchisor name"}
            />
            {errors.mfName && <p className="text-red-500 text-sm mt-1">{errors.mfName}</p>}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter any additional notes about the student"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : student ? "Update Student" : "Create Student"}
        </button>
      </div>
    </form>
  );
}
