"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { SubProgram, Program } from "@/types";
import { useUser, useSelectedScope } from "@/store/auth";
import { getPrograms } from "@/lib/api/programs";
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
  coursePrice: number;
  numberOfPayments?: number;
  gap?: number;
  pricePerMonth?: number;
  pricePerSession?: number;
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
  pricingModel: "per_course",
  coursePrice: 0,
  numberOfPayments: undefined,
  gap: undefined,
  pricePerMonth: undefined,
  pricePerSession: undefined,
  sharedWithLCs: [],
  visibility: "private",
};

// Pricing model selection not needed in UI; all price fields are shown

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
  const [programOptions, setProgramOptions] = useState<SearchableSelectOption[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);

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
    if (!formData.coursePrice || formData.coursePrice <= 0) {
      newErrors.coursePrice = "Course price is required";
    }
    if (!formData.pricePerMonth || formData.pricePerMonth <= 0) {
      newErrors.pricePerMonth = "Price per month is required";
    }
    if (!formData.pricePerSession || formData.pricePerSession <= 0) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
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
              value={formData.coursePrice}
              onChange={(e) => handleInputChange("coursePrice", parseFloat(e.target.value) || 0)}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Session *
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

      {/* Visibility Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Visibility Settings</h3>
        {user?.role === "HQ" ? (
          <>
            <p className="text-sm text-gray-600 mb-4">Share with Regions (MFs)</p>
            <div className="space-y-3">
              {[
                { id: "mf_region_1", name: "Region 1" },
                { id: "mf_region_2", name: "Region 2" },
                { id: "mf_region_3", name: "Region 3" },
              ].map(scope => (
                <div key={scope.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={scope.id}
                    checked={(formData as any).sharedWithMFs?.includes(scope.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData(prev => ({
                        ...prev,
                        // keep also sharedWithLCs in case MF wants to pass further
                        ...(checked ? { sharedWithMFs: [ ...((prev as any).sharedWithMFs || []), scope.id ] } : { sharedWithMFs: [ ...(((prev as any).sharedWithMFs || []).filter((id: string) => id !== scope.id)) ] }),
                      }) as any);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={scope.id} className="ml-2 text-sm text-gray-700">
                    {scope.name}
                  </label>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">Share with Learning Centers</p>
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
          </>
        )}
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
