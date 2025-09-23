"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { X, Save, Loader2, Package, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number | "";
  cost: number | "";
  status: "active" | "inactive" | "discontinued";
  tags: string[];
  images: string[];
  specifications: Record<string, any>;
  code: string;
  qty: number | "";
  minStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  markup: number | "";
  sellingPrice: number | "";
  productLists: string[];
}

const initialFormData: FormData = {
  name: "",
  description: "",
  category: "",
  sku: "",
  price: "",
  cost: "",
  status: "active",
  tags: [],
  images: [],
  specifications: {},
  code: "",
  qty: "",
  minStock: 0,
  maxStock: 0,
  unit: "pieces",
  supplier: "",
  markup: "",
  sellingPrice: "",
  productLists: [],
};

const categories = [
  "Books",
  "Electronics",
  "Equipment",
  "Software",
  "Materials",
  "Tools",
  "Supplies",
  "Other"
];

const units = [
  "pieces",
  "kits",
  "sets",
  "kg",
  "g",
  "liters",
  "meters",
  "boxes",
  "packs"
];

export function ProductForm({ product, onSubmit, onCancel, loading = false }: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>(
    product ? {
      name: product.name,
      description: product.description,
      category: product.category,
      sku: product.sku,
      price: product.price,
      cost: product.cost,
      status: product.status,
      tags: product.tags,
      images: product.images,
      specifications: product.specifications,
      code: product.code,
      qty: product.qty,
      minStock: product.minStock,
      maxStock: product.maxStock,
      unit: product.unit,
      supplier: product.supplier,
      markup: product.markup,
      sellingPrice: product.sellingPrice,
      productLists: product.productLists,
    } : initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Tags removed from UI; keep data field for compatibility
  // Specifications removed from UI; keep data field for compatibility

  // Calculate selling price when cost or markup changes
  useEffect(() => {
    const cost = formData.cost || 0;
    const markup = formData.markup || 0;
    const sellingPrice = cost * (1 + markup / 100);
    setFormData(prev => ({
      ...prev,
      sellingPrice: sellingPrice,
    }));
  }, [formData.cost, formData.markup]);

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

  // Handlers for tags removed

  // Handlers for specifications removed

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.code.trim()) newErrors.code = "Product code is required";
    if (formData.cost !== "" && formData.cost < 0) newErrors.cost = "Cost must be positive";
    if (formData.price !== "" && formData.price < 0) newErrors.price = "Price must be positive";
    if (formData.qty !== "" && formData.qty < 0) newErrors.qty = "Quantity must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert empty strings to 0 for number fields
    const submitData = {
      ...formData,
      price: formData.price === "" ? 0 : formData.price,
      cost: formData.cost === "" ? 0 : formData.cost,
      qty: formData.qty === "" ? 0 : formData.qty,
      markup: formData.markup === "" ? 0 : formData.markup,
      sellingPrice: formData.sellingPrice === "" ? 0 : formData.sellingPrice,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Description</h2>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Product Code */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Code</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product code"
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Category</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <DollarSign className="h-5 w-5 inline mr-2" />
              Pricing Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Cost *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost || ""}
                  onChange={(e) => handleInputChange("cost", e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cost ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Markup (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.markup || ""}
                  onChange={(e) => handleInputChange("markup", e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice || ""}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value === "" ? "" : parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Package className="h-5 w-5 inline mr-2" />
              Inventory Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4 inline mr-1" />
                  Current Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.qty || ""}
                  onChange={(e) => handleInputChange("qty", e.target.value === "" ? "" : parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.qty ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.qty && <p className="text-red-500 text-sm mt-1">{errors.qty}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tags UI removed */}

          {/* Specifications UI removed */}

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
              {product ? "Update Product" : "Create Product"}
            </button>
          </div>
    </form>
  );
}
