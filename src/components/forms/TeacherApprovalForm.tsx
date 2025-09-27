"use client";

import { useState } from "react";
import { ContractPreviewModal } from "@/components/ui/ContractPreviewModal";

interface TeacherApprovalFormProps {
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
    status: string;
    contractFile?: string;
    contractDate?: Date;
    contractUploadedAt?: Date;
    contractUploadedBy?: number;
  };
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TeacherApprovalForm({ teacher, onSubmit, onCancel, loading = false }: TeacherApprovalFormProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  const handleApprove = () => {
    setIsApproving(true);
    onSubmit();
  };

  const canApprove = (teacher.status === 'PROCESS' || teacher.status === 'process') && teacher.contractFile && teacher.contractDate;

  // Parse the contract file data
  const getFileData = () => {
    if (!teacher.contractFile) {
      return { name: '', url: null };
    }
    try {
      return JSON.parse(teacher.contractFile);
    } catch {
      // Fallback for old format (just filename)
      return { name: teacher.contractFile, url: null };
    }
  };

  const fileData = getFileData();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Approve Teacher</h2>
        <p className="text-gray-600">
          Review and approve <strong>{teacher.firstName} {teacher.lastName}</strong>
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

      {/* Contract Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-800 mb-3">Contract Information</h4>
        
        {teacher.contractFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">File:</span>
                <span className="text-gray-600">{fileData.name}</span>
              </div>
              <button
                onClick={() => setIsContractModalOpen(true)}
                className="flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </button>
            </div>
            {fileData.size && (
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Size:</span>
                <span className="text-gray-600">{(fileData.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
            {teacher.contractDate && (
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Date:</span>
                <span className="text-gray-600">
                  {typeof teacher.contractDate === 'string' 
                    ? new Date(teacher.contractDate).toLocaleDateString()
                    : teacher.contractDate.toLocaleDateString()}
                </span>
              </div>
            )}
            {teacher.contractUploadedAt && (
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Uploaded:</span>
                <span className="text-gray-600">
                  {typeof teacher.contractUploadedAt === 'string' 
                    ? new Date(teacher.contractUploadedAt).toLocaleDateString()
                    : teacher.contractUploadedAt.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-red-600">
            No contract uploaded
          </div>
        )}
      </div>

      {/* Approval Status */}
      <div className="mb-6">
        {canApprove ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Ready for Approval
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>This teacher has a valid contract and is ready to be approved.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Cannot Approve
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This teacher cannot be approved because:</p>
                  <ul className="list-disc list-inside mt-1">
                    {teacher.status !== 'PROCESS' && teacher.status !== 'process' && <li>Teacher is not in PROCESS status (current: {teacher.status})</li>}
                    {!teacher.contractFile && <li>No contract file uploaded</li>}
                    {!teacher.contractDate && <li>No contract date specified</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
          type="button"
          onClick={handleApprove}
          disabled={loading || !canApprove}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Approving..." : "Approve Teacher"}
        </button>
      </div>

      {/* Contract Preview Modal */}
      <ContractPreviewModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        contractFile={teacher.contractFile || ''}
        contractDate={teacher.contractDate}
        teacherName={`${teacher.firstName} ${teacher.lastName}`}
      />
    </div>
  );
}
