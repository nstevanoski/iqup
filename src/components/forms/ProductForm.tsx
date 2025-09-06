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
  price: number;
  cost: number;
  status: "active" | "inactive" | "discontinued";
  tags: string[];
  images: string[];
  specifications: Record<string, any>;
  code: string;
  qty: number;
  minStock: number;
  maxStock: number;
  unit: string;
  supplier: string;
  markup: number;
  sellingPrice: number;
  productLists: string[];
}

const initialFormData: FormData = {
  name: "",
  description: "",
  category: "",
  sku: "",
  price: 0,
  cost: 0,
  status: "active",
  tags: [],
  images: [],
  specifications: {},
  code: "",
  qty: 0,
  minStock: 0,
  maxStock: 0,
  unit: "pieces",
  supplier: "",
  markup: 0,
  sellingPrice: 0,
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
  const [newTag, setNewTag] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Calculate selling price when cost or markup changes
  useEffect(() => {
    const sellingPrice = formData.cost * (1 + formData.markup / 100);
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (keyToRemove: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[keyToRemove];
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.code.trim()) newErrors.code = "Product code is required";
    if (formData.cost < 0) newErrors.cost = "Cost must be positive";
    if (formData.price < 0) newErrors.price = "Price must be positive";
    if (formData.qty < 0) newErrors.qty = "Quantity must be positive";
    if (formData.minStock < 0) newErrors.minStock = "Min stock must be positive";
    if (formData.maxStock < 0) newErrors.maxStock = "Max stock must be positive";
    if (formData.minStock > formData.maxStock) newErrors.maxStock = "Max stock must be greater than min stock";
    if (!formData.supplier.trim()) newErrors.supplier = "Supplier is required";

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

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
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

          {/* Product Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.sku ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter SKU"
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
            </div>

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

          {/* Category and Supplier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.supplier ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter supplier name"
              />
              {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Pricing Information</h3>
            
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
                  value={formData.cost}
                  onChange={(e) => handleInputChange("cost", parseFloat(e.target.value) || 0)}
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
                  value={formData.markup}
                  onChange={(e) => handleInputChange("markup", parseFloat(e.target.value) || 0)}
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
                  value={formData.sellingPrice}
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
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4 inline mr-1" />
                  Current Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.qty}
                  onChange={(e) => handleInputChange("qty", parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.qty ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.qty && <p className="text-red-500 text-sm mt-1">{errors.qty}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange("minStock", parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.minStock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.minStock && <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) => handleInputChange("maxStock", parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.maxStock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.maxStock && <p className="text-red-500 text-sm mt-1">{errors.maxStock}</p>}
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

            {/* Stock Status Indicator */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {formData.qty <= 0 ? (
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                ) : formData.qty <= formData.minStock ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                <span className="text-sm font-medium">
                  {formData.qty <= 0 ? "Out of Stock" : 
                   formData.qty <= formData.minStock ? "Low Stock" : "In Stock"}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specifications
            </label>
            <div className="space-y-2 mb-4">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm"><strong>{key}:</strong> {value}</span>
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Specification key"
              />
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Specification value"
              />
            </div>
            <button
              type="button"
              onClick={addSpecification}
              className="mt-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Specification
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
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
      </div>
    </div>
  );
}
