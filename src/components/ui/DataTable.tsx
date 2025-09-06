"use client";

import React, { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Settings,
  ArrowUpDown,
} from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  hidden?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  bulkActions?: boolean;
  rowActions?: boolean;
  onRowAction?: (action: string, row: T) => void;
  onBulkAction?: (action: string, rows: T[]) => void;
  onExport?: (rows: T[]) => void;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  bulkActions = true,
  rowActions = true,
  onRowAction,
  onBulkAction,
  onExport,
  className,
  loading = false,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter(col => !col.hidden).map(col => col.key as string))
  );
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter visible columns
  const visibleColumnsData = useMemo(() => {
    return columns.filter(col => visibleColumns.has(col.key as string));
  }, [columns, visibleColumns]);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm && searchable) {
      const searchableColumns = columns.filter(col => col.searchable !== false);
      result = result.filter(row =>
        searchableColumns.some(col => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    if (filterable) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          result = result.filter(row => {
            const rowValue = row[key];
            return rowValue?.toString().toLowerCase().includes(value.toLowerCase());
          });
        }
      });
    }

    return result;
  }, [data, searchTerm, filters, columns, searchable, filterable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig || !sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, sortable]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const totalItems = sortedData.length;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Handlers
  const handleSort = useCallback((key: string) => {
    if (!sortable) return;

    setSortConfig(prev => {
      if (prev?.key === key) {
        return prev.direction === "asc"
          ? { key, direction: "desc" }
          : null;
      }
      return { key, direction: "asc" };
    });
  }, [sortable]);

  const handleSelectRow = useCallback((rowId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index.toString())));
    }
  }, [selectedRows.size, paginatedData.length]);

  const handleBulkAction = useCallback((action: string) => {
    const selectedData = paginatedData.filter((_, index) =>
      selectedRows.has(index.toString())
    );
    onBulkAction?.(action, selectedData);
    setSelectedRows(new Set());
  }, [onBulkAction, paginatedData, selectedRows]);

  const handleExport = useCallback(() => {
    const dataToExport = selectedRows.size > 0
      ? paginatedData.filter((_, index) => selectedRows.has(index.toString()))
      : sortedData;
    onExport?.(dataToExport);
  }, [selectedRows, paginatedData, sortedData, onExport]);

  const toggleColumn = useCallback((columnKey: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {filterable && (
            <div className="flex gap-2">
              {columns
                .filter(col => col.filterable !== false)
                .slice(0, 3)
                .map(col => (
                  <input
                    key={col.key as string}
                    type="text"
                    placeholder={`Filter ${col.label}...`}
                    value={filters[col.key as string] || ""}
                    onChange={(e) =>
                      setFilters(prev => ({
                        ...prev,
                        [col.key as string]: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Column Toggle */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Columns</span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="p-2 space-y-1">
                {columns.map(col => (
                  <label
                    key={col.key as string}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key as string)}
                      onChange={() => toggleColumn(col.key as string)}
                      className="rounded"
                    />
                    <span className="text-sm">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {bulkActions && selectedRows.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-sm text-blue-700">
            {selectedRows.size} item{selectedRows.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleBulkAction("delete")}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              onClick={() => setSelectedRows(new Set())}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {bulkActions && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
              )}
              {visibleColumnsData.map(col => (
                <th
                  key={col.key as string}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    col.width && `w-${col.width}`
                  )}
                >
                  <button
                    onClick={() => col.sortable !== false && handleSort(col.key as string)}
                    className={cn(
                      "flex items-center gap-1",
                      col.sortable !== false && "hover:text-gray-700"
                    )}
                  >
                    {col.label}
                    {col.sortable !== false && sortable && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </button>
                </th>
              ))}
              {rowActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumnsData.length + (bulkActions ? 1 : 0) + (rowActions ? 1 : 0)
                  }
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    "hover:bg-gray-50",
                    selectedRows.has(index.toString()) && "bg-blue-50"
                  )}
                >
                  {bulkActions && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index.toString())}
                        onChange={() => handleSelectRow(index.toString())}
                        className="rounded"
                      />
                    </td>
                  )}
                  {visibleColumnsData.map(col => (
                    <td key={col.key as string} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]?.toString() || "-"}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onRowAction?.("view", row)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRowAction?.("edit", row)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onRowAction?.("delete", row)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
