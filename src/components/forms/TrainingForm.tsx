"use client";

import { useState, useEffect } from "react";
import { Training, TrainingType } from "@/types";
import { useUser, useSelectedScope } from "@/store/auth";
import { Calendar, MapPin, DollarSign, Users, BookOpen, Clock, User, Building } from "lucide-react";

interface TrainingFormProps {
  training?: Training;
  onSubmit: (data: Partial<Training>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TrainingForm({ training, onSubmit, onCancel, loading = false }: TrainingFormProps) {
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [formData, setFormData] = useState<Partial<Training>>({
    name: "",
    title: "",
    description: "",
    typeId: "",
    instructorId: "",
    participantIds: [],
    maxParticipants: 20,
    status: "scheduled",
    startDate: new Date(),
    endDate: new Date(),
    duration: 8,
    location: "",
    materials: [],
    objectives: [],
    agenda: [],
    recordType: "optional",
    seminarType: "in_person",
    start: new Date(),
    end: new Date(),
    max: 20,
    venue: {
      name: "",
      address: "",
      capacity: 25,
      facilities: [],
    },
    price: {
      amount: 0,
      currency: "USD",
      includes: [],
    },
    teacherTrainer: {
      id: "",
      name: "",
      role: "primary",
    },
    ttStatus: "pending",
    details: {
      agenda: "",
      materials: [],
      prerequisites: [],
      objectives: [],
      assessment: "",
    },
    approvalStatus: "draft",
    registrations: [],
    ...training,
  });

  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [selectedType, setSelectedType] = useState<string>(training?.typeId || "");

  // Sample training types - in a real app, this would come from an API
  useEffect(() => {
    const sampleTypes: TrainingType[] = [
      {
        id: "tt_1",
        name: "Teaching Methodology",
        description: "Modern teaching techniques and classroom management",
        category: "Pedagogy",
        duration: 8,
        prerequisites: ["Teaching experience", "Bachelor's degree"],
        objectives: ["Classroom management", "Student engagement", "Assessment techniques"],
        materials: ["Presentation slides", "Handouts", "Videos"],
        isRecurring: true,
        frequency: "monthly",
        recordType: "mandatory",
        seminarType: "in_person",
        createdBy: "user_1",
        isActive: true,
        requirements: ["Teaching experience", "Bachelor's degree"],
        certification: {
          required: true,
          validityPeriod: 24,
          renewalRequired: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setTrainingTypes(sampleTypes);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trainingData = {
      ...formData,
      typeId: selectedType,
      instructorId: formData.teacherTrainer?.id || "",
      startDate: formData.start || new Date(),
      endDate: formData.end || new Date(),
      max: formData.maxParticipants || 20,
      owner: {
        id: user?.id || "",
        name: user?.name || "",
        role: (user?.role === "HQ" ? "HQ" : "MF") as "HQ" | "MF",
      },
      hostingFranchisee: {
        id: selectedScope?.id || "",
        name: selectedScope?.name || "",
        location: selectedScope?.name || "",
      },
    };

    onSubmit(trainingData);
  };

  const canEdit = user?.role === "HQ" || user?.role === "MF";
  const isHQ = user?.role === "HQ";

  if (!canEdit) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">You don't have permission to create or edit trainings.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {training ? "Edit Training" : "Create New Training"}
        </h2>
        <p className="text-gray-600 mt-1">
          {training ? "Update training details" : "Set up a new training program"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Name *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Training Type and Classification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Training Type *
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a type</option>
              {trainingTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Type *
            </label>
            <select
              value={formData.recordType || "optional"}
              onChange={(e) => handleInputChange("recordType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="mandatory">Mandatory</option>
              <option value="optional">Optional</option>
              <option value="certification">Certification</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seminar Type *
            </label>
            <select
              value={formData.seminarType || "in_person"}
              onChange={(e) => handleInputChange("seminarType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="in_person">In Person</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Additional Training Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Duration (hours) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.duration || 8}
              onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Max Participants *
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxParticipants || 20}
              onChange={(e) => handleInputChange("maxParticipants", parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.start ? new Date(formData.start).toISOString().slice(0, 16) : ""}
              onChange={(e) => handleInputChange("start", new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.end ? new Date(formData.end).toISOString().slice(0, 16) : ""}
              onChange={(e) => handleInputChange("end", new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Venue Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Venue Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                value={formData.venue?.name || ""}
                onChange={(e) => handleNestedInputChange("venue", "name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="number"
                value={formData.venue?.capacity || 25}
                onChange={(e) => handleNestedInputChange("venue", "capacity", parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <textarea
              value={formData.venue?.address || ""}
              onChange={(e) => handleNestedInputChange("venue", "address", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Pricing Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price?.amount || 0}
                onChange={(e) => handleNestedInputChange("price", "amount", parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                value={formData.price?.currency || "USD"}
                onChange={(e) => handleNestedInputChange("price", "currency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teacher Trainer */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Teacher Trainer
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trainer Name *
              </label>
              <input
                type="text"
                value={formData.teacherTrainer?.name || ""}
                onChange={(e) => handleNestedInputChange("teacherTrainer", "name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={formData.teacherTrainer?.role || "primary"}
                onChange={(e) => handleNestedInputChange("teacherTrainer", "role", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="assistant">Assistant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Training Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Training Details
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agenda *
            </label>
            <textarea
              value={formData.details?.agenda || ""}
              onChange={(e) => handleNestedInputChange("details", "agenda", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Method *
            </label>
            <textarea
              value={formData.details?.assessment || ""}
              onChange={(e) => handleNestedInputChange("details", "assessment", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
            {loading ? "Saving..." : training ? "Update Training" : "Create Training"}
          </button>
        </div>
      </form>
    </div>
  );
}
