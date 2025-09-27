"use client";

import { useState } from "react";
import { X, Download, FileText } from "lucide-react";

interface ContractPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractFile: string;
  contractDate?: Date | string;
  teacherName: string;
}

export function ContractPreviewModal({ 
  isOpen, 
  onClose, 
  contractFile, 
  contractDate, 
  teacherName 
}: ContractPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    // In a real implementation, this would download the actual file
    // For now, we'll just show an alert
    alert(`Downloading contract: ${contractFile}`);
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Contract Preview</h2>
              <p className="text-sm text-gray-600">{teacherName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contract Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Contract File</label>
              <p className="text-sm text-gray-900">{contractFile}</p>
            </div>
            {contractDate && (
              <div>
                <label className="text-sm font-medium text-gray-700">Contract Date</label>
                <p className="text-sm text-gray-900">{formatDate(contractDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contract Preview Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contract Preview</h3>
            <p className="text-gray-600 mb-4">
              This is a placeholder for the contract preview. In a real implementation, 
              this would show the actual contract document (PDF, DOC, etc.).
            </p>
            <div className="bg-gray-100 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">Contract Details:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Teacher: {teacherName}</li>
                <li>• File: {contractFile}</li>
                {contractDate && <li>• Date: {formatDate(contractDate)}</li>}
                <li>• Status: Active Contract</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Contract uploaded and ready for review
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
