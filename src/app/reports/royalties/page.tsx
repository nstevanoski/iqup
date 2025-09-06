import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function RoyaltyReportsPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Royalty Reports</h1>
          <p className="text-gray-600">View and analyze royalty payment reports</p>
        </div>
        
        <PlaceholderCard 
          title="Royalty Reports"
          description="Generate and view royalty payment reports and analytics"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
