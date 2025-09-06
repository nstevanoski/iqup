"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MFPriceManagementForm } from "@/components/forms/MFPriceManagementForm";
import { useUser } from "@/store/auth";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowLeft } from "lucide-react";

export default function PriceManagementPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  // Only MF users can access this page
  if (user?.role !== "MF") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only MF users can manage prices.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (priceData: any) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      console.log("Setting prices:", priceData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to orders list
      router.push("/orders");
    } catch (error) {
      console.error("Error setting prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/orders");
  };

  const breadcrumbItems = [
    { label: "Orders", href: "/orders" },
    { label: "Price Management", href: "/orders/price-management" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MF Price Management</h1>
            <p className="text-gray-600">Set individual prices for each Learning Center</p>
          </div>
        </div>

        <MFPriceManagementForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          mfId={user?.id || "mf_region_1"}
        />
      </div>
    </DashboardLayout>
  );
}
