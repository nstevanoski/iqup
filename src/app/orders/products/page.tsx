"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, Column } from "@/components/ui/DataTable";
import { downloadCSV, generateFilename } from "@/lib/csv-export";
import { useUser } from "@/store/auth";
import { Product, ProductList } from "@/types";
import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Trash2, Package, DollarSign, AlertTriangle, CheckCircle, XCircle, Share2 } from "lucide-react";

// Sample data - in a real app, this would come from an API
const sampleProducts: Product[] = [
  {
    id: "product_1",
    name: "English Grammar Workbook",
    description: "Comprehensive grammar exercises for English learners",
    category: "Books",
    sku: "EGW-001",
    price: 29.99,
    cost: 15.00,
    status: "active",
    tags: ["grammar", "workbook", "english"],
    images: ["grammar-workbook.jpg"],
    specifications: {
      pages: 200,
      language: "English",
      level: "Intermediate",
    },
    code: "EGW-001",
    qty: 150,
    minStock: 10,
    maxStock: 200,
    unit: "pieces",
    supplier: "Educational Books Inc.",
    markup: 100,
    sellingPrice: 29.99,
    productLists: ["list_1", "list_2"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "product_2",
    name: "Mathematics Calculator",
    description: "Scientific calculator for advanced mathematics",
    category: "Electronics",
    sku: "MC-001",
    price: 89.99,
    cost: 45.00,
    status: "active",
    tags: ["calculator", "scientific", "math"],
    images: ["calculator.jpg"],
    specifications: {
      functions: "Scientific",
      display: "LCD",
      battery: "Solar + Battery",
    },
    code: "MC-001",
    qty: 75,
    minStock: 15,
    maxStock: 150,
    unit: "pieces",
    supplier: "Tech Supplies Ltd.",
    markup: 100,
    sellingPrice: 89.99,
    productLists: ["list_1", "list_3"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "product_3",
    name: "Physics Lab Kit",
    description: "Complete physics experiment kit for hands-on learning",
    category: "Equipment",
    sku: "PLK-001",
    price: 149.99,
    cost: 75.00,
    status: "active",
    tags: ["physics", "lab", "equipment"],
    images: ["physics-kit.jpg"],
    specifications: {
      weight: "2.5kg",
      experiments: 15,
      level: "Advanced",
    },
    code: "PLK-001",
    qty: 25,
    minStock: 5,
    maxStock: 50,
    unit: "kits",
    supplier: "Science Equipment Co.",
    markup: 100,
    sellingPrice: 149.99,
    productLists: ["list_2", "list_3"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "product_4",
    name: "Chemistry Test Tubes Set",
    description: "Set of 12 glass test tubes with rack",
    category: "Equipment",
    sku: "CTT-001",
    price: 24.99,
    cost: 12.00,
    status: "active",
    tags: ["chemistry", "test-tubes", "glassware"],
    images: ["test-tubes.jpg"],
    specifications: {
      count: 12,
      material: "borosilicate glass",
      capacity: "15ml each",
    },
    code: "CTT-001",
    qty: 50,
    minStock: 10,
    maxStock: 100,
    unit: "sets",
    supplier: "Lab Supplies Inc.",
    markup: 108,
    sellingPrice: 24.99,
    productLists: ["list_2"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-03"),
  },
];

const sampleProductLists: ProductList[] = [
  {
    id: "list_1",
    name: "Essential Learning Materials",
    description: "Core educational materials for all programs",
    status: "active",
    createdBy: "user_1",
    sharedWithMFs: ["mf_region_1", "mf_region_2"],
    visibility: "shared",
    products: [
      {
        productId: "product_1",
        sellingPrice: 29.99,
        finalPrice: 29.99,
      },
      {
        productId: "product_2",
        sellingPrice: 89.99,
        finalPrice: 89.99,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "list_2",
    name: "Science Equipment Bundle",
    description: "Complete science laboratory equipment",
    status: "active",
    createdBy: "user_1",
    sharedWithMFs: ["mf_region_1", "mf_region_3"],
    visibility: "shared",
    products: [
      {
        productId: "product_1",
        sellingPrice: 29.99,
        finalPrice: 29.99,
      },
      {
        productId: "product_3",
        sellingPrice: 149.99,
        finalPrice: 149.99,
      },
      {
        productId: "product_4",
        sellingPrice: 24.99,
        finalPrice: 24.99,
      },
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-08"),
  },
];

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "discontinued":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get stock status
const getStockStatus = (qty: number, minStock: number) => {
  if (qty <= 0) {
    return { status: "out", color: "bg-red-100 text-red-800", icon: XCircle };
  } else if (qty <= minStock) {
    return { status: "low", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle };
  } else {
    return { status: "good", color: "bg-green-100 text-green-800", icon: CheckCircle };
  }
};

// Helper function to get product list names
const getProductListNames = (productListIds: string[]): string => {
  const listNames = productListIds.map(id => {
    const list = sampleProductLists.find(l => l.id === id);
    return list ? list.name : id;
  });
  return listNames.join(", ");
};

// Column definitions
const getColumns = (): Column<Product>[] => [
  {
    key: "name",
    label: "Product",
    sortable: true,
    searchable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{row.code} • {row.sku}</div>
        <div className="text-xs text-gray-500 mt-1">{row.category}</div>
      </div>
    ),
  },
  {
    key: "qty",
    label: "Stock",
    sortable: true,
    render: (value, row) => {
      const stockStatus = getStockStatus(value, row.minStock);
      const Icon = stockStatus.icon;
      return (
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <div>
            <div className="font-medium text-gray-900">{value} {row.unit}</div>
            <div className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>
              {stockStatus.status === "out" ? "Out of Stock" : 
               stockStatus.status === "low" ? "Low Stock" : "In Stock"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    key: "cost",
    label: "Cost",
    sortable: true,
    render: (value, row) => (
      <div className="text-sm">
        <div className="font-medium text-gray-900">${value.toFixed(2)}</div>
        <div className="text-xs text-gray-500">Markup: {row.markup}%</div>
      </div>
    ),
  },
  {
    key: "sellingPrice",
    label: "Selling Price",
    sortable: true,
    render: (value) => (
      <div className="font-medium text-gray-900">${value.toFixed(2)}</div>
    ),
  },
  {
    key: "supplier",
    label: "Supplier",
    sortable: true,
    searchable: true,
    render: (value) => (
      <div className="text-sm text-gray-900">{value}</div>
    ),
  },
  {
    key: "productLists",
    label: "Product Lists",
    sortable: false,
    render: (value) => (
      <div className="text-sm">
        <div className="flex items-center">
          <Share2 className="h-3 w-3 mr-1 text-gray-400" />
          <span className="text-gray-900">{value.length} list(s)</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
          {getProductListNames(value)}
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

export default function ProductsPage() {
  const router = useRouter();
  const user = useUser();
  const [data, setData] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "lists">("products");

  // Only HQ users can access this page
  if (user?.role !== "HQ") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only HQ users can manage products and inventory.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const columns = getColumns();

  const handleRowAction = (action: string, row: Product) => {
    console.log(`${action} action for product:`, row);
    
    switch (action) {
      case "view":
        router.push(`/orders/products/${row.id}`);
        break;
      case "edit":
        router.push(`/orders/products/${row.id}/edit`);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete product ${row.name}?`)) {
          setData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
    }
  };

  const handleBulkAction = (action: string, rows: Product[]) => {
    console.log(`${action} action for ${rows.length} products:`, rows);
    
    switch (action) {
      case "delete":
        if (confirm(`Are you sure you want to delete ${rows.length} products?`)) {
          const idsToDelete = new Set(rows.map(row => row.id));
          setData(prev => prev.filter(item => !idsToDelete.has(item.id)));
        }
        break;
      case "updateStock":
        // In a real app, this would open a bulk stock update modal
        console.log("Bulk stock update for products:", rows);
        break;
    }
  };

  const handleExport = (rows: Product[]) => {
    const exportColumns = [
      { key: "name", label: "Product Name" },
      { key: "code", label: "Code" },
      { key: "sku", label: "SKU" },
      { key: "category", label: "Category" },
      { key: "qty", label: "Quantity" },
      { key: "cost", label: "Cost" },
      { key: "sellingPrice", label: "Selling Price" },
      { key: "supplier", label: "Supplier" },
      { key: "status", label: "Status" },
    ];
    
    downloadCSV(rows, exportColumns, {
      filename: generateFilename("products"),
    });
  };

  const handleCreateProduct = () => {
    router.push("/orders/products/new");
  };

  const handleCreateProductList = () => {
    router.push("/orders/product-lists/new");
  };

  // Calculate stock alerts
  const lowStockProducts = data.filter(p => p.qty <= p.minStock && p.qty > 0);
  const outOfStockProducts = data.filter(p => p.qty <= 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage products, inventory, and product lists. Create and share product lists with MFs.</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleCreateProductList}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Create Product List
            </button>
            <button 
              onClick={handleCreateProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stock Alerts */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Stock Alerts
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {outOfStockProducts.length > 0 && (
                    <p>{outOfStockProducts.length} product(s) out of stock</p>
                  )}
                  {lowStockProducts.length > 0 && (
                    <p>{lowStockProducts.length} product(s) with low stock</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Products ({data.length})
            </button>
            <button
              onClick={() => setActiveTab("lists")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "lists"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Product Lists ({sampleProductLists.length})
            </button>
          </nav>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow">
            <DataTable
              data={data}
              columns={columns}
              searchable={true}
              filterable={true}
              sortable={true}
              pagination={true}
              pageSize={10}
              bulkActions={true}
              rowActions={true}
              onRowAction={handleRowAction}
              onBulkAction={handleBulkAction}
              onExport={handleExport}
              loading={loading}
              emptyMessage="No products found"
            />
          </div>
        )}

        {/* Product Lists Tab */}
        {activeTab === "lists" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleProductLists.map((list) => (
                  <div key={list.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{list.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(list.status)}`}>
                        {list.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{list.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Package className="h-4 w-4 mr-2" />
                        {list.products.length} products
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Share2 className="h-4 w-4 mr-2" />
                        Shared with {list.sharedWithMFs.length} MF(s)
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => router.push(`/orders/product-lists/${list.id}`)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/orders/product-lists/${list.id}/edit`)}
                        className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
