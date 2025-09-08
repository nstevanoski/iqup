"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/store/auth";
import { Application } from "@/types";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Building, User, Target, FileText, Euro, Users, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

// Sample application data
const sampleApplication: Application = {
  id: "app_1",
  applicantInfo: {
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@newcenter.com",
    phone: "+1-555-0300",
    title: "Owner",
    company: "New Learning Center",
    website: "https://newcenter.com",
    address: {
      street: "789 Education Blvd",
      city: "Cambridge",
      state: "MA",
      zipCode: "02139",
      country: "USA",
    },
  },
  businessInfo: {
    businessName: "New Learning Center LLC",
    taxId: "11-2233445",
    registrationNumber: "REG-2024-001",
    establishedDate: new Date("2024-01-01"),
    businessType: "Educational Services",
    numberOfEmployees: 5,
    annualRevenue: 500000,
  },
  applicationType: "LC",
  status: "new",
  studentGoals: {
    year1: {
      targetStudents: 50,
      programs: ["English Grammar", "Mathematics"],
      revenue: 75000,
      milestones: ["Complete setup", "Hire 2 teachers", "Launch marketing"],
    },
    year2: {
      targetStudents: 100,
      programs: ["English Grammar", "Mathematics", "Science"],
      revenue: 150000,
      milestones: ["Expand to 2 locations", "Add science program"],
    },
    year3: {
      targetStudents: 150,
      programs: ["English Grammar", "Mathematics", "Science", "Computer Skills"],
      revenue: 225000,
      milestones: ["Add computer skills program", "Hire 5 more teachers"],
    },
    year4: {
      targetStudents: 200,
      programs: ["English Grammar", "Mathematics", "Science", "Computer Skills", "Business English"],
      revenue: 300000,
      milestones: ["Add business English", "Expand to 3 locations"],
    },
  },
  documents: {
    businessLicense: "license_2024_001.pdf",
    taxCertificate: "tax_cert_2024_001.pdf",
    financialStatements: ["financial_2023.pdf", "financial_2024_q1.pdf"],
    marketingPlan: "marketing_plan_2024.pdf",
    otherDocuments: ["insurance_cert.pdf", "facility_lease.pdf"],
  },
  createdAt: new Date("2024-01-10"),
  updatedAt: new Date("2024-01-10"),
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "new": return "bg-blue-100 text-blue-800";
    case "under_review": return "bg-yellow-100 text-yellow-800";
    case "approved": return "bg-green-100 text-green-800";
    case "rejected": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useUser();
  const [application, setApplication] = useState<Application>(sampleApplication);
  const [loading, setLoading] = useState(false);
  const [reviewComments, setReviewComments] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");

  // Only HQ users can access this page
  if (user?.role !== "HQ") {
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
                <p>Only HQ users can review applications.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const breadcrumbItems = [
    { label: "Accounts", href: "/accounts" },
    { label: "Applications", href: "/accounts" },
    { label: `Application ${application.id}`, href: `/accounts/applications/${application.id}` },
  ];

  const handleApprove = async () => {
    if (confirm(`Approve application for ${application.applicantInfo.firstName} ${application.applicantInfo.lastName}?`)) {
      setLoading(true);
      try {
        // In a real app, this would make an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setApplication(prev => ({
          ...prev,
          status: "approved",
          reviewInfo: {
            reviewedBy: user?.id || "",
            reviewedAt: new Date(),
            comments: reviewComments,
            decision: "approved",
            conditions: conditions.length > 0 ? conditions : undefined,
          },
          updatedAt: new Date(),
        }));
        
        // Auto-create account on approval
        handleCreateAccountFromApplication();
        
        alert("Application approved successfully!");
      } catch (error) {
        console.error("Error approving application:", error);
        alert("Error approving application. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (confirm(`Reject application for ${application.applicantInfo.firstName} ${application.applicantInfo.lastName}?`)) {
      setLoading(true);
      try {
        // In a real app, this would make an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setApplication(prev => ({
          ...prev,
          status: "rejected",
          reviewInfo: {
            reviewedBy: user?.id || "",
            reviewedAt: new Date(),
            comments: reviewComments,
            decision: "rejected",
            conditions: conditions.length > 0 ? conditions : undefined,
          },
          updatedAt: new Date(),
        }));
        
        alert("Application rejected.");
      } catch (error) {
        console.error("Error rejecting application:", error);
        alert("Error rejecting application. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateAccountFromApplication = () => {
    // In a real app, this would create the account via API
    console.log("Creating account from application:", application);
    alert("Account created successfully!");
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions(prev => [...prev, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    setConditions(prev => prev.filter((_, i) => i !== index));
  };

  const totalRevenue = application.studentGoals.year1.revenue + 
                      application.studentGoals.year2.revenue + 
                      application.studentGoals.year3.revenue + 
                      application.studentGoals.year4.revenue;

  const totalStudents = application.studentGoals.year1.targetStudents + 
                       application.studentGoals.year2.targetStudents + 
                       application.studentGoals.year3.targetStudents + 
                       application.studentGoals.year4.targetStudents;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
            <p className="text-gray-600">
              {application.applicantInfo.firstName} {application.applicantInfo.lastName} - {application.businessInfo.businessName}
            </p>
          </div>
          <div className="flex space-x-3">
            {application.status === "new" || application.status === "under_review" ? (
              <>
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </>
            ) : (
              <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-md ${getStatusColor(application.status)}`}>
                {application.status.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Application Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  application.applicationType === "MF" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                }`}>
                  {application.applicationType}
                </span>
                <span className="text-sm text-gray-500">
                  Applied: {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {application.reviewInfo && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Reviewed by: {application.reviewInfo.reviewedBy}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(application.reviewInfo.reviewedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Applicant Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <User className="h-5 w-5 mr-2" />
            Applicant Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900">Personal Details</h4>
              <div className="mt-2 space-y-1">
                <p><span className="font-medium">Name:</span> {application.applicantInfo.firstName} {application.applicantInfo.lastName}</p>
                <p><span className="font-medium">Title:</span> {application.applicantInfo.title}</p>
                <p><span className="font-medium">Email:</span> {application.applicantInfo.email}</p>
                <p><span className="font-medium">Phone:</span> {application.applicantInfo.phone}</p>
                <p><span className="font-medium">Company:</span> {application.applicantInfo.company}</p>
                {application.applicantInfo.website && (
                  <p><span className="font-medium">Website:</span> 
                    <a href={application.applicantInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
                      {application.applicantInfo.website}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Address
              </h4>
              <div className="mt-2">
                <p>{application.applicantInfo.address.street}</p>
                <p>{application.applicantInfo.address.city}, {application.applicantInfo.address.state} {application.applicantInfo.address.zipCode}</p>
                <p>{application.applicantInfo.address.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <Building className="h-5 w-5 mr-2" />
            Business Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900">Business Details</h4>
              <div className="mt-2 space-y-1">
                <p><span className="font-medium">Business Name:</span> {application.businessInfo.businessName}</p>
                <p><span className="font-medium">Business Type:</span> {application.businessInfo.businessType}</p>
                <p><span className="font-medium">Tax ID:</span> {application.businessInfo.taxId}</p>
                <p><span className="font-medium">Registration Number:</span> {application.businessInfo.registrationNumber}</p>
                <p><span className="font-medium">Established:</span> {new Date(application.businessInfo.establishedDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Business Metrics
              </h4>
              <div className="mt-2 space-y-1">
                <p><span className="font-medium">Employees:</span> {application.businessInfo.numberOfEmployees}</p>
                <p><span className="font-medium">Annual Revenue:</span> ${application.businessInfo.annualRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Goals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <Target className="h-5 w-5 mr-2" />
            Student Goals (4-Year Plan)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((year) => {
              const yearData = application.studentGoals[`year${year}` as keyof typeof application.studentGoals];
              return (
                <div key={year} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Year {year}</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{yearData.targetStudents} students</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Euro className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">€{yearData.revenue.toLocaleString()}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Programs:</p>
                      <div className="flex flex-wrap gap-1">
                        {yearData.programs.map((program, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Milestones:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {yearData.milestones.map((milestone, index) => (
                          <li key={index}>• {milestone}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Total Target Students</h4>
                <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Total Revenue Target</h4>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
            <FileText className="h-5 w-5 mr-2" />
            Required Documents
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900">Business Documents</h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{application.documents.businessLicense}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{application.documents.taxCertificate}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{application.documents.marketingPlan}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900">Financial Documents</h4>
              <div className="mt-2 space-y-2">
                {application.documents.financialStatements.map((doc, index) => (
                  <div key={index} className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {application.documents.otherDocuments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900">Other Documents</h4>
              <div className="mt-2 space-y-2">
                {application.documents.otherDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Review Section */}
        {(application.status === "new" || application.status === "under_review") && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review & Decision</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Comments
                </label>
                <textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your review comments..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions (if any)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add condition..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCondition();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCondition}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {conditions.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review History */}
        {application.reviewInfo && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review History</h3>
            
            <div className="space-y-2">
              <p><span className="font-medium">Decision:</span> 
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  application.reviewInfo.decision === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {application.reviewInfo.decision.toUpperCase()}
                </span>
              </p>
              <p><span className="font-medium">Reviewed by:</span> {application.reviewInfo.reviewedBy}</p>
              <p><span className="font-medium">Reviewed at:</span> {new Date(application.reviewInfo.reviewedAt).toLocaleString()}</p>
              <p><span className="font-medium">Comments:</span> {application.reviewInfo.comments}</p>
              {application.reviewInfo.conditions && application.reviewInfo.conditions.length > 0 && (
                <div>
                  <p className="font-medium">Conditions:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {application.reviewInfo.conditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
