"use client";

import { useState } from "react";
import { TeacherTrainerAccount, TeacherTrainerProfile } from "@/types";
import { useUser } from "@/store/auth";
import { User, Mail, Phone, Award, BookOpen, Globe, Clock, AlertCircle } from "lucide-react";

interface TTAccountFormProps {
  ttAccount?: TeacherTrainerAccount;
  onSubmit: (data: Partial<TeacherTrainerAccount>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TTAccountForm({ ttAccount, onSubmit, onCancel, loading = false }: TTAccountFormProps) {
  const user = useUser();
  const [formData, setFormData] = useState<Partial<TeacherTrainerAccount>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "TT",
    status: "active",
    permissions: [
      { resource: "trainings", actions: ["read", "update"] },
      { resource: "assessments", actions: ["create", "read", "update"] },
    ],
    profile: {
      bio: "",
      specialization: [],
      experience: 0,
      qualifications: [],
      certifications: [],
      languages: ["English"],
      timezone: "UTC",
    },
    ...ttAccount,
  });

  const [specializationInput, setSpecializationInput] = useState("");
  const [qualificationInput, setQualificationInput] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile!,
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    handleProfileChange(field, value);
  };

  const addArrayItem = (field: string, value: string) => {
    if (value.trim()) {
      const currentArray = (formData.profile?.[field as keyof TeacherTrainerProfile] as string[]) || [];
      handleArrayChange(field, [...currentArray, value.trim()]);
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = (formData.profile?.[field as keyof TeacherTrainerProfile] as string[]) || [];
    handleArrayChange(field, currentArray.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ttAccountData = {
      ...formData,
      role: "TT" as const,
    };

    onSubmit(ttAccountData);
  };

  // Only HQ users can create/edit TT accounts
  if (user?.role !== "HQ") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Only HQ users can create or edit teacher trainer accounts.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {ttAccount ? "Edit Teacher Trainer Account" : "Create New Teacher Trainer Account"}
        </h2>
        <p className="text-gray-600 mt-1">
          {ttAccount ? "Update teacher trainer account details" : "Set up a new teacher trainer account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                value={formData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status *
            </label>
            <select
              value={formData.status || "active"}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Professional Profile
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.profile?.bio || ""}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief professional biography..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Experience (years) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.profile?.experience || 0}
                onChange={(e) => handleProfileChange("experience", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Timezone *
              </label>
              <select
                value={formData.profile?.timezone || "UTC"}
                onChange={(e) => handleProfileChange("timezone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="MST">Mountain Time (MST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="CET">Central European Time (CET)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Specializations</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={specializationInput}
              onChange={(e) => setSpecializationInput(e.target.value)}
              placeholder="Add specialization..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("specialization", specializationInput);
                  setSpecializationInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("specialization", specializationInput);
                setSpecializationInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.profile?.specialization || []).map((spec, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {spec}
                <button
                  type="button"
                  onClick={() => removeArrayItem("specialization", index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Qualifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Qualifications</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={qualificationInput}
              onChange={(e) => setQualificationInput(e.target.value)}
              placeholder="Add qualification..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("qualifications", qualificationInput);
                  setQualificationInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("qualifications", qualificationInput);
                setQualificationInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.profile?.qualifications || []).map((qual, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {qual}
                <button
                  type="button"
                  onClick={() => removeArrayItem("qualifications", index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Certifications
          </h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={certificationInput}
              onChange={(e) => setCertificationInput(e.target.value)}
              placeholder="Add certification..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("certifications", certificationInput);
                  setCertificationInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("certifications", certificationInput);
                setCertificationInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.profile?.certifications || []).map((cert, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
              >
                {cert}
                <button
                  type="button"
                  onClick={() => removeArrayItem("certifications", index)}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Languages</h3>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              placeholder="Add language..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addArrayItem("languages", languageInput);
                  setLanguageInput("");
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem("languages", languageInput);
                setLanguageInput("");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.profile?.languages || []).map((lang, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
              >
                {lang}
                <button
                  type="button"
                  onClick={() => removeArrayItem("languages", index)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
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
            {loading ? "Saving..." : ttAccount ? "Update TT Account" : "Create TT Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
