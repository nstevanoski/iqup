import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your system</p>
          </div>
          
          <PlaceholderCard 
            title="Dashboard Overview"
            description="Key metrics and insights will be displayed here"
          />
        </div>
      </DashboardLayout>
    </AuthWrapper>
  );
}
