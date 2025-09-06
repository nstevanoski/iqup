"use client";

import { useState } from "react";
import { StudentPayment } from "@/types";

interface PaymentFormProps {
  payment?: StudentPayment;
  onSubmit: (data: Partial<StudentPayment>) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  month: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: "pending" | "paid" | "partial" | "overdue" | "waived";
  paymentMethod?: "bank_transfer" | "cash" | "credit_card";
  reference?: string;
  notes?: string;
  discount?: {
    amount: number;
    reason: string;
    appliedBy: string;
    appliedAt: string;
  };
}

const initialFormData: FormData = {
  month: "",
  amount: 0,
  dueDate: "",
  paymentDate: "",
  status: "pending",
  paymentMethod: undefined,
  reference: "",
  notes: "",
  discount: undefined,
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "partial", label: "Partial" },
  { value: "overdue", label: "Overdue" },
  { value: "waived", label: "Waived" },
];

const paymentMethodOptions = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
];

export function PaymentForm({ payment, onSubmit, onCancel, loading = false }: PaymentFormProps) {
  const [formData, setFormData] = useState<FormData>(
    payment ? {
      month: payment.month,
      amount: payment.amount || 0,
      dueDate: payment.dueDate ? payment.dueDate.toISOString().split('T')[0] : "",
      paymentDate: payment.paymentDate?.toISOString().split('T')[0] || "",
      status: payment.status || "pending",
      paymentMethod: payment.paymentMethod,
      reference: payment.reference || "",
      notes: payment.notes || "",
      discount: payment.discount ? {
        ...payment.discount,
        appliedAt: payment.discount.appliedAt ? payment.discount.appliedAt.toISOString().split('T')[0] : "",
      } : undefined,
    } : initialFormData
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDiscount, setShowDiscount] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.month) {
      newErrors.month = "Month is required";
    }
    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    if (formData.status === "paid" && !formData.paymentDate) {
      newErrors.paymentDate = "Payment date is required for paid status";
    }
    if (formData.status === "paid" && !formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required for paid status";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as any || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : new Date(),
      paymentDate: formData.paymentDate ? new Date(formData.paymentDate) : undefined,
      discount: formData.discount ? {
        ...formData.discount,
        appliedAt: formData.discount.appliedAt ? new Date(formData.discount.appliedAt) : new Date(),
      } : undefined,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month *
            </label>
            <input
              type="month"
              value={formData.month}
              onChange={(e) => handleInputChange("month", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.month ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dueDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
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
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {formData.status === "paid" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.paymentDate && <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  value={formData.paymentMethod || ""}
                  onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.paymentMethod ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethodOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter payment reference"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter any additional notes"
          />
        </div>
      </div>

      {/* Discount Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Discount</h3>
          <button
            type="button"
            onClick={() => setShowDiscount(!showDiscount)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showDiscount ? "Hide Discount" : "Add Discount"}
          </button>
        </div>

        {showDiscount && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.discount?.amount || 0}
                onChange={(e) => handleInputChange("discount.amount", parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Reason
              </label>
              <input
                type="text"
                value={formData.discount?.reason || ""}
                onChange={(e) => handleInputChange("discount.reason", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reason for discount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applied By
              </label>
              <input
                type="text"
                value={formData.discount?.appliedBy || ""}
                onChange={(e) => handleInputChange("discount.appliedBy", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name of person who applied discount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applied At
              </label>
              <input
                type="date"
                value={formData.discount?.appliedAt || ""}
                onChange={(e) => handleInputChange("discount.appliedAt", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : payment ? "Update Payment" : "Create Payment"}
        </button>
      </div>
    </form>
  );
}
