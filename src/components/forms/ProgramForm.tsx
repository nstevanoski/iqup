"use client";

import { useState, useEffect } from "react";
import { Program } from "@/types";
import { useUser, useSelectedScope } from "@/store/auth";
import { getMFAccounts, MFAccount } from "@/lib/api/accounts";

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

// This will be populated from the API

export function ProgramForm({ program, onSubmit, onCancel, loading = false }: ProgramFormProps) {
  const user = useUser();
  const [formData, setFormData] = useState<FormData>(
    program ? {
      name: program.name,
      description: program.description,
      status: program.status,
      duration: program.duration,
      maxStudents: program.maxStudents,
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
  const [mfAccounts, setMfAccounts] = useState<MFAccount[]>([]);
  const [loadingMFs, setLoadingMFs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllSelected, setShowAllSelected] = useState(false);

  // Fetch MF accounts when component mounts
  useEffect(() => {
    const fetchMFAccounts = async () => {
      if (user?.role !== "HQ") return;
      
      try {
        setLoadingMFs(true);
        const response = await getMFAccounts();
        if (response.success) {
          setMfAccounts(response.data);
        }
      } catch (error) {
        console.error('Error fetching MF accounts:', error);
      } finally {
        setLoadingMFs(false);
      }
    };

    fetchMFAccounts();
  }, [user?.role]);

  // Filter MF accounts based on search term
  const filteredMFAccounts = mfAccounts.filter(mf => 
    mf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mf.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mf.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mf.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected and unselected accounts
  const selectedMFs = mfAccounts.filter(mf => formData.sharedWithMFs.includes(mf.id.toString()));
  const unselectedMFs = filteredMFAccounts.filter(mf => !formData.sharedWithMFs.includes(mf.id.toString()));

  // Bulk selection handlers
  const handleSelectAll = () => {
    const allFilteredIds = filteredMFAccounts.map(mf => mf.id.toString());
    setFormData(prev => {
      const combinedIds = [...prev.sharedWithMFs, ...allFilteredIds];
      const uniqueIds = Array.from(new Set(combinedIds));
      return {
        ...prev,
        sharedWithMFs: uniqueIds
      };
    });
  };

  const handleSelectNone = () => {
    const filteredIds = filteredMFAccounts.map(mf => mf.id.toString());
    setFormData(prev => ({
      ...prev,
      sharedWithMFs: prev.sharedWithMFs.filter(id => !filteredIds.includes(id))
    }));
  };

  const handleSelectAllMFs = () => {
    const allIds = mfAccounts.map(mf => mf.id.toString());
    setFormData(prev => ({
      ...prev,
      sharedWithMFs: allIds
    }));
  };

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      sharedWithMFs: []
    }));
  };

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
                Share with Master Franchisees *
              </label>
              
              {loadingMFs ? (
                <div className="text-sm text-gray-500">Loading MF accounts...</div>
              ) : mfAccounts.length === 0 ? (
                <div className="text-sm text-gray-500">No MF accounts available</div>
              ) : (
                <div className="border border-gray-200 rounded-lg">
                  {/* Summary and Bulk Actions */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{selectedMFs.length}</span> of <span className="font-medium">{mfAccounts.length}</span> MF accounts selected
                        {searchTerm && (
                          <span className="ml-2 text-blue-600">
                            ({filteredMFAccounts.length} match search)
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleSelectAllMFs}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    
                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name, code, city, or state..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  {searchTerm && (
                    <div className="p-3 border-b border-gray-200 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">
                          Filtered results: {filteredMFAccounts.length} accounts
                        </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Select Filtered
                          </button>
                          <button
                            type="button"
                            onClick={handleSelectNone}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Deselect Filtered
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected Accounts Summary */}
                  {selectedMFs.length > 0 && (
                    <div className="p-3 border-b border-gray-200 bg-green-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700 font-medium">
                          Selected: {selectedMFs.length} accounts
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAllSelected(!showAllSelected)}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          {showAllSelected ? 'Hide' : 'Show'} Selected
                        </button>
                      </div>
                      {showAllSelected && (
                        <div className="mt-2 max-h-32 overflow-y-auto">
                          <div className="flex flex-wrap gap-1">
                            {selectedMFs.map(mf => (
                              <span
                                key={mf.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                              >
                                {mf.name}
                                <button
                                  type="button"
                                  onClick={() => handleScopeChange(mf.id.toString(), false)}
                                  className="ml-1 text-green-600 hover:text-green-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MF Accounts List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredMFAccounts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        {searchTerm ? 'No accounts match your search' : 'No MF accounts available'}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {filteredMFAccounts.map(mf => (
                          <label key={mf.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.sharedWithMFs.includes(mf.id.toString())}
                              onChange={(e) => handleScopeChange(mf.id.toString(), e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{mf.name}</div>
                                  <div className="text-xs text-gray-500">
                                    Code: {mf.code}
                                    {mf.city && mf.state && ` • ${mf.city}, ${mf.state}`}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {mf._count.learningCenters} LCs
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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
