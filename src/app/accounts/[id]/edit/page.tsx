"use client";

import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUser } from "@/store/auth";
import { Account } from "@/types";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function EditAccountPage() {
  const router = useRouter();
  const params = useParams();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Account> | null>(null);

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
                <p>Only HQ users can edit accounts.</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Mock fetch existing account by id
  useEffect(() => {
    const id = params?.id as string;
    // In real app: fetch(`/api/accounts/${id}`)
    // For now, seed minimal example
    setFormData({
      id,
      name: "Sample Account",
      type: "LC",
      status: "active",
      contactInfo: {
        email: "contact@example.com",
        phone: "+1-555-0000",
        address: {
          street: "100 Main St",
          city: "City",
          state: "ST",
          zipCode: "00000",
          country: "USA",
        },
      },
      businessInfo: {
        businessName: "Sample LLC",
        taxId: "00-0000000",
        registrationNumber: "REG-000",
        establishedDate: new Date(),
      },
      owner: {
        firstName: "Owner",
        lastName: "Name",
        email: "owner@example.com",
        phone: "+1-555-1111",
        title: "Manager",
      },
      permissions: [],
    });
  }, [params]);

  const breadcrumbItems = [
    { label: "Accounts", href: "/accounts" },
    { label: "Edit Account", href: `/accounts/${params?.id}/edit` },
  ];

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...(prev || {}),
      [parent]: {
        ...((prev as any)?.[parent] || {}),
        [field]: value,
      },
    }));
  };

  const handleDeepNestedInputChange = (parent: string, child: string, field: string, value: any) => {
    setFormData(prev => ({
      ...(prev || {}),
      [parent]: {
        ...((prev as any)?.[parent] || {}),
        [child]: {
          ...((prev as any)?.[parent]?.[child] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...(prev || {}), [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, update via API
      console.log("Updating account:", formData);
      await new Promise(r => setTimeout(r, 800));
      router.push("/accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push("/accounts");

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LC">Learning Center (LC)</option>
                <option value="MF">Master Franchise (MF)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactInfo?.email || ""}
                  onChange={(e) => handleNestedInputChange("contactInfo", "email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contactInfo?.phone || ""}
                  onChange={(e) => handleNestedInputChange("contactInfo", "phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={formData.contactInfo?.address?.street || ""}
                onChange={(e) => handleDeepNestedInputChange("contactInfo", "address", "street", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.contactInfo?.address?.city || ""}
                  onChange={(e) => handleDeepNestedInputChange("contactInfo", "address", "city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.contactInfo?.address?.state || ""}
                  onChange={(e) => handleDeepNestedInputChange("contactInfo", "address", "state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label>
                <input
                  type="text"
                  value={formData.contactInfo?.address?.zipCode || ""}
                  onChange={(e) => handleDeepNestedInputChange("contactInfo", "address", "zipCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button type="button" onClick={handleCancel} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}


