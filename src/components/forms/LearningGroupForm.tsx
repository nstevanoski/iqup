"use client";

import { useState, useEffect } from "react";
import { LearningGroup } from "@/types";
import { X, Plus, Trash2, Save, Loader2, Calendar, Clock, MapPin, Euro, Users } from "lucide-react";

interface LearningGroupFormProps {
  learningGroup?: LearningGroup;
  onSubmit: (learningGroup: Omit<LearningGroup, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  name: string;
  description: string;
  programId: string;
  subProgramId?: string;
  teacherId: string;
  maxStudents: number;
  status: "active" | "inactive" | "completed" | "cancelled";
  location: string;
  notes: string;
  dates: {
    startDate: string;
    endDate: string;
  };
  pricingSnapshot: {
    pricingModel: "per_course" | "per_month" | "per_session" | "subscription" | "program_price" | "one-time" | "installments";
    coursePrice: number;
    numberOfPayments?: number;
    gap?: number;
    pricePerMonth?: number;
    pricePerSession?: number;
  };
  owner: {
    id: string;
    name: string;
    role: string;
  };
  franchisee: {
    id: string;
    name: string;
    location: string;
  };
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

const initialFormData: FormData = {
  name: "",
  description: "",
  programId: "",
  subProgramId: "",
  teacherId: "",
  maxStudents: 20,
  status: "active",
  location: "",
  notes: "",
  dates: {
    startDate: "",
    endDate: "",
  },
  pricingSnapshot: {
    pricingModel: "per_course",
    coursePrice: 0,
    numberOfPayments: undefined,
    gap: undefined,
    pricePerMonth: undefined,
    pricePerSession: undefined,
  },
  owner: {
    id: "",
    name: "",
    role: "",
  },
  franchisee: {
    id: "",
    name: "",
    location: "",
  },
  schedule: [],
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function LearningGroupForm({ learningGroup, onSubmit, onCancel, loading = false }: LearningGroupFormProps) {
  const [formData, setFormData] = useState<FormData>(
    learningGroup ? {
      name: learningGroup.name,
      description: learningGroup.description,
      programId: learningGroup.programId,
      subProgramId: learningGroup.subProgramId || "",
      teacherId: learningGroup.teacherId,
      maxStudents: learningGroup.maxStudents,
      status: learningGroup.status,
      location: learningGroup.location,
      notes: learningGroup.notes || "",
      dates: learningGroup.dates,
      pricingSnapshot: learningGroup.pricingSnapshot,
      owner: learningGroup.owner,
      franchisee: learningGroup.franchisee,
      schedule: learningGroup.schedule,
    } : initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-assign owner and franchisee based on current user (mock implementation)
  useEffect(() => {
    if (!learningGroup) {
      // Mock current user data - in real app, this would come from auth context
      const currentUser = {
        id: "current_user_1",
        name: "Sarah Wilson",
        role: "LC Manager",
        franchisee: {
          id: "franchisee_1",
          name: "Boston Learning Center",
          location: "Boston, MA"
        }
      };

      setFormData(prev => ({
        ...prev,
        owner: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
        },
        franchisee: {
          id: currentUser.franchisee.id,
          name: currentUser.franchisee.name,
          location: currentUser.franchisee.location,
        },
      }));
    }
  }, [learningGroup]);

  // No derived totals; pricing mirrors SubProgram fields
  useEffect(() => {}, [
    formData.pricingSnapshot.pricingModel,
    formData.pricingSnapshot.coursePrice,
    formData.pricingSnapshot.pricePerMonth,
    formData.pricingSnapshot.pricePerSession,
    formData.pricingSnapshot.numberOfPayments,
    formData.pricingSnapshot.gap,
  ]);

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
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof FormData] as Record<string, any>),
        [field]: value,
      },
    }));
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }],
    }));
  };

  const removeScheduleSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  const updateScheduleSlot = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Group name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.programId) newErrors.programId = "Program is required";
    if (!formData.teacherId) newErrors.teacherId = "Teacher is required";
    if (formData.maxStudents < 1) newErrors.maxStudents = "Max students must be at least 1";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.dates.startDate) newErrors["dates.startDate"] = "Start date is required";
    if (!formData.dates.endDate) newErrors["dates.endDate"] = "End date is required";
    if (!formData.owner.name.trim()) newErrors["owner.name"] = "Owner name is required";
    if (!formData.franchisee.name.trim()) newErrors["franchisee.name"] = "Franchisee name is required";
    if (formData.schedule.length === 0) newErrors.schedule = "At least one schedule slot is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert form data to LearningGroup format
    const learningGroupData: Omit<LearningGroup, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      studentIds: learningGroup?.studentIds || [],
      startDate: new Date(formData.dates.startDate),
      endDate: new Date(formData.dates.endDate),
      students: learningGroup?.students || [],
    };

    onSubmit(learningGroupData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {learningGroup ? "Edit Learning Group" : "Add New Learning Group"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter group name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter group description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Program and Teacher */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program *
              </label>
              <select
                value={formData.programId}
                onChange={(e) => handleInputChange("programId", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.programId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Program</option>
                <option value="prog_1">English Language Program</option>
                <option value="prog_2">Mathematics Program</option>
                <option value="prog_3">Physics Program</option>
              </select>
              {errors.programId && <p className="text-red-500 text-sm mt-1">{errors.programId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Program
              </label>
              <select
                value={formData.subProgramId}
                onChange={(e) => handleInputChange("subProgramId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Sub Program</option>
                <option value="sub_1">Beginner English</option>
                <option value="sub_2">Advanced English</option>
                <option value="sub_3">Basic Math</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher *
              </label>
              <select
                value={formData.teacherId}
                onChange={(e) => handleInputChange("teacherId", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.teacherId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Teacher</option>
                <option value="teacher_1">Sarah Wilson</option>
                <option value="teacher_2">Michael Brown</option>
                <option value="teacher_3">Emily Davis</option>
              </select>
              {errors.teacherId && <p className="text-red-500 text-sm mt-1">{errors.teacherId}</p>}
            </div>
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
                value={formData.dates.startDate}
                onChange={(e) => handleNestedInputChange("dates", "startDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors["dates.startDate"] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors["dates.startDate"] && <p className="text-red-500 text-sm mt-1">{errors["dates.startDate"]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                End Date *
              </label>
              <input
                type="date"
                value={formData.dates.endDate}
                onChange={(e) => handleNestedInputChange("dates", "endDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors["dates.endDate"] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors["dates.endDate"] && <p className="text-red-500 text-sm mt-1">{errors["dates.endDate"]}</p>}
            </div>
          </div>


          {/* Schedule */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 inline mr-1" />
                Schedule *
              </label>
              <button
                type="button"
                onClick={addScheduleSlot}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Schedule
              </button>
            </div>
            
            {formData.schedule.map((slot, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                  <select
                    value={slot.dayOfWeek}
                    onChange={(e) => updateScheduleSlot(index, "dayOfWeek", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dayNames.map((day, dayIndex) => (
                      <option key={dayIndex} value={dayIndex}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateScheduleSlot(index, "startTime", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateScheduleSlot(index, "endTime", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeScheduleSlot(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {errors.schedule && <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>}
          </div>

          {/* Location and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter location"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Max Students *
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxStudents}
                onChange={(e) => handleInputChange("maxStudents", parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.maxStudents ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.maxStudents && <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Pricing Information</h3>
            
            {/* Basic Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Billing Type</label>
                <select
                  value={(formData as any).pricingSnapshot.pricingModel}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "pricingModel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="per_month">Per month</option>
                  <option value="per_session">Per session</option>
                  <option value="per_course">Per course</option>
                  <option value="installments">Installments</option>
                  <option value="subscription">Subscription</option>
                  <option value="program_price">Program price</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(formData as any).pricingSnapshot.coursePrice || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "coursePrice", e.target.value === "" ? "" : parseFloat(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per month</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(formData as any).pricingSnapshot.pricePerMonth || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "pricePerMonth", e.target.value === "" ? "" : parseFloat(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per session</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(formData as any).pricingSnapshot.pricePerSession || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "pricePerSession", e.target.value === "" ? "" : parseFloat(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of payments</label>
                <input
                  type="number"
                  min="1"
                  value={(formData as any).pricingSnapshot.numberOfPayments || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "numberOfPayments", parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gap between payments</label>
                <input
                  type="number"
                  min="1"
                  value={(formData as any).pricingSnapshot.gap || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "gap", parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Frequency (1 = monthly, 2 = every two months, etc.)</p>
              </div>
            </div>
          </div>

          {/* Owner and Franchisee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                value={formData.owner.name}
                onChange={(e) => handleNestedInputChange("owner", "name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors["owner.name"] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter owner name"
              />
              {errors["owner.name"] && <p className="text-red-500 text-sm mt-1">{errors["owner.name"]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Role
              </label>
              <input
                type="text"
                value={formData.owner.role}
                onChange={(e) => handleNestedInputChange("owner", "role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter owner role"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Franchisee Name *
              </label>
              <input
                type="text"
                value={formData.franchisee.name}
                onChange={(e) => handleNestedInputChange("franchisee", "name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors["franchisee.name"] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter franchisee name"
              />
              {errors["franchisee.name"] && <p className="text-red-500 text-sm mt-1">{errors["franchisee.name"]}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Franchisee Location
              </label>
              <input
                type="text"
                value={formData.franchisee.location}
                onChange={(e) => handleNestedInputChange("franchisee", "location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter franchisee location"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes"
            />
          </div>

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
              {learningGroup ? "Update Group" : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
