"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/store/auth";
import { StudentReportData, StudentReportFilter } from "@/types";
import { 
  Filter, 
  Download, 
  Search, 
  Users, 
  MapPin, 
  Calendar,
  GraduationCap,
  TrendingUp,
  Building,
  BookOpen,
  Settings
} from "lucide-react";
import ReportBuilder from "@/components/reports/ReportBuilder";

// Sample data - in a real app, this would come from an API
const sampleStudentReportData: StudentReportData[] = [
  {
    id: "sr_1",
    studentId: "STU001",
    studentName: "Alice Johnson",
    age: 25,
    country: "USA",
    city: "Boston",
    lcId: "acc_2",
    lcName: "Boston Learning Center",
    programId: "prog_1",
    programName: "English Language Program",
    subProgramId: "sub_1",
    subProgramName: "Business English",
    enrollmentDate: new Date("2024-01-15"),
    graduationDate: undefined,
    status: "active",
    totalHours: 120,
    completedHours: 45,
    progress: 37.5,
    currentGroupId: "lg_1",
    currentGroupName: "Business English Group A",
    teacherId: "teach_1",
    teacherName: "Sarah Wilson",
    totalPaid: 1200,
    totalDue: 800,
    lastPaymentDate: new Date("2024-01-20"),
    notes: "Excellent progress, very motivated",
  },
  {
    id: "sr_2",
    studentId: "STU002",
    studentName: "Bob Smith",
    age: 32,
    country: "USA",
    city: "Cambridge",
    lcId: "acc_3",
    lcName: "Cambridge Learning Center",
    programId: "prog_2",
    programName: "Spanish Language Program",
    subProgramId: "sub_2",
    subProgramName: "Conversational Spanish",
    enrollmentDate: new Date("2023-11-10"),
    graduationDate: new Date("2024-02-15"),
    status: "graduated",
    totalHours: 80,
    completedHours: 80,
    progress: 100,
    currentGroupId: undefined,
    currentGroupName: undefined,
    teacherId: "teach_2",
    teacherName: "Maria Garcia",
    totalPaid: 1600,
    totalDue: 0,
    lastPaymentDate: new Date("2024-01-15"),
    notes: "Completed with distinction",
  },
];

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "inactive": return "bg-yellow-100 text-yellow-800";
    case "graduated": return "bg-blue-100 text-blue-800";
    case "dropped": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export default function StudentReportsPage() {
  const user = useUser();
  const [reportData, setReportData] = useState<StudentReportData[]>(sampleStudentReportData);
  const [filteredData, setFilteredData] = useState<StudentReportData[]>(sampleStudentReportData);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<StudentReportFilter>({});
  const [searchTerm, setSearchTerm] = useState("");
  
  // Available filter options
  const [availableLcs, setAvailableLcs] = useState([
    { id: "acc_2", name: "Boston Learning Center" },
    { id: "acc_3", name: "Cambridge Learning Center" },
    { id: "acc_4", name: "Somerville Learning Center" },
  ]);
  
  const [availablePrograms, setAvailablePrograms] = useState([
    { id: "prog_1", name: "English Language Program" },
    { id: "prog_2", name: "Spanish Language Program" },
    { id: "prog_3", name: "French Language Program" },
  ]);
  
  const [availableCountries, setAvailableCountries] = useState(["USA", "Canada", "Mexico"]);
  const [availableCities, setAvailableCities] = useState(["Boston", "Cambridge", "Toronto", "Somerville"]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...reportData];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lcName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.programName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.lcId) {
      filtered = filtered.filter(student => student.lcId === filters.lcId);
    }
    
    if (filters.programId) {
      filtered = filtered.filter(student => student.programId === filters.programId);
    }
    
    if (filters.ageRange) {
      filtered = filtered.filter(student => 
        student.age >= filters.ageRange!.min && student.age <= filters.ageRange!.max
      );
    }
    
    if (filters.country) {
      filtered = filtered.filter(student => student.country === filters.country);
    }
    
    if (filters.city) {
      filtered = filtered.filter(student => student.city === filters.city);
    }
    
    if (filters.status) {
      filtered = filtered.filter(student => student.status === filters.status);
    }
    
    if (filters.enrollmentDate) {
      filtered = filtered.filter(student => 
        student.enrollmentDate >= filters.enrollmentDate!.start &&
        student.enrollmentDate <= filters.enrollmentDate!.end
      );
    }

    setFilteredData(filtered);
  }, [reportData, filters, searchTerm]);

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    console.log("Exporting CSV for student report:", filteredData);
    alert("CSV export functionality would be implemented here");
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // In a real app, this would make an API call to generate the report
      console.log("Generating student report with filters:", filters);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update report data
      setReportData(prev => [...prev]);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = (config: any) => {
    console.log("Saving report configuration:", config);
    alert("Report saved successfully!");
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.lcId) count++;
    if (filters.programId) count++;
    if (filters.ageRange) count++;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.status) count++;
    if (filters.enrollmentDate) count++;
    if (searchTerm) count++;
    return count;
  };

  // Only HQ, MF, and LC users can access this page
  if (user?.role !== "HQ" && user?.role !== "MF" && user?.role !== "LC") {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Users className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Only HQ, MF, and LC users can view student reports.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Reports</h1>
            <p className="text-gray-600">Comprehensive student data analysis and reporting</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowReportBuilder(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Report Builder
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <TrendingUp className="h-4 w-4" />
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{filteredData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {filteredData.filter(s => s.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Learning Centers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(filteredData.map(s => s.lcId)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Programs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(filteredData.map(s => s.programId)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students, IDs, centers, or programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  showFilters || getFilterCount() > 0
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {getFilterCount() > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                    {getFilterCount()}
                  </span>
                )}
              </button>
              
              {getFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Filters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Center
                  </label>
                  <select
                    value={filters.lcId || ""}
                    onChange={(e) => setFilters(prev => ({ ...prev, lcId: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Centers</option>
                    {availableLcs.map(lc => (
                      <option key={lc.id} value={lc.id}>{lc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program
                  </label>
                  <select
                    value={filters.programId || ""}
                    onChange={(e) => setFilters(prev => ({ ...prev, programId: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Programs</option>
                    {availablePrograms.map(program => (
                      <option key={program.id} value={program.id}>{program.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status || ""}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="graduated">Graduated</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={filters.country || ""}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Countries</option>
                    {availableCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={filters.city || ""}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value || undefined }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Cities</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.ageRange?.min || ""}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        ageRange: {
                          min: parseInt(e.target.value) || 0,
                          max: prev.ageRange?.max || 100
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.ageRange?.max || ""}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        ageRange: {
                          min: prev.ageRange?.min || 0,
                          max: parseInt(e.target.value) || 100
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Student Report Results ({filteredData.length} students)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.studentId} • Age {student.age}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div className="text-sm text-gray-900">{student.city}</div>
                          <div className="text-sm text-gray-500">{student.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{student.programName}</div>
                        <div className="text-sm text-gray-500">{student.lcName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {student.completedHours}/{student.totalHours} hours
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{student.progress}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{student.teacherName || "N/A"}</div>
                        <div className="text-sm text-gray-500">{student.currentGroupName || "No group"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatCurrency(student.totalPaid)} / {formatCurrency(student.totalPaid + student.totalDue)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {formatCurrency(student.totalDue)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {formatDate(student.enrollmentDate)}
                          </div>
                          {student.graduationDate && (
                            <div className="text-sm text-gray-500">
                              Grad: {formatDate(student.graduationDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>

        {/* Report Builder Modal */}
        <ReportBuilder
          isOpen={showReportBuilder}
          onClose={() => setShowReportBuilder(false)}
          onSave={handleSaveReport}
        />
      </div>
    </DashboardLayout>
  );
}