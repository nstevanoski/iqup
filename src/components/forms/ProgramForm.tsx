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
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch MF accounts with search functionality
  const fetchMFAccounts = async (search?: string) => {
    if (user?.role !== "HQ") return;
    
    try {
      setLoadingMFs(true);
      const response = await getMFAccounts(undefined, search);
      if (response.success) {
        setMfAccounts(response.data);
      }
    } catch (error) {
      console.error('Error fetching MF accounts:', error);
    } finally {
      setLoadingMFs(false);
    }
  };

  // Fetch MF accounts when component mounts
  useEffect(() => {
    fetchMFAccounts();
  }, [user?.role]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      fetchMFAccounts(searchTerm || undefined);
    }, 300); // 300ms debounce

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm, user?.role]);

  // Get selected and unselected accounts (no frontend filtering needed since backend handles search)
  const selectedMFs = mfAccounts.filter(mf => formData.sharedWithMFs.includes(mf.id.toString()));
  const unselectedMFs = mfAccounts.filter(mf => !formData.sharedWithMFs.includes(mf.id.toString()));

  // Bulk selection handlers
  const handleSelectAll = () => {
    const allFilteredIds = mfAccounts.map(mf => mf.id.toString());
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
    const filteredIds = mfAccounts.map(mf => mf.id.toString());
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
              
              <div className="border border-gray-200 rounded-lg">
                {loadingMFs ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">
                        {searchTerm ? 'Searching MF accounts...' : 'Loading MF accounts...'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Summary and Bulk Actions */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{selectedMFs.length}</span> of <span className="font-medium">{mfAccounts.length}</span> MF accounts selected
                          {searchTerm && (
                            <span className="ml-2 text-blue-600">
                              ({mfAccounts.length} match search)
                            </span>
                          )}
                        </div>
                        {mfAccounts.length > 0 && (
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
                        )}
                      </div>
                      
                      {/* Search */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name, code, city, or state..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 pl-8 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          disabled={loadingMFs}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {loadingMFs ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          ) : (
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          )}
                        </div>
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            disabled={loadingMFs}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filter Actions */}
                    {searchTerm && (
                      <div className="p-3 border-b border-gray-200 bg-blue-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-700">
                              Search results: {mfAccounts.length} accounts
                            </span>
                            {mfAccounts.length === 0 && (
                              <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              >
                                Clear search
                              </button>
                            )}
                          </div>
                          {mfAccounts.length > 0 && (
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              >
                                Select All Results
                              </button>
                              <button
                                type="button"
                                onClick={handleSelectNone}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              >
                                Deselect All Results
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Selected Accounts Summary */}
                    {selectedMFs.length > 0 && (
                      <div className="p-3 border-b border-gray-200 bg-green-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-700">
                            {selectedMFs.length} account{selectedMFs.length !== 1 ? 's' : ''} selected
                          </span>
                          <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            Clear Selection
                          </button>
                        </div>
                        <div className="mt-2">
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
                      </div>
                    )}

                    {/* MF Accounts List or Empty State */}
                    {mfAccounts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="text-gray-400 mb-2">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {searchTerm ? (
                            <>
                              <p className="font-medium mb-1">No MF accounts found</p>
                              <p className="text-xs">Try adjusting your search terms or clear the search to see all accounts</p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium mb-1">No MF accounts available</p>
                              <p className="text-xs">Contact your administrator to add MF accounts</p>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        <div className="divide-y divide-gray-200">
                          {mfAccounts.map(mf => (
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
                                      {mf.code} • {mf.city}, {mf.state}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-gray-400">
                                      {mf._count.users} users
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {mf._count.learningCenters} LCs
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {errors.sharedWithMFs && <p className="text-red-500 text-sm mt-1">{errors.sharedWithMFs}</p>}
            </div>
          )}
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : program ? "Update Program" : "Create Program"}
        </button>
      </div>
    </form>
  );
}
