import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage orders and transactions</p>
        </div>
        
        <PlaceholderCard
          title="Order Management"
          description="View, process, and manage customer orders"
        />
      </div>
    </DashboardLayout>
  );
}
