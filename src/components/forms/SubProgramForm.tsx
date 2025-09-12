"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { SubProgram, Program } from "@/types";
import { useUser, useSelectedScope } from "@/store/auth";
import { getPrograms } from "@/lib/api/programs";
import { getLearningCenters, LearningCenter } from "@/lib/api/learning-centers";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/SearchableSelect";

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
  pricingModel: "per_course" | "per_month" | "per_session" | "subscription" | "program_price" | "one-time" | "installments";
  coursePrice: number | string;
  numberOfPayments?: number;
  gap?: number;
  pricePerMonth?: number;
  pricePerSession?: number;
  sharedWithLCs: string[];
  sharedWithMFs?: string[];
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
  pricingModel: "per_course",
  coursePrice: 0,
  numberOfPayments: undefined,
  gap: undefined,
  pricePerMonth: undefined,
  pricePerSession: undefined,
  sharedWithLCs: [],
  sharedWithMFs: undefined,
  visibility: "shared",
};

// Pricing model selection not needed in UI; all price fields are shown

// Learning centers will be loaded dynamically based on user role and scope

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
      pricePerSession: subProgram.pricePerSession,
      sharedWithLCs: subProgram.sharedWithLCs,
      sharedWithMFs: subProgram.sharedWithMFs,
      visibility: subProgram.visibility,
    } : initialFormData
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [programOptions, setProgramOptions] = useState<SearchableSelectOption[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [learningCenters, setLearningCenters] = useState<LearningCenter[]>([]);
  const [isLoadingLCs, setIsLoadingLCs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllSelected, setShowAllSelected] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

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
    if (!formData.coursePrice || (typeof formData.coursePrice === 'number' && formData.coursePrice <= 0) || (typeof formData.coursePrice === 'string' && (!formData.coursePrice.trim() || parseFloat(formData.coursePrice) <= 0))) {
      newErrors.coursePrice = "Course price is required";
    }
    if (formData.pricingModel === "per_month" && (!formData.pricePerMonth || formData.pricePerMonth <= 0)) {
      newErrors.pricePerMonth = "Price per month is required";
    }
    if (formData.pricingModel === "per_session" && (!formData.pricePerSession || formData.pricePerSession <= 0)) {
      newErrors.pricePerSession = "Price per session is required";
    }
    if (!formData.numberOfPayments || formData.numberOfPayments <= 0) {
      newErrors.numberOfPayments = "Number of payments is required";
    }
    if (!formData.gap || formData.gap <= 0) {
      newErrors.gap = "Gap between payments is required";
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

  // Load initial programs
  useEffect(() => {
    const loadInitialPrograms = async () => {
      if (!user || !selectedScope) return;
      
      try {
        setIsLoadingPrograms(true);
        
        const response = await getPrograms({
          limit: 10,
          userRole: user.role,
          userScope: selectedScope.id,
        });

        if (response.success) {
          const options: SearchableSelectOption[] = response.data.data.map(program => ({
            id: program.id,
            label: program.name,
            description: program.description,
            metadata: `${program.category} • ${program.kind} • ${program.duration} weeks`
          }));
          setProgramOptions(options);
        }
      } catch (error) {
        console.error('Error loading programs:', error);
      } finally {
        setIsLoadingPrograms(false);
      }
    };

    loadInitialPrograms();
  }, [user, selectedScope]);

  // Load learning centers with search functionality
  const loadLearningCenters = async (search?: string) => {
    if (!user || !selectedScope || user.role !== 'MF') return;
    
    try {
      setIsLoadingLCs(true);
      
      const response = await getLearningCenters({
        userRole: user.role,
        userScope: selectedScope.id,
        search: search,
        limit: 100
      });

      if (response.success) {
        setLearningCenters(response.data.data);
      }
    } catch (error) {
      console.error('Error loading learning centers:', error);
    } finally {
      setIsLoadingLCs(false);
    }
  };

  // Load learning centers when component mounts
  useEffect(() => {
    loadLearningCenters();
  }, [user, selectedScope]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      loadLearningCenters(searchTerm || undefined);
    }, 300); // 300ms debounce

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchTerm, user, selectedScope]);

  // Search function for SearchableSelect
  const handleProgramSearch = useCallback(
    async (searchTerm: string): Promise<SearchableSelectOption[]> => {
      if (!user || !selectedScope) return [];

      try {
        const response = await getPrograms({
          search: searchTerm,
          limit: 10,
          userRole: user.role,
          userScope: selectedScope.id,
        });

        if (response.success) {
          return response.data.data.map(program => ({
            id: program.id,
            label: program.name,
            description: program.description,
            metadata: `${program.category} • ${program.kind} • ${program.duration} weeks`
          }));
        }
        return [];
      } catch (error) {
        console.error('Error searching programs:', error);
        return [];
      }
    },
    [user?.role, selectedScope?.id]
  );

  // Handle program selection
  const handleSelectProgram = (programId: string) => {
    handleInputChange("programId", programId);
    
    // Find the program in the original programs array to get full details
    const program = programs.find(p => p.id === programId);
    if (program) {
      setFormData(prev => ({
        ...prev,
        duration: program.duration,
        description: program.description,
      }));
    }
  };

  // Prerequisites and learning objectives are not used in the form per requirements

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

  // Helper functions for advanced UI (no frontend filtering needed since backend handles search)
  const selectedLCs = learningCenters.filter(lc => formData.sharedWithLCs.includes(lc.id));

  const handleSelectAllLCs = () => {
    setFormData(prev => ({
      ...prev,
      sharedWithLCs: learningCenters.map(lc => lc.id),
    }));
  };

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      sharedWithLCs: [],
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      sharedWithLCs: Array.from(new Set([...prev.sharedWithLCs, ...learningCenters.map(lc => lc.id)])),
    }));
  };

  const handleSelectNone = () => {
    setFormData(prev => ({
      ...prev,
      sharedWithLCs: prev.sharedWithLCs.filter(id => !learningCenters.some(lc => lc.id === id)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert string values back to numbers for submission
    const submitData = {
      ...formData,
      coursePrice: typeof formData.coursePrice === 'string' ? parseFloat(formData.coursePrice) : formData.coursePrice,
    };

    onSubmit(submitData);
  };

  const canEdit = user?.role === "MF" || user?.role === "HQ";

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
            
            <SearchableSelect
              options={programOptions}
              value={formData.programId}
              placeholder="Select a program..."
              onSelect={handleSelectProgram}
              onSearch={handleProgramSearch}
              loading={isLoadingPrograms}
              error={errors.programId}
              showClearButton={true}
            />
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

      {/* Price Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Price *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.coursePrice || ""}
              onChange={(e) => handleInputChange("coursePrice", e.target.value === "" ? "" : parseFloat(e.target.value) || "")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.coursePrice ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
            {errors.coursePrice && <p className="text-red-500 text-sm mt-1">{errors.coursePrice}</p>}
          </div>

          {/* Installments model removed per requirements */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Month {formData.pricingModel === "per_month" ? "*" : ""}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Session {formData.pricingModel === "per_session" ? "*" : ""}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.pricePerSession || ""}
              onChange={(e) => handleInputChange("pricePerSession", parseFloat(e.target.value) || undefined)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.pricePerSession ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
            {errors.pricePerSession && <p className="text-red-500 text-sm mt-1">{errors.pricePerSession}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of payments
            </label>
            <input
              type="number"
              min="1"
              value={formData.numberOfPayments || ""}
              onChange={(e) => handleInputChange("numberOfPayments", parseInt(e.target.value) || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 12"
            />
            {errors.numberOfPayments && <p className="text-red-500 text-sm mt-1">{errors.numberOfPayments}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gap between payments (months)
            </label>
            <input
              type="number"
              min="1"
              value={formData.gap || ""}
              onChange={(e) => handleInputChange("gap", parseInt(e.target.value) || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1 = monthly"
            />
            {errors.gap && <p className="text-red-500 text-sm mt-1">{errors.gap}</p>}
          </div>
        </div>
      </div>

      {/* Prerequisites and Learning Objectives not required per latest requirements */}

      {/* Sharing Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sharing Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {user?.role === "HQ" ? "Share with Master Franchisees *" : "Share with Learning Centers *"}
            </label>
              
              {user?.role === "HQ" ? (
                <div className="text-sm text-gray-500">
                  HQ can share with MF accounts (implementation needed)
                </div>
              ) : (
                <>
                  <div className="border border-gray-200 rounded-lg">
                    {isLoadingLCs ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="flex items-center space-x-2 text-gray-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm">
                            {searchTerm ? 'Searching learning centers...' : 'Loading learning centers...'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Summary and Bulk Actions */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{selectedLCs.length}</span> of <span className="font-medium">{learningCenters.length}</span> learning centers selected
                              {searchTerm && (
                                <span className="ml-2 text-blue-600">
                                  ({learningCenters.length} match search)
                                </span>
                              )}
                            </div>
                            {learningCenters.length > 0 && (
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={handleSelectAllLCs}
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
                              disabled={isLoadingLCs}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {isLoadingLCs ? (
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
                                disabled={isLoadingLCs}
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
                                  Search results: {learningCenters.length} centers
                                </span>
                                {learningCenters.length === 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                  >
                                    Clear search
                                  </button>
                                )}
                              </div>
                              {learningCenters.length > 0 && (
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

                        {/* Selected Centers Summary */}
                        {selectedLCs.length > 0 && (
                          <div className="p-3 border-b border-gray-200 bg-green-50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-700">
                                {selectedLCs.length} center{selectedLCs.length !== 1 ? 's' : ''} selected
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
                                {selectedLCs.map(lc => (
                                  <span
                                    key={lc.id}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                                  >
                                    {lc.name}
                                    <button
                                      type="button"
                                      onClick={() => handleScopeChange(lc.id, false)}
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

                        {/* Learning Centers List or Empty State */}
                        {learningCenters.length === 0 ? (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <div className="text-gray-400 mb-2">
                              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="text-gray-500 text-sm">
                              {searchTerm ? (
                                <>
                                  <p className="font-medium mb-1">No learning centers found</p>
                                  <p className="text-xs">Try adjusting your search terms or clear the search to see all centers</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium mb-1">No learning centers available</p>
                                  <p className="text-xs">Contact your administrator to add learning centers</p>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto">
                            <div className="divide-y divide-gray-200">
                              {learningCenters.map(lc => (
                                <label key={lc.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.sharedWithLCs.includes(lc.id)}
                                    onChange={(e) => handleScopeChange(lc.id, e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <div className="ml-3 flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">{lc.name}</div>
                                        <div className="text-xs text-gray-500">
                                          {lc.code} • {lc.city}, {lc.state}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-xs text-gray-400">
                                          {lc.userCount} users
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
                  
                  {errors.sharedWithLCs && <p className="text-red-500 text-sm mt-1">{errors.sharedWithLCs}</p>}
                </>
              )}
          </div>
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
          {loading ? "Saving..." : subProgram ? "Update SubProgram" : "Create SubProgram"}
        </button>
      </div>
    </form>
  );
}
