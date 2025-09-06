"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrderForm } from "@/components/forms/OrderForm";
import { useUser } from "@/store/auth";
import { Order } from "@/types";
import { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function NewOrderPage() {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      console.log("Creating order:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to orders list
      router.push("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/orders");
  };

  const breadcrumbItems = [
    { label: "Orders", href: "/orders" },
    { label: "New Order", href: "/orders/new" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        
        <OrderForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          userRole={user?.role}
        />
      </div>
    </DashboardLayout>
  );
}
