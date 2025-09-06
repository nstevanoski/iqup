"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StockReceivingForm } from "@/components/forms/StockReceivingForm";
import { useUser } from "@/store/auth";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowLeft } from "lucide-react";

export default function ReceiveStockPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  // Only HQ users can access this page
  if (user?.role !== "HQ") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only HQ users can receive stock.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (receivingData: any) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call to update inventory
      console.log("Receiving stock:", receivingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to products list
      router.push("/orders/products");
    } catch (error) {
      console.error("Error receiving stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/orders/products");
  };

  const breadcrumbItems = [
    { label: "Orders", href: "/orders" },
    { label: "Products", href: "/orders/products" },
    { label: "Receive Stock", href: "/orders/products/receive-stock" },
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
            <h1 className="text-2xl font-bold text-gray-900">Receive Stock</h1>
            <p className="text-gray-600">Record incoming stock to update inventory levels</p>
          </div>
        </div>

        <StockReceivingForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
