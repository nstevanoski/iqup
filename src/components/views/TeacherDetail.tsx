"use client";

import { Teacher } from "@/types";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";

interface TeacherDetailProps {
  teacher: Teacher;
  onEdit?: () => void;
  onDelete?: () => void;
  onUploadContract?: () => void;
  onApprove?: () => void;
  onViewContract?: () => void;
  userRole?: string;
}

export function TeacherDetail({ teacher, onEdit, onDelete, onUploadContract, onApprove, onViewContract, userRole }: TeacherDetailProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatDateOfBirth = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'process':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'on_leave':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return '♂';
      case 'female':
        return '♀';
      default:
        return '⚧';
    }
  };

  // getActiveCenters function removed per requirements

  const getCompletedTrainings = () => {
    return teacher.trainings?.filter(training => training.status === 'completed') || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                {teacher.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">
                {getGenderIcon(teacher.gender)} {teacher.gender}
              </span>
              <span className="text-sm text-gray-500">
                Born: {formatDateOfBirth(teacher.dateOfBirth)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
          )}
          {onUploadContract && userRole && (userRole === 'MF_ADMIN' || userRole === 'MF_STAFF' || userRole === 'MF') && teacher.status === 'process' && !teacher.contractFile && (
            <button
              onClick={onUploadContract}
              className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Upload Contract
            </button>
          )}
          {onViewContract && teacher.contractFile && (
            <button
              onClick={onViewContract}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Contract
            </button>
          )}
          {onApprove && userRole && (userRole === 'HQ_ADMIN' || userRole === 'HQ_STAFF' || userRole === 'HQ') && teacher.status === 'process' && teacher.contractFile && (
            <button
              onClick={onApprove}
              className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{teacher.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{teacher.phone}</span>
          </div>
          {teacher.address && (
            <div className="flex items-start space-x-3 md:col-span-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div className="text-sm text-gray-600">
                <div>{teacher.address.street}</div>
                <div>{teacher.address.city}, {teacher.address.state} {teacher.address.zipCode}</div>
                <div>{teacher.address.country}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Professional Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Experience</h3>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{teacher.experience} years</span>
            </div>
          </div>
          {/* Removed Hourly Rate and Specializations per requirements */}
        </div>
        
        {teacher.bio && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
            <p className="text-sm text-gray-600">{teacher.bio}</p>
          </div>
        )}
      </div>

      {/* Education and Trainings removed per requirements */}

      {/* Active Centers section removed per requirements */}

      {/* Contract Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Contract Information
        </h2>
        
        {teacher.contractFile ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Contract Uploaded</p>
                <p className="text-sm text-gray-600">
                  {(() => {
                    try {
                      const fileData = JSON.parse(teacher.contractFile);
                      return fileData.name;
                    } catch {
                      return teacher.contractFile;
                    }
                  })()}
                </p>
              </div>
            </div>
            
            {teacher.contractDate && (
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Contract Date</p>
                  <p className="text-sm text-gray-600">
                    {typeof teacher.contractDate === 'string' 
                      ? formatDate(new Date(teacher.contractDate))
                      : formatDate(teacher.contractDate)}
                  </p>
                </div>
              </div>
            )}
            
            {teacher.contractUploadedAt && (
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Uploaded</p>
                  <p className="text-sm text-gray-600">
                    {typeof teacher.contractUploadedAt === 'string' 
                      ? formatDate(new Date(teacher.contractUploadedAt))
                      : formatDate(teacher.contractUploadedAt)}
                  </p>
                </div>
              </div>
            )}
            
            {teacher.approvedAt && (
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Approved</p>
                  <p className="text-sm text-gray-600">
                    {typeof teacher.approvedAt === 'string' 
                      ? formatDate(new Date(teacher.approvedAt))
                      : formatDate(teacher.approvedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">No Contract Uploaded</p>
              <p className="text-sm text-gray-600">Contract must be uploaded before teacher can be approved</p>
            </div>
          </div>
        )}
      </div>

      {/* Availability */}
      {teacher.availability && teacher.availability.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teacher.availability.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][slot.dayOfWeek]}
                </span>
                <span className="text-sm text-gray-600">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
