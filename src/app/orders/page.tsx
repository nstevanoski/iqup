"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser, useSelectedScope } from "@/store/auth";
import { Order, Product } from "@/types";
import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, Package, DollarSign, Calendar, User, Building, Truck, AlertCircle } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    studentId: "student_1",
    items: [
      {
        productId: "product_1",
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98,
      },
    ],
    status: "delivered",
    subtotal: 59.98,
    tax: 4.80,
    discount: 0,
    total: 64.78,
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
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
    processedBy: "user_1",
    orderType: "lc_to_student",
    fromEntity: {
      id: "lc_region_1",
      name: "Boston Learning Center",
      type: "LC",
    },
    toEntity: {
      id: "student_1",
      name: "John Doe",
      type: "LC",
    },
    isConsolidated: false,
    priority: "medium",
    expectedDeliveryDate: new Date("2024-02-15"),
    actualDeliveryDate: new Date("2024-02-12"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-12"),
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
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
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    billingAddress: {
      street: "456 Oak Ave",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA",
    },
    orderType: "lc_to_student",
    fromEntity: {
      id: "lc_region_2",
      name: "Seattle Learning Center",
      type: "LC",
    },
    toEntity: {
      id: "student_2",
      name: "Alice Smith",
      type: "LC",
    },
    isConsolidated: false,
    priority: "low",
    expectedDeliveryDate: new Date("2024-02-20"),
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    studentId: "mf_region_1",
    items: [
      {
        productId: "product_1",
        quantity: 50,
        unitPrice: 29.99,
        totalPrice: 1499.50,
      },
      {
        productId: "product_2",
        quantity: 25,
        unitPrice: 89.99,
        totalPrice: 2249.75,
      },
    ],
    status: "processing",
    subtotal: 3749.25,
    tax: 299.94,
    discount: 0,
    total: 4049.19,
    paymentStatus: "paid",
    paymentMethod: "Bank Transfer",
    shippingAddress: {
      street: "123 Business Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    billingAddress: {
      street: "123 Business Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      country: "USA",
    },
    processedBy: "user_1",
    orderType: "hq_to_mf",
    fromEntity: {
      id: "hq_main",
      name: "Headquarters",
      type: "HQ",
    },
    toEntity: {
      id: "mf_region_1",
      name: "Boston MF Region",
      type: "MF",
    },
    isConsolidated: false,
    priority: "high",
    expectedDeliveryDate: new Date("2024-02-18"),
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-08"),
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    studentId: "lc_region_1",
    items: [
      {
        productId: "product_1",
        quantity: 20,
        unitPrice: 34.49,
        totalPrice: 689.80,
      },
    ],
    status: "confirmed",
    subtotal: 689.80,
    tax: 55.18,
    discount: 0,
    total: 744.98,
    paymentStatus: "pending",
    shippingAddress: {
      street: "456 Learning St",
      city: "Boston",
      state: "MA",
      zipCode: "02102",
      country: "USA",
    },
    billingAddress: {
      street: "456 Learning St",
      city: "Boston",
      state: "MA",
      zipCode: "02102",
      country: "USA",
    },
    orderType: "mf_to_lc",
    fromEntity: {
      id: "mf_region_1",
      name: "Boston MF Region",
      type: "MF",
    },
    toEntity: {
      id: "lc_region_1",
      name: "Boston Learning Center",
      type: "LC",
    },
    isConsolidated: false,
    priority: "medium",
    expectedDeliveryDate: new Date("2024-02-17"),
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-13"),
  },
];

// Helper function to get product name
const getProductName = (productId: string): string => {
  const productMap: Record<string, string> = {
    "product_1": "English Grammar Workbook",
    "product_2": "Mathematics Calculator",
    "product_3": "Physics Lab Kit",
    "product_4": "Chemistry Test Tubes Set",
  };
  return productMap[productId] || productId;
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "confirmed":
      return "bg-yellow-100 text-yellow-800";
    case "pending":
      return "bg-gray-100 text-gray-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get payment status color
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "refunded":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get order type icon
const getOrderTypeIcon = (orderType: string) => {
  switch (orderType) {
    case "hq_to_mf":
      return <Building className="h-4 w-4" />;
    case "mf_to_lc":
      return <User className="h-4 w-4" />;
    case "lc_to_student":
      return <Package className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

// Column definitions
const getColumns = (userRole: string, canEdit: boolean): Column<Order>[] => [
  {
    key: "orderNumber",
    label: "Order Number",
    sortable: true,
    searchable: true,
    filterable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          {getOrderTypeIcon(row.orderType)}
          <span className="ml-1 capitalize">{row.orderType.replace(/_/g, " ")}</span>
        </div>
      </div>
    ),
  },
  {
    key: "fromEntity",
    label: "From",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{value.name}</div>
        <div className="text-xs text-gray-500">{value.type}</div>
      </div>
    ),
  },
  {
    key: "toEntity",
    label: "To",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{value.name}</div>
        <div className="text-xs text-gray-500">{value.type}</div>
      </div>
    ),
  },
  {
    key: "items",
    label: "Items",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">{value.length} item(s)</div>
        <div className="text-xs text-gray-500">
          {value.map((item: any) => getProductName(item.productId)).join(", ")}
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    filterable: true,
    render: (value) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value)}`}>
        {value}
      </span>
    ),
  },
  {
    key: "paymentStatus",
    label: "Payment",
    sortable: true,
    filterable: true,
    render: (value) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(value)}`}>
        {value}
      </span>
    ),
  },
  {
    key: "total",
    label: "Total",
    sortable: true,
    render: (value) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">${value.toFixed(2)}</div>
        <div className="text-xs text-gray-500">Subtotal: ${(value * 0.92).toFixed(2)}</div>
      </div>
    ),
  },
  {
    key: "priority",
    label: "Priority",
    sortable: true,
    filterable: true,
    render: (value) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(value)}`}>
        {value}
      </span>
    ),
  },
  {
    key: "expectedDeliveryDate",
    label: "Expected Delivery",
    sortable: true,
    render: (value) => (
      <div className="text-sm">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
          <span>{value ? new Date(value).toLocaleDateString() : "TBD"}</span>
        </div>
        {value && (
          <div className="text-xs text-green-600 mt-1">
            Delivered: {new Date(value).toLocaleDateString()}
          </div>
        )}
      </div>
    ),
  },
  {
    key: "createdAt",
    label: "Created",
    sortable: true,
    render: (value) => (
      <div className="text-sm text-gray-900">
        {new Date(value).toLocaleDateString()}
      </div>
    ),
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const user = useUser();
  const selectedScope = useSelectedScope();
  const [data, setData] = useState<Order[]>(sampleOrders);
  const [loading, setLoading] = useState(false);

  // Filter orders based on user role and scope
  useEffect(() => {
    let filteredOrders = sampleOrders;

    if (user?.role === "MF") {
      // MF users can see orders to/from their region
      filteredOrders = sampleOrders.filter(order => 
        order.fromEntity.id === selectedScope?.id || order.toEntity.id === selectedScope?.id
      );
    } else if (user?.role === "LC") {
      // LC users can see orders to/from their center
      filteredOrders = sampleOrders.filter(order => 
        order.fromEntity.id === selectedScope?.id || order.toEntity.id === selectedScope?.id
      );
    } else if (user?.role === "TT") {
      // TT users have limited access
      filteredOrders = [];
    }
    // HQ users can see all orders

    setData(filteredOrders);
  }, [user, selectedScope]);

  const canEdit = user?.role === "HQ" || user?.role === "MF";
  const canCreate = user?.role === "HQ" || user?.role === "MF" || user?.role === "LC";
  const columns = getColumns(user?.role || "", canEdit);

  const handleRowAction = (action: string, row: Order) => {
    console.log(`${action} action for order:`, row);
    
    switch (action) {
      case "view":
        router.push(`/orders/${row.id}`);
        break;
      case "edit":
        if (canEdit) {
          router.push(`/orders/${row.id}/edit`);
        }
        break;
      case "delete":
        if (canEdit && confirm(`Are you sure you want to delete order ${row.orderNumber}?`)) {
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: Order[]) => {
    console.log(`${action} action for ${rows.length} orders:`, rows);
    
    switch (action) {
      case "delete":
        if (canEdit && confirm(`Are you sure you want to delete ${rows.length} orders?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
      case "consolidate":
        if (user?.role === "MF" && confirm(`Consolidate ${rows.length} orders?`)) {
          // In a real app, this would make an API call to consolidate orders
          console.log("Consolidating orders:", rows);
        }
        break;
    }
  };

  const handleExport = (rows: Order[]) => {
    const exportColumns = [
      { key: "orderNumber", label: "Order Number" },
      { key: "fromEntity.name", label: "From" },
      { key: "toEntity.name", label: "To" },
      { key: "status", label: "Status" },
      { key: "paymentStatus", label: "Payment Status" },
      { key: "total", label: "Total" },
      { key: "priority", label: "Priority" },
      { key: "expectedDeliveryDate", label: "Expected Delivery" },
      { key: "createdAt", label: "Created" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("orders"),
    });
  };

  const handleCreateOrder = () => {
    router.push("/orders/new");
  };

  const getRoleBasedMessage = () => {
    switch (user?.role) {
      case "HQ":
        return "Manage all orders across the organization. Create product lists and share with MFs.";
      case "MF":
        return "View product lists, set LC prices, and place orders to HQ. Consolidate LC orders.";
      case "LC":
        return "View prices and place orders to MF. Orders will be consolidated by your MF.";
      case "TT":
        return "Limited access to order information.";
      default:
        return "Manage orders and inventory.";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600">{getRoleBasedMessage()}</p>
          </div>
          {canCreate && (
            <button 
              onClick={handleCreateOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Order
            </button>
          )}
        </div>

        {/* Role-based information */}
        {user?.role === "MF" && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Order Consolidation
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>You can consolidate multiple LC orders to reduce shipping costs and improve efficiency.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <DataTable
            data={data}
            columns={columns}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={10}
            bulkActions={canEdit}
            rowActions={true}
            onRowAction={handleRowAction}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            loading={loading}
            emptyMessage="No orders found"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}