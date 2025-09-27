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

  // Parse the contract file data
  const getFileData = () => {
    try {
      return JSON.parse(contractFile);
    } catch {
      // Fallback for old format (just filename)
      return { name: contractFile, url: null };
    }
  };

  const fileData = getFileData();

  const handleDownload = () => {
    if (fileData.url) {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = fileData.url;
      link.download = fileData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Downloading contract: ${fileData.name}`);
    }
  };

  const renderFilePreview = () => {
    if (!fileData.url) {
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Contract Preview</h3>
          <p className="text-gray-600 mb-4">
            File: {fileData.name}
          </p>
          <p className="text-sm text-gray-500">
            File preview not available. Click download to view the contract.
          </p>
        </div>
      );
    }

    // Determine file type and render appropriate preview
    const fileType = fileData.type || '';
    
    if (fileType.includes('pdf')) {
      return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <iframe
            src={fileData.url}
            className="w-full h-96"
            title="Contract Preview"
          />
        </div>
      );
    } else if (fileType.includes('image')) {
      return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <img
            src={fileData.url}
            alt="Contract Preview"
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
      );
    } else {
      // For other file types (doc, docx, etc.)
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Contract Preview</h3>
          <p className="text-gray-600 mb-4">
            File: {fileData.name}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Preview not available for this file type. Click download to view the contract.
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download to View
          </button>
        </div>
      );
    }
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
              <p className="text-sm text-gray-900">{fileData.name}</p>
              {fileData.size && (
                <p className="text-xs text-gray-500">
                  {(fileData.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
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
          {renderFilePreview()}
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
