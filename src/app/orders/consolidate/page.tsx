"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrderConsolidationForm } from "@/components/forms/OrderConsolidationForm";
import { useUser } from "@/store/auth";
import { useState, useEffect, Suspense } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Order } from "@/types";
import { ArrowLeft } from "lucide-react";

// Sample orders for consolidation
const sampleOrders: Order[] = [
  {
    id: "order_1",
    orderNumber: "ORD-20240201-001",
    studentId: "student_1",
    items: [
      {
        productId: "product_1",
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98,
      },
    ],
    status: "pending",
    subtotal: 59.98,
    tax: 4.80,
    discount: 0,
    total: 64.78,
    paymentStatus: "pending",
    shippingAddress: {
      street: "123 Main St",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    billingAddress: {
      street: "123 Main St",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    notes: "Urgent order",
    orderType: "lc_to_student",
    fromEntity: {
      id: "lc_1",
      name: "Boston Learning Center",
      type: "LC",
    },
    toEntity: {
      id: "student_1",
      name: "John Doe",
      type: "LC",
    },
    isConsolidated: false,
    consolidatedOrders: [],
    priority: "high",
    expectedDeliveryDate: new Date("2024-02-15"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "order_2",
    orderNumber: "ORD-20240201-002",
    studentId: "student_2",
    items: [
      {
        productId: "product_2",
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
      },
    ],
    status: "pending",
    subtotal: 89.99,
    tax: 7.20,
    discount: 0,
    total: 97.19,
    paymentStatus: "pending",
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02102",
      country: "USA",
    },
    billingAddress: {
      street: "456 Oak Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02102",
      country: "USA",
    },
    notes: "Regular order",
    orderType: "lc_to_student",
    fromEntity: {
      id: "lc_2",
      name: "Cambridge Learning Center",
      type: "LC",
    },
    toEntity: {
      id: "student_2",
      name: "Jane Smith",
      type: "LC",
    },
    isConsolidated: false,
    consolidatedOrders: [],
    priority: "medium",
    expectedDeliveryDate: new Date("2024-02-16"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

function ConsolidateOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  // Only MF users can access this page
  if (user?.role !== "MF") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only MF users can consolidate orders.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get selected order IDs from URL params
  useEffect(() => {
    const orderIds = searchParams.get('orderIds');
    if (orderIds) {
      const ids = orderIds.split(',');
      const orders = sampleOrders.filter(order => ids.includes(order.id));
      setSelectedOrders(orders);
    } else {
      // If no orders selected, redirect back to orders page
      router.push("/orders");
    }
  }, [searchParams, router]);

  const handleSubmit = async (consolidatedData: any) => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      console.log("Creating consolidated order:", consolidatedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to orders list
      router.push("/orders");
    } catch (error) {
      console.error("Error creating consolidated order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/orders");
  };

  const breadcrumbItems = [
    { label: "Orders", href: "/orders" },
    { label: "Consolidate Orders", href: "/orders/consolidate" },
  ];

  if (selectedOrders.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Selected</h2>
            <p className="text-gray-600">Please select orders to consolidate from the orders page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Consolidate Orders</h1>
            <p className="text-gray-600">Combine multiple orders into a single order to HQ</p>
          </div>
        </div>

        <OrderConsolidationForm
          orders={selectedOrders}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}

export default function ConsolidateOrdersPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <ConsolidateOrdersContent />
    </Suspense>
  );
}
