import { Product, Order, LearningGroup } from "@/types";

/**
 * Inventory management utilities for automatic stock reduction
 */

export interface InventoryReduction {
  productId: string;
  quantity: number;
  reason: "student_assignment" | "order_fulfillment" | "manual_adjustment";
  referenceId: string; // student ID, order ID, or manual adjustment ID
  timestamp: Date;
  notes?: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  type: "in" | "out";
  quantity: number;
  reason: string;
  referenceId: string;
  timestamp: Date;
  notes?: string;
}

/**
 * Calculate inventory reduction when assigning products to students in learning groups
 */
export function calculateStudentProductAssignment(
  learningGroup: LearningGroup,
  studentId: string,
  productId: string,
  quantity: number = 1
): InventoryReduction {
  return {
    productId,
    quantity,
    reason: "student_assignment",
    referenceId: studentId,
    timestamp: new Date(),
    notes: `Product assigned to student in learning group: ${learningGroup.name}`,
  };
}

/**
 * Calculate inventory reduction when fulfilling orders
 */
export function calculateOrderFulfillment(
  order: Order,
  productId: string,
  quantity: number
): InventoryReduction {
  return {
    productId,
    quantity,
    reason: "order_fulfillment",
    referenceId: order.id,
    timestamp: new Date(),
    notes: `Order fulfillment: ${order.orderNumber}`,
  };
}

/**
 * Apply inventory reduction to product stock
 */
export function applyInventoryReduction(
  product: Product,
  reduction: InventoryReduction
): Product {
  const newQuantity = Math.max(0, product.qty - reduction.quantity);
  
  return {
    ...product,
    qty: newQuantity,
    updatedAt: new Date(),
  };
}

/**
 * Check if product has sufficient stock for reduction
 */
export function hasSufficientStock(
  product: Product,
  requiredQuantity: number
): boolean {
  return product.qty >= requiredQuantity;
}

/**
 * Get stock status for a product
 */
export function getStockStatus(product: Product): {
  status: "in_stock" | "low_stock" | "out_of_stock";
  message: string;
  color: "green" | "yellow" | "red";
} {
  if (product.qty <= 0) {
    return {
      status: "out_of_stock",
      message: "Out of Stock",
      color: "red",
    };
  } else if (product.qty <= product.minStock) {
    return {
      status: "low_stock",
      message: `Low Stock (${product.qty} remaining)`,
      color: "yellow",
    };
  } else {
    return {
      status: "in_stock",
      message: `In Stock (${product.qty} available)`,
      color: "green",
    };
  }
}

/**
 * Process bulk inventory reductions for multiple products
 */
export function processBulkInventoryReduction(
  products: Product[],
  reductions: InventoryReduction[]
): {
  updatedProducts: Product[];
  failedReductions: InventoryReduction[];
  warnings: string[];
} {
  const updatedProducts: Product[] = [];
  const failedReductions: InventoryReduction[] = [];
  const warnings: string[] = [];

  // Create a map of products for quick lookup
  const productMap = new Map(products.map(p => [p.id, p]));

  // Group reductions by product ID
  const reductionMap = new Map<string, InventoryReduction[]>();
  reductions.forEach(reduction => {
    if (!reductionMap.has(reduction.productId)) {
      reductionMap.set(reduction.productId, []);
    }
    reductionMap.get(reduction.productId)!.push(reduction);
  });

  // Process each product
  for (const [productId, productReductions] of reductionMap) {
    const product = productMap.get(productId);
    if (!product) {
      failedReductions.push(...productReductions);
      warnings.push(`Product ${productId} not found`);
      continue;
    }

    // Calculate total reduction for this product
    const totalReduction = productReductions.reduce((sum, r) => sum + r.quantity, 0);

    // Check if sufficient stock is available
    if (!hasSufficientStock(product, totalReduction)) {
      failedReductions.push(...productReductions);
      warnings.push(`Insufficient stock for ${product.name}. Required: ${totalReduction}, Available: ${product.qty}`);
      continue;
    }

    // Apply the reduction
    const updatedProduct = applyInventoryReduction(product, {
      productId,
      quantity: totalReduction,
      reason: "student_assignment",
      referenceId: "bulk_operation",
      timestamp: new Date(),
      notes: `Bulk reduction: ${productReductions.length} operations`,
    });

    updatedProducts.push(updatedProduct);
  }

  // Add products that weren't modified
  products.forEach(product => {
    if (!updatedProducts.find(p => p.id === product.id)) {
      updatedProducts.push(product);
    }
  });

  return {
    updatedProducts,
    failedReductions,
    warnings,
  };
}

/**
 * Generate inventory transaction history
 */
export function generateInventoryTransaction(
  product: Product,
  reduction: InventoryReduction
): InventoryTransaction {
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    productId: product.id,
    type: "out",
    quantity: reduction.quantity,
    reason: reduction.reason,
    referenceId: reduction.referenceId,
    timestamp: reduction.timestamp,
    notes: reduction.notes,
  };
}

/**
 * Validate inventory operations before execution
 */
export function validateInventoryOperation(
  products: Product[],
  reductions: InventoryReduction[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if all products exist
  const productIds = new Set(products.map(p => p.id));
  const missingProducts = reductions
    .map(r => r.productId)
    .filter(id => !productIds.has(id));

  if (missingProducts.length > 0) {
    errors.push(`Products not found: ${missingProducts.join(", ")}`);
  }

  // Check stock availability
  const productMap = new Map(products.map(p => [p.id, p]));
  const reductionMap = new Map<string, number>();

  reductions.forEach(reduction => {
    const current = reductionMap.get(reduction.productId) || 0;
    reductionMap.set(reduction.productId, current + reduction.quantity);
  });

  for (const [productId, totalReduction] of reductionMap) {
    const product = productMap.get(productId);
    if (product) {
      if (product.qty < totalReduction) {
        errors.push(`Insufficient stock for ${product.name}. Required: ${totalReduction}, Available: ${product.qty}`);
      } else if (product.qty - totalReduction <= product.minStock) {
        warnings.push(`${product.name} will be at or below minimum stock level after this operation`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get inventory summary for dashboard
 */
export function getInventorySummary(products: Product[]): {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
} {
  const inStock = products.filter(p => p.qty > p.minStock).length;
  const lowStock = products.filter(p => p.qty <= p.minStock && p.qty > 0).length;
  const outOfStock = products.filter(p => p.qty <= 0).length;
  
  const totalValue = products.reduce((sum, p) => sum + (p.qty * p.cost), 0);
  
  const lowStockProducts = products.filter(p => p.qty <= p.minStock && p.qty > 0);
  const outOfStockProducts = products.filter(p => p.qty <= 0);

  return {
    totalProducts: products.length,
    inStock,
    lowStock,
    outOfStock,
    totalValue,
    lowStockProducts,
    outOfStockProducts,
  };
}
