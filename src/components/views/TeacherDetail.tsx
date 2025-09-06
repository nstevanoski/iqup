"use client";

import { Teacher } from "@/types";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  GraduationCap, 
  Award, 
  BookOpen,
  Edit,
  Trash2
} from "lucide-react";

interface TeacherDetailProps {
  teacher: Teacher;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TeacherDetail({ teacher, onEdit, onDelete }: TeacherDetailProps) {
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
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
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

  const getActiveCenters = () => {
    return teacher.centers?.filter(center => center.isActive) || [];
  };

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
              {teacher.title} {teacher.firstName} {teacher.lastName}
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
          <GraduationCap className="h-5 w-5 mr-2" />
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
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Hourly Rate</h3>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">${teacher.hourlyRate}/hour</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Specializations</h3>
            <div className="flex flex-wrap gap-1">
              {teacher.specialization.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {teacher.bio && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
            <p className="text-sm text-gray-600">{teacher.bio}</p>
          </div>
        )}
      </div>

      {/* Education */}
      {teacher.education && teacher.education.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Education
          </h2>
          <div className="space-y-4">
            {teacher.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <span className="text-xs text-gray-500">{edu.graduationYear}</span>
                </div>
                <p className="text-sm text-gray-600">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trainings */}
      {teacher.trainings && teacher.trainings.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Trainings & Certifications
          </h2>
          <div className="space-y-4">
            {teacher.trainings.map((training, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{training.trainingName}</h3>
                  {training.certification && (
                    <p className="text-xs text-gray-600">{training.certification}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    training.status === 'completed' ? 'bg-green-100 text-green-800' :
                    training.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {training.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(training.completedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Centers */}
      {getActiveCenters().length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Active Centers
          </h2>
          <div className="space-y-3">
            {getActiveCenters().map((center, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{center.centerName}</h3>
                  <p className="text-xs text-gray-600">{center.role}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Since {new Date(center.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
