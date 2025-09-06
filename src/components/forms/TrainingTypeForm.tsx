"use client";

import { useState } from "react";
import { TrainingType } from "@/types";
import { useUser } from "@/store/auth";
import { BookOpen, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TrainingTypeFormProps {
  trainingType?: TrainingType;
  onSubmit: (data: Partial<TrainingType>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TrainingTypeForm({ trainingType, onSubmit, onCancel, loading = false }: TrainingTypeFormProps) {
  const user = useUser();
  const [formData, setFormData] = useState<Partial<TrainingType>>({
    name: "",
    description: "",
    category: "",
    duration: 1,
    prerequisites: [],
    objectives: [],
    materials: [],
    isRecurring: false,
    frequency: "monthly",
    recordType: "optional",
    seminarType: "in_person",
    isActive: true,
    requirements: [],
    certification: {
      required: false,
      validityPeriod: 12,
      renewalRequired: false,
    },
    ...trainingType,
  });

  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [objectiveInput, setObjectiveInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addArrayItem = (field: string, value: string) => {
    if (value.trim()) {
      const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
      handleArrayChange(field, [...currentArray, value.trim()]);
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
    handleArrayChange(field, currentArray.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trainingTypeData = {
      ...formData,
      createdBy: user?.id || "",
    };

    onSubmit(trainingTypeData);
  };

  // Only HQ users can create/edit training types
  if (user?.role !== "HQ") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Only HQ users can create or edit training types.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {trainingType ? "Edit Training Type" : "Create New Training Type"}
        </h2>
        <p className="text-gray-600 mt-1">
          {trainingType ? "Update training type configuration" : "Set up a new training type template"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="Pedagogy">Pedagogy</option>
              <option value="Technology">Technology</option>
              <option value="Assessment">Assessment</option>
              <option value="Classroom Management">Classroom Management</option>
              <option value="Curriculum">Curriculum</option>
              <option value="Special Education">Special Education</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Duration and Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Duration (hours) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.duration || 1}
              onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Type *
            </label>
            <select
              value={formData.recordType || "optional"}
              onChange={(e) => handleInputChange("recordType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mandatory">Mandatory</option>
              <option value="optional">Optional</option>
              <option value="certification">Certification</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seminar Type *
            </label>
            <select
              value={formData.seminarType || "in_person"}
              onChange={(e) => handleInputChange("seminarType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="in_person">In Person</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Recurring Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Recurring Settings
          </h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring || false}
              onChange={(e) => handleInputChange("isRecurring", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
              This training type is recurring
            </label>
          </div>

          {formData.isRecurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={formData.frequency || "monthly"}
                onChange={(e) => handleInputChange("frequency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Prerequisites</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={prerequisiteInput}
              onChange={(e) => setPrerequisiteInput(e.target.value)}
              placeholder="Add prerequisite..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("prerequisites", prerequisiteInput);
                  setPrerequisiteInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("prerequisites", prerequisiteInput);
                setPrerequisiteInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.prerequisites || []).map((prereq, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {prereq}
                <button
                  type="button"
                  onClick={() => removeArrayItem("prerequisites", index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Learning Objectives</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={objectiveInput}
              onChange={(e) => setObjectiveInput(e.target.value)}
              placeholder="Add learning objective..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("objectives", objectiveInput);
                  setObjectiveInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("objectives", objectiveInput);
                setObjectiveInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.objectives || []).map((objective, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {objective}
                <button
                  type="button"
                  onClick={() => removeArrayItem("objectives", index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Required Materials</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              placeholder="Add material..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("materials", materialInput);
                  setMaterialInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("materials", materialInput);
                setMaterialInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.materials || []).map((material, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
              >
                {material}
                <button
                  type="button"
                  onClick={() => removeArrayItem("materials", index)}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Certification Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Certification Settings
          </h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="certificationRequired"
              checked={formData.certification?.required || false}
              onChange={(e) => handleNestedInputChange("certification", "required", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="certificationRequired" className="ml-2 block text-sm text-gray-900">
              Certification is required for this training type
            </label>
          </div>

          {formData.certification?.required && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity Period (months)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.certification?.validityPeriod || 12}
                  onChange={(e) => handleNestedInputChange("certification", "validityPeriod", parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="renewalRequired"
                  checked={formData.certification?.renewalRequired || false}
                  onChange={(e) => handleNestedInputChange("certification", "renewalRequired", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="renewalRequired" className="ml-2 block text-sm text-gray-900">
                  Renewal required
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive || false}
            onChange={(e) => handleInputChange("isActive", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Training type is active and available for use
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : trainingType ? "Update Training Type" : "Create Training Type"}
          </button>
        </div>
      </form>
    </div>
  );
}
