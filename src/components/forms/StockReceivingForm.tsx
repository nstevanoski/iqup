"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { X, Save, Loader2, Package, Plus, Trash2, Truck, CheckCircle } from "lucide-react";

interface StockReceivingFormProps {
  onSubmit: (receivingData: {
    productId: string;
    quantity: number;
    unitCost: number;
    supplier: string;
    batchNumber?: string;
    expiryDate?: Date;
    notes?: string;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface ReceivingItem {
  productId: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  batchNumber: string;
  expiryDate: string;
  notes: string;
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

const initialReceivingItem: ReceivingItem = {
  productId: "",
  quantity: 0,
  unitCost: 0,
  supplier: "",
  batchNumber: "",
  expiryDate: "",
  notes: "",
};

export function StockReceivingForm({ onSubmit, onCancel, loading = false }: StockReceivingFormProps) {
  const [receivingItems, setReceivingItems] = useState<ReceivingItem[]>([{ ...initialReceivingItem }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addReceivingItem = () => {
    setReceivingItems(prev => [...prev, { ...initialReceivingItem }]);
  };

  const removeReceivingItem = (index: number) => {
    if (receivingItems.length > 1) {
      setReceivingItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateReceivingItem = (index: number, field: keyof ReceivingItem, value: any) => {
    setReceivingItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    receivingItems.forEach((item, index) => {
      if (!item.productId) newErrors[`item_${index}_product`] = "Product is required";
      if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = "Quantity must be greater than 0";
      if (item.unitCost <= 0) newErrors[`item_${index}_unitCost`] = "Unit cost must be greater than 0";
      if (!item.supplier.trim()) newErrors[`item_${index}_supplier`] = "Supplier is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Process each receiving item
    receivingItems.forEach(item => {
      onSubmit({
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        supplier: item.supplier,
        batchNumber: item.batchNumber || undefined,
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
        notes: item.notes || undefined,
      });
    });
  };

  const getProductById = (productId: string): Product | undefined => {
    return sampleProducts.find(p => p.id === productId);
  };

  const totalValue = receivingItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
          {/* Receiving Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Truck className="h-5 w-5 inline mr-2" />
              Stock Receiving Items
            </h2>
            
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Receiving Items
              </label>
              <button
                type="button"
                onClick={addReceivingItem}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            
            {receivingItems.map((item, index) => {
              const product = getProductById(item.productId);
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Item {index + 1}</h4>
                    {receivingItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReceivingItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateReceivingItem(index, "productId", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_product`] ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Product</option>
                        {sampleProducts.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.code}) - Current Stock: {product.qty}
                          </option>
                        ))}
                      </select>
                      {errors[`item_${index}_product`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_product`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateReceivingItem(index, "quantity", parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_quantity`] ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter quantity"
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Cost *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitCost}
                        onChange={(e) => updateReceivingItem(index, "unitCost", parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_unitCost`] ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter unit cost"
                      />
                      {errors[`item_${index}_unitCost`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitCost`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supplier *</label>
                      <input
                        type="text"
                        value={item.supplier}
                        onChange={(e) => updateReceivingItem(index, "supplier", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_supplier`] ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter supplier name"
                      />
                      {errors[`item_${index}_supplier`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_supplier`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
                      <input
                        type="text"
                        value={item.batchNumber}
                        onChange={(e) => updateReceivingItem(index, "batchNumber", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter batch number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="date"
                        value={item.expiryDate}
                        onChange={(e) => updateReceivingItem(index, "expiryDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={item.notes}
                      onChange={(e) => updateReceivingItem(index, "notes", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter any notes about this receiving"
                    />
                  </div>

                  {/* Product Info Display */}
                  {product && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-gray-500 ml-2">({product.code})</span>
                          <span className="text-gray-500 ml-2">• Current Stock: {product.qty} {product.unit}</span>
                          <span className="text-gray-500 ml-2">• After Receiving: {product.qty + item.quantity} {product.unit}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <CheckCircle className="h-5 w-5 inline mr-2" />
              Receiving Summary
            </h2>
            
            <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Receiving Summary</h3>
                  <p className="text-sm text-green-700">
                    {receivingItems.length} item(s) • Total Value: ${totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-900">
                  ${totalValue.toFixed(2)}
                </div>
                <div className="text-sm text-green-700">Total Value</div>
              </div>
            </div>
            </div>
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Receive Stock
            </button>
          </div>
    </form>
  );
}
