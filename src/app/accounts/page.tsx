"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { useUser } from "@/store/auth";
import { Account, Application } from "@/types";
import { useState } from "react";
import { Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, AlertCircle, Building, Users, FileText } from "lucide-react";

// Sample data
const sampleAccounts: Account[] = [
  {
    id: "acc_1",
    name: "Boston MF Region",
    type: "MF",
    status: "active",
    contactInfo: {
      email: "contact@bostonmf.com",
      phone: "+1-555-0100",
      address: {
        street: "123 Education St",
        city: "Boston",
        state: "MA",
        zipCode: "02101",
        country: "USA",
      },
    },
    businessInfo: {
      businessName: "Boston Educational Services LLC",
      taxId: "12-3456789",
      registrationNumber: "REG-2023-001",
      establishedDate: new Date("2023-01-15"),
    },
    owner: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@bostonmf.com",
      phone: "+1-555-0101",
      title: "Regional Manager",
    },
    permissions: [
      { resource: "programs", actions: ["read", "write"] },
      { resource: "students", actions: ["read", "write"] },
      { resource: "teachers", actions: ["read", "write"] },
    ],
    createdBy: "user_1",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "acc_2",
    name: "Cambridge Learning Center",
    type: "LC",
    status: "active",
    contactInfo: {
      email: "contact@cambridge-lc.com",
      phone: "+1-555-0200",
      address: {
        street: "456 Learning Ave",
        city: "Cambridge",
        state: "MA",
        zipCode: "02139",
        country: "USA",
      },
    },
    businessInfo: {
      businessName: "Cambridge LC LLC",
      taxId: "98-7654321",
      registrationNumber: "REG-2023-002",
      establishedDate: new Date("2023-03-10"),
    },
    owner: {
      firstName: "Emily",
      lastName: "Clark",
      email: "emily.clark@cambridge-lc.com",
      phone: "+1-555-0201",
      title: "Center Manager",
    },
    permissions: [],
    createdBy: "user_1",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2024-02-10"),
    parentAccountId: "acc_1",
  },
  {
    id: "acc_3",
    name: "Somerville Learning Center",
    type: "LC",
    status: "inactive",
    contactInfo: {
      email: "contact@somerville-lc.com",
      phone: "+1-555-0202",
      address: {
        street: "12 Education Way",
        city: "Somerville",
        state: "MA",
        zipCode: "02143",
        country: "USA",
      },
    },
    businessInfo: {
      businessName: "Somerville LC Inc",
      taxId: "21-0987654",
      registrationNumber: "REG-2023-003",
      establishedDate: new Date("2023-05-05"),
    },
    owner: {
      firstName: "David",
      lastName: "Lee",
      email: "david.lee@somerville-lc.com",
      phone: "+1-555-0203",
      title: "Center Owner",
    },
    permissions: [],
    createdBy: "user_1",
    createdAt: new Date("2023-05-05"),
    updatedAt: new Date("2024-02-15"),
    parentAccountId: "acc_1",
  },
];

const sampleApplications: Application[] = [
  {
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
      year1: { targetStudents: 50, programs: ["English Grammar"], revenue: 75000, milestones: ["Setup"] },
      year2: { targetStudents: 100, programs: ["English Grammar"], revenue: 150000, milestones: ["Expand"] },
      year3: { targetStudents: 150, programs: ["English Grammar"], revenue: 225000, milestones: ["Grow"] },
      year4: { targetStudents: 200, programs: ["English Grammar"], revenue: 300000, milestones: ["Scale"] },
    },
    documents: {
      businessLicense: "license.pdf",
      taxCertificate: "tax.pdf",
      financialStatements: ["financial.pdf"],
      marketingPlan: "marketing.pdf",
      otherDocuments: ["other.pdf"],
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
];

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "inactive": return "bg-gray-100 text-gray-800";
    case "suspended": return "bg-red-100 text-red-800";
    case "new": return "bg-blue-100 text-blue-800";
    case "under_review": return "bg-yellow-100 text-yellow-800";
    case "approved": return "bg-green-100 text-green-800";
    case "rejected": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function AccountsPage() {
  const router = useRouter();
  const user = useUser();
  const [activeTab, setActiveTab] = useState<"accounts" | "applications">("accounts");
  const [accountTypeFilter, setAccountTypeFilter] = useState<"all" | "MF" | "LC">("all");
  const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);
  const [applications, setApplications] = useState<Application[]>(sampleApplications);

  // Non-HQ users (e.g., MF) cannot manage accounts; MF can preview their LC accounts and submit applications
  if (user?.role !== "HQ") {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <button
              onClick={() => router.push("/accounts/applications/new")}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Submit New Application
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Restricted Access</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You don’t have permissions to manage accounts. If you need a new account, please submit an application to Headquarters.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MF read-only list of LC accounts under their MF */}
          {user?.role === "MF" && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Your Learning Centers</h3>
                  <p className="text-sm text-gray-600">Read-only preview of LC accounts under your MF.</p>
                </div>
              </div>
              <div className="space-y-4">
                {sampleAccounts
                  .filter(acc => acc.type === "LC" && acc.parentAccountId === "acc_1")
                  .map(account => (
                    <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{account.name}</h4>
                          <p className="text-sm text-gray-500">{account.contactInfo.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(account.status)}`}>
                              {account.status}
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              LC
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
                {sampleAccounts.filter(acc => acc.type === "LC" && acc.parentAccountId === "acc_1").length === 0 && (
                  <p className="text-sm text-gray-500">No LC accounts found under your MF.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  const handleCreateAccount = () => {
    router.push("/accounts/new");
  };

  const handleCreateApplication = () => {
    router.push("/accounts/applications/new");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts Management</h1>
            <p className="text-gray-600">Manage MF and LC accounts, and review applications.</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleCreateAccount}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Account
            </button>
            <button 
              onClick={handleCreateApplication}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              New Application
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Accounts</p>
                <p className="text-2xl font-semibold text-gray-900">{accounts.filter(acc => acc.status === "active").length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Accounts</p>
                <p className="text-2xl font-semibold text-gray-900">{accounts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{applications.filter(app => app.status === "new").length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Under Review</p>
                <p className="text-2xl font-semibold text-gray-900">{applications.filter(app => app.status === "under_review").length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("accounts")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "accounts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Accounts ({accounts.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "applications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Applications ({applications.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === "accounts" ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Accounts</h3>
              {/* Type Filter */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Filter:</span>
                <button
                  onClick={() => setAccountTypeFilter("all")}
                  className={`px-3 py-1 text-sm rounded-md border ${accountTypeFilter === "all" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setAccountTypeFilter("MF")}
                  className={`px-3 py-1 text-sm rounded-md border ${accountTypeFilter === "MF" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                >
                  MF
                </button>
                <button
                  onClick={() => setAccountTypeFilter("LC")}
                  className={`px-3 py-1 text-sm rounded-md border ${accountTypeFilter === "LC" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
                >
                  LC
                </button>
                <div className="ml-auto text-xs text-gray-500 flex items-center gap-3">
                  <span>Total: {accounts.length}</span>
                  <span>MF: {accounts.filter(a => a.type === "MF").length}</span>
                  <span>LC: {accounts.filter(a => a.type === "LC").length}</span>
                </div>
              </div>
              <div className="space-y-4">
                {accounts
                  .filter(acc => accountTypeFilter === "all" ? true : acc.type === accountTypeFilter)
                  .map((account) => (
                  <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{account.name}</h4>
                        <p className="text-sm text-gray-500">{account.contactInfo.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(account.status)}`}>
                            {account.status}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            account.type === "MF" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                          }`}>
                            {account.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/accounts/${account.id}/edit`)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Applications</h3>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {application.applicantInfo.firstName} {application.applicantInfo.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">{application.applicantInfo.email}</p>
                        <p className="text-sm text-gray-500">{application.businessInfo.businessName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            application.applicationType === "MF" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                          }`}>
                            {application.applicationType}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setApplications(prev => prev.map(app => app.id === application.id ? { ...app, status: "approved" } : app))}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setApplications(prev => prev.map(app => app.id === application.id ? { ...app, status: "rejected" } : app))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/accounts/applications/${application.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}