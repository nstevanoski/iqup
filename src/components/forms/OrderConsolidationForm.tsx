"use client";

import { useState, useEffect } from "react";
import { Order, Product } from "@/types";
import { X, Save, Loader2, Package, Plus, Trash2, Building, User, CheckCircle, DollarSign } from "lucide-react";

interface OrderConsolidationFormProps {
  orders: Order[];
  onSubmit: (consolidatedOrder: {
    orderNumber: string;
    fromEntity: { id: string; name: string; type: "MF" };
    toEntity: { id: string; name: string; type: "HQ" };
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
    priority: "low" | "medium" | "high" | "urgent";
    notes?: string;
    consolidatedOrders: string[];
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface ConsolidatedItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sourceOrders: string[];
}

// Sample products for reference
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

export function OrderConsolidationForm({ orders, onSubmit, onCancel, loading = false }: OrderConsolidationFormProps) {
  const [consolidatedItems, setConsolidatedItems] = useState<ConsolidatedItem[]>([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate order number
  useEffect(() => {
    if (!orderNumber) {
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setOrderNumber(`CONS-${timestamp}-${random}`);
    }
  }, [orderNumber]);

  // Consolidate items from selected orders
  useEffect(() => {
    const itemMap = new Map<string, ConsolidatedItem>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.productId;
        if (itemMap.has(key)) {
          const existing = itemMap.get(key)!;
          existing.quantity += item.quantity;
          existing.totalPrice += item.totalPrice;
          existing.sourceOrders.push(order.id);
        } else {
          itemMap.set(key, {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            sourceOrders: [order.id],
          });
        }
      });
    });

    setConsolidatedItems(Array.from(itemMap.values()));
  }, [orders]);

  const updateItemQuantity = (index: number, quantity: number) => {
    setConsolidatedItems(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity: quantity,
          totalPrice: item.unitPrice * quantity,
        };
      }
      return item;
    }));
  };

  const removeItem = (index: number) => {
    setConsolidatedItems(prev => prev.filter((_, i) => i !== index));
  };

  const addCustomItem = () => {
    setConsolidatedItems(prev => [...prev, {
      productId: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      sourceOrders: [],
    }]);
  };

  const updateCustomItem = (index: number, field: string, value: any) => {
    setConsolidatedItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value };
        if (field === "productId") {
          const product = sampleProducts.find(p => p.id === value);
          updated.unitPrice = product?.sellingPrice || 0;
          updated.totalPrice = updated.unitPrice * updated.quantity;
        } else if (field === "quantity") {
          updated.totalPrice = updated.unitPrice * value;
        }
        return updated;
      }
      return item;
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!orderNumber.trim()) newErrors.orderNumber = "Order number is required";
    if (consolidatedItems.length === 0) newErrors.items = "At least one item is required";

    consolidatedItems.forEach((item, index) => {
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

    const subtotal = consolidatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    onSubmit({
      orderNumber,
      fromEntity: {
        id: "mf_region_1",
        name: "Boston MF Region",
        type: "MF",
      },
      toEntity: {
        id: "hq_main",
        name: "Headquarters",
        type: "HQ",
      },
      items: consolidatedItems,
      priority,
      notes: notes || undefined,
      consolidatedOrders: orders.map(o => o.id),
    });
  };

  const getProductById = (productId: string): Product | undefined => {
    return sampleProducts.find(p => p.id === productId);
  };

  const subtotal = consolidatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Building className="h-5 w-5 inline mr-2" />
              Order Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consolidated Order Number *
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.orderNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Auto-generated"
              />
              {errors.orderNumber && <p className="text-red-500 text-sm mt-1">{errors.orderNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Orders
              </label>
              <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                <div className="text-sm text-gray-600">
                  {orders.length} order(s) selected
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {orders.map(o => o.orderNumber).join(", ")}
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Consolidated Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Package className="h-5 w-5 inline mr-2" />
              Consolidated Items
            </h2>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Consolidated Items
              </label>
              <button
                type="button"
                onClick={addCustomItem}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Custom Item
              </button>
            </div>
            
            {consolidatedItems.map((item, index) => {
              const product = getProductById(item.productId);
              const isCustomItem = item.sourceOrders.length === 0;
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Item {index + 1} {isCustomItem && "(Custom)"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                      {isCustomItem ? (
                        <select
                          value={item.productId}
                          onChange={(e) => updateCustomItem(index, "productId", e.target.value)}
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
                      ) : (
                        <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
                          <div className="text-sm font-medium">{product?.name}</div>
                          <div className="text-xs text-gray-500">{product?.code}</div>
                        </div>
                      )}
                      {errors[`item_${index}_product`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_product`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_quantity`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source Orders</label>
                      <div className="text-xs text-gray-500">
                        {item.sourceOrders.length > 0 ? (
                          <div>
                            {item.sourceOrders.length} order(s)
                            <div className="text-gray-400">
                              {orders.filter(o => item.sourceOrders.includes(o.id))
                                .map(o => o.orderNumber).join(", ")}
                            </div>
                          </div>
                        ) : (
                          "Custom item"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <DollarSign className="h-5 w-5 inline mr-2" />
              Consolidated Order Summary
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
                <div className="text-lg font-semibold">${subtotal.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax (8%)</label>
                <div className="text-lg font-semibold">${tax.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="text-xl font-bold text-blue-600">${total.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
                <div className="text-lg font-semibold">{consolidatedItems.length}</div>
              </div>
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes about this consolidated order"
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
              Create Consolidated Order
            </button>
          </div>
    </form>
  );
}
