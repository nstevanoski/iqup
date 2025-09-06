"use client";

import { useState } from "react";
import { TrainingRegistration, Teacher } from "@/types";
import { useUser } from "@/store/auth";
import { CheckCircle, XCircle, User, Calendar, BookOpen, MessageSquare } from "lucide-react";

interface TTMarkingFormProps {
  registration: TrainingRegistration;
  teacher: Teacher;
  onMarkPass: (feedback?: string) => void;
  onMarkFail: (feedback?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TTMarkingForm({ 
  registration, 
  teacher, 
  onMarkPass, 
  onMarkFail, 
  onCancel, 
  loading = false 
}: TTMarkingFormProps) {
  const user = useUser();
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const canMark = user?.role === "TT";

  if (!canMark) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Only Teacher Trainers can mark training completion.</p>
      </div>
    );
  }

  const handleMarkPass = () => {
    if (showFeedback) {
      onMarkPass(feedback);
    } else {
      onMarkPass();
    }
  };

  const handleMarkFail = () => {
    if (showFeedback) {
      onMarkFail(feedback);
    } else {
      onMarkFail();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "attended":
        return "bg-blue-100 text-blue-800";
      case "registered":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mark Training Completion</h2>
        <p className="text-gray-600 mt-1">Assess teacher performance and mark pass/fail</p>
      </div>

      {/* Teacher Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-4">
          <User className="h-8 w-8 text-gray-400 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-sm text-gray-600">{teacher.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Experience</p>
            <p className="text-sm text-gray-900">{teacher.experience} years</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Specializations</p>
            <p className="text-sm text-gray-900">{teacher.specialization.join(", ")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Registration Date</p>
            <p className="text-sm text-gray-900">
              {new Date(registration.registrationDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Current Status</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}>
              {registration.status}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Information */}
      {registration.attendance.present && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Attendance Confirmed</h4>
              <p className="text-sm text-green-700">
                Check-in: {registration.attendance.checkInTime ? new Date(registration.attendance.checkInTime).toLocaleString() : "N/A"}
                {registration.attendance.checkOutTime && (
                  <span> • Check-out: {new Date(registration.attendance.checkOutTime).toLocaleString()}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Previous Assessment */}
      {registration.assessment.gradedBy && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Previous Assessment</h4>
              <p className="text-sm text-blue-700">
                Status: {registration.assessment.passed ? "Passed" : "Failed"}
                {registration.assessment.score && (
                  <span> • Score: {registration.assessment.score}/{registration.assessment.maxScore}</span>
                )}
                {registration.assessment.gradedAt && (
                  <span> • Graded: {new Date(registration.assessment.gradedAt).toLocaleDateString()}</span>
                )}
              </p>
              {registration.assessment.feedback && (
                <p className="text-sm text-blue-600 mt-1">
                  Feedback: {registration.assessment.feedback}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assessment Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Assessment Decision</h3>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showFeedback"
            checked={showFeedback}
            onChange={(e) => setShowFeedback(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="showFeedback" className="ml-2 block text-sm text-gray-900">
            Add feedback comments
          </label>
        </div>

        {showFeedback && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="inline h-4 w-4 mr-1" />
              Feedback Comments
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Provide detailed feedback on the teacher's performance..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleMarkPass}
            disabled={loading}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Passed
          </button>
          <button
            onClick={handleMarkFail}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Mark as Failed
          </button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
