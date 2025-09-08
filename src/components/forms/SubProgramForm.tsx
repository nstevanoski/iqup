"use client";

import { useState } from "react";
import { SubProgram, Program } from "@/types";
import { useUser, useSelectedScope } from "@/store/auth";

interface SubProgramFormProps {
  subProgram?: SubProgram;
  programs: Program[];
  onSubmit: (data: Partial<SubProgram>) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  programId: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  order: number;
  duration: number;
  price: number;
  prerequisites: string[];
  learningObjectives: string[];
  pricingModel: "subscription" | "program_price" | "one-time" | "installments";
  coursePrice: number;
  numberOfPayments?: number;
  gap?: number;
  pricePerMonth?: number;
  sharedWithLCs: string[];
  visibility: "private" | "shared" | "public";
}

const initialFormData: FormData = {
  programId: "",
  name: "",
  description: "",
  status: "draft",
  order: 1,
  duration: 1,
  price: 0,
  prerequisites: [],
  learningObjectives: [],
  pricingModel: "program_price",
  coursePrice: 0,
  numberOfPayments: undefined,
  gap: undefined,
  pricePerMonth: undefined,
  sharedWithLCs: [],
  visibility: "private",
};

const pricingModels = [
  { value: "program_price", label: "Program Price" },
  { value: "subscription", label: "Price per Month" },
];

const availableLCScopes = [
  { id: "lc_center_nyc", name: "New York Learning Center" },
  { id: "lc_center_la", name: "Los Angeles Learning Center" },
  { id: "lc_center_chicago", name: "Chicago Learning Center" },
  { id: "lc_center_boston", name: "Boston Learning Center" },
  { id: "lc_center_miami", name: "Miami Learning Center" },
];

export function SubProgramForm({ subProgram, programs, onSubmit, onCancel, loading = false }: SubProgramFormProps) {
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [formData, setFormData] = useState<FormData>(
    subProgram ? {
      programId: subProgram.programId,
      name: subProgram.name,
      description: subProgram.description,
      status: subProgram.status,
      order: subProgram.order,
      duration: subProgram.duration,
      price: subProgram.price,
      prerequisites: subProgram.prerequisites,
      learningObjectives: subProgram.learningObjectives,
      pricingModel: subProgram.pricingModel,
      coursePrice: subProgram.coursePrice,
      numberOfPayments: subProgram.numberOfPayments,
      gap: subProgram.gap,
      pricePerMonth: subProgram.pricePerMonth,
      sharedWithLCs: subProgram.sharedWithLCs,
      visibility: subProgram.visibility,
    } : initialFormData
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [objectiveInput, setObjectiveInput] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.programId.trim()) {
      newErrors.programId = "Program is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }
    if (formData.pricingModel === "program_price" && (!formData.coursePrice || formData.coursePrice <= 0)) {
      newErrors.coursePrice = "Course price is required for Program Price";
    }
    if (formData.pricingModel === "subscription" && (!formData.pricePerMonth || formData.pricePerMonth <= 0)) {
      newErrors.pricePerMonth = "Price per month is required for subscription model";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
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

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()],
      }));
      setPrerequisiteInput("");
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  const addObjective = () => {
    if (objectiveInput.trim() && !formData.learningObjectives.includes(objectiveInput.trim())) {
      setFormData(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, objectiveInput.trim()],
      }));
      setObjectiveInput("");
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index),
    }));
  };

  const handleScopeChange = (scopeId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        sharedWithLCs: [...prev.sharedWithLCs, scopeId],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sharedWithLCs: prev.sharedWithLCs.filter(id => id !== scopeId),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const canEdit = user?.role === "MF";

  if (!canEdit) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          You don't have permission to create or edit subprograms.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {programs.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
            {errors.programId && <p className="text-red-500 text-sm mt-1">{errors.programId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter subprogram name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <input
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (weeks) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 1)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.duration ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
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
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility *
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => handleInputChange("visibility", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="private">Private</option>
              <option value="shared">Shared</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter subprogram description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Billing Type *
            </label>
            <select
              value={formData.pricingModel}
              onChange={(e) => handleInputChange("pricingModel", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pricingModels.map(model => (
                <option key={model.value} value={model.value}>{model.label}</option>
              ))}
            </select>
          </div>

          {formData.pricingModel === "program_price" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.coursePrice}
                onChange={(e) => handleInputChange("coursePrice", parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.coursePrice ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.coursePrice && <p className="text-red-500 text-sm mt-1">{errors.coursePrice}</p>}
            </div>
          )}

          {/* Installments model removed per requirements */}

          {formData.pricingModel === "subscription" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Month *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerMonth || ""}
                onChange={(e) => handleInputChange("pricePerMonth", parseFloat(e.target.value) || undefined)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pricePerMonth ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {errors.pricePerMonth && <p className="text-red-500 text-sm mt-1">{errors.pricePerMonth}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Prerequisites</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={prerequisiteInput}
              onChange={(e) => setPrerequisiteInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter prerequisite"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
            />
            <button
              type="button"
              onClick={addPrerequisite}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          {formData.prerequisites.length > 0 && (
            <div className="space-y-2">
              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{prerequisite}</span>
                  <button
                    type="button"
                    onClick={() => removePrerequisite(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Objectives</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={objectiveInput}
              onChange={(e) => setObjectiveInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter learning objective"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
            />
            <button
              type="button"
              onClick={addObjective}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          
          {formData.learningObjectives.length > 0 && (
            <div className="space-y-2">
              {formData.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{objective}</span>
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sharing with Learning Centers */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Share with Learning Centers</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select which learning centers can view and use this subprogram.
        </p>
        
        <div className="space-y-3">
          {availableLCScopes.map(scope => (
            <div key={scope.id} className="flex items-center">
              <input
                type="checkbox"
                id={scope.id}
                checked={formData.sharedWithLCs.includes(scope.id)}
                onChange={(e) => handleScopeChange(scope.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={scope.id} className="ml-2 text-sm text-gray-700">
                {scope.name}
              </label>
            </div>
          ))}
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
          {loading ? "Saving..." : subProgram ? "Update SubProgram" : "Create SubProgram"}
        </button>
      </div>
    </form>
  );
}
