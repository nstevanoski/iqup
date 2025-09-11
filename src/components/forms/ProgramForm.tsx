"use client";

import { useState } from "react";
import { Program } from "@/types";
import { useUser, useSelectedScope } from "@/store/auth";

interface ProgramFormProps {
  program?: Program;
  onSubmit: (data: Partial<Program>) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  duration: number;
  maxStudents: number;
  requirements: string[];
  learningObjectives: string[];
  hours: number;
  lessonLength: number;
  kind: "academic" | "worksheet" | "birthday_party" | "stem_camp";
  sharedWithMFs: string[];
  visibility: "private" | "shared" | "public";
}

const initialFormData: FormData = {
  name: "",
  description: "",
  status: "draft",
  duration: 1,
  maxStudents: 20,
  requirements: [],
  learningObjectives: [],
  hours: 0,
  lessonLength: 60,
  kind: "academic",
  sharedWithMFs: [],
  visibility: "private",
};

// Category selection not required per latest requirements

const programKinds = [
  { value: "academic", label: "Regular Program" },
  { value: "worksheet", label: "Worksheet" },
  { value: "birthday_party", label: "Birthday Party" },
  { value: "stem_camp", label: "STEM Camp" }
];

const availableScopes = [
  { id: "mf_region_1", name: "Region 1" },
  { id: "mf_region_2", name: "Region 2" },
  { id: "mf_region_3", name: "Region 3" },
];

export function ProgramForm({ program, onSubmit, onCancel, loading = false }: ProgramFormProps) {
  const user = useUser();
  const [formData, setFormData] = useState<FormData>(
    program ? {
      name: program.name,
      description: program.description,
      status: program.status,
      duration: program.duration,
      maxStudents: program.maxStudents,
      requirements: program.requirements,
      learningObjectives: program.learningObjectives,
      hours: program.hours,
      lessonLength: program.lessonLength,
      // Map unknown kinds to closest allowed option for safety
      kind: ((): FormData["kind"] => {
        const allowed = new Set(["academic", "worksheet", "birthday_party", "stem_camp"]);
        return (allowed.has(program.kind as any) ? program.kind : "academic") as FormData["kind"];
      })(),
      sharedWithMFs: program.sharedWithMFs,
      visibility: program.visibility,
    } : initialFormData
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requirementInput, setRequirementInput] = useState("");
  const [objectiveInput, setObjectiveInput] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Program name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (formData.maxStudents <= 0) {
      newErrors.maxStudents = "Max students must be greater than 0";
    }

    if (formData.hours <= 0) {
      newErrors.hours = "Total hours must be greater than 0";
    }

    if (formData.lessonLength <= 0) {
      newErrors.lessonLength = "Lesson length must be greater than 0";
    }

    // For create flow, requirements and learning objectives are optional per new requirements
    if (program) {
      if (formData.requirements.length === 0) {
        newErrors.requirements = "At least one requirement is needed";
      }
      if (formData.learningObjectives.length === 0) {
        newErrors.learningObjectives = "At least one learning objective is needed";
      }
    }

    if (formData.visibility === "shared" && formData.sharedWithMFs.length === 0) {
      newErrors.sharedWithMFs = "Please select at least one scope to share with";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const addRequirement = () => {
    if (requirementInput.trim() && !formData.requirements.includes(requirementInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
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
        sharedWithMFs: [...prev.sharedWithMFs, scopeId],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        sharedWithMFs: prev.sharedWithMFs.filter(id => id !== scopeId),
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

  const canEdit = user?.role === "HQ";

  if (!canEdit) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          You don't have permission to create or edit programs.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter program name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program Type *
            </label>
            <select
              value={formData.kind}
              onChange={(e) => handleInputChange("kind", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {programKinds.map(kind => (
                <option key={kind.value} value={kind.value}>{kind.label}</option>
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
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
            placeholder="Enter program description"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Program Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (weeks) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.duration ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Hours *
            </label>
            <input
              type="number"
              min="1"
              value={formData.hours}
              onChange={(e) => handleInputChange("hours", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hours ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.hours && <p className="text-red-500 text-sm mt-1">{errors.hours}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Length (minutes) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.lessonLength}
              onChange={(e) => handleInputChange("lessonLength", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lessonLength ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lessonLength && <p className="text-red-500 text-sm mt-1">{errors.lessonLength}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Students *
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxStudents}
              onChange={(e) => handleInputChange("maxStudents", parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.maxStudents ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.maxStudents && <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>}
          </div>
        </div>
      </div>

      {/* Requirements and Learning Objectives are omitted in create flow */}
      {program && (
        <>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a requirement"
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-sm">{requirement}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements}</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={objectiveInput}
                  onChange={(e) => setObjectiveInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a learning objective"
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
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-sm">{objective}</span>
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.learningObjectives && <p className="text-red-500 text-sm">{errors.learningObjectives}</p>}
            </div>
          </div>
        </>
      )}

      {/* Visibility Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility Settings</h3>
        
        <div className="space-y-4">
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
              <option value="shared">Shared with specific scopes</option>
              <option value="public">Public</option>
            </select>
          </div>

          {formData.visibility === "shared" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share with scopes *
              </label>
              <div className="space-y-2">
                {availableScopes.map(scope => (
                  <label key={scope.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sharedWithMFs.includes(scope.id)}
                      onChange={(e) => handleScopeChange(scope.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{scope.name}</span>
                  </label>
                ))}
              </div>
              {errors.sharedWithMFs && <p className="text-red-500 text-sm mt-1">{errors.sharedWithMFs}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : program ? "Update Program" : "Create Program"}
        </button>
      </div>
    </form>
  );
}
