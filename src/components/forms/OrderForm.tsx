"use client";

import { useState, useEffect } from "react";
import { Order, Product } from "@/types";
import { X, Save, Loader2, Plus, Trash2, Package, DollarSign, Building, User } from "lucide-react";

interface OrderFormProps {
  order?: Order;
  onSubmit: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  loading?: boolean;
  userRole?: "HQ" | "MF" | "LC" | "TT";
}

interface FormData {
  orderNumber: string;
  studentId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  orderType: "lc_to_mf" | "mf_to_hq" | "lc_to_student";
  fromEntity: {
    id: string;
    name: string;
    type: "HQ" | "MF" | "LC";
  };
  toEntity: {
    id: string;
    name: string;
    type: "HQ" | "MF" | "LC";
  };
  priority: "low" | "medium" | "high" | "urgent";
  expectedDeliveryDate?: Date;
  isConsolidated: boolean;
  consolidatedOrders: string[];
}

// Sample products for selection
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
];

const initialFormData: FormData = {
  orderNumber: "",
  studentId: "",
  items: [],
  status: "pending",
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  paymentStatus: "pending",
  paymentMethod: "",
  shippingAddress: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  },
  billingAddress: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  },
  notes: "",
  orderType: "lc_to_mf",
  fromEntity: {
    id: "",
    name: "",
    type: "LC",
  },
  toEntity: {
    id: "",
    name: "",
    type: "MF",
  },
  priority: "medium",
  expectedDeliveryDate: undefined,
  isConsolidated: false,
  consolidatedOrders: [],
};

export function OrderForm({ order, onSubmit, onCancel, loading = false, userRole = "HQ" }: OrderFormProps) {
  const [formData, setFormData] = useState<FormData>(
    order ? {
      orderNumber: order.orderNumber,
      studentId: order.studentId,
      items: order.items,
      status: order.status,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod || "",
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      notes: order.notes || "",
      orderType: order.orderType,
      fromEntity: order.fromEntity,
      toEntity: order.toEntity,
      priority: order.priority,
      expectedDeliveryDate: order.expectedDeliveryDate,
      isConsolidated: order.isConsolidated || false,
      consolidatedOrders: order.consolidatedOrders || [],
    } : initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate order number
  useEffect(() => {
    if (!order && !formData.orderNumber) {
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData(prev => ({
        ...prev,
        orderNumber: `ORD-${timestamp}-${random}`,
      }));
    }
  }, [order, formData.orderNumber]);

  // Set order type based on user role
  useEffect(() => {
    if (!order) {
      let orderType: "lc_to_mf" | "mf_to_hq" | "lc_to_student" = "lc_to_mf";
      let fromType: "HQ" | "MF" | "LC" = "LC";
      let toType: "HQ" | "MF" | "LC" = "MF";

      switch (userRole) {
        case "HQ":
          // HQ doesn't create orders directly - they receive from MF
          orderType = "mf_to_hq";
          fromType = "MF";
          toType = "HQ";
          break;
        case "MF":
          // MF creates orders to HQ (consolidated from LC orders)
          orderType = "mf_to_hq";
          fromType = "MF";
          toType = "HQ";
          break;
        case "LC":
          // LC creates orders to MF
          orderType = "lc_to_mf";
          fromType = "LC";
          toType = "MF";
          break;
        case "TT":
          // TT creates orders to MF (same as LC)
          orderType = "lc_to_mf";
          fromType = "LC";
          toType = "MF";
          break;
      }

      setFormData(prev => ({
        ...prev,
        orderType,
        fromEntity: {
          ...prev.fromEntity,
          type: fromType,
        },
        toEntity: {
          ...prev.toEntity,
          type: toType,
        },
      }));
    }
  }, [userRole, order]);

  // Calculate totals when items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax - formData.discount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total,
    }));
  }, [formData.items, formData.discount]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof FormData] as Record<string, any>),
        [field]: value,
      },
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === "productId") {
            const product = sampleProducts.find(p => p.id === value);
            updatedItem.unitPrice = product?.sellingPrice || 0;
            updatedItem.totalPrice = updatedItem.unitPrice * updatedItem.quantity;
          } else if (field === "quantity") {
            updatedItem.totalPrice = updatedItem.unitPrice * value;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderNumber.trim()) newErrors.orderNumber = "Order number is required";
    if (formData.items.length === 0) newErrors.items = "At least one item is required";
    if (!formData.fromEntity.name.trim()) newErrors.fromEntity = "From entity is required";
    if (!formData.toEntity.name.trim()) newErrors.toEntity = "To entity is required";
    if (!formData.shippingAddress.street.trim()) newErrors.shippingAddress = "Shipping address is required";

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.productId) newErrors[`item_${index}_product`] = "Product is required";
      if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const getOrderTypeIcon = (orderType: string) => {
    switch (orderType) {
      case "lc_to_mf":
        return <User className="h-4 w-4" />;
      case "mf_to_hq":
        return <Building className="h-4 w-4" />;
      case "lc_to_student":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Package className="h-5 w-5 inline mr-2" />
              Order Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Number *
              </label>
              <input
                type="text"
                value={formData.orderNumber}
                onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.orderNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Auto-generated"
              />
              {errors.orderNumber && <p className="text-red-500 text-sm mt-1">{errors.orderNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Type
              </label>
              <div className="flex items-center p-3 border border-gray-300 rounded-md bg-gray-50">
                {getOrderTypeIcon(formData.orderType)}
                <span className="ml-2 text-sm capitalize">{formData.orderType.replace(/_/g, " ")}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            </div>
          </div>

          {/* From/To Entities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Building className="h-5 w-5 inline mr-2" />
              From/To Entities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From *
              </label>
              <input
                type="text"
                value={formData.fromEntity.name}
                onChange={(e) => handleNestedInputChange("fromEntity", "name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fromEntity ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter from entity name"
              />
              {errors.fromEntity && <p className="text-red-500 text-sm mt-1">{errors.fromEntity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To *
              </label>
              <input
                type="text"
                value={formData.toEntity.name}
                onChange={(e) => handleNestedInputChange("toEntity", "name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.toEntity ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter to entity name"
              />
              {errors.toEntity && <p className="text-red-500 text-sm mt-1">{errors.toEntity}</p>}
            </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Package className="h-5 w-5 inline mr-2" />
              Order Items
            </h2>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Order Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(index, "productId", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`item_${index}_product`] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Product</option>
                    {sampleProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.sellingPrice}
                      </option>
                    ))}
                  </select>
                  {errors[`item_${index}_product`] && <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_product`]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`item_${index}_quantity`] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[`item_${index}_quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.totalPrice}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <DollarSign className="h-5 w-5 inline mr-2" />
              Order Summary
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
                <div className="text-lg font-semibold">${formData.subtotal.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax (8%)</label>
                <div className="text-lg font-semibold">${formData.tax.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discount}
                  onChange={(e) => handleInputChange("discount", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="text-xl font-bold text-blue-600">${formData.total.toFixed(2)}</div>
              </div>
            </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Building className="h-5 w-5 inline mr-2" />
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  value={formData.shippingAddress.street}
                  onChange={(e) => handleNestedInputChange("shippingAddress", "street", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.shippingAddress ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter street address"
                />
                {errors.shippingAddress && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.shippingAddress.city}
                  onChange={(e) => handleNestedInputChange("shippingAddress", "city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.shippingAddress.state}
                  onChange={(e) => handleNestedInputChange("shippingAddress", "state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={formData.shippingAddress.zipCode}
                  onChange={(e) => handleNestedInputChange("shippingAddress", "zipCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ZIP code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.shippingAddress.country}
                  onChange={(e) => handleNestedInputChange("shippingAddress", "country", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <DollarSign className="h-5 w-5 inline mr-2" />
              Payment Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => handleInputChange("paymentStatus", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <input
                type="text"
                value={formData.paymentMethod || ""}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Credit Card, Bank Transfer"
              />
            </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Notes</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              {order ? "Update Order" : "Create Order"}
            </button>
          </div>
    </form>
  );
}
