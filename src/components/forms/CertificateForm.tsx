"use client";

import { useState } from "react";
import { StudentCertificate } from "@/types";

interface CertificateFormProps {
  certificate?: StudentCertificate;
  onSubmit: (data: Partial<StudentCertificate>) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  programId: string;
  programName: string;
  subProgramId?: string;
  subProgramName?: string;
  certificateCode: string;
  issuedDate: string;
  validUntil?: string;
  status: "active" | "revoked";
  issuedBy: string;
}

const initialFormData: FormData = {
  programId: "",
  programName: "",
  subProgramId: "",
  subProgramName: "",
  certificateCode: "",
  issuedDate: "",
  validUntil: "",
  status: "active",
  issuedBy: "",
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "revoked", label: "Revoked" },
];

export function CertificateForm({ certificate, onSubmit, onCancel, loading = false }: CertificateFormProps) {
  const [formData, setFormData] = useState<FormData>(
    certificate ? {
      programId: certificate.programId,
      programName: certificate.programName,
      subProgramId: certificate.subProgramId || "",
      subProgramName: certificate.subProgramName || "",
      certificateCode: certificate.certificateCode,
      issuedDate: certificate.issuedDate.toISOString().split('T')[0],
      validUntil: certificate.validUntil?.toISOString().split('T')[0] || "",
      status: certificate.status,
      issuedBy: certificate.issuedBy,
    } : initialFormData
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.programId) {
      newErrors.programId = "Program is required";
    }
    if (!formData.programName.trim()) {
      newErrors.programName = "Program name is required";
    }
    if (!formData.certificateCode.trim()) {
      newErrors.certificateCode = "Certificate code is required";
    }
    if (!formData.issuedDate) {
      newErrors.issuedDate = "Issued date is required";
    }
    if (!formData.issuedBy.trim()) {
      newErrors.issuedBy = "Issued by is required";
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

  const generateCertificateCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `CERT-${timestamp}-${random}`;
    handleInputChange("certificateCode", code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      issuedDate: new Date(formData.issuedDate),
      validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Certificate Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program *
            </label>
            <input
              type="text"
              value={formData.programName}
              onChange={(e) => handleInputChange("programName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.programName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter program name"
            />
            {errors.programName && <p className="text-red-500 text-sm mt-1">{errors.programName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Program
            </label>
            <input
              type="text"
              value={formData.subProgramName}
              onChange={(e) => handleInputChange("subProgramName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter sub program name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.certificateCode}
                onChange={(e) => handleInputChange("certificateCode", e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.certificateCode ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter certificate code"
              />
              <button
                type="button"
                onClick={generateCertificateCode}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Generate
              </button>
            </div>
            {errors.certificateCode && <p className="text-red-500 text-sm mt-1">{errors.certificateCode}</p>}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issued Date *
            </label>
            <input
              type="date"
              value={formData.issuedDate}
              onChange={(e) => handleInputChange("issuedDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.issuedDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.issuedDate && <p className="text-red-500 text-sm mt-1">{errors.issuedDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valid Until
            </label>
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => handleInputChange("validUntil", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issued By *
            </label>
            <input
              type="text"
              value={formData.issuedBy}
              onChange={(e) => handleInputChange("issuedBy", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.issuedBy ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter name of person who issued the certificate"
            />
            {errors.issuedBy && <p className="text-red-500 text-sm mt-1">{errors.issuedBy}</p>}
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate Preview</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Certificate of Completion</h2>
            <p className="text-lg text-gray-700">This is to certify that</p>
            <h3 className="text-xl font-semibold text-blue-600">[Student Name]</h3>
            <p className="text-gray-700">has successfully completed</p>
            <h4 className="text-lg font-medium text-gray-900">{formData.programName || "[Program Name]"}</h4>
            {formData.subProgramName && (
              <p className="text-gray-700">Sub Program: {formData.subProgramName}</p>
            )}
            <div className="flex justify-between text-sm text-gray-600 mt-6">
              <div>
                <p>Issued Date: {formData.issuedDate || "[Date]"}</p>
                {formData.validUntil && (
                  <p>Valid Until: {formData.validUntil}</p>
                )}
              </div>
              <div>
                <p>Certificate Code: {formData.certificateCode || "[Code]"}</p>
                <p>Issued By: {formData.issuedBy || "[Issuer]"}</p>
              </div>
            </div>
          </div>
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
          {loading ? "Saving..." : certificate ? "Update Certificate" : "Generate Certificate"}
        </button>
      </div>
    </form>
  );
}
