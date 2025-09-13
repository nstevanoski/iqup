"use client";

import { useState, useEffect } from "react";
import { Training, TrainingRegistration, Teacher } from "@/types";
import { useUser, useSelectedScope } from "@/store/auth";
import { Users, Calendar, User, CheckCircle, AlertCircle } from "lucide-react";

interface TeacherRegistrationFormProps {
  training: Training;
  onSubmit: (registration: Partial<TrainingRegistration>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TeacherRegistrationForm({ training, onSubmit, onCancel, loading = false }: TeacherRegistrationFormProps) {
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);

  // Sample teachers - in a real app, this would come from an API
  useEffect(() => {
    const sampleTeachers: Teacher[] = [
      {
        id: "teacher_1",
        firstName: "John",
        lastName: "Smith",
        title: "Mr.",
        email: "john.smith@example.com",
        phone: "+1-555-0123",
        dateOfBirth: new Date("1985-03-15"),
        gender: "male",
        status: "active",
        education: [{
          degree: "Bachelor of Education",
          institution: "University of Education",
          graduationYear: 2020,
          fieldOfStudy: "Education",
        }],
        trainings: [{
          trainingId: "train_1",
          trainingName: "Teaching Methodology",
          completedDate: "2024-01-15",
          status: "completed",
          certification: "Teaching Certificate",
        }],
        qualifications: ["Teaching Certificate"],
        specialization: ["Mathematics", "Science"],
        experience: 5,
        availability: [{
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "17:00",
        }],
        hourlyRate: 25,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "teacher_2",
        firstName: "Sarah",
        lastName: "Johnson",
        title: "Ms.",
        email: "sarah.johnson@example.com",
        phone: "+1-555-0124",
        dateOfBirth: new Date("1988-07-22"),
        gender: "female",
        status: "active",
        education: [{
          degree: "Master of Education",
          institution: "Education University",
          graduationYear: 2018,
          fieldOfStudy: "Education",
        }],
        trainings: [{
          trainingId: "train_2",
          trainingName: "Advanced Teaching Methods",
          completedDate: "2024-02-10",
          status: "completed",
          certification: "Advanced Teaching Certificate",
        }],
        qualifications: ["Advanced Teaching Certificate"],
        specialization: ["English", "Literature"],
        experience: 7,
        availability: [{
          dayOfWeek: 2,
          startTime: "10:00",
          endTime: "15:00",
        }],
        hourlyRate: 30,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "teacher_3",
        firstName: "Michael",
        lastName: "Brown",
        title: "Dr.",
        email: "michael.brown@example.com",
        phone: "+1-555-0125",
        dateOfBirth: new Date("1982-11-08"),
        gender: "male",
        status: "active",
        education: [{
          degree: "Bachelor of Science",
          institution: "Science University",
          graduationYear: 2019,
          fieldOfStudy: "Physics",
        }],
        trainings: [],
        qualifications: ["Science Teaching Certificate"],
        specialization: ["Physics", "Chemistry"],
        experience: 4,
        availability: [{
          dayOfWeek: 3,
          startTime: "09:00",
          endTime: "17:00",
        }],
        hourlyRate: 28,
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    // Filter teachers based on user role and scope
    let filteredTeachers = sampleTeachers;
    
    setAvailableTeachers(filteredTeachers);
  }, [user, selectedScope]);

  const canRegister = user?.role === "MF" || user?.role === "LC";
  const remainingSlots = training.max - training.participantIds.length;

  if (!canRegister) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Only MF and LC users can register teachers for trainings.</p>
      </div>
    );
  }

  const handleTeacherToggle = (teacherId: string) => {
    setSelectedTeachers(prev => {
      if (prev.includes(teacherId)) {
        return prev.filter(id => id !== teacherId);
      } else {
        // Check if we haven't exceeded the remaining slots
        if (prev.length < remainingSlots) {
          return [...prev, teacherId];
        }
        return prev;
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTeachers.length === 0) {
      alert("Please select at least one teacher to register.");
      return;
    }

    // Create registration data for each selected teacher
    const registrations = selectedTeachers.map(teacherId => ({
      trainingId: training.id,
      teacherId,
      registeredBy: user?.id || "",
      registrationDate: new Date(),
      status: "registered" as const,
      attendance: {
        present: false,
      },
      assessment: {
        passed: false,
      },
    }));

    // For now, we'll just submit the first registration
    // In a real app, you might want to handle multiple registrations
    onSubmit(registrations[0]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Register Teachers for Training</h2>
        <p className="text-gray-600 mt-1">{training.name}</p>
      </div>

      {/* Training Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Date & Time</p>
              <p className="text-sm text-gray-600">
                {new Date(training.start).toLocaleDateString()} - {new Date(training.end).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Capacity</p>
              <p className="text-sm text-gray-600">
                {training.participantIds.length}/{training.max} registered
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Trainer</p>
              <p className="text-sm text-gray-600">{training.teacherTrainer.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Slots Alert */}
      {remainingSlots <= 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Training Full
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>This training has reached its maximum capacity. No more registrations can be accepted.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {remainingSlots > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Available Teachers ({availableTeachers.length})
            </h3>
            <p className="text-sm text-gray-600">
              Select up to {remainingSlots} teacher(s) to register for this training.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {availableTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTeachers.includes(teacher.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleTeacherToggle(teacher.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher.id)}
                        onChange={() => handleTeacherToggle(teacher.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{teacher.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {teacher.experience} years experience
                          </span>
                          <span className="text-xs text-gray-500">
                            {teacher.specialization.join(", ")}
                          </span>
                          {teacher.trainings.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {teacher.trainings.length} training(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${teacher.hourlyRate}/hour
                      </p>
                      <p className="text-xs text-gray-500">
                        Available: {teacher.availability.length} day(s)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {availableTeachers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Teachers Available</h3>
                <p className="text-gray-600">
                  There are no teachers available in your region for this training.
                </p>
              </div>
            )}

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
                disabled={loading || selectedTeachers.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Registering..." : `Register ${selectedTeachers.length} Teacher(s)`}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
