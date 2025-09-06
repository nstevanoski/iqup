"use client";

import { useState, useEffect } from "react";
import { Product, ProductPrice } from "@/types";
import { X, Save, Loader2, DollarSign, Building, User, Plus, Trash2 } from "lucide-react";

interface MFPriceManagementFormProps {
  onSubmit: (priceData: {
    productId: string;
    lcId: string;
    basePrice: number;
    markup: number;
    finalPrice: number;
  }) => void;
  onCancel: () => void;
  loading?: boolean;
  mfId: string;
}

interface PriceItem {
  productId: string;
  lcId: string;
  basePrice: number;
  markup: number;
  finalPrice: number;
}

// Sample products and LCs
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

const sampleLCs = [
  { id: "lc_1", name: "Boston Learning Center", location: "Boston, MA" },
  { id: "lc_2", name: "Seattle Learning Center", location: "Seattle, WA" },
  { id: "lc_3", name: "Austin Learning Center", location: "Austin, TX" },
];

const initialPriceItem: PriceItem = {
  productId: "",
  lcId: "",
  basePrice: 0,
  markup: 0,
  finalPrice: 0,
};

export function MFPriceManagementForm({ onSubmit, onCancel, loading = false, mfId }: MFPriceManagementFormProps) {
  const [priceItems, setPriceItems] = useState<PriceItem[]>([{ ...initialPriceItem }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addPriceItem = () => {
    setPriceItems(prev => [...prev, { ...initialPriceItem }]);
  };

  const removePriceItem = (index: number) => {
    if (priceItems.length > 1) {
      setPriceItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updatePriceItem = (index: number, field: keyof PriceItem, value: any) => {
    setPriceItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate final price when base price or markup changes
        if (field === "basePrice" || field === "markup") {
          updatedItem.finalPrice = updatedItem.basePrice * (1 + updatedItem.markup / 100);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    priceItems.forEach((item, index) => {
      if (!item.productId) newErrors[`item_${index}_product`] = "Product is required";
      if (!item.lcId) newErrors[`item_${index}_lc`] = "Learning Center is required";
      if (item.basePrice <= 0) newErrors[`item_${index}_basePrice`] = "Base price must be greater than 0";
      if (item.markup < 0) newErrors[`item_${index}_markup`] = "Markup cannot be negative";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Process each price item
    priceItems.forEach(item => {
      onSubmit({
        productId: item.productId,
        lcId: item.lcId,
        basePrice: item.basePrice,
        markup: item.markup,
        finalPrice: item.finalPrice,
      });
    });
  };

  const getProductById = (productId: string): Product | undefined => {
    return sampleProducts.find(p => p.id === productId);
  };

  const getLCById = (lcId: string) => {
    return sampleLCs.find(lc => lc.id === lcId);
  };

  const totalRevenue = priceItems.reduce((sum, item) => sum + item.finalPrice, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
          {/* Price Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Building className="h-5 w-5 inline mr-2" />
              Price Settings
            </h2>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Price Settings
              </label>
              <button
                type="button"
                onClick={addPriceItem}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Price Setting
              </button>
            </div>
            
            {priceItems.map((item, index) => {
              const product = getProductById(item.productId);
              const lc = getLCById(item.lcId);
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Price Setting {index + 1}</h4>
                    {priceItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePriceItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
                      <select
                        value={item.productId}
                        onChange={(e) => updatePriceItem(index, "productId", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_product`] ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Product</option>
                        {sampleProducts.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.code}) - HQ Price: ${product.sellingPrice}
                          </option>
                        ))}
                      </select>
                      {errors[`item_${index}_product`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_product`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Learning Center *</label>
                      <select
                        value={item.lcId}
                        onChange={(e) => updatePriceItem(index, "lcId", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_lc`] ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Learning Center</option>
                        {sampleLCs.map(lc => (
                          <option key={lc.id} value={lc.id}>
                            {lc.name} - {lc.location}
                          </option>
                        ))}
                      </select>
                      {errors[`item_${index}_lc`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_lc`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Base Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.basePrice}
                        onChange={(e) => updatePriceItem(index, "basePrice", parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_basePrice`] ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter base price"
                      />
                      {errors[`item_${index}_basePrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_basePrice`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Markup (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.markup}
                        onChange={(e) => updatePriceItem(index, "markup", parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`item_${index}_markup`] ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter markup percentage"
                      />
                      {errors[`item_${index}_markup`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_markup`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Final Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.finalPrice}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Product and LC Info Display */}
                  {(product || lc) && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm">
                              <span className="font-medium">{product.name}</span>
                              <span className="text-gray-500 ml-2">({product.code})</span>
                              <div className="text-gray-500">
                                HQ Price: ${product.sellingPrice} • Cost: ${product.cost}
                              </div>
                            </div>
                          </div>
                        )}
                        {lc && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm">
                              <span className="font-medium">{lc.name}</span>
                              <div className="text-gray-500">{lc.location}</div>
                            </div>
                          </div>
                        )}
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
              <DollarSign className="h-5 w-5 inline mr-2" />
              Price Summary
            </h2>
            
            <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Price Summary</h3>
                  <p className="text-sm text-green-700">
                    {priceItems.length} price setting(s) configured
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-900">
                  {priceItems.length} Settings
                </div>
                <div className="text-sm text-green-700">Total Configurations</div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Price Settings
            </button>
          </div>
    </form>
  );
}
