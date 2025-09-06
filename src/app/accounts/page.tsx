import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlaceholderCard } from "@/components/ui/PlaceholderCard";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function AccountsPage() {
  return (
    <AuthWrapper>
      <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600">Manage account information and settings</p>
        </div>
        
        <PlaceholderCard 
          title="Account Management"
          description="View and manage account information, settings, and configurations"
        />
      </div>
    </DashboardLayout>
    </AuthWrapper>
  );
}
