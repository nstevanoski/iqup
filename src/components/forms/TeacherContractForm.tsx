"use client";

import { useState } from "react";

interface TeacherContractFormProps {
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
    status: string;
    contractFile?: string;
    contractDate?: Date;
  };
  onSubmit: (data: { contractFile: string; contractDate: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  contractFile: string;
  contractDate: string;
}

export function TeacherContractForm({ teacher, onSubmit, onCancel, loading = false }: TeacherContractFormProps) {
  const [formData, setFormData] = useState<FormData>({
    contractFile: teacher.contractFile || "",
    contractDate: teacher.contractDate ? 
      (typeof teacher.contractDate === 'string' 
        ? teacher.contractDate.split('T')[0] 
        : teacher.contractDate.toISOString().split('T')[0]) 
      : ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.contractFile.trim() && !selectedFile) {
      newErrors.contractFile = "Contract file is required";
    }
    if (!formData.contractDate.trim()) {
      newErrors.contractDate = "Contract date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, contractFile: file.name }));
      // Clear file error if file is selected
      if (errors.contractFile) {
        setErrors(prev => ({ ...prev, contractFile: "" }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        contractFile: selectedFile ? selectedFile.name : formData.contractFile,
        contractDate: formData.contractDate
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Contract</h2>
        <p className="text-gray-600">
          Upload contract for <strong>{teacher.firstName} {teacher.lastName}</strong>
        </p>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            teacher.status === 'PROCESS' 
              ? 'bg-yellow-100 text-yellow-800' 
              : teacher.status === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            Status: {teacher.status}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contract File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contract File *
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="contract-file"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="contract-file"
                    name="contract-file"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
            </div>
          </div>
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name}
            </div>
          )}
          {errors.contractFile && <p className="text-red-500 text-xs mt-1">{errors.contractFile}</p>}
        </div>

        {/* Contract Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contract Date *
          </label>
          <input
            type="date"
            value={formData.contractDate}
            onChange={(e) => setFormData(prev => ({ ...prev, contractDate: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.contractDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contractDate && <p className="text-red-500 text-xs mt-1">{errors.contractDate}</p>}
        </div>

        {/* Current Contract Info */}
        {teacher.contractFile && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Current Contract</h4>
            <p className="text-sm text-blue-700">
              File: {teacher.contractFile}
            </p>
            {teacher.contractDate && (
              <p className="text-sm text-blue-700">
                Date: {new Date(teacher.contractDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Contract"}
          </button>
        </div>
      </form>
    </div>
  );
}
