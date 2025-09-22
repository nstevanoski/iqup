"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LearningGroup } from "@/types";
import { ArrowLeft, Save, Loader2, Calendar, Clock, MapPin, DollarSign, Users, User, Building } from "lucide-react";
import { getLearningGroup, updateLearningGroup, UpdateLearningGroupData } from "@/lib/api/learning-groups";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/SearchableSelect";
import { getPrograms } from "@/lib/api/programs";
import { getSubPrograms } from "@/lib/api/subprograms";
import { teachersAPI } from "@/lib/api/teachers";
import { Program, SubProgram, Teacher } from "@/types";

interface FormData {
  name: string;
  description: string;
  programId: string;
  subProgramId?: string;
  teacherId: string;
  maxStudents: number;
  status: "active" | "inactive" | "completed" | "cancelled";
  location: string;
  notes: string;
  dates: {
    startDate: string;
    endDate: string;
  };
  pricingSnapshot: {
    pricingModel: "per_course" | "per_month" | "per_session" | "subscription" | "program_price" | "one-time" | "installments";
    coursePrice: number;
    numberOfPayments?: number;
    gap?: number;
    pricePerMonth?: number;
    pricePerSession?: number;
  };
  owner: {
    id: string;
    name: string;
    role: string;
  };
  franchisee: {
    id: string;
    name: string;
    location: string;
  };
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function EditLearningGroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  
  const [formData, setFormData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State for programs, subprograms, and teachers data
  const [programs, setPrograms] = useState<SearchableSelectOption[]>([]);
  const [subPrograms, setSubPrograms] = useState<SearchableSelectOption[]>([]);
  const [teachers, setTeachers] = useState<SearchableSelectOption[]>([]);
  const [programsLoading, setProgramsLoading] = useState(false);
  const [subProgramsLoading, setSubProgramsLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);

  // Sample learning group data - in a real app, this would come from an API
  const sampleLearningGroup: LearningGroup = {
    id: groupId,
    name: "Advanced English Group A",
    description: "Advanced English conversation and writing group",
    programId: "prog_1",
    subProgramId: "sub_1",
    teacherId: "teacher_1",
    studentIds: ["student_1", "student_2"],
    maxStudents: 15,
    status: "active",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-05-31"),
    schedule: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00" },
      { dayOfWeek: 3, startTime: "10:00", endTime: "12:00" },
    ],
    location: "Main Campus",
    notes: "Focus on advanced conversation skills",
    dates: {
      startDate: "2024-02-01",
      endDate: "2024-05-31",
    },
    pricingSnapshot: {
      pricingModel: "installments",
      coursePrice: 399.98,
      numberOfPayments: 3,
      gap: 1,
      pricePerMonth: 133.33,
      pricePerSession: undefined,
    },
    owner: {
      id: "owner_1",
      name: "Sarah Wilson",
      role: "Program Director",
    },
    franchisee: {
      id: "franchisee_1",
      name: "Boston Learning Center",
      location: "Boston, MA",
    },
    students: [
      {
        studentId: "student_1",
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        productId: "product_1",
        paymentStatus: "paid",
        enrollmentDate: "2024-01-15",
      },
      {
        studentId: "student_2",
        startDate: "2024-02-01",
        endDate: "2024-05-31",
        productId: "product_1",
        paymentStatus: "partial",
        enrollmentDate: "2024-01-20",
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  };

  useEffect(() => {
    // Fetch learning group from API
    const fetchLearningGroupData = async () => {
      setLoading(true);
      try {
        const data = await getLearningGroup(groupId);
        
        // Convert LearningGroup to FormData
        const formData: FormData = {
          name: data.name,
          description: data.description,
          programId: data.programId.toString(),
          subProgramId: data.subProgramId?.toString() || "",
          teacherId: data.teacherId.toString(),
          maxStudents: data.maxStudents,
          status: data.status as any,
          location: data.location,
          notes: data.notes || "",
          dates: {
            startDate: new Date(data.startDate).toISOString().split('T')[0],
            endDate: new Date(data.endDate).toISOString().split('T')[0],
          },
          pricingSnapshot: typeof data.pricingSnapshot === 'string' ? 
            (() => {
              try {
                return JSON.parse(data.pricingSnapshot);
              } catch (e) {
                console.error('Error parsing pricingSnapshot:', e);
                return {
                  pricingModel: "per_course",
                  coursePrice: 0,
                };
              }
            })() : data.pricingSnapshot,
          owner: {
            id: (data as any).createdBy?.toString() || "",
            name: (data as any).creator?.firstName + " " + (data as any).creator?.lastName || "",
            role: (data as any).creator?.role || "",
          },
          franchisee: {
            id: (data as any).lcId?.toString() || "",
            name: (data as any).lc?.name || "",
            location: (data as any).lc?.address || "",
          },
          schedule: typeof data.schedule === 'string' ? 
            (() => {
              try {
                return JSON.parse(data.schedule);
              } catch (e) {
                console.error('Error parsing schedule:', e);
                return [];
              }
            })() : (Array.isArray(data.schedule) ? data.schedule : []),
        };
        
        setFormData(formData);
      } catch (error) {
        console.error("Error fetching learning group:", error);
        // You might want to show a toast notification here
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchLearningGroupData();
    }
  }, [groupId]);

  // Load initial programs
  const loadInitialPrograms = useCallback(async () => {
    try {
      setProgramsLoading(true);
      const response = await getPrograms({ 
        limit: 100, 
        status: 'active',
        sortBy: 'name',
        sortOrder: 'asc'
      });
      
      const programOptions: SearchableSelectOption[] = response.data.data.map((program: Program) => ({
        id: program.id,
        label: program.name,
        description: program.description,
        metadata: `${program.category} • ${program.duration} weeks`
      }));
      
      setPrograms(programOptions);
    } catch (error) {
      console.error('Error loading programs:', error);
      setPrograms([]);
    } finally {
      setProgramsLoading(false);
    }
  }, []);

  // Load subprograms for selected program
  const loadSubPrograms = useCallback(async (programId: string) => {
    try {
      setSubProgramsLoading(true);
      const response = await getSubPrograms({ 
        programId,
        limit: 100,
        status: 'active',
        sortBy: 'order',
        sortOrder: 'asc'
      });
      
      const subProgramOptions: SearchableSelectOption[] = response.data.data.map((subProgram: SubProgram) => ({
        id: subProgram.id,
        label: subProgram.name,
        description: subProgram.description,
        metadata: `Order: ${subProgram.order} • ${subProgram.duration} weeks • ${subProgram.pricingModel}`
      }));
      
      setSubPrograms(subProgramOptions);
    } catch (error) {
      console.error('Error loading subprograms:', error);
      setSubPrograms([]);
    } finally {
      setSubProgramsLoading(false);
    }
  }, []);

  // Load initial teachers
  const loadInitialTeachers = useCallback(async () => {
    try {
      setTeachersLoading(true);
      const response = await teachersAPI.getTeachers({ 
        limit: 100, 
        status: 'active',
        sortBy: 'firstName',
        sortOrder: 'asc'
      });
      
      const teacherOptions: SearchableSelectOption[] = response.data.teachers.map((teacher: Teacher) => ({
        id: teacher.id.toString(),
        label: `${teacher.firstName} ${teacher.lastName}`,
        description: teacher.email,
        metadata: `${teacher.specialization?.join(', ') || 'No specialization'} • ${teacher.experience || 0} years exp`
      }));
      
      setTeachers(teacherOptions);
    } catch (error) {
      console.error('Error loading teachers:', error);
      setTeachers([]);
    } finally {
      setTeachersLoading(false);
    }
  }, []);

  // Load initial programs data
  useEffect(() => {
    loadInitialPrograms();
  }, [loadInitialPrograms]);

  // Load initial teachers data
  useEffect(() => {
    loadInitialTeachers();
  }, [loadInitialTeachers]);

  // Load subprograms when program is selected
  useEffect(() => {
    if (formData?.programId) {
      loadSubPrograms(formData.programId);
    } else {
      setSubPrograms([]);
    }
  }, [formData?.programId, loadSubPrograms]);

  // Search programs function
  const searchPrograms = useCallback(async (searchTerm: string): Promise<SearchableSelectOption[]> => {
    try {
      const response = await getPrograms({ 
        search: searchTerm,
        limit: 50,
        status: 'active',
        sortBy: 'name',
        sortOrder: 'asc'
      });
      
      return response.data.data.map((program: Program) => ({
        id: program.id,
        label: program.name,
        description: program.description,
        metadata: `${program.category} • ${program.duration} weeks`
      }));
    } catch (error) {
      console.error('Error searching programs:', error);
      return [];
    }
  }, []);

  // Search subprograms function
  const searchSubPrograms = useCallback(async (searchTerm: string): Promise<SearchableSelectOption[]> => {
    if (!formData?.programId) return [];
    
    try {
      const response = await getSubPrograms({ 
        programId: formData.programId,
        search: searchTerm,
        limit: 50,
        status: 'active',
        sortBy: 'order',
        sortOrder: 'asc'
      });
      
      return response.data.data.map((subProgram: SubProgram) => ({
        id: subProgram.id,
        label: subProgram.name,
        description: subProgram.description,
        metadata: `Order: ${subProgram.order} • ${subProgram.duration} weeks • ${subProgram.pricingModel}`
      }));
    } catch (error) {
      console.error('Error searching subprograms:', error);
      return [];
    }
  }, [formData?.programId]);

  // Search teachers function
  const searchTeachers = useCallback(async (searchTerm: string): Promise<SearchableSelectOption[]> => {
    try {
      const response = await teachersAPI.getTeachers({ 
        search: searchTerm,
        limit: 50,
        status: 'active',
        sortBy: 'firstName',
        sortOrder: 'asc'
      });
      
      return response.data.teachers.map((teacher: Teacher) => ({
        id: teacher.id.toString(),
        label: `${teacher.firstName} ${teacher.lastName}`,
        description: teacher.email,
        metadata: `${teacher.specialization?.join(', ') || 'No specialization'} • ${teacher.experience || 0} years exp`
      }));
    } catch (error) {
      console.error('Error searching teachers:', error);
      return [];
    }
  }, []);

  // Calculate total price when program or subprogram price changes
  const updatePricing = () => {
    // no derived totals; fields mirror SubProgram
    return;
  };

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value,
    }) : null);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }

    // Update pricing if relevant fields change
    if (field === "pricingSnapshot") {
      updatePricing();
    }
  };

  // Handle program selection - clear subprogram when program changes
  const handleProgramSelect = (programId: string) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      programId,
      subProgramId: "", // Clear subprogram when program changes
    }) : null);
    
    // Clear subprogram error
    if (errors.subProgramId) {
      setErrors(prev => ({
        ...prev,
        subProgramId: "",
      }));
    }
  };

  // Handle subprogram selection
  const handleSubProgramSelect = (subProgramId: string) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      subProgramId,
    }) : null);
    
    // Clear subprogram error
    if (errors.subProgramId) {
      setErrors(prev => ({
        ...prev,
        subProgramId: "",
      }));
    }
  };

  // Handle teacher selection
  const handleTeacherSelect = (teacherId: string) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      teacherId,
    }) : null);
    
    // Clear teacher error
    if (errors.teacherId) {
      setErrors(prev => ({
        ...prev,
        teacherId: "",
      }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof FormData] as any),
        [field]: value,
      },
    }) : null);

    // Update pricing if relevant fields change
    if (parent === "pricingSnapshot") {
      updatePricing();
    }
  };

  const addScheduleSlot = () => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      schedule: [...prev.schedule, { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }],
    }) : null);
  };

  const removeScheduleSlot = (index: number) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }) : null);
  };

  const updateScheduleSlot = (index: number, field: string, value: any) => {
    if (!formData) return;
    
    setFormData(prev => prev ? ({
      ...prev,
      schedule: prev.schedule.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      ),
    }) : null);
  };

  const validateForm = (): boolean => {
    if (!formData) return false;
    
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Group name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.programId) newErrors.programId = "Program is required";
    if (!formData.teacherId) newErrors.teacherId = "Teacher is required";
    if (formData.maxStudents < 1) newErrors.maxStudents = "Max students must be at least 1";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.dates.startDate) newErrors["dates.startDate"] = "Start date is required";
    if (!formData.dates.endDate) newErrors["dates.endDate"] = "End date is required";
    if (!formData.owner.name.trim()) newErrors["owner.name"] = "Owner name is required";
    if (!formData.franchisee.name.trim()) newErrors["franchisee.name"] = "Franchisee name is required";
    if (formData.schedule.length === 0) newErrors.schedule = "At least one schedule slot is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData || !validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      // Convert form data to API format
      const learningGroupData: UpdateLearningGroupData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        maxStudents: formData.maxStudents,
        startDate: formData.dates.startDate,
        endDate: formData.dates.endDate,
        location: formData.location,
        notes: formData.notes,
        schedule: formData.schedule,
        pricingSnapshot: formData.pricingSnapshot,
        programId: formData.programId,
        subProgramId: formData.subProgramId || undefined,
        teacherId: formData.teacherId,
      };

      // Update learning group via API
      await updateLearningGroup(groupId, learningGroupData);
      
      // Navigate back to learning group detail
      router.push(`/learning-groups/${groupId}`);
    } catch (error) {
      console.error("Error updating learning group:", error);
      // You might want to show a toast notification here
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/learning-groups/${groupId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading learning group...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Learning Group Not Found</h1>
          <p className="text-gray-600 mb-6">The learning group you're trying to edit doesn't exist.</p>
          <button
            onClick={() => router.push("/learning-groups")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Learning Groups
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Learning Groups", href: "/learning-groups" },
            { label: formData?.name || "Loading...", href: `/learning-groups/${groupId}` },
            { label: "Edit" }
          ]}
        />

        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Learning Group</h1>
            <p className="text-gray-600">Update learning group details and settings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter group name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter group description"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Program and Teacher */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Program & Teacher</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program *
                </label>
                <SearchableSelect
                  options={programs}
                  value={formData.programId}
                  placeholder="Search and select a program..."
                  onSelect={handleProgramSelect}
                  onSearch={searchPrograms}
                  loading={programsLoading}
                  error={errors.programId}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Program
                </label>
                <SearchableSelect
                  options={subPrograms}
                  value={formData.subProgramId}
                  placeholder={formData.programId ? "Search and select a sub program..." : "Select a program first"}
                  onSelect={handleSubProgramSelect}
                  onSearch={searchSubPrograms}
                  loading={subProgramsLoading}
                  disabled={!formData.programId}
                  error={errors.subProgramId}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher *
                </label>
                <SearchableSelect
                  options={teachers}
                  value={formData.teacherId}
                  placeholder="Search and select a teacher..."
                  onSelect={handleTeacherSelect}
                  onSearch={searchTeachers}
                  loading={teachersLoading}
                  error={errors.teacherId}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Calendar className="h-5 w-5 inline mr-2" />
              Dates & Schedule
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.dates.startDate}
                  onChange={(e) => handleNestedInputChange("dates", "startDate", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["dates.startDate"] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors["dates.startDate"] && <p className="text-red-500 text-sm mt-1">{errors["dates.startDate"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.dates.endDate}
                  onChange={(e) => handleNestedInputChange("dates", "endDate", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["dates.endDate"] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors["dates.endDate"] && <p className="text-red-500 text-sm mt-1">{errors["dates.endDate"]}</p>}
              </div>
            </div>


            {/* Schedule */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Schedule *
                </label>
                <button
                  type="button"
                  onClick={addScheduleSlot}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <span className="mr-1">+</span>
                  Add Schedule
                </button>
              </div>
              
              {formData.schedule.map((slot, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                    <select
                      value={slot.dayOfWeek}
                      onChange={(e) => updateScheduleSlot(index, "dayOfWeek", parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {dayNames.map((day, dayIndex) => (
                        <option key={dayIndex} value={dayIndex}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateScheduleSlot(index, "startTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateScheduleSlot(index, "endTime", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeScheduleSlot(index)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {errors.schedule && <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>}
            </div>
          </div>

          {/* Location and Capacity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <MapPin className="h-5 w-5 inline mr-2" />
              Location & Capacity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter location"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Max Students *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange("maxStudents", parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.maxStudents ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.maxStudents && <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <DollarSign className="h-5 w-5 inline mr-2" />
              Pricing
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Billing Type</label>
                <select
                  value={formData.pricingSnapshot.pricingModel}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "pricingModel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="per_month">Per month</option>
                  <option value="per_session">Per session</option>
                  <option value="per_course">Per course</option>
                  <option value="installments">Installments</option>
                  <option value="subscription">Subscription</option>
                  <option value="program_price">Program price</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricingSnapshot.coursePrice || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "coursePrice", e.target.value === "" ? "" : parseFloat(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per month</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricingSnapshot.pricePerMonth || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "pricePerMonth", e.target.value === "" ? "" : parseFloat(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per session</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricingSnapshot.pricePerSession || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "pricePerSession", e.target.value === "" ? "" : parseFloat(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of payments</label>
                <input
                  type="number"
                  min="1"
                  value={formData.pricingSnapshot.numberOfPayments || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "numberOfPayments", parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gap between payments</label>
                <input
                  type="number"
                  min="1"
                  value={formData.pricingSnapshot.gap || ""}
                  onChange={(e) => handleNestedInputChange("pricingSnapshot", "gap", parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Frequency (1 = monthly, 2 = every two months, etc.)</p>
              </div>
            </div>
          </div>

          {/* Ownership */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <User className="h-5 w-5 inline mr-2" />
              Ownership & Franchisee
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.owner.name}
                  onChange={(e) => handleNestedInputChange("owner", "name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["owner.name"] ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter owner name"
                />
                {errors["owner.name"] && <p className="text-red-500 text-sm mt-1">{errors["owner.name"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Role
                </label>
                <input
                  type="text"
                  value={formData.owner.role}
                  onChange={(e) => handleNestedInputChange("owner", "role", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter owner role"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="h-4 w-4 inline mr-1" />
                  Franchisee Name *
                </label>
                <input
                  type="text"
                  value={formData.franchisee.name}
                  onChange={(e) => handleNestedInputChange("franchisee", "name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors["franchisee.name"] ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter franchisee name"
                />
                {errors["franchisee.name"] && <p className="text-red-500 text-sm mt-1">{errors["franchisee.name"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Franchisee Location
                </label>
                <input
                  type="text"
                  value={formData.franchisee.location}
                  onChange={(e) => handleNestedInputChange("franchisee", "location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter franchisee location"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Notes</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter any additional notes"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Update Learning Group
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
