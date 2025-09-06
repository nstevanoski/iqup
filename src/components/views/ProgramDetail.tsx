"use client";

import { Program } from "@/types";
import { useUser } from "@/store/auth";
import { Clock, Users, DollarSign, BookOpen, Target, CheckCircle, Globe, Share2, Lock, Calendar, Timer } from "lucide-react";

interface ProgramDetailProps {
  program: Program;
  onEdit?: () => void;
}

export function ProgramDetail({ program, onEdit }: ProgramDetailProps) {
  const user = useUser();
  const canEdit = user?.role === "HQ";

  const kindColors = {
    academic: "bg-blue-100 text-blue-800",
    vocational: "bg-green-100 text-green-800",
    certification: "bg-purple-100 text-purple-800",
    workshop: "bg-orange-100 text-orange-800",
    birthday_party: "bg-pink-100 text-pink-800",
    stem_camp: "bg-indigo-100 text-indigo-800",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
  };

  const visibilityIcons = {
    private: Lock,
    shared: Share2,
    public: Globe,
  };

  const VisibilityIcon = visibilityIcons[program.visibility];

  const getMFScopeNames = (scopeIds: string[]): string[] => {
    const scopeMap: Record<string, string> = {
      "mf_region_1": "Region 1",
      "mf_region_2": "Region 2",
      "mf_region_3": "Region 3",
    };
    return scopeIds.map(id => scopeMap[id] || id);
  };

  return (
    <div className="space-y-6">
      {/* Status and Meta Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[program.status]}`}>
            {program.status}
          </span>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${kindColors[program.kind]}`}>
            {program.kind}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Created {program.createdAt.toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            Updated {program.updatedAt.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {program.currentStudents}/{program.maxStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Price</p>
              <p className="text-2xl font-bold text-gray-900">${program.price}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">{program.hours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-2xl font-bold text-gray-900">{program.duration} weeks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Category:</span>
              <span className="font-medium">{program.category}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${kindColors[program.kind]}`}>
                {program.kind}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Lesson Length:</span>
              <span className="font-medium">{program.lessonLength} minutes</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Visibility:</span>
              <div className="flex items-center gap-2">
                <VisibilityIcon className="h-4 w-4 text-gray-500" />
                <span className="font-medium capitalize">{program.visibility}</span>
              </div>
            </div>

            {program.visibility === "shared" && program.sharedWithMFs.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Shared with:</span>
                <div className="text-right">
                  {getMFScopeNames(program.sharedWithMFs).map((scope, index) => (
                    <div key={index} className="text-sm font-medium">{scope}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enrollment Progress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrollment Status</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Enrollment Progress</span>
                <span className="text-sm font-medium">
                  {Math.round((program.currentStudents / program.maxStudents) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(program.currentStudents / program.maxStudents) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{program.currentStudents}</p>
                <p className="text-sm text-gray-500">Current Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{program.maxStudents - program.currentStudents}</p>
                <p className="text-sm text-gray-500">Available Spots</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Requirements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {program.requirements.map((requirement, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{requirement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Learning Objectives
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {program.learningObjectives.map((objective, index) => (
            <div key={index} className="flex items-start gap-3">
              <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{objective}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      {user?.role === "HQ" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Administrative Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-gray-500">Created by:</span>
              <p className="font-medium">{program.createdBy}</p>
            </div>
            
            <div>
              <span className="text-gray-500">Program ID:</span>
              <p className="font-medium font-mono text-sm">{program.id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
