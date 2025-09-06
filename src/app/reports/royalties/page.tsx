"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/store/auth";
import { RoyaltyCommissionReport, RoyaltyCommissionSummary, RoyaltyCommissionCalculation } from "@/types";
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Building, 
  AlertCircle,
  ChevronDown,
  ChevronRight
} from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleRoyaltyReport: RoyaltyCommissionReport = {
  id: "royalty_2024_01",
  period: {
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    type: "monthly",
  },
  generatedAt: new Date("2024-02-01"),
  generatedBy: "user_1",
  totalMfCount: 2,
  totalLcCount: 5,
  totalStudentCount: 450,
  totalRevenue: 675000,
  totalLcToMfCommission: 81000,
  totalMfToHqCommission: 40500,
  mfSummaries: [
    {
      id: "mf_summary_1",
      period: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        type: "monthly",
      },
      mfId: "acc_1",
      mfName: "Boston MF Region",
      totalLcCount: 3,
      totalStudentCount: 280,
      totalRevenue: 420000,
      totalLcToMfCommission: 50400,
      totalMfToHqCommission: 25200,
      lcBreakdown: [
        {
          lcId: "acc_2",
          lcName: "Boston Learning Center",
          studentCount: 120,
          revenue: 180000,
          lcToMfCommission: 21600,
        },
        {
          lcId: "acc_3",
          lcName: "Cambridge Learning Center",
          studentCount: 100,
          revenue: 150000,
          lcToMfCommission: 18000,
        },
        {
          lcId: "acc_4",
          lcName: "Somerville Learning Center",
          studentCount: 60,
          revenue: 90000,
          lcToMfCommission: 10800,
        },
      ],
      status: "calculated",
      calculatedAt: new Date("2024-02-01"),
    },
    {
      id: "mf_summary_2",
      period: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        type: "monthly",
      },
      mfId: "acc_5",
      mfName: "Worcester MF Region",
      totalLcCount: 2,
      totalStudentCount: 170,
      totalRevenue: 255000,
      totalLcToMfCommission: 30600,
      totalMfToHqCommission: 15300,
      lcBreakdown: [
        {
          lcId: "acc_6",
          lcName: "Worcester Learning Center",
          studentCount: 100,
          revenue: 150000,
          lcToMfCommission: 18000,
        },
        {
          lcId: "acc_7",
          lcName: "Springfield Learning Center",
          studentCount: 70,
          revenue: 105000,
          lcToMfCommission: 12600,
        },
      ],
      status: "calculated",
      calculatedAt: new Date("2024-02-01"),
    },
  ],
  lcCalculations: [
    {
      id: "lc_calc_1",
      period: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        type: "monthly",
      },
      lcId: "acc_2",
      lcName: "Boston Learning Center",
      mfId: "acc_1",
      mfName: "Boston MF Region",
      studentCount: 120,
      revenue: 180000,
      lcToMfCommission: {
        first100Students: {
          count: 100,
          rate: 0.14,
          amount: 14000,
        },
        beyond100Students: {
          count: 20,
          rate: 0.12,
          amount: 2400,
        },
        total: 16400,
      },
      mfToHqCommission: {
        collectedFromLc: 16400,
        rate: 0.5,
        amount: 8200,
      },
      status: "calculated",
      calculatedAt: new Date("2024-02-01"),
    },
    {
      id: "lc_calc_2",
      period: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-31"),
        type: "monthly",
      },
      lcId: "acc_3",
      lcName: "Cambridge Learning Center",
      mfId: "acc_1",
      mfName: "Boston MF Region",
      studentCount: 100,
      revenue: 150000,
      lcToMfCommission: {
        first100Students: {
          count: 100,
          rate: 0.14,
          amount: 14000,
        },
        beyond100Students: {
          count: 0,
          rate: 0.12,
          amount: 0,
        },
        total: 14000,
      },
      mfToHqCommission: {
        collectedFromLc: 14000,
        rate: 0.5,
        amount: 7000,
      },
      status: "calculated",
      calculatedAt: new Date("2024-02-01"),
    },
  ],
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "calculated": return "bg-blue-100 text-blue-800";
    case "paid": return "bg-green-100 text-green-800";
    case "disputed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export default function RoyaltiesReportPage() {
  const user = useUser();
  const [report, setReport] = useState<RoyaltyCommissionReport>(sampleRoyaltyReport);
  const [loading, setLoading] = useState(false);
  const [expandedMf, setExpandedMf] = useState<Set<string>>(new Set());
  const [expandedLc, setExpandedLc] = useState<Set<string>>(new Set());
  
  // Filter states
  const [periodType, setPeriodType] = useState<"monthly" | "quarterly" | "yearly" | "custom">("monthly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [selectedQuarter, setSelectedQuarter] = useState("2024-Q1");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Only HQ and MF users can access this page
  if (user?.role !== "HQ" && user?.role !== "MF") {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Only HQ and MF users can view royalty reports.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      // In a real app, this would make an API call to generate the report
      console.log("Generating report for period:", {
        type: periodType,
        month: selectedMonth,
        quarter: selectedQuarter,
        year: selectedYear,
        customStart: customStartDate,
        customEnd: customEndDate,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update report with new data
      setReport(prev => ({
        ...prev,
        generatedAt: new Date(),
        generatedBy: user?.id || "",
      }));
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    console.log("Exporting CSV for report:", report.id);
    alert("CSV export functionality would be implemented here");
  };

  const toggleMfExpansion = (mfId: string) => {
    const newExpanded = new Set(expandedMf);
    if (newExpanded.has(mfId)) {
      newExpanded.delete(mfId);
    } else {
      newExpanded.add(mfId);
    }
    setExpandedMf(newExpanded);
  };

  const toggleLcExpansion = (lcId: string) => {
    const newExpanded = new Set(expandedLc);
    if (newExpanded.has(lcId)) {
      newExpanded.delete(lcId);
    } else {
      newExpanded.add(lcId);
    }
    setExpandedLc(newExpanded);
  };

  const getPeriodDisplay = () => {
    switch (periodType) {
      case "monthly":
        return `January 2024`;
      case "quarterly":
        return `Q1 2024`;
      case "yearly":
        return `2024`;
      case "custom":
        return `${formatDate(new Date(customStartDate))} - ${formatDate(new Date(customEndDate))}`;
      default:
        return "Unknown Period";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Royalties Report</h1>
            <p className="text-gray-600">Commission calculations and royalty distributions</p>
          </div>
          <div className="flex space-x-3">
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
              <Calendar className="h-4 w-4" />
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2" />
            Report Filters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period Type
              </label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {periodType === "monthly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {periodType === "quarterly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quarter
                </label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2024-Q1">Q1 2024</option>
                  <option value="2024-Q2">Q2 2024</option>
                  <option value="2024-Q3">Q3 2024</option>
                  <option value="2024-Q4">Q4 2024</option>
                </select>
              </div>
            )}

            {periodType === "yearly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            )}

            {periodType === "custom" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Report Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Report Summary - {getPeriodDisplay()}
            </h3>
            <span className="text-sm text-gray-500">
              Generated: {formatDate(report.generatedAt)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Total MFs</p>
                  <p className="text-2xl font-semibold text-blue-900">{report.totalMfCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Total Students</p>
                  <p className="text-2xl font-semibold text-green-900">{report.totalStudentCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Total Revenue</p>
                  <p className="text-2xl font-semibold text-purple-900">{formatCurrency(report.totalRevenue)}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-600">Total Commissions</p>
                  <p className="text-2xl font-semibold text-orange-900">{formatCurrency(report.totalLcToMfCommission + report.totalMfToHqCommission)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Structure</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">LC → MF Commission</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>First 100 students:</span>
                  <span className="font-medium">14%</span>
                </div>
                <div className="flex justify-between">
                  <span>Beyond 100 students:</span>
                  <span className="font-medium">12%</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total LC → MF:</span>
                    <span>{formatCurrency(report.totalLcToMfCommission)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">MF → HQ Commission</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>From collected royalties:</span>
                  <span className="font-medium">50%</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total MF → HQ:</span>
                    <span>{formatCurrency(report.totalMfToHqCommission)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MF Summaries */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">MF Summaries</h3>
            <p className="text-sm text-gray-600 mt-1">Master Franchise commission breakdowns</p>
          </div>

          <div className="divide-y divide-gray-200">
            {report.mfSummaries.map((mfSummary) => (
              <div key={mfSummary.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleMfExpansion(mfSummary.mfId)}
                      className="mr-3 text-gray-400 hover:text-gray-600"
                    >
                      {expandedMf.has(mfSummary.mfId) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">{mfSummary.mfName}</h4>
                      <p className="text-sm text-gray-500">
                        {mfSummary.totalLcCount} LCs • {mfSummary.totalStudentCount} students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(mfSummary.totalLcToMfCommission)}
                      </p>
                      <p className="text-xs text-gray-500">LC → MF</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(mfSummary.totalMfToHqCommission)}
                      </p>
                      <p className="text-xs text-gray-500">MF → HQ</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(mfSummary.status)}`}>
                      {mfSummary.status}
                    </span>
                  </div>
                </div>

                {expandedMf.has(mfSummary.mfId) && (
                  <div className="mt-4 ml-8">
                    <h5 className="font-medium text-gray-900 mb-3">LC Breakdown</h5>
                    <div className="space-y-3">
                      {mfSummary.lcBreakdown.map((lc) => (
                        <div key={lc.lcId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{lc.lcName}</p>
                            <p className="text-sm text-gray-500">{lc.studentCount} students</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(lc.revenue)}
                              </p>
                              <p className="text-xs text-gray-500">Revenue</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(lc.lcToMfCommission)}
                              </p>
                              <p className="text-xs text-gray-500">Commission</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed LC Calculations */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Detailed LC Calculations</h3>
            <p className="text-sm text-gray-600 mt-1">Individual learning center commission calculations</p>
          </div>

          <div className="divide-y divide-gray-200">
            {report.lcCalculations.map((lcCalc) => (
              <div key={lcCalc.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleLcExpansion(lcCalc.lcId)}
                      className="mr-3 text-gray-400 hover:text-gray-600"
                    >
                      {expandedLc.has(lcCalc.lcId) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">{lcCalc.lcName}</h4>
                      <p className="text-sm text-gray-500">
                        {lcCalc.studentCount} students • {formatCurrency(lcCalc.revenue)} revenue
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(lcCalc.lcToMfCommission.total)}
                      </p>
                      <p className="text-xs text-gray-500">LC → MF</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(lcCalc.mfToHqCommission.amount)}
                      </p>
                      <p className="text-xs text-gray-500">MF → HQ</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lcCalc.status)}`}>
                      {lcCalc.status}
                    </span>
                  </div>
                </div>

                {expandedLc.has(lcCalc.lcId) && (
                  <div className="mt-4 ml-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">LC → MF Commission</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>First 100 students (14%):</span>
                            <span className="font-medium">
                              {lcCalc.lcToMfCommission.first100Students.count} × {formatCurrency(lcCalc.lcToMfCommission.first100Students.amount / lcCalc.lcToMfCommission.first100Students.count)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Beyond 100 students (12%):</span>
                            <span className="font-medium">
                              {lcCalc.lcToMfCommission.beyond100Students.count} × {formatCurrency(lcCalc.lcToMfCommission.beyond100Students.amount / (lcCalc.lcToMfCommission.beyond100Students.count || 1))}
                            </span>
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                              <span>Total:</span>
                              <span>{formatCurrency(lcCalc.lcToMfCommission.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">MF → HQ Commission</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Collected from LC:</span>
                            <span className="font-medium">{formatCurrency(lcCalc.mfToHqCommission.collectedFromLc)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rate:</span>
                            <span className="font-medium">50%</span>
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                              <span>Total:</span>
                              <span>{formatCurrency(lcCalc.mfToHqCommission.amount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}