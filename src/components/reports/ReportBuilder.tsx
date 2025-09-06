"use client";

import { useState } from "react";
import { ReportBuilderState } from "@/types";
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Eye,
  Filter,
  SortAsc,
  Group,
  BarChart3
} from "lucide-react";

interface ReportBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: any) => void;
}

const entityTypes = [
  { value: "students", label: "Students", icon: "👥" },
  { value: "trainings", label: "Trainings", icon: "🎓" },
  { value: "programs", label: "Programs", icon: "📚" },
  { value: "products", label: "Products", icon: "📦" },
  { value: "teachers", label: "Teachers", icon: "👨‍🏫" },
];

const columnDefinitions = {
  students: [
    { key: "studentName", label: "Student Name", type: "string" as const, filterable: true, sortable: true },
    { key: "studentId", label: "Student ID", type: "string" as const, filterable: true, sortable: true },
    { key: "age", label: "Age", type: "number" as const, filterable: true, sortable: true },
    { key: "country", label: "Country", type: "string" as const, filterable: true, sortable: true },
    { key: "city", label: "City", type: "string" as const, filterable: true, sortable: true },
    { key: "lcName", label: "Learning Center", type: "string" as const, filterable: true, sortable: true },
    { key: "programName", label: "Program", type: "string" as const, filterable: true, sortable: true },
    { key: "status", label: "Status", type: "string" as const, filterable: true, sortable: true },
    { key: "progress", label: "Progress", type: "number" as const, filterable: true, sortable: true },
    { key: "enrollmentDate", label: "Enrollment Date", type: "date" as const, filterable: true, sortable: true },
    { key: "totalPaid", label: "Total Paid", type: "number" as const, filterable: true, sortable: true },
    { key: "teacherName", label: "Teacher", type: "string" as const, filterable: true, sortable: true },
  ],
  trainings: [
    { key: "name", label: "Training Name", type: "string" as const, filterable: true, sortable: true },
    { key: "type", label: "Type", type: "string" as const, filterable: true, sortable: true },
    { key: "status", label: "Status", type: "string" as const, filterable: true, sortable: true },
    { key: "startDate", label: "Start Date", type: "date" as const, filterable: true, sortable: true },
    { key: "endDate", label: "End Date", type: "date" as const, filterable: true, sortable: true },
    { key: "maxParticipants", label: "Max Participants", type: "number" as const, filterable: true, sortable: true },
    { key: "price", label: "Price", type: "number" as const, filterable: true, sortable: true },
    { key: "venue", label: "Venue", type: "string" as const, filterable: true, sortable: true },
  ],
  programs: [
    { key: "name", label: "Program Name", type: "string" as const, filterable: true, sortable: true },
    { key: "hours", label: "Total Hours", type: "number" as const, filterable: true, sortable: true },
    { key: "lessonLength", label: "Lesson Length", type: "number" as const, filterable: true, sortable: true },
    { key: "kind", label: "Kind", type: "string" as const, filterable: true, sortable: true },
    { key: "status", label: "Status", type: "string" as const, filterable: true, sortable: true },
    { key: "createdAt", label: "Created Date", type: "date" as const, filterable: true, sortable: true },
  ],
  products: [
    { key: "name", label: "Product Name", type: "string" as const, filterable: true, sortable: true },
    { key: "code", label: "Product Code", type: "string" as const, filterable: true, sortable: true },
    { key: "price", label: "Price", type: "number" as const, filterable: true, sortable: true },
    { key: "quantity", label: "Quantity", type: "number" as const, filterable: true, sortable: true },
    { key: "status", label: "Status", type: "string" as const, filterable: true, sortable: true },
    { key: "category", label: "Category", type: "string" as const, filterable: true, sortable: true },
  ],
  teachers: [
    { key: "name", label: "Teacher Name", type: "string" as const, filterable: true, sortable: true },
    { key: "email", label: "Email", type: "string" as const, filterable: true, sortable: true },
    { key: "phone", label: "Phone", type: "string" as const, filterable: true, sortable: true },
    { key: "status", label: "Status", type: "string" as const, filterable: true, sortable: true },
    { key: "education", label: "Education", type: "string" as const, filterable: true, sortable: true },
    { key: "experience", label: "Experience", type: "number" as const, filterable: true, sortable: true },
    { key: "specialization", label: "Specialization", type: "string" as const, filterable: true, sortable: true },
    { key: "languages", label: "Languages", type: "string" as const, filterable: true, sortable: true },
  ],
};

export default function ReportBuilder({ isOpen, onClose, onSave }: ReportBuilderProps) {
  const [builderState, setBuilderState] = useState<ReportBuilderState>({
    selectedEntityType: "students",
    availableColumns: columnDefinitions.students,
    selectedColumns: ["studentName", "studentId", "age", "country", "programName", "status"],
    filters: {},
    sorting: {
      column: "studentName",
      direction: "asc",
    },
    grouping: {
      column: "",
      enabled: false,
    },
    aggregation: [],
  });

  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  if (!isOpen) return null;

  const handleEntityTypeChange = (entityType: any) => {
    const newColumns = columnDefinitions[entityType as keyof typeof columnDefinitions];
    setBuilderState(prev => ({
      ...prev,
      selectedEntityType: entityType,
      availableColumns: newColumns,
      selectedColumns: newColumns.slice(0, 6).map(col => col.key), // Select first 6 columns by default
      filters: {},
      sorting: {
        column: newColumns[0]?.key || "",
        direction: "asc",
      },
    }));
  };

  const handleColumnToggle = (columnKey: string) => {
    setBuilderState(prev => ({
      ...prev,
      selectedColumns: prev.selectedColumns.includes(columnKey)
        ? prev.selectedColumns.filter(key => key !== columnKey)
        : [...prev.selectedColumns, columnKey],
    }));
  };

  const handleFilterAdd = (columnKey: string) => {
    setBuilderState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [columnKey]: "",
      },
    }));
  };

  const handleFilterRemove = (columnKey: string) => {
    setBuilderState(prev => {
      const newFilters = { ...prev.filters };
      delete newFilters[columnKey];
      return {
        ...prev,
        filters: newFilters,
      };
    });
  };

  const handleFilterChange = (columnKey: string, value: any) => {
    setBuilderState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [columnKey]: value,
      },
    }));
  };

  const handleSortingChange = (column: string, direction: "asc" | "desc") => {
    setBuilderState(prev => ({
      ...prev,
      sorting: { column, direction },
    }));
  };

  const handleGroupingToggle = () => {
    setBuilderState(prev => ({
      ...prev,
      grouping: {
        ...prev.grouping!,
        enabled: !prev.grouping?.enabled,
      },
    }));
  };

  const handleGroupingColumnChange = (column: string) => {
    setBuilderState(prev => ({
      ...prev,
      grouping: {
        ...prev.grouping!,
        column,
      },
    }));
  };

  const handleAggregationAdd = () => {
    setBuilderState(prev => ({
      ...prev,
      aggregation: [
        ...prev.aggregation!,
        { column: "", function: "sum" as const },
      ],
    }));
  };

  const handleAggregationRemove = (index: number) => {
    setBuilderState(prev => ({
      ...prev,
      aggregation: prev.aggregation!.filter((_, i) => i !== index),
    }));
  };

  const handleAggregationChange = (index: number, field: string, value: any) => {
    setBuilderState(prev => ({
      ...prev,
      aggregation: prev.aggregation!.map((agg, i) => 
        i === index ? { ...agg, [field]: value } : agg
      ),
    }));
  };

  const handleSave = () => {
    if (!reportName.trim()) {
      alert("Please enter a report name");
      return;
    }

    const config = {
      name: reportName,
      description: reportDescription,
      entityType: builderState.selectedEntityType,
      filters: builderState.filters,
      columns: builderState.availableColumns.map(col => ({
        key: col.key,
        label: col.label,
        visible: builderState.selectedColumns.includes(col.key),
        sortable: col.sortable,
        filterable: col.filterable,
      })),
      sorting: builderState.sorting,
      grouping: builderState.grouping,
      aggregation: builderState.aggregation,
    };

    onSave(config);
    onClose();
  };

  const renderFilterInput = (columnKey: string, columnType: string) => {
    const value = builderState.filters[columnKey] || "";

    switch (columnType) {
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFilterChange(columnKey, e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
            placeholder="Enter value"
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(columnKey, e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(columnKey, e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
            placeholder="Enter value"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Report Builder</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Report Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Name *
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter report name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter report description"
                />
              </div>
            </div>

            {/* Entity Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Data Source
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {entityTypes.map((entity) => (
                  <button
                    key={entity.value}
                    onClick={() => handleEntityTypeChange(entity.value)}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      builderState.selectedEntityType === entity.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{entity.icon}</div>
                    <div className="text-sm font-medium">{entity.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Columns
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {builderState.availableColumns.map((column) => (
                  <label key={column.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={builderState.selectedColumns.includes(column.key)}
                      onChange={() => handleColumnToggle(column.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{column.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Filters
                </label>
                <button
                  onClick={() => {
                    const availableFilters = builderState.availableColumns.filter(col => col.filterable);
                    if (availableFilters.length > 0) {
                      handleFilterAdd(availableFilters[0].key);
                    }
                  }}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Filter
                </button>
              </div>
              
              <div className="space-y-3">
                {Object.entries(builderState.filters).map(([columnKey, value]) => {
                  const column = builderState.availableColumns.find(col => col.key === columnKey);
                  if (!column) return null;
                  
                  return (
                    <div key={columnKey} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          {column.label}
                        </div>
                        {renderFilterInput(columnKey, column.type)}
                      </div>
                      <button
                        onClick={() => handleFilterRemove(columnKey)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sorting
              </label>
              <div className="flex items-center gap-3">
                <select
                  value={builderState.sorting.column}
                  onChange={(e) => handleSortingChange(e.target.value, builderState.sorting.direction)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {builderState.availableColumns
                    .filter(col => col.sortable)
                    .map((column) => (
                      <option key={column.key} value={column.key}>
                        {column.label}
                      </option>
                    ))}
                </select>
                <select
                  value={builderState.sorting.direction}
                  onChange={(e) => handleSortingChange(builderState.sorting.column, e.target.value as "asc" | "desc")}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            {/* Grouping */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Grouping
                </label>
                <button
                  onClick={handleGroupingToggle}
                  className={`flex items-center gap-1 text-sm ${
                    builderState.grouping?.enabled
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  <Group className="h-4 w-4" />
                  {builderState.grouping?.enabled ? "Enabled" : "Disabled"}
                </button>
              </div>
              
              {builderState.grouping?.enabled && (
                <select
                  value={builderState.grouping.column}
                  onChange={(e) => handleGroupingColumnChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select grouping column</option>
                  {builderState.availableColumns
                    .filter(col => col.sortable)
                    .map((column) => (
                      <option key={column.key} value={column.key}>
                        {column.label}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {/* Aggregation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Aggregation
                </label>
                <button
                  onClick={handleAggregationAdd}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Aggregation
                </button>
              </div>
              
              <div className="space-y-3">
                {builderState.aggregation?.map((agg, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <select
                      value={agg.column}
                      onChange={(e) => handleAggregationChange(index, "column", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select column</option>
                      {builderState.availableColumns
                        .filter(col => col.type === "number")
                        .map((column) => (
                          <option key={column.key} value={column.key}>
                            {column.label}
                          </option>
                        ))}
                    </select>
                    <select
                      value={agg.function}
                      onChange={(e) => handleAggregationChange(index, "function", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="sum">Sum</option>
                      <option value="count">Count</option>
                      <option value="avg">Average</option>
                      <option value="min">Minimum</option>
                      <option value="max">Maximum</option>
                    </select>
                    <button
                      onClick={() => handleAggregationRemove(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Report
          </button>
        </div>
      </div>
    </div>
  );
}
