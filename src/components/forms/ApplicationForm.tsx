"use client";

import { useState } from "react";
import { Application } from "@/types";
import { useUser } from "@/store/auth";
import { User, Building, Target, FileText, AlertCircle, Plus, X } from "lucide-react";

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (data: Partial<Application>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ApplicationForm({ application, onSubmit, onCancel, loading = false }: ApplicationFormProps) {
  const user = useUser();
  const [formData, setFormData] = useState<Partial<Application>>({
    applicantInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      title: "",
      company: "",
      website: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
    },
    businessInfo: {
      businessName: "",
      taxId: "",
      registrationNumber: "",
      establishedDate: new Date(),
      businessType: "",
      numberOfEmployees: 0,
      annualRevenue: 0,
    },
    applicationType: "LC",
    status: "new",
    studentGoals: {
      year1: { targetStudents: 0, programs: [], revenue: 0, milestones: [] },
      year2: { targetStudents: 0, programs: [], revenue: 0, milestones: [] },
      year3: { targetStudents: 0, programs: [], revenue: 0, milestones: [] },
      year4: { targetStudents: 0, programs: [], revenue: 0, milestones: [] },
    },
    documents: {
      businessLicense: "",
      taxCertificate: "",
      financialStatements: [],
      marketingPlan: "",
      otherDocuments: [],
    },
    ...application,
  });

  const [programInput, setProgramInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [documentInput, setDocumentInput] = useState("");

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

  const handleDeepNestedInputChange = (parent: string, child: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [child]: {
          ...(prev[parent as keyof typeof prev] as any)?.[child],
          [field]: value,
        },
      },
    }));
  };

  const handleArrayChange = (parent: string, child: string, field: string, value: string[]) => {
    handleDeepNestedInputChange(parent, child, field, value);
  };

  const addArrayItem = (parent: string, child: string, field: string, value: string) => {
    if (value.trim()) {
      const currentArray = (formData[parent as keyof typeof formData] as any)?.[child]?.[field] || [];
      handleArrayChange(parent, child, field, [...currentArray, value.trim()]);
    }
  };

  const removeArrayItem = (parent: string, child: string, field: string, index: number) => {
    const currentArray = (formData[parent as keyof typeof formData] as any)?.[child]?.[field] || [];
    handleArrayChange(parent, child, field, currentArray.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {application ? "Edit Application" : "New Application"}
        </h2>
        <p className="text-gray-600 mt-1">
          {application ? "Update application details" : "Submit a new application for MF or LC account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Applicant Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Applicant Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.applicantInfo?.firstName || ""}
                onChange={(e) => handleNestedInputChange("applicantInfo", "firstName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.applicantInfo?.lastName || ""}
                onChange={(e) => handleNestedInputChange("applicantInfo", "lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.applicantInfo?.email || ""}
                onChange={(e) => handleNestedInputChange("applicantInfo", "email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.applicantInfo?.phone || ""}
                onChange={(e) => handleNestedInputChange("applicantInfo", "phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.applicantInfo?.title || ""}
                onChange={(e) => handleNestedInputChange("applicantInfo", "title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                value={formData.applicantInfo?.company || ""}
                onChange={(e) => handleNestedInputChange("applicantInfo", "company", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.applicantInfo?.website || ""}
              onChange={(e) => handleNestedInputChange("applicantInfo", "website", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.applicantInfo?.address?.street || ""}
                  onChange={(e) => handleDeepNestedInputChange("applicantInfo", "address", "street", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.applicantInfo?.address?.city || ""}
                  onChange={(e) => handleDeepNestedInputChange("applicantInfo", "address", "city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.applicantInfo?.address?.state || ""}
                  onChange={(e) => handleDeepNestedInputChange("applicantInfo", "address", "state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.applicantInfo?.address?.zipCode || ""}
                  onChange={(e) => handleDeepNestedInputChange("applicantInfo", "address", "zipCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.applicantInfo?.address?.country || "USA"}
                  onChange={(e) => handleDeepNestedInputChange("applicantInfo", "address", "country", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Business Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessInfo?.businessName || ""}
                onChange={(e) => handleNestedInputChange("businessInfo", "businessName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <input
                type="text"
                value={formData.businessInfo?.businessType || ""}
                onChange={(e) => handleNestedInputChange("businessInfo", "businessType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax ID *
              </label>
              <input
                type="text"
                value={formData.businessInfo?.taxId || ""}
                onChange={(e) => handleNestedInputChange("businessInfo", "taxId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                value={formData.businessInfo?.registrationNumber || ""}
                onChange={(e) => handleNestedInputChange("businessInfo", "registrationNumber", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Date *
              </label>
              <input
                type="date"
                value={formData.businessInfo?.establishedDate ? new Date(formData.businessInfo.establishedDate).toISOString().split('T')[0] : ""}
                onChange={(e) => handleNestedInputChange("businessInfo", "establishedDate", new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees *
              </label>
              <input
                type="number"
                min="0"
                value={formData.businessInfo?.numberOfEmployees || 0}
                onChange={(e) => handleNestedInputChange("businessInfo", "numberOfEmployees", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Revenue *
              </label>
              <input
                type="number"
                min="0"
                value={formData.businessInfo?.annualRevenue || 0}
                onChange={(e) => handleNestedInputChange("businessInfo", "annualRevenue", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Application Type */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Application Type</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              value={formData.applicationType || "LC"}
              onChange={(e) => handleInputChange("applicationType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="LC">Learning Center (LC)</option>
              <option value="MF">Master Franchise (MF)</option>
            </select>
          </div>
        </div>

        {/* Student Goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Student Goals (Year 1-4)
          </h3>
          
          {[1, 2, 3, 4].map((year) => (
            <div key={year} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">Year {year}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Students *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentGoals?.[`year${year}` as keyof typeof formData.studentGoals]?.targetStudents || 0}
                    onChange={(e) => handleDeepNestedInputChange("studentGoals", `year${year}`, "targetStudents", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revenue Target *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.studentGoals?.[`year${year}` as keyof typeof formData.studentGoals]?.revenue || 0}
                    onChange={(e) => handleDeepNestedInputChange("studentGoals", `year${year}`, "revenue", parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Programs */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programs
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={programInput}
                    onChange={(e) => setProgramInput(e.target.value)}
                    placeholder="Add program..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("studentGoals", `year${year}`, "programs", programInput);
                        setProgramInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem("studentGoals", `year${year}`, "programs", programInput);
                      setProgramInput("");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.studentGoals?.[`year${year}` as keyof typeof formData.studentGoals]?.programs || []).map((program: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {program}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("studentGoals", `year${year}`, "programs", index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Milestones
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={milestoneInput}
                    onChange={(e) => setMilestoneInput(e.target.value)}
                    placeholder="Add milestone..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("studentGoals", `year${year}`, "milestones", milestoneInput);
                        setMilestoneInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem("studentGoals", `year${year}`, "milestones", milestoneInput);
                      setMilestoneInput("");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.studentGoals?.[`year${year}` as keyof typeof formData.studentGoals]?.milestones || []).map((milestone: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {milestone}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("studentGoals", `year${year}`, "milestones", index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Required Documents
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business License *
              </label>
              <input
                type="text"
                value={formData.documents?.businessLicense || ""}
                onChange={(e) => handleNestedInputChange("documents", "businessLicense", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="business_license.pdf"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Certificate *
              </label>
              <input
                type="text"
                value={formData.documents?.taxCertificate || ""}
                onChange={(e) => handleNestedInputChange("documents", "taxCertificate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tax_certificate.pdf"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marketing Plan *
            </label>
            <input
              type="text"
              value={formData.documents?.marketingPlan || ""}
              onChange={(e) => handleNestedInputChange("documents", "marketingPlan", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="marketing_plan.pdf"
              required
            />
          </div>

          {/* Financial Statements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Statements
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={documentInput}
                onChange={(e) => setDocumentInput(e.target.value)}
                placeholder="Add financial statement..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const currentArray = formData.documents?.financialStatements || [];
                    handleNestedInputChange("documents", "financialStatements", [...currentArray, documentInput.trim()]);
                    setDocumentInput("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const currentArray = formData.documents?.financialStatements || [];
                  handleNestedInputChange("documents", "financialStatements", [...currentArray, documentInput.trim()]);
                  setDocumentInput("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.documents?.financialStatements || []).map((doc: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                >
                  {doc}
                  <button
                    type="button"
                    onClick={() => {
                      const currentArray = formData.documents?.financialStatements || [];
                      handleNestedInputChange("documents", "financialStatements", currentArray.filter((_: any, i: number) => i !== index));
                    }}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
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
            {loading ? "Submitting..." : application ? "Update Application" : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
