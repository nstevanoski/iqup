import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function OrdersPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage orders and transactions</p>
        </div>
        
        <PlaceholderCard 
          title="Order Management"
          description="View, process, and manage orders and transactions"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
