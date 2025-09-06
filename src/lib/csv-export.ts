/**
 * Utility functions for CSV export functionality
 */

export interface CSVExportOptions {
  filename?: string;
  headers?: string[];
  delimiter?: string;
}

/**
 * Convert data to CSV format
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T | string; label: string }>,
  options: CSVExportOptions = {}
): string {
  const { delimiter = "," } = options;
  
  if (data.length === 0) {
    return "";
  }

  // Create headers
  const headers = options.headers || columns.map(col => col.label);
  const csvHeaders = headers.join(delimiter);

  // Create rows
  const csvRows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      // Handle values that might contain commas, quotes, or newlines
      if (value === null || value === undefined) {
        return "";
      }
      
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains delimiter, quote, or newline
      if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(delimiter);
  });

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T | string; label: string }>,
  options: CSVExportOptions = {}
): void {
  const { filename = "export.csv" } = options;
  
  const csvContent = convertToCSV(data, columns, options);
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix: string = "export", extension: string = "csv"): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Format data for export (handle dates, objects, etc.)
 */
export function formatValueForExport(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  
  if (typeof value === "object") {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]; // YYYY-MM-DD format
    }
    
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    
    // For objects, try to extract meaningful data
    if (value.name) return value.name;
    if (value.title) return value.title;
    if (value.email) return value.email;
    
    return JSON.stringify(value);
  }
  
  return String(value);
}
