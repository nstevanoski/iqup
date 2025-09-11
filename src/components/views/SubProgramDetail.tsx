"use client";

import { SubProgram, Program } from "@/types";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Building2,
  CreditCard,
  Calendar as CalendarIcon
} from "lucide-react";

interface SubProgramDetailProps {
  subProgram: SubProgram;
  program?: Program;
  onEdit?: () => void;
}

export function SubProgramDetail({ subProgram, program, onEdit }: SubProgramDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "bg-blue-100 text-blue-800";
      case "shared":
        return "bg-purple-100 text-purple-800";
      case "private":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPricingModelLabel = (model: string) => {
    switch (model) {
      case "one-time":
        return "One-time Payment";
      case "installments":
        return "Installments";
      case "subscription":
        return "Monthly Subscription";
      case "program_price":
        return "Program Price";
      default:
        return model;
    }
  };

  const getPricingModelIcon = (model: string) => {
    switch (model) {
      case "one-time":
        return <DollarSign className="h-4 w-4" />;
      case "installments":
        return <CreditCard className="h-4 w-4" />;
      case "subscription":
        return <CalendarIcon className="h-4 w-4" />;
      case "program_price":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getLCScopeNames = (scopeIds: string[]): string[] => {
    const scopeMap: Record<string, string> = {
      "lc_center_nyc": "New York Learning Center",
      "lc_center_la": "Los Angeles Learning Center",
      "lc_center_chicago": "Chicago Learning Center",
      "lc_center_boston": "Boston Learning Center",
      "lc_center_miami": "Miami Learning Center",
    };
    return scopeIds.map(id => scopeMap[id] || id);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Program</p>
              <p className="text-lg font-semibold text-gray-900">
                {program?.name || "Unknown Program"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-lg font-semibold text-gray-900">
                {subProgram.duration} weeks
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              {getPricingModelIcon(subProgram.pricingModel)}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pricing Model</p>
              <p className="text-lg font-semibold text-gray-900">
                {getPricingModelLabel(subProgram.pricingModel)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Course Price</p>
              <p className="text-lg font-semibold text-gray-900">
                ${subProgram.coursePrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{subProgram.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{subProgram.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(subProgram.status)}`}>
                    {subProgram.status.charAt(0).toUpperCase() + subProgram.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Visibility</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getVisibilityColor(subProgram.visibility)}`}>
                    {subProgram.visibility.charAt(0).toUpperCase() + subProgram.visibility.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order</label>
                  <p className="mt-1 text-sm text-gray-900">{subProgram.order}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="mt-1 text-sm text-gray-900">{subProgram.duration} weeks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pricing Model</label>
                  <div className="mt-1 flex items-center">
                    {getPricingModelIcon(subProgram.pricingModel)}
                    <span className="ml-2 text-sm text-gray-900">
                      {getPricingModelLabel(subProgram.pricingModel)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Price</label>
                  <p className="mt-1 text-sm text-gray-900">${subProgram.coursePrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per Month</label>
                  <p className="mt-1 text-sm text-gray-900">{subProgram.pricePerMonth != null ? `$${subProgram.pricePerMonth.toFixed(2)}` : "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per Session</label>
                  <p className="mt-1 text-sm text-gray-900">{(subProgram as any).pricePerSession != null ? `$${(subProgram as any).pricePerSession.toFixed(2)}` : "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Payments</label>
                  <p className="mt-1 text-sm text-gray-900">{subProgram.numberOfPayments ?? "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gap between Payments (months)</label>
                  <p className="mt-1 text-sm text-gray-900">{subProgram.gap != null ? subProgram.gap : "-"}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Prerequisites and Learning Objectives sections removed per requirements */}
        </div>

        {/* Right Column - Sharing & Metadata */}
        <div className="space-y-6">
          {/* Sharing with Learning Centers */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shared with Learning Centers</h3>
            {subProgram.sharedWithLCs.length > 0 ? (
              <div className="space-y-2">
                {getLCScopeNames(subProgram.sharedWithLCs).map((scopeName, index) => (
                  <div key={index} className="flex items-center">
                    <Building2 className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-900">{scopeName}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <EyeOff className="h-4 w-4 mr-2" />
                <span className="text-sm">Not shared with any learning centers</span>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(subProgram.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(subProgram.updatedAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Created By</label>
                <p className="mt-1 text-sm text-gray-900">User ID: {subProgram.createdBy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
